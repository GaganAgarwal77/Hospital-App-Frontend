import ApiService from "./ApiService";


const PATIENT_API_BASE_URL = '/patient';
const CITIES = '/cities';
class PatientService {

    getPatients() {
        return ApiService.getAll(PATIENT_API_BASE_URL + '/get-all-patients');
    }

    getPatientById(id) {
        return ApiService.getOneById(PATIENT_API_BASE_URL + '/get-details?patientID=' + id);
    }

    // fetchPatientByEmail(email) {
    //     return axios.get(PATIENT_API_BASE_URL + '/find-by-email/' + email);
    // }

    deletePatient(Id) {
        return ApiService.deleteById(PATIENT_API_BASE_URL + '/' + Id);
    }

    addPatient(patient) {
        return ApiService.post('/auth/register/patient', patient);
    }

    editPatient(patient) {
        return ApiService.put(PATIENT_API_BASE_URL + '/' + patient.id, patient);
    }
    getCities() {
        return ApiService.getAllDatas(PATIENT_API_BASE_URL+CITIES);
    }
}

export default new PatientService();