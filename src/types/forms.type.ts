







export interface registerForm{
    fullName?: string,
    phone?: string,
    address?: string,
    date?: string,
    email?: string,
    password?: string,
    checkPassword?: string,
}

export interface loginForm{
    email: string,
    password: string,
    isPatient: boolean,
}



export enum typeOfState{
    register="register",
    login ="login",
}