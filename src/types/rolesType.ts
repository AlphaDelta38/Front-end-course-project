




export interface RoleInterface {
    id: number,
    role: string
}


export interface rolesAdminPanelInterface{
    role: string,
    color: string,
}

export enum roleControllerEnumAction{
    add="add",
    delete = "delete"
}