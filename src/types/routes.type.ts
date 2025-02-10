




export enum routesEnum{
    other = "/*",
    general = "/general",
    login = "/auth/login",
    registration = "/auth/registration",
    news= "/news/:id",
    doctors= "/doctors",
    admin= "/admin",
    profile= "/profile",
    profilePersonalData= "/profile/personalData",
    profileAppointmentsHistory= "/profile/appointmentsHistory",
    profileAChangePassword= "/profile/changePassword",
}



export interface routes{
    role_id: number
    routes: string[]
}