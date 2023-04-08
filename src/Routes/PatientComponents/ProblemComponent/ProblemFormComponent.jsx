
import React, { Component } from 'react'
import ProblemService from '../../../services/ProblemService';
import DoctorService from '../../../services/DoctorService';
import { ErrorMessage, Field, Form, Formik } from "formik";
import ReactDatePicker from 'react-datepicker';
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import AlertifyService from '../../../services/AlertifyService';
import PatientService from '../../../services/PatientService';
//import Select from 'react-select';

var statuses = [];
export default class ProblemFormComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            patientid: window.localStorage.getItem("patientID"),
            doctorid: window.localStorage.getItem("doctorID"),

            doctors: [],
            doctor: null,

            department: '',
            hiType: '',
            height: '',
            weight: '',
            bp: '',
            heartRate: '',

            problems: '',
            diagnosis: '',
            prescription: '',

            creationDate: new Date(),
        }
        this.getAllDoctors()
    }
    getAllDoctors() {
        DoctorService.getDoctors().then(res => {
            this.setState({ doctors: res.data.doctors });
        });
    }
    viewPatient(id) {
        window.localStorage.setItem("patientID", id);
        this.props.history.push('/view-patient/' + id);
    }
    validate(values) {
        let errors = {};

        if (!values.department) {
            errors.department = 'Enter department';
        }
        if (!values.hiType) {
            errors.hiType = 'Enter visit type';
        }
        if (!values.height) {
            errors.height = 'Enter height';
        }
        if (!values.weight) {
            errors.weight = 'Enter weight';
        }
        if (!values.bp) {
            errors.bp = 'Enter blood pressure';
        }
        if (!values.heartRate) {
            errors.heartRate = 'Enter heart rate';
        }
        if (!values.problems) {
            errors.problems = 'Enter problems';
        }
        if (!values.diagnosis) {
            errors.diagnosis = 'Enter diagnosis';
        }
        if (!values.prescription) {
            errors.prescription = 'Enter prescription';
        }
        if (!values.creationDate) {
            errors.creationDate = 'Enter creation date';
        }

        return errors;
    }
    addProblem = () => {
        if (this.state.doctorid === '' || this.state.department === '' || this.state.hiType === '' || this.state.height === '' || this.state.weight === '' || this.state.bp === '' || this.state.heartRate === '' || this.state.problems === '' || this.state.diagnosis === '' || this.state.prescription === '') {
            AlertifyService.alert("Fill in the blanks");
        } else {
            if (this.state.patientid != null) { 
                let record = {
                    patientID: this.state.patientid,
                    doctorID: window.localStorage.getItem("doctorID"),
                    department: this.state.department,
                    hiType: this.state.hiType,
                    metaData: {
                        height: this.state.height,
                        weight: this.state.weight,
                        bp: this.state.bp,
                        heartRate: this.state.heartRate
                    },
                    data : {
                        problems: this.state.problems,
                        diagnosis: this.state.diagnosis,
                        prescription: this.state.prescription
                    }
                }
                console.log(record)
                PatientService.addPatientRecord(record).then(res => {
                    AlertifyService.successMessage("Saving problem for related patient is ok.. ");
                    this.viewPatient(this.state.patientid);
                });
            } else {
                AlertifyService.alert("Error adding record");
            }
        }
    }
    onChangeData(type, e) {
        const addproblem = this.state;
        addproblem[type] = e;
        console.log(type, e)
        this.setState({ addproblem });
    }
    render() {
        let { department, hiType, height, weight, bp, heartRate, problems, diagnosis, prescription, creationDate } = this.state;
        const isWeekday = date => {
            const day = date.getDay(date);
            return day !== 0 && day !== 6;
        };
        return (
            <div className="row">
                <div className="col-sm-12">
                    <h5>Problem Form</h5>
                    <hr />
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => this.viewPatient(this.state.patientid)} >  Back </button>
                    <hr />
                    <Formik
                        onSubmit={this.addProblem}
                        validate={this.validate}
                        initialValues={{ department, hiType, height, weight, bp, heartRate, problems, diagnosis, prescription, creationDate }}
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
                                <label>Department :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="department"
                                    value={department}
                                    onChange={e => this.onChangeData('department', e.target.value)} />
                                <ErrorMessage name="department" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Visit Type :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="hiType"
                                    value={hiType}
                                    onChange={e => this.onChangeData('hiType', e.target.value)} />
                                <ErrorMessage name="hiType" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Height :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="height"
                                    value={height}
                                    onChange={e => this.onChangeData('height', e.target.value)} />
                                <ErrorMessage name="height" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Weight :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="weight"
                                    value={weight}
                                    onChange={e => this.onChangeData('weight', e.target.value)} />
                                <ErrorMessage name="weight" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Blood Pressure :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="bp"
                                    value={bp}
                                    onChange={e => this.onChangeData('bp', e.target.value)} />
                                <ErrorMessage name="bp" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Heart Rate :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="heartRate"
                                    value={heartRate}
                                    onChange={e => this.onChangeData('heartRate', e.target.value)} />
                                <ErrorMessage name="heartRate" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Problems :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="problems"
                                    value={problems}
                                    onChange={e => this.onChangeData('problems', e.target.value)} />
                                <ErrorMessage name="problems" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Diagnosis :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="diagnosis"
                                    value={diagnosis}
                                    onChange={e => this.onChangeData('diagnosis', e.target.value)} />
                                <ErrorMessage name="diagnosis" component="div" className="alert alert-danger text-danger" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Prescription :</label>
                                <Field
                                    className="form-control"
                                    type="text"
                                    name="prescription"
                                    value={prescription}
                                    onChange={e => this.onChangeData('prescription', e.target.value)} />
                                <ErrorMessage name="prescription" component="div" className="alert alert-danger text-danger" />
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
