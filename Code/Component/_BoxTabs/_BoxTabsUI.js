import React from "react"
import clsx from "clsx"
import * as Tools from "/Code/Common/Tools/Tools.js"
import Logger from "/Code/Common/Logger/Logger.js"
import Configs from "/Code/Common/Config/Config.js"
import {_BoxTabsAction} from "/Code/Component/_BoxTabs/_BoxTabsAction.js"
import "/Code/Common/Theme/Theme.scss"
import "/Code/Common/Theme/Style.scss"
import "/Code/Component/_BoxTabs/_BoxTabs.scss"
import "/Code/Component/_BoxTabs/Custom.scss"

import {Tab, TabGroup, TabList, TabPanel, TabPanels, Transition, TransitionChild} from '@headlessui/react'

//TIPS::Default setting for "state"
export const _BoxTabsUIDefault =  Tools.MergeDefault(Configs.componentUI._BoxTabs,{
    "_active":0,
    "_static":true,
    "_map":[
        {
            "_templTab":null,
            "_templPanel":null,
        }
    ],
    "_classBody":"",
    "_classTabs":"",
    "_classTabsItem":"",
    "_classPanel":"",
    "_classPanelItem":"",
})

//TIPS::JSX UI render
export function _BoxTabsUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true, isStop=true){
        return Tools.CompActCall(_BoxTabsAction, handler, param, isCall, isStop);
    }

    return (
        <TabGroup
            selectedIndex={state._active}
            className={clsx("_BoxTabs", state._classBody)}
            onChange={Call({"_active": "get##event"})}
        >
            <TabList
                className={clsx("_BoxTabs-Tabs group", state._classTabs)}
            >
                {(Array.isArray(state._map)?state._map:[state._map]).map((item, index) => (
                    <Tab
                        key={index}
                        className={clsx("_BoxTabs-Tabs-Item group", state._classTabsItem)}
                    >
                        {item._templTab}
                    </Tab>
                ))}
            </TabList>
            <TabPanels
                className={clsx("_BoxTabs-Panel", state._classPanel)}
            >
                {(Array.isArray(state._map)?state._map:[state._map]).map((item, index) => (
                    <TabPanel
                        key={index}
                        static={state._static}
                        className={clsx("_BoxTabs-Panel-Item group", state._classPanelItem)}
                    >
                        {item._templPanel}
                    </TabPanel>
                ))}

            </TabPanels>
        </TabGroup>
    );
}