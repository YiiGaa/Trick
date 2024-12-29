import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js";
import {_BoxDialogUIDefault} from "/Code/Component/_BoxDialog/_BoxDialogUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_BoxDialog Action, _key",_key);
// }

function ShakeDialog(moduleParam, passParam, data, state, setState, element, event, parentContext){
    try {
        //STEP::Get setting
        console.debug(Logger.Header(), "Component-_BoxDialog ShakeDialog");

        //WHEN::Switch dialog
        if (typeof state._classContentPanelMotion !=='string' || state._classContentPanelMotion === "") {
            return;
        }
        element.classList.remove(state._classContentPanelMotion);
        element.offsetWidth;
        element.classList.add(state._classContentPanelMotion);
    }catch (e) {
        console.error(Logger.Header(), "Component-_BoxDialog ShakeDialog exception", e);
    }
}

//TIPS::Default setting for "data"
export const _BoxDialogActionDefault = Tools.MergeDefault(Configs.componentAction._BoxDialog,{
    "_id":"",
    "_data":null,
});

//TIPS::Action processing entrance
export function _BoxDialogAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_BoxDialog start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "shake dialog":
                ShakeDialog(moduleParam, passParam, data, state, setState, element, event, parentContext);
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxDialog");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxDialog");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxDialog", _BoxDialogActionDefault, _BoxDialogUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_BoxDialog end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_BoxDialog exception", e);
        return false;
    }
    return true;
}