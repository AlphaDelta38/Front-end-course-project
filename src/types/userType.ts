




export interface IUser{
    first_name: string,
    last_name: string,
    date_of_birth: string,
    gender: string,
    phone: string,
    email: string,
    address: string,
}



export interface userPasswordUpdate{
    currentPassword: string;
    newPassword: string;
}