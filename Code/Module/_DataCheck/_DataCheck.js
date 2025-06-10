import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"

const Config = Tools.Merge(Configs.module._DataCheck,{});

function CheckData(param, setting, _split) {
    //WHEN::Allow anything
    if(setting === ""){
        return ErrorCode.ERR_OK;
    }

    //WHEN::Straight value check
    if(typeof setting !== "string"){
        if(setting === param){
            return ErrorCode.ERR_OK;
        }
        return ErrorCode.ERR_Module__DataCheck_Param_Illegal;
    }

    //STEP::Check type
    let typeCheck = true;
    let isRegx = false;
    if(setting.startsWith("str##")){
        if(typeof param !== "string")
            typeCheck = false;
        setting = setting.substring("str##".length);
    }else if(setting.startsWith("int##")){
        if(!Number.isInteger(param))
            typeCheck = false;
        setting = setting.substring("int##".length);
    }else if(setting.startsWith("double##")){
        if(!(typeof param === 'number' && !isNaN(param) && !Number.isInteger(param)))
            typeCheck = false;
        setting = setting.substring("double##".length);
    }
    if(setting.startsWith("reg##")){
        isRegx = true;
        setting = setting.substring("reg##".length);
    }
    if(!typeCheck){
        return ErrorCode.ERR_Module__DataCheck_Type_Illegal;
    }

    //STEP::Get whether to reverse the result
    let isNot = false;
    if(setting.startsWith("not##")) {
        setting = setting.substring("not##".length);
        isNot = true;
    }

    //STEP::Check Range
    if(!isRegx){
        let result = false;
        //WHEN-IN::Allow anything
        if(setting === ""){
            result = true;
            return result!==isNot?ErrorCode.ERR_OK:ErrorCode.ERR_Module__DataCheck_Value_Illegal;
        }

        //STEP-IN::Range check
        const settingArr = setting.split(_split);
        settingArr.every((item)=>{
            if(item === ""+param) {
                result = true;
                return false;
            }
            result = false;
            return true
        })

        //STEP-IN::Check result
        return result!==isNot?ErrorCode.ERR_OK:ErrorCode.ERR_Module__DataCheck_Value_Illegal;
    }

    //WHEN::Regex
    if(isRegx){
        let result = false;
        const regex = new RegExp(setting);
        result = regex.test(param);

        //STEP-IN::Check result
        return result!==isNot?ErrorCode.ERR_OK:ErrorCode.ERR_Module__DataCheck_Regex_Block;
    }

    return ErrorCode.ERR_OK;
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

function TraverseJson(param, setting, reaultParam, _split){
    //WHEN::Check data
    if(!(setting instanceof Array || setting instanceof Object)){
        return CheckData(param, setting, _split)
    }

    //WHEN::Setting is []
    if(setting instanceof Array){
        if(!(param instanceof Array)){
            return ErrorCode.ERR_Module__DataCheck_Type_Illegal;
        }
        for (let index = 0; index < param.length; index++) {
            let itemParam = param[index];
            let tempResult = ErrorCode.ERR_OK;
            setting.every((itemSetting) => {
                tempResult = TraverseJson(itemParam, itemSetting, reaultParam[index], _split);
                return tempResult !== ErrorCode.ERR_OK;
            })
            if(tempResult !== ErrorCode.ERR_OK){
                console.debug(Logger.Header(), "Module-_DataFilling Illegal array, index:", index, "error", tempResult);
                return tempResult;
            }
        }
        return ErrorCode.ERR_OK;
    }

    //WHEN::Setting is {}
    if(setting instanceof Object){
        if(param instanceof Array || !(param instanceof Object)){
            return ErrorCode.ERR_Module__DataCheck_Type_Illegal;
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

            //STEP-IN::Get array size limit
            let limitSize = -1;
            if (Array.isArray(settingValue)) {
                const regex = /^(\d+)##/;
                const match = key.match(regex)
                if (match) {
                    limitSize = parseInt(match[1]);
                    key = key.replace(regex, '');
                }
            }

            //STEP-IN::Check whether param[key] exists
            let isExists = false;
            let paramData = "null";
            if(key in param){
                isExists = true;
                paramData = param[key];
            } else {
                if(Tools.JsonPathValue(key, param)!==undefined){
                    isExists = true;
                    paramData = Tools.JsonPathValue(key, param);
                }
            }
            if(!isExists && isOption){
                continue;
            } else if(!isExists){
                console.debug(Logger.Header(), "Module-_DataFilling Illegal object, lack key:", key);
                return ErrorCode.ERR_Module__DataCheck_Lack;
            }

            //STEP-IN::Traverse json
            const isObject = paramData instanceof Object && !Array.isArray(paramData) && Object.keys(settingValue).length !== 0;
            let tempResultParam = isObject?{}:paramData;
            let tempResult = TraverseJson(paramData, settingValue, tempResultParam, _split);
            if(tempResult !== ErrorCode.ERR_OK){
                console.debug(Logger.Header(), "Module-_DataFilling Illegal object, key:", key, "error", tempResult);
                return tempResult;
            }

            //STEP-IN::Check array size
            if(limitSize>-1 && Array.isArray(paramData)){
                if(paramData.length>limitSize){
                    return ErrorCode.ERR_Module__DataCheck_ArrayLimit;
                }
            }

            //STEP-IN::Insert clean data
            TraverseJson_CreateNewByJsonPath(reaultParam, tempResultParam, key.split(">>"));
        }
        return ErrorCode.ERR_OK;
    }

    return ErrorCode.ERR_OK;
}

function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _param = Tools.ParamRead("_param", {}, moduleParam, passParam);
        const _isClean = Tools.ParamRead("_isClean", false, moduleParam, passParam);
        const _split = Tools.ParamRead("_split", "/", moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_DataCheck DoStart _param:", _param);
        console.debug(Logger.Header(), "Module-_DataCheck DoStart _isClean:", _isClean);
        console.debug(Logger.Header(), "Module-_DataCheck DoStart _split:", _split);

        //STEP::Action
        const reaultParam = {}
        result = TraverseJson(passParam, _param, reaultParam, _split);

        //WHEN::Clean passParam
        if(_isClean){
            for(const key in passParam){
                delete passParam[key];
            }
            for(const key in reaultParam){
                passParam[key] = reaultParam[key]
            }
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_DataCheck DoStart exception", e);
        return ErrorCode.ERR_Module__DataCheck_Exception;
    }
    return result;
}

export default function _DataCheck(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_DataCheck start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_DataCheck end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}