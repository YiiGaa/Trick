/** @jsx jsx */
import { jsx,css } from '@emotion/react';
import React from "react"
import clsx from "clsx";
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxFlexAction} from "/Code/Component/_BoxFlex/_BoxFlexAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxFlex/_BoxFlex.scss"
import "/Code/Component/_BoxFlex/Custom.scss"
import __MotionCss from "/Code/Component/_BoxFlex/__MotionCss";

//TIPS::Default setting for "state"
export const _BoxFlexUIDefault = Tools.Merge(Configs.componentUI._BoxFlex,{
    "_as":"div",
    "_prop":{},
    "_call":{},
    "_flex":[[],{}],
    "_isFill":false,
    "_class":"",
    "_backdrop":false,
    "_map":[[],{}]
});

const InnerComponent = function({state, Call, templateMark}){
    const Component = state._as || "div";

    for(const key in state._call){
        state._call[key] = Call({"_action": "event", "_data":state, "_call": state._call[key]})
    }

    return (
        <Component
            className={clsx(
                state._class?state._class:undefined,
                state._backdrop && "_BoxFlex-Backdrop",
                state._isFill?"flex-1":"flex-none",
                state._flex?"gap-[--Theme-Gap]":undefined
            )}
            {...state._prop}
            {...state._call}
            css={__MotionCss(state._flex, templateMark)}
        >
            {
                state._map && (Array.isArray(state._map)?state._map:[state._map]).map((item,index)=>(
                    <InnerComponent key={index} state={item} Call={Call} templateMark={Array.isArray(state._map)?templateMark._map[index]:templateMark._map}/>
                ))
            }
            {(!state._map && state._templ) ? state._templ : undefined}
        </Component>
    );
}

//TIPS::JSX UI render
export function _BoxFlexUI(state, children, element, handler, templateMark){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_BoxFlexAction, handler, param, isCall);
    }

    return (
        <InnerComponent state={state} Call={Call} templateMark={templateMark.current}/>
    );
}