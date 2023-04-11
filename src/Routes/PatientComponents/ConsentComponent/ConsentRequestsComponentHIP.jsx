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
class ConsentRequestsComponentHIP extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.id,
            consentObjects: [],
            transactions: [],
        }
    }
    componentDidMount() {
        // this.getAllConsents();
        // this.getConsentTransactions();
        this.getAllConsents();
    }
    getAllConsents() {
        DoctorService.getConsentObjectsHIP(window.localStorage.getItem('token')).then(res => {
            this.setState({ consentObjects: res.data.consent_objs });
        })  
        // this.setState({ consentObjects: [
        //     {
        //         "consent_object_id": "123-456-789",
        //         "signed_consent_object": 'a'.repeat(100),
        //         "public_key": 'p'.repeat(100),
        //         "txnID": "123-456-789"
        //     }
        // ]});
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
                <p className="h3 d-flex justify-content-center">Recieved Consent Objects</p>
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
                                <th>Consent Object ID</th>
                                <th>Signed Consent Object</th>
                                <th>Public Key</th>
                                <th>Transaction ID</th>
                                {/* <th>Valid Till</th>
                                <th>Consent Status</th> */}
                                {/* <th>Action</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {console.log(this.state)}
                            {this.state.consentObjects.map((consentObject, index) =>
                                <tr className="bg-default" key={consentObject.consent_object_id}>
                                    <td>{consentObject.consent_object_id}</td>
                                    <td style={{overflow:"hidden", textOverflow:"ellipsis", maxWidth:"10px"}}>{consentObject.signed_consent_object}</td>
                                    <td style={{overflow:"hidden", textOverflow:"ellipsis", maxWidth:"10px"}}>{consentObject.public_key}</td>
                                    <td>{consentObject.txnID}</td>
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
                                                    onClick={() => this.viewConsent(consentObject.consent_object_id)} >
                                                    View </button>
                                                <div className="dropdown-divider"></div>
                                                <button
                                                    className="dropdown-item"
                                                    data-toggle="modal" data-target="#consentModal"
                                                    onClick={() => this.viewQuickly(consentObject)} >
                                                    View Quickly </button>
                                                <div className="dropdown-divider"></div>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => this.deleteConsent(consentObject.consent_object_id)} >
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
export default withRouter(ConsentRequestsComponentHIP);