import React, { Component } from 'react'
import PatientService from '../../../services/PatientService'
import DoctorService from '../../../services/DoctorService'
//import Moment from 'react-moment';
import PatientDetail from '../../BasicComponent/PatientDetail';
import ConsentDetail from '../../BasicComponent/ConsentDetail';
import "@material/react-checkbox/dist/checkbox.css";
import AlertifyService from '../../../services/AlertifyService';
import ReceipesComponent from "../ReceipeComponent/ReceipesComponent";




export default class ViewConsentComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: window.localStorage.getItem("patientID"),
            consentid: props.match.params.consentid || window.localStorage.getItem("consentID"),
            patient: {},

            consentObject: {},

            transaction: {},
            consentStatus: ""
        }
        this.loadPatient = this.loadPatient.bind(this);
        this.loadConsentObject = this.loadConsentObject.bind(this);
        this.loadConsentTransaction = this.loadConsentTransaction.bind(this);
    }
    componentDidMount() {
        this.loadPatient();
        this.loadConsentObject();
        this.loadConsentTransaction();
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
    loadConsentObject() {
        DoctorService.getConsentObjectByConsentID(this.state.consentid, window.localStorage.getItem("token")).then(res => {
            this.setState({ consentObject: res.data });
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/patients');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);    
        });
    }
    loadConsentTransaction() { 
        DoctorService.getConsentTransacationByConsentID(this.state.consentid, window.localStorage.getItem("token")).then(res => {
            this.setState({ transaction: res.data });
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
    openDataRequestForm(){
        window.localStorage.setItem("")
        this.props.history.push('/request-data');
    }

    createDataRequest(){
        let data = {
            txnID: this.state.transaction.txnID,
            ehrbID: this.state.consentObject.patient_ehrb_id,
            hipID: this.state.consentObject.hip_id,
            doctorID: this.state.consentObject.doctor_ehrb_id,
            request_details: {
                department: this.state.consentObject.departments,
                hiType: this.state.consentObject.hi_type,
                dateFrom: this.state.consentObject.date_from,
                dateTo: this.state.consentObject.date_to,
            },
            request_message: "message"
        }
        DoctorService.createDataRequest(data, window.localStorage.getItem("token")).then(res => {
            AlertifyService.alert("Data Request Created Successfully");
            this.props.history.push('/patients');
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/patients');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    }
    openReceipeForm(id, consentid) {
        window.localStorage.setItem("patientID", id);
        window.localStorage.setItem("consentID", consentid);
        this.props.history.push('/receipe-form');
    }
    render() {
        let {patient} = this.state;
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
                            <hr />
                            <button
                                className="btn btn-danger"
                                disabled={this.state.transaction.consent_status === "PENDING"  ? true : false}
                                onClick={() => this.createDataRequest(this.state.patient.id)}>
                                Create Data Request </button>
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
                            <ConsentDetail
                                id={this.state.consentObject.consent_object_id}
                                ehrbID={this.state.consentObject.patient_ehrb_id}
                                doctorID={this.state.consentObject.doctor_ehrb_id}
                                hiuID={this.state.consentObject.hiu_id}
                                hipID={this.state.consentObject.hip_id}
                                hiType={this.state.consentObject.hi_type}
                                departments={this.state.consentObject.departments}
                                fromDate = {this.state.consentObject.date_from}
                                toDate = {this.state.consentObject.date_to}
                                validityTill = {this.state.consentObject.valdity} 
                                consentStatus={this.state.transaction.consent_status}
                                showButtons={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
