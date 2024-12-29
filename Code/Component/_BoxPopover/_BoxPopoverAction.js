import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxPopoverUIDefault} from "/Code/Component/_BoxPopover/_BoxPopoverUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_BoxPopover Action, _key",_key);
// }

function Show(moduleParam, passParam, data, state, setState, element, event){
    try {
        //STEP::Get state
        let isOpen = element.getAttribute("aria-expanded");
        isOpen = isOpen === "true";
        console.debug(Logger.Header(), "Component-_BoxPopover Switch isOpen:", isOpen);

        //STEP::Toggle panel
        if(isOpen === false)
            setTimeout(()=>{
                element?.click();
            })

    }catch (e) {
        console.error(Logger.Header(), "Component-_BoxPopover Switch exception", e);
    }
}

//Default setting for "data"
export const _BoxPopoverActionDefault = Tools.MergeDefault(Configs.componentAction._BoxPopover,{
    "_id":"",
    "_data":null,
})

//TIPS::Action processing entrance
export function _BoxPopoverAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_BoxPopover start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "show":
                Show(moduleParam, passParam, data, state, setState, element, event, parentContext);
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxPopover");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxPopover");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxPopover", _BoxPopoverActionDefault, _BoxPopoverUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_BoxPopover end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_BoxPopover exception", e);
        return false;
    }
    return true;
}