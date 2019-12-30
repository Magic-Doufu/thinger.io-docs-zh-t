# SERVER API

>本文件將介紹如何使用RESTful API與Thinger.io伺服器後端進行互動。

本文件中描述的所有示範都基於相對路徑定義URL，假設主機未被設定為您自行建立的伺服器IP、網域，則預設伺服器如下：

```
https://api.thinger.io
```

**請注意** 如果您在自己的主機或網域中執行Thinger.io伺服器，則在未設定相應的SSL證書的情況下，HTTPS請求可能會失敗。您也可以使用HTTP進行呼叫，但不建議在生產環境中使用。

## 驗證API

### REST API 驗證

若想要存取伺服器上的API，皆需要透過Oauth進行簽名驗證。因此，所有API存取動作都要包含一個存取令牌的 `Authorization` 標頭：

``` text
Bearer {your_token}
```

例如：

```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODYwNDkxNTcsImlhdCI6MTQ4NjA0MTk1NywidXNyIjoianQifQ.pkyG43xiEhDtUHLxuycYv156FGuvNh6nDKQ07kGcaGk
```

::: tip
本服務使用的Token格式為JWT，token內容可使用jwt-decoder解析。
:::

存取令牌有兩個不同的概念：使用使用者憑據、刷新令牌取得動態存取令牌，或是直接由使用者定義。

#### 存取令牌\(Access Token\)

此種令牌用於存取API資源，要存取任何API時都需要將此令牌與`Bearer`關鍵字一起包含在HTTP標頭的 `authorization` 項目中。其中 `authorization` 區分大小寫。

::: tip
存取令牌有效期限(Expiration time)為 2 小時，因此需要透過刷新令牌進行刷新。
:::

#### 刷新令牌(Refresh Token)

此種令牌用於刷新並取得存取令牌，本身不提供存取使用者資源的權限，使用刷新令牌時其本身也會刷新。將刷新令牌儲存於安全區域，即使存取令牌以某種方式洩漏，攻擊者也無法長時間存取裝置。若刷新令牌也遭洩漏，可以手動註銷刷新令牌以阻止被取得新的刷新令牌，中止非預期的存取。

本平台身分驗證的設計模式為：透過帳號密碼進行初次身分驗證，同時取得刷新令牌與存取令牌。
刷新令牌有效期限(Expiration time)為 2 個月。並且您使用它時也會進行刷新。之後皆使用存取令牌存取API，並於刷新令牌過期前，使用刷新令牌更新並同時取得存取令牌與刷新令牌。

::: tip
刷新令牌有效期限(Expiration time)為 2 個月。並且您使用它時也會進行刷新。之後皆使用存取令牌存取API，並於刷新令牌過期前，使用刷新令牌更新並同時取得存取令牌與刷新令牌。
:::

#### 使用者令牌(User Token)

此種令牌可由控制面板中以 `Access Token` 項目建立並規範存取權限，將其限定使用於特定行為，如寫入資料存儲區、存取裝置特定資源的長期存取。
這種令牌使用方式與存取令牌相同，不同的是這種令牌不會過期。

![](~@api/token_permission.png)

### 透過使用者憑證取得驗證令牌

此方式提供使用者使用帳號與密碼取得令牌(包含存取令牌與刷新令牌)。首次進行API存取時會使用該方法。

* **URL**

  ```
  /oauth/token
  ```

* **方法(Method)**

  ```
  POST
  ```

* **內容類型(Content-Type)**

  ```
  Content-Type:application/x-www-form-urlencoded
  ```

* **內文**

  ```
  grant_type=password&username=username&password=password
  ```

* **成功回應：**
  * **HTTP狀態：** 200
  * **回應內容：**

    ```javascript
    {  
       "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODYwNDgzNzcsImlhdCI6MTQ4NjA0MTE3NywidXNyIjoianQifQ.A-Vh715P6GjFDBkbh6TmNGxiHWl0KjbDq8tM4qsmTaI",
       "expires_in":7200,
       "refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTEzMTE1NzcsImlhdCI6MTQ4NjA0MTE3NywianRpIjoiNTg5MzMwNTkzOWNiZWY0YWEzMDE1YWJiIn0.5Voenem4D90zPNqiS1oVBfguDzygwNzgmcmEi-4N-8Q",
       "scope":null,
       "token_type":"bearer"
    }
    ```
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized
  * **回應內容：** 

    ```javascript
     {  
        "error":{  
           "message":"invalid username or password"
        }
     }
    ```

