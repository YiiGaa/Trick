# _BrokerUI-调用UI组件

主要功能包括：
- 调用UI组件

模块参数的值说明：

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为模块参数的设置值
- 如果想要获取的值在passParam的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

# ※ 调用UI组件

- 组入版本：1.0=2024.11.15

设置组件例子：

```json
{
    "name":"_BrokerUI",
    "param":{
        "_id":"组件id",
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
    		"_id":"组件id",
        "_isFailResend":false,
        "_isSync":true,
        "_config":{
            "_action":"get",
            "_resultKey":""
        }
     }
}
```

| key           | 说明                                                | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------------- | --------------------------------------------------- | -------- | ------ | ------ | -------------- |
| _id           | 组件id                                              | 是       |        | String | 1.0=2024.11.15 |
| _config       | 发送给组件的设置                                    | 是       |        | Object | 1.0=2024.11.15 |
| _isSync       | 是否同步方式发送，true：同步，false：异步           | 否       | false  | Bool   | 1.0=2024.11.15 |
| _isNullError  | 发送失败时，是否报错，true：报错，false：不报错     | 否       | true   | Bool   | 1.0=2024.11.15 |
| _isFailResend | 发送失败时，是否自动重试，true：重试，false：不重试 | 否       | true   | Bool   | 1.0=2024.11.15 |

模块参数补充说明：

### > _config

- 发送给组件的设置
- 调用组件时，`passParam`会一并发送
- `_config`设置中，最外层的`key`对应的`value`支持模块参数语法，如`{"key":"get##$value"}`，则表示从`passParam`中获取`$value`
- 如果想要获取的值在`passParam`的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

### > _isNullError

- 发送失败时，是否报错，true：报错，false：不报错
- 当`_isFailResend`设置为`true`时，则不会报错

### > _isFailResend

- 发送失败时，是否自动重试，true：重试，false：不重试
- 由于React是异步挂载组件，所以在页面刚打开时，可能存在组件未挂载而发送失败的情况
- 当`_isFailResend`设置为`true`时，当组件被挂载时，会自动重新发送设置
- 若重新发送设置时，堆积了多次设置，会按顺序异步发送，所以不能保证组件能按顺序接收设置

# ◎ 配置说明

模块配置在`_BrokerUI/Once.Config`中设置，通过Christmas运行应用时，会自动拼接到`Code/Common/Config/Config.js`

| key                                       | 说明                                                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ----------------------------------------- | ---------------------------------------------------- | -------- | ------ | ------ | -------------- |
|      |      |          |        |      |               |


# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _BrokerUI
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Module`，并在插件打开的终端中输入`_BrokerUI`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新历史

**1.0=2024.11.15**

- 模块建立



