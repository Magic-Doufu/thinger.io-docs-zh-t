---
description: Plugin to improve the integration of Sigfox devices
---

# Sigfox擴充元件

![](~@plugins/sigfox/sigfox_plugin.png)

此擴充元件是使用Sigfox HTTP回調功能的最佳解決方案，它提供了可輕鬆將這些裝置與Thinger.io平台整合的功能，例如自動設定裝置和存儲桶以及雲端處理上下行鏈路數據。

::: tip
注意：擴充元件僅適用於付費Thinger.io伺服器。確認[**此鏈接**](https://pricing.thinger.io)以在幾分鐘之內建立您自己的實體。
:::

## 擴充元件功能

* 為"Device Type"為Sigfox的新裝置自動設定裝置和儲存桶。
* 儲存 Sigfox 裝置描述元: 裝置位置、通訊品質、硬體序列號等。
* 自動將裝置數據存儲在數據桶中，以便可以從控制台輕鬆使用。
* 可自定義以NodeJS處理的 **uplink** 為 `payload_raw` 或  `payload_fields` 。
* 支援自定義以NodeJS處理的 **downlink** **callbacks** 因此它可以設定下行資料使用使用者友好的 \(JSON\)之後再將其轉換為TTN網路要求的 `payload_raw` 或 `payload_fields`。

## Sigfox概念

為了更好地理解以下各節，在此介紹了一些Sigfox基本概念：

* Device: 這是具有官方Sigfox介面的硬體裝置。
* Gateway: 它是Sigfox基礎硬體介面，基本上從多個邊緣裝置接收訊息，然後通過IP通訊將它們推送到Sigfox伺服器。這些閘道器是Sigfox公司的專有財產。
* Uplink: 這是一個串流數據，表示從裝置傳送到sigfox雲的訊息。上行鏈路有兩種不同的過程：單向上行鏈路（從裝置到Sigfox網絡的單個數據通訊）和雙向上行鏈路，這也允許Sigfox系統向裝置傳送下行鏈路。
* Downlink: 這是一個串流數據，表示從Sigfox雲傳送到裝置的訊息。
* Device Type: 這是一種概念，它定義出一組通常在上行鏈路和下行鏈路中傳送相同類型的數據的裝置。

::: tip
由[**此處** ](https://docs.thinger.io/hardware-devices/sigfox#create-sigfox-callback)了解如何設定Sigfox回調以將數據傳送到Thinger.io平台
:::

## 擴充元件設定

在本節中，將介紹可用於設定Sigfox擴充元件的不同介面。

### 應用程式

通過此擴充元件整合的每個Sigfox"Device Type"都應在Thinger.io擴充元件中定義一個新的設定檔，其ID與Sigfox平台中定義的ID相同。請注意，以此方式定義的Sigfox裝置將會調整擴充元件對此類裝置的行為。

![](~@plugins/sigfox/sigfoxPluginDeviceType.png)

可以根據需要建立任意多個設定檔。要設定新的設定檔，只需從"Device Types"下拉列表中選擇ID，然後導航至擴充元件的其他部分。

::: warning
始終使用與Sigfox雲中定義的ID相同的ID建立裝置類型。
:::

### 回調設定

上行鏈路行為允許設定擴充元件如何處理從Sigfox收到的新資訊。

![](~@plugins/sigfox/SigfoxPluginCallbackConfir.png)



* **自動設定資源：**在接收未建立的訊息時啟用或禁用自動資源設定裝置。
* **裝置連接超時：**建立新裝置時，以分鐘為單位建立裝置連接超時，因此平台可以在固定時間後將裝置視為已中斷連線，而不會收到訊息。
* **裝置ID前綴：**建立新裝置時，請使用自定義前綴+原始裝置ID進行建立。
* **桶ID前綴：**建立與裝置關聯的新數據桶時，請使用自定義前綴+原始裝置ID進行建立。
* **更新裝置位置：**使用網關資訊中提供的位置來更新當前裝置位置。
* **初始化下行鏈路數據：**建立新裝置時，初始化自定義的下行鏈路數據，可以在進一步的下行鏈路請求中對其進行修改和處理。
可設定的參數如下：

* **Auto provision resources:** 對於尚未建立的裝置開啟或關閉其收到訊息時的資源自動處理行為
* **Device connection timeout:** 建立新裝置時，以分鐘為單位設定裝置連接超時時間，因此平台可以在固定時間後將裝置視為已中斷連線，而不會收到中斷訊息。
* **Device identifier prefix:** 使用`自定義前綴`+`原始裝置ID`作為名稱建立新裝置。
* **Bucket identifier prefix:** 使用`自定義前綴`+`原始裝置ID`作為名稱建立與裝置關聯的新數據桶。
* **Update device location:** 使用閘道器資訊中提供的位置來更新目前裝置位置。
* **Initialize downlink data:** 建立新裝置時，下行鏈路初始化為自定義的數據，可以在進一步的下行鏈路請求中對其進行修改和處理。

### Payload 處理

在此部分中，可以設定 payload 處理器為：將上行訊息中的Sigfox payload轉換成原始資訊，或將來自Thinger.io平台傳送給Sigfox雲的下行訊息處理成payload。

介面為NodeJS 提供了一個編輯器，可以在其中定義`uplink`和`downlink`處理器。也可以通過為`uplink`和`downlink`提供樣本輸入來測試程式。

![](~@plugins/sigfox/callbackProcess.png)

以下是有關上行鏈路和下行鏈路方法(method)的資訊。

::::: tabs style:card
:::: tab 上行鏈路(Uplink) lazy
當裝置通過網絡傳送新訊息時，將調用上行鏈路方法。根據Sigfox網絡中完成的設定，此功能可以接收兩種不同的輸入：

* **Base64 String** :如果Sigfox裝置類型定義了自定義payload格式，則此方法將接收以base64編碼的原始payload。在這種情況下，有必要編寫一個函數將此base64數據轉換為JSON物件。
* **JSON Object:** :此方法的輸出必須始終是一個JSON物件，其中包含平台必須使用的資訊。在下面，有一個上行方法將base64數據轉換為JSON物件，並從二進制數據中解析出 `temperature` 和 `humidity` 的範例。

```javascript
/* convert a base64 payload to a JSON object that can be used 
   by Thinger.io */
    module.exports.uplink = function(payload){
    const buffer = Buffer.from(payload.data, 'hex');
    payload.temperature = buffer.readInt16LE(0)/100.0;
    payload.humidity = buffer.readInt16LE(2)/100.0;
    return payload;
};
```

::: tip
上行方法必須回傳JSON物件。
:::
::::

:::: tab 下行鏈路(Downlink) lazy
僅當Sigfox裝置將雙向訊息上行鏈路到Sigfox Cloud時，才會調用下行鏈路方法。在此例，Thinger.io伺服器將回應一個包含十六進制編碼的自定義下行鏈路 payload 回調訊息。請檢視下一部分以獲取更多詳細資訊。

該函數將接收不同的輸入，具體取決於REST API調用擴充元件的方式。

* **JSON Object**: 如果對一個定義了`downlink`屬性（如果在擴充元件中設定了`Initialize Downlink Data`，這會自動初始化）的Thinger.io裝置進行了下行鏈路調用，此方法將接收此屬性的JSON內容。它通常由使用者友好的裝置設定組成，其後將使用base64將其編碼為二進制。
* **JSON Object**: 如果擴充元件的下行請求在POST調用中包含JSON payload，則此函數將接收此 payload，而不是接收在裝置的`downlink`屬性中設定的負載。

該方法的輸出將是包含要傳送到Sigfox網絡的二進制資訊的**Base64 String**。

根據Sigfox的要求將JSON裝置設定轉換為base64的下行方法的範例：

```javascript
/* convert a JSON object with the device configuration in a base64
   string expected by TTN */
module.exports.downlink = function(payload){
    let bytes = [];
    bytes[0] = payload.enabled ? 1 : 0;
    bytes[1] = payload.frequency;
    bytes[2] = payload.threshold;
    return Buffer.from(bytes).toString('base64');
};
```
::::
:::::

::: tip
使用介面測試器，看看你的程式碼是否正確處理 payload。
:::

## Sigfox 雲設定

### 上行鏈路整合

![](~@plugins/sigfox/sigfoxCloudConfig.png)

### 下行鏈路整合

## 擴充元件開發詳細資訊

### 上行數據流

在本節中，將描述從Sigfox網絡中的源到Thinger.io中的上行數據流的工作方式。

![](~@plugins/sigfox/uplinkDataFlow.png)

在以下小節中，描述了圖中所示的元素。

#### Sigfox上行鏈路回調

當Sigfox從任何裝置接收到訊息時，它將自動檢查其整合的設定，以將接收到的資訊轉發。該擴充元件通過HTTP整合，因此，Sigfox網絡將在有新訊息時向Thinger.io擴充元件發出HTTP請求。

#### Sigfox 擴充元件

Thinger.io擴充元件以JSON格式從Sigfox網絡接收數據。回調包含多個資訊字段，例如 `app_id`, `dev_id`, `donwlink_url`, `metadata`或LoRa裝置在`payload_fields` or `payload_raw`字段上傳送的實際 payload 資訊，具體取決於Sigfox應用程式中的 payload 格式設定。

這是擴充元件接收到的原始資訊的範例：

```javascript
{

}
```

擴充元件接收到此資訊後，將對其進行處理以在Thinger.io中執行以下操作：

1. 如果是平台上不存在的新裝置，則自動基於`dev_id`字段設定該裝置及其關聯的數據存儲桶。
2. 調用裝置回調，該回調實際上會將已處理的數據推送到其關聯的數據桶，也可以執行其他操作，例如將數據轉發到其他端點。

#### 上行處理器

該擴充元件允許設定用於處理傳入數據的自定義程式碼。Sigfox裝置傳送的資訊為了以最大程度地縮短傳輸時間，通常以小型二進制 payload 進行編碼，這些 payload 不能直接用於表示，因為它們不包含標籤，JSON，ASCII文本等。因此需要在雲中某個點處理裝置傳送的數據。

如果需要，此擴充元件還允許建立自定義解碼器。使用Thinger.io 處理（如果需要） payload 的優點是，它使用NodeJS執行而不是純Javascript，因此可以使用諸如Buffer之類的NodeJS模組，從而簡化了處理功能的設計。

在擴充元件中設定payload處理器後將進行預編譯，並與從Sigfox接收到的payload數據一起執行。該函數（如果已執行）的輸出將被傳輸到如下的最終步驟－裝置回調。

#### 裝置回調

該擴充元件的最後一步是在Thinger.io中調用裝置回調。該擴充元件自動將新的Sigfox裝置設定為HTTP裝置。Thinger.io中的HTTP裝置是通用裝置，可以通過REST API方法推送數據。Thinger.io將負責獲取輸入數據並對其執行不同的可設定操作，例如將裝置狀態更改為已連線/已離線、將提供的數據寫入已設定的數據桶、通過端點將該資訊傳送給其他服務、將提供的資訊存儲為裝置屬性或由其中一個裝置屬性回傳數據。

在這種情況下，擴充元件將通過此類REST介面與平台進行互動，推送從Sigfox接收的數據，並通過自定義的上行鏈路方法進行處理。預設情況下，該擴充元件會初始化HTTP裝置也會寫入自動建立的數據桶。因此，Sigfox裝置傳送的每條資訊都將寫入特定的數據桶。如下圖所示：

![](~@plugins/sigfox/SigfoxDeviceCallbackAuto.png)

完成裝置回調後，它將顯示為已連接的裝置，並且如果在擴充元件選項中進行了設定，還會顯示其位置。

### 下行數據流
