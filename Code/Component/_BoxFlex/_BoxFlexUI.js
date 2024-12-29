import React from "react"
import clsx from "clsx";
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxFlexAction} from "/Code/Component/_BoxFlex/_BoxFlexAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxFlex/_BoxFlex.scss"
import "/Code/Component/_BoxFlex/Custom.scss"

//TIPS::Default setting for "state"
export const _BoxFlexUIDefault = Tools.MergeDefault(Configs.componentUI._BoxFlex,{
    "_isRow":true,
    "_isWap":true,
    "_map":[
        {
            "_templ":null,
            "_classItem":"", 
            "_isFill":true, 
            "_backdrop":false,
            "_config":null,
            "_configDeep":null,
        }
    ],
    "_classBody":""
});

//TIPS::JSX UI render
export function _BoxFlexUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_BoxFlexAction, handler, param, isCall, isStop);
    }

    return (
        <div
            ref={element}
            className={clsx(
                "_BoxFlex-Body",
                state._isRow?"flex-row":"flex-col",
                state._isWap&&"flex-wrap",
                state._classBody
            )}
        >
            {(Array.isArray(state._map)?state._map:[state._map]).map((item,index)=>(
                <div
                    key={index}
                    className={clsx(
                        "_BoxFlex-Item",
                        item._isFill?"grow shrink w-0":"flex-none",
                        item._backdrop && "bg-[--Theme-Color-Module] rounded-[--Theme-Gap] shadow-[shadow:--Theme-BoxShadow] p-[--Theme-Gap]",
                        item._classItem,
                    )}
                >
                    {item._templ}
                </div>
            ))}
        </div>
    );
}