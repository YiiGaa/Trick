# _BoxPopover-Prompt pop-up box

The main functions include:

- Config Settings
- show-Display the pop-up box
- set-modify component settings
- get-get component data

# ※ Config Settings

```
{
	"name": "$._BoxPopover",
    "config": {
        "_id":"",
        "_templButton":null,
        "_templPanel":null,
        "_classButton":"",
        "_classPanel":""
    }
}
```

| key          | Description                                                  | Default                                | Type      | Add/Update     |
| ------------ | ------------------------------------------------------------ | -------------------------------------- | --------- | -------------- |
| _id          | Component id, the name should be as unique as possible, and do not contain `.` | No need to call components             | String    | 1.0=2024.11.15 |
| _data        | Custom temporary storage data, which will be returned together when obtaining component data | null                                   | Open type | 1.0=2024.11.15 |
| _templButton | Button template                                              | Take the whole `child` as the template | Open type | 1.0=2024.11.15 |
| _templPanel  | Pop-up box template                                          | Take the whole `child` as the template | Open type | 1.0=2024.11.15 |
| _styleAnchor | Pop-up box opening position, `bottom/top/left/right`         | bottom                                 | String    | 1.0=2024.11.15 |
| _classButton | Button style                                                 |                                        | String    | 1.0=2024.11.15 |
| _classPanel  | Pop-up box style                                             |                                        | String    | 1.0=2024.11.15 |

Parameter Supplementary Description:

### > _id

- Component id, used to identify components, used to operate component (update/obtain data)

- The recommended format is `comp##_BoxPopover<<[page layout]`, such as `comp##_BoxPopover<<Title`, `comp##_BoxPopover<<Title/Info`

- If the component does not need to be operated after initialization, the component id does not need to be set, and the component id is set to an empty string `""`, it is considered an invalid setting

- The component id is as unique as possible. If it is not unique, the component of the same name will respond at the same time

- Try not to include `.` in the component id, due to the influence of the basic library `pubsub-js`, if the name contains `.`, which may cause multiple components to be called. For example, when calling the `a` component, components such as `a.1` and `a.2` will be called at the same time

### > _templ

- The key at the beginning of `_templ` will be regarded as a template setting
- When the corresponding value is a string and starts with `$.` (required for Trick2.2 version and later), the corresponding component is used as a template. This setting only takes effect in the `xxxUI.json` `xxxAction.json` page configuration, while other situations will be processed as a string
- When the corresponding value is set to `null` (default), or the following settings cannot be obtained correctly, the whole `child` will be used as the template. And  `child` is the `child` set to the page UI (the embedded subcomponent of this component)
- When the corresponding value is a string and begins with `child##`, the nth subcomponent of `child` will be selected as a template, such as `child##2`, the third (starting from 0) subcomponent of `child` will be selected as the template
- When the corresponding value is a string and begins with `layout##` (Trick2.2 and later versions take effect), a page layout will be used as a template, such as `layout##Theme`, and the page layout with id  `Theme` will be selected as the template
- `child##` and `layout##` both support deep filtering mode, separated by `>>`, such as `child##_BoxForm>>_CompInput`, and the hierarchy is determined by the jsx nested hierarchy
- When the corresponding value is a string and does not contain the above special beginning, it will be regarded as text and will be automatically translated
- When the corresponding value is the object `{}`, it indicates the detailed setting mode, and the fixed format is `{"_templ":"","_config":{},"_configDeep":{}}`. `_templ` corresponds to the template selection (the above types are applicable); `_config` will automatically merge into the outermost layer of the template `config`; `_configDeep` will automatically merge into the inner layer of the template `config`, and the specific format is `{"position 1":{},"position 2":{}}`, `key` is the positioning setting, using `>>` locate, you can use `index number` or `component name` to select, such as `0>>div>>_Boxflex`, indicating `0th component`>>`div`>>`component named _Boxflex`; when `_templ` is text, `_config` will be used as a translation setting (variable replacement), and `_configDeep` is invalid
- When the corresponding value is the array `[]`, the above type can be embedded, and the template will be arranged in the order of this array

