import Configs from "/Code/Common/Config/Config";
import * as Tools from "/Code/Common/Tools/Tools";
import { useState, useEffect } from 'react';

const Config = Tools.MergeDefault(Configs.common,{
    "Theme.enable":true,
    "Theme.range":["","dark"]
});

export const Theme = {
    Enable:false,
    Theme:document.documentElement.getAttribute('trick-theme'),
    Init:function() {
        if (!Config["Theme.enable"]) {
            return;
        }
        let theme = localStorage.getItem('Trick_Common_Theme');
        if(theme===null){
            theme = document.documentElement.getAttribute('trick-theme');
            theme = theme === null?"":theme;
        }
        localStorage.setItem('Trick_Common_Theme', theme);
        document.documentElement.setAttribute('trick-theme', theme);
        Theme.Theme = theme;
        Theme.Enable = true;
    },
    Change:function(theme){
        if(!Theme.Enable)
            return;
        if(!Config["Theme.range"].includes(theme))
            return;
        localStorage.setItem('Trick_Common_Theme', theme);
        document.documentElement.setAttribute('trick-theme', theme);
        Theme.Theme = theme;
        window.dispatchEvent(new Event('trick-theme'));
    },
    GetTheme:function(){
        if(!Theme.Enable) return "";
        return document.documentElement.getAttribute('trick-theme');
    }
}

//TIPS::For refreshing component
export function useTheme() {
    const [theme, setTheme] = useState(Theme.Theme);

    useEffect(() => {
        const handleThemeChange = () => {
            setTheme(document.documentElement.getAttribute('trick-theme'));
        };

        if(Theme.Enable)
            window.addEventListener('trick-theme', handleThemeChange);

        return () => {
            if(Theme.Enable)
                window.removeEventListener('trick-theme', handleThemeChange);
        };
    }, []);

    return theme;
}