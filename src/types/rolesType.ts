import {routes} from "./routes.type";


export interface RoleInterface {
    id: number,
    role: string
    routeAccess?: routes
}


export interface rolesAdminPanelInterface{
    role: string,
    color: string,
}

export enum roleControllerEnumAction{
    add="add",
    delete = "delete"
}