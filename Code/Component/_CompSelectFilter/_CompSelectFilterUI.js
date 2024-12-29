import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompSelectFilterAction} from "/Code/Component/_CompSelectFilter/_CompSelectFilterAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompSelectFilter/_CompSelectFilter.scss"
import "/Code/Component/_CompSelectFilter/Custom.scss"

import { Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions } from '@headlessui/react'

//TIPS::Default setting for "state"
export const _CompSelectFilterUIDefault = Tools.MergeDefault(Configs.componentUI._CompSelectFilter,{
    "_name":"",
    "_value":null,
    "_filter":"",
    "_styleAnchor":"bottom",
    "_map":[
        {
            "_templ":null,
            "_value":null,
            "_text":null
        }
    ],
    "_classBody":"",
    "_classButton":"",
    "_classButtonIcon":"",
    "_classOption":"",
    "_classOptionItem":"",
    "_prop":{}
})

//TIPS::JSX UI render
export function _CompSelectFilterUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_CompSelectFilterAction, handler, param, isCall, isStop);
    }

    //STEP::Find select item
    let select = state._map.find(object => object._value === state._value);
    if (select === undefined) {
        select = {"_text":""};
    }

    //STEP::Filter map
    const filter = state._filter;
    const optionMap =
        filter === ""
            ?state._map
            :state._map.filter((item) => {
                return item._text.toLowerCase().includes(filter.toLowerCase())
            })

    return (
        <Combobox
            name={state._name}
            value={state._value}
            onClose={Call({"innerQuery":""})}
            onChange={Call({"_value":"get##event"})}
            {...state._prop}
        >
            <ComboboxButton>
                <ComboboxInput
                    autoComplete="off"
                    displayValue={(value)=>select._text}
                    className={clsx("_CompSelectFilter-Body group", state._classBody)}
                    onChange={Call({"_filter":"get##event>>target>>value"})}
                />
            </ComboboxButton>
            <ComboboxOptions
                anchor={state._styleAnchor}
                transition
                className={clsx("_CompSelectFilter-Option", state._classOption)}
            >
                {optionMap.map((item,index) => (
                    <ComboboxOption
                        key={index}
                        value={item._value}
                        className={clsx("_CompSelectFilter-Option-Item", state._classOptionItem)}
                    >
                        {item._templ}
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}