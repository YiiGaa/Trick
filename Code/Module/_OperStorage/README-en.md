# _OperStorage-Storage operation

The main functions include:

- save-Save data
- get-Get data

- clean-Clean data

Description of the value of module parameters:

- If the value you want to set is a fixed value, you can directly set the value of the corresponding type.

- If you want to dynamically obtain the value from `passParam` as the set value, please use `get##key` as the setting value of the module parameter.

- If the value you want to get is in the inner layer of passParam (nested json), please locate it with `>>`, such as `get##key_1>>key_2`

# ※ save-Save data

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperStorage",
    "param":{
				"_action":"save",
      	"_key":"",
      	"_value":"",
      	"_expire":3600
    }
}
```

| key           | Description                                                  | Necessary | Default | Type   | Add/Update     |
| ------------- | ------------------------------------------------------------ | --------- | ------- | ------ | -------------- |
| _action    | Fixed as "save"                                           | Yes       |                 | String    | 1.0=2024.11.15 |
| _key | Stored key | Yes | | String | 1.0=2024.11.15 |
| _value | Stored value | Yes | | Open Type | 1.0=2024.11.15 |
| _expire | Expiration time, unit: seconds | No | 0 (Not expired) | Int | 1.0=2024.11.15 |
| _isSession | True: save to sessionStorage, false: save to localStorage | No | false | Bool | 1.0=2024.11.15 |

# ※ get-Get data

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperStorage",
    "param":{
				"_action":"get",
      	"_key":"",
      	"_resultKey":""
    }
}
```

| key          | Description                                                  | Necessary | Default                       | Type   | Add/Update     |
| ------------ | ------------------------------------------------------------ | --------- | ----------------------------- | ------ | -------------- |
| _action      | Fixed as "get"                                               | Yes       |                               | String | 1.0=2024.11.15 |
| _key         | Stored key                                                   | Yes       |                               |        | 1.0=2024.11.15 |
| _resultKey   | Insert the data into the key of `passParam`                  | No        | Clear and replace `passParam` |        | 1.0=2024.11.15 |
| _isNullError | When the acquisition fails, whether to report an error, true: report an error and exit, false: do not report an error, do not write the result | No        | true                          | Bool   | 1.0=2024.11.15 |
| _isSession   | true: Obtained from sessionStorage, false: Obtained from localStorage | No        | false                         | Bool   | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _action

- Obtain the values stored by localStorage and sessionStorage, and it is recommended to obtain them through the `_DataFilling` module

### > _resultKey

- Insert the data into the key of `passParam`
- When `_resultKey` is an empty string`""` and the value obtained is the object type `{}`, empty and replace `passParam`

- When `_resultKey` is an empty string`""` and the value obtained is not the object type `{}`, it is automatically set `_resultKey` to `result`

# ※ clean-Clean data

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperStorage",
    "param":{
				"_action":"clean",
      	"_key":"",
      	"_isSession":""
    }
}
```

| key        | Description                                                  | Necessary | Default        | Type   | Add/Update     |
| ---------- | ------------------------------------------------------------ | --------- | -------------- | ------ | -------------- |
| _action    | Fixed as "clean"                                             | Yes       |                | String | 1.0=2024.11.15 |
| _key       | Clean key                                                    | No        | Clear all data | String | 1.0=2024.11.15 |
| _isSession | true: Remove from sessionStorage, false: Remove from localStorage | No        | false          | Bool   | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _key

- By default, or set to an empty string `""`, all data will be cleaned up
- It is not recommended to clean up all data, especially `localStorage`. The theme and language storage data of the Trick framework are all in `localStorage`

# ◎ Configuration Notes

The module configuration is set in `_OperStorage/Once.Config`. When the application is run through Christmas, it will be automatically spliced to `Code/Common/Config/Config.js`

| key                                       | Description                                                  | Necessary | Default     | Type   | Add/Update     |
| ----------------------------------------- | ------------------------------------------------------------ | --------- | ----------- | ------ | -------------- |
|      |             |           |         |      |            |

# ◎ Module test separately

In the project root directory, run the shell instruction

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperStorage
```

You can also run `ShellExcute>>Build#Module` through the `Christmas` plug-in, and enter `_OperStorage` in the terminal opened by the plug-in

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Update list

**1.0=2024.11.15**

- Module create
