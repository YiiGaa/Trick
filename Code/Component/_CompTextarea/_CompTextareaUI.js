import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompTextareaAction} from "/Code/Component/_CompTextarea/_CompTextareaAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompTextarea/_CompTextarea.scss"
import "/Code/Component/_CompTextarea/Custom.scss"

import { Textarea } from '@headlessui/react'

//TIPS::Default setting for "state"
export const _CompTextareaUIDefault = Tools.MergeDefault(Configs.componentUI._CompTextarea,{
    "_isAble":true,
    "_name":"",
    "_textPlaceholder":"",
    "_value":"",
    "_rows":5,
    "_class":"",
    "_prop":{},
})

//TIPS::JSX UI render
export function _CompTextareaUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_CompTextareaAction, handler, param, isCall, isStop);
    }

    return (
        <Textarea
            ref={element}
            disabled={!state._isAble}
            name={state._name}
            placeholder={state._textPlaceholder}
            value={state._value}
            rows={state._rows}
            className={clsx("_CompTextarea", state._class)}
            onChange={Call({"_action":"change"})}
            {...state._prop}
        >
        </Textarea>
    );
}