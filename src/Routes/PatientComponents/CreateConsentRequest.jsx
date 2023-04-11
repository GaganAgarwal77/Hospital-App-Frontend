
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
export default class CreateConsentRequest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: window.localStorage.getItem("patientID"),

            patientid: window.localStorage.getItem("patientID"),
            patient: null,

            doctors: [],
            doctorid: window.localStorage.getItem("doctorID"),
            doctor: null,

            hospitals: [],
            hiuId: '',
            hiu: null,
            hipId: '',
            hip: null,

            hiType: "",
            department:"",

            dateFrom: new Date(),
            dateTo: new Date(),
            valdityTill: new Date()
        }
        this.getAllDoctors()
        this.getPatient()
        this.getAllHospitals()
    }
    componentDidMount() {
    }
    getAllDoctors() {
        DoctorService.getDoctors().then((res) => {
            this.setState({ doctors: res.data.doctors })
        });
    }
    getPatient(){
        PatientService.getPatientById(this.state.id).then((res) => {
            this.setState({ patient: res.data })
        });
    }
    getAllHospitals() {
        DoctorService.getHospitals().then(res => {
            this.setState({ hospitals: res.data.hospitals });
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
        if (!values.department) {
            errors.department = 'Enter department';
        } else if (values.department.length < 3) {
            errors.department = 'Enter at least 3 Characters in department';
        }
        return errors;
    }
    addProblem = () => {
        // if (this.state.doctorid === '' || this.state.hiuId === '' || this.state.hipId === '' || this.state.hiType === '' || this.state.department === '') {
        //     AlertifyService.alert("Fill in the blanks");
        // } else {
            if (this.state.id != null) {
                // in doctors list find doctor with doctorid
                let doctor = this.state.doctors.find(doctor => doctor.id === this.state.doctorid);
                let token = window.localStorage.getItem("token");
                console.log(token);
                let consentRequest = {
                    ehrbID: this.state.patient.ehrbID,
                    doctorID: doctor.doctorEhrbID,
                    hiuID: this.state.hiuId,
                    hipID: this.state.hipId,
                    departments: [this.state.department],
                    hiType: [this.state.hiType],
                    permission: {
                        dateRange : {
                            from: this.state.dateFrom,
                            to: this.state.dateTo
                        },
                        consent_validity: this.state.valdityTill
                    }
                }
                let consentObj = {
                    consent_object : consentRequest
                }
                console.log(this.state.doctor, consentRequest);
                console.log(this.state);
                DoctorService.generateConsentRequest(consentObj, token).then(res => {
                    console.log(consentObj)
                    AlertifyService.successMessage("Generating consent request for related patient is ok.. ");
                    this.viewPatient(this.state.patientid);
                });
            } else {
                AlertifyService.alert("Error..");
            }
        // }
    }
    onChangeData(type, e) {
        const addproblem = this.state;
        addproblem[type] = e;
        this.setState({ addproblem });
    }
    render() {
        {console.log(this.state)}
        let { hiType, department, creationDate, dateFrom, dateTo, valdityTill } = this.state;
        const isWeekday = date => {
            const day = date.getDay(date);
            return day !== 0 && day !== 6;
        };
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h5>Consent Request Form</h5>
                    <hr />
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => this.viewPatient(this.state.id)} >  Back </button>
                    <hr />
                    <Formik
                        onSubmit={this.addProblem}
                        validate={this.validate}
                        initialValues={{ hiType, department, creationDate }}
                        enableReinitialize={true} >
                        <Form>
                        {/* <fieldset className="form-group">
                            <label>Doctor *</label>
                            <select className="form-control"
                                value={this.state.doctor?.firstName}
                                onChange={e => this.onChangeData('doctorid', e.target.value)} >
                                {this.state.doctors.map(doctor =>
                                    <option key={doctor.id} value={doctor.id}>{doctor.firstName}</option>
                                )}
                            </select>
                        </fieldset> */}
                        <fieldset className="form-group">
                            <label>HIU *</label>
                            <select className="form-control"
                                value={this.state.hiu?.hospitalName}
                                onChange={e => this.onChangeData('hiuId', e.target.value)} >
                                {this.state.hospitals.map(hiu =>
                                    <option key={hiu.hospitalId} value={hiu.hospitalId}>{hiu.hospitalName}</option>
                                )}
                            </select>
                        </fieldset>
                        <fieldset className="form-group">
                            <label>HIP *</label>
                            <select className="form-control"
                                value={this.state.hip?.hospitalName}
                                onChange={e => this.onChangeData('hipId', e.target.value)} >
                                {this.state.hospitals.map(hip =>
                                    <option key={hip.hospitalId} value={hip.hospitalId}>{hip.hospitalName}</option>
                                )}
                            </select>
                        </fieldset>
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
                                <label>department:</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="department"
                                    value={department}
                                    onChange={e => this.onChangeData('department', e.target.value)} />
                                <ErrorMessage name="department" component="div" className="alert alert-danger text-danger" />
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
                                    filterDate={isWeekday}          // disable weekend
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
                                    filterDate={isWeekday}          // disable weekend
                                    timeIntervals={15}              // time range around 15 min
                                    //showWeekNumbers               // show week number
                                    timeFormat="HH:mm"              // show time format
                                    dateFormat="yyyy/MM/dd h:mm aa" // show all of time format
                                />
                            </fieldset>
                            <fieldset className="form-group">
                                <label >Valid Till: </label>
                                <ReactDatePicker
                                    className="form-control"
                                    // showTimeSelect
                                    showTimeInput
                                    selected={valdityTill}
                                    onChange={e => this.onChangeData('valdityTill', e)}
                                    filterDate={isWeekday}          // disable weekend
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
                                    onClick={() => this.viewPatient(this.state.id)}  
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
