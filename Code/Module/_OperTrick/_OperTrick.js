import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import ErrorCode from "/Code/Common/ErrorCode/ErrorCode.js"
import Configs from "/Code/Common/Config/Config.js"
import Lang from "/Code/Common/Lang/Lang.js"
import {Theme} from "/Code/Common/Theme/Theme"
import i18n from 'i18next';

const Config = Tools.MergeDefault(Configs.module._OperTrick,{});

const CallMark = {
    "theme":[]
}
function LangChange(moduleParam, passParam, result) {
    //STEP::Get setting
    const isAble = Lang.Enable;
    const _language = Tools.ParamRead("_language", "", moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperTrick LangChange isAble(Lang):", isAble);
    console.debug(Logger.Header(), "Module-_OperTrick LangChange _language:", _language);

    //STEP::Change language
    Lang.Change(_language);

    return result;
}

function LangListen(moduleParam, passParam, result) {
    //STEP::Get setting
    const isAble = Lang.Enable;
    const _call = Tools.ParamRead("_call", null, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperTrick LangListen isAble(Lang):", isAble);
    console.debug(Logger.Header(), "Module-_OperTrick LangListen _call:", _call);

    //STEP::Binding event
    if(isAble){
        i18n.on('languageChanged', (lang) => {
            Logger.SetId();
            console.debug(Logger.Header(), "Module-_OperTrick Language change, _call:", _call, "lang", lang);
            Tools.CallBack(_call, {"lang":lang});
        });
    }

    return result;
}

function ThemeChange(moduleParam, passParam, result) {
    //STEP::Get setting
    const isAble = Theme.Enable;
    const _theme = Tools.ParamRead("_theme", "", moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperTrick ThemeChange isAble(Theme):", isAble);
    console.debug(Logger.Header(), "Module-_OperTrick ThemeChange _theme:", _theme);

    //STEP::Set theme
    Theme.Change(_theme);

    //STEP::Notify theme change
    for (const item of CallMark["theme"]) {
        Tools.CallBack(item, {"theme":Theme.GetTheme()});
    }

    return result;
}

function ThemeListen(moduleParam, passParam, result) {
    //STEP::Get setting
    const isAble = Theme.Enable;
    const _call = Tools.ParamRead("_call", null, moduleParam, passParam);
    console.debug(Logger.Header(), "Module-_OperTrick ThemeListen isAble(Theme):", isAble);
    console.debug(Logger.Header(), "Module-_OperTrick ThemeListen _call:", _call);

    //STEP::Binding event and call back immediately
    if(isAble){
        CallMark["theme"].push(_call);
        Tools.CallBack(_call, {"theme":Theme.GetTheme()});
    }

    return result;
}

function DoStart(moduleParam, passParam, result){
    try {
        //STEP::Get setting
        const _action = Tools.ParamRead("_action", "", moduleParam, passParam);
        console.debug(Logger.Header(), "Module-_OperTrick DoStart _action:", _action);

        //STEP::Action
        switch (_action){
            case "lang change":
                result = LangChange(moduleParam, passParam, result);
                break;
            case "lang listen":
                result = LangListen(moduleParam, passParam, result);
                break;
            case "theme change":
                result = ThemeChange(moduleParam, passParam, result);
                break;
            case "theme listen":
                result = ThemeListen(moduleParam, passParam, result);
                break;
            default:
                console.debug(Logger.Header(), "Module-_OperTrick DoStart lack action:", _action);
                return ErrorCode.ERR_Module__OperTrick_Action_Lack;
        }

    }catch (e) {
        console.error(Logger.Header(), "Module-_OperTrick DoStart exception", e);
        return ErrorCode.ERR_Module__OperTrick_Exception;
    }
    return result;
}

export default function _OperTrick(moduleParam, passParam) {
    console.debug(Logger.Header(), "Module-_OperTrick start, moduleParam:", moduleParam, "passParam:", passParam);
    let result = ErrorCode.ERR_OK;
    result = DoStart(moduleParam, passParam, result);
    console.debug(Logger.Header(), "Module-_OperTrick end, moduleParam:", moduleParam, "passParam:", passParam);
    return result;
}