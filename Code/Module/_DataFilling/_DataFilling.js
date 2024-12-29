import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Lang from "/Code/Common/Lang/Lang.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"
import {isObject} from "lodash-es"
import {MenuItem} from "@headlessui/react";
import clsx from "clsx";
import React from "react";
import ExpiredStorage from "expired-storage"

const Config = Tools.MergeDefault(Configs.module._DataFilling,{});

const storageLocal = new ExpiredStorage(localStorage);
const storageSession = new ExpiredStorage(sessionStorage);

function FillingData(setting, param, passParam, _isStorageNullError){
    const pieceArr = setting.split("+");
    let result = "";
    const pieceCount = pieceArr.length;

    //pieceArr.forEach(item=>{
    for (const item of pieceArr) {

        //WHEN::Empty("") means '+'
        if(item === ""){
            result+="+";
        }

        //STEP::Split function & setting
        const tempArr = item.split("##", 2);
        const method = tempArr[0];
        const setting = tempArr.length>1?tempArr[1]:"";
        //STEP::Execute function filling
        switch(method){
            case "uuid":
                result += crypto.randomUUID().replaceAll("-", "");
                break;
            case "random id":
                result += Tools.StrRandom(setting)
                break;
            case "get":
                let tempResult = "null";
                if (setting==="self"){
                    tempResult = param;
                } else if (setting==="lang"){
                    const temp =  Lang.GetLanguage()
                    if(temp!==undefined && temp !== false)
                        tempResult = temp
                } else if(setting in passParam){
                    tempResult = passParam[setting]
                } else {
                    tempResult = Tools.JsonPathValue(setting, passParam);
                    tempResult = (tempResult === undefined)?"null":tempResult;
                }
                if(pieceCount===1){
                    return tempResult;
                } else {
                    result += typeof tempResult === 'object'?JSON.stringify(tempResult):`${tempResult}`;
                }
                break;
            case "time":
                result += Tools.StrDate(new Date(), setting===""?"yyyy-MM-dd hh:mm:ss":setting);
                break;
            case "storage":
                let dataLocal = storageLocal.getItem(setting);
                if(dataLocal===null&& _isStorageNullError){
                    console.debug(Logger.Header(), "Module-_DataFilling FillingData local storage get fail, key:", setting);
                    return ErrorCode.ERR_Module__DataFilling_LocalStorage_Null;
                }
                if(pieceCount===1 && dataLocal!==null){
                    try {
                        return JSON.parse(dataLocal);
                    }catch(e){
                        return dataLocal;
                    }
                }
                dataLocal = dataLocal===null?"null":dataLocal;
                result += dataLocal;
                break;
            case "session":
                let dataSession = storageSession.getItem(setting);
                if(dataSession===null&& _isStorageNullError){
                    console.debug(Logger.Header(), "Module-_DataFilling FillingData session storage get fail, key:", setting);
                    return ErrorCode.ERR_Module__DataFilling_SessionStorage_Null;
                }
                if(pieceCount===1 && dataSession!==null){
                    try {
                        return JSON.parse(dataSession);
                    }catch(e){
                        return dataSession;
                    }
                }
                dataSession = dataSession===null?"null":dataSession;
                result += dataSession;
                break;
            default:
                result += item;
        }
    }
    return result;
}

function SwitchData(setting, param, _isSwitchNullError){
    const judgeParam = typeof param === 'object'?JSON.stringify(param):`${param}`;
    for(let key in setting){
        if(key === "")
            continue;
        const value = setting[key];
        if(key === judgeParam){
            return value;
        }
        if(key.startsWith("reg##")) {
            key = key.substring("reg##".length);
            const regex = new RegExp(key);
            if(regex.test(judgeParam)){
                return value;
            }
        }
    }
    if(setting.hasOwnProperty("")){
        return setting[""]
    }
    if(_isSwitchNullError){
        console.debug(Logger.Header(), "Module-_DataFilling SwitchData get fail");
        return ErrorCode.ERR_Module__DataFilling_Switch_Null;
    }
    return param;
}

function TraverseJson_CreateNewByJsonPath(target, value, keyList) {
    if (keyList.length === 0) {
        return value;
    }

    // STEP::Get key
    const key = keyList.shift();

    // WHEN::Number index illegal
    if (/^(0|[1-9][0-9]*)$/.test(key)) {
        const index = parseInt(key);
        if (Array.isArray(target) && index < target.length) {
            const result = TraverseJson_CreateNewByJsonPath(target[index], value, keyList);
            target.splice(index, 1, result);
            return target;
        }
    }

    // WHEN::Other cases
    if (!Array.isArray(target) && typeof target !== 'object') {
        target = {};
    }
    if (!(key in target)) {
        target[key] = "";
    }
    const result = TraverseJson_CreateNewByJsonPath(target[key], value, keyList);
    target[key] = result;
    return target;
}

