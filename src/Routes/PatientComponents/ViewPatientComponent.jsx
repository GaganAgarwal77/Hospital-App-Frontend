import React, { Component } from 'react'
import PatientService from '../../services/PatientService'; 
import PatientDetail from '../BasicComponent/PatientDetail';
import AlertifyService from '../../services/AlertifyService';
import ProblemsComponent from './ProblemComponent/ProblemsComponent';
import CreateConsentRequest from './CreateConsentRequest';
export default class ViewPatientComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.match.params.id || 1,
            ehrbID : '',
            patient: null,
            name: '',
            lastname: '',
            email: '',
            gender: '',
            bornDate: null,
            city: '',
            problems: [],  
            message: null 
        }
        this.loadPatient = this.loadPatient.bind(this); 
    }

    componentDidMount() {
        this.loadPatient(); 
    }
    
    loadPatient() {
        PatientService.getPatientById(this.state.id).then(res => {
            let p = res.data;
            this.setState({ patient: p });
            this.setState({
                id: p.id,
            }); 
        }).catch((error) => {
            if (error.response) {
                AlertifyService.alert(error.response.data.message);
                this.props.history.push('/patients');
            }
            else if (error.request) console.log(error.request);
            else console.log(error.message);
        });
    } 

    viewProblem(problemid) { 
        this.props.history.push('/problem/' + problemid);
    }
    viewProblemForm(id){ 
        window.localStorage.setItem("patientID", id);
        this.props.history.push('/add-record'); 
    } 
    viewConsentRequestForm(id){ 
        window.localStorage.setItem("patientID", id);
        this.props.history.push('/request-consent'); 
    } 

    back(){
        this.props.history.push('/patients'); 
    }
    render() { 
        let patient = this.state.patient; 
        return (
            <div className="row">
                {/* Show and close modal */}
                <div className="col-lg-12">
                    <button
                        className="btn btn-danger"
                        onClick={() => this.back()}> Back </button>
                    <button
                        type="button"
                        className="btn btn-warning ml-1"
                        onClick={() => this.viewProblemForm(this.state.id)}
                        data-whatever="@getbootstrap">Add Record</button>
                     <button
                        type="button"
                        className="btn btn-warning ml-1"
                        onClick={() => this.viewConsentRequestForm(this.state.id)}
                        data-whatever="@getbootstrap">Request Consent</button>
                    <hr />
                </div>
                {/* Patient Details */}
                <div className="col-lg-7">
                    {console.log(patient)}
                    {patient != null ?
                        <PatientDetail
                            id={patient.id}
                            name={patient.firstName}
                            lastname={patient.lastName}
                            phoneNo={patient.phoneString}
                            email={patient.emailAddress}
                            city={patient.address}
                            bornDate={Date("2000-03-25")}
                            gender={patient.gender}
                            showButtons={true}
                            // array={['id','name','lastname','email','city','bornDate','gender']}
                        />
                        : null}
                </div> 
                <div className="col"></div>
                <div className="col-lg-4">
                    <img style={{ height: 300 }} src="https://cdn4.iconfinder.com/data/icons/business-colored-vol-1/100/business-colored-7-05-512.png" alt="" />
                </div> 
                <div className="col-lg-12">
                        <ProblemsComponent   id={this.state.id}/>
                </div> 
            </div>
        )
    }
}