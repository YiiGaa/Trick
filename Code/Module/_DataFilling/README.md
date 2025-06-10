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
- 模块处理字段的顺序不固定，如以下例子中，`key-1`的处理不一定在`key-2`之前

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
| _isNullDelete | Value设置为null时，是否表示删除。false，不删除，直接赋值 | 否 | true | Bool | 1.1=2025.05.22 |
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
    				"":"get##self"
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

- 1.1=2025.05.22修改，Key可以采用`模板的Value`的语法动态定义key，用`[]`包裹即可，如`key_[get##id]`，则模块会自动替换`[get##id]`部分的数据，`[]`内部的语法说明参考特别说明的`模板的value说明`

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

- Key对应的value为数组`[]`，会覆盖目标数组

- Key对应的value为数组`[]`，可添加`push##`前缀，则为插入数据。当Key存在多个前缀时，正确前缀顺序为`opt##push##key`

    ```
    #设置为
    {
    	"push##xxx":[
    		"key",
    		{"key":"value"}
    	]
    }
    
    #目标数据
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

- Key对应的value为数组`[]`，且添加`push##0##`前缀，则为遍历所有元素，并处理对应元素。若key不存在，将不作处理；若key存在，但不是数组，将插入空数组`[]`。组入版本：1.1=2025.05.22

    ```
    #设置为
    {
    	"push##0##xxx":[
    		{"add":"uuid"}
    	]
    }
    
    #目标数据
    {
    		"xxx":[
    			{"key 1":"value"},
    			{"key 2":"value"}
    		]
    }
    
    #数据结果
    {
    	"xxx":[
    		{"key 1":"value", "add":"37572cf8e1f44d34b97dee25c434bdf8"},
    		{"key 2":"value", "add":"ad86ab69d89d44a3af85e10becaafc90"}
    	]
    }
    ```

- Key对应的value为数组`[]`，且添加`push##数字##`前缀，则插入`数字`对应个数的元素，组入版本：1.1=2025.05.22

    ```
    #设置为
    {
    	"push##3##xxx":[
    		{"add":"uuid"}
    	]
    }
    
    #目标数据
    {
    		"xxx":[
    			{"key 1":"value"},
    			{"key 2":"value"}
    		]
    }
    
    #数据结果
    {
    	"xxx":[
    		{"key 1":"value"},
    		{"key 2":"value"},
    		{"add":"f4fdba36253442c68cdd0c31ec273a5e"},
    		{"add":"2cf3946c1a6644268549ddd16c461f18"},
    		{"add":"73eec4a5703a4f5fa8d1760fad62ff1d"}
    	]
    }
    ```

- Key对应的value为数组`[]`，且添加`push##数字1##数字2##`前缀，则从`数字2`位置开始，插入`数字1`对应个数的元素，若`数字2`超出了原本数组的长度，会自动补充`null`字符串占位，组入版本：1.1=2025.05.22

    ```
    #设置为
    {
    	"push##3##1##xxx":[
    		{"add":"uuid"}
    	]
    }
    
    #目标数据
    {
    		"xxx":[
    			{"key 1":"value"},
    			{"key 2":"value"}
    		]
    }
    
    #数据结果
    {
    	"xxx":[
    		{"key 1":"value"},
    		{"key 2":"value", "add":"f4fdba36253442c68cdd0c31ec273a5e"},
    		{"add":"2cf3946c1a6644268549ddd16c461f18"},
    		{"add":"73eec4a5703a4f5fa8d1760fad62ff1d"}
    	]
    }
    ```

### > 模板的Value说明

- Value为修改的值，Value可以是int、double、bool、string、{}、[]等明确的值

- Value设置为null，表示删除此Key

- Value设置为null，且`_isNullDelete`设置为`true`，则不会删除此Key，将直接赋值`null`，组入版本：1.1=2025.05.22

- Value设置为`{}`、`[]`时，内部可设置内层key、value以设置深层数据修改

- Value设置为string（字符串）时，可以设置处理数据表达式，以实现复杂的数据设置

