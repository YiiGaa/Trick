import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompInputUIDefault} from "/Code/Component/_CompInput/_CompInputUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_CompInput Action, _key",_key);
// }

//Default setting for "data"
export const _CompInputActionDefault = Tools.Merge(Configs.componentAction._CompInput,{
    "_id":"",
    "_data":null,
    "_onChange":null
})

//TIPS::Action processing entrance
export function _CompInputAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_CompInput start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "change":
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompInput", _CompInputActionDefault, _CompInputUIDefault, templateMark);
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompInput");
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompInput");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompInput");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompInput", _CompInputActionDefault, _CompInputUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_CompInput end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_CompInput exception", e);
        return false;
    }
    return true;
}