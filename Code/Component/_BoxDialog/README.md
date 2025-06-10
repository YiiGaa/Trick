# _BoxDialog-模态框

主要功能包括：

- Config设置
- shake dialog-播放提示框不能关闭的动画
- set-修改组件设置
- get-获取组件数据

# ※ Config设置

```
{
	"name": "$._BoxDialog",
    "config": {
        "_id":"",
        "_isOpen":false,
        "_templ":""
    }
}
```

| key          | 说明                                        | 默认值                | 类型     | 组入/更新版本  |
| ------------ | ------------------------------------------- | --------------------- | -------- | -------------- |
| _id          | 组件id，命名尽量唯一，且不包含`.`           | 不需要调用组件        | String   | 1.0=2024.11.15 |
| _data        | 自定义暂存数据，获取组件数据时会被一同返回  | null                  | 开放类型 | 1.0=2024.11.15 |
| _isOpen | 是否打开模态框，true：打开，false：关闭 | true | Bool | 1.0=2024.11.15 |
| _isCloseDismiss | 点击背景，是否可关闭模态框，true：允许，false：不允许 | false | Bool | 1.0=2024.11.15 |
| _templ | 内容模板                           | 以整个`child`作为模板 | 开放类型 | 1.0=2024.11.15 |
| _config | 模板外层设置，请参考`_templ`说明 | null | Object | 1.1=2025.04.11 |
| _configDeep | 模板深层设置，请参考`_templ`说明 | null | Object | 1.1=2025.04.11 |
| _textClose | 关闭按钮提示文字 | 不显示提示文字 | String | 1.0=2024.11.15 |
| _class   | 组件的外层样式                          |                       | String   | 1.0=2024.11.15<br/>1.1=2025.04.11 |
| _classBackdrop | 模态框背景样式 | | String | 1.0=2024.11.15 |
| _classContent | 模态框位置样式 | | String | 1.0=2024.11.15 |
| _classContentPanel | 模态框样式 | | String | 1.0=2024.11.15 |
| _classContentPanelMotion | 提示模态框不能关闭的动画的样式 | _BoxDialog-Content-PanelAlarm | String | 1.0=2024.11.15 |
| _classContentPanelChild | 模态框内容样式 | | String | 1.0=2024.11.15 |

参数补充说明：

### > _id

- 组件id，用于标识组件，用于操作组件（更新/获取数据）
- 推荐格式为`comp##_BoxDialog<<[所在页面布局]`，如`comp##_BoxDialog<<Title`、`comp##_BoxDialog<<Title/Info`
- 如果组件在初始化后并不需要操作，组件id不需要设置，组件id设置为空字符串`""`，视为无效设置
- 组件id尽量唯一，如果不唯一，则同名组件会同时响应
- 组件id尽量不要包含`.`，由于基础库`pubsub-js`的影响，如果命名中含有`.`，则可能引起多个组件被调用的情况，如调用`a`组件时，会同时调用`a.1`和`a.2`等组件

### > _templ

- `_templ`开头的key都会被认为是模板设置
- 当对应值为字符串，且以`$.`开头，(要求Trick2.2版本以后)，会采用对应组件作为模板。此设置仅在页面`xxxUI.json`、`xxxAction.json`配置中生效，其他情况会按照字符串处理
- 当对应值设置为`null`（默认），或者以下设置中出现不能正确获取的情况，都会以整个`child`作为模板。`child`为页面UI设置时的`child`（此组件的内嵌子组件）
- 当对应值为字符串，且以`child##`开头，会选择`child`的第n个子组件作为模板，如`child##2`，则会选择`child`中第3个（0开始）子组件作为模板
- 当对应值为字符串，且以`layout##`开头（Trick2.2及以后版本生效），会以某个页面布局作为模板，如`layout##Theme`，则会选择id为`Theme`的页面布局作为模板
- `child##`和`layout##`都支持深层筛选模式，用`>>`分隔，如`child##_BoxForm>>_CompInput`，层级是按jsx嵌套层级而定的
- 当对应值为字符串，且不包含以上特殊开头，会认为是文字，且会自动进行翻译
- 当对应值为对象`{}`，表示详细设置模式，固定格式为`{"_templ":"","_config":{},"_configDeep":{}}`。`_templ`对应模板选择（以上类型适用）；`_config`会自动合并进模板的最外层`config`；`_configDeep`会自动合并进模板的里层`config`，具体格式为`{"position 1":{},"position 2":{}}`，`key`为定位设置，使用`>>`分割，可以采用`序号`或者`组件名`进行选择，如`0>>div>>_Boxflex`，表示`第0个组件`>>`名称为div的组件`>>`名称为_Boxflex的组件`；当`_templ`为文字，会将`_config`作为翻译设置（变量替换），`_configDeep`无效
- 当对应值为数组`[]`，可以内嵌以上类型，会以此数组顺序编排模板

