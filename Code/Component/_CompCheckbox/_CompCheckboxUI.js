import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompCheckboxAction} from "/Code/Component/_CompCheckbox/_CompCheckboxAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompCheckbox/_CompCheckbox.scss"
import "/Code/Component/_CompCheckbox/Custom.scss"

import { Checkbox, Description, Field, Label } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/16/solid'

//TIPS::Default setting for "state"
export const _CompCheckboxUIDefault = Tools.Merge(Configs.componentUI._CompCheckbox,{
    "_name":"",
    "_isAble":false,
    "_templ":null,
    "_config":null,
    "_configDeep":null,
    "_class":"",
    "_classBox":"",
    "_classIcon":"",
    "_classLabel":"",
    "_prop":{},
})

//TIPS::JSX UI render
export function _CompCheckboxUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_CompCheckboxAction, handler, param, isCall);
    }

    return (
        <Field className={clsx("_CompCheckbox-Body", state._class)}>
            <Checkbox
                name={state._name}
                value={state._isAble}
                checked={state._isAble}
                onClick={Call({"_action":"change","_isAble":!state._isAble,"_call":"get##_onClick"})}
                className={clsx("_CompCheckbox-Box group", state._classBox)}
                {...state._prop}
            >
                <CheckIcon
                    className={clsx("_CompCheckbox-Icon", state._classIcon)}
                />
            </Checkbox>
            <Label className={clsx("_CompCheckbox-Label", state._classLabel)}>{state._templ}</Label>
        </Field>
    );
}