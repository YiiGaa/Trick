import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Configs from '/Code/Common/Config/Config';
import {Theme} from '/Code/Common/Theme/Theme';
import {isObject} from "lodash-es"
import * as Tools from "/Code/Common/Tools/Tools";

const Config = Tools.MergeDefault(Configs.common,{
    "Lang.enable":true,
    "Lang.range":["def","en"],
    "Lang.path":"lang",
    "Lang.srcPrefix":"assets",
    "Lang.srcPrefixRequire":"//"
});

const Lang = {
    Enable:false,
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

        //STEP::Listen language change
        i18n.on('languageChanged', (lang) => {
            if(i18n.dir(lang) === "rtl")
                document.body.setAttribute('dir', "rtl");
            else
                document.body.setAttribute('dir', "");
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

        //STEP::Listen language change
        i18n.on('languageChanged', (lang) => {
            if(i18n.dir(lang) === "rtl")
                document.body.setAttribute('dir', "rtl");
            else
                document.body.setAttribute('dir', "");
        });
    },
    Change:function(language){
        if(!Lang.Enable) return;
        if(!Config["Lang.range"].includes(language))
            return;
        i18n.changeLanguage(language);
    },
    GetLanguage:function(){
        if(!Lang.Enable) return false;
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