function TraverseJson(param, setting, passParam, _isStorageNullError, _isSwitchNullError){
    //WHEN::Set value
    if(!(setting instanceof Array || setting instanceof Object)){
        if(typeof setting !== 'string'){
            return setting;
        }
        return FillingData(setting, param, passParam, _isStorageNullError);
    }

    //WHEN::Setting is []
    if(setting instanceof Array){
        if(!(param instanceof Array)){
            param = [];
        }
        for (let i = 0; i < setting.length; i++) {
            const tempParam = TraverseJson({}, setting[i], passParam, _isStorageNullError,_isSwitchNullError);
            if(ErrorCode.IsErrorCode(tempParam)){
                return tempParam;
            }
            setting[i] = tempParam;
        }
        return setting;
    }

    //WHEN::Setting is {}
    if(setting instanceof Object){
        if(!(param instanceof Object)){
            param = {};
        }
        for (let key in setting) {
            let settingValue = setting[key];
            //STEP-IN::Get whether cover param
            let isOption = false;
            if (key.startsWith("opt##")) {
                isOption = true;
                key = key.substring("opt##".length);
            } else if (key.startsWith("nec##")) {
                isOption = false;
                key = key.substring("nec##".length);
            }

            //STEP-IN::Get whether push list / select value
            let isPush = false;
            let isSelect = false;
            if (key.startsWith("push##")) {
                const tempKey = key.substring("push##".length);
                if (settingValue instanceof Array && param[tempKey] instanceof Array) {
                    isPush = true;
                    key = tempKey;
                }
            } else if (key.startsWith("switch##")) {
                const tempKey = key.substring("switch##".length);
                if(isObject(settingValue)){
                    isSelect = true;
                    key = tempKey;
                }
            }

            //WHEN-IN::@xxx@ in key
            if(!(key in param) && /@(.+?)@/.test(key)){
                const matches = key.match(/@(.+?)@/g)
                matches.forEach((item) => {
                    let tempValue = FillingData(item.replaceAll('@',''), param, passParam, _isStorageNullError);
                    tempValue = typeof tempValue === 'object'?JSON.stringify(tempValue):tempValue;
                    key = key.replace(item, tempValue);
                })
            }

            //STEP-IN::Check whether param[key] exists
            let isExists = false;
            let isFromJsonPath = false;
            let paramData = "null";
            if(key in param){
                isExists = true;
                paramData = param[key];
            } else {
                if(Tools.JsonPathValue(key, param)!==undefined){
                    isExists = true;
                    isFromJsonPath = true;
                    paramData = Tools.JsonPathValue(key, param);
                } else if(key.includes(">>")){
                    isFromJsonPath = true;
                }
            }
            if(isExists && isOption){
                continue;
            }
            if(!isExists && isSelect) {
                continue;
            }

            //STEP-IN::Null means delete
            if(settingValue === null && isExists) {
                if (!isFromJsonPath) {
                    delete param[key];
                }else {
                    Tools.JsonPathSet(key, param);
                }
                continue;
            }

            //STEP-IN::Traverse json
            const tempParam = isSelect?
                SwitchData(settingValue, paramData, _isSwitchNullError)
                :TraverseJson(paramData, settingValue, passParam, _isStorageNullError,_isSwitchNullError);
            if(ErrorCode.IsErrorCode(tempParam)){
                return tempParam;
            }
            if(isPush){
                console.debug(Logger.Header(), "Module-_DataFilling TraverseJson push list, key:", key, "list:", tempParam);
                paramData.push(...tempParam);
            } else if(!isFromJsonPath) {
                console.debug(Logger.Header(), "Module-_DataFilling TraverseJson set value, key:", key, "value:", tempParam);
                param[key] = tempParam;
            } else {
                console.debug(Logger.Header(), "Module-_DataFilling TraverseJson set deep value, key:", key, "value:", tempParam);
                TraverseJson_CreateNewByJsonPath(param, tempParam, key.split(">>"));
            }
        }
        return param;
    }

    return param;
}

function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _setting = Tools.ParamRead("_setting", {}, moduleParam, passParam);
        const _isStorageNullError = Tools.ParamRead("_isStorageNullError", true, moduleParam, passParam);
        const _isSwitchNullError = Tools.ParamRead("_isSwitchNullError", true, moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_DataFilling DoStart _setting:", _setting);
        console.debug(Logger.Header(), "Module-_DataFilling DoStart _isStorageNullError:", _isStorageNullError);
        console.debug(Logger.Header(), "Module-_DataFilling DoStart _isSwitchNullError:", _isSwitchNullError);

        //STEP::Filling data
        const tempResult = TraverseJson(passParam, _setting, passParam, _isStorageNullError, _isSwitchNullError);
        if(ErrorCode.IsErrorCode(tempResult)){
            return tempResult;
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_DataFilling DoStart exception", e);
        return ErrorCode.ERR_Module__DataFilling_Exception;
    }
    return result;
}

export default function _DataFilling(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_DataFilling start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_DataFilling end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}