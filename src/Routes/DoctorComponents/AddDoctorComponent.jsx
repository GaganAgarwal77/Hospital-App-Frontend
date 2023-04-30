import React, { Component } from 'react'
import DoctorService from '../../services/DoctorService';
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/alertify.css";
import DatePicker from "react-datepicker";
import AlertifyService from '../../services/AlertifyService';

class AddDoctorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            lastname: '',
            email: '',
            phoneNo:'',
            gender: 'Male',
            city: '',
            bornDate: new Date(),
            status: 1,
            cities: [],
            ehrbID: '',
            password: '',
            department: ''
        }
        // this.saveUser = this.saveUser.bind(this);
    }

    controlQuickly() {
        return this.state.name === null || this.state.name === '' || this.state.name === ' ' ||
            this.state.lastname === null || this.state.lastname === '' || this.state.lastname === ' ';
    }
    saveUser = (e) => {
        if (!this.controlQuickly()) {
            e.preventDefault();
            let doctor = {
                firstName : this.state.name,
                lastName : this.state.lastname,
                emailAddress : this.state.email,
                password : this.state.password,
                phoneString : this.state.phoneNo,
                gender : this.state.gender,
                address : this.state.city,
                department : this.state.department,
                ehrbID : this.state.ehrbID,
            }
            console.log(doctor)
            DoctorService.addDoctor(doctor)
                .then(res => {
                    console.log(res);
                    this.setState({ message: 'User added successfully.' });
                    this.props.history.push('/doctors');
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
        console.log(type, data)
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
        let { ehrbID, name, lastname,phoneNo, email, password, gender, city, department } = this.state;
        return (
            <div className="row">
                <div className="col-sm-12">
                    <button
                        className="btn btn-danger"
                        onClick={() => this.back()}> Back </button>
                    <hr />
                </div>
                <div className="col-sm-8">
                    <h2 className="text-center">Doctor Register</h2>
                    <form>
                    <div className="form-group">
                            <label>EHRB ID *</label>
                            <input type="text" placeholder="ehrbID" name="ehrbID" className="form-control" value={ehrbID} onChange={e => this.onChangeData('ehrbID', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Name *</label>
                            <input type="text" placeholder="name" name="name" className="form-control" value={name} onChange={e => this.onChangeData('name', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Last Name *</label>
                            <input placeholder="Last name" name="lastname" className="form-control" value={lastname} onChange={e => this.onChangeData('lastname', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Phone *</label>
                            <input placeholder="Last name" name="phone No" className="form-control" value={phoneNo} onChange={e => this.onChangeData('phoneNo', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input placeholder="Email" name="email" className="form-control" value={email} onChange={e => this.onChangeData('email', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input placeholder="Password" name="password" className="form-control"  type="password" value={password} onChange={e => this.onChangeData('password', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Deparment *</label>
                            <input type="text" placeholder="department" name="department" className="form-control" value={department} onChange={e => this.onChangeData('department', e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Gender *</label>
                            <select className="form-control"
                                value={gender}
                                onChange={e => this.onChangeData('gender', e.target.value)} >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Address *</label>
                            <input type="text" placeholder="city" name="city" className="form-control" value={city} onChange={e => this.onChangeData('city', e.target.value)} />
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

export default AddDoctorComponent;