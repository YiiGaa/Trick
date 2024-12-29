/*
* 本文件内容不要人为修改，本文件由"python3 Christmas.py Input/MergeCode/LinkModule"生成
* 如果再次运行生成脚本，人为修改的代码将被删除
* 本文件模板请修改Christmas/Template/LinkModule/ErrorCode.templ
* 模块ErrorCode请修改Code/Module/??/Once.Link
* 修改结束后，终端执行"python3 Christmas.py Input/MergeCode/LinkModule"重新生成此文件
*
* The contents of this file should not be modified. This file is generated by "python3 Christmas.py Input/MergeCode/LinkModule"
* If the generation script is run again, the artificially modified code will be deleted
* This file template settings, please modify Christmas/Template/LinkModule/ErrorCode.templ
* Module ErrorCode settings, please modify Code/Module/??/Once.Link
* After the modification, execute "python3 Christmas.py Input/MergeCode/LinkModule" in the terminal to regenerate this file.
*/
const ErrorCode = Object.freeze({
    //TIPS::ErrorCode enum
    ERR_OK:["200","OK"],
    ERR_Module__OperWindow_Exception:["E-FP(_OperWindow)", "_OperWindow exception"],
    ERR_Module__OperWindow_Action_Lack:["E-FP(_OperWindow)", "_OperWindow action lack"],
    ERR_Module__OperTrick_Exception:["E-FP(_OperTrick)", "_OperTrick exception"],
    ERR_Module__OperTrick_Action_Lack:["E-FP(_OperEvent)", "_OperTrick action lack"],
    ERR_Module__OperStorage_Exception:["E-FP(_OperStorage)", "_OperStorage exception"],
    ERR_Module__OperStorage_Action_Lack:["E-FP(_OperStorage)", "_OperStorage action lack"],
    ERR_Module__OperStorage_Save_Illegal:["E-FP(_OperStorage)", "_OperStorage Save value illegal"],
    ERR_Module__OperStorage_Get_Null:["E-FP(_OperStorage)", "_OperStorage Get value null"],
    ERR_Module__DataFilling_Exception:["E-FP(_DataFilling)", "_DataFilling exception"],
    ERR_Module__DataFilling_SessionStorage_Null:["E-FP(_DataFilling)", "_DataFilling Session storage get null"],
    ERR_Module__DataFilling_LocalStorage_Null:["E-FP(_DataFilling)", "_DataFilling Local storage get null"],
    ERR_Module__DataFilling_Switch_Null:["E-FP(_DataFilling)", "_DataFilling Switch data get null"],
    ERR_Module__OperEvent_Exception:["E-FP(_OperEvent)", "_OperEvent exception"],
    ERR_Module__OperEvent_Action_Lack:["E-FP(_OperEvent)", "_OperEvent action lack"],
    ERR_Module__OperEvent_ID_Block:["E-FP(_OperEvent)", "_OperEvent id has been used"],
    ERR_Module__OperEvent_EventWindow_Illegal:["E-FP(_OperEvent)", "_OperEvent EventWindow event or call illegal"],
    ERR_Module__OperEvent_EventDocument_Illegal:["E-FP(_OperEvent)", "_OperEvent EventDocument event or call illegal"],
    ERR_Module__OperEvent_TimerAdd_Illegal:["E-FP(_OperEvent)", "_OperEvent TimerAdd call illegal"],
    ERR_Module__DataCheck_Exception:["E-FP(_DataCheck)", "_DataCheck exception"],
    ERR_Module__DataCheck_Type_Illegal:["E-FP(_DataCheck)", "_DataCheck Check type is not match"],
    ERR_Module__DataCheck_Lack:["E-FP(_DataCheck)", "_DataCheck Check lack param"],
    ERR_Module__DataCheck_Param_Illegal:["E-FP(_DataCheck)", "_DataCheck Check param illegal"],
    ERR_Module__DataCheck_Value_Illegal:["E-FP(_DataCheck)", "_DataCheck Check value illegal"],
    ERR_Module__DataCheck_Regex_Block:["E-FP(_DataCheck)", "_DataCheck Check value not match regex"],
    ERR_Module__ServeHttp_Exception:["E-FP(_ServeHttp)", "_ServeHttp exception"],
    ERR_Module__ServeHttp_Action_Lack:["E-FP(_ServeHttp)", "_ServeHttp action lack"],
    ERR_Module__ServeHttp_Normal_Fail:["E-FP(_ServeHttp)", "_ServeHttp Normal request fail"],
    ERR_Module__ServeHttp_Normal_Timeout:["E-FP(_ServeHttp)", "_ServeHttp Normal request timeout"],
    ERR_Module__ServeHttp_Multiple_Fail:["E-FP(_ServeHttp)", "_ServeHttp Multiple request fail"],
    ERR_Module__ServeHttp_Multiple_Timeout:["E-FP(_ServeHttp)", "_ServeHttp Multiple request timeout"],
    ERR_Module__BrokerUI_Exception:["E-FP(_BrokerUI)", "_BrokerUI exception"],
    ERR_Module__BrokerUI_NoListen:["E-FP(_BrokerUI)", "_BrokerUI There is not listen"],

    //TIPS::ErrorCode functions
    IsError: function(code, skip=[]) {
        if(code === ErrorCode.ERR_OK){
            return false;
        }
        if(skip.length !== 0 && code in skip){
            return false;
        }
        return true;
    },
    IsErrorCode: function(code){
        if(!Array.isArray(code) && code.length!==2){
            return false;
        }
        return Object.values(ErrorCode).some(value => value === code);
    },
    GetCode: function(code) {
        if(code instanceof Array && code.length > 0){
            return code[0];
        }
        return "unknown";
    },
    GetMessage: function(code) {
        if(code instanceof Array && code.length > 1){
            return code[1];
        }
        return "unknown";
    }
});

export default ErrorCode;