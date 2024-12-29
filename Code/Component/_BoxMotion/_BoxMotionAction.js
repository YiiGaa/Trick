import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxMotionUIDefault} from "/Code/Component/_BoxMotion/_BoxMotionUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_BoxMotion Action, _key",_key);
// }

function Show(moduleParam, passParam, data, state, setState, element, event, parentContext){
    //STEP::Get setting
    const isShow = element!==null;
    const _isShow = Tools.ParamRead("_isShow", !isShow, moduleParam, passParam);
    const _refreshTime = Tools.ParamRead("_refreshTime", 500, moduleParam, passParam);
    console.debug(Logger.Header(), "Component-_BoxMotion Show isShow:", isShow);
    console.debug(Logger.Header(), "Component-_BoxMotion Show _isShow:", _isShow);
    console.debug(Logger.Header(), "Component-_BoxMotion Show _refreshTime:", _refreshTime);

    //WHEN::Show or hidden
    if(_isShow !== isShow) {
        setState(draft => {
            draft._isShow = _isShow;
        });
    }

    //WHEN::Refresh
    if(_isShow === true && isShow === true) {
        setState(draft => {
            draft._isShow = false;
        });
        setTimeout(() => {
            setState(draft => {
                draft._isShow = true;
            });
        },_refreshTime);
    }
}

//Default setting for "data"
export const _BoxMotionActionDefault = Tools.MergeDefault(Configs.componentAction._BoxMotion,{
    "_id":"",
    "_data":null,
})

//TIPS::Action processing entrance
export function _BoxMotionAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_BoxMotion start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
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
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxMotion");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxMotion");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_BoxMotion", _BoxMotionActionDefault, _BoxMotionUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_BoxMotion end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_BoxMotion exception", e);
        return false;
    }
    return true;
}