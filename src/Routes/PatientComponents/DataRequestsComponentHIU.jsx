import React, { Component } from 'react'
import Moment from 'react-moment';
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.css";
import "@material/react-checkbox/dist/checkbox.css";
import AlertifyService from '../../services/AlertifyService';
import { withRouter } from 'react-router'; 
import DoctorService from '../../services/DoctorService';
import PatientService from '../../services/PatientService';

let filterAllConsent = [];
let filters = ["consentName", "consentStatus"];
class DataRequestsComponentHIP extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            dataRequests: []
        }
    }
    componentDidMount() {
        // this.getAllConsents();
        // this.getConsentTransactions();
        this.getAll();
    }
    getAllDataRequests() {
        DoctorService.getDataRequestsHIU(window.localStorage.getItem('token')).then(res => {
            this.setState({ dataRequests: res.data.dataRequests });
        })  
        // this.setState({ dataRequests: [
        //     {
        //         "id": "123-456-789",
        //         "signed_consent_object": 'a'.repeat(100),
        //         "txnID": "123-456-789",
        //         "requestID": "123-456-789",
        //         "ehrbID": "123-456-789",
        //         "hiuID": "123-456-789",
        //         "request_message": "123-456-789",
        //         "callback_url": "123-456-789"                
        //     }
        // ]});
    }
    getAll() {
        PatientService.getPatients().then((res) => {
            let patients = res.data.patients;
            DoctorService.getHospitals(window.localStorage.getItem("token")).then(res => {
                let hospitals = res.data.hospitals;
                DoctorService.getDataRequestsHIU(window.localStorage.getItem('token')).then(res => {
                    let requests = res.data.dataRequests;
                    for (let request in requests) {
                        patients.forEach(patient => {
                            if (patient.ehrbID == request.ehrbID) {
                                console.log(patient)
                                request["patientName"] = patient.firstName + " " + patient.lastName;
                            }  
                        });
                        hospitals.forEach(hospital => {
                            if (hospital.hospitalId == request.hipID) {
                                console.log(hospital)
                                request["hospitalName"] = hospital.hospitalName;
                            }
                        });
                        console.log(request)
                    }
                    this.setState({ dataRequests: requests });
                }) 
            });
        });
    }
    onChangeSearchByStatusOrDate = (e) => { this.filterConsents(e.target.value); }
    filterConsents(value) {
        var results = [];
        if (value !== '') {
            results = filterAllConsent.filter(dataRequest => {
                let find = false;
                //filters.forEach(filter=>{
                filters.forEach(function (filter) {
                    let control = dataRequest[filter].toLowerCase().indexOf(value.toLowerCase());
                    if (control > -1) find = true;
                });
                return find;
            });
            this.setState({ dataRequests: results });
        }
        else { this.loadPatient(); }
    }
    limitingPatientDetail(data) {
        if (data.length < 31) return data;
        else return data.substr(0, 30) + "...";
    }
    deleteConsent(consentid) {
        alertify.confirm("Are you sure to delete the dataRequest.",
            ok => {
                    //this.setState({ dataRequests: this.state.dataRequests.filter(p => p.consentid !== consentid) });
                    AlertifyService.successMessage('Deleting is ok : ');
                    this.getAllConsents();
            },
            cancel => { AlertifyService.errorMessage('Cancel'); }
        ).set({ title: "Attention" }).set({ transition: 'slide' }).show();
    }
    viewConsent(consentid) {
        window.localStorage.setItem("consentID", consentid);
        this.props.history.push('/consent/' + consentid);
    }
    viewQuickly(dataRequest){
        this.setState({dataRequest:dataRequest});
    }
    render() {
        let {dataRequests, transactions} = this.state;
        return (
            <div className="row">
            <div className="col-lg-12">
                <hr />
                <p className="h3 d-flex justify-content-center">Sent Data Requests</p>
                <hr />
                <div className="form-group">
                    <input type="text"
                        placeholder="Search Data Request by dataRequest Name or dataRequest Status"
                        name="searchByName"
                        className="form-control"
                        onChange={this.onChangeSearchByStatusOrDate}
                    />
                </div>
                <hr />
                <div className="table-responsive">
                    <table className="table table-bordered table-sm table-dark table-hover">
                        <thead>
                            <tr>
                                <th>Data Request ID</th>
                                <th>Transaction ID</th>
                                <th>Patient Name</th>
                                <th>Patient EHRB ID</th>
                                <th>HIP Name</th>
                                <th>Request Message</th>
                                {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {console.log(this.state)}
                            {this.state.dataRequests.map((dataRequest, index) =>
                                <tr className="bg-default" key={dataRequest.data_request_id}>
                                    <td>{dataRequest.data_request_id}</td>
                                    <td>{dataRequest.txnID}</td>
                                    <td>{dataRequest.patientName}</td>
                                    <td>{dataRequest.ehrbID}</td>
                                    <td>{dataRequest.hospitalName}</td>
                                    <td>{dataRequest.request_message}</td>
                                    {/* <td>
                                        <div className="btn-group" role="group">
                                            <button id="btnGroupDrop1"
                                                type="button"
                                                className="btn btn-sm btn-secondary dropdown-toggle"
                                                data-toggle="dropdown"
                                                aria-haspopup="true"
                                                aria-expanded="false"> Actions </button>

                                            <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.viewConsent(dataRequest.consent_object_id)} >
                                                    View </button>
                                                <div className="dropdown-divider"></div>
                                                <button
                                                    className="dropdown-item"
                                                    data-toggle="modal" data-target="#consentModal"
                                                    onClick={() => this.viewQuickly(dataRequest)} >
                                                    View Quickly </button>
                                                <div className="dropdown-divider"></div>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.deleteConsent(dataRequest.consent_object_id)} >
                                                    Delete </button>
                                            </div>
                                        </div>
                                    </td> */}
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <hr />
                    <hr />
                    <hr />
                </div>
            </div></div>
        )
    }
}
export default withRouter(DataRequestsComponentHIP);