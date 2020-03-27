export const stringToDate = (pattern: string, date: string):Date => {
    var mydate: Date=new Date()
    if (pattern === "dd-MM-yyyy") {
        var parts = date.split('-');
        mydate = new Date(Number.parseInt(parts[2]), Number.parseInt(parts[1]), Number.parseInt(parts[0]));
    }
    return mydate
}

export const dateToString=(pattern:string,date:Date):string=>{
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
}