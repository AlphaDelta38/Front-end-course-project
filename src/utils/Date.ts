


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


export function calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    // Коррекция возраста, если день рождения еще не наступил в этом году
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}