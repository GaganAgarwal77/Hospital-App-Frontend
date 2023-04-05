import React, { Component } from 'react'
import ProblemService from '../../../services/ProblemService'
import PatientService from '../../../services/PatientService'
//import Moment from 'react-moment';
import PatientDetail from '../../BasicComponent/PatientDetail';
import ProblemDetail from '../../BasicComponent/ProblemDetail';
import "@material/react-checkbox/dist/checkbox.css";
import AlertifyService from '../../../services/AlertifyService';
import ReceipesComponent from "../ReceipeComponent/ReceipesComponent";




export default class ViewProblemComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: window.localStorage.getItem("patientID"),
            problemid: props.match.params.recordid,
            patient: {},
            record: {},
            receipes: [],
            problemDetail: null,
            problemName: null,
            problemStatus: null,
            pid: null,
            creationDate: null,
            errorMessage: ""
        }
        this.loadRecordDetail = this.loadRecordDetail.bind(this);
        this.loadPatient = this.loadPatient.bind(this);
    }
    componentDidMount() {
        this.loadRecordDetail();
        this.loadPatient();
    }
    loadPatient() {
        PatientService.getPatientById(this.state.id).then(res => {
            let p = res.data;
            this.setState({ patient: p });
            this.setState({
                id: p.id,
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
    loadRecordDetail(){
        PatientService.getRecordById(this.state.problemid).then(res => {
            let p = res.data;
            this.setState({ record: p });
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/patients');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    }
    viewPatient(id) {
        window.localStorage.setItem("patientID", id);
        this.props.history.push('/view-patient/' + id);
    }
    openReceipeForm(id, problemid) {
        window.localStorage.setItem("patientID", id);
        window.localStorage.setItem("problemID", problemid);
        this.props.history.push('/receipe-form');
    }
    render() {
        let {patient} = this.state;
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h1>Problem Details</h1>
                    <hr />
                </div>
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-12">
                            <button
                                className="btn btn-danger"
                                onClick={() => this.viewPatient(this.state.patient.id)}>
                                Back </button>
                            <hr />
                        </div>
                        <div className="col-lg-6">
                        <PatientDetail
                            id={patient.id}
                            name={patient.firstName}
                            lastname={patient.lastName}
                            phoneNo={patient.phoneString}
                            email={patient.emailAddress}
                            city={patient.address}
                            bornDate={Date("2000-03-25")}
                            gender={patient.gender}
                            showButtons={true}
                            // array={['id','name','lastname','email','city','bornDate','gender']}
                        />
                        </div>


                        <div className="col-lg-6">
                            <ProblemDetail
                                recordID={this.state.record.recordID}
                                patientID={this.state.record.patientID}
                                doctorID={this.state.record.doctorID}
                                department={this.state.record.department}
                                hiType={this.state.record.hiType}
                                height={this.state.record.height}
                                weight={this.state.record.weight}
                                bp={this.state.record.bp}
                                heartRate={this.state.record.heartRate}
                                problems={this.state.record.problems}
                                diagnosis={this.state.record.diagnosis}
                                prescription={this.state.record.prescription}
                                creationDate={this.state.record.timeStamp}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
