

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
    delete ="delete"
}


interface UnderSection {
    name: underSection;
    attributes: string[];
}


interface sideBarAdminPanelElementsInterFace {
        mainSection: mainSections;
        underSections: UnderSection[];
}

export const sideBarAdminPanelElements: sideBarAdminPanelElementsInterFace[] = [
     {
        mainSection: mainSections.doctor,
        underSections: [
            {
                name: underSection.actions,
                attributes: ["Create", "Read", "Update", "Delete"],
            },
        ],
    },
    {
        mainSection: mainSections.patient,
        underSections: [
            {
                name: underSection.actions,
                attributes: ["Create", "Read", "Update", "Delete"],
            },
        ],
    },
];
