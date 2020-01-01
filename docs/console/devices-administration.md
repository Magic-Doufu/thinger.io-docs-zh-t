# 裝置管理

## 建立裝置

在Thinger.io中啟動IoT項目的第一步（除了像Sigfox這樣非TCP Socket連接導向的裝置）是通過新增裝置來授予存取權限，以便將裝置連接到您的帳戶。任何裝置皆必須於Thinger.io中註冊才能存取平台。每個裝置都有自己的`ID`和`憑證(Credential)`，並且屬於某個使用者帳戶。本節介紹在您的帳戶中註冊新裝置所需的步驟。

要註冊新裝置，請在登錄後，切換到左側選單中的**Devices**部分。

![](~@cloud/MenuDevice.jpg)

此部分將列出您註冊的裝置，並顯示有關連接狀態的一些資訊。類似於下圖的畫面。

![](~@cloud/DeviceList.png)

如果這是您第一次造訪Thinger.io，此列表應為空。我們接下來將向您展示如何創建您的第一個裝置。

首先，點擊**Add Device**，這將打開一個表單，您可以在其中輸入`裝置ID`與`憑證`。並從下拉列表中選擇**Device Type**，選擇以下之一類型：

* Generic device: 適用於裝有Thinger.io客戶端的裝置。例如Raspberry Pi，Linux或Arduino裝置。
* HTTP device: 此選項允許您在沒有完全集成的情況下從第三方平台和商業裝置中取得數據以進行資訊處理。 
* Thinger Core 32 device: 僅適用於上面裝有Thinger.io Core的ESP32模組。

選擇裝置類型後，應該填寫如下表單：

![](~@cloud/DeviceDetail.png)

在此處輸入給予裝置唯一的`Device Id`、可以幫助您識別裝置的`Device description`以及憑證`device credentials`。每個裝置都有自己的`ID`/`憑證`，因此帳戶中的裝置間不會互相影響。伺服器中的所有密碼都加入透過`PRNG`與非折舊性迭代(non-despreciable amount of iterations)產生出的32字節的鹽，並使用`PBKDF2 SHA256`進行安全存儲。
保存好您的`device Id`和`device credentials`，因為您需要它們來連接您的裝置（密碼設定後將無法再次檢視）。

如果一切順利，你應該看到一些成功的訊息

![](~@cloud/AddDeviceDone.png)

現在，您可以返回到裝置列表，裝置應顯示為已中斷連接。

![](~@cloud/DeviceListAdded.png)

現在，您可以使用新裝置ID和裝置憑據來連接新裝置。根據您的裝置，您將需要安裝所需的程式庫或開發環境，因此請根據您的裝置簽出以下部分：

<linkref title="Arduino" path="/devices/arduino.md"></linkref>

<linkref title="Linux/Raspberry Pi" path="/devices/linux.md"></linkref>

請記住，Sigfox裝置不共享已連接裝置的概念，因為它們預設情況下是定期發送資訊的離線裝置。如果您想存取來自這些裝置的資訊，請檢視以下文件。

<linkref title="Sigfox" path="/devices/sigfox.md"></linkref>

對於以下範例，我們將使用Arduino IDE和ESP8266裝置，如NodeMCU，在這種情況下，您可以打開ESP8266的範例程式，並填寫裝置詳細資訊：您的使用者名，裝置ID以及建立裝置時建立的裝置憑證。下圖顯示了程式與帳戶中建立的裝置之間的關係。

![](~@cloud/DeviceAndCode.png)

一旦我們在程式中建立了我們的帳戶ID，裝置ID和裝置憑證，我們就可以編譯並上傳程式。同時，我們只需在裝置列表中點擊其ID即可在雲控制台中打開我們的裝置。在裝置畫面中，您將能夠即時檢視有關裝置的一些資訊，例如IP位址，連接狀態或發送/接收的資訊。預設情況下，我們的裝置將顯示為已中斷連接，如下圖所示。

![](~@cloud/DeviceExplorerOffline.png)

裝置連接到帳戶後，界面將更改其狀態，顯示已連接，並且正在傳輸資訊，如下圖所示：

![](~@cloud/DeviceExplorerOnline.png)

請注意，已連接的裝置儀表板能夠顯示裝置的大略位置，可以根據本文件"properties"部分的說明進行修改。現在我們已將裝置連接到帳戶中，已經準備好開始通過網際網路與裝置進行互動。

## 裝置 API

Thinger.io平台的一個很酷的功能是，它可以探索裝置中定義的資源。資源可以是傳感器讀數，如溫度，濕度或壓力。也可以是任何可操作的元素，如燈，繼電器或電動機。一般來說，任何裝置資源都像一個可以通過Rest API依照需求調用的回調函數。通過這種方式，本節將介紹如何通過雲控制台與裝置資源進行互動，同時您亦將了解如何調用自己的REST API來存取資源。

