# _ServeHttp-Http RESTful API request

The main functions include:

- normal-Single request
- multiple-Send multiple requests at the same time

Description of the value of module parameters:

- If the value you want to set is a fixed value, you can directly set the value of the corresponding type.

- If you want to dynamically obtain the value from `passParam` as the set value, please use `get##key` as the setting value of the module parameter.

- If the value you want to get is in the inner layer of passParam (nested json), please locate it with `>>`, such as `get##key_1>>key_2`

# ※ normal-Single request

- Add version: 1.0=2024.11.15
- It can be regarded as a synchronization request. When this module returns, the request result has been written to `passParam`
- It is actually an asynchronous request, which will not cause the fake death of the web page

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

| key           | Description                                                  | Necessary | Default | Type   | Add/Update     |
| ------------- | ------------------------------------------------------------ | --------- | ------- | ------ | -------------- |
| _action    | Fixed as "normal"                           | Yes       |                                           | String | 1.0=2024.11.15 |
| _header | The requested header settings | No | | Object | 1.0=2024.11.15 |
| _url | The requested URL | Yes | | String | 1.0=2024.11.15 |
| _param | Requested parameters | Yes | | Object | 1.0=2024.11.15 |
| _method | Request method, `POST/DELETE/PUT/GET` | No | GET | String | 1.0=2024.11.15 |
| _resultKey | Insert the data into the key of `passParam` | No | Empty and replace `passParam` | String | 1.0=2024.11.15 |
| _timeout | Request timeout time, unit: milliseconds | No | Adopt the `timeout` setting of the module | Int | 1.0=2024.11.15 |
| _isJson | Does the response content need to be converted to json object, true: convert json, false: keep the text | No | true | Bool | 1.1=2025.06.02 |
| _isCache | Whether to use local cache to cache results, true: cache request, false: request the server every time | No | false | Bool | 1.1=2025.06.02 |
| _cacheExpire | Cache expiration time (unit: seconds) | No | 300 | Int | 1.1=2025.06.02 |

Supplementary description of module parameters:

### > _url

- The requested URL

- If `_url` starts with `/`, it will automatically match the `prefix` settings of the module

- When automatically matching the `prefix` settings of the module, if `_url` begins with a key of `prefix`, it will automatically splice the value corresponding to `prefix` as a prefix

- When automatically matching the `prefix` setting of the module, if all keys cannot be matched correctly, the corresponding value of `""` will be automatically spliced as a prefix

### > _param

- Requested parameters, Object type

- If you want to send files in the form `multipart/form-data`, please record the data in a single-layer object and record the file in the `File` type

- Except for `_method` to `GET`, or `_param` contains a file, they will be sent in  `application/json`

- When `_method` is `GET`, the file is not allowed to be sent, otherwise an error will be reported

- When `_method` is `GET`, `_param` will be automatically spliced to `URL`, and special fields will be automatically transcoded, such as `key1=value&key2=value2`

- When `_method` is `GET`, please record data with a single-layer object and do not embed objects, otherwise the embedded object will be converted to `[object Object]`

- When `_method` is `GET`, when converting the array data of `_param`, such as `{key:["a","b"]}`, which will be converted into `key=a&key=b`

### > _resultKey

- Insert the data into the key of `passParam`

- When `_resultKey` is an empty string `""`, and the value obtained is the object type `{}`, empty and replace `passParam`

- When `_resultKey` is an empty string `""` and the value obtained is not the object type `{}`, `_resultKey` is automatically set to `result`

### > _isCache

- Whether to use local cache cache results, true: cache request, false: request the server every time
- When set to `true`, the API request is successful and will use the browser's local database `indexedDB` to save the data
- When set to `true`, the first request will save the data. The next request, if the parameters `_url`, `_method`, `_header`, `_param`, `_cacheExpire`, `_isJson` are all the same, and the cache data has not expired, the cache data will be used instead of calling the server

# ※ multiple-Send multiple requests at the same time

- Add version: 1.0=2024.11.15
- Multiple requests are returned, and the module will not return until the request results have been written to `passParam`

```json
{
    "name":"_ServeHttp",
    "param":{
	"_action":"multiple",
      	"_list":[]
    }
}
```

| key      | Description                              | Necessary | Default                                   | Type   | Add/Update     |
| -------- | ---------------------------------------- | --------- | ----------------------------------------- | ------ | -------------- |
| _action  | Fixed as "normal"                        | Yes       |                                           | String | 1.0=2024.11.15 |
| _list    | List of requests                         | Yes       |                                           | Array  | 1.0=2024.11.15 |
| _timeout | Request timeout time, unit: milliseconds | No        | Adopt the `timeout` setting of the module | Int    | 1.0=2024.11.15 |

Supplementary description of module parameters:

### > _list

- List of requests
- A single request is set in the form of an object `{}`. For specific parameters, please refer to `normal-Single request` instructions

# ◎ Configuration Notes

The module configuration is set in `_ServeHttp/Once.Config`. When the application is run through Christmas, it will be automatically spliced to `Code/Common/Config/Config.js`

After the configuration is modified, the module or page needs to be restart to take effect

| key                                       | Description                                                  | Necessary | Default     | Type   | Add/Update     |
| ----------------------------------------- | ------------------------------------------------------------ | --------- | ----------- | ------ | -------------- |
| timeout | Request timeout time, unit: milliseconds | No | 3000 | Int | 1.0=2024.11.15 |
| prefix | The prefix of the request URL | No | | Object | 1.0=2024.11.15 |

### > prefix

- If `_url` starts with `/`, it will automatically match the `prefix` settings of the module
- `prefix` setting example is `{"/key":"/api/key", "/key2":"/api/key2"}`

- When automatically matching the `prefix` settings of the module, if `_url` begins with a key of `prefix`, it will automatically splice the value corresponding to `prefix` as a prefix

- When automatically matching the `prefix` setting of the module, if all keys cannot be matched correctly, the corresponding value of `""` will be automatically spliced as a prefix

# ◎ Module test separately

In the project root directory, run the shell instruction

```
python3 Christmas/Christmas.py ShellExcute/Build#Module _ServeHttp
```

You can also run `ShellExcute>>Build#Module` through the `Christmas` plug-in, and enter `_ServeHttp` in the terminal opened by the plug-in

`Sample.html`, `Sample.js` is a code specifically for separate testing

# ◎ Update list

**1.1=2025.06.02**

- [update] Add `_isJson`, `_isCache`, `_cacheExpire` field

**1.0=2024.11.15**

- Module create
