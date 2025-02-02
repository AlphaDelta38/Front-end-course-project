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
        first_name: string
        last_name: string
    }
    patient: {
        first_name: string
        last_name: string
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