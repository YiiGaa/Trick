# _OperEvent-Event operation

The main functions include:

- event window-`window` related event operation
- event document-`document` related event operation

- timer add-add timer

- timer remove-remove timer

Description of the value of module parameters:

- If the value you want to set is a fixed value, you can directly set the value of the corresponding type.

- If you want to dynamically obtain the value from `passParam` as the set value, please use `get##key` as the setting value of the module parameter.

- If the value you want to get is in the inner layer of passParam (nested json), please locate it with `>>`, such as `get##key_1>>key_2`

# ※ event window-`window` related event operation

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperEvent",
    "param":{
				"_action":"event window",
      	"_event":"",
      	"_call":null
    }
}
```

| key           | Description                                                  | Necessary | Default | Type   | Add/Update     |
| ------------- | ------------------------------------------------------------ | --------- | ------- | ------ | -------------- |
| _action   | Fixed as "event window"                                      | Yes       |         | String    | 1.0=2024.11.15 |
| _event    | Events to be monitored                                       | Yes       |         | String    | 1.0=2024.11.15 |
| _call | Callback settings | Yes | | Open type | 1.0=2024.11.15 |
| _isRemove | Whether to remove event monitoring, true: remove monitoring, false: add monitoring | No | false | Bool | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _event

- The monitored window event is actually the `window.addEventListener` that calls the browser

### > _call

- Callback settings, supporting String, function, object types

- When the corresponding value is set to a string, it means to call other components or the function of page Action in the way of `id`. The function of page Action begins with `act##`, such as `act##Language_Change`

- When the corresponding value is a function, it means that this function is called. This type is used for component testing. When making pages, this type cannot be used

- When the corresponding value is the object `{}`, it indicates the detailed setting. In general, when the event is called back, the returned data is an empty object `{}`. If you want to configure the returned data in detail, you should adopt the object type; the fixed format is `{"_call":"","_data":{}} `,`_call` corresponds to the setting of the callback target, and `_data` corresponds to the setting of specific callback data; `_data` fixed format is `{"key 1":"value 1","key 2":"value 2"}`

- When the corresponding value is the array `[]`, the above types can be embedded, and the component will execute multiple callbacks (asynchronous calls, the order cannot be guaranteed)

### > _isRemove

- Whether to remove event monitoring, true: remove monitoring, false: add monitoring

- When you want to remove event monitoring, the settings of `_event` and `_call` need to be consistent with the setting of monitoring, otherwise they cannot be removed

# ※ event document-`document` related event operation

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperEvent",
    "param":{
				"_action":"event document",
      	"_event":"",
      	"_query":"",
      	"_call":null
    }
}
```

| key       | Description                                                  | Necessary | Default | Type      | Add/Update     |
| --------- | ------------------------------------------------------------ | --------- | ------- | --------- | -------------- |
| _action   | Fixed as "event window"                                      | Yes       |         | String    | 1.0=2024.11.15 |
| _event    | Events to be monitored                                       | Yes       |         | String    | 1.0=2024.11.15 |
| _query    | Filter the element of html                                   | Yes       |         | String    | 1.0=2024.11.15 |
| _call     | Callback settings                                            | Yes       |         | Open type | 1.0=2024.11.15 |
| _isRemove | Whether to remove event monitoring, true: remove monitoring, false: add monitoring | No        | false   | Bool      | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _event

- The monitored document event is actually the `document.querySelector(xxx).addEventListener` that calls the browser

### > _query

- The element used to filter html is actually the `document.querySelector` that calls the browser

### > _call

- Callback settings, supporting String, function, object types

- When the corresponding value is set to a string, it means to call other components or the function of page Action in the way of `id`. The function of page Action begins with `act##`, such as `act##Language_Change`

- When the corresponding value is a function, it means that this function is called. This type is used for component testing. When making pages, this type cannot be used

