


export function dateConvert(date: string){
    const isoDate = date;

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(isoDate));

    return formattedDate
}
