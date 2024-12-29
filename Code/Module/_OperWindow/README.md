# _OperWindow-网页Window操作

主要功能包括：
- open-打开新网页窗口
- close-关闭当前网页窗口
- jump-跳转页面
- history-跳转历史页面

模块参数的值说明：

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为模块参数的设置值
- 如果想要获取的值在passParam的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

# ※ open-打开新网页窗口

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"open",
      	"_url":""
    }
}
```

| key           | 说明                                                | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------------- | --------------------------------------------------- | -------- | ------ | ------ | -------------- |
| _action    | 固定为"open"                            | 是       |        | String | 1.0=2024.11.15 |
| _url | 网页的URL | 是 | | String | 1.0=2024.11.15 |
| _target | 打开的方式 | 否 | _blank（打开新窗口） | String | 1.0=2024.11.15 |

模块参数补充说明：

### > _action

- 打开新网页，实际上是调用浏览器的`window.open(_url, _target)`

# ※ close-关闭当前网页窗口

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"close"
    }
}
```

| key     | 说明          | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------- | ------------- | -------- | ------ | ------ | -------------- |
| _action | 固定为"close" | 是       |        | String | 1.0=2024.11.15 |

# ※ jump-跳转页面

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"jump",
      	"_url":""
    }
}
```

| key        | 说明                  | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ---------- | --------------------- | -------- | ------ | ------ | -------------- |
| _action    | 固定为"jump"          | 是       |        | String | 1.0=2024.11.15 |
| _url       | 网页的URL             | 是       |        | String | 1.0=2024.11.15 |
| _isReplace | 是否不更新网页history | 否       | false  | Bool   | 1.0=2024.11.15 |

模块参数补充说明：

### > _isReplace

- 当`_isReplace`为`false`，调用`window.location.href = _url`，会增加网页history
- 当`_isReplace`为`true`，调用`window.location.replace(_url)`，不会增加网页history

# ※ history-跳转历史页面

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperWindow",
    "param":{
				"_action":"history",
      	"_go":-1
    }
}
```

| key     | 说明         | 是否必要 | 默认值     | 类型   | 组入/更新版本  |
| ------- | ------------ | -------- | ---------- | ------ | -------------- |
| _action | 固定为"jump" | 是       |            | String | 1.0=2024.11.15 |
| _go     | 历史序号     | 否       | -1（退后） | Int    | 1.0=2024.11.15 |

模块参数补充说明：

### > _go

- 历史序号，调用`window.history.go(_go)`
- 当`_go`为`-1`，表示后退一页；当`_go`为`1`，表示前进一页；当`_go`为`0`，刷新当前页
- 当`_go`大于0，表示前进n页；当`_go`小于0，表示后退n页
- 若`_go`超过可操作的历史序号，则不发生跳转

# ◎ 配置说明

模块配置在`_OperWindow/Once.Config`中设置，通过Christmas运行应用时，会自动拼接到`Code/Common/Config/Config.js`

| key                                       | 说明                                                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ----------------------------------------- | ---------------------------------------------------- | -------- | ------ | ------ | -------------- |
|      |      |          |        |      |               |


# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperWindow
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Module`，并在插件打开的终端中输入`_OperWindow`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新历史

**1.0=2024.11.15**

- 模块建立
