import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompSelectAction} from "/Code/Component/_CompSelect/_CompSelectAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompSelect/_CompSelect.scss"
import "/Code/Component/_CompSelect/Custom.scss"
import { isEqual } from 'lodash-es';

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

//TIPS::Default setting for "state"
export const _CompSelectUIDefault = Tools.MergeDefault(Configs.componentUI._CompSelect,{
    "_name":"",
    "_value":null,
    "_textPlaceholder":"",
    "_styleAnchor":"bottom",
    "_map":[
        {
            "_templ":null,
            "_value":null,
            "_text":null,
            "_config":null,
            "_configDeep":null
        }
    ],
    "_classBody":"",
    "_classButton":"",
    "_classButtonText":"",
    "_classButtonIcon":"",
    "_classOption":"",
    "_classOptionItem":"",
    "_prop":{},
})

//TIPS::JSX UI render
export function _CompSelectUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_CompSelectAction, handler, param, isCall, isStop);
    }

    let select = state._map.find(object => object._value === state._value);
    let isSelected = true;
    if (select === undefined) {
        isSelected = false;
        select = {"_text":state._textPlaceholder};
    }

    return (
        <Listbox
            as="div"
            name={state._name}
            value={state._value}
            className={clsx("_CompSelect", state._classBody)}
            onChange={Call({"_value":"get##event"})}
            {...state._prop}
        >
            <ListboxButton
                className={clsx("_CompSelect-Button group", state._classButton)}
            >
                <div data-isselected = {isSelected} className={clsx("_CompSelect-Button-Text", state._classButtonText)}>{select._text}</div>
                <ChevronDownIcon
                    className={clsx("_CompSelect-Button-Icon", state._classButtonIcon)}
                />
            </ListboxButton>
            <ListboxOptions
                transition
                anchor={state._styleAnchor}
                className={clsx("_CompSelect-Option", state._classOption)}
            >
                {(Array.isArray(state._map)?state._map:[state._map]).map((item,index) => (
                    <ListboxOption
                        key={index}
                        value={item._value}
                        className={clsx("_CompSelect-Option-Item group", state._classOptionItem)}
                    >
                        {item._templ}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    );
}