### > _text

- The key at the beginning of `_text` will be regarded as a text setting

- When the corresponding value is a string, it will be automatically translated

- The recommended text format that needs to be translated is `**[page layout]>>[text prompt]`, such as `**Form>>occupation`, `**Form/occupation>>project manager`

- When the corresponding value is the object `{}`, it indicates the detailed settings. The fixed format is `{"_text":"xxx", "key 1":"value", "key 2":"value"}`, `_text` corresponds to the text settings, and other settings are translated Settings (variable replacement)

### > _src

- The key starting with `_src` will be regarded as the resource file path setting

- Starting with `//`, it will automatically locate the storage location of the project picture

- When the page is running, `//` will automatically locate to `Code/Assets`

- When this component is running alone, `//` will automatically locate the `test` folder of the current component

- The `test` folder needs to be created manually and is only used for the separate test run of the current component
- 
### > _class

- The key at the beginning of `_class` is generally set to the class of html

- It is recommended to use the class of `tailwindcss` for setting. If you need to overwrite the inherent style settings of the component, you need to add  `!`  before the class name, such as `!w-full`

- You can use the page-customized `class` to set it. If you need to overwrite the inherent style settings of the component, you need to set it `!important`

- Text, margin size, color, etc.Try to use the variables of the theme css file, custom `class` can be set by `var(xxx)`; `tailwindcss` can be set by `[xxx]`, such as `gap-[--Theme-Gap]`

### > _on

- The key at the beginning of `_on` is generally the setting of the event callback

- When the corresponding value is set to a string and starts with `pack##`, it automatically calls its upper `Pack component`, such as `_PackForm`, etc.; this kind of `Pack component` passes the callback address and some data to all lower components; It can be set the `_action` of calling `Pack component` after `pack##` , such as `pack##commit`, which indicates the `commit` action of calling the upper `Pack component`

- When the corresponding value is set to a string, it means to call other components or the function of page Action in the way of `id`. And the function of page Action begins with `act##`, such as `act##Language_Change`

- When the corresponding value is a function, it means that this function is called. This type is used for component testing. When making pages, this type cannot be used

- When the corresponding value is the object `{}`, it indicates the detailed setting. In general, when the event is called back, the returned data is the data of the whole component. If you want to configure the returned data in detail, the object type should be adopted; the fixed format is `{"_call":"",_data":{}} `,`_call` corresponds to the setting of the callback target, and `_data` corresponds to the setting of specific callback data; `_data` fixed format is `{"key 1":"value 1","key 2":"value 2"}`,  the `value` corresponding to the outermost `key` supports dynamic injection syntax; the dynamic syntax of `value` is that the beginning of `get##` means that it is obtained from the data of this component, and the beginning of `pack##` means that it is obtained from the data passed by `Pack component`, and it is allowed to use `>>` to locate deep data, such as `get## Key_1>>key_2`

- When the corresponding value is the array `[]`, the above types can be embedded, and the component will execute multiple callbacks (asynchronous calls, the order cannot be guaranteed)
- Trick2.2 added. By default, the `event` will be bubbled and passed (the upper HTML node will also respond). If you want not to bubble and pass, you can use the `_isStop` setting, `{"_isStop":true,"_call":"xxx "}`. If you want to set multiple callbacks, you can set it to `{"_isStop":true,"_call":["xxx", "xxx"]}`. If the bubble transmission is turned off, the `a` capture of the SPA web page by `_BoxPage` will also be invalidated

# ※ show-Display the pop-up box

Add version: 1.0=2024.11.15

The call parameters are as follows. For the specific call method, please refer to `modify component settings`

```
{
		"_action":"show"
}
```

| key     | Description     | Default | Type   | Add/Update     |
| ------- | --------------- | ------- | ------ | -------------- |
| _action | Fixed as "show" |         | String | 1.0=2024.11.15 |

