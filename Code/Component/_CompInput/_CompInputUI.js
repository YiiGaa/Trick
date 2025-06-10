import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_CompInputAction} from "/Code/Component/_CompInput/_CompInputAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompInput/_CompInput.scss"
import "/Code/Component/_CompInput/Custom.scss"

import { Input } from '@headlessui/react'

//TIPS::Default setting for "state"
export const _CompInputUIDefault = Tools.Merge(Configs.componentUI._CompInput,{
    "_isAble":true,
    "_name":"",
    "_textPlaceholder":"",
    "_value":"",
    "_class":"",
    "_prop":{},
})

//TIPS::JSX UI render
export function _CompInputUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_CompInputAction, handler, param, isCall);
    }

    return (
        <Input
            autoComplete="off"
            ref={element}
            disabled={!state._isAble}
            name={state._name}
            placeholder={state._textPlaceholder}
            value={state._value}
            {...state._prop}
            className={clsx("_CompInput", state._class)}
            onChange={Call({"_action":"change","_value":"get##event>>target>>value"})}
        />
    );
}