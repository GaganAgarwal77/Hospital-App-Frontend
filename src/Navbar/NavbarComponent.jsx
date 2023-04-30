import React, { Component } from 'react'

export default class NavbarComponent extends Component {
    render() {
        return (
            <div className="sticky-top">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/">Home</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Patient
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item"  href="/patients">Patients</a>
                                    {window.localStorage.getItem("token") == null &&  <a className="dropdown-item"  href="/add-patient">Add Patient</a>}
                                </div>
                            </li>
                            {window.localStorage.getItem("token") == null && 
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Doctor
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item"  href="/doctors">Doctors</a>
                                    <a className="dropdown-item"  href="/add-doctor">Add Doctor</a>
                                    <a className="dropdown-item"  href="/login-doctor">Login Doctor</a>
                                </div>
                            </li>
                            }    
                        <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Consent Requests
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item"  href="/sent-consent-requests">Sent</a>
                                    <a className="dropdown-item"  href="/recieved-consent-requests">Recieved</a>
                                </div>
                            </li>  
                                                    <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Data Requests
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <a className="dropdown-item"  href="/sent-data-requests">Sent</a>
                                    <a className="dropdown-item"  href="/recieved-data-requests">Recieved</a>
                                </div>
                            </li>        
                        {window.localStorage.getItem("token") != null &&
                            <a className="nav-link" href={"/view-doctor/"+window.localStorage.getItem("doctorID")}>Doctor Profile</a>
                        }
                                                    {window.localStorage.getItem("token") != null &&
                            <a className="nav-link" type="submit" onClick={() => {window.localStorage.removeItem("token");window.location.href='/'}}>Logout</a>}
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}
