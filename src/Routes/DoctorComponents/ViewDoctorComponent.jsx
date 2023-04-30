import React, { Component } from 'react'
import DoctorService from '../../services/DoctorService'; 
import DoctorDetail from '../BasicComponent/DoctorDetail';
import AlertifyService from '../../services/AlertifyService';
import ConsentRequestsComponent from '../PatientComponents/ConsentComponent/ConsentRequestsComponent';

export default class ViewDoctorComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id,
            ehrbID : '',
            doctor: null,
            name: '',
            lastname: '',
            email: '',
            gender: '',
            bornDate: null,
            city: '',
            problems: [],  
            message: null 
        }
        this.loadDoctor = this.loadDoctor.bind(this); 
    }

    componentDidMount() {
        this.loadDoctor(); 
    }
    
    loadDoctor() {
        DoctorService.getDoctorById(this.state.id).then(res => {
            let p = res.data;
            this.setState({ doctor: p });
            this.setState({
                id: p.id,
            }); 
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/doctors');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    } 
    viewProblem(problemid) { 
        this.props.history.push('/problem/' + problemid);
    }
    viewProblemForm(id){ 
        window.localStorage.setItem("doctorID", id);
        this.props.history.push('/add-problem'); 
    } 
    back(){
        this.props.history.push('/doctors'); 
    }
    render() { 
        let doctor = this.state.doctor; 
        return (
            <div className="row">
                {/* Show and close modal */}
                <div className="col-lg-12">
                    <button
                        className="btn btn-danger"
                        onClick={() => this.back()}> Back </button>
 
                    <hr />
                </div>
                {/* doctor Details */}
                <div className="col-lg-7">
                    {doctor != null ?
                        <DoctorDetail
                            id={doctor.id}
                            name={doctor.firstName}
                            lastname={doctor.lastName}
                            phoneNo={doctor.phoneString}
                            email={doctor.emailAddress}
                            city={doctor.address}
                            bornDate={Date("2000-03-25")}
                            gender={doctor.gender}
                            showButtons={false}
                            // array={['id','name','lastname','email','city','bornDate','gender']}
                        />
                        : null}
                </div> 
                <div className="col"></div>
                <div className="col-lg-4">
                    <img style={{ height: 300 }} src="https://cdn4.iconfinder.com/data/icons/business-colored-vol-1/100/business-colored-7-05-512.png" alt="" />
                </div> 
                <div className="col-lg-12">
                        <ConsentRequestsComponent      id={this.state.id}/>
                </div> 
            </div>
        )
    }
}