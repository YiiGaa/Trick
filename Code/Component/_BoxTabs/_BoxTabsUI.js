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
import {ChevronDoubleLeftIcon,ChevronDoubleRightIcon} from '@heroicons/react/16/solid'
import {Tab, TabGroup, TabList, TabPanel, TabPanels, Transition, TransitionChild} from '@headlessui/react'
import {isNumber, isString} from "lodash-es";

//TIPS::Default setting for "state"
export const _BoxTabsUIDefault =  Tools.Merge(Configs.componentUI._BoxTabs,{
    "_active":[0,""],
    "_static":true,
    "_isShowArrow":true,
    "_map":[
        {
            "_templTab":null,
            "_configTab":null,
            "_configDeepTab":null,
            "_classTabs":"",
            "_asTab":"button",
            "_key":"",
            "_propTab":{},
            "_templPanel":null,
            "_configPanel":null,
            "_configDeepPanel":null,
            "_classPanel":"",
            "_data":null
        }
    ],
    "_class":"",
    "_classTabs":"",
    "_classPanel":"",
    "_classArrow":"",
    "_classActive":""
})

//TIPS::JSX UI render
export function _BoxTabsUI(state, children, element, handler){
    //TIPS::Call real action function
    function Call (param={}, isCall=true){
        return Tools.CompActCall(_BoxTabsAction, handler, param, isCall);
    }

    //STEP::Find real active
    let active = state._active;
    if(isString(active)){
        if(Array.isArray(state._map)){
            let index = 0;
            for(const item of state._map){
                if(item._key === active){
                    active = index;
                    break;
                }
                index++;
            }
        }
    }
    const previous = active<=0?0:active-1;
    const next = active>=(state._map.length-1)?state._map.length-1:active+1;

    return (
        <TabGroup
            ref={element}
            selectedIndex={active}
            className={clsx("_BoxTabs", state._class)}
            onChange={Call({"_action":"change", "_active": "get##event", "_call":"get##_onChange"})}
        >
            <TabList
                className={clsx("_BoxTabs-Tabs group", state._classTabs)}
            >
                {state._isShowArrow && (
                    <ChevronDoubleLeftIcon className={clsx("_BoxTabs-Tabs-Arrow", state._classArrow)} onClick={Call({"_action":"change", "_active": previous})}>1</ChevronDoubleLeftIcon>
                )}
                <div className={clsx("_BoxTabs-Tabs-Body group")}>
                    {(Array.isArray(state._map) ? state._map : [state._map]).map((item, index) => (
                        <Tab
                            as={item._asTab}
                            key={index}
                            className={clsx("_BoxTabs-Tabs-Item group", item._classTabs)}
                            {...item._propTab}
                        >
                            {item._templTab}
                            <div className={clsx("_BoxTabs-Tabs-ItemActive group", state._classActive)}></div>
                        </Tab>
                    ))}
                </div>
                {state._isShowArrow && (
                    <ChevronDoubleRightIcon className={clsx("_BoxTabs-Tabs-Arrow", state._classArrow)} onClick={Call({"_action":"change", "_active": next})}>1</ChevronDoubleRightIcon>
                )}
            </TabList>
            <TabPanels
                className={clsx("_BoxTabs-Panel", state._classPanel)}
            >
                {(Array.isArray(state._map)?state._map:[state._map]).map((item, index) => (
                    <TabPanel
                        key={index}
                        static={state._static}
                        className={clsx("_BoxTabs-Panel-Item group", item._classPanel)}
                    >
                        {item._templPanel}
                    </TabPanel>
                ))}
            </TabPanels>
        </TabGroup>
    );
}