import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_CompButtonAction} from "/Code/Component/_CompButton/_CompButtonAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompButton/_CompButton.scss"
import "/Code/Component/_CompButton/Custom.scss"

import { Button } from '@headlessui/react'

//TIPS::Default setting for "state"
export const _CompButtonUIDefault = Tools.Merge(Configs.componentUI._CompButton,{
    "_templ":null,
    "_prop":{},
    "_class":"",
    "_config":null,
    "_configDeep":null
})

//TIPS::JSX UI render
export function _CompButtonUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_CompButtonAction, handler, param, isCall);
    }

    return (
        <Button
            {...state._prop}
            className={clsx("_CompButton group", state._class)}
            onClick={Call({"_action":"event"})}
        >
            {state._templ}
        </Button>
    );
}