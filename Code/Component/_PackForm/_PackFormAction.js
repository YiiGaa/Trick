import * as Tools from "/Code/Common/Tools/Tools"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_PackFormUIDefault} from "/Code/Component/_PackForm/_PackFormUI";

// function Action(moduleParam, passParam, data, state, setState, element, event, parentContext){
//     //STEP::Get setting
//     const _key = Tools.ParamRead("_key", "", moduleParam, passParam);
//     console.debug(Logger.Header(), "Component-_PackForm Action, _key",_key);
// }

function Check_Single(setting, index, element, setState){
    const _check = Tools.ParamGet("_check", "", setting);
    const _name = Tools.ParamGet("_name", null, setting);
    console.debug(Logger.Header(), "Component-_PackForm Check_Single, _check", _check);
    console.debug(Logger.Header(), "Component-_PackForm Check_Single, _name", _name);

    //WHEN::Regex mode
    if(_check!==""){
        //STEP-IN::Get value
        let checkValue = "";
        if(typeof _name === "string"){
            const elements = element.querySelectorAll(`[name='${_name}']`);
            for(let target of elements){
                checkValue += target.value;
            }
        } else if(Array.isArray(_name)){
            for(let name of _name){
                if(typeof name !== "string")
                    continue;
                const elements = element.querySelectorAll(`[name='${_name}']`);
                for(let target of elements){
                    checkValue += target.value;
                }
            }
        }
        console.debug(Logger.Header(), "Component-_PackForm Check_Single, checkValue", checkValue);

        //STEP-IN::Check value
        const regex = new RegExp(_check);
        let isError = true;
        if(regex.test(checkValue))
            isError = false;
        setState(draft => {
            draft['_map'][index]["_isError"] = isError;
        });
        console.debug(Logger.Header(), "Component-_PackForm Check_Single, isError", isError);
        return isError;
    }
    return false;
}

function Check(moduleParam, passParam, data, state, setState, element, event, parentContext){
    //STEP::Check data
    const _index = Tools.ParamRead("_index", -1, moduleParam, passParam);
    console.debug(Logger.Header(), "Component-_PackForm Check, _index", _index);

    //STEP::Check data
    let isError = false;
    if(_index>=0 && state._map.length>_index){
        const setting = state._map[_index];
        isError = isError || Check_Single(setting, _index, element, setState);
    } else if(_index<0) {
        for (let index = 0; index < state._map.length; index++) {
            const setting = state._map[index];
            isError = isError || Check_Single(setting, index, element, setState);
        }
    }
    moduleParam["inner_isError"] = isError;
    Tools.ObjectCopy(passParam,{...data.current, ...state});
}

function Commit(moduleParam, passParam, data, state, setState, element, event, parentContext){
    //STEP::Get setting
    const _resultKey = Tools.ParamRead("_resultKey", "", moduleParam, passParam);
    const inner_isError = Tools.ParamRead("inner_isError", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Component-_PackForm Commit, _resultKey",_resultKey);
    console.debug(Logger.Header(), "Component-_PackForm Commit, inner_isError", inner_isError);

    //WHEN::Check error
    if(inner_isError === true)
        return;

    //STEP::Get form value
    const form = {};
    for (let index = 0; index < state._map.length; index++) {
        const setting = state._map[index];
        const _name = Tools.ParamGet("_name","",setting);
        let getValue = "";
        if(_name==="")
            continue;

        //WHEN-IN::Error interrupt
        if(setting._isError === true)
            return;

        //STEP-IN::Get value
        const elements = element.querySelectorAll(`[name='${_name}']`);
        for(let target of elements){
            getValue += target.value;
        }
        form[_name] = getValue;
    }

    //STEP::Deal result
    let targetParam = passParam === null?moduleParam:passParam;
    if (_resultKey === "") {
        Tools.ObjectClean(targetParam);
        Tools.ObjectCopy(targetParam, form);
    } else
        targetParam[_resultKey] = form;

    //STEP::Notify _onCommit
    Tools.CallBack(data.current["_onCommit"], targetParam, parentContext, false, true);
}

//TIPS::Default setting for "data"
export const _PackFormActionDefault = Tools.Merge(Configs.componentAction._PackForm,{
    "_id":"",
    "_data":null,
    "_onCommit":null
});

//TIPS::Action processing entrance
export function _PackFormAction(param, handler, event=null) {
    try{
        let moduleParam = "moduleParam" in param?param["moduleParam"]:param;
        let passParam = "passParam" in param?param["passParam"]:null;
        passParam = passParam === null && event !==null? {event:event}:passParam;
        console.debug(Logger.Header(), "Component-_PackForm start moduleParam:", moduleParam, "passParam:", passParam, "handler:", handler, "event:", event);
        const data = handler["data"];
        const state = handler["state"];
        const setState = handler["setState"];
        const element = handler["element"].current;
        const parentContext = handler["parentContext"];
        const templateMark = handler["templateMark"];
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);

        switch(_action){
            case "commit":
                moduleParam["_index"] = -1;
                Check(moduleParam, passParam, data, state, setState, element, event, parentContext);
                Commit(moduleParam, passParam, data, state, setState, element, event, parentContext);
                break;
            case "check":
                Check(moduleParam, passParam, data, state, setState, element, event, parentContext);
                break;
            case "event":
                Tools.CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, "_PackForm");
                break;
            case "get":
                Tools.CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_PackForm");
                break;
            case "set":
            default:
                Tools.CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, "_PackForm", _PackFormActionDefault, _PackFormUIDefault, templateMark);
        }
        console.debug(Logger.Header(), "Component-_PackForm end");
    }catch (e) {
        console.error(Logger.Header(), "Component-_PackForm exception", e);
        return false;
    }
    return true;
}