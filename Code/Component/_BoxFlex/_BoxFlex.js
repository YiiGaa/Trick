import * as Tools from "/Code/Common/Tools/Tools"
import Logger from "/Code/Common/Logger/Logger.js"
import {useImmer} from "use-immer"
import { useTranslation } from "react-i18next"
import { useTheme } from "/Code/Common/Theme/Theme.js"
import {useEffect, useRef, useMemo, useContext} from "react"
import {_BoxFlexUI, _BoxFlexUIDefault} from "/Code/Component/_BoxFlex/_BoxFlexUI.js"
import {_BoxFlexAction, _BoxFlexActionDefault} from "/Code/Component/_BoxFlex/_BoxFlexAction.js"

export default function _BoxFlex({config, children}) {
    //STEP::Make react hook
    const stateConfig = useMemo(() => Tools.MergeDefault(config, _BoxFlexUIDefault), [config]);
    const dataConfig = useMemo(() => Tools.MergeDefault(config, _BoxFlexActionDefault), [config]);
    const [state, setState] = useImmer(stateConfig);
    const data = useRef(dataConfig);
    const element = useRef(null);
    const parentContext = useContext(Tools.CompContext);
    const templateMark = useRef({});
    const handler = {"data":data, "state":state, "setState":setState, "element":element, "parentContext":parentContext, "templateMark":templateMark};
    console.debug(Logger.Header(), "Component-_BoxFlex refresh, handler", handler);

    //WHEN::Config change(not init), update state and data
    const isFirstRender = useRef(true);
    useEffect(() => {
        if(isFirstRender.current){isFirstRender.current = false;return;}
        console.debug(Logger.Header(), "Component-_BoxFlex config change, stateConfig:", stateConfig, "dataConfig",dataConfig);
        Tools.CompConfigSet(stateConfig, setState, dataConfig, data);
    }, [config]);

    //WHEN::Created and destroy component
    const channelToken = useRef(null);
    useEffect(() => {
        //STEP::Subscribe
        const _id = Tools.ParamRead("_id", "", config);
        console.debug(Logger.Header(), "Component-_BoxFlex created, subscribe:", _id);
        channelToken.current = Tools.PubSubListen(_id, _BoxFlexAction, handler);

        return ()=> {
            //STEP::Unsubscribe
            console.debug(Logger.Header(), "Component-_BoxFlex destroy");
            channelToken.current = Tools.PubSubCancel(channelToken.current);
        }
    }, []);

    //STEP::Auto change template, translate text/img
    const {t} = useTranslation();
    const theme = useTheme();
    const newState = Tools.CompTemplGet(state,templateMark.current,children,t);
    console.debug(Logger.Header(), "Component-_BoxFlex auto change template, state", newState, "theme", theme);

    //STEP::UI render
    return _BoxFlexUI(newState, children, element, handler, templateMark);
}