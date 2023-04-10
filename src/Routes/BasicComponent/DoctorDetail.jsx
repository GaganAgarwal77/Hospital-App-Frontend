import React, { Component } from 'react'
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/themes/default.min.css";
import "alertifyjs/build/css/themes/bootstrap.min.css";
import "alertifyjs/build/css/alertify.min.css";
import DoctorService from '../../services/DoctorService';
import { withRouter } from 'react-router';
import Moment from 'react-moment';

class DoctorDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            name: props.name,
            lastname: props.lastname,
            phoneNo: props.phoneNo,
            email: props.email,
            bornDate: props.bornDate,
            gender: props.gender,
            city: props.city,
            message: ''
        };
        // props.array.map(a => {
        //     console.log(a + ' : ' + props[a] + ' : ' + (typeof props[a]))
        // })
    }
    editDoctor(id) {
        alertify.confirm(
            "Are you sure to edit this doctor.",
            ok => {
                window.localStorage.setItem("doctorID", id);
                this.props.history.push('/edit-doctor');
            },
            cancel => {
                alertify.error('Cancel');
            }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    deleteDoctor(id) {
        alertify.confirm("Are you sure to delete this doctor.",
            function () {
                DoctorService.deleteDoctor(id)
                    .then(res => {
                        window.location.href = '/doctors';
                        alertify.success("Deleting is ok ");
                    })
            },
            function () {
                alertify.error('Cancel');
            }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    render() {
        var age = null;
        if (this.props.bornDate != null) {
            var born = Number(this.props.bornDate.substr(0, 4));
            var now = Number(new Date().toLocaleDateString('tr-TR').substr(6, 4));
            age = now - born;
        }
        return (
            <div>
                <div className="card" >
                    <div className="card-header"> <h3> Doctor Detail</h3>  </div>
                    <ul className="text-left list-group list-group-flush">
                        <li className="list-group-item"><b>Doctor id : </b>{this.props.id}</li>
                        <li className="list-group-item"><b>Name : </b>{this.props.name}</li>
                        <li className="list-group-item"><b>Last Name : </b>{this.props.lastname}</li>
                        <li className="list-group-item"><b>Phone No : </b>{this.props.phoneNo}</li>
                        <li className="list-group-item"><b>Email : </b>{this.props.email}</li>
                        <li className="list-group-item"><b>City : </b>{this.props.city}</li>
                        <li className="list-group-item"><b>Gender : </b>{this.props.gender}</li>
                        {this.props.showButtons?
                        <li className="list-group-item">
                            <button
                                className="btn btn-sm btn-success"
                                onClick={() => this.editDoctor(this.props.id)} >
                                Edit
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => this.deleteDoctor(this.props.id)}>
                                Delete
                            </button>
                        </li>
                         : null}
                    </ul>
                </div>
            </div>
        )
    }
}
export default withRouter(DoctorDetail)
