import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompCheckboxUIDefault} from "/Code/Component/_CompCheckbox/_CompCheckboxUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_CompCheckbox Action, _key",_key);
// }

//Default setting for "data"
export const _CompCheckboxActionDefault = Tools.Merge(Configs.componentAction._CompCheckbox,{
    "_id":"",
    "_data":null,
    "_onClick":null
})

//TIPS::Action processing entrance
export function _CompCheckboxAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_CompCheckbox start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "change":
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompCheckbox", _CompCheckboxActionDefault, _CompCheckboxUIDefault, templateMark);
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompCheckbox");
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompCheckbox");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompCheckbox");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompCheckbox", _CompCheckboxActionDefault, _CompCheckboxUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_CompCheckbox end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_CompCheckbox exception", e);
        return false;
    }
    return true;
}