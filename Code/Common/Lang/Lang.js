import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Configs from '/Code/Common/Config/Config';
import {Theme} from '/Code/Common/Theme/Theme';
import {isObject} from "lodash-es"
import * as Tools from "/Code/Common/Tools/Tools";
import { useState, useEffect } from 'react';

const Config = Tools.MergeDefault(Configs.common,{
    "Lang.enable":true,
    "Lang.range":["def","en"],
    "Lang.path":Trick_LANGPATH,
    "Lang.srcPrefix":Trick_ASSETPATH,
    "Lang.srcPrefixRequire":"//"
});

export const Lang = {
    Enable:false,
    Dir:"",
    Init:function(page){
        if(!Config["Lang.enable"]) {
            return;
        }

        //STEP::i18next init
        i18n
            .use(HttpBackend)
            .use(LanguageDetector)
            .use(initReactI18next)
            .init({
                debug: false,
                // ns: Config["Lang.nameSpace"],
                // defaultNS: Config["Lang.nameSpace"][0],
                nsSeparator: false,
                keySeparator: false,
                supportedLngs:Config["Lang.range"],
                fallbackLng: Config["Lang.range"][0],
                interpolation: {
                    escapeValue: false,
                },
                detection:{
                    order:["localStorage","navigator"],
                    caches:['localStorage']
                },
                backend:{
                    loadPath: `${Config["Lang.path"]}/${page}-{{lng}}.json`,
                },
            });
        i18n.t("");
        Lang.Enable = true;

        //STEP::Listen language change(SPA page)
        window.addEventListener('trick-lang', ()=>{
            const lang = document.documentElement.getAttribute('lang');
            if(lang !== i18n.language)
                Lang.Change(lang);
        });

        //STEP::Listen language change
        document.documentElement.setAttribute('dir', Lang.Dir);
        document.body.querySelector("#id_body").setAttribute('dir', Lang.Dir);
        i18n.on('languageChanged', (lang) => {
            //STEP-IN::Notify dir change
            let dir = ""
            if(i18n.dir(lang) === "rtl")
                dir = "rtl";
            if(dir!==Lang.Dir) {
                Lang.Dir = dir;
                document.documentElement.setAttribute('dir', Lang.Dir);
                document.body.querySelector("#id_body").setAttribute('dir', Lang.Dir);
                document.body.dispatchEvent(new Event('trick-lang'));
            }

            //STEP-IN::Notify lang change
            document.documentElement.setAttribute('lang', lang)
            window.dispatchEvent(new Event('trick-lang'));
        });
    },
    InitSimple:function(lang, resources){
        //STEP::i18next init
        i18n.use(initReactI18next)
            .init({
                lng: lang,
                nsSeparator: false,
                keySeparator: false,
                interpolation: {
                    escapeValue: false
                },
                resources:resources
                // {
                //     def: {
                //         translation: {
                //             "key": "hello world"
                //         }
                //     }
                // }
        });
        Lang.Enable = true;

        if(i18n.dir(lang) === "rtl") {
            document.documentElement.setAttribute('dir', "rtl");
            Lang.Dir = "rtl";
        }else {
            document.documentElement.setAttribute('dir', "");
            Lang.Dir = "";
        }
        document.documentElement.setAttribute('lang', lang)

        //STEP::Listen language change
        document.documentElement.setAttribute('dir', Lang.Dir);
        i18n.on('languageChanged', (lang) => {
            //STEP-IN::Notify dir change
            let dir = ""
            if(i18n.dir(lang) === "rtl")
                dir = "rtl";
            if(dir!==Lang.Dir) {
                Lang.Dir = dir;
                document.documentElement.setAttribute('dir', Lang.Dir);
                document.body.dispatchEvent(new Event('trick-lang'));
            }

            //STEP-IN::Notify lang change
            document.documentElement.setAttribute('lang', lang)
            window.dispatchEvent(new Event('trick-lang'));
        });
    },
    Change:function(language){
        if(!Lang.Enable) return;
        if(!Config["Lang.range"].includes(language))
            return;
        i18n.changeLanguage(language);
    },
    GetLanguage:function(){
        if(!Lang.Enable) return "";
        return i18n.language;
    },
    TransText:function(text, translate=null){
        if(typeof text === "string"){
            if(translate===null){
                return Lang.Enable?i18n.t(text):text;
            } else {
                return Lang.Enable?translate(text):text;
            }
        }
        else if(isObject(text)){
            if(text.hasOwnProperty("_text") && typeof text["_text"] === "string"){
                if(translate===null){
                    return Lang.Enable?i18n.t(text["_text"], text):text["_text"];
                } else {
                    return Lang.Enable?translate(text["_text"], text):text["_text"];
                }
            }
            return text;
        }else
            return text;
    },
    TransTextConfig:function(text, config, translate=null){
        if(translate===null){
            return Lang.Enable?i18n.t(text, config):text;
        } else {
            return Lang.Enable?translate(text, config):text;
        }
    },
    TransSrc:function(text){
        if(typeof text === "string"){
            text = text.replaceAll('{lng}', Lang.Enable?i18n.language:"");
            text = text.replaceAll('{theme}', Theme.GetTheme());
            if(text.startsWith(Config["Lang.srcPrefixRequire"]))
                return `${Config["Lang.srcPrefix"]}${text}`.replace(/\/+/g, '/');
            return text;
        }
        return text;
    }
}

export default Lang;

//TIPS::For refreshing component
export function useLangDir() {
    const [dir, setDir] = useState(Lang.Dir);

    useEffect(() => {
        const handleLangChange = () => {
            setDir(Lang.Dir);
        };

        if(Lang.Enable)
            document.body.addEventListener('trick-lang', handleLangChange);

        return () => {
            if(Lang.Enable)
                document.body.removeEventListener('trick-lang', handleLangChange);
        };
    }, []);

    return dir;
}