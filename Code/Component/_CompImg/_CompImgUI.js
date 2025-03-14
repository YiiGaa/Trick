import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_CompImgAction} from "/Code/Component/_CompImg/_CompImgAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_CompImg/_CompImg.scss"
import "/Code/Component/_CompImg/Custom.scss"

//TIPS::Default setting for "state"
export const _CompImgUIDefault = Tools.MergeDefault(Configs.componentUI._CompImg,{
    "_src":"",
    "_srcError":"",
    "_classBody":"",
    "_prop":{},
});

//TIPS::JSX UI render
export function _CompImgUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_CompImgAction, handler, param, isCall, isStop);
    }

    return (
        <img
            ref={element}
            src={state._src}
            onError={(e) => {
                e.target.onerror = null;
                if(state._srcError==="" || e.target.src.endsWith(state._srcError))
                    return;
                e.target.src = state._srcError
            }}
            className={clsx("_CompImg-Body", state._classBody)}
            {...state._prop}
        />
    );
}