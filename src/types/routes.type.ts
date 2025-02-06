




export enum routesEnum{
    other = "/*",
    general = "/general",
    login = "/auth/login",
    registration = "/auth/registration",
    news= "/news/:id",
    doctors= "/doctors",
    admin= "/admin",
}



export interface routes{
    role_id: number
    routes: string[]
}