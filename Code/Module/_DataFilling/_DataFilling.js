import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Lang from "/Code/Common/Lang/Lang.js"
import {Theme} from "/Code/Common/Theme/Theme.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"
import {isObject, isString} from "lodash-es"
import ExpiredStorage from "expired-storage"

const Config = Tools.Merge(Configs.module._DataFilling,{});

const storageLocal = new ExpiredStorage(localStorage);
const storageSession = new ExpiredStorage(sessionStorage);

function FillingData(setting, param, passParam, _isStorageNullError, listIndex){
    if(setting === "")
        return setting;

    //WHEN-IN::[xxx] in setting
    if(/\[(.+?)\]/.test(setting)){
        const matches = setting.match(/\[(.+?)\]/g)
        matches.forEach((item) => {
            let tempParam = item.slice(1, -1);
            let tempValue = FillingData(tempParam, param, passParam, _isStorageNullError, listIndex);
            tempValue = typeof tempValue === 'object'?JSON.stringify(tempValue):tempValue;
            if(tempParam !== tempValue)
                setting = setting.replace(item, tempValue);
        })
    }

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
        const tempArr = item.split("##");
        const method = tempArr[0];
        let setting = "";
        if(tempArr.length>1)
            setting = item.substring(`${method}##`.length);

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
                } else if (setting==="theme"){
                    tempResult =  Theme.GetTheme()
                } else if(setting in passParam){
                    tempResult = passParam[setting]
                } else {
                    let isLen = false;
                    if(setting.startsWith("len##")) {
                        setting = setting.substring("len##".length);
                        isLen = true;
                    }
                    const regex = /(?<=>>)(-\d+)(?=>>)|(?<=>>)(-\d+)$/g;
                    const replaced = setting.replace(regex, (match, g1, g2) => {
                        let count = parseInt(g1 || g2);
                        const temp = listIndex.at(count);
                        if (temp!==undefined)
                            count = temp;
                        return `${count}`;
                    });
                    tempResult = Tools.JsonPathValue(replaced, passParam);
                    tempResult = (tempResult === undefined)?"null":tempResult;
                    if(isLen)
                        tempResult = Array.isArray(tempResult)?tempResult.length:0;
                }
                if(pieceCount===1)
                    return tempResult;
                else
                    result += typeof tempResult === 'object'?JSON.stringify(tempResult):`${tempResult}`;
                break;
            case "trans":
                result += Lang.TransText(setting);
                break;
            case "time":
                result += Tools.StrDate(new Date(), setting===""?"yyyy-MM-dd hh:mm:ss":setting);
                break;
            case "url":
                if(setting==="path")
                    result +=  window.location.pathname;
                else if (setting==="protocol")
                    result +=  window.location.protocol;
                else if (setting==="hostname")
                    result +=  window.location.hostname;
                else if (setting==="port")
                    result +=  window.location.port;
                else if (setting==="query") {
                    const value = window.location.search;
                    result += value.startsWith('?') ? value.substring(1) : value;
                }else if (setting==="hash") {
                    const value = window.location.hash;
                    result += value.startsWith('#') ? value.substring(1) : value;
                }else{
                    const urlWithoutProtocolHostPort = window.location.pathname + window.location.search + window.location.hash;
                    result += urlWithoutProtocolHostPort
                }
                break;
            case "url param":
                const query = new URLSearchParams(window.location.search);
                let value = query.getAll(setting);
                if(value.length === 0)
                    value = "null";
                else if (value.length === 1)
                    value = value[0]
                if(pieceCount===1)
                    result = value;
                else
                    result += value;
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
            case "value":
                result += setting;
                break;
            default:
                result += item;
        }
    }
    return result;
}