### > _text

- `_text`开头的key都会被认为是文字设置
- 当对应值为字符串，都会自动进行翻译
- 推荐需要翻译的文字格式为`**[所在页面布局]>>[文字提示]`，如`**Form>>occupation`，`**Form/occupation>>project manager`
- 当对应值为对象`{}`，表示详细设置，固定格式为`{"_text":"xxx", "key 1":"value", "key 2":"value"}`，`_text`对应文字设置，其他设置作为翻译设置（变量替换）

### > _src

- `_src`开头的key都会被认为是资源文件路径设置
- 以`//`开头，会自动定位到工程图片存放位置
- 页面运行时，`//`会自动定位到`Code/Assets`
- 本组件单独运行时，`//`会自动定位到当前组件的`test`文件夹
- `test`文件夹需要手动创建，且仅用于当前组件单独测试运行

### > _class

- `_class`开头的key一般为html的class设置
- 推荐采用`tailwindcss`的类进行设置，如果需要覆盖组件固有样式设置，需要在类名前加`!`，如`!w-full`
- 可以采用页面自定义的`class`进行设置，如果需要覆盖组件固有样式设置，需要设置`!important`
- 文字、边距大小、颜色等，尽量采用主题css文件的变量，自定义`class`中可以采用`var(xxx)`进行设置；`tailwindcss`可以采用`[xxx]`进行设置，如`gap-[--Theme-Gap]`

### > _on

- `_on`开头的key一般为事件回调的设置
- 当对应值设置为字符串，且以`pack##`开头，则自动调用其上层的`Pack组件`，如`_PackForm`等；这类`Pack组件`向所有下层组件传递回调地址、部分数据；`pack##`后面可以设置调用`pack组件`的`_action`，如`pack##commit`，则表示调用上层`Pack组件`的`commit`动作
- Trick2.2新增，当对应值设置为字符串，且以`css##`开头，则表示css class开关模式，元素筛选设置与class用`>>`隔开，如`css##.Page-Title>>class_1 class_2`，表示通过`document.querySelector`筛选`.Page-Title`，若元素中同时存在`class_1 class_2`这两个class，则清理，否则补充不存在的class。在测试模式下，由于事件可能会触发2次（React机制），此设置会转换两次，所以表面上可能不生效
- Trick2.2新增，当对应值设置为字符串，且以`css add##`开头，则表示`css class`追加模式，设置格式同`css##`
- Trick2.2新增，当对应值设置为字符串，且以`css remove##`开头，则表示`css class`清理模式，设置格式同`css##`
- Trick2.2新增，当对应值设置为字符串，且以`style##`开头，则表示`style`样式设置模式，元素筛选设置与`style设置`用`>>`隔开，多个样式设置用`;`隔开，如`style##.Page-Title>>color:#fff;width:100% !important;`，表示通过`document.querySelector`筛选`.Page-Title`，并设置样式
- 当对应值设置为字符串，则表示以`id`的方式调用其他组件，或者页面Action的函数，页面Action的函数以`act##`开头，如`act##Language_Change`
- 当对应值为函数，则表示调用此函数，此类型用于组件测试，在制作页面时，无法使用此种类型
- 当对应值为对象`{}`，表示详细设置，一般情况下，事件回调时，返回的数据为整个组件的数据，如果希望详细配置返回的数据，则应该采用对象类型；固定格式为`{"_call":"","_data":{}}`，`_call`对应回调目标的设置，`_data`对应具体回调数据的设置；`_data`固定格式为`{"key 1":"value 1","key 2":"value 2"}`，最外层的`key`对应的`value`支持动态注入语法；`value`的动态语法为，`get##`开头表示从本组件数据中获取，`pack##`开头表示从`Pack组件`传递的数据中获取，且允许使用`>>`定位深层的数据，如`get##key_1>>key_2`

