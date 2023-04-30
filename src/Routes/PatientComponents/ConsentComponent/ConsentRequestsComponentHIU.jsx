import React, { Component } from 'react'
import Moment from 'react-moment';
import * as alertify from 'alertifyjs';
import "alertifyjs/build/css/alertify.css";
import "alertifyjs/build/css/themes/default.css";
import "@material/react-checkbox/dist/checkbox.css";
import AlertifyService from '../../../services/AlertifyService';
import { withRouter } from 'react-router'; 
import DoctorService from '../../../services/DoctorService';

let filterAllConsent = [];
let filters = ["consentName", "consentStatus"];
class ConsentRequestsComponentHIU extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            consentObjects: [],
            transactions: [],
        }
    }
    componentDidMount() {
        this.getConsents();
    }

    getConsents() {
        DoctorService.getConsentTransactionsHIU(window.localStorage.getItem("token")).then(res => {
            console.log(res)
            let txns = res.data.consentreqs;
            DoctorService.getConsentObjectsHIU(window.localStorage.getItem("token")).then(res => {
                console.log(res)
                let consents = res.data.consent_objs;
                console.log(consents)
                console.log(txns)
                consents.forEach(consent => {
                    let txn = txns.find(txn => txn.consent_object_id.consent_object_id === consent.consent_object_id);
                    if (txn) {
                        consent.consent_status = txn.consent_status;
                    }
                })                        
                this.setState({ consentObjects: consents, transactions: txns });
            })
        })
    }
    onChangeSearchByStatusOrDate = (e) => { this.filterConsents(e.target.value); }
    filterConsents(value) {
        var results = [];
        if (value !== '') {
            results = filterAllConsent.filter(consentObject => {
                let find = false;
                //filters.forEach(filter=>{
                filters.forEach(function (filter) {
                    let control = consentObject[filter].toLowerCase().indexOf(value.toLowerCase());
                    if (control > -1) find = true;
                });
                return find;
            });
            this.setState({ consentObjects: results });
        }
        else { this.loadPatient(); }
    }
    limitingPatientDetail(data) {
        if (data.length < 31) return data;
        else return data.substr(0, 30) + "...";
    }
    deleteConsent(consentid) {
        alertify.confirm("Are you sure to delete the consentObject.",
            ok => {
                    //this.setState({ consentObjects: this.state.consentObjects.filter(p => p.consentid !== consentid) });
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
    viewQuickly(consentObject){
        this.setState({consentObject:consentObject});
    }
    render() {
        let {consentObjects, transactions} = this.state;
        return (
            <div className="row">
            <div className="col-lg-12">
                <hr />
                <p className="h3 d-flex justify-content-center">Sent Consent Requests</p>
                <hr />
                <div className="form-group">
                    <input type="text"
                        placeholder="Search Consent by consentObject Name or consentObject Status"
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
                                <th>Patient ABHA ID</th>
                                <th>Doctor ABHA ID</th>
                                <th>HIP ID</th>
                                <th>Date From</th>
                                <th>Date To</th>
                                <th>Valid Till</th>
                                <th>Consent Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {console.log(this.state)}
                            {this.state.consentObjects.map((consentObject, index) =>
                                <tr className="bg-default" key={consentObject.consent_object_id}>
                                    <td>{consentObject.patient_ehrb_id}</td>
                                    <td>{consentObject.doctor_ehrb_id}</td>
                                    <td>{consentObject.hip_id}</td>
                                    <td>
                                        <Moment format="YYYY/MM/DD HH:mm">
                                            {consentObject.date_from}
                                        </Moment>
                                    </td>
                                    <td>
                                        <Moment format="YYYY/MM/DD HH:mm">
                                            {consentObject.date_to}
                                        </Moment>
                                    </td>
                                    <td>
                                        <Moment format="YYYY/MM/DD HH:mm">
                                            {consentObject.validity}
                                        </Moment>
                                    </td>
                                    <td>
                                        {consentObject.consent_status}
                                    </td>
                                    <td>
                                    <button
                                                    className="btn btn-primary"
                                                    onClick={() => this.viewConsent(consentObject.consent_object_id)} >
                                                    View </button>
                                       
                                    </td>
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
export default withRouter(ConsentRequestsComponentHIU);