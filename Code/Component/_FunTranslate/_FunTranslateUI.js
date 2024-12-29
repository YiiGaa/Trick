import React, {Fragment} from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_FunTranslateAction} from "/Code/Component/_FunTranslate/_FunTranslateAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_FunTranslate/_FunTranslate.scss"
import "/Code/Component/_FunTranslate/Custom.scss"
import { Trans } from "react-i18next"
import htmr from "htmr"

//TIPS::Default setting for "state"
export const _FunTranslateUIDefault = Tools.MergeDefault(Configs.componentUI._FunTranslate,{
    "_value":"",
    "_config":{},
    "_html":{}
});

//TIPS::JSX UI render
export function _FunTranslateUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_FunTranslateAction, handler, param, isCall, isStop);
    }

    //STEP::Trans string to html
    const componentsKeep = {}
    for(const key in state._html){
        componentsKeep[key] = htmr(state._html[key]);
    }

    return (
        <Trans
               i18nKey={state._value}
               values={state._config}
               components={componentsKeep}
        >
        </Trans>
    );
}