將裝置連接到帳戶後，如上一節所述，您可以存取其資源並使用`API EXPLORER`探索`API Rest`端點。您可以通過點擊名為`Device API`的藍色小按鈕，在`DEVICE`頁中存取此畫面。

在API資源管理器界面中，您將看到許多不同的框列出程式中定義的每個資源。每個資源都有一個ID，該ID與程式中定義的資源名稱相關。

在Thinger.io平台中，您可以定義4種不同類型的資源，分別為：輸入（向裝置發送數據），輸出（裝置將發送資訊），輸入/輸出（您可以在一個調用中發送和接收資訊）以及回調資源(僅用於執行函數而不傳遞任何數據)。從API的角度來看，輸入和輸出數據可以是任何JSON文件。您可以檢視程式庫文件了解如何定義這些不同的資源。

例如，Arduino程式庫中的預設ESP8266範例定義了兩種不同的資源。一個稱為`led`的輸入資源，用於控制`BUILTIN_LED`和一個調用`millis`以提取裝置直行至目前毫秒數的輸出資源，如以下程式中所定義。請注意，資源名稱可以是用於標識基礎資源的任意文字，它們與平台中定義的任何常數無關。

以下是我們的範例資源：

```cpp
thing["led"] << digitalPin(BUILTIN_LED);
thing["millis"] >> outputValue(millis());
```

如果我們的裝置連接到平台，我們可以打開我們的裝置API資源管理器並檢視平台中定義的資源，如下圖所示。

![](~@cloud/DeviceApi.png)

現在您可以看到如何於平台中使用裝置中所定義的資源，因為裝置能夠回報可用資源及其格式（或目前狀態）。您可以在這裡測試您的資源，與它們進行即時互動。您將能夠切換LED狀態，或讀取Arduino裝置運作至目前的毫秒數。
每次點擊`Run`按鈕都將立即執行您的資源，即根據資源類型，向裝置要求傳感器數值、調用`millis()`或為動作機構發送新狀態，具體行為取決於資源類型（輸入或輸出）。

關於這一點的好處是每個裝置資源都可以轉換為REST API端點，因此您可以使用標準REST請求如`POST`方法將值發送到裝置，或使用`GET`從裝置讀取資訊等方法來使用或與裝置互動。因此，在這些API端點被結合到其他平台或應用程式之前即可輕鬆對這些端點進行測試。

您甚至可以從平台測試更複雜的輸入和輸出。在以下範例中，假設您已經定義了一個回傳兩個整數和與乘積的資源，例如：

```cpp
thing["in_out"] = [](pson& in, pson& out){
    out["sum"] = (int)in["value1"] + (int)in["value2"];
    out["mult"] = (int)in["value1"] * (int)in["value2"];
};
```

此資源定義將轉換為平台中的以下資源，其既可以測試輸入值，也可以檢視輸出結果。因此，您可以嘗試輸入一些值，點擊`Run`，然後檢視裝置回報的輸出。此範例還強調資源如何工作，因為它們不僅僅是靜態值，而是可以使用任何輸入或輸出值調用的回調。

![](~@cloud/InOutResource.png)

除了可以與裝置互動的有用裝置API資源管理器之外，您還可以通過點擊`Show Query`按鈕取得有關REST API端點的特定資訊。它提供方法(method)、URL、內容類型(ContentType)、請求內容(Request Body)和響應內容(Response Body)等資訊。您也可以點擊`Curl`直接複製產生的指令與裝置進行互動。

上面的範例轉換為以下REST API調用：

![](~@cloud/ShowQuery.png)

