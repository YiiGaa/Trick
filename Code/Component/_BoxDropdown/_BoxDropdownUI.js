import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxDropdownAction} from "/Code/Component/_BoxDropdown/_BoxDropdownAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxDropdown/_BoxDropdown.scss"
import "/Code/Component/_BoxDropdown/Custom.scss"

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

//TIPS::Default setting for "state"
export const _BoxDropdownUIDefault = Tools.MergeDefault(Configs.componentUI._BoxDropdown,{
    "_templButton":null,
    "_map":[
        {
            "_templ":null,
            "_classItem":"",
            "_onClick":null,
            "_data":null,
            "_config":null,
            "_configDeep":null,
        }
    ],
    "_styleAnchor":"bottom",
    "_classMenu":"",
    "_classItem":"",
    "_classButton":""
});

//TIPS::JSX UI render
export function _BoxDropdownUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_BoxDropdownAction, handler, param, isCall, isStop);
    }

    return (
        <Menu>
            <MenuButton
                as="div"
                className={clsx("_BoxDropdown-Button",state._classButton)}
                onClick={Call({"_action": "event"})}
            >
                {state._templButton}
            </MenuButton>
            <MenuItems
                as="div"
                anchor={state._styleAnchor}
                transition
                className={clsx("_BoxDropdown", state._classMenu)}
            >
                {(Array.isArray(state._map)?state._map:[state._map]).map((item, index) => (
                    <MenuItem
                        as="div"
                        key={`${index}`}
                        className={clsx("_BoxDropdown-Item", state._classItem, item._classItem)}
                        onClick={Call({"_action": "event", "_data": item, "_call": item._onClick})}
                    >
                        {item._templ}
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}