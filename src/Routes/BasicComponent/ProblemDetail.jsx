import React, { Component } from 'react'
import Moment from 'react-moment'
import { withRouter } from 'react-router'

class ProblemDetail extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            
        }
        this.openReceipeForm = this.openReceipeForm.bind(this);
    }

    openReceipeForm(id, problemid){
        window.localStorage.setItem("patientID", id);
        window.localStorage.setItem("problemID", problemid);
        this.props.history.push('/problem/receipe-form');
    }
    render() {
        return (
            <div>
                <div className="card" >
                    <div className="card-header"><h3> Problem Detail</h3> </div>
                    <ul className="text-left list-group list-group-flush">
                        <li className="list-group-item"><b>Record ID : </b>{this.props.recordID}</li>
                        <li className="list-group-item"><b>Patient ID : </b>{this.props.patientID}</li>
                        <li className="list-group-item"><b>Doctor ID : </b>{this.props.doctorID}</li>
                        <li className="list-group-item"><b>Department : </b>{this.props.department}</li>
                        <li className="list-group-item"><b>Hi Type : </b>{this.props.hiType}</li>
                        <li className="list-group-item"><b>Height : </b>{this.props.height}</li>
                        <li className="list-group-item"><b>Weight : </b>{this.props.weight}</li>
                        <li className="list-group-item"><b>Blood Pressure : </b>{this.props.bp}</li>
                        <li className="list-group-item"><b>Heart Rate : </b>{this.props.heartRate}</li>
                        <li className="list-group-item"><b>Problems : </b>{this.props.problems}</li>
                        <li className="list-group-item"><b>Diagnosis : </b>{this.props.diagnosis}</li>
                        <li className="list-group-item"><b>Prescription : </b>{this.props.prescription}</li>
                        <li className="list-group-item"><b>Creation Date (Y/M/D H/M) : </b>
                            <Moment format="YYYY / MM / DD  HH:mm">{Date(this.props.timeStamp)}</Moment>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default withRouter(ProblemDetail)