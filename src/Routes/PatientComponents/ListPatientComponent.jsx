import React, { Component } from 'react'
import PatientService from '../../services/PatientService';
import "@material/react-checkbox/dist/checkbox.css";
import Checkbox from '@material/react-checkbox';
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/themes/bootstrap.min.css";
import "alertifyjs/build/css/alertify.min.css";
import "../../Assets/css/ListPatientComponent.css"
// import Modal from 'react-modal'; 
import * as alertify from 'alertifyjs';

import Moment from 'react-moment';
import PatientDetailModal from '../BasicComponent/PatientDetailModal';

const items = [
    'Name',
    'Lastname',
    'Email',
    'Address'
];
let filterArray = []
let checked = {
    name: false,
    lastname: false,
    email: false,
    address: false
}
let filterAllPatients
class ListPatientComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            patients: [],
            message: null,
            indeterminate: false,
            filters: [],
            patient:{}
        }
        this.reloadPatientList = this.reloadPatientList.bind(this); 
    }
    componentDidMount() {
        this.reloadPatientList();
    } 

    reloadPatientList() {
        PatientService.getPatients().then((res) => {
            this.setState({ patients: res.data.patients })
            filterAllPatients = res.data
        });
    }
    deletePatient(id) {
        alertify.confirm(
            "Are you sure to delete this patient.",
            ok => {
                PatientService.deletePatient(id).then(res => {
                    this.setState({ message: 'User deleted successfully. ' + res });
                    this.setState({ patients: this.state.patients.filter(patient => patient.id !== id) });
                });
                alertify.success('to delete patient is ok');
            },
            cancel => { alertify.error('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    editPatient(id) { 
        alertify.confirm(
            "Are you sure to edit this patient.",
            ok => {
                window.localStorage.setItem("patientID", id);
                this.props.history.push('/edit-patient');
            },
            cancel => { alertify.error('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    viewPatient(id) {
        window.localStorage.setItem("patientID", id);
        this.props.history.push('/view-patient/' + id);
    }
    addPatient() {
        //window.localStorage.removeItem("userId");
        this.props.history.push('/add-patient');
    }
    onChangeSearchByName = (e) => {
        this.filterPatients(e.target.value);
    }
    filterPatients = (value) => {
        if (filterArray.length > 0) {
            var results = [];
            if (value !== '' && value.length > 0) {
                results = filterAllPatients.filter(patient => {
                    let find = false;
                    filterArray.forEach(function (filter) {
                        let control = patient[filter.toLowerCase()].toLowerCase().indexOf(value.toLowerCase());
                        if (control > -1) find = true;
                    });
                    return find;
                });
                this.setState({ patients: results });
            }
            else { this.reloadPatientList(); }
        } else {
            alertify.set('notifier', 'delay', 2);
            //alertify.set('notifier','position', 'top-center');
            alertify.error('Please select any parameters');
        }
    }
    createCheckboxes = () => (items.map((item) => this.createCheckbox(item)))
    createCheckbox = label => (
        <div className="float-left" style={{ margin: "0 25px 0 0" }} key={label} >
            <Checkbox
                nativeControlId='my-checkbox'
                checked={checked[label]}
                onChange={(e) => { this.changeStateForChecked(e, label); }}
            />
            <label className="checkbox-label" ><b>{label}</b></label>
        </div>
    )
    changeStateForChecked = (e, label) => {
        checked[label] = e.target.checked;
        var index = filterArray.indexOf(label);
        if (checked[label]) {
            if (index === -1) { filterArray.push(label); }
        } else {
            if (index !== -1) { filterArray.splice(index, 1); }
        }
    }
    viewPatientQuickly(patient){
        this.setState({patient});
    }
    render() {
        let {patients} = this.state;
        return (
            <div className="row">
                <div className="col-lg-12">
                    <button
                        className="btn btn-warning"
                        onClick={() => this.addPatient()}>
                        Add Patient
                        </button>
                    <hr />
                </div>
                <div className="col-lg-6" >
                    <div className="form-group">
                        <input type="text"
                            placeholder="Search Patient by choosing any parameter"
                            name="searchByName"
                            className="form-control"
                            onChange={this.onChangeSearchByName} />
                    </div>
                    <hr />
                </div>
                <div className="col-lg-6"> {this.createCheckboxes()} </div>
                <div className="col-lg-12">
                    <div className="table-responsive-lg">
                        <table className="table table-bordered table-sm table-dark table-hover" style={{ textAlign: "center" }}>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Abha ID</th>
                                    <th>Address</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                                {console.log(patients)}
                                {patients.map(patient =>
                                    <tr className= "bg-default" key={patient.id}>
                                        <td>{patient.firstName} {patient.lastName}</td>
                                        {/* {patient.id} */}
                                        <td>{patient.emailAddress}</td>
                                        <td>{patient.ehrbID}</td>
                                        <td>{patient.address}</td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button id="btnGroupDrop1"
                                                    type="button"
                                                    className="btn btn-secondary btn-sm dropdown-toggle"
                                                    data-toggle="dropdown"
                                                    aria-haspopup="true"
                                                    aria-expanded="false"> Actions </button>
                                                <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => this.viewPatient(patient.id)} >  View </button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        data-toggle="modal" data-target="#patientModal"
                                                        onClick={() => this.viewPatientQuickly(patient)} >  View Quickly </button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => this.editPatient(patient.id)} > Edit</button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => this.deletePatient(patient.id)}> Delete </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <PatientDetailModal patient={this.state.patient} />
                        <hr />
                        <hr />
                        <hr />
                        <hr />
                    </div>
                </div>
            </div>
        );
    }

}

export default ListPatientComponent;