[此處](/api.html#%E5%AD%98%E5%8F%96%E8%A3%9D%E7%BD%AE%E8%B3%87%E6%BA%90).提供了有關與裝置進行交互的API的更多信息。

## HTTP 裝置回調 (Callback)

由於這些裝置的性質，[thinger.io](http://thinger.io/)在使用回調進行結合的基礎上應用了特殊處理。回調是伺服器的一項功能，通過帶有數據的HTTP查詢來請求處理裝置數據，例如將其存儲在存儲桶中，調用端點設定檔或登錄至應發送的JSON中。

要建立回調，請打開裝置儀表板，然後檢視名為`callback`的部分，`callback details`區塊將顯示一些選項，如下圖所示：

![](~@cloud/CallbackDetails.png)

此內容顯示了可以通過使用回調從伺服器請求的不同功能，只需點擊複選框並選擇將接收數據的資源，例如：

* 將數據存儲至可縮放的[數據儲存桶](/console/buckets.html)中
* 調用[端點設定檔](/console/endpoints.html)與第三方結合
* 使用`Set device property`或`response data`功能檢視或修改[Device Properties](/api.html#Device-properties)。

請注意，無法通過回調新增屬性，數據儲存桶或端點，因此必須先於Web控制台或REST API進行建立

您已設定了回調詳細資訊，系統將準備接收請求。
與已連接裝置的儀表板中包含的"show query"功能類似，您可以通過點擊`Callback Details`內的"overview"或"cURL Example"選項來找到HTTP請求結構的精確規範和完整的cURL範例。

內容如下圖所示：

![](~@cloud/CallbackOverview.png)

最後，要進行一個具回調功能的HTTP請求，必須將`Authorization Header`加入至請求中。如以下範例所示：

```
https://<Thinger_Server>/v3/users/<Username>/devices/<Device_ID>/callback?authorization=<Authorization_Header>
```

## 裝置令牌\(Device Tokens\)

所有與您連接的裝置的互動，即使用上面評論的REST API端點或智慧手機，都需要針對平台進行身份驗證。預設情況下，當您通過[Thinger.io](http://thinger.io/)控制台與裝置進行互動時，您將使用從使用者名和密碼獲取的存取令牌隱式地將所有請求簽核到平台。這種授權允許您存取所有的帳戶資源，因此您可以設定裝置，數據儲存桶等。但此授權經常過期（將由瀏覽器自動續約），並且不能用於其他我們授予裝置存取權限的使用者或平台，因為您將提供對所有帳戶的存取權限。

在這種情況下，可以建立特定的存取令牌以授予對裝置的存取權限，甚至可以授予對裝置上特定資源的存取權限。此外，通過設定有效日期，可以即時定義令牌有效性。這樣，如果您需要為第三方工具（如IFTTT，外部網頁，手機或其他任何服務）提供對某些裝置資源的存取權限，強烈建議您建立裝置令牌。

要建立裝置令牌，請打開裝置儀表板，然後檢視名為 "Device Tokens"的子頁面。

![](~@cloud/AddDeviceToken.png)

接著點擊右側綠色的`Add`按鈕，會出現一個視窗，您可以設定不同的參數：

* Token name: 使用代表名稱來記住令牌的發布原因，即IFTTT Access，手機等。
* Token access: 設定令牌以允許存取或限制對裝置資源的存取。
* Token expiration: 將令牌設定為在某個給定日期到期，或者永不過期。

下圖顯示了設定裝置令牌時的範例畫面截圖。

![](~@cloud/addTockenForm.png)

令牌此時已經保存，界面將顯示要在REST API調用中使用的存取令牌，如下圖所示。如果您需要幫助以在REST API調用中集成此存取令牌，請檢視[此文件](http://docs.thinger.io/api/#authentication-api-rest-api-authentication)。

![](~@cloud/device_token_value.png)

## 裝置屬性

此處提供了一種簡單的方法來存儲與裝置有關的特定資訊，例如位置，ID或是裝置可能使用通用Json文件查詢到的配置參數。這樣，平台可以用作裝置的持久性內存。要創建裝置屬性，請打開裝置儀表板，然後查看名為“屬性”的小節。\

![](~@cloud/DeviceProperties.png)

此選單提供了一種建立，管理或刪除裝置屬性的簡便方法。請注意，在此範例中建立的屬性指定了裝置位置。[Thinger.io](http://thinger.io/)系統被設計為會自動偵測此設定，並將其表示在裝置儀表板地圖上。

![](~@cloud/AddDeviceProperty.png)

屬性聲明和修改是通過特殊的內容進行的，該內容提供了json驗證器，可以增強模式檢查文本中的型別錯誤。

### 在程式碼中使用屬性

可以在裝置上使用`set_property()`或`get_propery()`進行產生、檢視和修改屬性，如下例所示：

```
/*set property value*/

//create a pson with new values
pson data;
data["longitude"]=-4.056;
data["latitude"]=41.40;
//sending new values to platform
thing.set_property("location", data, true);

/*retrieve property value*/

//creating a pson to store the property values
pson data;
//retrieving data from the platform
thing.set_property("My_Property", data, true);
 
```

\(您可以在本文件的"編纂"部分中了解有關此功能的更多詳細資訊\)

但是我們必須區分該裝置是HTTP裝置還是[thinger.io](http://thinger.io/)客戶端裝置。

如使用HTTP裝置，還可以通過設定回調的子選單工具與屬性進行互動。

![](~@cloud/HTTPGetSetProperty.png)

根據此設定，當[Thigner.io](http://thigner.io/)伺服器從`SigfoxDevice1`接收到任何傳輸時，payload 數據將存儲到`data`屬性中，並建立一個包含所有變數的JSON。在另一個的情況下，由於使用了"響應數據\(Response Data\)"功能，因此會將存儲在"downlink \_data"參數中的值發送到Sigfox基礎架構裝置。

## 裝置設定

您可以通過選擇裝置後，在裝置儀表板的"Settings"項目中調整一些裝置詳細資訊，如描述或憑證。

忘記憑證時可以在此直接更新憑證（憑證設定後無法從資料庫中恢復，因為它已加密）。請注意，更改裝置憑證不會中斷裝置，但會在中斷連接後阻止其重新連接。

![](~@cloud/deviceEdit.png)

如果您需要更改裝置ID，則必須刪除該裝置，然後用所需的裝置資訊註冊一個新的裝置。