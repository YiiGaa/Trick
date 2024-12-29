import React from "react"
import clsx from "clsx";
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxGridAction} from "/Code/Component/_BoxGrid/_BoxGridAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxGrid/_BoxGrid.scss"
import "/Code/Component/_BoxGrid/Custom.scss"

//TIPS::Default setting for "state"
export const _BoxGridUIDefault = Tools.MergeDefault(Configs.componentUI._BoxGrid,{
    "_isCol":true,
    "_count":1,
    "_map":[
        {
            "_templ":null, 
            "_classItem":"", 
            "_count":-1, 
            "_backdrop":false,
            "_config":null,
            "_configDeep":null,
        }
    ],
    "_classBody":""
});

//TIPS::JSX UI render
export function _BoxGridUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_BoxGridAction, handler, param, isCall, isStop);
    }

    return (
        <div
            ref={element}
            className={clsx(
                "_BoxGrid-Body",
                state._classBody
            )}
            style={{
                "gridTemplateColumns":state._isCol?`repeat(${state._count}, minmax(0, 1fr))`:"none",
                "gridTemplateRows":!state._isCol?`repeat(${state._count}, minmax(0, 1fr))`:"none"
            }}
        >
            {(Array.isArray(state._map)?state._map:[state._map]).map((item,index)=>(
                <div
                    key={index}
                    className={clsx(
                        "_BoxGrid-Item",
                        item._backdrop && "bg-[--Theme-Color-Module] rounded-[--Theme-Gap] shadow-[shadow:--Theme-BoxShadow] p-[--Theme-Gap]",
                        item._classItem
                    )}
                    style={{
                        "gridColumn":state._isCol?`span ${item._count} / span ${item._count}`:"auto",
                        "gridRows":!state._isCol?`span ${item._count} / span ${item._count}`:"auto"
                    }}
                >
                    {item._templ}
                </div>
            ))}
        </div>
    );
}