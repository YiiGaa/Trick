import Logger from "/Code/Common/Logger/Logger";
import {ObjectClean, ObjectClone, ObjectCopy} from "/Code/Common/Tools/_Object"
import {ParamRead, ParamGet} from "/Code/Common/Tools/_Param"
import {CallBack} from "/Code/Common/Tools/_CallBack"
import {MergeDefault, Merge} from "/Code/Common/Tools/_Merge"
import React from "react";
import {TemplGet} from "/Code/Common/Tools/_Templ"
import Lang from "/Code/Common/Lang/Lang"
import {isEqual} from 'lodash-es';
import {cloneDeep} from 'lodash-es';

//TIPS::Pack component context
//>>'Pack component' will mark callback function and value in this variable
//>>The components under 'Pack component' can use Tools.CallBack() to call back 'Pack component'
const CompContext = React.createContext(null);

//TIPS::Update component state/data
//>>In order to extract the general code of the component
function CompConfigSet(stateConfig, setState, actionConfig, data){
    try {
        setState(draft => {
            for(const key in stateConfig)
                draft[key] = stateConfig[key];
        });
        for(const key in actionConfig)
            data.current[key] = actionConfig[key];
    }catch (e) {
        console.debug("Common-Tools CompConfigSet exception", e);
    }
}

//TIPS::Component's normal 'Event' Action, such as onClick, onChange
//>>In order to extract the general code of the component
function CompActEvent(moduleParam, passParam, data, state, setState, element, event, parentContext, moduleName){
    //STEP::Tips
    console.debug(Logger.Header(), `Component-${moduleName} Event, event`,event);

    //STEP::Call back(according the setting of data, such as '_onChange', '_onClick')
    let _call = ParamRead('_call', null, moduleParam, data.current);
    _call = _call === null?ParamGet(`_${event._reactName}`, null, data.current):_call;
    let _data = ParamGet("_data", null, moduleParam);
    setState(draft => {
        _data = _data === null?ObjectClone({...data.current, ...draft}):_data;
        console.debug(Logger.Header(), `Component-${moduleName} Event, _call`, _call);
        console.debug(Logger.Header(), `Component-${moduleName} Event, _data`, _data);
        CallBack(_call, _data, event, parentContext, false, true);
    })
}

//TIPS::Component's normal 'Get' Action, get data/state from component
//>>In order to extract the general code of the component
function CompActGet(moduleParam, passParam, data, state, setState, element, event, parentContext, moduleName){
    //STEP::Get setting
    const _resultKey = ParamRead("_resultKey", "", moduleParam, passParam);
    console.debug(Logger.Header(), `Component-${moduleName} Get, _resultKey`,_resultKey);

    //STEP::Get data/state
    const result = {...data.current, ...state};

    //STEP::Deal result
    let targetParam = passParam === null?moduleParam:passParam;
    if (_resultKey === "") {
        ObjectClean(targetParam);
        ObjectCopy(targetParam, result);
    } else
        targetParam[_resultKey] = result;
}

function CompActSet_Param(key, oldValue, defalutValue, moduleParam, passParam, isNec, isPush, pushIndex){
    let value = ParamRead(key, null, moduleParam, passParam);
    if(!isNec)
        value = MergeDefault(value, oldValue, true, true, false);
    if(isPush && Array.isArray(oldValue)){
        if(pushIndex<0 || pushIndex>=oldValue.length){
            if(Array.isArray(value))
                value = [...oldValue, ...value];
            else
                value = [...oldValue, value]
        } else {
            oldValue[pushIndex] = value;
            value = oldValue;
        }
    }
    return MergeDefault(value, defalutValue);
}

//TIPS::Component's normal 'Set' Action, set component's data/state
//>>In order to extract the general code of the component
function CompActSet(moduleParam, passParam, data, state, setState, element, event, parentContext, moduleName, configActionDefault, configUIDefault, templateMark){
    //TIPS::Set
    const _refresh = ParamRead("_refresh", false, moduleParam, passParam);
    console.debug(Logger.Header(), `Component-${moduleName} Set, _refresh`, _refresh);

    //WHEN::Need to refresh template
    if(_refresh)
        templateMark.current = {}

    //STEP::Update setting
    for(let key in moduleParam){
        //STEP::Get special function settings
        let isNec = false;
        let isPush = false;
        let pushIndex = -1;
        const keyOrigin = key;
        if(key.startsWith("nec##")) {
            isNec = true;
            key = key.substring("nec##".length);
        }else if(key.startsWith("push##")) {
            isPush = true;
            key = key.substring("push##".length);
            const regex = /^(\d+)##/;
            const match = key.match(regex)
            if (match) {
                pushIndex = match[1];
                key = key.replace(regex, '');
            }
        }

        if(key in data.current){
            data.current[key] = CompActSet_Param(keyOrigin, data.current[key], configActionDefault[key], moduleParam, passParam, isNec, isPush, pushIndex);
        }
        if(key in state){
            setState(draft => {
                draft[key] = CompActSet_Param(keyOrigin, cloneDeep(state[key]), configUIDefault[key], moduleParam, passParam, isNec, isPush, pushIndex);
            });
        }
    }
}

