


export function cleanSpaces(str:string) {
    return str.trim().replace(/\s+/g, ' ');
}



export const containsSubstring = (input: string,  query: string) => {
    return input.toLowerCase().includes(query.toLowerCase());
};
