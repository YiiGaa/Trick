import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxDialogAction} from "/Code/Component/_BoxDialog/_BoxDialogAction"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxDialog/_BoxDialog.scss"
import "/Code/Component/_BoxDialog/Custom.scss"
import {Dialog, DialogBackdrop, DialogPanel} from "@headlessui/react"
import { XMarkIcon } from '@heroicons/react/24/solid'

//TIPS::Default setting for "state"{}
export const _BoxDialogUIDefault = Tools.Merge(Configs.componentUI._BoxDialog,{
    "_isOpen":true,
    "_isCloseDismiss":false,
    "_textClose":null,
    "_templ":null,
    "_config":null,
    "_configDeep":null,
    "_class":"",
    "_classBackdrop":"",
    "_classContent":"",
    "_classContentPanel":"",
    "_classContentPanelMotion":"_BoxDialog-Content-PanelAlarm",
    "_classContentPanelChild":"",
    "_classClose":"",
})

//TIPS::JSX UI render
export function _BoxDialogUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_BoxDialogAction, handler, param, isCall);
    }

    return (
        <Dialog
            open={state._isOpen}
            className={clsx("_BoxDialog-Body", state._class)}
            onClose={Call({"_isOpen": false}, state._isCloseDismiss)}
        >
            <DialogBackdrop
                transition
                className={clsx("_BoxDialog-Backdrop", state._classBackdrop)}
            />
            <div
                className={clsx("_BoxDialog-Content", state._classContent)}
                onClick={Call({"_action": "shake dialog"}, !state._isCloseDismiss)}
            >
                <DialogPanel
                    ref={element}
                    transition
                    className={clsx("_BoxDialog-Content-Panel", state._classContentPanel, state._classContentPanelMotion)}
                >
                    <div
                        className={clsx("_BoxDialog-Content-Panel-Child", state._classContentPanelChild)}
                    >
                        <XMarkIcon
                            className={clsx("_BoxDialog-Close", state._classClose)}
                            onClick={Call({"_isOpen": false})}
                            title={state._textClose}
                        />
                        {state._templ}
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}