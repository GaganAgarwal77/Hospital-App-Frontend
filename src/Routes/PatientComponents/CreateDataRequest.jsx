
import React, { Component } from 'react'
import ProblemService from '../../services/ProblemService';
import DoctorService from '../../services/DoctorService';
import { ErrorMessage, Field, Form, Formik } from "formik";
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import AlertifyService from '../../services/AlertifyService';
import PatientService from '../../services/PatientService';
//import Select from 'react-select';

var statuses = [];
export default class CreateDataRequest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: window.localStorage.getItem("patientID"),
            consentid: window.localStorage.getItem("consentID"),
            patient: {},

            consentObject: {},

            transaction: {},

            hiType: "",
            departments:"",
            message: "",

            dateFrom: new Date(),
            dateTo: new Date(),
        }
        this.loadPatient = this.loadPatient.bind(this);
        this.loadConsentObject = this.loadConsentObject.bind(this);
        this.loadConsentTransaction = this.loadConsentTransaction.bind(this);
        this.createDataRequest = this.createDataRequest.bind(this);
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
            let data = res.data;
            this.setState({ consentObject: data, hiType: data.hi_type, departments: data.departments ,dateFrom: new Date(data.date_from), dateTo: new Date(data.date_to) });

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
    validate(values) {
        let errors = {};
        if (!values.hiType) {
            errors.hiType = 'Enter hiType';
        } else if (values.hiType.length < 3) {
            errors.hiType = 'Enter at least 3 Characters in hiType';
        }
        if (!values.departments) {
            errors.departments = 'Enter departments';
        } else if (values.departments.length < 3) {
            errors.departments = 'Enter at least 3 Characters in departments';
        }
        return errors;
    }
    modifyAndAccept = () => {
        let data = this.state.consentObject;
        data.consent_status = "ACCEPTED";
        data.hiType = this.state.hiType.split(",");
        data.departments = this.state.departments.split(",");
        data.date_from = this.state.dateFrom.toISOString();
        data.date_to = this.state.dateTo.toISOString();
        data.consent_validity = this.state.valdityTill.toISOString();
        console.log(data)
        PatientService.updateConsentRequest(data, window.localStorage.getItem("token")).then(res => {
            AlertifyService.alert("Consent Request Accepted");
            this.props.history.push('/recieved-consent-requests');
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    }
    createDataRequest(){
        let data = {
            txnID: this.state.transaction.txnID,
            ehrbID: this.state.consentObject.patient_ehrb_id,
            hipID: this.state.consentObject.hip_id,
            doctorID: this.state.consentObject.doctor_ehrb_id,
            // request_details: {
            departments: this.state.departments.split(","),
            hiType: this.state.hiType.split(","),
            dateFrom: this.state.dateFrom.getTime(),
            dateTo: this.state.dateTo.getTime(),
            // },
            request_msg: this.state.message
        }
        console.log(data)
        DoctorService.createDataRequest(data, window.localStorage.getItem("token")).then(res => {
            AlertifyService.alert("Data Request Created Successfully");
            this.props.history.push('/sent-data-requests');
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/patients');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    }
    onChangeData(type, e) {
        const addproblem = this.state;
        addproblem[type] = e;
        this.setState({ addproblem });
    }
    render() {
        {console.log(this.state)}
        let { hiType, departments, message, creationDate, dateFrom, dateTo } = this.state;
        const isWeekday = date => {
            const day = date.getDay(date);
            return day !== 0 && day !== 6;
        };
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h5>Create Data Request</h5>
                    <hr />
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => this.props.history.push("/consent/"+this.state.consentid)} >  Back </button>
                    <hr />
                    <Formik
                        onSubmit={this.createDataRequest}
                        validate={this.validate}
                        initialValues={{ hiType, departments, creationDate }}
                        enableReinitialize={true} >
                        <Form>
                        <fieldset className="form-group">
                                <label>hiType:</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="hiType"
                                    value={hiType}
                                    onChange={e => this.onChangeData('hiType', e.target.value)} />
                                <ErrorMessage name="hiType" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>departments:</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="departments"
                                    value={departments}
                                    onChange={e => this.onChangeData('departments', e.target.value)} />
                                <ErrorMessage name="departments" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Request Message:</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="message"
                                    value={message}
                                    onChange={e => this.onChangeData('message', e.target.value)} />
                                <ErrorMessage name="message" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                                <div className='d-flex'>
                            <fieldset className="form-group">
                                <label >Date From: </label>
                                <ReactDatePicker
                                    className="form-control"
                                    // showTimeSelect
                                    showTimeInput
                                    selected={dateFrom}
                                    onChange={e => this.onChangeData('dateFrom', e)}
                                    timeIntervals={15}              // time range around 15 min
                                    //showWeekNumbers               // show week number
                                    timeFormat="HH:mm"              // show time format
                                    dateFormat="yyyy/MM/dd h:mm aa" // show all of time format
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <label >Date To: </label>
                                <ReactDatePicker
                                    className="form-control"
                                    // showTimeSelect
                                    showTimeInput
                                    selected={dateTo}
                                    onChange={e => this.onChangeData('dateTo', e)}
                                    timeIntervals={15}              // time range around 15 min
                                    //showWeekNumbers               // show week number
                                    timeFormat="HH:mm"              // show time format
                                    dateFormat="yyyy/MM/dd h:mm aa" // show all of time format
                                />
                            </fieldset>

                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => this.props.history.push("/consent/"+this.state.consentid)}  
                                    data-dismiss="modal">Close</button>
                                <div className="dropdown-divider"></div>
                                <button className="btn btn-success" type="submit">Save</button>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </div>
        )
    }
}
