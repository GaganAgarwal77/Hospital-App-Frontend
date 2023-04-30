import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter } from "react-router-dom"; //Router,
import ListPatientComponent from './Routes/PatientComponents/ListPatientComponent';
import ViewPatientComponent from './Routes/PatientComponents/ViewPatientComponent';
import AddPatientComponent from './Routes/PatientComponents/AddPatientComponent';
import EditPatientComponent from './Routes/PatientComponents/EditPatientComponent';
import ListDoctorComponent from './Routes/DoctorComponents/ListDoctorComponent';
import ViewDoctorComponent from './Routes/DoctorComponents/ViewDoctorComponent';
import AddDoctorComponent from './Routes/DoctorComponents/AddDoctorComponent';
import EditDoctorComponent from './Routes/DoctorComponents/EditDoctorComponent';
import NotFoundComponent from './NotFound/NotFoundComponent';
import ViewProblemComponent from './Routes/PatientComponents/ProblemComponent/ViewProblemComponent';
import IndexPage2 from './Routes/IndexPage2';
import { Lines } from 'react-preloaders';
import ReceipeFormComponent from './Routes/PatientComponents/ReceipeComponent/ReceipeFormComponent';
import NavbarComponent from './Navbar/NavbarComponent';
import ProblemFormComponent from './Routes/PatientComponents/ProblemComponent/ProblemFormComponent';
import CreateConsentRequest from './Routes/PatientComponents/CreateConsentRequest';
import ViewConsentComponent from './Routes/PatientComponents/ConsentComponent/ViewConsentComponent';
import CreateDataRequest from './Routes/PatientComponents/CreateDataRequest';
import LoginDoctorComponent from './Routes/DoctorComponents/LoginDoctorComponent';
import ConsentRequestsComponentHIP from './Routes/PatientComponents/ConsentComponent/ConsentRequestsComponentHIP';
import DataRequestsComponentHIP from './Routes/PatientComponents/DataRequestsComponentHIP';
import DataRequestsComponentHIU from './Routes/PatientComponents/DataRequestsComponentHIU';
import ConsentRequestsComponentHIU from './Routes/PatientComponents/ConsentComponent/ConsentRequestsComponentHIU';
import ViewRecievedProblemComponent from './Routes/PatientComponents/ProblemComponent/ViewRecievedProblemComponent';
// https://www.youtube.com/watch?v=DQ93TxqKkWo
function App() {
  return (            
    <div className="App" >
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
          <NavbarComponent />
          <a href="/">
            {/* style={{width: 400, height: 100}}  */}
            <img style={{ height: "100px", margin: "10px 0"}}  
            src="https://www.phuketinternationalhospital.com/en/wp-content/themes/pih/images/logo-nonetext.png" alt="" />
          </a>
            <BrowserRouter>
              <Switch>
                <Route path="/" exact component={ListPatientComponent} />
                <Route path="/patients" component={ListPatientComponent} />
                <Route path="/view-patient/:id" component={ViewPatientComponent} />
                <Route path="/add-patient" component={AddPatientComponent} />
                <Route path="/edit-patient" component={EditPatientComponent} />

                <Route path="/add-doctor" component={AddDoctorComponent} />
                <Route path="/login-doctor" component={LoginDoctorComponent} />
                <Route path="/edit-doctor" component={EditDoctorComponent} />
                <Route path="/view-doctor/:id" component={ViewDoctorComponent} />
                <Route path="/doctors" component={ListDoctorComponent} />

                <Route path="/request-consent" component={CreateConsentRequest} />
                <Route path="/consent/:consentid" component={ViewConsentComponent} />
                <Route path="/sent-consent-requests" component={ConsentRequestsComponentHIU} /> 
                <Route path="/recieved-consent-requests" component={ConsentRequestsComponentHIP} /> 

                <Route path="/recieved-data-requests" component={DataRequestsComponentHIP} /> 
                <Route path="/sent-data-requests" component={DataRequestsComponentHIU} /> 

                <Route path="/request-data" component={CreateDataRequest}  />
                
                <Route path="/add-record" component={ProblemFormComponent} />
                <Route path="/record/:recordid" component={ViewProblemComponent} />
                <Route path="/recieved-record/:recordid" component={ViewRecievedProblemComponent} />
                <Route path="/receipe-form" component={ReceipeFormComponent} />
                <Route path="/notfound" component={NotFoundComponent} />
                <Route path="/de" component={IndexPage2} />
                <Route path="*" component={NotFoundComponent} />
              </Switch>
            </BrowserRouter>
          </div>
        </div>
      </div>
      {/* <Lines /> */}
      {/* <Lines animation="slide-left" />; */}
      
      <Lines animation="slide" />

      {/* <Lines animation="slide-down" />; */}

      {/* <Lines animation="slide-right" />; */}
    </div>
  );
}

export default App;