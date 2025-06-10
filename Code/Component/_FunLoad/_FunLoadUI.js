import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_FunLoadAction} from "/Code/Component/_FunLoad/_FunLoadAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_FunLoad/_FunLoad.scss"
import "/Code/Component/_FunLoad/Custom.scss"

//TIPS::Default setting for "state"
export const _FunLoadUIDefault = Tools.Merge(Configs.componentUI._FunLoad,{
    "_isLoad":true,
    "_class":"",
    "_classChild":"",
    "_classLoadItem":"",
    "_classLoadList":["","","!w-9/12"],
    "_classLoad":""
});

//TIPS::JSX UI render
export function _FunLoadUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_FunLoadAction, handler, param, isCall);
    }

    return (
        <div ref={element}
             className={clsx("_FunLoad-Body", state._class)}
        >
            <div
                className={clsx("_FunLoad-Child", state._classChild, state._isLoad?"opacity-0":"opacity-100")}
            >
                {children}
            </div>
            {state._isLoad && (
                <div
                    className={clsx("_FunLoad-Load", state._classLoad)}
                >
                    {state._classLoadList.length>0 && state._classLoadList.map((item, index)=> (
                        <div key={index} className={clsx("_FunLoad-Load-Item", state._classLoadItem, item)}></div>
                    ))}

                    {state._classLoadList.length===0 && (
                        <div className={clsx("_FunLoad-Load-Item !h-full !rounded-[--Theme-Radius]", state._classLoadItem)}></div>
                    )}
                </div>
            )}
        </div>
    );
}