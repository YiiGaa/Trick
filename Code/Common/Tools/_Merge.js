function MergeDefault_Deep(config, defaultConfig={}, isKeepIllegal = true, isListSingleRange = true) {
    //WHEN::Allow anything
    if(defaultConfig===null) {
        if (typeof config === "undefined")
            return undefined;
        else
            return config;
    }

    //WHEN::Different type
    if(typeof defaultConfig !== "object")
        if(!isKeepIllegal && typeof defaultConfig !== typeof config && Array.isArray(defaultConfig) === Array.isArray(config))
            return defaultConfig;
        else if (typeof config === "undefined")
            return defaultConfig;
        else
            return config;

    //WHEN::defaultConfig is empty, only constraint type
    if(Object.keys(defaultConfig).length === 0)
        if (typeof config === "undefined")
            return defaultConfig;
        else if(isKeepIllegal || Array.isArray(defaultConfig) === Array.isArray(config))
            return config;
        else
            return defaultConfig;

    //WHEN::defaultConfig is Object
    const isArray = Array.isArray(defaultConfig);
    if(!isArray) {
        let result = {}
        if(typeof config === "object" && Array.isArray(config)) {
            if (isKeepIllegal && typeof config !== "undefined")
                return config;
            return defaultConfig;
        }
        if(isKeepIllegal && typeof config !== "undefined"){
            result = {...config}
        }
        for (const key in defaultConfig) {
            if (config.hasOwnProperty(key))
                result[key] = MergeDefault_Deep(config[key], defaultConfig[key], isKeepIllegal);
            else if(isKeepIllegal && typeof config[key] !== "undefined")
                result[key] = config[key];
            else
                result[key] = defaultConfig[key];
        }
        return result;
    }

    //WHEN::defaultConfig is Array
    else {
        //STEP-IN::Whether defaultConfig is range or not
        let isRange = false;
        if ((defaultConfig.length === 1 && isListSingleRange) ||
            (defaultConfig.length > 1 && (typeof defaultConfig[0] !== typeof defaultConfig[1] || (typeof defaultConfig[0] === "object" && Array.isArray(defaultConfig[0]) !== Array.isArray(defaultConfig[1]))))
        ) {
            isRange = true;
        }

        //WHEN-IN::Config is not array
        const type = typeof config;
        if (!Array.isArray(config)) {
            if(!isRange) {
                if (isKeepIllegal && typeof config !== "undefined")
                    return config;
                return defaultConfig;
            }
            for(const item of defaultConfig) {
                if (typeof item === type && Array.isArray(item) === Array.isArray(config))
                    return MergeDefault_Deep(config, item, isKeepIllegal);
            }
            if (isKeepIllegal && typeof config !== "undefined")
                return config;
            return defaultConfig[0];
        }
        //WHEN-IN::Config is array
        else {
            const result = [];
            for(let i = 0; i < config.length; i++){
                const item = config[i];
                if(!isRange){
                    if(i<defaultConfig.length)
                        result.push(MergeDefault_Deep(item, defaultConfig[i], isKeepIllegal,isListSingleRange));
                    else if(isKeepIllegal)
                        result.push(item);
                } else {
                    let isPush = false;
                    for (const item_1 of defaultConfig) {
                        if (typeof item === typeof item_1 && Array.isArray(item) === Array.isArray(item_1)) {
                            result.push(MergeDefault_Deep(item, item_1, isKeepIllegal,isListSingleRange));
                            isPush = true;
                            break;
                        }
                    }
                    if(!isPush && isKeepIllegal)
                        result.push(item);
                }
            }
            if(isKeepIllegal && result.length===0 && typeof config !== "undefined")
                return config;
            return result;
        }
    }
}

//TIPS::Merge object
//>>config::The config setting
//>>defaultConfig::Default setting
//                - If the types of 'config' and 'defaultConfig' are the same, the value of config will be returned, otherwise the value of defaultConfig will be adopted
//                - If defaultConfig is 'null', it means that the value type is not limited
//                - If config is a 'non-array' and defaultConfig is an array, it can represent the type value range, but it is required that the element types in the array are not equal
//>>isDeep::Whether to expand the object and check it in depth
//>>isKeepIllegal::When the element is illegal, whether to keep the element
//>>isListSingleRange::When there is only one element in the array, is it considered to be a value range
//>>return::new object
function MergeDefault (config={}, defaultConfig={}, isDeep = true, isKeepIllegal = false, isListSingleRange=true) {
    try {
        //WHEN::isDeep is false, it means that there is no need to expand the object match
        if(isDeep === false)
            return Object.keys(config).reduce((merged, key) => {
                if (defaultConfig.hasOwnProperty(key) && (defaultConfig===null || typeof defaultConfig[key] === typeof config[key])) {
                    merged[key] = config[key];
                }
                return merged;
            }, {...defaultConfig});
        return MergeDefault_Deep(config, defaultConfig, isKeepIllegal,isListSingleRange);
    }catch (e){
        console.debug("Common-Tools MergeDefault exception", e);
        return defaultConfig;
    }
}

//TIPS::Simply merge multiple objects(not deep copy), The data of high-priority objects will overwrite the data of low-priority objects
//>>config::Highest priority object
//>>defaultConfig::Secondary priority object
//>>baseConfig::Object with the lowest priority
//>>return::new object
function Merge (config={}, defaultConfig={}, ...baseConfig) {
    try {
        let result = {};
        for(let i=baseConfig.length-1;i>=0;i--){
            result = {...result, ...baseConfig[i]}
        }
        return {...result, ...defaultConfig, ...config};
    }catch (e){
        console.debug("Common-Tools Merge exception", e);
        return defaultConfig;
    }
}

export {MergeDefault, Merge}