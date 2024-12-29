# _OperEvent-事件操作

主要功能包括：
- event window-`window`相关事件操作
- event document-`document`相关事件操作
- timer add-计时器添加
- timer remove-计时器移除

模块参数的值说明：

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为模块参数的设置值
- 如果想要获取的值在passParam的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

# ※ event window-`window`相关事件操作

- 组入版本：1.0=2024.11.15

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

| key           | 说明                                                | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------------- | --------------------------------------------------- | -------- | ------ | ------ | -------------- |
| _action    | 固定为"event window"                   | 是       |        | String | 1.0=2024.11.15 |
| _event | 监听的事件 | 是 | | String | 1.0=2024.11.15 |
| _call | 回调设置 | 是 | | 开放类型 | 1.0=2024.11.15 |
| _isRemove | 是否去除事件监听，true：移除监听，false：添加监听 | 否 | false | Bool | 1.0=2024.11.15 |

模块参数补充说明：

### > _event

- 监听的window事件，实际上是调用浏览器的`window.addEventListener`

### > _call

- 回调设置，支持String、函数、对象类型
- 当对应值设置为字符串，则表示以`id`的方式调用其他组件，或者页面Action的函数，页面Action的函数以`act##`开头，如`act##Language_Change`
- 当对应值为函数，则表示调用此函数，此类型用于组件测试，在制作页面时，无法使用此种类型
- 当对应值为对象`{}`，表示详细设置，一般情况下，事件回调时，返回的数据为空对象`{}`，如果希望详细配置返回的数据，则应该采用对象类型；固定格式为`{"_call":"","_data":{}}`，`_call`对应回调目标的设置，`_data`对应具体回调数据的设置；`_data`固定格式为`{"key 1":"value 1","key 2":"value 2"}`
- 当对应值为数组`[]`，可以内嵌以上类型，组件会执行多个回调（异步调用，无法保证顺序）

### > _isRemove

- 是否去除事件监听，true：移除监听，false：添加监听
- 当希望移除事件监听时，`_event`和`_call`的设置需要与设置监听时保持一致，否则无法移除

# ※ event document-`document`相关事件操作

- 组入版本：1.0=2024.11.15

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

| key       | 说明                                              | 是否必要 | 默认值 | 类型     | 组入/更新版本  |
| --------- | ------------------------------------------------- | -------- | ------ | -------- | -------------- |
| _action   | 固定为"event document"                            | 是       |        | String   | 1.0=2024.11.15 |
| _event    | 监听的事件                                        | 是       |        | String   | 1.0=2024.11.15 |
| _query    | 筛选html的element                                 | 是       |        | String   | 1.0=2024.11.15 |
| _call     | 回调设置                                          | 是       |        | 开放类型 | 1.0=2024.11.15 |
| _isRemove | 是否去除事件监听，true：移除监听，false：添加监听 | 否       | false  | Bool     | 1.0=2024.11.15 |

模块参数补充说明：

### > _event

- 监听的document事件，实际上是调用浏览器的`document.querySelector(xxx).addEventListener`

### > _query

- 用于筛选html的element，实际上是调用浏览器的`document.querySelector`

### > _call

- 回调设置，支持String、函数、对象类型
- 当对应值设置为字符串，则表示以`id`的方式调用其他组件，或者页面Action的函数，页面Action的函数以`act##`开头，如`act##Language_Change`
- 当对应值为函数，则表示调用此函数，此类型用于组件测试，在制作页面时，无法使用此种类型
- 当对应值为对象`{}`，表示详细设置，一般情况下，事件回调时，返回的数据为空对象`{}`，如果希望详细配置返回的数据，则应该采用对象类型；固定格式为`{"_call":"","_data":{}}`，`_call`对应回调目标的设置，`_data`对应具体回调数据的设置；`_data`固定格式为`{"key 1":"value 1","key 2":"value 2"}`
- 当对应值为数组`[]`，可以内嵌以上类型，组件会执行多个回调（异步调用，无法保证顺序）

### > _isRemove

- 是否去除事件监听，true：移除监听，false：添加监听
- 当希望移除事件监听时，`_event`，`_call`，`_query`的设置需要与设置监听时保持一致，否则无法移除

# ※ timer add-计时器添加

- 组入版本：1.0=2024.11.15

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

| key     | 说明                                | 是否必要 | 默认值 | 类型     | 组入/更新版本  |
| ------- | ----------------------------------- | -------- | ------ | -------- | -------------- |
| _action | 固定为"timer add"                   | 是       |        | String   | 1.0=2024.11.15 |
| _id     | 计时器ID，需要唯一                  | 是       |        | String   | 1.0=2024.11.15 |
| _time   | 计时器时间，单位：毫秒              | 是       | 0      | Int      | 1.0=2024.11.15 |
| _isLoop | 是否循环，true：循环，false：不循环 | 否       | false  | Bool     | 1.0=2024.11.15 |
| _call   | 回调设置                            | 是       |        | 开放类型 | 1.0=2024.11.15 |

模块参数补充说明：

### > _isLoop

- 是否循环，true：循环，false：不循环
- 设置为`true`时，实际上是调用`window.setInterval`
- 设置为`false`时，实际上是调用`window.setTimeout`

### > _call

- 回调设置，支持String、函数、对象类型
- 当对应值设置为字符串，则表示以`id`的方式调用其他组件，或者页面Action的函数，页面Action的函数以`act##`开头，如`act##Language_Change`
- 当对应值为函数，则表示调用此函数，此类型用于组件测试，在制作页面时，无法使用此种类型
- 当对应值为对象`{}`，表示详细设置，一般情况下，事件回调时，返回的数据为空对象`{}`，如果希望详细配置返回的数据，则应该采用对象类型；固定格式为`{"_call":"","_data":{}}`，`_call`对应回调目标的设置，`_data`对应具体回调数据的设置；`_data`固定格式为`{"key 1":"value 1","key 2":"value 2"}`
- 当对应值为数组`[]`，可以内嵌以上类型，组件会执行多个回调（异步调用，无法保证顺序）

# ※ timer remove-计时器移除

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperEvent",
    "param":{
				"_action":"timer remove",
      	"_id":""
    }
}
```

| key     | 说明                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------- | -------------------- | -------- | ------ | ------ | -------------- |
| _action | 固定为"timer remove" | 是       |        | String | 1.0=2024.11.15 |
| _id     | 计时器ID             | 是       |        | String | 1.0=2024.11.15 |

模块参数补充说明：

### > _id

- 移除计时器时，必须采用与添加计时器时相同的`_id`，否则无法移除

# ◎ 配置说明

模块配置在`_OperEvent/Once.Config`中设置，通过Christmas运行应用时，会自动拼接到`Code/Common/Config/Config.js`

| key                                       | 说明                                                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ----------------------------------------- | ---------------------------------------------------- | -------- | ------ | ------ | -------------- |
|      |      |          |        |      |               |


# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperEvent
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Module`，并在插件打开的终端中输入`_OperEvent`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新历史

**1.0=2024.11.15**

- 模块建立
