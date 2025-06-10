# _DataFilling-Modify the data of passParam

The main functions include:

- Modify the data of passParam
- Generate uuid, get time, random number, get local storage, get session storage

Description of the value of module parameters:

- If the value you want to set is a fixed value, you can directly set the value of the corresponding type.

- If you want to dynamically obtain the value from `passParam` as the set value, please use `get##key` as the setting value of the module parameter.

- If the value you want to get is in the inner layer of passParam (nested json), please locate it with `>>`, such as `get##key_1>>key_2`

# ※ Modify the data of passParam

- Add version: 1.0=2024.11.15
- The order of module processing fields is not fixed. For example, in the following example, the processing of `key-1` is not necessarily before `key-2`

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

| key           | Description                                                  | Necessary | Default | Type   | Add/Update     |
| ------------- | ------------------------------------------------------------ | --------- | ------- | ------ | -------------- |
| _isSwitchNullError | When the `switch##` conversion value is not successful, whether to report an error, false: no error, keep the original value, true: error exit | No     | true | Bool | 1.0=2024.11.15 |
| _isStorageNullError | When obtaining the session storage、local storage, if the corresponding value is missing, whether the error is reported, false: no error, use "null" as the corresponding value, true: error exit | No | true | Bool | 1.0=2024.11.15 |
| _isNullDelete | When Value is set to null, does it mean deletion? False, do not delete, assign directly | No | true | Bool | 1.1=2025.05.22 |
| _setting | Template for modifying data | Yes | | Object | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _setting

- Template for modifying data, type Json Object

- The module does not directly overwrite the target data pool, but traverses the Json Object and inserts the data into the target data pool one by one (passParam)

- If you want to clean/limit the data of the data pool (passParam), please use the `_DataCheck` module

- Templates can set up multi-layer nested relationships, but in order to make it easier to understand, please try to limit it to a single layer

- The following is a detailed description of the Key/Value of the template

### > Key description of the template

- The Key corresponds to the key of the `passParam`

- The Key can add `nec##` or `opt##` as the prefix to indicate whether to force the modification of parameters, `nec#` is the forced modification (default), and `opt##` is non-compulsory (not modified when it exists)

- Key can add `push##` as the prefix, and when the Value and target data of the template are array type `[]`, it indicates the array addition mode, and new data will be pushed to the target array

- Key can add `switch##` as the prefix, and when the Value of the template is the object type `{}`, it indicates the value conversion mode. When the conversion fails, if `_isSwitchNullError` is set to `false`, the original value is retained. If `_isSwitchNullError` is set to `true`, the error will be reported to exit

    ```
    #The value of passParam
    {
    		"key 1":true,
    		"key 2":"good",
    		"key 3":"video"
    }
    
    #Adopt the conversion mode to convert, add the prefix `reg##` to indicate the regular expression, and `""` indicates the default value
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
    
    #The final passParam value
    {
    		"key 1":"It is right",
    		"key 2":"good job",
    		"key 3":"video type"
    }
    ```

- The prefix `switch##` and `push##` cannot exist at the same time

- If there are multiple prefixes, please pay attention to their order. `nec##` needs to be before `switch##`, for example: `nec##switch##key`

- The key can be dynamically defined by using the syntax of `Value of the template`, and can be wrapped with `[]`. For example, `key_[get##id]`, the module will automatically replace the data of `[get##id]` part. The internal syntax description of `[]` refers to the special description of `Value description of the template`

- Key can use `>>` to locate the nested relationship, such as `xxx>>yyy>>1>>zz`, indicating that it is located to the `zz` field

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

- When using `>>` positioning, the default `number` represents the index of the array, and the string is the key of the object. If the multi-layer location is not found, the object will be automatically created.

- 1.1=2025.05.22 modified，The value corresponding to key is the array `[]`, and the target data is an empty array `[]` (or the field does not exist), then it will be inserted data.

    ```
    #setting
    {
    	"xxx":[
    		"key",
    		{"key":"value"}
    	]
    }
    
    #The target data is an empty array, or the field xxx does not exist
    {
    		"xxx":[]
    }
    
    #Data results
    {
    	"xxx":[
    		"key",
    		{"key":"value"}
    	]
    }
    ```

- When the value corresponding to Key is the array `[]`, the target array will be overwritten

