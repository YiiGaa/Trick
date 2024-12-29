import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_PackFormAction} from "/Code/Component/_PackForm/_PackFormAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_PackForm/_PackForm.scss"
import "/Code/Component/_PackForm/Custom.scss"
import {Field, Fieldset, Label, Description} from "@headlessui/react"

//TIPS::Default setting for "state"
export const _PackFormUIDefault = Tools.MergeDefault(Configs.componentUI._PackForm,{
    "_map":[
        {
            "_name":"",
            "_templLabel":"",
            "_templDesc":"",
            "_check":"",
            "_templ":null,
            "_config":{},
            "_configDeep":{},
            "_isError":false,
            "_classField":"",
            "_classLabel":"",
            "_classDesc":"",
            "_classError":""
        }
    ],
    "_textError":"",
    "_classBody":"",
    "_classField":"",
    "_classLabel":"",
    "_classDesc":"",
    "_classError":""
});

//TIPS::JSX UI render
export function _PackFormUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call(param={}, isCall=true){
        return Tools.CompChildCall(_PackFormAction, handler, param, isCall);
    }

    return (
        <Fieldset ref={element} className={clsx("_PackForm-Body", state._classBody)}>
            {
                (Array.isArray(state._map)?state._map:[state._map]).map((item, index)=>
                    <Field key={index} className={clsx("_PackForm-Field", state._classField, item._classField)}>
                        <Label className={clsx("_PackForm-Label", state._classLabel, item._classLabel)}>{item._templLabel}</Label>
                        <Description className={clsx("_PackForm-Desc", state._classDesc, item._classDesc)}>{item._templDesc}</Description>
                        <Tools.CompContext.Provider value={Call({"_index":index})}>
                            {item._templ}
                        </Tools.CompContext.Provider>
                        <Description className={clsx("_PackForm-Error", state._classError, item._classError)}>{item._isError===true?state._textError:""}</Description>
                    </Field>
                )
            }
        </Fieldset>
    );
}