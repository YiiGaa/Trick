import {isPlainObject, isString, isEqual} from "lodash-es";
import {css} from "@emotion/react";

function MakeGrid_Cell(flex){
    let result = "";
    if(Array.isArray(flex)) {
        let dir = "row";
        let wrap = "nowrap";
        if(flex.length>0)
            dir = flex[0];
        if(flex.length>1)
            wrap = flex[1];
        result = `
            display: flex;
            flex-direction: ${dir};
            flex-wrap: ${wrap};
            width:100%;
        `;
    }
    return result;
}

const MakeGridBreakPoint = {
    "sm":"min-width: 640px",
    "md":"min-width: 768px",
    "lg":"min-width: 1024px",
    "xl":"min-width: 1280px",
    "xxl":"min-width: 1536px",
    "max-sm":"min-width: 640px",
    "max-md":"min-width: 768px",
    "max-lg":"min-width: 1024px",
    "max-xl":"min-width: 1280px",
    "max-xxl":"min-width: 1536px"
}

function __MotionCss(flex, templateMark){
    //WHEN::Setting of _flexDir/_isWap/_isGrow/_isShrink not change
    if(isEqual(templateMark["_flex"], flex))
        return templateMark["flex-css"];

    //STEP::Making flex css
    let flexCss = "";
    if(isPlainObject(flex))
        for (const key in flex) {
            const item = flex[key];
            const flexStr = MakeGrid_Cell(item);
            if (flexStr === "")
                continue;
            let media = "";
            if (key === "all"){
                flexCss += flexStr;
                continue;
            }
            else if (MakeGridBreakPoint.hasOwnProperty(key))
                media = MakeGridBreakPoint[key]
            else if (key.startsWith("max-"))
                media = "min-width: " + key.substring("max-".length);
            else
                media = "min-width: " + key;
            if(key.startsWith('max-'))
                flexCss += `
                    @media not all and (${media}) {
                        ${flexStr}
                    }
                `
            else
                flexCss += `
                    @media only screen and (${media}) {
                        ${flexStr}
                    }
                `
        }
    else if(Array.isArray(flex))
        flexCss = MakeGrid_Cell(flex);

    //STEP::Making Css
    templateMark["_flex"] = flex;
    if(flexCss === "") {
        templateMark["flex-css"] = undefined;
        return undefined;
    }else {
        templateMark["flex-css"] = css`
            ${flexCss}
        `;
        return templateMark["flex-css"];
    }
}

export default __MotionCss;