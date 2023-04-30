import React, { Component } from 'react'
import Moment from 'react-moment';
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.css";
import "@material/react-checkbox/dist/checkbox.css";
import ProblemService from '../../../services/ProblemService';
import PatientService from '../../../services/PatientService';
import AlertifyService from '../../../services/AlertifyService';
import { withRouter } from 'react-router'; 
import ProblemDetailModal from '../../BasicComponent/ProblemDetailModal';
import DoctorService from '../../../services/DoctorService';

let filterAllProblem = [];
let filters = ["problemName", "problemStatus"];
class RecievedProblemsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            problems: [],
            problem:{}

        }
        this.getAllProblems = this.getAllProblems.bind(this);
    }
    componentDidMount() {
        this.getAllProblems();
    }
    getAllProblems() {
        PatientService.getRecievedPatientRecordsById(this.state.id).then(res => {
            let problems = res.data.patientData;
            DoctorService.getDoctors(window.localStorage.getItem("token")).then((res) => {
                let doctors = res.data.doctors;
                problems.forEach(problem => {
                    doctors.forEach(doctor => {
                        if (problem.doctorID === doctor.id) problem.doctorName = doctor.firstName + " " + doctor.lastName;
                    });
                    this.setState({ problems: problems});
                });
            });
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/patients');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    }
    onChangeSearchByStatusOrDate = (e) => { this.filterProblems(e.target.value); }
    filterProblems(value) {
        var results = [];
        if (value !== '') {
            results = filterAllProblem.filter(problem => {
                let find = false;
                //filters.forEach(filter=>{
                filters.forEach(function (filter) {
                    let control = problem[filter].toLowerCase().indexOf(value.toLowerCase());
                    if (control > -1) find = true;
                });
                return find;
            });
            this.setState({ problems: results });
        }
        else { this.loadPatient(); }
    }
    limitingPatientDetail(data) {
        if (data.length < 31) return data;
        else return data.substr(0, 30) + "...";
    }
    deleteProblem(problemid) {
        alertify.confirm("Are you sure to delete the problem.",
            ok => {
                ProblemService.delete(problemid).then(res => {
                    //this.setState({ problems: this.state.problems.filter(p => p.problemid !== problemid) });
                    AlertifyService.successMessage('Deleting is ok : ');
                    this.getAllProblems();
                });
            },
            cancel => { AlertifyService.errorMessage('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    viewProblem(problemid) {
        window.localStorage.setItem("problemID", problemid);
        window.localStorage.setItem("patientID", this.state.id);
        this.props.history.push('/recieved-record/' + problemid);
    }
    viewQuickly(problem){
        this.setState({problem:problem});
    }
    render() {
        let problems = this.state.problems;
        return (
          <div className="row">
            <div className="col-lg-12">
              <hr />
              <p className="h3 d-flex justify-content-center">
                Recieved Records
              </p>
              <hr />
              {/* <div className="form-group">
                    <input type="text"
                        placeholder="Search Problem by problem Name or problem Status"
                        name="searchByName"
                        className="form-control"
                        onChange={this.onChangeSearchByStatusOrDate}
                    />
                </div>
                <hr /> */}
              <div className="table-responsive">
                <table className="table table-bordered table-sm table-dark table-hover">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Txn ID</th>
                      <th>Doctor Name</th>
                      <th>Visit Type</th>
                      <th>Department</th>
                      <th>Creation Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((problem) => (
                      <tr className="bg-default" key={problem.recordID}>
                        <td>{problem.requestID}</td>
                        <td>{problem.txnID}</td>
                        <td>{problem.doctorName}</td>
                        <td>{problem.hiType}</td>
                        <td>{problem.department}</td>
                        <td>
                          <Moment format="YYYY/MM/DD HH:mm">
                            {Date(problem.timeStamp)}
                          </Moment>
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => this.viewProblem(problem.recordID)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ProblemDetailModal problem={this.state.problem} />
                <hr />
                <hr />
                <hr />
              </div>
            </div>
          </div>
        );
    }
}
export default withRouter(RecievedProblemsComponent);