- 当对应值为数组`[]`，可以内嵌以上类型，组件会执行多个回调（异步调用，无法保证顺序）
- Trick2.2新增，默认情况下，`event`事件会冒泡传递（上层HTML节点也会响应），若希望不冒泡传递，可以采用`_isStop`设置，`{"_isStop":true,"_call":"xxx"}`。若希望设置多个回调，可以设置为`{"_isStop":true,"_call":["xxx", "xxx"]}`。若关闭冒泡传递，`_BoxPage`对SPA网页的`a`捕获也会失效

# ※ shake dialog-播放提示框不能关闭的动画

组入版本：1.0=2024.11.15

调用参数如下，具体调用方式请参考`修改组件设置`

```
{
		"_action":"shake dialog"
}
```

| key     | 说明                 | 默认值 | 类型   | 组入/更新版本  |
| ------- | -------------------- | ------ | ------ | -------------- |
| _action | 固定为"shake dialog" |        | String | 1.0=2024.11.15 |

# ※ set-修改组件设置

组入版本：组件通用机制

修改组件传递的参数与`Config设置`相同，可省略不需要更新的数据

- 如果某项数据为数组`[]`，且希望为追加模式，则在`key`前追加`push##`前缀，例如`push##key`
- 如果某项数据为数组`[]`，且仅希望替换某个位置的数据，则在`key`前追加`push##序号##`前缀，例如`push##1##key`
- 如果某项数据为对象类型`{}`，默认情况下，组件会补充合并省略的字段，如果希望不合并旧的设置，可以在`key`前追加`nec##`前缀
- `nec##`和`push##`前缀不能同时存在
- 以上前缀只适用于`config`对象的最外层的`key`
- 如果新设置的值不符合类型要求，会采用组件默认的值进行替换，而非保留初始化的组件设置

### > 页面Action调用例子

`页面Action`需要通过`_BrokerUI`模块进行组件设置，其中`_config`对应设置的数据

```
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

补充说明：

`_config`设置中，最外层的`key`对应的`value`支持模块参数语法，如`{"key":"get##$value"}`，则表示从`passParam`中获取`$value`

- 如果希望设置的值为固定值，则直接设置对应类型的值即可
- 如果希望从`passParam`中动态获取值作为设置的值，则请以`get##key`作为设置值
- 如果想要获取的值在`passParam`的里层（嵌套json），则请以`>>`定位，如`get##key_1>>key_2`

### > 页面UI调用例子

如果希望其他组件事件触发时，更新此组件的设置，可在对应组件的事件回调中设置以下参数，其中`_data`对应设置的数据

```
"_onXXX"：{
    "_call":"组件id"
    "_data":{
        "key":"value"
    }
}
```

补充说明：

`_data`设置中，最外层的`key`对应的`value`支持动态注入语法，如`{"key":"get##key 1"}`，表示从触发回调的组件数据中获取`key 1`的数据

- 如果希望从触发回调的组件数据中获取值，采用`get##`开头

- 如果希望从触发回调的组件的上层`Pack组件`传递的数据中获取值，采用`pack##`开头

- 在采用`get##`、`pack##`开头时，允许采用`>>`定位深层的数据，如`get##key_1>>key_2`

- 动态注入语法只适合`_data`对象最外层值的设置，深层设置是不会被处理的

    ```
    {
    	"key 1":"get##key 1",						#动态注入值
    	"key 2":{
    		"key 2-1":"get##key 2"                  #保持'get##key 2'的值
    	}
    }
    ```

# ※ get-获取组件数据

组入版本：组件通用机制

`页面Action`需要通过`_BrokerUI`模块获取，返回的数据为以上`config设置`中的所有数据

数据会自动插入`passParam`中，插入字段为`_resultKey`对应的值。当`_resultKey`对应值为空字符串`""`，会将整个`passParam`清空，并写入数据

```
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

# ◎ 模块单独测试

在工程根目录，运行shell指令

```
python3 Christmas/Christmas.py ShellExcute/Build#Component _BoxDialog
```

也可以通过`Christmas插件`运行`ShellExcute>>Build#Component`，并在插件打开的终端中输入`_BoxDialog`

`Sample.html`，`Sample.js`是专门用于单独测试的代码

# ◎ 更新列表

**1.1=2025.04.11**

- [update]增加`_config`、`_configDeep`参数
- [update]`_classBody`字段名改为`_class`
- [update]去除组件css中的tailwincss工具类，避免页面必须使用`important`才能覆盖样式

**1.0=2024.11.15**

- 组件建立