- When the corresponding value is the object `{}`, it indicates the detailed setting. In general, when the event is called back, the returned data is an empty object `{}`. If you want to configure the returned data in detail, you should adopt the object type; the fixed format is `{"_call":"","_data":{}} `,`_call` corresponds to the setting of the callback target, and `_data` corresponds to the setting of specific callback data; `_data` fixed format is `{"key 1":"value 1","key 2":"value 2"}`

- When the corresponding value is the array `[]`, the above types can be embedded, and the component will execute multiple callbacks (asynchronous calls, the order cannot be guaranteed)

### > _isRemove

- Whether to remove event monitoring, true: remove monitoring, false: add monitoring

- When you want to remove event monitoring, the settings of `_event`,  `_call`, `_query` need to be consistent with the setting of monitoring, otherwise they cannot be removed

# ※ timer add-add timer

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperEvent",
    "param":{
				"_action":"timer add",
      	"_id":"",
      	"_time":1000,
      	"_isLoop":true,
      	"_call":null
    }
}
```

| key     | Description                                  | Necessary | Default | Type      | Add/Update     |
| ------- | -------------------------------------------- | --------- | ------- | --------- | -------------- |
| _action | Fixed as "timer add"                         | Yes       |         | String    | 1.0=2024.11.15 |
| _id     | Timer ID, needs to be unique                 | Yes       |         | String    | 1.0=2024.11.15 |
| _time   | Timer time, unit: milliseconds               | Yes       | 0       | Int       | 1.0=2024.11.15 |
| _isLoop | Whether to loop, true: loop, false: not loop | No        | false   | Bool      | 1.0=2024.11.15 |
| _call   | Callback settings                            | No        |         | Open Type | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _isLoop

- Whether to loop, true: loop, false: not loop

- When set to `true`, it is actually called `window.setInterval`

- When set to `false`, it is actually calling `window.setTimeout`

### > _call

- Callback settings, supporting String, function, object types

- When the corresponding value is set to a string, it means to call other components or the function of page Action in the way of `id`. The function of page Action begins with `act##`, such as `act##Language_Change`

- When the corresponding value is a function, it means that this function is called. This type is used for component testing. When making pages, this type cannot be used

- When the corresponding value is the object `{}`, it indicates the detailed setting. In general, when the event is called back, the returned data is an empty object `{}`. If you want to configure the returned data in detail, you should adopt the object type; the fixed format is `{"_call":"","_data":{}} `,`_call` corresponds to the setting of the callback target, and `_data` corresponds to the setting of specific callback data; `_data` fixed format is `{"key 1":"value 1","key 2":"value 2"}`

- When the corresponding value is the array `[]`, the above types can be embedded, and the component will execute multiple callbacks (asynchronous calls, the order cannot be guaranteed)

# ※ timer remove-remove timer

- Add version: 1.0=2024.11.15

```json
{
    "name":"_OperEvent",
    "param":{
				"_action":"timer remove",
      	"_id":"",
      	"_time":1000,
      	"_isLoop":true,
      	"_call":null
    }
}
```

| key     | Description             | Necessary | Default | Type   | Add/Update     |
| ------- | ----------------------- | --------- | ------- | ------ | -------------- |
| _action | Fixed as "timer remove" | Yes       |         | String | 1.0=2024.11.15 |
| _id     | Timer ID                | Yes       |         | String | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _id

- When removing the timer, you must use the same `_id` as when adding a timer, otherwise it cannot be removed


# ◎ Configuration Notes

The module configuration is set in `_OperEvent/Once.Config`. When the application is run through Christmas, it will be automatically spliced to `Code/Common/Config/Config.js`

| key                                       | Description                                                  | Necessary | Default     | Type   | Add/Update     |
| ----------------------------------------- | ------------------------------------------------------------ | --------- | ----------- | ------ | -------------- |
|      |             |           |         |      |            |

# ◎ Module test separately

In the project root directory, run the shell instruction

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperEvent
```

You can also run `ShellExcute>>Build#Module` through the `Christmas` plug-in, and enter `_OperEvent` in the terminal opened by the plug-in

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Update list

**1.0=2024.11.15**

- Module create
