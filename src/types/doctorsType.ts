







interface raitingInterface{
    id: number,
    rating: number,
}



interface roleInterface{
    id: number,
    role: string
}



export interface DoctorsItemInerface{
    id: number,
    first_name: string,
    last_name: string,
    date_of_birth: Date,
    gender: string,
    phone: string,
    office_number: string,
    speciality: string,
    image_link: string,
    roles: roleInterface[],
    raitings:raitingInterface[],
}


export interface DoctorsCardsInterface extends Omit<DoctorsItemInerface, "raitings">{
    raitings: number,
    count: number,
}