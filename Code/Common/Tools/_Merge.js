import {isPlainObject, merge, uniq, cloneDeep} from "lodash-es"

function MergeDefault_Deep(config, defaultConfig={}) {
    //WHEN::Allow anything
    if(defaultConfig===null) {
        if (typeof config === "undefined")
            return undefined;
        else
            return config;
    }

    //WHEN::Normal type(not {},[]) check
    if(typeof defaultConfig !== "object")
        if(typeof defaultConfig === typeof config)
            return config;
        else
            return defaultConfig;

    //WHEN::defaultConfig is empty([],{}), only constraint type
    if(Object.keys(defaultConfig).length === 0)
        if (typeof config === "undefined")
            return defaultConfig;
        else if(Array.isArray(defaultConfig) === Array.isArray(config))
            return config;
        else
            return defaultConfig;

    //WHEN::defaultConfig is Object(not empty)
    const isArray = Array.isArray(defaultConfig);
    if(!isArray) {
        let result = {}
        //WHEN-IN::Different type
        if(typeof config === "object" && Array.isArray(config))
            return defaultConfig;

        for (const key in defaultConfig) {
            if (config.hasOwnProperty(key)){
                result[key] = MergeDefault_Deep(config[key], defaultConfig[key]);
            }else {
                if(Array.isArray(defaultConfig[key])) {
                    result[key] = MergeDefault_Deep(config[key], defaultConfig[key]);
                }else
                    result[key] = defaultConfig[key];
            }
        }
        return result;
    }

    //WHEN::defaultConfig is Array(not empty)
    else {
        //STEP-IN::Get range type
        let isRange = false;
        let isLockCount = false;
        if(defaultConfig.length>1) {
            let typeList = [];
            for (let index = 0; index < defaultConfig.length; index++)
                typeList.push(Object.prototype.toString.call(defaultConfig[index]));
            typeList = uniq(typeList);
            if(typeList.length === defaultConfig.length) {
                isRange = true;
            } else if(typeList.length!==1 && typeList.length !== defaultConfig.length){
                isLockCount = true;
            }
        }

        //WHEN-IN::Range setting, not real list
        if(isRange){
            if(config === undefined)
                return defaultConfig[0];
            const configType = Object.prototype.toString.call(config);
            for (let index = 0; index < defaultConfig.length; index++){
                if(configType === Object.prototype.toString.call(defaultConfig[index])){
                    return MergeDefault_Deep(config, defaultConfig[index]);
                }
            }
            return defaultConfig[0];
        }

        //WHEN-IN::Lock count, one by one insert
        if(isLockCount){
            const result = [];
            if(!Array.isArray(config))
                return defaultConfig;
            for (let index = 0; index < defaultConfig.length; index++){
                let item = index<config.length?MergeDefault_Deep(config[index], defaultConfig[index]):defaultConfig[index];
                result.push(item);
            }
            return result;
        }

        //WHEN-IN::List
        const result = [];
        if(!Array.isArray(config))
            return defaultConfig;
        for (let index = 0; index < config.length; index++){
            let item = MergeDefault_Deep(config[index], defaultConfig[0])
            result.push(item);
        }
        return result;
    }
}

//TIPS::Merge object
//>>config::The config setting
//>>defaultConfig::Default setting
//                - If the types of 'config' and 'defaultConfig' are the same, the value of config will be returned, otherwise the value of defaultConfig will be adopted
//                - If defaultConfig is 'null', it means that the value type is not limited
//                - If defaultConfig is an array, and all element types are inconsistent, it is considered to be a value range. As long as config meets one of the types, it will be adopted
//                - If defaultConfig is an array, and there are elements of the same type, indicating an array of fixed sequences.Only the elements at the corresponding positions in the config that meet the type requirements will be accepted
//>>return::new object
function MergeDefault (config={}, defaultConfig={}) {
    try {
        //WHEN::isDeep is false, it means that there is no need to expand the object match
        return MergeDefault_Deep(cloneDeep(config), cloneDeep(defaultConfig));
    }catch (e){
        console.debug("Common-Tools MergeDefault exception", e);
        return defaultConfig;
    }
}

//TIPS::Merge object simply(Use merge of lodash-es)
//>>config::Value(Priority)
//>>defaultConfig::Supplementary value(Priority)
//>>return::new value
function Merge (config={}, defaultConfig={}) {
    try {
        if(isPlainObject(config) && isPlainObject(defaultConfig))
            return merge({}, defaultConfig ,config)
        else if(Array.isArray(config) && Array.isArray(defaultConfig))
            return merge([], defaultConfig ,config)
        return config;
    }catch (e){
        console.debug("Common-Tools MergeDefault exception", e);
        return defaultConfig;
    }
}

export {MergeDefault, Merge}