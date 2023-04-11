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

                    <div className="card-header"><h3> Consent Detail</h3> </div>
                    <ul className="text-left list-group list-group-flush">
                        <li className="list-group-item"><b>Consent ID : </b>{this.props.id}</li>
                        <li className="list-group-item"><b>Patient ABHA ID : </b>{this.props.ehrbID}</li>
                        <li className="list-group-item"><b>Doctor ABHA ID : </b>{this.props.doctorID}</li>
                        <li className="list-group-item"><b>HIU ID : </b>{this.props.hiuID}</li>
                        <li className="list-group-item"><b>HIP ID : </b>{this.props.hipID}</li>
                        <li className="list-group-item"><b>Department : </b>{this.props.departments}</li>
                        <li className="list-group-item"><b>HI Type : </b>{this.props.hiType}</li>
                        <li className="list-group-item"><b>From Date (Y/M/D H/M) : </b>
                            <Moment format="YYYY / MM / DD  HH:mm">{Date(this.props.fromDate)}</Moment>
                        </li>
                        <li className="list-group-item"><b>To Date (Y/M/D H/M) : </b>
                            <Moment format="YYYY / MM / DD  HH:mm">{Date(this.props.toDate)}</Moment>
                        </li>
                        <li className="list-group-item"><b>Validity Till (Y/M/D H/M) : </b>
                            <Moment format="YYYY / MM / DD  HH:mm">{Date(this.props.validityTill)}</Moment>
                        </li>
                        <li className="list-group-item"><b>Consent Status : </b>{this.props.consentStatus}</li>
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