//TIPS::For component action call, such as onClick, onChange
//>>In order to extract the general code of the component
function CompActCall(actionCall, handler, param={}, isCall=true, isStop=true){
    if(isCall===true) {
        return (event) => {
            Logger.SetId();
            try {
                if (isStop)
                    event.stopPropagation();
            } catch (e) {}
            actionCall(param, handler, event)
        };
    }
    return () => {};
}

//TIPS::For pack component mark parentContext value
//>>In order to extract the general code of the component
function CompChildCall(actionCall, handler, param={}, isCall=true){
    const result = {
        "_data":param,
        "_call":()=>{}
    }
    if(isCall===true) {
        result["_call"] = (data = {}, event = null) => {
            actionCall(data, handler, event);
        };
    }
    return result;
}

//TIPS::Get template, translate text/img
//>>state::Component state object
//        -If the key starts with '_templ', means getting template
//         --If the value is string type("page##layout name", starting with 'page##'), means getting from page layout(Add by TemplAdd())
//         --If the value is string type("child##", starting with 'child##'), means getting from children, you can specify children index, such as 'child##1'
//         --If the value is null, means the whole react children
//         --If the value is string type(""), means text, It will be translated automatically(use translate)
//         --If the value is object type({}), detailed settings, the format is {"_templ":"","_config":{},"_configDeep":{}}
//        -If the key starts with '_config', means template config setting, Reference the description of Tools.TemplGet()
//        -If the key starts with '_configDeep', means template deep config setting, Reference the description of Tools.TemplGet()
//         --'_templ','_config','_configDeep' have a correspondence, requiring the same suffix of key, for example, '_templXXX','_configXXX','_configDeepXXX'
//         --If there is a '_config' or '_configDeep', the whole object will be passed as 'baseConfig' when calling Tools.TemplGet()
//        -If the key starts with '_text', means translate text, values can be string type or object type
//         --If value is object type, means translate with parameters, the format is '{_text:"xxx", "key":"value"}', '_text' is text key
//        -If the key starts with '_img'(value must be string type), means translate img src
//>>templateMark::The objects that recorded the generated templates
//>>children::React component children
//>>translate::Get from useTranslate()
//>>return::new component state, replacing template/text/img
function CompTemplGet(state, templateMark, children, translate = null){
    try{
        //WHEN::state is not object
        if(typeof state !== "object")
            return state
        if(state===null) {
            return null
        }
        if (typeof state === "undefined")
            return undefined

        //STEP::Deal result
        const result = Array.isArray(state)?[]:{};
        for(const key in state){
            const value = state[key];

            //WHEN-IN::Get template
            if(key.startsWith("_templ")){
                const setting = value;
                const addKey = key.substring("_templ".length)
                const config = `_config${addKey}` in state?state[`_config${addKey}`]:{};
                const configDeep = `_configDeep${addKey}` in state?state[`_configDeep${addKey}`]:{};
                if(key in templateMark){
                    const template = templateMark[key];
                    if(isEqual(setting, template["_templ"]) &&
                       isEqual(config, template["_config"]) &&
                       isEqual(configDeep, template["_configDeep"])
                    ){
                        result[key] = template["template"];
                        continue;
                    }
                }
                const template = TemplGet(setting, children, state, config, configDeep, translate);
                if(typeof template !== "string") {
                    templateMark[key] = {};
                    templateMark[key]["_templ"] = setting;
                    templateMark[key]["_config"] = config;
                    templateMark[key]["_configDeep"] = configDeep;
                    templateMark[key]["template"] = template;
                }
                result[key] = template;
            }

            //WHEN-IN::Translate text
            else if(key.startsWith("_text"))
                result[key] = Lang.TransText(value, translate);

            //WHEN-IN::Translate src
            else if(key.startsWith("_src"))
                result[key] = Lang.TransSrc(value, translate);

            //WHEN-IN::Deep find
            else if(typeof value === "object") {
                if (!(key in templateMark))
                    templateMark[key] = {};
                if(typeof value !== typeof templateMark[key] || Array.isArray(value) !== Array.isArray(templateMark[key]))
                    templateMark[key] = Array.isArray(value)?[]:{};
                result[key] = CompTemplGet(value, templateMark[key], children);
            }

            //WHEN-IN::Other setting
            else
                result[key] = state[key];
        }
        return result;
    }catch (e) {
        console.debug("Common-Tools CompTemplGet exception", e);
        return state;
    }
}

export {CompContext, CompConfigSet, CompActEvent, CompActGet, CompActSet, CompActCall, CompChildCall, CompTemplGet};