function SwitchData(setting, param, _isSwitchNullError, passParam, _isStorageNullError, listIndex){
    const judgeParam = typeof param === 'object'?JSON.stringify(param):`${param}`;
    for(let key in setting){
        if(key === "")
            continue;
        let value = setting[key];
        value = isString(value)?FillingData(value, param, passParam, _isStorageNullError, listIndex):value;
        if(key === judgeParam){
            return isString(value)?FillingData(value, param, passParam, _isStorageNullError, listIndex):value;
        }
        if(key.startsWith("reg##")) {
            key = key.substring("reg##".length);
            const regex = new RegExp(key);
            if(regex.test(judgeParam)){
                return isString(value)?FillingData(value, param, passParam, _isStorageNullError, listIndex):value;
            }
        }
    }
    if(setting.hasOwnProperty("")){
        const value = setting[""];
        return isString(value)?FillingData(value, param, passParam, _isStorageNullError, listIndex):value;
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

function TraverseJson(param, setting, passParam, _isStorageNullError, _isSwitchNullError, _isNullDelete, listIndex, arrayIndex=null){
    //WHEN::Set value
    if(!(setting instanceof Array || setting instanceof Object)){
        if(typeof setting !== 'string'){
            return setting;
        }
        return FillingData(setting, param, passParam, _isStorageNullError, listIndex);
    }

    //WHEN::Setting is []
    if(Array.isArray(setting)){
        if(param === undefined && arrayIndex[1] === 0)
            return undefined;
        if(!(Array.isArray(param))){
            param = [];
        }

        //STEP::Get start/end
        let start = arrayIndex!==null?arrayIndex[0]:-2;
        start = start === -1?param.length:start;
        let len = arrayIndex!==null?arrayIndex[1]:-2;
        len = len === -1?setting.length:len;
        len = len === 0?param.length:len;
        //WHEN::Cover list
        if(start === -2 && len === -2) {
            start = 0;
            len = setting.length;
            param = [];
        } else if(len === 0)
            return param;

        //STEP::Deal list setting
        const end = start+(len === 0?len:len-1);
        for (let i = 0; i < setting.length; i++) {
            const paramIndex = i+start;
            if(paramIndex > end)
                break;
            while(param.length<=paramIndex)
                param.push("null")
            listIndex.push(paramIndex);
            const tempParam = TraverseJson(param[paramIndex], setting[i], passParam, _isStorageNullError,_isSwitchNullError, _isNullDelete, listIndex);
            listIndex.pop();
            if(ErrorCode.IsErrorCode(tempParam))
                return tempParam;
            param[paramIndex] = tempParam;
            if(setting.length-1 === i) {
                start = start + setting.length;
                i = -1;
            }
        }
        return param;
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

            //WHEN-IN::[xxx] in key
            if(!(key in param) && /\[(.+?)\]/.test(key)){
                const matches = key.match(/\[(.+?)\]/g)
                matches.forEach((item) => {
                    let tempParam = item.slice(1, -1);
                    let tempValue = FillingData(tempParam, param, passParam, _isStorageNullError, listIndex);
                    tempValue = typeof tempValue === 'object'?JSON.stringify(tempValue):tempValue;
                    if(tempParam !== tempValue)
                        key = key.replace(item, tempValue);
                })
            }

            //STEP-IN::Get whether push list / select value
            let isPush = false;
            let isSelect = false;
            let arrayIndex = [-2,-2];
            if (key.startsWith("push##") && Array.isArray(settingValue)) {
                let tempKey = key.substring("push##".length);
                let match;
                isPush = true
                if((match = /^(\d+)##(\d+)##/.exec(tempKey)) !== null) {
                    tempKey = tempKey.substring(match[0].length);
                    arrayIndex[0] = parseInt(match[2]);
                    arrayIndex[1] = parseInt(match[1]);
                } else if((match = /^0##/.exec(tempKey)) !== null) {
                    tempKey = tempKey.substring(match[0].length);
                    arrayIndex[0] = 0;
                    arrayIndex[1] = 0;
                }  else if((match = /^(\d+)##/.exec(tempKey)) !== null) {
                    tempKey = tempKey.substring(match[0].length);
                    arrayIndex[0] = -1;
                    arrayIndex[1] = parseInt(match[1]);
                } else {
                    arrayIndex[0] = -1;
                    arrayIndex[1] = -1;
                }
                key = tempKey;
            } else if (key.startsWith("switch##")) {
                const tempKey = key.substring("switch##".length);
                if(isObject(settingValue)){
                    isSelect = true;
                    key = tempKey;
                }
            }

            //STEP-IN::Check whether param[key] exists
            let tempListIndex = [];
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
                    paramData = Tools.JsonPathValue(key, param, tempListIndex);
                } else if(key.includes(">>")){
                    isFromJsonPath = true;
                }
            }
            if(isExists && isOption)
                continue;
            if(!isExists && isSelect)
                continue;
            if(!isExists && isPush)
                paramData = undefined;

            //STEP-IN::Null means delete
            if(settingValue === null && isExists && _isNullDelete) {
                if (!isFromJsonPath) {
                    delete param[key];
                }else {
                    Tools.JsonPathSet(key, param);
                }
                continue;
            }

            //STEP-IN::Traverse json
            const newList = [...listIndex, ...tempListIndex];
            const tempParam = isSelect?
                SwitchData(settingValue, paramData, _isSwitchNullError, passParam, _isStorageNullError, newList)
                :TraverseJson(paramData, settingValue, passParam, _isStorageNullError,_isSwitchNullError, _isNullDelete, newList, isPush?arrayIndex:null);
            if(ErrorCode.IsErrorCode(tempParam)){
                return tempParam;
            }
            if(tempParam!==undefined)
                if(!isFromJsonPath) {
                    //console.debug(Logger.Header(), "Module-_DataFilling TraverseJson set value, key:", key, "value:", tempParam);
                    param[key] = tempParam;
                } else {
                    //console.debug(Logger.Header(), "Module-_DataFilling TraverseJson set deep value, key:", key, "value:", tempParam);
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
        const _isNullDelete = Tools.ParamRead("_isNullDelete", true, moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_DataFilling DoStart _setting:", _setting);
        console.debug(Logger.Header(), "Module-_DataFilling DoStart _isStorageNullError:", _isStorageNullError);
        console.debug(Logger.Header(), "Module-_DataFilling DoStart _isSwitchNullError:", _isSwitchNullError);
        console.debug(Logger.Header(), "Module-_DataFilling DoStart _isNullDelete:", _isNullDelete);

        //STEP::Filling data
        const listIndex = [];
        const tempResult = TraverseJson(passParam, _setting, passParam, _isStorageNullError, _isSwitchNullError, _isNullDelete, listIndex);
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