
import DoctorManagementSection from "../components/AdminPanel/DoctorManagementSection";
import React, {CSSProperties} from "react";
import NewsManagementSection from "../components/AdminPanel/NewsManagementSection";
import PatientManagementSection from "../components/AdminPanel/PatientManagementSection";
import DiagnosesManagementSection from "../components/AdminPanel/DiagnosesManagementSection";
import ServicesManagementSection from "../components/AdminPanel/ServicesManagementSection";
import SpecialityManagementSection from "../components/AdminPanel/SpecialityManagementSection";
import AppointmentsManagementSection from "../components/AdminPanel/AppointmentsManagementSection";


export interface sectionActivities{
    mainSection: mainSections,
    underSection: underSection | null,
    chosenAttribute: chosenAttribute | null,
    chosenUnderSection: underSection,
    chosenMainSection: mainSections,
}


export enum mainSections{
    doctor ="doctor",
    patient ="patient",
    news ="news",
    diagnoses="diagnoses",
    services="services",
    speciality="speciality",
    appointments="appointments",
}

export enum underSection{
    actions ="Actions",
}


export enum chosenAttribute{
    create ="create",
    read ="read",
    update ="update",
    delete ="delete",
    management="management",
}


interface chosenAttributeWithComponent{
    attribute: chosenAttribute,
    element?: () => React.ReactNode;
}


interface UnderSection {
    name: underSection;
    attributes: chosenAttributeWithComponent[];
}


interface sideBarAdminPanelElementsInterFace {
        svgIconPath: string,
        mainSection: mainSections;
        underSections: UnderSection[];
}

export const sideBarAdminPanelElements: sideBarAdminPanelElementsInterFace[] = [
     {
         svgIconPath: "DoctorIcon",
        mainSection: mainSections.doctor,
        underSections: [
            {
                name: underSection.actions,
                attributes: [
                    {
                        attribute: chosenAttribute.management,
                        element: DoctorManagementSection
                    }
                ],
            },
        ],
    },
    {
        svgIconPath: "PatientIcon",
        mainSection: mainSections.patient,
        underSections: [
            {
                name: underSection.actions,
                attributes: [
                    {
                        attribute: chosenAttribute.management,
                        element: PatientManagementSection
                    }
                ],
            },
        ],
    },
    {
        svgIconPath: "NewsIcon",
        mainSection: mainSections.news,
        underSections: [
            {
                name: underSection.actions,
                attributes: [
                    {
                        attribute: chosenAttribute.management,
                        element: NewsManagementSection
                    },
                ],
            },
        ],
    },
    {
        svgIconPath: "HeartBeatIcon",
        mainSection: mainSections.diagnoses,
        underSections: [
            {
                name: underSection.actions,
                attributes: [
                    {
                        attribute: chosenAttribute.management,
                        element: DiagnosesManagementSection
                    },
                ],
            },
        ],
    },
    {
        svgIconPath: "HeartOfCapsuleIcon",
        mainSection: mainSections.services,
        underSections: [
            {
                name: underSection.actions,
                attributes: [
                    {
                        attribute: chosenAttribute.management,
                        element: ServicesManagementSection
                    },
                ],
            },
        ],
    },
    {
        svgIconPath: "SpecialityIcon",
        mainSection: mainSections.speciality,
        underSections: [
            {
                name: underSection.actions,
                attributes: [
                    {
                        attribute: chosenAttribute.management,
                        element: SpecialityManagementSection
                    },
                ],
            },
        ],
    },
    {
        svgIconPath: "TimerIcon",
        mainSection: mainSections.appointments,
        underSections: [
            {
                name: underSection.actions,
                attributes: [
                    {
                        attribute: chosenAttribute.management,
                        element: AppointmentsManagementSection
                    },
                ],
            },
        ],
    },
];



export enum searchTypeEnum{
    id= "id",
    email="email",
    date_of_birth="date_of_birth",
    speciality="speciality",
    phone="phone",
    office_number="office_number",
    first_name = "first_name",
    last_name = "last_name",
    gender = "gender",
    image_link= "image_link",
    insurance_number="insurance_number",
    diagnosis="diagnosis",
    service="service",
    specialityTitleField="name",
    doctor="doctor",
    patient="patient",
    services="services",
    date="date",
    time="time",
    status ="status",
}

export enum searchForwardsEnum{
    UP = "UP",
    DOWN="DOWN"
}




export interface searchObjectsInterface{
    searchType: searchTypeEnum,
    searchForward: searchForwardsEnum,
    limit: number,
    page: number,
}




interface AdminTableDataInterface{
    value: string,
    searchType: searchTypeEnum
    key: string[],
    styles?: {data?: CSSProperties, headers?: CSSProperties}
}


export type AdminTableDataType = AdminTableDataInterface[]


