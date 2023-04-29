import React, { Component } from 'react'
import DoctorService from '../../services/DoctorService';
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/alertify.css";
import DatePicker from "react-datepicker";
import AlertifyService from '../../services/AlertifyService';

class LoginDoctorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        // this.saveUser = this.saveUser.bind(this);
    }

    controlQuickly() {
        return this.state.email == null || this.state.password == null;
    }
    saveUser = (e) => {
        if (!this.controlQuickly()) {
            e.preventDefault();
            let doctor = {
                email : this.state.email,
                password : this.state.password,
            }
            DoctorService.loginDoctor(doctor)
                .then(res => {
                    console.log(res);
                    window.localStorage.setItem("token", res.data.token);
                    window.localStorage.setItem("doctorID", res.data.doctorID);
                    this.setState({ message: res.data.message });
                    this.props.history.push('/patients');
                    window.location.reload()
                    alertify.success("Adding doctor is ok");
                }).catch((error) => {
                    console.log(error.response)
                    if (error.response) {
                        this.setState({ errorMessage: error.response.data.message, id: null });
                        AlertifyService.alert(error.response.data.message);
                        //this.props.history.push('/doctors');
                    }
                    else if (error.request) console.log(error.request);
                    else console.log(error.message);
                });
        } else
            AlertifyService.alert(' * işaretli alanları doldurunuz...');
    }
    onChangeData(type, data) {
        const stateData = this.state;
        stateData[type] = data;
        this.setState({ stateData });
    }
    back() {
        this.props.history.push('/doctors');
    }
    render() {
        //let bornDate = this.state.bornDate;
        const isWeekday = date => {
            const day = date.getDay(date);
            return day !== 0 && day !== 6;
        };
        let { email, password } = this.state;
        return (
            <div className="row">
                <div className="col-sm-12">
                    <button
                        className="btn btn-danger"
                        onClick={() => this.back()}> Back </button>
                    <hr />
                </div>
                <div className="col-sm-8">
                    <h2 className="text-center">Doctor Login</h2>
                    <form>
                        <div className="form-group">
                            <label>Email:</label>
                            <input placeholder="Email" name="email" className="form-control" value={email} onChange={e => this.onChangeData('email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input placeholder="Password" name="password" className="form-control" type="password" value={password} onChange={e => this.onChangeData('password', e.target.value)} />
                        </div>
                        <button className="btn btn-success" type="button" onClick={this.saveUser}>Save</button>
                    </form>
                </div>
                <div className="col"></div>
                <div className="col-lg-3">
                    <img style={{ height: 200 }} src="https://i1.wp.com/www.nosinmiubuntu.com/wp-content/uploads/2013/02/New-Database.png?w=770" alt="" />
                </div>
                <div className="col-sm-12">
                    <hr />
                    <hr />
                    <hr />
                </div>
            </div>
        );
    }
}

export default LoginDoctorComponent;