import React, { Component } from 'react'
import DoctorService from '../../services/DoctorService';
import "@material/react-checkbox/dist/checkbox.css";
import Checkbox from '@material/react-checkbox';
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/themes/bootstrap.min.css";
import "alertifyjs/build/css/alertify.min.css";
import "../../Assets/css/ListPatientComponent.css"
// import Modal from 'react-modal'; 
import * as alertify from 'alertifyjs';

import Moment from 'react-moment';
import DoctorDetailModal from '../BasicComponent/DoctorDetailModal';

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
let filterAllDoctors
class ListDoctorComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            doctors: [],
            message: null,
            indeterminate: false,
            filters: [],
            doctor:{}
        }
        this.reloadDoctorList = this.reloadDoctorList.bind(this); 
    }
    componentDidMount() {
        this.reloadDoctorList();
    } 

    reloadDoctorList() {
        DoctorService.getDoctors(window.localStorage.getItem("token")).then((res) => {
            this.setState({ doctors: res.data.doctors })
            filterAllDoctors = res.data
        });
    }
    deleteDoctor(id) {
        alertify.confirm(
            "Are you sure to delete this doctor.",
            ok => {
                DoctorService.deleteDoctor(id).then(res => {
                    this.setState({ message: 'User deleted successfully. ' + res });
                    this.setState({ doctors: this.state.doctors.filter(doctor => doctor.id !== id) });
                });
                alertify.success('to delete doctor is ok');
            },
            cancel => { alertify.error('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    editDoctor(id) { 
        alertify.confirm(
            "Are you sure to edit this doctor.",
            ok => {
                window.localStorage.setItem("doctorID", id);
                this.props.history.push('/edit-doctor');
            },
            cancel => { alertify.error('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    viewDoctor(id) {
        window.localStorage.setItem("doctorID", id);
        this.props.history.push('/view-doctor/' + id);
    }
    addDoctor() {
        //window.localStorage.removeItem("userId");
        this.props.history.push('/add-doctor');
    }
    onChangeSearchByName = (e) => {
        this.filterDoctors(e.target.value);
    }
    filterDoctors = (value) => {
        if (filterArray.length > 0) {
            var results = [];
            if (value !== '' && value.length > 0) {
                results = filterAllDoctors.filter(doctor => {
                    let find = false;
                    filterArray.forEach(function (filter) {
                        let control = doctor[filter.toLowerCase()].toLowerCase().indexOf(value.toLowerCase());
                        if (control > -1) find = true;
                    });
                    return find;
                });
                this.setState({ doctors: results });
            }
            else { this.reloadDoctorList(); }
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
    viewDoctorQuickly(doctor){
        this.setState({doctor});
    }
    render() {
        let {doctors} = this.state;
        return (
            <div className="row">
                <div className="col-lg-12">
                    <button
                        className="btn btn-warning"
                        onClick={() => this.addDoctor()}>
                        Add doctor
                        </button>
                    <hr />
                </div>
                <div className="col-lg-6" >
                    <div className="form-group">
                        <input type="text"
                            placeholder="Search doctor by choosing any parameter"
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
                                {doctors.map(doctor =>
                                    <tr className="bg-default" key={doctor.id}>
                                        <td>{doctor.firstName} {doctor.lastName}</td>
                                        {/* {doctor.id} */}
                                        <td>{doctor.emailAddress}</td>
                                        <td>{doctor.doctorEhrbID}</td>
                                        <td>{doctor.address}</td>
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
                                                        onClick={() => this.viewDoctor(doctor.id)} >  View </button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        data-toggle="modal" data-target="#DoctorModal"
                                                        onClick={() => this.viewDoctorQuickly(doctor)} >  View Quickly </button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => this.editDoctor(doctor.id)} > Edit</button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => this.deleteDoctor(doctor.id)}> Delete </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <DoctorDetailModal doctor={this.state.doctor} />
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

export default ListDoctorComponent;