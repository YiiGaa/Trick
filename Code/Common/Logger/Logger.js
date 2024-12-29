import * as Tools from "/Code/Common/Tools/Tools"

let identity = Tools.StrRandom(8);
const Logger = {
    Format:function(level='info', message){
        return `[${level}][${identity}][${Tools.StrDate(new Date(), "hh:mm:ss.S")}]${message}`;
    },
    SetId:function(id=null){
        let backup = identity;
        if(id == null){
            identity = Tools.StrRandom(8);
            return backup;
        }
        identity = id;
        return backup;
    },
    GetId:function(){
        return identity;
    },
    Header:function(){
        return `[${identity}][${Tools.StrDate(new Date(), "hh:mm:ss.S")}]`;
    },
}
export default Logger;