import {ParamGet} from "/Code/Common/Tools/_Param";
import React from "react";
import Lang from "/Code/Common/Lang/Lang";
import {isNumber, merge} from "lodash-es"

const _PageTemplateMap={};
let _PageCompMap={};

//TIPS::Organize form templates and change template settings
function _DeepConfig(children, configDeep, baseConfig) {
    let template;
    const isList = Array.isArray(children);
    try {
        if (!Array.isArray(children) && !children["props"].hasOwnProperty("children")) {
            return children;
        }
        template = Array.isArray(children)?children:children["props"]["children"];
    }catch (e){
        return children;
    }

    template =  React.Children.map(template, (child, index) => {
        let name = typeof child.type === "string"?child.type:child.type.name;
        let newChild = child;

        //STEP::Deal path key
        const nestConfigDeep = {};
        let isNested = false;
        let thisConfig = false;
        for(let key in configDeep) {
            const config = configDeep[key];
            if(key===name || key===("$."+name)){
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
        if(thisConfig!==false && !Array.isArray(newChild)){
            if(newChild.hasOwnProperty("props") && newChild["props"].hasOwnProperty("config"))
                newChild = React.cloneElement(newChild, {config:merge({}, baseConfig, newChild["props"]["config"], thisConfig)});
            else
                newChild = React.cloneElement(newChild, {config:merge({}, baseConfig, thisConfig)});
        }

        return newChild;
    });

    //STEP::Restore Children
    if(isList)
        return template
    else
        children = React.cloneElement(children, {children:template});
    return  children;
}

//TIPS::Get inner child
function TemplGet_DeepTempl(indexArr, template, isFirst = false){
    //WHEN::End
    if(indexArr.length===0){
        return template;
    }

    //STEP::Get index
    let index = indexArr.shift();
    if(index === "")
        return template;
    index = isNaN(Number(index))?index:Number(index);

    //STEP::Get children
    try {
        if (!Array.isArray(template) && !template["props"].hasOwnProperty("children")) {
            return null;
        }
    } catch (e){return null;}
    let children = template;
    if(!isFirst)
        children = Array.isArray(template)?template:template["props"]["children"];
    children = React.Children.count(children)<=1&&!Array.isArray(children)?[children]:children;

    //WHEN::Index is number
    if(isNumber(index) && index>=0 && index<children.length){
        return TemplGet_DeepTempl(indexArr, children[index], false);
    }

    //WHEN::Index is not number
    for (const i in children) {
        const child = children[i];
        try {
            let name = typeof child.type === "string"?child.type:child.type.name;
            if(index===name || index===("$."+name)){
                return TemplGet_DeepTempl(indexArr, child, false);
            }
        } catch (e){}
    }

    return null;
}

//TIPS::For getting template
//>>setting::Get settings
//          - Array type([]), means getting list
//          - String type("layout##layout name", starting with 'layout##'), means getting from page layout(Add by TemplAdd())
//          **Trick2.2 and later versions have changed 'page##' to 'layout##'
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
        //WHEN::React component
        if(React.isValidElement(setting))
            template = setting;
        //WHEN::Array call list
        else if (Array.isArray(setting)) {
            const element = []
            for (const [index, item] of setting.entries()) {
                const piece = TemplGet(item, children, baseConfig, config, deepConfig, translate)
                element.push(piece)
            }
            template = element;
        }
        //WHEN::Object as detailed setting
        else if(typeof setting === "object" && setting!==null){
            const _templ = ParamGet("_templ",null, setting);
            const _config = ParamGet("_config",{}, setting);
            const _configDeep = ParamGet("_configDeep",{}, setting);
            template = TemplGet(_templ, children, baseConfig, _config, _configDeep, translate);
        }
        //WHEN::Set UI component
        else if (typeof setting === "string" && setting.startsWith("$.")) {
            if(_PageCompMap.hasOwnProperty(setting))
                template = _PageCompMap[setting];
            else
                template = setting;
        }
        //WHEN::Page layout as template
        else if (typeof setting === "string" && setting.startsWith("layout##")) {
            let index = setting.substring("layout##".length);
            let indexArr = index.split(">>");
            index = indexArr.shift();
            if(_PageTemplateMap.hasOwnProperty(index))
                template = TemplGet_DeepTempl(indexArr, _PageTemplateMap[index](), false)
            else
                template = setting
            if(template === null)
                template = setting
        }
        //WHEN::Child as template
        else if (typeof setting === "string" && setting.startsWith("child##")) {
            const childrenMap = React.Children.count(children)<=1&&!Array.isArray(children)?[children]:children;
            let index = setting.substring("child##".length);
            let indexArr = index.split(">>");
            template = TemplGet_DeepTempl(indexArr, childrenMap, true)
            if(template === null)
                template = setting
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
                        template = React.cloneElement(template, {config: merge({}, baseConfig, template["props"]["config"], config)});
                    } else {
                        template = React.cloneElement(template, {config: merge({}, baseConfig, config)});
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

//TIPS::For marking ui component in config setting(_config)
//>>map::Component map
const TemplMark = function(map){
    _PageCompMap = map;
}
export {TemplAdd, TemplMark, TemplGet};