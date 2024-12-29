# _DataFilling-修改passParam的数据

主要功能包括：
- 修改passParam的数据
- 生成uuid、获取时间、随机数、获取local storage、获取session storage

模块参数的值说明：

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为模块参数的设置值
- 如果想要获取的值在passParam的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

# ※ 修改passParam的数据

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_DataFilling",
    "param":{
        "_setting":{
            "key-1":"uuid",
						"opt##key-2":"time",
          	"key-1>>key-1-1":"get##key",
          	"switch##key-2":{
              	"reg##xxx":"new value",
              	"xxx":"value"
              	"":"else value"
            }
        }
    }
}
```

| key           | 说明                                                | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------------- | --------------------------------------------------- | -------- | ------ | ------ | -------------- |
| _isSwitchNullError | 当采用`switch##`转换值不成功时，是否报错，false：不报错，保留原始值，true：报错退出 | 否      | true | Bool | 1.0=2024.11.15 |
| _isStorageNullError | 获取session storage、local storage时，如果缺少对应的值，是否报错，false:不报错，用"null"作为对应值，true:报错退出 | 否 | true | Bool | 1.0=2024.11.15 |
| _setting | 修改数据的模板 | 是 | | Object | 1.0=2024.11.15 |

模块参数补充说明：

### > _setting

- 修改数据的模板，类型为Json Object
- 模块不会直接覆盖目标数据池，而是遍历Json Object，将数据逐个插入到目标数据池（passParam）
- 如果希望清理/限制数据池（passParam）的数据，请使用`_DataCheck`模块
- 模板是可以设置多层嵌套关系的，但为了更容易理解，请尽量限制在单层
- 下面是模板的Key/Value的详细说明

### > 模板的Key说明

- Key对应`passParam`的Key

- Key可以加上`nec##`或`opt##`作为前缀，以标注是否强制修改参数，`nec##`为强制修改（默认），`opt##`为非强制（当存在时不修改）

- Key可以加上`push##`作为前缀，且模板的Value、目标数据都为数组类型`[]`时，表示数组追加模式，会将新数据追加到目标数组

- Key可以加上`switch##`作为前缀，且模板的Value为对象类型`{}`时，表示值转换模式。转换不成功时，若`_isSwitchNullError`设置为`false`，保留原始值，若`_isSwitchNullError`设置为`true`，报错退出

    ```
    #passParam的值
    {
    		"key 1":true,
    		"key 2":"good",
    		"key 3":"video"
    }
    
    #采用转换模式转换, 添加`reg##`前缀表示采用正则表达式，`""`表示默认值
    {
    		"switch##key 1":{
    				"true":"It is right",
    				"false":"It is wrong"
    		},
    		"switch##key 2":{
    				"reg##go+d":"good job"
    		},
    		"switch##key 3":{
    				"audio":"audio type",
    				"":"video type"
    		}
    }
    
    #最终的passParam值
    {
    		"key 1":"It is right",
    		"key 2":"good job",
    		"key 3":"video type"
    }
    ```

- `switch##`和`push##`前缀不能同时存在

- 若存在多个前缀，请注意其顺序，`nec##`需要在`switch##`前，例如：`nec##switch##key`

- Key可以采用`模板的Value`的语法动态定义key，用`@@`包裹即可，如`key_@get##id@`，则模块会自动替换`@get##id@`部分的数据，`@@`内部的语法说明参考特别说明的`模板的value说明`

- Key可以用`>>`定位嵌套关系，如`xxx>>yyy>>1>>zz`，表示定位到`zz`字段

    ```
    {
    	"xxx":{
    		"yyy":[
    			{},
    			{"zz":""}
    		]
    	}
    }
    ```

- 采用`>>`定位时，默认`数字`表示数组的index，字符串为对象的Key。如果多层定位没找到，会自动创建对象

- Key对应的value为数组`[]`，且目标数据为空数组`[]`（或字段不存在）时，则直接插入数据

    ```
    #设置为
    {
    	"xxx":[
    		"key",
    		{"key":"value"}
    	]
    }
    
    #目标数据,为空数组，或字段xxx不存在
    {
    		"xxx":[]
    }
    
    #数据结果
    {
    	"xxx":[
    		"key",
    		{"key":"value"}
    	]
    }
    ```

- Key对应的value为数组`[]`，且目标数据为非空数组`[]`时，会覆盖目标数组

- Key对应的value为数组`[]`，且目标数据为非空数组`[]`时，可添加`push##`前缀，则为插入数据。当Key存在多个前缀时，正确前缀顺序为`opt##push##key`

    ```
    #设置为
    {
    	"push##xxx":[
    		"key",
    		{"key":"value"}
    	]
    }
    
    #目标数据,为非空数组
    {
    		"xxx":[
    			"yyy"
    		]
    }
    
    #数据结果
    {
    	"xxx":[
    		"yyy",
    		"key",
    		{"key":"value"}
    	]
    }
    ```

### > 模板的Value说明

- Value为修改的值，Value可以是int、double、bool、string、{}、[]等明确的值

- Value设置为null，表示删除此Key

- Value设置为`{}`、`[]`时，内部可设置内层key、value以设置深层数据修改

- Value设置为string（字符串）时，可以设置处理数据表达式，以实现复杂的数据设置

- 处理数据的表达式例子：get##key>>key_1+uuid

- 数据处理片段由`+`分割，每个数据处理片段是单独处理的，处理完后将多个片段拼接为String

    > 当需要输出`+`时，采用`++`标识，当需要输出`++`，采用`+++`标识，如此类推，组入版本：1.0=2024.11.15

- 每个数据处理片段由`##`分割，前面的关键字为功能，后面的关键字为对应功能的参数设置，一些功能是不需要参数设置的，可以忽略`##`

- 如果匹配不上以下功能，会直接作为拼接的字符串

    | 功能      | 说明                                | 参数设置                                                     | 组入/更新版本  |
    | --------- | ----------------------------------- | ------------------------------------------------------------ | -------------- |
    | uuid      | 32位uuid                            | -                                                            | 1.0=2024.11.15 |
    | random id | 随机数（默认8位）                   | 随机数位数（不填为8位）                                      | 1.0=2024.11.15 |
    | session   | 从session storage获取值             | session storage的key。如果不存在，且`_isStorageNullError`设置为false时，则采用"null"字符串 | 1.0=2024.11.15 |
    | storage   | 从local storage获取值               | local storage的key。如果不存在，且`_isStorageNullError`设置为false时，则采用"null"字符串 | 1.0=2024.11.15 |
    | get       | 从passParam中获取值                 | passParam中的key，可以采用`>>`定位多层寻找。如果不存在，则采用"null"字符串 | 1.0=2024.11.15 |
    | time      | 时间，默认格式为yyyy-MM-dd hh:mm:ss | 时间格式（不填为默认格式）                                   | 1.0=2024.11.15 |


# ◎ 配置说明

模块配置在`_DataFilling/Once.Config`中设置，通过Christmas运行应用时，会自动拼接到`Code/Common/Config/Config.js`

| key                                       | 说明                                                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ----------------------------------------- | ---------------------------------------------------- | -------- | ------ | ------ | -------------- |
|      |      |          |        |      |               |


# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _DataFilling
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Module`，并在插件打开的终端中输入`_DataFilling`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新历史

**1.0=2024.11.15**

- 模块建立
