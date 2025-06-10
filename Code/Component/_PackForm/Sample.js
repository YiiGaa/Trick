import React, {useEffect, useRef, useState, useContext, useMemo} from "react"
import {useImmer} from "use-immer"
import ReactDOM from "react-dom/client"
import _PackForm from "/Code/Component/_PackForm/_PackForm.js"
import Logger from "/Code/Common/Logger/Logger"
import * as Tools from "/Code/Common/Tools/Tools"

//WHEN::Test for calling component
function TestCall() {
    Logger.SetId();
    let data = {
        "_refresh":true,
        "_map":[
            {
                "_label":"Title 1 update",
                "_config":{"_value":"111"},
            },{
                "_label":"Title 2 update",
                "_configDeep":{
                    "div>>0":{"_value":"123"}
                }
            },{
                "_label":"Title 3",
                "_templ":"child##0",
                "_desc":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quae quam quod rem.",
                "_config":{"_value":"xxxx"}
            }
        ]
    }
    Tools.PubSubSend("id_test", data);
}

//TIPS::Child component for testing
function TestElement({config, children}) {
    const stateConfig = useMemo(() => Tools.MergeDefault(config, {"_name":"", "_value":"", "_onChange":null}), [config]);
    const [state, setState] = useImmer(stateConfig);
    const parentContext = useContext(Tools.CompContext);
    useEffect(() => {
        for(const key in stateConfig) {
            setState(draft => {
                draft[key] = stateConfig[key];
            });
        }
    }, [config]);

    const handleChange =(event) => {
        //STEP::Update data
        setState(draft => {
            draft["_value"] = event.target.value;
        });

        //STEP::Call parent pack component(state may be not updated)
        setTimeout(()=>{
            const _onChange = Tools.ParamRead("_onChange", null, state);
            Tools.CallBack(_onChange, {...state}, event, parentContext);
        })
    };

    return (
        <>
            <input
                type="text"
                value={state._value}
                name={state._name}
                onChange={handleChange}
                className="border-solid border-[0.2rem] border-[color:--Theme-Color-Divider] rounded-[--Theme-Radius-SM] py-[--Theme-Gap-XS] px-[--Theme-Gap-SM] text-[--Theme-Color-Divider]"
            />
        </>
    )
}

//STEP::Setting component config for test
let config = {
    "_id":"id_test",
    "_textError":"illegal",
    "_map":[
        {
            "_name":"input_1",
            "_templLabel":"Title 1",
            "_templDesc":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestiae, ratione?",
            "_check":"^123$",
            "_templ":"child##0",
            "_config":{
                "_value":"111",
                "_onChange":{
                    "_call":"pack##check",
                    "_data":{
                        "_index":"pack##_index",
                        "_value":"get##_value"
                    }
                }
            }
        },{
            "_templLabel":"Title 2",
            "_templDesc":"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore quae quam quod rem.",
            "_templ":"child##0",
            "_config":{
                "_value":"111234",
                "_onChange":{
                    "_call":"pack##check",
                    "_data":{
                        "_index":"pack##_index",
                        "_value":"get##_value"
                    }
                }
            },
            "_configDeep":{
                "div>>1":{"_value":"123"}
            }
        }
    ]
}

//STEP::Generate component test page
ReactDOM.createRoot(document.getElementById("id_body")).render(
    <React.StrictMode>
        <button
            className="absolute py-[--Theme-Gap-SM] px-[--Theme-Gap] bg-[--Theme-Color-Active] text-[--Theme-Color-Invert] rounded-[--Theme-Radius-SM] cursor-pointer"
            onClick={TestCall}
        >
            Test Button
        </button>
        <div className="flex justify-center items-center h-screen">
            <_PackForm config={config}>
                <TestElement config={{"_value":"init"}}></TestElement>
                <div>
                    <div>
                        <div></div>
                        <TestElement config={{"_value":"init"}}></TestElement>
                    </div>
                </div>
            </_PackForm>
        </div>
    </React.StrictMode>
);