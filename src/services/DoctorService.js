import ApiService from "./ApiService";


const DOCTOR_API_BASE_URL = '/doctor';
const CITIES = '/cities';
class DoctorService {

    getDoctors() {
        return ApiService.getAll(DOCTOR_API_BASE_URL + '/get-all');
    }

    getDoctorById(id) {
        return ApiService.getOneById(DOCTOR_API_BASE_URL + '/get-by-id?doctorID=' + id);
    }

    // fetchDoctorByEmail(email) {
    //     return axios.get(DOCTOR_API_BASE_URL + '/find-by-email/' + email);
    // }

    getConsentObjectByDoctorId(id) {
        return ApiService.getAll('/consent/fetch-id?doctorID='+id);
    }

    getConsentTransactionByDoctorId(id) {
        return ApiService.getAll('/consent/consent-transaction-by-doctor?doctorID='+id);
    }

    getConsentObjectByConsentID(id, token) {
        return ApiService.getAuth('/consent/consent-object?consentID='+id, token);
    }

    getConsentTransacationByConsentID(id, token) {
        return ApiService.getAuth('/consent/consent-transaction?consentID='+id, token);
    }

    getConsentTransactionsHIU(token) {
        return ApiService.getAuth('/consent/fetch-transactions-hiu', token);
    }
    
    getConsentObjectsHIU(token) {
        return ApiService.getAuth('/consent/fetch-consents-hiu', token);
    }   

    getConsentObjectsHIP(token) {
        return ApiService.getAuth('/consent/fetch-consents-hip', token);
    }
    
    getDataRequestsHIP(token) {
        return ApiService.getAuth('/consent/fetch-data-requests-hip', token);
    }
    
    getDataRequestsHIU(token) {
        return ApiService.getAuth('/consent/fetch-data-requests-hiu', token);
    }

    deleteDoctor(Id) {
        return ApiService.deleteById(DOCTOR_API_BASE_URL + '/' + Id);
    }

    addDoctor(doctor) {
        return ApiService.post('/auth/register/doctor', doctor);
    }

    loginDoctor(doctor) {
        return ApiService.post('/auth/login/doctor', doctor);
    }
    
    generateConsentRequest(consentRequest, token) {
        return ApiService.postAuth('/consent/generate', consentRequest, token);
    }

    createDataRequest(data, token){
        return ApiService.postAuth('/data/request-data-hiu', data, token)
    }
    editDoctor(doctor) {
        return ApiService.put(DOCTOR_API_BASE_URL + '/' + doctor.id, doctor);
    }

    getHospitals() { 
        return ApiService.getAllDatas('/hospitals/fetch-all');
    }

    getCities() {
        return ApiService.getAllDatas(DOCTOR_API_BASE_URL+CITIES);
    }
}

export default new DoctorService();