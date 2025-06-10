import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"
import ExpiredStorage from "expired-storage"

const Config = Tools.Merge(Configs.module._OperStorage,{});

const storageLocal = new ExpiredStorage(localStorage);
const storageSession = new ExpiredStorage(sessionStorage);

function Save(moduleParam, passParam, result) {
    //STEP::Get setting
    const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
    const _value = Tools.ParamRead("_value", null, moduleParam, passParam);
    const _expire = Tools.ParamRead("_expire", 0, moduleParam, passParam);
    const _isSession = Tools.ParamRead("_isSession", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperStorage Save _key:", _key);
    console.debug(Logger.Header(), "Module-_OperStorage Save _value:", _value);
    console.debug(Logger.Header(), "Module-_OperStorage Save _expire:", _expire);
    console.debug(Logger.Header(), "Module-_OperStorage Save _isSession:", _isSession);

    //STEP::Clean expired item
    storageLocal.clearExpired();
    storageSession.clearExpired();

    //STEP::Judge _value is illegal
    if(_value === undefined || _value === null){
        console.debug(Logger.Header(), "Module-_OperStorage Save value illegal, _value:", _value);
        return ErrorCode.ERR_Module__OperStorage_Save_Illegal;
    }

    //STEP::Save item
    const storage = _isSession?storageSession:storageLocal;
    if (_expire > 0)
        storage.setJson(_key, _value, _expire);
    else
        storage.setJson(_key, _value);

    return result;
}

function Get(moduleParam, passParam, result) {
    //STEP::Get setting
    const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
    let _resultKey = Tools.ParamRead("_resultKey", "", moduleParam, passParam);
    const _isNullError = Tools.ParamRead("_isNullError", true, moduleParam, passParam);
    const _isSession = Tools.ParamRead("_isSession", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperStorage Get _key:", _key);
    console.debug(Logger.Header(), "Module-_OperStorage Get _resultKey:", _resultKey);
    console.debug(Logger.Header(), "Module-_OperStorage Get _isNullError:", _isNullError);
    console.debug(Logger.Header(), "Module-_OperStorage Get _isSession:", _isSession);

    //STEP::Get item
    const storage = _isSession?storageSession:storageLocal;
    const data = storage.getJson(_key);
    if(data === null){
        console.debug(Logger.Header(), "Module-_OperStorage Get value null, _key:", _key);
        if(_isNullError)
            return ErrorCode.ERR_Module__OperStorage_Get_Null;
        return result;
    }

    //STEP::Input result
    if(_resultKey==="" && (!(data instanceof Object) || Array.isArray(data)))
        _resultKey = "result";
    if(_resultKey!==""){
        passParam[_resultKey] = data;
    }else{
        Tools.ObjectClean(passParam);
        if(!Tools.ObjectCopy(passParam, data)){
            passParam["result"] = data;
        }
    }

    return result;
}

function Clean(moduleParam, passParam, result) {
    //STEP::Get setting
    const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
    const _isSession = Tools.ParamRead("_isSession", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperStorage Clean _key:", _key);
    console.debug(Logger.Header(), "Module-_OperStorage Clean _isSession:", _isSession);

    //WHEN::Clean expired item
    storageLocal.clearExpired();
    storageSession.clearExpired();

    //WHEN::Clean all item
    if(_key==="") {
        if(_isSession)
            storageSession.clear();
        else
            storageLocal.clear();
    }

    //WHEN::Clean single item
    else {
        if(_isSession)
            storageSession.removeItem(_key);
        else
            storageLocal.removeItem(_key);
    }

    return result;
}

function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_OperStorage DoStart _action:", _action);

        //STEP::Action
        switch (_action){
            case "save":
                result = Save(moduleParam, passParam, result);
                break;
            case "get":
                result = Get(moduleParam, passParam, result);
                break;
            case "clean":
                result = Clean(moduleParam, passParam, result);
                break;
            default:
                console.debug(Logger.Header(), "Module-_OperStorage DoStart lack action:", _action);
                return ErrorCode.ERR_Module__OperStorage_Action_Lack;
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_OperStorage DoStart exception", e);
        return ErrorCode.ERR_Module__OperStorage_Exception;
    }
    return result;
}

export default function _OperStorage(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_OperStorage start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_OperStorage end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}