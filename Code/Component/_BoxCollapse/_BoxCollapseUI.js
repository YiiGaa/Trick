import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxCollapseAction} from "/Code/Component/_BoxCollapse/_BoxCollapseAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxCollapse/_BoxCollapse.scss"
import "/Code/Component/_BoxCollapse/Custom.scss"

import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react'

//TIPS::Default setting for "state"
export const _BoxCollapseUIDefault = Tools.Merge(Configs.componentUI._BoxCollapse,{
    "_initOpen":true,
    "_templButton":null,
    "_templPanel":null,
    "_class":"",
    "_classButton":"",
    "_classPanel":""
})

//TIPS::JSX UI render
export function _BoxCollapseUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_BoxCollapseAction, handler, param, isCall);
    }

    return (
        <Disclosure
            as="div"
            defaultOpen={state._initOpen}
            className={clsx("_BoxCollapse", state._class)}
        >
            <DisclosureButton
                as="div"
                ref={element}
                className={clsx("_BoxCollapse-Button group", state._classButton)}
            >
                {state._templButton}
            </DisclosureButton>
            <DisclosurePanel
                transition
                className={clsx("_BoxCollapse-Panel", state._classPanel)}
            >
                {state._templPanel}
            </DisclosurePanel>
        </Disclosure>
    );
}