### 使用刷新令牌取得令牌

此方法允許使用有效的刷新令牌取得新的令牌(包含存取令牌與刷新令牌)。每當存取令牌過期或刷新令牌可能過期時都該使用該方法刷新。

* **URL**

  ```
  /oauth/token
  ```

* **方法(Method)**

  ```
  POST
  ```

* **內容類型(Content-Type)**

  ```
  Content-Type:application/x-www-form-urlencoded
  ```

* **內文**

  ```
  grant_type=refresh_token&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTEzMTIzNTcsImlhdCI6MTQ4NjA0MTk1NywianRpIjoiNTg5MzMzNjUzOWNiZWY0YWEzMDE1YWJjIn0.BYwRii9eL7jeQQQqMbuBEZAvwmmVRAU8kWYCNZEDn0s
  ```

* **成功回應：**
  * **HTTP狀態：** 200
  * **回應內容：** 

    ```javascript
    {  
       "access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODYwNTY0MjYsImlhdCI6MTQ4NjA0OTIyNiwidXNyIjoianQifQ.H7G4N3MMHxUO2gPHzG0a9N1lZ5--Gt56CC4HOiFMKLE",
       "expires_in":7200,
       "refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTEzMTk2MjYsImlhdCI6MTQ4NjA0OTIyNiwianRpIjoiNTg5MzMzNjUzOWNiZWY0YWEzMDE1YWJjIn0.dqxbZegv4oemeDK6czDzQLRfA3da6NShBcseNLTn33Q",
       "scope":null,
       "token_type":"bearer"
    }
    ```
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized
  * **回應內容：** 

    ```javascript
     {  
        "error":{  
           "message":"invalid refresh token"
        }
     }
    ```

### 確認令牌有效期限

存取令牌在發布後約2小時後到期。有兩種方法可以確定存取令牌是否已過期以決定是否請求新的存取令牌。

#### 解析JWT資訊

檢查存取令牌是否過期的第一種方法是解析JWT並解碼有效負載(Payload)資訊。存取令牌將具有如下所示的有效負載(Payload)：

```javascript
{
  "exp": 1486048377,
  "iat": 1486041177,
  "usr": "alvarolb"
}
```

`exp`字段是令牌過期時的以秒為單位的unix時間戳（UTC）。如果您的請求時間在此時間戳之後，則請求將失敗。

#### 檢測伺服器回應

只需嘗試存取任何使用者資源，就可以檢查存取令牌的有效性。如果存取令牌過期，則身份驗證將失敗，並且API請求查詢將回傳一個`401 Unautorized`。

## 裝置API

以下方法將介紹如何透過API進行裝置操作，如取得裝置資訊、新增與刪除裝置、使用裝置特定資源等。同時介紹另一個存取模式。

### 列出使用者裝置

此方法允許取得使用者設備清單與詳細狀態資訊。

* **URL**

  ```
  /v1/users/{USER_ID}/devices
  ```

* **方法(Method)**

  ```
  GET
  ```

* **URL 參數**

  **可選：** 通過新增以下URL參數來使用ID指定裝置：

  ```
  id=[device id]
  ```

* **成功回應：**
  * **HTTP狀態：** 200
  * **回應內容：** 裝置陣列，包含裝置ID，描述和連接狀態。

    ```javascript
    [  
      {  
         "device":"nodemcu",
         "description":"NodeMCU With ESP8266",
         "connection":{  
            "active":true,
            "ts":1486047553711
         }
      }
    ]
    ```
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized
  * **HTTP狀態：** 400 Bad request if the search device name is not valid
  * **HTTP狀態：** 404 Not Found

### 新增使用者裝置

此方法允許將裝置新增到目前的使用者帳戶。

* **URL**

  ```
  /v1/users/{USER_ID}/devices
  ```

* **方法(Method)**

  ```
  POST
  ```

* **內容類型(Content-Type)**

  ```
  Content-Type:application/json;charset=UTF-8
  ```

* **內文**

  ```javascript
   {  
      "device_id":"nodemcu",
      "device_description":"NodeMCU With ESP8266",
      "device_credentials":"BN8RbpRKfxhm"
   }
  ```

* **成功回應：**
  * **HTTP狀態：** 200
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
  * **HTTP狀態：** 400 Bad request. If there are missing fields, the device is id is not valid \(only \[a-zA-Z0-9\_\]{1,25} is allowed\), the device already exists, or the user account is limited.

