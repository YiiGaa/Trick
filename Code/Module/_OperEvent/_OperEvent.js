import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"
import {isObject, isString} from "lodash-es"

const Config = Tools.Merge(Configs.module._OperEvent,{});

const EventWindowMark = {}
function EventWindow_Call(event){
    Logger.SetId();
    console.debug(Logger.Header(), "Module-_OperEvent EventWindow Call event:", event, "EventWindowMark", EventWindowMark);
    if(EventWindowMark.hasOwnProperty(event.type)){
        EventWindowMark[event.type].map((item)=>{
            Tools.CallBack(item, {}, event, null, false, true, false);
        })
    }
}
function EventWindow(moduleParam, passParam, result) {
    //STEP::Get setting
    const _event = Tools.ParamRead("_event", "", moduleParam, passParam);
    const _call = Tools.ParamRead("_call", null, moduleParam, passParam);
    const _isRemove = Tools.ParamRead("_isRemove", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperEvent EventWindow _event:", _event);
    console.debug(Logger.Header(), "Module-_OperEvent EventWindow _call:", _call);
    console.debug(Logger.Header(), "Module-_OperEvent EventWindow _isRemove:", _isRemove);

    //STEP::Check _event/_call
    if(_event==="" || !(isObject(_call) || isString(_call) || _call instanceof Function))
        return ErrorCode.ERR_Module__OperEvent_EventWindow_Illegal;

    //WHEN::Remove listen
    if(_isRemove) {
        if(!EventWindowMark.hasOwnProperty(_event) || !EventWindowMark[_event].includes(_call))
            return result;
        if(EventWindowMark.hasOwnProperty(_event) && EventWindowMark[_event].includes(_call)){
            let index = EventWindowMark[_event].indexOf(_call);
            if (index !== -1)
                EventWindowMark[_event].splice(index, 1);
            if(EventWindowMark[_event].length === 0){
                window.removeEventListener(_event, EventWindow_Call);
                delete EventWindowMark[_event];
            }
        }
        return result;
    }

    //WHEN::Add listen
    if(EventWindowMark.hasOwnProperty(_event) && !EventWindowMark[_event].includes(_call))
        EventWindowMark[_event].push(_call);
    else if(!EventWindowMark.hasOwnProperty(_event)){
        window.addEventListener(_event, EventWindow_Call);
        EventWindowMark[_event] = [_call];
    }

    return result;
}

const EventDocumentMark = {}
const EventDocumentFun = {}
function EventDocument_Call(key,event){
    Logger.SetId();
    console.debug(Logger.Header(), "Module-_OperEvent EventDocument Call key:", key, "event", event, "EventDocumentMark", EventDocumentMark);
    if(EventDocumentMark.hasOwnProperty(key)){
        EventDocumentMark[key].map((item)=>{
            Tools.CallBack(item, {}, event, null, false, true, false);
        })
    }
}
function EventDocument(moduleParam, passParam, result) {
    //STEP::Get setting
    const _event = Tools.ParamRead("_event", "", moduleParam, passParam);
    const _call = Tools.ParamRead("_call", null, moduleParam, passParam);
    const _query = Tools.ParamRead("_query", "", moduleParam, passParam);
    const _isRemove = Tools.ParamRead("_isRemove", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperEvent EventDocument _event:", _event);
    console.debug(Logger.Header(), "Module-_OperEvent EventDocument _call:", _call);
    console.debug(Logger.Header(), "Module-_OperEvent EventDocument _query:", _query);
    console.debug(Logger.Header(), "Module-_OperEvent EventDocument _isRemove:", _isRemove);

    //STEP::Check _event/_call
    const key = `${_event}>>${_query}`
    if(_event==="" || !(isObject(_call) || isString(_call) || _call instanceof Function))
        return ErrorCode.ERR_Module__OperEvent_EventDocument_Illegal;

    //WHEN::Remove listen
    if(_isRemove) {
        if(!EventDocumentMark.hasOwnProperty(key) || !EventDocumentMark[key].includes(_call))
            return result;
        if(EventDocumentMark.hasOwnProperty(key) && EventDocumentMark[key].includes(_call)){
            let index = EventDocumentMark[key].indexOf(_call);
            if (index !== -1)
                EventDocumentMark[key].splice(index, 1);
            if(EventDocumentMark[key].length === 0){
                delete EventDocumentMark[key];
                document.querySelector(_query).removeEventListener(_event, EventDocumentFun[key]);
                delete EventDocumentFun[key];
            }
        }
        return result;
    }

    //WHEN::Add listen
    if(EventDocumentMark.hasOwnProperty(key) && !EventDocumentMark[key].includes(_call)) {
        EventDocumentMark[key].push(_call);
    } else if(!EventDocumentMark.hasOwnProperty(key)){
        const bindFun = EventDocument_Call.bind(null, key);
        document.querySelector(_query).addEventListener(_event, bindFun);
        EventDocumentMark[key] = [_call];
        EventDocumentFun[key] = bindFun;
    }

    return result;
}

const TimerMark = {};
function TimerAdd(moduleParam, passParam, result) {
    //STEP::Get setting
    const _call = Tools.ParamRead("_call", null, moduleParam, passParam);
    const _time = Tools.ParamRead("_time", 0, moduleParam, passParam);
    const _id = Tools.ParamRead("_id", "", moduleParam, passParam);
    const _isLoop = Tools.ParamRead("_isLoop", false, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperEvent TimerAdd _call:", _call);
    console.debug(Logger.Header(), "Module-_OperEvent TimerAdd _time:", _time);
    console.debug(Logger.Header(), "Module-_OperEvent TimerAdd _id:", _id);
    console.debug(Logger.Header(), "Module-_OperEvent TimerAdd _isLoop:", _isLoop);

    //STEP::Check ID
    if(_id!=="" && _id in TimerMark){
        console.debug(Logger.Header(), "Module-_OperEvent TimerAdd id has been used, _id:", _id);
        return ErrorCode.ERR_Module__OperEvent_ID_Block;
    }

    //STEP::Check _call
    if(!(isObject(_call) || isString(_call) || _call instanceof Function))
        return ErrorCode.ERR_Module__OperEvent_TimerAdd_Illegal;

    //STEP::Action
    let handler;
    if(_isLoop)
        handler = window.setInterval(() => {
            Logger.SetId();
            console.debug(Logger.Header(), "Module-_OperEvent TimerAdd Interval call:", _call);
            Tools.CallBack(_call, {}, null, null, false, true, false);
        }, _time);
    else
        handler = window.setTimeout(() => {
            Logger.SetId();
            console.debug(Logger.Header(), "Module-_OperEvent TimerAdd Timeout call:", _call);
            Tools.CallBack(_call, {}, null, null, false, true, false);
            delete TimerMark[_id];
        }, _time);

    //STEP::Put handler in HandlerMark
    TimerMark[_id] = {
        "isLoop":_isLoop,
        "handler":handler
    };

    return result;
}

function TimerRemove(moduleParam, passParam, result) {
    //STEP::Get setting
    const _id = Tools.ParamRead("_id", "", moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperEvent TimerRemove _id:", _id);

    //STEP::Check id
    if(!(_id in TimerMark)){
        console.debug(Logger.Header(), "Module-_OperEvent TimerRemove id has not been used, _id:", _id);
        return ErrorCode.ERR_Module__OperEvent_ID_Block;
    }

    //STEP::Clean timer
    if(TimerMark[_id]["isLoop"])
        window.clearInterval(TimerMark[_id]["handler"]);
    else
        window.clearTimeout(TimerMark[_id]["handler"]);
    delete TimerMark[_id];

    return result;
}

function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_OperEvent DoStart _action:", _action);

        //STEP::Action
        switch (_action){
            case "event window":
                result = EventWindow(moduleParam, passParam, result);
                break;
            case "event document":
                result = EventDocument(moduleParam, passParam, result);
                break;
            case "timer add":
                result = TimerAdd(moduleParam, passParam, result);
                break;
            case "timer remove":
                result = TimerRemove(moduleParam, passParam, result);
                break;
            default:
                console.debug(Logger.Header(), "Module-_OperEvent DoStart lack action:", _action);
                return ErrorCode.ERR_Module__OperEvent_Action_Lack;
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_OperEvent DoStart exception", e);
        return ErrorCode.ERR_Module__OperEvent_Exception;
    }
    return result;
}

export default function _OperEvent(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_OperEvent start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_OperEvent end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}