- When the value corresponding to the key is the array `[]`, the prefix `push##` can be added, which is the inserted data. When the key has multiple prefixes, the correct prefix order is `opt##push##key`

    ```
    #Setting
    {
    	"push##xxx":[
    		"key",
    		{"key":"value"}
    	]
    }
    
    #Target data
    {
    		"xxx":[
    			"yyy"
    		]
    }
    
    #Data results
    {
    	"xxx":[
    		"yyy",
    		"key",
    		{"key":"value"}
    	]
    }
    ```

- The value corresponding to Key is the array `[]`, and the prefix `push##0##` is added, which traverses all elements and processes the corresponding elements. If the key does not exist, it will not be processed; if the key exists but it is not an array, an empty array `[]` will be inserted. Add version: 1.1=2025.05.22

- ```
    #Setting
    {
    	"push##0##xxx":[
    		{"add":"uuid"}
    	]
    }
    
    #Target data
    {
    		"xxx":[
    			{"key 1":"value"},
    			{"key 2":"value"}
    		]
    }
    
    #Data results
    {
    	"xxx":[
    		{"key 1":"value", "add":"37572cf8e1f44d34b97dee25c434bdf8"},
    		{"key 2":"value", "add":"ad86ab69d89d44a3af85e10becaafc90"}
    	]
    }
    ```

- The value corresponding to Key is the array `[]`, and the prefix `push##number##` is added, and the element corresponding to the number of `number` is pushed. Add version: 1.1=2025.05.22

- ```
    #Setting
    {
    	"push##3##xxx":[
    		{"add":"uuid"}
    	]
    }
    
    #Target data
    {
    		"xxx":[
    			{"key 1":"value"},
    			{"key 2":"value"}
    		]
    }
    
    #Data results
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

- The value corresponding to the Key is the array `[]`, and the prefix `push##number 1###number 2#` is added. Starting from the position of `number 2`, insert the element corresponding to the number of `number 1`. If `number 2` exceeds the length of the original array, it will automatically push the `null` string. Add version: 1.1=2025.05.22

- ```
    #Setting
    {
    	"push##3##1##xxx":[
    		{"add":"uuid"}
    	]
    }
    
    #Target data
    {
    		"xxx":[
    			{"key 1":"value"},
    			{"key 2":"value"}
    		]
    }
    
    #Data results
    {
    	"xxx":[
    		{"key 1":"value"},
    		{"key 2":"value", "add":"f4fdba36253442c68cdd0c31ec273a5e"},
    		{"add":"2cf3946c1a6644268549ddd16c461f18"},
    		{"add":"73eec4a5703a4f5fa8d1760fad62ff1d"}
    	]
    }
    ```

### > Value description of the template

- Value is the modified value, and Value can be int, double, bool, string, {}, [] and other explicit values

- Value is set to `null`, which means that this Key will be deleted

- If Value is set to `null` and `_isNullDelete` is set to `true`, this Key will not be deleted, and the value will be directly assigned to `null`, add version: 1.1=2025.05.22

- When the Value is set to `{}`、`[]`, the inner key and value can be set internally to set the deep data modification

- When the Value is set to String, the processing data expression can be set to achieve complex data settings

- 1.1=2025.05.22 added, when Value is set to string (string), you can nest the processing data expression (multi-layer nesting is not allowed) and wrap it with `[]`, such as `get##key_[get##id]`, then the module will first replace part of the data of `[get#id]`, and the internal syntax description of `[]` refers to the specially explained `value description of the template`

- Examples of expressions for processing data: get##key>>key_1+uuid

- The data processing fragment is divided by `+`, and each data processing fragment is processed separately. After processing, multiple fragments are stitched into String

    > When you need to output `+`, use the `++` , when you need to output `++`, use the `+++` , and so on. Add version: 1.0=2024.11.15

- Each data processing fragment is divided by `##`. The previous keyword is the function, and the following keyword is the parameter setting of the corresponding function. Some functions do not require parameter setting, and `##` can be ignored

