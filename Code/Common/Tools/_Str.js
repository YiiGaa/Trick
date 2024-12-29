//TIPS::Change date object to the format string
//>>date::Date object, e.g., new Date()
//>>format::The format of the output string, e.g., "yyyy-MM-dd hh:mm:ss.S"
//>>return::The format string
//>>return::""
function StrDate(date, format = "yyyy-MM-dd hh:mm:ss") {
    try{
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        return format
            .replace('yyyy', year)
            .replace('yy', String(year).slice(2))
            .replace('MM', String(month).padStart(2, '0'))
            .replace('M', month)
            .replace('dd', String(day).padStart(2, '0'))
            .replace('d', day)
            .replace('hh', String(hours).padStart(2, '0'))
            .replace('h', hours)
            .replace('mm', String(minutes).padStart(2, '0'))
            .replace('m', minutes)
            .replace('ss', String(seconds).padStart(2, '0'))
            .replace('s', seconds)
            .replace('S', milliseconds);
    }catch(e){
        console.debug("Common-Tools StrDate exception", e);
    }
    return "";
}

//TIPS::Get random string
//>>length::Length of the output string
//>>return::The random string
//>>return::""
function StrRandom(length = 8) {
    try{
        let lengthNum = Number(length)
        lengthNum = isNaN(lengthNum) ? 8 : lengthNum;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        randomString += characters.charAt(Math.floor(Math.random() * 26));
        randomString += characters.charAt(Math.floor(Math.random() * 26) + 26);
        randomString += characters.charAt(Math.floor(Math.random() * 10) + 52);
        for (let i = 3; i < lengthNum; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return randomString.split('').sort(() => Math.random() - 0.5).join('');
    }catch(e){
        console.debug("Common-Tools StrDate exception", e);
    }
    return ""
}

export {StrDate, StrRandom};