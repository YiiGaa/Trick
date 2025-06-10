# _OperTrick-Trick framework operation

The main functions include:

- lang change-Change language
- lang listen-Listen to language changes

- theme change-Change theme

- theme listen-Listen to theme changes

Description of the value of module parameters:

- If the value you want to set is a fixed value, you can directly set the value of the corresponding type.

- If you want to dynamically obtain the value from `passParam` as the set value, please use `get##key` as the setting value of the module parameter.

- If the value you want to get is in the inner layer of passParam (nested json), please locate it with `>>`, such as `get##key_1>>key_2`

# ※ lang change-Change language

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperTrick",
    "param":{
				"_action":"lang change",
      	"_language":""
    }
}
```

| key           | Description                                                  | Necessary | Default | Type   | Add/Update     |
| ------------- | ------------------------------------------------------------ | --------- | ------- | ------ | -------------- |
| _action   | Fixed as "lang change" | Yes       |         | String | 1.0=2024.11.15 |
| _language | Changed language | Yes | | String | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _language

- Changed language
- The language to be changed must be a supported language, and the language range needs to be set in the `Lang.range` configuration under `/Once.Config`

- For adding the new language, please refer to the language description of the `Trick framework`

# ※ lang listen-Listen to language changes

- Add version: 1.0=2024.11.15
- Because the language file is loaded asynchronously, the loading may not be completed when the web page is loaded at the beginning. If the initial logic of the page needs to obtain the language value, please listen to the loading completion timing through this module
- If the current language file has been loaded before the monitoring language change, a `_call` callback will be automatically triggered

```json
{
    "name":"_OperTrick",
    "param":{
				"_action":"lang listen",
      	"_call":null
    }
}
```

| key     | Description            | Necessary | Default | Type      | Add/Update     |
| ------- | ---------------------- | --------- | ------- | --------- | -------------- |
| _action | Fixed as "lang listen" | Yes       |         | String    | 1.0=2024.11.15 |
| _call   | Callback settings      | Yes       |         | Open Type | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _call

- Callback settings, supporting String, function, object types

- When the corresponding value is set to a string, it means to call other components or the function of page Action in the way of `id`. The function of page Action begins with `act##`, such as `act##Language_Change`

- When the corresponding value is a function, it means that this function is called. This type is used for component testing. When making pages, this type cannot be used

- When the corresponding value is the object `{}`, it indicates the detailed setting. In general, when the event is called back, the returned data is an empty object `{}`. If you want to configure the returned data in detail, you should adopt the object type; the fixed format is `{"_call":"","_data":{}} `,`_call` corresponds to the setting of the callback target, and `_data` corresponds to the setting of specific callback data; `_data` fixed format is `{"key 1":"value 1","key 2":"value 2"}`

- When the corresponding value is the array `[]`, the above types can be embedded, and the component will execute multiple callbacks (asynchronous calls, the order cannot be guaranteed)
- Trick2.2 added. By default, the `event` will be bubbled and passed (the upper HTML node will also respond). If you want not to bubble and pass, you can use the `_isStop` setting, `{"_isStop":true,"_call":"xxx "}`. If you want to set multiple callbacks, you can set it to `{"_isStop":true,"_call":["xxx", "xxx"]}`. If the bubble transmission is turned off, the `a` capture of the SPA web page by `_BoxPage` will also be invalidated

# ※ theme change-Change theme

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperTrick",
    "param":{
				"_action":"theme change",
      	"_theme":""
    }
}
```

| key     | Description             | Necessary | Default | Type   | Add/Update     |
| ------- | ----------------------- | --------- | ------- | ------ | -------------- |
| _action | Fixed as "theme change" | Yes       |         | String | 1.0=2024.11.15 |
| _theme  | The theme of change     | Yes       |         | String | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _theme

- Changed theme

- The changed theme needs to be a supported theme, and the theme scope needs to be set in `/Once.Config`'s `Theme.range`

- For new theme, please refer to the theme description of `Trick Framework`

# ※ theme listen-Listen to theme changes

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperTrick",
    "param":{
				"_action":"theme listen",
      	"_call":null
    }
}
```

| key     | Description             | Necessary | Default | Type      | Add/Update     |
| ------- | ----------------------- | --------- | ------- | --------- | -------------- |
| _action | Fixed as "theme listen" | Yes       |         | String    | 1.0=2024.11.15 |
| _call   | Callback settings       | Yes       |         | Open Type | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _call

- Callback settings, supporting String, function, object types

- When the corresponding value is set to a string, it means to call other components or the function of page Action in the way of `id`. The function of page Action begins with `act##`, such as `act##Language_Change`

- When the corresponding value is a function, it means that this function is called. This type is used for component testing. When making pages, this type cannot be used

- When the corresponding value is the object `{}`, it indicates the detailed setting. In general, when the event is called back, the returned data is an empty object `{}`. If you want to configure the returned data in detail, you should adopt the object type; the fixed format is `{"_call":"","_data":{}} `,`_call` corresponds to the setting of the callback target, and `_data` corresponds to the setting of specific callback data; `_data` fixed format is `{"key 1":"value 1","key 2":"value 2"}`

- When the corresponding value is the array `[]`, the above types can be embedded, and the component will execute multiple callbacks (asynchronous calls, the order cannot be guaranteed)
- Trick2.2 added. By default, the `event` will be bubbled and passed (the upper HTML node will also respond). If you want not to bubble and pass, you can use the `_isStop` setting, `{"_isStop":true,"_call":"xxx "}`. If you want to set multiple callbacks, you can set it to `{"_isStop":true,"_call":["xxx", "xxx"]}`. If the bubble transmission is turned off, the `a` capture of the SPA web page by `_BoxPage` will also be invalidated

# ◎ Configuration Notes

The module configuration is set in `_OperTrick/Once.Config`. When the application is run through Christmas, it will be automatically spliced to `Code/Common/Config/Config.js`

| key                                       | Description                                                  | Necessary | Default     | Type   | Add/Update     |
| ----------------------------------------- | ------------------------------------------------------------ | --------- | ----------- | ------ | -------------- |
|      |             |           |         |      |            |

# ◎ Module test separately

In the project root directory, run the shell instruction

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperTrick
```

You can also run `ShellExcute>>Build#Module` through the `Christmas` plug-in, and enter `_OperTrick` in the terminal opened by the plug-in

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Update list

**1.0=2024.11.15**

- Module create
