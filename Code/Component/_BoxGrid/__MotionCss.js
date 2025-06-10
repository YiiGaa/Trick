import {isNumber, isPlainObject, isString, isEqual} from "lodash-es";
import {css} from "@emotion/react";

function MakeGrid_Cell(grid){
    let result = "";
    if(Array.isArray(grid) && grid.length>2) {
        for (let index = 1; index < grid.length; index++) {
            const item = grid[index];
            if ((index % 2) === 1)
                result += `"${item}" `;
            else
                result += `${item} `;
        }
        result += `/ ${grid[0]}`;
    }
    if(result!=="")
        result = `
            display: grid;
            grid-template:${result};
        `;
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

function __MotionCss(grid, area, templateMark){
    //WHEN::Setting of _grid/_area not change
    if(isEqual(templateMark["_grid"], grid) &&
        isEqual(templateMark["_area"], area)
    ) {
        return templateMark["grid-css"];
    }

    //STEP::Making grid css
    let gridCss = "";
    if(isPlainObject(grid))
        for (const key in grid) {
            const item = grid[key];
            const gridStr = MakeGrid_Cell(item);
            if (gridStr === "")
                continue;
            let media = "";
            if (key === "all"){
                gridCss += gridStr;
                continue;
            }
            else if (MakeGridBreakPoint.hasOwnProperty(key))
                media = MakeGridBreakPoint[key]
            else if (key.startsWith("max-"))
                media = "min-width: " + key.substring("max-".length);
            else
                media = "min-width: " + key;

            if(key.startsWith('max-'))
                gridCss += `
                    @media not all and (${media}) {
                        ${gridStr}
                    }
                `
            else
                gridCss += `
                    @media only screen and (${media}) {
                        ${gridStr}
                    }
                `
        }
    else if(Array.isArray(grid))
        gridCss = MakeGrid_Cell(grid);

    //STEP::Making area css
    let areaCss = "";
    if(isString(area))
        areaCss = `grid-area:${area};`;

    //STEP::Making Css
    templateMark["_grid"] = grid;
    templateMark["_area"] = area;
    if(gridCss === "" && areaCss === "") {
        templateMark["grid-css"] = undefined;
        return undefined;
    }else {
        templateMark["grid-css"] = css`
            ${gridCss}
            ${areaCss}
        `;
        return templateMark["grid-css"];
    }
}

export default __MotionCss;