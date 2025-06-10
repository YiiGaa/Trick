# _OperTrick-Trick框架操作

主要功能包括：
- lang change-变更语言
- lang listen-监听语言变更
- theme change-变更主题
- theme listen-监听主题变更

模块参数的值说明：

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为模块参数的设置值
- 如果想要获取的值在passParam的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

# ※ lang change-变更语言

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperTrick",
    "param":{
				"_action":"lang change",
      	"_language":""
    }
}
```

| key           | 说明                                                | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------------- | --------------------------------------------------- | -------- | ------ | ------ | -------------- |
| _action   | 固定为"lang change"                        | 是       |        | String | 1.0=2024.11.15 |
| _language | 变更的语言 | 是 | | String | 1.0=2024.11.15 |

模块参数补充说明：

### > _language

- 变更的语言
- 变更的语言需为支持的语言，语言范围需要在`/Once.Config`的`Lang.range`设置
- 关于新增语言，请参考`Trick框架`的语言说明

# ※ lang listen-监听语言变更

- 组入版本：1.0=2024.11.15
- 由于语言文件是异步加载的，所以在网页一开始加载时不一定加载完成，若是页面初始逻辑需要获取语言值，请通过此模块监听加载完成时机
- 若监听语言变更前，已经加载完当前语言文件，会自动触发一次`_call`回调

```json
{
    "name":"_OperTrick",
    "param":{
	"_action":"lang listen",
      	"_call":null
    }
}
```

| key     | 说明                | 是否必要 | 默认值 | 类型     | 组入/更新版本  |
| ------- | ------------------- | -------- | ------ | -------- | -------------- |
| _action | 固定为"lang listen" | 是       |        | String   | 1.0=2024.11.15 |
| _call   | 回调设置            | 是       |        | 开放类型 | 1.0=2024.11.15 |

模块参数补充说明：

### > _call

- 回调设置，支持String、函数、对象类型
- Trick2.2新增，当对应值设置为字符串，且以`css##`开头，则表示css class开关模式，元素筛选设置与class用`>>`隔开，如`css##.Page-Title>>class_1 class_2`，表示通过`document.querySelector`筛选`.Page-Title`，若元素中同时存在`class_1 class_2`这两个class，则清理，否则补充不存在的class。在测试模式下，由于事件可能会触发2次（React机制），此设置会转换两次，所以表面上可能不生效
- Trick2.2新增，当对应值设置为字符串，且以`css add##`开头，则表示`css class`追加模式，设置格式同`css##`
- Trick2.2新增，当对应值设置为字符串，且以`css remove##`开头，则表示`css class`清理模式，设置格式同`css##`
- Trick2.2新增，当对应值设置为字符串，且以`style##`开头，则表示`style`样式设置模式，元素筛选设置与`style设置`用`>>`隔开，多个样式设置用`;`隔开，如`style##.Page-Title>>color:#fff;width:100% !important;`，表示通过`document.querySelector`筛选`.Page-Title`，并设置样式
- 当对应值设置为字符串，则表示以`id`的方式调用其他组件，或者页面Action的函数，页面Action的函数以`act##`开头，如`act##Language_Change`
- 当对应值为函数，则表示调用此函数，此类型用于组件测试，在制作页面时，无法使用此种类型
- 当对应值为对象`{}`，表示详细设置，一般情况下，事件回调时，返回的数据为空对象`{}`，如果希望详细配置返回的数据，则应该采用对象类型；固定格式为`{"_call":"","_data":{}}`，`_call`对应回调目标的设置，`_data`对应具体回调数据的设置；`_data`固定格式为`{"key 1":"value 1","key 2":"value 2"}`
- 当对应值为数组`[]`，可以内嵌以上类型，组件会执行多个回调（异步调用，无法保证顺序）
- Trick2.2新增，默认情况下，`event`事件会冒泡传递（上层HTML节点也会响应），若希望不冒泡传递，可以采用`_isStop`设置，`{"_isStop":true,"_call":"xxx"}`。若希望设置多个回调，可以设置为`{"_isStop":true,"_call":["xxx", "xxx"]}`。若关闭冒泡传递，`_BoxPage`对SPA网页的`a`捕获也会失效