### **刪除使用者裝置**

  此方法允許刪除特定裝置。

  * **URL**

    ```
    /v1/users/{USER_ID}/devices/{DEVICE_ID}
    ```

  * **方法(Method)**

    ```
    DELETE
    ```

  * **成功回應：**
    * **HTTP狀態：** 200
  * **錯誤回應：**
    * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
    * **HTTP狀態：** 400 Bad request. If the device is connected.
    * **HTTP狀態：** 404 Not Found. If the device does not exists.

### 取得裝置狀態資訊

此方法允許即時從其最近建立的連接取得有關裝置的狀態資訊（如連接時間戳，遠端IP地址或傳輸數據）。

* **URL**

  ```
  /v1/users/{USER_ID}/devices/{DEVICE_ID}/stats
  ```

* **方法(Method)**

  ```
  GET
  ```

* **成功回應：**
  * **HTTP狀態：** 200
  * **回應內容：** 有關裝置的資訊，如連接狀態和時間戳，目前IP地址和傳輸數據。

    ```javascript
    {  
      "connected":true,
      "connected_ts":1486040468781,
      "ip_address":"83.52.36.133",
      "rx_bytes":810,
      "tx_bytes":854
    }
    ```
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized
  * **HTTP狀態：** 400 Bad request if the search device name is not valid
  * **HTTP狀態：** 404 Not Found
* **Note**

  此方法可與伺服器發送事件（SSE）一起使用，以取得有關裝置狀態資訊的即時更新，如tx和rx字節。如果您無法將授權標頭新增到SSE客戶端，則可以將存取令牌以`?authorization=eyJhbGci...`的方式附加到URL中。

### 裝置令牌(Device Token)

如前段說明所示，裝置令牌可做為`Access Token`使用，存取範圍限制為該裝置所擁有的資源，"存取裝置資源"章節的內容皆可以`裝置令牌`作為`存取令牌`使用。

### 取得裝置令牌

此方法允許取得有關發出令牌的資訊，以提供對特定裝置和資源的存取。

* **URL**

  ```
  /v1/users/{USER_ID}/devices/{DEVICE_ID}/tokens
  ```

* **方法(Method)**

  ```
  GET
  ```

* **成功回應：**
  * **HTTP狀態：** 200
  * **回應內容：** 包含每個裝置令牌資訊的陣列。

    ```javascript
    [  
       {  
          "id":"57fa7149114f032fe00f9787",
          "name":"Door Access",
          "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJwdWVydGEiLCJpYXQiOjE0NzYwMzA3OTMsImp0aSI6IjU3ZmE3MTQ5MTE0ZjAzMmZlMDBlOTc4NyIsInVzciI6Imp0In0.OISg5la0jZbWIYRY5KypzSHLVjVKyFLL3I1hjzYV-_A"
       }
    ]
    ```
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized
  * **HTTP狀態：** 404 Not Found

### 新增裝置令牌

此方法允許建立裝置令牌，以便以後可以使用它來存取授權的裝置和資源。生成的令牌也可以在某個給定時間自動到期。

存取裝置資源時，請使用Authorization標頭中生成的令牌，方法與存取令牌相同。您也可以將裝置令牌作為url參數傳遞，例如`?authorization=eyJhbGciOi...`

* **URL**

  ```
  /v1/users/{USER_ID}/devices/{DEVICE_ID}/tokens
  ```

* **方法(Method)**

  ```
  POST
  ```

* **內容類型(Content-Type)**

  ```
  Content-Type:application/json;charset=UTF-8
  ```

* **內文**

  ```javascript
    {
        "token_name": "DoorAccess",
        "token_resources": ["open", "close"],
        "token_expiration": 1487894400000
    }
  ```

  **注意**： `token_resources`和`token_expiration`都是可選的。僅當您需要限制對裝置資源的存取權限或使令牌在給定的UTC時間到期時，才使用此字段。

* **成功回應：**
  * **HTTP狀態：** 200
  * **內文:**有關建立的令牌的資訊，例如其標識符，名稱和令牌本身。

    ```javascript
    {
        "id": "58938c016f789e15ee15b583",
        "name": "DoorAccess",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXYiOiJkZXZpY2UyIiwiZXhwIjoxNDg3ODk0NDAwLCJpYXQiOjE0ODYwNjQ2NDEsImp0aSI6IjU4OTM4YzAxNmY3ODllMTVlZTE1YjU4MyIsInJlcyI6WyJvcGVuIiwiY3xvc2UiXSwidXNyIjoiYWx2YXJvbGIifQ.lAYQcdMD92RbYzhCfgvkIb2R15DqcWGmdb07cxgE8bM"
    }
    ```
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
  * **HTTP狀態：** 400 Bad request. If there are missing fields.

