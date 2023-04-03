import React, { Component } from 'react' 
import { withRouter } from 'react-router';
import Moment from 'react-moment';

class DoctorDetailModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: props.doctor.id,
            name: props.doctor.name,
            lastname: props.doctor.lastname,
            email: props.doctor.email,
            phoneNo: props.doctor.phoneNo,
            bornDate: props.doctor.bornDate,
            gender: props.doctor.gender,
            city: props.doctor.city,
            message: ''
        }; 
    } 
    render() {
        var age = null;
        if (this.props.doctor.bornDate != null) {
            var born = Number(this.props.doctor.bornDate.substr(0, 4));
            var now = Number(new Date().toLocaleDateString('tr-TR').substr(6, 4));
            age = now - born;
        }
        return (
            <div className="modal fade" id="doctorModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title" id="exampleModalLabel">Doctor Detail</h3>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <div className="card" >
                                    <div className="card-header"> <h3>{this.props.doctor.name} {this.props.doctor.lastname}</h3></div>
                                    <ul className="text-left list-group list-group-flush">
                                        <li className="list-group-item"><b>Doctor id : </b>{this.props.doctor.id}</li>
                                        <li className="list-group-item"><b>Name : </b>{this.props.doctor.name}</li>
                                        <li className="list-group-item"><b>Last Name : </b>{this.props.doctor.lastname}</li>
                                        <li className="list-group-item"><b>Phne No : </b>{this.props.doctor.phoneNo}</li>
                                        <li className="list-group-item"><b>Age : </b>
                                            {age !== null ? age : null}
                                        </li>
                                        <li className="list-group-item"><b>Born Date : </b>
                                            {this.props.doctor.bornDate !== null ?
                                                <Moment format="YYYY / MM / DD  HH:mm"> {this.props.doctor.bornDate} </Moment> : null
                                            }
                                        </li>
                                        <li className="list-group-item"><b>Email : </b>{this.props.doctor.email}</li>
                                        <li className="list-group-item"><b>City : </b>{this.props.doctor.city}</li>
                                        <li className="list-group-item"><b>Gender : </b>{this.props.doctor.gender}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(DoctorDetailModal)
