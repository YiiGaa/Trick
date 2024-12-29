import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxCollapseUIDefault} from "/Code/Component/_BoxCollapse/_BoxCollapseUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_BoxCollapse Action, _key",_key);
// }

function Switch(moduleParam, passParam, data, state, setState, element, event, parentContext){
    //STEP::Get state
    const isOpen = element.hasAttribute("data-open");
    console.debug(Logger.Header(), "Component-_BoxCollapse Switch isOpen:", isOpen);

    //STEP::Get setting
    const _isOpen = Tools.ParamRead("_isOpen", !isOpen, moduleParam, passParam);
    console.debug(Logger.Header(), "Component-_BoxCollapse Switch _isOpen:", _isOpen);

    //STEP::Toggle panel
    if(isOpen!==_isOpen){
        element?.click();
    }
}

//Default setting for "data"
export const _BoxCollapseActionDefault = Tools.MergeDefault(Configs.componentAction._BoxCollapse,{
    "_id":"",
    "_data":null,
})

//TIPS::Action processing entrance
export function _BoxCollapseAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_BoxCollapse start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "switch":
                Switch(moduleParam, passParam, data, state, setState, element, event, parentContext);
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxCollapse");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxCollapse");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxCollapse", _BoxCollapseActionDefault, _BoxCollapseUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_BoxCollapse end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_BoxCollapse exception", e);
        return false;
    }
    return true;
}