- If the following functions cannot be matched, it will be directly used as a spliced string

    | Function  | Description                                     | Setting                                                      | Add/Update     |
    | --------- | ----------------------------------------------- | ------------------------------------------------------------ | -------------- |
    | uuid      | 32-bit uuid                                     | -                                                            | 1.0=2024.11.15 |
    | random id | Random number (default 8 bits)                  | Random number length (default 8 bits)                        | 1.0=2024.11.15 |
    | session   | Get the value from the session storage          | The key of the session storage. If it does not exist and `_isStorageNullError` is set to false, the "null" string is used | 1.0=2024.11.15 |
    | storage   | Get the value from the local storage            | The key of the local storage. If it does not exist and `_isStorageNullError` is set to false, the "null" string is used | 1.0=2024.11.15 |
    | get       | Get the value from passParam                    | Set to `self`, which means to get the value corresponding to the current key<br/>Set to `lang`, which means to get the value of the current language<br/>Set to `theme`, which means to get the value of the current theme<br/>Other values represent the `key` in `passParam`, and you can use `>> `location multi-layer search <br/> If the value does not exist, use the "null" string | 1.0=2024.11.15<br/>1.1=2025.05.22 |
    | time      | Time, the default format is yyyy-MM-dd hh:mm:ss | Time format                                                  | 1.0=2024.11.15 |
    | url       | Get the current url                             | Omit the parameter, get the whole url (excluding protocol, domain name, port) <br/> set to `protocol`, get the protocol <br/> set to `hostname`, get the domain name <br/> set to `port`, get port <br/> set to `path `, get the path <br/> set to `query`, get the parameters, `? `Part <br/> set to `hash`, get the hash fragment, `#` part | 1.1=2025.05.22 |
    | url param | Get a URL parameter, `? `Part of the parameters | If the key of the parameter does not exist, the "null" string is used. If there are multiple identical keys, the string array is returned, such as `? Key=a&key=b`correspondence`["a","b"]` | 1.1=2025.05.22 |
    | value | Original string output, in order to avoid the conflict between the function key and the string you want to insert, such as `value##uuid`, the `uuid` string will be inserted | The string you want to insert | 1.1=2025.05.22 |
    | trans | Translate strings | 翻译的key | 1.1=2025.05.22 |

- `get##lang` obtains the value of the current language. Because the language file is loaded asynchronously, it may not be loaded when the web page is loaded at the beginning. If the initial logic of the page needs to obtain the language value, please listen to `lang listen` through the `_OperTrick` module

- Multi-layer positioning of `get` function, such as `get##key 1>>key 2`, can deeply locate `key 2` under `key 1`. If it is an array, you can use `number` to locate, such as `get##key 1>>1>>key 2`

- `get` can get the length of the array, which needs to start with `get##len##`, for example, `get##len##key 1>>key 2`, indicating that the length of the array of `key 2` under `key 1` is obtained. If the corresponding value is not an array, it will be returned `0`, add version: 1.1=2025.05.22

- Multi-layer positioning of `get` function, array positioning can use negative numbers, indicating that the `index` of the upper layer array is taken as the corresponding value. If there is no corresponding upper array, it will not be replaced. Add version: 1.1=2025.05.22

- ```
    #The value of passParam
    {
    		"target":[
    				false,
    				[
    						{"key":"value"}
    				]
    		]
    }
    
    #Set as, in "get##target>>-1>>-2>>key", -1 represents the sequence in the array of the previous level (key-1-1), corresponding value is 1; -2 represents the sequence in the array of two levels above (key-1), corresponding value is 0
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
    
    #The final passParam value
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

# ◎ Configuration Notes

The module configuration is set in `_DataFilling/Once.Config`. When the application is run through Christmas, it will be automatically spliced to `Code/Common/Config/Config.js`

| key                                       | Description                                                  | Necessary | Default     | Type   | Add/Update     |
| ----------------------------------------- | ------------------------------------------------------------ | --------- | ----------- | ------ | -------------- |
|      |             |           |         |      |            |

# ◎ Module test separately

In the project root directory, run the shell instruction

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _DataFilling
```

You can also run `ShellExcute>>Build#Module` through the `Christmas` plug-in, and enter `_DataFilling` in the terminal opened by the plug-in

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Update list

**1.1=2025.05.22**

- [-] Requires Trick2.2 or above
- [udpate] Add `url`, `url param`, `value` , `trans` functions
- [udpate] Add `_isNullDelete` field
- [update] Expand the `get` function, add `get##len##` to get the length of the array, and increase the positioning settings to use negative numbers to obtain the sequence in the upper array, add `get##theme` to get current theme
- [update] Extend the function of `push##`
- [update] Change the nested sign `@@` to `[]`
- [update] Add nested syntax to process data expressions`[]`

**1.0=2024.11.15**

- Module create
