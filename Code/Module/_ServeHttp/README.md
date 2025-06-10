# _ServeHttp-Http RESTful API请求

主要功能包括：
- normal-单个请求
- multiple-同时发送多个请求

模块参数的值说明：

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为模块参数的设置值
- 如果想要获取的值在passParam的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

# ※ normal-单个请求

- 组入版本：1.0=2024.11.15
- 可以看作是同步请求，此模块返回时，请求结果已经写入`passParam`
- 实际上是异步请求，不会造成网页假死

```json
{
    "name":"_ServeHttp",
    "param":{
	"_action":"normal",
      	"_method":"POST",
      	"_url":"",
      	"_param":{},
      	"_resultKey":""
    }
}
```

| key           | 说明                                                | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------------- | --------------------------------------------------- | -------- | ------ | ------ | -------------- |
| _action    | 固定为"normal"                                 | 是       |        | String | 1.0=2024.11.15 |
| _header | 请求的header设置 | 否 | | Object | 1.0=2024.11.15 |
| _url | 请求的URL | 是 | | String | 1.0=2024.11.15 |
| _param | 请求的参数 | 是 | | Object | 1.0=2024.11.15 |
| _method | 请求方式，`POST/DELETE/PUT/GET` | 否 | GET | String | 1.0=2024.11.15 |
| _resultKey | 将数据插入到`passParam`的key | 否 | 清空并替换`passParam` | String | 1.0=2024.11.15 |
| _timeout | 请求超时时长，单位：毫秒 | 否 | 采用模块的`timeout`设置 | Int | 1.0=2024.11.15 |
| _isJson | 返回内容是否需要转换json，true：转换json，false：保留文本 | 否 | true | Bool | 1.1=2025.06.02 |
| _isCache | 是否采用本地缓存缓存结果，true: 缓存请求，false：每次都请求服务器 | 否 | false | Bool | 1.1=2025.06.02 |
| _cacheExpire | 缓存过期时间（单位：秒） | 否 | 300 | Int | 1.1=2025.06.02 |

模块参数补充说明：

### > _url

- 请求的URL
- 若`_url`以`/`开头，会自动匹配模块的`prefix`设置
- 自动匹配模块的`prefix`设置时，若`_url`以`prefix`的某个key开头，会自动拼接上`prefix`对应的value作为前缀
- 自动匹配模块的`prefix`设置时，若所有key都不能正确匹配，会自动拼接`""`对应的value作为前缀

### > _param

- 请求的参数，Object类型
- 若希望以表单`multipart/form-data`形式，发送文件，请以单层对象记录数据，并以`File`类型记录文件
- 除了`_method`为`GET`，或者`_param`中含有文件，都会以`application/json`形式发送
- `_method`为`GET`时，不允许发送文件，否则报错
- `_method`为`GET`时，会自动将`_param`拼接到`URL`上，特殊字段会自动转码，例如`key1=value&key2=value2`
- `_method`为`GET`时，请以单层对象记录数据，不要内嵌对象，不然内嵌对象会转换为`[object Object]`
- `_method`为`GET`时，在转换`_param`的数组数据时，如`{key:["a","b"]}`，会转换为`key=a&key=b`

### > _resultKey

- 将数据插入到`passParam`的key
- 当`_resultKey`为空字符串`""`，且获取的值为对象类型`{}`，则清空并替换`passParam`
- 当`_resultKey`为空字符串`""`，且获取的值不是对象类型`{}`，则自动将`_resultKey`设置为`result`

### > _isCache

- 是否采用本地缓存缓存结果，true: 缓存请求，false：每次都请求服务器
- 设置为`true`时，API请求成功会采用浏览器本地数据库`indexedDB`保存数据
- 设置为`true`时，初次请求会保存数据，下次请求时，若参数`_url`, `_method`, `_header`, `_param`, `_cacheExpire`, `_isJson`都相同时，且缓存数据未过期，会采用缓存数据，而非直接调用接口

# ※ multiple-同时发送多个请求

- 组入版本：1.0=2024.11.15
- 多个请求都返回，并将请求结果已经写入`passParam`后，模块才会返回

```json
{
    "name":"_ServeHttp",
    "param":{
	"_action":"multiple",
      	"_list":[]
    }
}
```

| key      | 说明                     | 是否必要 | 默认值                  | 类型   | 组入/更新版本  |
| -------- | ------------------------ | -------- | ----------------------- | ------ | -------------- |
| _action  | 固定为"multiple"         | 是       |                         | String | 1.0=2024.11.15 |
| _list    | 请求列表                 | 是       |                         | Array  | 1.0=2024.11.15 |
| _timeout | 请求超时时长，单位：毫秒 | 否       | 采用模块的`timeout`设置 | Int    | 1.0=2024.11.15 |

模块参数补充说明：

### > _list

- 请求列表
- 单个请求以对象`{}`形式设置，具体参数参考`normal-单个请求`说明

# ◎ 配置说明

模块配置在`_ServeHttp/Once.Config`中设置，通过Christmas运行应用时，会自动拼接到`Code/Common/Config/Config.js`

配置修改后，需要重新运行模块或页面，才能生效

| key                                       | 说明                                                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ----------------------------------------- | ---------------------------------------------------- | -------- | ------ | ------ | -------------- |
| timeout | 请求超时时长，单位：毫秒 | 否 | 3000 | Int | 1.0=2024.11.15 |
| prefix | 请求URL的前缀 | 否 |  | Object | 1.0=2024.11.15 |

### > prefix

- 若`_url`以`/`开头，会自动匹配模块的`prefix`设置
- `prefix`设置例子为`{"/key":"/api/key", "/key2":"/api/key2"}`
- 自动匹配模块的`prefix`设置时，若`_url`以`prefix`的某个key开头，会自动拼接上`prefix`对应的value作为前缀
- 自动匹配模块的`prefix`设置时，若所有key都不能正确匹配，会自动拼接`""`对应的value作为前缀

# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _ServeHttp
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Module`，并在插件打开的终端中输入`_ServeHttp`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新历史

**1.1=2025.06.02**

- [update]新增`_isJson`、`_isCache`、`_cacheExpire`字段

**1.0=2024.11.15**

- 模块建立