### 刪除裝置令牌

此方法允許刪除指定的裝置令牌。

* **URL**

  ```
  /v1/users/{USER_ID}/devices/{DEVICE_ID}/tokens/:token_id
  ```

* **方法(Method)**

  ```
  DELETE
  ```

* **成功回應：**
  * **HTTP狀態：** 200
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
  * **HTTP狀態：** 404 Not Found. If the token cannot be found.

### 存取裝置資源

您可以根據您的使用者ID，裝置ID以及您自己在裝置中定義的資源以API進行存取。本節介紹如何存取不同類型的資源，如輸出，輸入，輸入/輸出和回調(CallBack)資源。

#### 輸出資源

輸出資源是外部程式或服務可以向連接的裝置查詢資訊的方式，例如感測的數據，讀取目前裝置狀態或從裝置中提取所需的任何其他值。

此方法允許存取裝置中定義的輸出資源，因此您可以即時讀取每個資源提供的內容。這樣每個API調用都將執行輸出資源以填充資源中定義的資訊。

* **URL**

  ```
  /v2/users/{USER_ID}/devices/{DEVICE_ID}/{RESOURCE_ID}
  ```

* **方法(Method)**

  ```
  GET
  ```

* **成功回應：**
  * **HTTP狀態：** 200
  * **內容類型(Content-Type)**: application/json
  * **內文**: A JSON document with the key `out` that stores your resource definition.
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
  * **HTTP狀態：** 404 Not Found. If the device or resource is not available.

**範例 1**

如果您的帳戶是`alvarolb`，您的裝置ID是`nodemcu`，並且您的裝置中的資源定義如下：

```cpp
thing["location"] >> [](pson& out){
    out["lat"] = gps.getLatitude();
    out["lon"] = gps.getLongitude();
};
```

您可以通過向[https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/location](https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/location) 發送HTTP GET請求，以取得裝置的緯度和經度：

```javascript
{
  "out" : {
    "latitude" : 40.125698,
    "longitude" : -5.466911
  }
}
```

**範例 2**

如果您的帳戶是`alvarolb`，您的裝置標識符是`nodemcu`，並且您的裝置中的資源定義如下：

```cpp
thing["temperature"] >> [](pson& out){
    out = dht.readTemperature();
};
```

您可以通過向[https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/temperature](https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/temperature) 發送HTTP GET請求以取得目前溫度：

```javascript
{
  "out" : 21.00
}
```

#### 輸入資源

裝置輸入資源是連接裝置可以從雲端接收資訊的方式，例如通過它們啟動馬達，切換繼電器，移動伺服或進行不同的邏輯設定。

此方法允許您將資料即時推送到裝置中定義的輸入資源，因此，調用時將會使用某些資訊來存取您的裝置資源。

* **URL**

  ```
  /v2/users/{USER_ID}/devices/{DEVICE_ID}/{RESOURCE_ID}
  ```

* **方法(Method)**

  ```
  POST
  ```

* **內容類型(Content-Type)**

  ```
  Content-Type:application/json;charset=UTF-8
  ```

* **內文**

  ```javascript
  {  
    "in": <any json value, json document, or json array>
  }
  ```

* **成功回應：**
  * **HTTP狀態：** 200 OK. If your device is connected and the resource was called successfully.
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
  * **HTTP狀態：** 404 Not Found. If the device or resource is not available.

**範例 1**

如果您的帳戶是`alvarolb`，您的裝置標識符是`nodemcu`，並且您的裝置中有一個輸入資源，例如，用於打開/關閉繼電器(Relay)：

```cpp
thing["relay"] << [](pson& in){
    digitalWrite(RELAY_PIN, (bool)in);
};
```

您可以通過向 [https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/relay](https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/relay) 發送HTTP POST請求以更改目前狀態：

```javascript
{
  "in" : true
}
```

```bash
curl \
  -H "Content-Type: application/json;charset=UTF-8" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json, text/plain, */*" \
  -X POST \
  -d '{"in":true}' \
  https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/relay
```

**範例 2**

如果您的帳戶是`alvarolb`，您的裝置標識符是`nodemcu`，並且您的裝置中有一個輸入資源，例如，用於更改RGB燈顏色：

