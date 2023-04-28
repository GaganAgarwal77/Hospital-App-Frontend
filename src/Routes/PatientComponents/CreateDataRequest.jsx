
import React, { Component } from 'react'
import ProblemService from '../../services/ProblemService';
import DoctorService from '../../services/DoctorService';
import { ErrorMessage, Field, Form, Formik } from "formik";
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import AlertifyService from '../../services/AlertifyService';
//import Select from 'react-select';

var statuses = [];
export default class CreateDataRequest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            patientid: window.localStorage.getItem("patientID") || '',
            consentId: window.localStorage.getItem("consentID") || '',
            problemName: '',
            problemDetail: '',
            creationDate: new Date(),
            problemStatus: 'AYAKTA',
            pid: props.match.params.id,

            status: 1,
            problemStatuses: [],
            errorMessage: "",
            selectedOption: null,
            options: [],

            doctors: [],
            doctorid: window.localStorage.getItem("doctorID") ||  '',
            doctor: null,

            hospitals: [],
            hiuId: '',
            hiu: null,
            hipId: '',
            hip: null,

            message: "",
        }
        this.loadStatus = this.loadStatus.bind(this);
        this.getAllDoctors()
    }
    componentDidMount() {
        this.loadStatus();
    }
    loadStatus() {
        statuses = [];
        ProblemService.getProblemStatus().then(res => {
            this.setState({ problemStatuses: res.data });
            for (var i = 0; i < this.state.problemStatuses.length; i++) {
                statuses.push({ value: this.state.problemStatuses[i], label: this.state.problemStatuses[i] })
            }
        });
    }
    getAllDoctors() {
        DoctorService.getDoctors(window.localStorage.getItem("token")).then(res => {
            this.setState({ doctors: res.data });
        });
    }

    getAllHospitals() {
        DoctorService.getHospitals(window.localStorage.getItem("token")).then(res => {
            this.setState({ hospitals: res.data });
        });
    }

    viewPatient(id) {
        window.localStorage.setItem("patientID", id);
        this.props.history.push('/view-patient/' + id);
    }
    viewDoctor(id) {
        window.localStorage.setItem("doctorID", id);
        this.props.history.push('/view-doctor/' + id);
    }
    viewConsent(consentid) {
        window.localStorage.setItem("consentID", consentid);
        this.props.history.push('/view-consent/' + consentid);
    }
    validate(values) {
        let errors = {};
        if (!values.problemName)
            errors.problemName = 'Enter a Problem Name!';
        else if (values.problemName.length < 5)
            errors.problemName = 'Enter at least 5 characters into Problem Name!';

        if (!values.problemDetail)
            errors.problemDetail = 'Enter a Problem Detail!';
        else if (values.problemDetail.length < 5)
            errors.problemDetail = 'Enter at least 5 characters into Problem Detail!';
        return errors;
    }
    addProblem = () => {
        if (this.state.problemName === '' || this.state.problemDetail === '') {
            AlertifyService.alert("Fill in the blanks");
        } else {
            if (this.state.patientid != null) { 
                let newProblem = this.state;
                newProblem['status'] = 1;
                newProblem['pid'] = this.state.patientid;
                ProblemService.add(newProblem).then(res => {
                    // let data = res.data;
                    this.setState({ 
                            problemName: '',
                            problemDetail: '',
                            problemStatus: 'AYAKTA',
                            creationDate: new Date() 
                    });
                    AlertifyService.successMessage("Saving problem for related patient is ok.. ");
                    this.viewPatient(this.state.patientid);
                });
            } else {
                AlertifyService.alert("There is no patient..");
            }
        }
    }
    onChangeData(type, e) {
        const addproblem = this.state;
        addproblem[type] = e;
        this.setState({ addproblem });
    }
    render() {
        let { message, creationDate } = this.state;
        const { selectedOption } = this.state.options;
        const isWeekday = date => {
            const day = date.getDay(date);
            return day !== 0 && day !== 6;
        };
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h5>Data Request Form</h5>
                    <hr />
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => this.viewConsent(this.state.consentId)} >  Back </button>
                    <hr />
                    <Formik
                        onSubmit={this.addProblem}
                        validate={this.validate}
                        initialValues={{ message, creationDate }}
                        enableReinitialize={true} >
                        <Form>

                        <fieldset className="form-group">
                            <label>HIU *</label>
                            <select className="form-control"
                                value={this.state.hiuId}
                                onChange={e => this.onChangeData('hiu', e.target.value)} >
                                {this.state.hospitals.map(hiu =>
                                    <option key={hiu} value={hiu}>{hiu}</option>
                                )}
                            </select>
                        </fieldset>
                        <fieldset className="form-group">
                            <label>HIP *</label>
                            <select className="form-control"
                                value={this.state.hipId}
                                onChange={e => this.onChangeData('hip', e.target.value)} >
                                {this.state.hospitals.map(hip =>
                                    <option key={hip} value={hip}>{hip}</option>
                                )}
                            </select>
                        </fieldset>
                        <fieldset className="form-group">
                                <label>message:</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="message"
                                    value={message}
                                    onChange={e => this.onChangeData('message', e.target.value)} />
                                <ErrorMessage name="message" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label >Date : </label>
                                <ReactDatePicker
                                    className="form-control"
                                    // showTimeSelect
                                    showTimeInput
                                    selected={creationDate}
                                    onChange={e => this.onChangeData('creationDate', e)}
                                    filterDate={isWeekday}          // disable weekend
                                    timeIntervals={15}              // time range around 15 min
                                    //showWeekNumbers               // show week number
                                    timeFormat="HH:mm"              // show time format
                                    dateFormat="yyyy/MM/dd h:mm aa" // show all of time format
                                />
                            </fieldset>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    onClick={() => this.viewPatient(this.state.patientid)}  
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