# ※ theme change-变更主题

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperTrick",
    "param":{
				"_action":"theme change",
      	"_theme":""
    }
}
```

| key     | 说明                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ------- | -------------------- | -------- | ------ | ------ | -------------- |
| _action | 固定为"theme change" | 是       |        | String | 1.0=2024.11.15 |
| _theme  | 变更的主题           | 是       |        | String | 1.0=2024.11.15 |

模块参数补充说明：

### > _theme

- 变更的主题
- 变更的主题需为支持的主题，主题范围需要在`/Once.Config`的`Theme.range`设置
- 关于新增主题，请参考`Trick框架`的主题说明

# ※ theme listen-监听主题变更

- 组入版本：1.0=2024.11.15

```json
{
    "name":"_OperTrick",
    "param":{
				"_action":"theme listen",
      	"_call":null
    }
}
```

| key     | 说明                 | 是否必要 | 默认值 | 类型     | 组入/更新版本  |
| ------- | -------------------- | -------- | ------ | -------- | -------------- |
| _action | 固定为"theme listen" | 是       |        | String   | 1.0=2024.11.15 |
| _call   | 回调设置             | 是       |        | 开放类型 | 1.0=2024.11.15 |

模块参数补充说明：

### > _call

- 回调设置，支持String、函数、对象类型
- Trick2.2新增，当对应值设置为字符串，且以`css##`开头，则表示css class开关模式，元素筛选设置与class用`>>`隔开，如`css##.Page-Title>>class_1 class_2`，表示通过`document.querySelector`筛选`.Page-Title`，若元素中同时存在`class_1 class_2`这两个class，则清理，否则补充不存在的class。在测试模式下，由于事件可能会触发2次（React机制），此设置会转换两次，所以表面上可能不生效
- Trick2.2新增，当对应值设置为字符串，且以`css add##`开头，则表示`css class`追加模式，设置格式同`css##`
- Trick2.2新增，当对应值设置为字符串，且以`css remove##`开头，则表示`css class`清理模式，设置格式同`css##`
- Trick2.2新增，当对应值设置为字符串，且以`style##`开头，则表示`style`样式设置模式，元素筛选设置与`style设置`用`>>`隔开，多个样式设置用`;`隔开，如`style##.Page-Title>>color:#fff;width:100% !important;`，表示通过`document.querySelector`筛选`.Page-Title`，并设置样式
- 当对应值设置为字符串，则表示以`id`的方式调用其他组件，或者页面Action的函数，页面Action的函数以`act##`开头，如`act##Language_Change`
- 当对应值为函数，则表示调用此函数，此类型用于组件测试，在制作页面时，无法使用此种类型
- 当对应值为对象`{}`，表示详细设置，一般情况下，事件回调时，返回的数据为空对象`{}`，如果希望详细配置返回的数据，则应该采用对象类型；固定格式为`{"_call":"","_data":{}}`，`_call`对应回调目标的设置，`_data`对应具体回调数据的设置；`_data`固定格式为`{"key 1":"value 1","key 2":"value 2"}`
- 当对应值为数组`[]`，可以内嵌以上类型，组件会执行多个回调（异步调用，无法保证顺序）
- Trick2.2新增，默认情况下，`event`事件会冒泡传递（上层HTML节点也会响应），若希望不冒泡传递，可以采用`_isStop`设置，`{"_isStop":true,"_call":"xxx"}`。若希望设置多个回调，可以设置为`{"_isStop":true,"_call":["xxx", "xxx"]}`。若关闭冒泡传递，`_BoxPage`对SPA网页的`a`捕获也会失效

# ◎ 配置说明

模块配置在`_OperTrick/Once.Config`中设置，通过Christmas运行应用时，会自动拼接到`Code/Common/Config/Config.js`

| key                                       | 说明                                                 | 是否必要 | 默认值 | 类型   | 组入/更新版本  |
| ----------------------------------------- | ---------------------------------------------------- | -------- | ------ | ------ | -------------- |
|      |      |          |        |      |               |


# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _OperTrick
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Module`，并在插件打开的终端中输入`_OperTrick`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新历史

**1.0=2024.11.15**

- 模块建立
