


export interface NewsItemInterface{
    id: number,
    title: string,
    text: string,
    image_link: string,
    createdAt: string,
    updatedAt: string,
}

export interface newsChangeRequestProps{
    id: number,
    title: string,
    text: string,
    image_link: string,
}