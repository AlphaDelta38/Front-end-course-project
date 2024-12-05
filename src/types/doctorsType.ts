import {date} from "yup";


interface raitingInterface{
    id: number,
    rating: number,
}

interface AppointmentsInterface{
    id: number
    patient_id: number
    doctor_id: number
    service_id: number
    date: Date
    time: string
    status: boolean
    createdAt: string
    diagnosis_id: number
}


export interface roleInterface{
    id: number,
    role: string
}



export interface DoctorsItemInerface{
    id: number,
    first_name: string,
    last_name: string,
    date_of_birth: Date,
    gender: string,
    phone: string,
    office_number: string,
    speciality: string,
    image_link: string,
    roles: roleInterface[],
    raitings:raitingInterface[],
    appointments: AppointmentsInterface[],
}


export interface DoctorsCardsInterface extends Omit<DoctorsItemInerface, "raitings">{
    raitings: number,
    count: number,
    bookedTime: string[],

}


export interface createAppointments{
    patient_id: number,
    doctor_id: number,
    service_id: number,
    date: string,
    time: string
    status: boolean
}