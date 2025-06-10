import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"

const Config = Tools.Merge(Configs.module._BrokerUI,{});

function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _id = Tools.ParamRead("_id", "", moduleParam, passParam);
        const _config = Tools.ParamRead("_config", {}, moduleParam, passParam);
        const _isSync = Tools.ParamRead("_isSync", false, moduleParam, passParam);
        const _isNullError = Tools.ParamRead("_isNullError", true, moduleParam, passParam);
        const _isFailResend = Tools.ParamRead("_isFailResend", true, moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_BrokerUI DoStart _id:", _id);
        console.debug(Logger.Header(), "Module-_BrokerUI DoStart _config:", _config);
        console.debug(Logger.Header(), "Module-_BrokerUI DoStart _isSync:", _isSync);
        console.debug(Logger.Header(), "Module-_BrokerUI DoStart _isNullError:", _isNullError);
        console.debug(Logger.Header(), "Module-_BrokerUI DoStart _isFailResend:", _isFailResend);

        //STEP::Action
        const passData = {"moduleParam":_config, "passParam":passParam}
        const ret = Tools.PubSubSend(_id, passData, _isSync, _isFailResend);
        if(_isNullError && ret===false){
            console.debug(Logger.Header(), "Module-_BrokerUI DoStart fail, there is not listen:",_id);
            return ErrorCode.ERR_Module__BrokerUI_NoListen;
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_BrokerUI DoStart exception", e);
        return ErrorCode.ERR_Module__BrokerUI_Exception;
    }
    return result;
}

export default function _BrokerUI(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_BrokerUI start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_BrokerUI end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}