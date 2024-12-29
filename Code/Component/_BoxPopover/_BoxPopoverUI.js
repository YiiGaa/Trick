import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxPopoverAction} from "/Code/Component/_BoxPopover/_BoxPopoverAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxPopover/_BoxPopover.scss"
import "/Code/Component/_BoxPopover/Custom.scss"

import {Popover, PopoverButton, PopoverPanel, CloseButton, TransitionChild} from '@headlessui/react'

//TIPS::Default setting for "state"
export const _BoxPopoverUIDefault =  Tools.MergeDefault(Configs.componentUI._BoxPopover,{
    "_templButton":null,
    "_templPanel":null,
    "_styleAnchor":"bottom",
    "_classButton":"",
    "_classPanel":"",
})

//TIPS::JSX UI render
export function _BoxPopoverUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_BoxPopoverAction, handler, param, isCall, isStop);
    }

    return (
        <Popover>
            <PopoverButton
                ref={element}
                className={clsx("_BoxPopover-Button group", state._classButton)}
            >
                {state._templButton}
            </PopoverButton>
            <PopoverPanel
                transition
                anchor={state._styleAnchor}
                className={clsx("_BoxPopover-Panel", state._classPanel)}
            >
                {state._templPanel}
            </PopoverPanel>
        </Popover>
    );
}