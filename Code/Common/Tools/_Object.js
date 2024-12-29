//TIPS::Clean the object
//>>value::The object will be clean
function ObjectClean (value) {
    try {
        if (Array.isArray(value)) {
            value.splice(0, value.length);
            return;
        }
        if (value instanceof Object) {
            for (const key in value) {
                delete value[key];
            }
        }
    }catch(e){
        console.debug("Common-Tools ObjectClean exception", e);
    }
}

//TIPS::Add the source object to the target object
//>>target::Target object([],{})
//>>source::Source object([],{})
//         - If target and source are both array([]), add elements to target
//         - If target and source are both object({}), add elements to target
//         - Else return false
//>>isDeepClone::Whether to expand the object, deep copy
//>>return::true/false
function ObjectCopy (target, source, isDeepClone = false) {
    try {
        if(!(target instanceof Object && source instanceof Object)) {
            return false;
        }
        if(Array.isArray(target) && Array.isArray(source)) {
            const sourceClone = isDeepClone?ObjectClone(source):source;
            target.push(...sourceClone);
            return true;
        }
        if((!Array.isArray(target) && target instanceof Object) &&
            (!Array.isArray(source) && source instanceof Object)
        ){
            const sourceClone = isDeepClone?ObjectClone(source):source;
            for(const key in sourceClone){
                target[key] = sourceClone[key];
            }
            return true;
        }
    }catch(e){
        console.debug("Common-Tools ObjectCopy exception", e);
    }
    return false;
}

//TIPS::Clone the source object(deep copy)
//>>value::Source object([],{})
//>>return::new object
function ObjectClone (value) {
    const newObj = Array.isArray(value)?[]:{};
    try{
        if (value === null || typeof value !== 'object') {
            return value;
        }
        if (Array.isArray(value)) {
            return value.map(item => ObjectClone(item));
        }
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                newObj[key] = ObjectClone(value[key]);
            }
        }
    }catch(e){
        console.debug("Common-Tools ObjectCopy exception", e);
    }
    return newObj;
}

export {ObjectClean, ObjectClone, ObjectCopy}