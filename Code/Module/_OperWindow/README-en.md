# _OperWindow-Web page Window operation

The main functions include:

- open-Open a new web window
- close-Close the current web page window

- jump-Jump to the page

- history-Jump to the history page

Description of the value of module parameters:

- If the value you want to set is a fixed value, you can directly set the value of the corresponding type.

- If you want to dynamically obtain the value from `passParam` as the set value, please use `get##key` as the setting value of the module parameter.

- If the value you want to get is in the inner layer of passParam (nested json), please locate it with `>>`, such as `get##key_1>>key_2`

# ※ open-Open a new web window

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"open",
      	"_url":""
    }
}
```

| key           | Description                                                  | Necessary | Default | Type   | Add/Update     |
| ------------- | ------------------------------------------------------------ | --------- | ------- | ------ | -------------- |
| _action    | Fixed as "open"                         | Yes       |         | String | 1.0=2024.11.15 |
| _url | The URL of the web page | Yes | | String | 1.0=2024.11.15 |
| _target | The way to open | No | _Blank (open a new window) | String | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _action

- Open a new web page, which is actually calling the browser's `window.open(_url, _target)` method

# ※ close-Close the current web page window

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"close"
    }
}
```

| key     | Description      | Necessary | Default | Type   | Add/Update     |
| ------- | ---------------- | --------- | ------- | ------ | -------------- |
| _action | Fixed as "close" | Yes       |         | String | 1.0=2024.11.15 |

# ※ jump-Jump to the page

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"jump",
      	"_url":""
    }
}
```

| key        | Description                     | Necessary | Default | Type   | Add/Update     |
| ---------- | ------------------------------- | --------- | ------- | ------ | -------------- |
| _action    | Fixed as "jump"                 | Yes       |         | String | 1.0=2024.11.15 |
| _url       | The URL of the web page         | 是        |         | String | 1.0=2024.11.15 |
| _isReplace | Is not updating webpage history | 否        | false   | Bool   | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _isReplace

- When `_isReplace` is `false`, call `window.location.href = _url`, which will add web page history
- When `_isReplace` is `true`, calling `window.location.replace(_url)`, which will not add web history

# ※ history-Jump to the history page

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"history",
      	"_go":-1
    }
}
```

| key     | Description              | Necessary | Default        | Type   | Add/Update     |
| ------- | ------------------------ | --------- | -------------- | ------ | -------------- |
| _action | Fixed as "jump"          | Yes       |                | String | 1.0=2024.11.15 |
| _go     | Historical serial number | No        | -1（backward） | Int    | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _go

- Historical serial number, call `window.history.go(_go)`
- When `_go` is `-1`, it means to go back one page; when `_go` is `1`, it means one page forward; when `_go` is `0`, refresh the current page

- When `_go` is greater than 0, it indicates moving forward n pages; when `_go` is less than 0, it indicates moving backward n pages

- If `_go` exceeds the operable historical serial number, no jump will occur

# ◎ Configuration Notes

The module configuration is set in `_OperWindow/Once.Config`. When the application is run through Christmas, it will be automatically spliced to `Code/Common/Config/Config.js`

| key                                       | Description                                                  | Necessary | Default     | Type   | Add/Update     |
| ----------------------------------------- | ------------------------------------------------------------ | --------- | ----------- | ------ | -------------- |
|      |             |           |         |      |            |

# ◎ Module test separately

In the project root directory, run the shell instruction

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperWindow
```

You can also run `ShellExcute>>Build#Module` through the `Christmas` plug-in, and enter `_OperWindow` in the terminal opened by the plug-in

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Update list

**1.0=2024.11.15**

- Module create
