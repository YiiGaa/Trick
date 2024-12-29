import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompSwitchAction} from "/Code/Component/_CompSwitch/_CompSwitchAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompSwitch/_CompSwitch.scss"
import "/Code/Component/_CompSwitch/Custom.scss"

import { Switch, Field, Label } from '@headlessui/react'

//TIPS::Default setting for "state"
export const _CompSwitchUIDefault = Tools.MergeDefault(Configs.componentUI._CompSwitch,{
    "_name":"",
    "_isAble":true,
    "_templ":null,
    "_classBody":"",
    "_classSlot":"",
    "_classBar":"",
    "_classLabel":"",
    "_prop":{},
})

//TIPS::JSX UI render
export function _CompSwitchUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_CompSwitchAction, handler, param, isCall, isStop);
    }

    return (
        <Field className={clsx("_CompSwitch-Body", state._classBody)}>
            <Switch
                name={state._name}
                checked={state._isAble}
                value={state._value}
                onChange={Call({"_action":"change","_isAble":"get##event","_call":"get##_onClick"})}
                className={clsx("_CompSwitch-Slot group",state._classSlot)}
                {...state._prop}
            >
              <span
                  aria-hidden="true"
                  className={clsx("_CompSwitch-Bar", state._classBar)}
              />
            </Switch>
            <Label className={clsx("_CompSwitch-Label", state._classLabel)}>{state._templ}</Label>
        </Field>
    );
}