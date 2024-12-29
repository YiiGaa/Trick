import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompTextareaUIDefault} from "/Code/Component/_CompTextarea/_CompTextareaUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_CompTextarea Action, _key",_key);
// }

function Change(moduleParam, passParam, data, state, setState, element, even){
    //STEP::Change
    setState(draft => {
        draft._value = element.value;
    });
}

//Default setting for "data"
export const _CompTextareaActionDefault = Tools.MergeDefault(Configs.componentAction._CompTextarea,{
    "_id":"",
    "_data":null,
})

//TIPS::Action processing entrance
export function _CompTextareaAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_CompTextarea start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "change":
                Change(moduleParam, passParam, data, state, setState, element, event, parentContext);
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompTextarea");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompTextarea");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompTextarea", _CompTextareaActionDefault, _CompTextareaUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_CompTextarea end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_CompTextarea exception", e);
        return false;
    }
    return true;
}