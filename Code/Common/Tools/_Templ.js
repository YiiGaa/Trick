import {ParamGet} from "/Code/Common/Tools/_Param";
import React from "react";
import {Merge} from "/Code/Common/Tools/_Merge";
import Lang from "/Code/Common/Lang/Lang";

const _PageTemplateMap={};

//TIPS::Organize form templates and change template settings
function _DeepConfig(children, configDeep, baseConfig) {
    let template;
    try {
        if (!Array.isArray(children) && !children["props"].hasOwnProperty("children")) {
            return children;
        }
        template = Array.isArray(children)?children:children["props"]["children"];
    }catch (e){
        return children;
    }

    return React.Children.map(template, (child, index) => {
        let name = typeof child.type === "string"?child.type:child.type.name;
        let newChild = child;

        //STEP::Deal path key
        const nestConfigDeep = {};
        let isNested = false;
        let thisConfig = false;
        for(let key in configDeep) {
            const config = configDeep[key];
            if(key===name){
                thisConfig = config;
                continue;
            }else if(key===`${index}`) {
                thisConfig = config;
                continue;
            }else if (key.startsWith(`${name}>>`)) {
                key = key.substring(`${name}>>`.length);
            }else if (key.startsWith(`${index}>>`)){
                key = key.substring(`${index}>>`.length);
            }else{
                continue;
            }
            isNested = true;
            nestConfigDeep[key] = config;
        }

        //STEP::Deep child find
        if(isNested && newChild["props"].hasOwnProperty("children"))
            newChild = _DeepConfig(newChild, nestConfigDeep, baseConfig);

        //STEP::Set this child config
        if(thisConfig!==false){
            if(newChild["props"].hasOwnProperty("config")){
                newChild = React.cloneElement(newChild, {config:Merge(thisConfig, newChild["props"]["config"], baseConfig)});
            } else {
                newChild = React.cloneElement(newChild, {config:Merge(thisConfig, baseConfig)});
            }
        }

        return newChild;
    });
}

//TIPS::For getting template
//>>setting::Get settings
//          - Array type([]), means getting list
//          - String type("page##layout name", starting with 'page##'), means getting from page layout(Add by TemplAdd())
//          - String type("child##", starting with 'child##'), means getting from children, you can specify children index, such as 'child##1'
//          - null, means the whole react children
//          - String type(""), means text, It will be translated automatically(use translate)
//          - Object type({}), detailed settings, the format is {"_templ":"","_config":{},"_configDeep":{}}, '_templ' equivalent to 'setting', "_config" equivalent to 'config', "_configDeep" equivalent to 'deepConfig'
//>>children::React component children
//>>baseConfig::Object type({}), it will be auto add to config/baseConfig or template 'config prop'
//>>config::Object type({}), it will be auto add to template 'config prop'
//>>deepConfig::Object type({}), the format is {"key":{},"key2":{}}, it will be auto add to the 'config prop' of in-layer template
//             - Key is customized, indicating the positioning of the in-layer template. Using '>>' positioning, you can use numbers or component names, for example, "div>>1>>2"
//             - Value is config object, it will be auto add to the 'config prop' of in-layer template
//>>translate::Get from useTranslate()
//>>return::template
//>>return::children(default)
const TemplGet = function (setting, children, baseConfig={}, config = null, deepConfig = null, translate = null){
    try {
        //STEP::Get template
        let template = children;
        //WHEN::Array call list
        if (Array.isArray(setting)) {
            const element = []
            for (const item of setting) {
                element.push(TemplGet(item, children, baseConfig, config, deepConfig));
            }
            template = (<>{element}</>);
        }
        //WHEN::Object as detailed setting
        else if(typeof setting === "object" && setting!==null){
            const _templ = ParamGet("_templ",null, setting);
            const _config = ParamGet("_config",{}, setting);
            const _configDeep = ParamGet("_configDeep",{}, setting);
            template = TemplGet(_templ, children, baseConfig, _config, _configDeep);
        }
        //WHEN::Page layout as template
        else if (typeof setting === "string" && setting.startsWith("page##")) {
            let index = setting.substring("page##".length);
            if(_PageTemplateMap.hasOwnProperty(index))
                template = _PageTemplateMap[index]();
            else
                template = setting
        }
        //WHEN::Child as template
        else if (typeof setting === "string" && setting.startsWith("child##")) {
            const childrenMap = React.Children.count(children)<=1?[children]:children;
            let index = setting.substring("child##".length);
            index = index===""?-1:Number(index);
            if(!isNaN(index) && index>=0 && index<childrenMap.length){
                template = childrenMap[index];
            }else {
                template = children;
            }
        }
        //WHEN::Text
        else if (typeof setting === "string") {
            if(config !== null)
                return Lang.TransTextConfig(setting, config, translate);
            else
                return Lang.TransText(setting, translate);
        }
        //WHEN::Illegal type
        else {
            template = children;
        }

        //STEP::Change deep config
        if(deepConfig!==null) {
            if (typeof deepConfig === 'object' && !Array.isArray(deepConfig) && Object.keys(deepConfig).length>0) {
                template = _DeepConfig(template, deepConfig, baseConfig);
            }
        }

        //STEP::Change config
        try {
            if (config !== null) {
                if (typeof config === 'object' && !Array.isArray(config) && Object.keys(config).length>0) {
                    if (template["props"].hasOwnProperty("config")) {
                        template = React.cloneElement(template, {config: Merge(config, template["props"]["config"], baseConfig)});
                    } else {
                        template = React.cloneElement(template, {config: Merge(config, baseConfig)});
                    }
                }
            }
        }catch(e){
            return template;
        }

        return template;
    }catch (e) {
        console.debug("Common-CompTools TemplGet exception", e);
    }
    return null;
}

//TIPS::For marking react function component(page layout)
//>>name::Component name
//>>template::react function component
const TemplAdd = function(name, template){
    _PageTemplateMap[name] = template;
}
export {TemplAdd, TemplGet};