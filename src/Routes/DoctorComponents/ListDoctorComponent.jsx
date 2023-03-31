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
    'City'
];
let filterArray = []
let checked = {
    name: false,
    lastname: false,
    email: false,
    city: false
}
let filterAllDoctors
class ListDoctorComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Doctors: [],
            message: null,
            indeterminate: false,
            filters: [],
            Doctor:{}
        }
        this.reloadDoctorList = this.reloadDoctorList.bind(this); 
    }
    componentDidMount() {
        this.reloadDoctorList();
    } 

    reloadDoctorList() {
        DoctorService.getDoctors().then((res) => {
            this.setState({ Doctors: res.data })
            filterAllDoctors = res.data
        });
    }
    deleteDoctor(Doctorid) {
        alertify.confirm(
            "Are you sure to delete this Doctor.",
            ok => {
                DoctorService.deleteDoctor(Doctorid).then(res => {
                    this.setState({ message: 'User deleted successfully. ' + res });
                    this.setState({ Doctors: this.state.Doctors.filter(Doctor => Doctor.Doctorid !== Doctorid) });
                });
                alertify.success('to delete Doctor is ok');
            },
            cancel => { alertify.error('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    editDoctor(id) { 
        alertify.confirm(
            "Are you sure to edit this Doctor.",
            ok => {
                window.localStorage.setItem("DoctorId", id);
                this.props.history.push('/edit-Doctor');
            },
            cancel => { alertify.error('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    viewDoctor(Doctorid) {
        window.localStorage.setItem("DoctorId", Doctorid);
        this.props.history.push('/view-Doctor/' + Doctorid);
    }
    addDoctor() {
        //window.localStorage.removeItem("userId");
        this.props.history.push('/add-Doctor');
    }
    onChangeSearchByName = (e) => {
        this.filterDoctors(e.target.value);
    }
    filterDoctors = (value) => {
        if (filterArray.length > 0) {
            var results = [];
            if (value !== '' && value.length > 0) {
                results = filterAllDoctors.filter(Doctor => {
                    let find = false;
                    filterArray.forEach(function (filter) {
                        let control = Doctor[filter.toLowerCase()].toLowerCase().indexOf(value.toLowerCase());
                        if (control > -1) find = true;
                    });
                    return find;
                });
                this.setState({ Doctors: results });
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
    viewDoctorQuickly(Doctor){
        this.setState({Doctor});
    }
    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <button
                        className="btn btn-warning"
                        onClick={() => this.addDoctor()}>
                        Add Doctor
                        </button>
                    <hr />
                </div>
                <div className="col-lg-6" >
                    <div className="form-group">
                        <input type="text"
                            placeholder="Search Doctor by choosing any parameter"
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
                                    <th>Born Date</th>
                                    <th>City</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody >
                                {this.state.Doctors.map(Doctor =>
                                    <tr className={Doctor.gender === "Male" ? "bg-default" : "bg-danger"} key={Doctor.Doctorid}>
                                        <td>{Doctor.name} {Doctor.lastname}</td>
                                        {/* {Doctor.Doctorid} */}
                                        <td>{Doctor.email}</td>
                                        <td>
                                            {Doctor.bornDate !== null ?
                                                <Moment format="YYYY/MM/DD HH:mm">
                                                    {Doctor.bornDate}
                                                </Moment>
                                                : null}
                                        </td>
                                        <td>{Doctor.city}</td>
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
                                                        onClick={() => this.viewDoctor(Doctor.Doctorid)} >  View </button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        data-toggle="modal" data-target="#DoctorModal"
                                                        onClick={() => this.viewDoctorQuickly(Doctor)} >  View Quickly </button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => this.editDoctor(Doctor.Doctorid)} > Edit</button>
                                                    <div className="dropdown-divider"></div>
                                                    <button
                                                        className="dropdown-item"
                                                        onClick={() => this.deleteDoctor(Doctor.Doctorid)}> Delete </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <DoctorDetailModal Doctor={this.state.Doctor} />
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