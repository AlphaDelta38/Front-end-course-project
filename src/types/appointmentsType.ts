import {number} from "yup";


export interface AppointmentInterface {
    id: number
    patient_id: number
    doctor_id: number
    service_id: number
    diagnosis_id: number
    date: string
    status: boolean
    time: string
    notes?: string
    prescription?: string
    doctor: {
        id: number
        first_name: string
        last_name: string
        date_of_birth: string;
        gender: string;
        phone?: string;
        email: string;
        address?: string;
        office_number?: string;
        speciality_id: number;
        image_link?: string;
    }
    patient: {
        id: number
        first_name: string
        last_name: string
        date_of_birth: string;
        gender: string;
        phone?: string;
        email: string;
        address?: string;
        insurance_number?: string;
    }
    diagnosis: {
        diagnosis: string
    }
    services: {
        service: string
    }

}


export interface bookedTimeRequestInterface{
    doctor_id: number,
    date: string
}


export interface AppointmentInterfaceUpdate extends Omit<AppointmentInterface, "doctor" | "patient" | "diagnosis" | "services" | "diagnosis_id" > {
    diagnosis_id?: number
}