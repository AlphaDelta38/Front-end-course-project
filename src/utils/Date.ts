


export function dateConvert(date: string){
    if(date.length === 0){
        return ""
    }

    const isoDate = date;
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(isoDate));

    return formattedDate
}



export function convertToInputTypeDate(isoDate: string){
    const formattedDate = isoDate.split("T")[0];
    return formattedDate
}