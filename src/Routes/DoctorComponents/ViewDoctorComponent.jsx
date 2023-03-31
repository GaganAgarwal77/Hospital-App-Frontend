import React, { Component } from 'react'
import DoctorService from '../../services/DoctorService'; 
import DoctorDetail from '../BasicComponent/DoctorDetail';
import AlertifyService from '../../services/AlertifyService';
import ConsentRequestsComponent from '../PatientComponents/ConsentComponent/ConsentRequestsComponent';

export default class ViewDoctorComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Doctorid: props.match.params.Doctorid,
            Doctor: null,
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
        DoctorService.getDoctorById(this.state.Doctorid).then(res => {
            let p = res.data;
            this.setState({ Doctor: p });
            this.setState({
                Doctorid: p.Doctorid,
                problems: p.problems
            }); 
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/Doctors');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    } 
    viewProblem(problemid) { 
        this.props.history.push('/problem/' + problemid);
    }
    viewProblemForm(Doctorid){ 
        window.localStorage.setItem("DoctorId", Doctorid);
        this.props.history.push('/add-problem'); 
    } 
    back(){
        this.props.history.push('/Doctors'); 
    }
    render() { 
        let Doctor = this.state.Doctor; 
        return (
            <div className="row">
                {/* Show and close modal */}
                <div className="col-lg-12">
                    <button
                        className="btn btn-danger"
                        onClick={() => this.back()}> Back </button>
 
                    <hr />
                </div>
                {/* Doctor Details */}
                <div className="col-lg-7">
                    {Doctor != null ?
                        <DoctorDetail
                            Doctorid={Doctor.Doctorid}
                            name={Doctor.name}
                            lastname={Doctor.lastname}
                            phoneNo={Doctor.phoneNo}
                            email={Doctor.email}
                            city={Doctor.city}
                            bornDate={Doctor.bornDate}
                            gender={Doctor.gender}
                            showButtons={true}
                            // array={['Doctorid','name','lastname','email','city','bornDate','gender']}
                        />
                        : null}
                </div> 
                <div className="col"></div>
                <div className="col-lg-4">
                    <img style={{ height: 300 }} src="https://cdn4.iconfinder.com/data/icons/business-colored-vol-1/100/business-colored-7-05-512.png" alt="" />
                </div> 
                <div className="col-lg-12">
                        <ConsentRequestsComponent      Doctorid={this.state.Doctorid}/>
                </div> 
            </div>
        )
    }
}