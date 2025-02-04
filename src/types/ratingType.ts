import {DoctorsItemInerface} from "./doctorsType";
import {PatientsInterface} from "./patientsType";


export interface ratingItem {
    id: number,
    doctor_id: number;
    patient_id: number;
    rating: number;
    doctor: Omit<DoctorsItemInerface, "roles" | "raitings" | "appointments" | "speciality">;
    patient: Omit<PatientsInterface, any>;
}