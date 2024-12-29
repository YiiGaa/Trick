# _OperStorage-存储操作

主要功能包括：
- save-保存数据
- get-获取数据
- clean-清理数据

模块参数的值说明：

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为模块参数的设置值
- 如果想要获取的值在passParam的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

# ※ save-保存数据

- 组入版本：1.0=2024.11.15

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

| key           | 说明                                                | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------------- | --------------------------------------------------- | -------- | ------ | ------ | -------------- |
| _action    | 固定为"save"                                   | 是       |        | String | 1.0=2024.11.15 |
| _key | 存储的key | 是 | | String | 1.0=2024.11.15 |
| _value | 存储的value | 是 | | 开放类型 | 1.0=2024.11.15 |
| _expire | 过期时间，单位：秒 | 否 | 0（不过期） | Int | 1.0=2024.11.15 |
| _isSession | true：保存到sessionStorage，false：保存到localStorage | 否 | false | Bool | 1.0=2024.11.15 |

# ※ get-获取数据

- 组入版本：1.0=2024.11.15

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

| key          | 说明                                                         | 是否必要 | 默认值                | 类型   | 组入/更新版本  |
| ------------ | ------------------------------------------------------------ | -------- | --------------------- | ------ | -------------- |
| _action      | 固定为"get"                                                  | 是       |                       | String | 1.0=2024.11.15 |
| _key         | 存储的key                                                    | 是       |                       |        | 1.0=2024.11.15 |
| _resultKey   | 将数据插入到`passParam`的key                                 | 否       | 清空并替换`passParam` | String | 1.0=2024.11.15 |
| _isNullError | 获取失败时，是否报错，true：报错退出，false：不报错，不写入结果 | 否       | true                  | Bool   | 1.0=2024.11.15 |
| _isSession   | true：从sessionStorage获取，false：从localStorage获取        | 否       | false                 | Bool   | 1.0=2024.11.15 |

模块参数补充说明：

### > _action

- 获取localStorage、sessionStorage存储的值，更推荐通过`_DataFilling`模块获取

### > _resultKey

- 将数据插入到`passParam`的key
- 当`_resultKey`为空字符串`""`，且获取的值为对象类型`{}`，则清空并替换`passParam`
- 当`_resultKey`为空字符串`""`，且获取的值不是对象类型`{}`，则自动将`_resultKey`设置为`result`

# ※ clean-清理数据

- 组入版本：1.0=2024.11.15

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

| key        | 说明                                                  | 是否必要 | 默认值       | 类型   | 组入/更新版本  |
| ---------- | ----------------------------------------------------- | -------- | ------------ | ------ | -------------- |
| _action    | 固定为"clean"                                         | 是       |              | String | 1.0=2024.11.15 |
| _key       | 清理的key                                             | 否       | 清理所有数据 | String | 1.0=2024.11.15 |
| _isSession | true：从sessionStorage清理，false：从localStorage清理 | 否       | false        | Bool   | 1.0=2024.11.15 |

模块参数补充说明：

### > _key

- 默认情况下，或者设置为空字符串`""`，会清理所有数据
- 不推荐清理所有数据，特别是`localStorage`，Trick框架的主题、语言存储数据都在`localStorage`

# ◎ 配置说明

模块配置在`_OperStorage/Once.Config`中设置，通过Christmas运行应用时，会自动拼接到`Code/Common/Config/Config.js`

| key                                       | 说明                                                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ----------------------------------------- | ---------------------------------------------------- | -------- | ------ | ------ | -------------- |
|      |      |          |        |      |               |


# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperStorage
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Module`，并在插件打开的终端中输入`_OperStorage`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新历史

**1.0=2024.11.15**

- 模块建立
