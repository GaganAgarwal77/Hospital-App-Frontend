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

    deleteDoctor(Id) {
        return ApiService.deleteById(DOCTOR_API_BASE_URL + '/' + Id);
    }

    addDoctor(doctor) {
        return ApiService.post('/api/v1/auth/register/doctor', doctor);
    }

    editDoctor(doctor) {
        return ApiService.put(DOCTOR_API_BASE_URL + '/' + doctor.id, doctor);
    }
    getCities() {
        return ApiService.getAllDatas(DOCTOR_API_BASE_URL+CITIES);
    }
}

export default new DoctorService();