```cpp
thing["rgb"] << [](pson& in){
    int r = in["r"];
    int g = in["g"];
    int b = in["b"];
    // use here r, g, and b values to change the light color
};
```

您可以通過向 [https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/rgb](https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/rgb) 發送HTTP POST請求以設定目前顏色：

```javascript
{
  "in" : {
    "r" : 0,
    "g" : 255,
    "b" : 0
  }
}
```

Curl 範例:

```bash
curl \
  -H "Content-Type: application/json;charset=UTF-8" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json, text/plain, */*" \
  -X POST \
  -d '{"in":{"r":0,"g":255,"b":0}}' \
  https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/rgb
```

**範例 3**

如果您的帳戶是`alvarolb`，您的裝置標識符是`nodemcu`，並且您的裝置中有一個輸入資源，例如，用於執行linux命令，更改螢幕上的文字等：

```cpp
thing["command"] << [](pson& in){
    String command = in;
    // work here with the string
};
```

您可以通過向 [https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/command](https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/command) 發送HTTP POST請求變更文字：

```javascript
{
  "in" : "New customer: 101 today!"
}
```

Curl 範例:

```bash
curl \
  -H "Content-Type: application/json;charset=UTF-8" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json, text/plain, */*" \
  -X POST \
  -d '{"in":"New customer: 101 today!"}' \
  https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/command
```

#### 輸入/輸出資源

裝置資源也可以定義為輸入/輸出資源，也就是說，它們可以基於輸入提供輸出。

* **URL**

  ```
  /v2/users/{USER_ID}/devices/{DEVICE_ID}/{RESOURCE_ID}
  ```

* **方法(Method)**

  ```
  POST
  ```

* **內容類型(Content-Type)**

  ```
  Content-Type:application/json;charset=UTF-8
  ```

* **內文**

  ```javascript
  {  
    "in": <any json value, json document, or json array>
  }
  ```

* **成功回應：**
  * **HTTP狀態：** 200
  * **內容類型(Content-Type)**: application/json
  * **內文**: A JSON document with the key `out` that stores your resource output.
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
  * **HTTP狀態：** 404 Not Found. If the device or resource is not available.

**範例 1**

如果您的帳戶是`alvarolb`，您的裝置標識符是`nodemcu`，並且您的裝置中的輸入/輸出資源`io`定義如下，即用於回傳總和和乘法：

```cpp
thing["io"] = [](pson& in, pson& out){
    out["sum"] = (long)in["value1"] + (long)in["value2"];
    out["mult"] = (long)in["value1"] * (long)in["value2"];
};
```

您可以通過向[https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/io](https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/io) 發送HTTP POST請求，以根據輸入獲得結果：

**輸入**

```javascript
{
  "in" : {
    "value1" : 20,
    "value2" : 10
  }
}
```

**輸出**

```javascript
{
  "out" : {
    "sum" : 30,
    "mult" : 200
  }
}
```

**Curl 範例**

```bash
curl \
  -H "Content-Type: application/json;charset=UTF-8" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Accept: application/json, text/plain, */*" \
  -X POST \
  -d '{"value1":20,"value2":10}' \
  https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/io
```

#### 沒有參數的資源

這種資源不提供或要求任何資訊。它們就像裝置中定義的可以根據需要調用的功能，例如，強制裝置更新，重啟系統或任何其他操作。

此API方法允許調用裝置中定義的資源，因此您可以執行相關的功能。

* **URL**

  ```
  /v2/users/{USER_ID}/devices/{DEVICE_ID}/{RESOURCE_ID}
  ```

* **方法(Method)**

  ```
  GET
  ```

* **成功回應：**
  * **HTTP狀態：** 200 OK. If your device is connected and the resource was called successfully.
* **錯誤回應：**
  * **HTTP狀態：** 401 Unauthorized. If the auth is not success.
  * **HTTP狀態：** 404 Not Found. If the device or resource is not available.

**範例 1**

如果您的帳戶是`alvarolb`，您的裝置標識符是`nodemcu`，並且您裝置中的`reset`的資源定義如下，即重新啟動ESP8266裝置。

```cpp
thing["reset"] = [](){
    ESP.reset();
};
```

您可以通過向 [https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/reset](https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/reset) 發送HTTP GET請求以重啟裝置：

```bash
curl \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  https://api.thinger.io/v2/users/alvarolb/devices/nodemcu/reset
```

## 使用者 API

Work in progress...

## 端點 API

Work in progress...

## 儀表板 API

Work in progress...

## 儲存桶 API

Work in progress...

