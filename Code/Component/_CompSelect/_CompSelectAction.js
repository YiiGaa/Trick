import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompSelectUIDefault} from "/Code/Component/_CompSelect/_CompSelectUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_CompSelect Action, _key",_key);
// }

//Default setting for "data"
export const _CompSelectActionDefault = Tools.Merge(Configs.componentAction._CompSelect,{
    "_id":"",
    "_data":null,
    "_onChange":null
})

//TIPS::Action processing entrance
export function _CompSelectAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_CompSelect start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "change":
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompSelect", _CompSelectActionDefault, _CompSelectUIDefault, templateMark);
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompSelect");
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompSelect");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompSelect");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_CompSelect", _CompSelectActionDefault, _CompSelectUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_CompSelect end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_CompSelect exception", e);
        return false;
    }
    return true;
}