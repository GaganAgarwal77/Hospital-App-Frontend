import ApiService from "./ApiService";


const DOCTOR_API_BASE_URL = '/doctor';
const CITIES = '/cities';
class DoctorService {

    getDoctors() {
        return ApiService.getAll(DOCTOR_API_BASE_URL);
    }

    getDoctorById(doctorId) {
        return ApiService.getOneById(DOCTOR_API_BASE_URL + '/find-by-id/' + doctorId);
    }

    // fetchDoctorByEmail(email) {
    //     return axios.get(DOCTOR_API_BASE_URL + '/find-by-email/' + email);
    // }

    deleteDoctor(Id) {
        return ApiService.deleteById(DOCTOR_API_BASE_URL + '/' + Id);
    }

    addDoctor(doctor) {
        return ApiService.post(DOCTOR_API_BASE_URL, doctor);
    }

    editDoctor(doctor) {
        return ApiService.put(DOCTOR_API_BASE_URL + '/' + doctor.doctorid, doctor);
    }
    getCities() {
        return ApiService.getAllDatas(DOCTOR_API_BASE_URL+CITIES);
    }
}

export default new DoctorService();