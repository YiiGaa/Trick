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
export const _CompRadioUIDefault = Tools.MergeDefault(Configs.componentUI._CompRadio,{
    "_name":"",
    "_value":null,
    "_map":[
        {
            "_templ":null,
            "_value":null,
            "_config":null,
            "_configDeep":null
        }
    ],
    "_classBody":"",
    "_classItem":"",
    "_classItemRadio":"",
    "_classItemRadioSpan":"",
    "_prop":{},
})

//TIPS::JSX UI render
export function _CompRadioUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_CompRadioAction, handler, param, isCall, isStop);
    }

    return (
        <RadioGroup
            as="div"
            name={state._name}
            value={state._value}
            onChange={Call({"_value":"get##event"})}
            className={clsx("_CompRadio-Body", state._classBody)}
            {...state._prop}
        >
            {(Array.isArray(state._map)?state._map:[state._map]).map((item, index) => (
                <Field
                    key={index}
                    className={clsx("_CompRadio-Item", state._classItem)}
                >
                    <Radio
                        value={item._value}
                        className={clsx("_CompRadio-Item-Radio group", state._classItemRadio)}
                    >
                        <span className={clsx("_CompRadio-Item-Radio-Span", state._classItemRadioSpan)}/>
                    </Radio>
                    <Label>{item._templ}</Label>
                </Field>
            ))}
        </RadioGroup>
    );
}