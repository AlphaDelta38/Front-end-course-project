import {DoctorsItemInerface} from "./doctorsType";


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


interface UnderSection {
    name: underSection;
    attributes: string[];
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
                attributes: ["Management"],
            },
        ],
    },
    {
        svgIconPath: "PatientIcon",
        mainSection: mainSections.patient,
        underSections: [
            {
                name: underSection.actions,
                attributes: ["Management"],
            },
        ],
    },
];



export enum searchTypeEnum{
    id= "id",
    email="email",
    birthday="birthday",
    speciality="speciality",
    phone="phone",
    office_number="office_number",
    fullname="fullname",
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

