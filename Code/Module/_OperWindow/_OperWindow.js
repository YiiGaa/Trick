import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"

const Config = Tools.MergeDefault(Configs.module._OperWindow,{});

function Open(moduleParam, passParam, result) {
    //STEP::Get setting
    const _url = Tools.ParamRead("_url", "", moduleParam, passParam);
    const _target = Tools.ParamRead("_target", "_blank", moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperWindow Open _url:", _url);
    console.debug(Logger.Header(), "Module-_OperWindow Open _target:", _target);

    window.open(_url, _target);

    return result;
}

function Close(moduleParam, passParam, result) {
    console.debug(Logger.Header(), "Module-_OperWindow Close");

    //STEP::Action
    window.close();

    return result;
}

function Jump(moduleParam, passParam, result) {
    //STEP::Get setting
    const _url = Tools.ParamRead("_url", "", moduleParam, passParam);
    const _isReplace = Tools.ParamRead("_isReplace", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperWindow Jump _url:", _url);
    console.debug(Logger.Header(), "Module-_OperWindow Jump _isReplace:", _isReplace);

    //STEP::Action
    if(_isReplace)
        window.location.replace(_url)
    else
        window.location.href = _url;

    return result;
}

function History(moduleParam, passParam, result) {
    //STEP::Get setting
    const _go = Tools.ParamRead("_go", -1, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperWindow History _go:", _go);

    //STEP::Action
    window.history.go(_go);

    return result;
}

function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_OperWindow DoStart _action:", _action);

        //STEP::Action
        switch (_action){
            case "open":
                result = Open(moduleParam, passParam, result);
                break;
            case "close":
                result = Close(moduleParam, passParam, result);
                break;
            case "jump":
                result = Jump(moduleParam, passParam, result);
                break;
            case "history":
                result = History(moduleParam, passParam, result);
                break;
            default:
                console.debug(Logger.Header(), "Module-_OperWindow DoStart lack action:", _action);
                return ErrorCode.ERR_Module__OperWindow_Action_Lack;
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_OperWindow DoStart exception", e);
        return ErrorCode.ERR_Module__OperWindow_Exception;
    }
    return result;
}

export default function _OperWindow(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_OperWindow start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_OperWindow end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}