import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxMotionAction} from "/Code/Component/_BoxMotion/_BoxMotionAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxMotion/_BoxMotion.scss"
import "/Code/Component/_BoxMotion/Custom.scss"

import {MenuItem, Tab, Transition, TransitionChild} from '@headlessui/react'

//TIPS::Default setting for "state"
export const _BoxMotionUIDefault =  Tools.Merge(Configs.componentUI._BoxMotion,{
    "_isShow":true,
    "_map":[
        {
            "_templ":null,
            "_config":null,
            "_configDeep":null,
        }
    ]
})

//TIPS::JSX UI render
export function _BoxMotionUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_BoxMotionAction, handler, param, isCall);
    }

    return (
        <Transition
            as="div"
            show={state._isShow}
            ref={element}
        >
            {(Array.isArray(state._map)?state._map:[state._map]).map((item, index) => (
                <TransitionChild
                    as="div"
                    key={index}
                >
                    {item._templ}
                </TransitionChild>
            ))}
        </Transition>
    );
}