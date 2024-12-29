# _BrokerUI-Call the UI component

The main functions include:

- Call the UI component

Description of the value of module parameters:

- If the value you want to set is a fixed value, you can directly set the value of the corresponding type.

- If you want to dynamically obtain the value from `passParam` as the set value, please use `get##key` as the setting value of the module parameter.

- If the value you want to get is in the inner layer of passParam (nested json), please locate it with `>>`, such as `get##key_1>>key_2`

# ※ Call the UI component

- Add version: 1.0=2024.11.15

Examples of setting components:

```json
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

获取组件数据例子：

```json
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

| key           | Description                                                  | Necessary | Default | Type   | Add/Update     |
| ------------- | ------------------------------------------------------------ | --------- | ------- | ------ | -------------- |
| _id           | component id                                                 | Yes       |         | String | 1.0=2024.11.15 |
| _config       | Settings sent to the component                               | Yes       |         | Object | 1.0=2024.11.15 |
| _isSync       | Whether to send synchronously, true: synchronous, false: asynchronous | No        | false   | Bool   | 1.0=2024.11.15 |
| _isNullError  | When sending fails, whether to report an error, true: report an error, false: do not report an error | No        | true    | Bool   | 1.0=2024.11.15 |
| _isFailResend | When sending fails, whether to retry automatically, true: retry, false: do not retry | No        | true    | Bool   | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _config

- Settings sent to the component

- When calling the component, `passParam` will be sent at the same time

- In the `_config` setting, the `value` corresponding to the outermost `key` supports the module parameter syntax, such as `{"key":"get#$value"}`, which means that `$value` is obtained from `passParam`

- If the value you want to get is in the inlayer layer (nested json) of `passParam`, please locate it with `>>`, such as `get##key_1>>key_2`

### > _isNullError

- When sending fails, whether to report an error, true: report an error, false: do not report an error

- When `_isFailResend` is set to `true`, no error will be reported

### > _isFailResend

- When sending fails, whether to retry automatically, true: retry, false: do not retry

- Because React is an asynchronous mounting component, when the page is first opened, there may be a situation where the component is not mounted and the transmission fails

- When `_isFailResend` is set to `true`, the setting will be automatically resent when the component is mounted

- If the settings are resent, multiple settings will be sent asynchronously in order, so it cannot be guaranteed that the components can receive the settings in order

# ◎ Configuration Notes

The module configuration is set in `_BrokerUI/Once.Config`. When the application is run through Christmas, it will be automatically spliced to `Code/Common/Config/Config.js`

| key                                       | Description                                                  | Necessary | Default     | Type   | Add/Update     |
| ----------------------------------------- | ------------------------------------------------------------ | --------- | ----------- | ------ | -------------- |
|      |             |           |         |      |            |

# ◎ Module test separately

In the project root directory, run the shell instruction

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _BrokerUI
```

You can also run `ShellExcute>>Build#Module` through the `Christmas` plug-in, and enter `_BrokerUI` in the terminal opened by the plug-in

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Update list

**1.0=2024.11.15**

- Module create