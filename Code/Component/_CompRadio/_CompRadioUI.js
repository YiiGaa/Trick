import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompRadioAction} from "/Code/Component/_CompRadio/_CompRadioAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompRadio/_CompRadio.scss"
import "/Code/Component/_CompRadio/Custom.scss"

import { Field, Label, Radio, RadioGroup } from '@headlessui/react'

//TIPS::Default setting for "state"
export const _CompRadioUIDefault = Tools.Merge(Configs.componentUI._CompRadio,{
    "_name":"",
    "_value":null,
    "_map":[
        {
            "_templ":null,
            "_value":null,
            "_config":null,
            "_configDeep":null,
            "_class":"",
            "_classRadio":"",
            "_classSpan":"",
        }
    ],
    "_class":"",
    "_prop":{},
})

//TIPS::JSX UI render
export function _CompRadioUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_CompRadioAction, handler, param, isCall);
    }

    return (
        <RadioGroup
            as="div"
            name={state._name}
            value={state._value}
            onChange={Call({"_action":"change", "_value":"get##event", "_call":"get##_onChange"})}
            className={clsx("_CompRadio-Body", state._class)}
            {...state._prop}
        >
            {(Array.isArray(state._map)?state._map:[state._map]).map((item, index) => (
                <Field
                    key={index}
                    className={clsx("_CompRadio-Item", item._class)}
                >
                    <Radio
                        value={item._value}
                        className={clsx("_CompRadio-Item-Radio group", item._classRadio)}
                    >
                        <span className={clsx("_CompRadio-Item-Radio-Span", item._classSpan)}/>
                    </Radio>
                    <Label>{item._templ}</Label>
                </Field>
            ))}
        </RadioGroup>
    );
}