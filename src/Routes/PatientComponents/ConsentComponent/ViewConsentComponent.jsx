import React, { Component } from 'react'
import ProblemService from '../../../services/ProblemService'
//import Moment from 'react-moment';
import PatientDetail from '../../BasicComponent/PatientDetail';
import ProblemDetail from '../../BasicComponent/ProblemDetail';
import "@material/react-checkbox/dist/checkbox.css";
import AlertifyService from '../../../services/AlertifyService';
import ReceipesComponent from "../ReceipeComponent/ReceipesComponent";




export default class ViewConsentComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            problemid: props.match.params.problemid,
            patient: {},
            receipes: [],
            problemDetail: null,
            problemName: null,
            problemStatus: null,
            pid: null,
            creationDate: null,
            errorMessage: ""
        }
        // this.loadProblemDetail();
        this.loadProblemDetail = this.loadProblemDetail.bind(this);
    }
    componentDidMount() {
        this.loadProblemDetail();
    }

    loadProblemDetail() {
        ProblemService.getProblem(this.state.problemid).then(res => {
            let p = res.data;
            this.setState({
                patient:p.patient,
                problemDetail:p.problemDetail,
                problemName:p.problemName,
                problemStatus:p.problemStatus,
                creationDate:p.creationDate,
                pid:p.pid,
            });
        }).catch((error) => {
            // Error
            if (error.response) {
                this.setState({ errorMessage: error.response.data.message, problemid: null });
                AlertifyService.alert(error.response.data.message);
                
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log(error.message);
            }
        });
    }
    viewPatient(id) {
        window.localStorage.setItem("patientID", id);
        this.props.history.push('/view-patient/' + id);
    }
    openReceipeForm(id, problemid) {
        window.localStorage.setItem("patientID", id);
        window.localStorage.setItem("consentID", problemid);
        this.props.history.push('/receipe-form');
    }

    openDataRequestForm(id, consentId) {
        window.localStorage.setItem("patientID", id);
        window.localStorage.setItem("consentID", consentId);
        this.props.history.push('/request-data');
    }

    render() {

        return (
            <div className="row">
                <div className="col-sm-12">
                    <h1>Consent Details</h1>
                    <hr />
                </div>
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-12">
                            <button
                                className="btn btn-danger"
                                onClick={() => this.viewPatient(this.state.patient.id)}>
                                Back </button>
                            <button
                                className="btn btn-warning ml-1"
                                disabled={this.state.problemStatus == "WAITING"}
                                onClick={() => this.openDataRequestForm(this.state.patient.id, this.state.problemid)} >
                                Request Data </button>
                            <hr />
                        </div>
                        <div className="col-lg-6">
                            <PatientDetail
                                name={this.state.patient.name}
                                lastname={this.state.patient.lastname}
                                email={this.state.patient.email}
                                city={this.state.patient.city}
                                bornDate={this.state.patient.bornDate}
                                gender={this.state.patient.gender}
                                id={this.state.patient.id}
                            />
                        </div>
                        <div className="col-lg-6">
                            <ProblemDetail
                                problemid={this.state.problemid}
                                problemName={this.state.problemName}
                                problemDetail={this.state.problemDetail}
                                problemStatus={this.state.problemStatus}
                                creationDate={this.state.creationDate}
                                id={this.state.patient.id}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <ReceipesComponent  problemid={this.state.problemid} />
                </div>
            </div>
        )
    }
}
