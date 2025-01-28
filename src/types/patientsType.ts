
import {ViewManageDataStructure} from "../components/AdminPanel/ViewManageDataComponent";


export interface PatientsInterface{
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender: string;
    phone: string;
    email: string;
    address: string;
    insurance_number: string;
}


export interface viewDataReturnOnSubmitInterface extends Omit<PatientsInterface, "id">{
    id?: number
    password?: string
}


export interface createPatientRequestInterface extends Omit<PatientsInterface, "id">{
    password?: string
}





export const dataViewContainer: ViewManageDataStructure[] = [
    {
        fieldName: "fullName",
        datBaseFieldName: null,
        beAbleDeActive: false,
        unitedKey: ["first_name", "last_name"]
    },
    {
        fieldName: "email",
        datBaseFieldName: "email",
        beAbleDeActive: false,
    },
    {
        fieldName: "birthday",
        datBaseFieldName: "date_of_birth",
        beAbleDeActive: false,
        type: `date`,
    },
    {
        fieldName: "gender",
        datBaseFieldName: "gender",
        beAbleDeActive: false,
    },
    {
        fieldName: "phone",
        datBaseFieldName: "phone",
        beAbleDeActive: false,
        type: `number`,
    },
    {
        fieldName: "address",
        datBaseFieldName: "address",
        beAbleDeActive: false,
    },
    {
        fieldName: "insurance",
        datBaseFieldName: "insurance_number",
        beAbleDeActive: false,
    },
    {
        fieldName: "password",
        datBaseFieldName: "password",
        beAbleDeActive: true,
    },
]