Supplementary description of parameters:

### > _action

- Display a pop-up box, which is essentially the click event of the trigger button

# ※ set-modify component settings

Add version: Component general mechanism

The parameters passed by the modified component are the same as `Config settings`, and the data that does not need to be updated can be omitted

- If the data is an array `[]` , and you want it to be an additional mode, add the `push##` prefix before `key`, such as `push##key`

- If the data is an array `[]` and you only want to replace the data at a certain position, then append the prefix `push##index##` before `key`, for example, `push##1##key`

- If the data is the object type `{}`, by default, the component will supplement and merge the omitted fields. If you do not want to merge the old settings, you can add the prefix `nec##` before `key`

- The prefix `nec##` and `push##` cannot exist at the same time

- The above prefix is only applicable to the `key` of the outermost layer of the `config` object
- If the newly set value does not match the type requirements, it will be replaced with the default value of the component instead of retaining the initialized component settings

### > Page Action Call Example

`Page Action` needs to use the `_BrokerUI` module for component settings, where `_config` corresponds to the set data

```
{
    "name":"_BrokerUI",
    "param":{
        "_id":"component id",
        "_config":{
        	"key":"value"
        }
    }
}
```

Supplementary note:

In the `_config` setting, the `value` corresponding to the outermost `key` supports module parameter syntax, such as `{"key":"get##$value"}`, which means that `$value` is obtained from `passParam`

- If you want to set the value to a fixed value, you can directly set the value of the corresponding type

- If you want to dynamically obtain the value from `passParam` as the setting value, please use `get##key` as the setting value

- If the value you want to get is in the inlayer layer (nested json) of `passParam`, please locate it with `>>`, such as `get##key_1>>key_2`

### > Page UI call example

If you want to update this component's settings when other component events are triggered. You can set the following parameters in the event callback of the corresponding component, where `_data` corresponds to the data of the settings

```
"_onXXX"：{
    "_call":"component id"
    "_data":{
        "key":"value"
    }
}
```

Supplementary note:

In the `_data` setting, the `value` corresponding to the outermost `key` supports dynamic injection syntax, such as `{"key":"get##key 1"}`, which means that the data of `key 1` is obtained from the component data that triggers the callback.

- If you want to get the value from the component data that triggers the callback, start with `get##`

- If you want to get the value from the data passed by the upper `Pack component` of the component that triggers the callback, use `pack##` to begin with

- When using `get##` and `pack##` at the beginning, it is allowed to use `>>` to locate deep data, such as `get##key_1>>key_2`

- Dynamic injection syntax is only suitable for the setting of the outermost value of the `_data` object, and the deep settings will not be processed

```
{
	"key 1":"get##key 1",         #dynamic injection value
	"key 2":{
  		"Key 2-1":"get##key 2"    #keep the value of 'get##key 2'
  }
}

```

# ※ get-get component data

Add version: Component general mechanism

`Page Action` needs to use the `_BrokerUI` module for getting component data, and the returned data is all the data in the above `config settings`

The data will be automatically inserted into `passParam`, and the inserted field is the value corresponding to `_resultKey`. When the corresponding value of `_resultKey` is an empty string `""`, the entire `passParam` will be emptied and the data will be written

```
{
    "name":"_BrokerUI",
    "param":{
    	"_id":"component id",
        "_isFailResend":false,
        "_isSync":true,
        "_config":{
            "_action":"get",
            "_resultKey":""
        }
     }
}
```

# ◎ Module separate test

In the root directory of the project, run the shell command

```
Python3 Christmas/Christmas.py ShellExcute/Build#Component _BoxPopover

```

You can also run `ShellExcute>>Build#Component` through `Christmas plug-in` and enter `_BoxPopover` in the terminal where the plug-in is opened

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Updated list

**1.1=2025.04.11**

- [update]`_templ` add `self##` mode
- [update] Remove the tailwincss utility classes from the component css to avoid the page requiring `important` to override styles

**1.0=2024.11.15**

- Component create