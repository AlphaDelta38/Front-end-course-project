
import DoctorManagementSection from "../components/AdminPanel/DoctorManagementSection";
import React from "react";
import NewsManagementSection from "../components/AdminPanel/NewsManagementSection";


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

