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


export interface specialityInterface{
    id: number,
    name: string,
}



export interface DoctorsItemInerface{
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    date_of_birth: Date,
    gender: string,
    address: string | null,
    phone: string,
    office_number: string,
    speciality: specialityInterface,
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
    notes?: string,
    prescription?: string,
    date: string,
    time: string,
    status: boolean,
}


export  interface doctorAdminPanelDataInterface extends  Omit<DoctorsItemInerface, "roles" | "raitings" | "appointments" | "id" | "office_number" | "image_link" | "date_of_birth" | "speciality" | "address">{
    id?: number,
    password?: string,
    office_number?: number ,
    image_link?: string,
    address?: string,
    date_of_birth: Date | null,
    roles?: string[],
    speciality: string,
}





export interface createDoctor{
    first_name: string
    last_name: string
    date_of_birth: Date
    gender: string
    phone?: string
    email: string
    address?: string
    office_number?:string
    speciality_id?: number
    image_link?: string
    roles: string[]
    password?: string,
}

export interface updateServiceInterface{
    id: number,
    newDoctor: createDoctor,
}