- 1.1=2025.05.22新增，Value设置为string（字符串）时, 可以嵌套设置处理数据表达式(不允许多层嵌套)，用`[]`包裹，如`get##key_[get##id]`，则模块会先替换`[get##id]`部分的数据，`[]`内部的语法说明参考特别说明的`模板的value说明`

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
    | get       | 从passParam中获取值                 | 设置为`self`，表示获取当前key对应的值<br>设置为`lang`，表示获取当前语言的值<br>设置为`theme`，表示获取当前主题的值<br/>其他值表示`passParam`中的`key`，可以采用`>>`定位多层寻找<br>若值不存在时，采用"null"字符串 | 1.0=2024.11.15<br>1.1=2025.05.22 |
    | time      | 时间，默认格式为yyyy-MM-dd hh:mm:ss | 时间格式（不填为默认格式）                                   | 1.0=2024.11.15 |
    | url       | 获取当前url                         | 省略参数，获取整个url（除去协议，域名，端口）<br>设置为`protocol`，获取协议<br>设置为`hostname`，获取域名<br/>设置为`port`，获取端口<br/>设置为`path`，获取路径<br/>设置为`query`，获取参数，`?`部分<br/>设置为`hash`，获取hash片段，`#`部分 | 1.1=2025.05.22 |
    | url param | 获取某个URL参数，`?`部分的参数      | 参数的key，若不存在，则采用"null"字符串，若存在多个相同的key，则返回字符串数组，如`?key=a&key=b`对应`["a","b"]` | 1.1=2025.05.22 |
    | value | 原字符串输出，为了避免功能key与想要插入的字符串冲突，如`value##uuid`, 会插入`uuid`字符串      | 想要插入的字符串 | 1.1=2025.05.22 |
    | trans | 翻译字符串 | 翻译的key | 1.1=2025.05.22 |

- `get##lang`获取当前语言的值，由于语言文件是异步加载的，所以在网页一开始加载时不一定加载完成，若是页面初始逻辑需要获取语言值，请通过`_OperTrick`模块监听`lang listen`

- `get`功能的多层定位，例如`get##key 1>>key 2`，可以深层定位`key 1`下的`key 2`，若是数组，可以采用`数字`进行定位，例如`get##key 1>>1>>key 2`

- `get`可以获取数组的长度，需要以`get##len##`开头，例如`get##len##key 1>>key 2`，表示获取获取`key 1`下的`key 2`的数组长度，若对应值非数组，将返回`0`，组入版本：1.1=2025.05.22

- `get`功能的多层定位，数组定位可以采用负数，表示以上层数组的`index`作为作为对应值，若无对应上层数组，则不会替换，组入版本：1.1=2025.05.22

    ```
    #passParam的值
    {
    		"target":[
    				false,
    				[
    						{"key":"value"}
    				]
    		]
    }
    
    #设置为，"get##target>>-1>>-2>>key"中，-1表示上一层的数组（key-1-1）中的序列，对应值为1；-2表示上两层的数组（key-1）中的序列，对应值为0
    {
    	"key-1":[
    		{
    			"key-1-1":[
    					false,
    					{"key-1-1-2":"get##target>>-1>>-2>>key"}
    			]
    		}
    	]
    }
    
    #最终的passParam值
    {
    		"key-1":[
          {
            "key-1-1":[
                false,
                {"key-1-1-2":"value"}
            ]
          }
        ],
        "target":[
    				false,
    				[
    						{"key":"value"}
    				]
    		]
    }
    ```
    
    

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

**1.1=2025.05.22**

- [-]要求Trick2.2或以上
- [udpate]新增`url`、`url param`、`value`、`trans`功能
- [udpate]新增`_isNullDelete`字段
- [update]扩展`get`功能，增加`get##len##`以获取数组长度，增加定位设置中使用负数获取上层数组中的序列，增加`get##theme`以获取当面主题
- [update]扩展`push##`功能
- [update]将嵌套标识`@@`改为`[]`
- [update]处理数据表达式增加嵌套语法`[]`

**1.0=2024.11.15**

- 模块建立
