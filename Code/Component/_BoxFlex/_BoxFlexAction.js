import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxFlexUIDefault} from "/Code/Component/_BoxFlex/_BoxFlexUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_BoxFlex Action, _key",_key);
// }

//Default setting for "data"
export const _BoxFlexActionDefault = Tools.Merge(Configs.componentAction._BoxFlex,{
    "_id":"",
    "_data":null,
});

//TIPS::Action processing entrance
export function _BoxFlexAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_BoxFlex start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxFlex");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxFlex");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxFlex", _BoxFlexActionDefault, _BoxFlexUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_BoxFlex end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_BoxFlex exception", e);
        return false;
    }
    return true;
}