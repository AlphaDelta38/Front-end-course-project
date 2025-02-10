


export function dateConvert(date: string){

    if(!date){
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

export function formatDateForInput(dateString: string): string {
    if(dateString === ""){
        return ""
    }
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
}