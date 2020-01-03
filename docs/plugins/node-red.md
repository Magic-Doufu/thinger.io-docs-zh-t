---
description: Plugin to improve the integration of Node-RED into Thinger.io
---

# Node-RED擴充元件

Node-RED是IBM建立的一個開源項目，旨在為Rule Engines市場提供一個簡單但功能強大的框架，其具有易於使用的圖形程式設計界面以及龐大的使用者社群，社群對此貢獻了超過2000個項目。

![](~@plugins/Node-RED/Node-RED.png)

::: tip
注意：擴充元件僅適用於付費Thinger.io伺服器。確認[**此鏈接**](https://pricing.thinger.io)以在幾分鐘之內建立您自己的實例
:::

## 擴充元件功能

* [x] Node-RED伺服器與Thinger.io實體安裝在同一專用主機中，採全天(24\*7)且無節點數量限制的模式運作。
* [x] 帶有可臨時(ad-hoc)編輯的Thinger.io節點，該節點支援：

  1\) 以給定的時間間隔訂閱裝置資源。（device stream 節點）

  2\) 發生事件時讀取裝置資源。（device read 節點）

  3\)將數據發送到連接的裝置。（device write 節點）

  4\) 呼叫端點 \(endpoint call 節點\)

  5\) 寫入數據桶 \(bucket write 節點\)

## Node-RED 概念

Node-RED本質上包含在開發工具中，該工具具有兩個基本組件："流程編輯器（flow editor）"，其包含可在任何Web瀏覽器上啟動的圖形程式設計工具，以及具有能夠執行流程的規則引​​擎伺服器後端。這個系統確實很容易學習和使用，但是在開始使用它之前，您應該了解一些概念：

### 節點(Nodes)

節點是建立流程的基本構建積木。每個節點都包含其自己的設定形式和特定行為，一旦將其引入到Web編輯器工作區域中，就可以通過雙擊該積木來存取它。這裡有一些基本的節點類型：

#### **注入節點**
![](~@plugins/Node-RED/node_inject.png) 

該節點可以在事件被觸發時自動啟動流程，事件可以是在屬性窗體中指定的固定間隔或通過Web編輯器手動觸發。這些節點發送的消息會設定其 payload 和標題屬性。
通過該節點，可以在屬性窗體中指定的固定間隔或通過Web編輯器手動觸發事件時自動啟動流程。這些節點發送的訊息會設定其 payload 和主題屬性(topic properties)。

#### **函數, 變更, 切換節點**

![](~@plugins/Node-RED/node_function.png) 

包含一些允許使用預設定的工具或對其行為使用內建的文字編輯器進行JavaScript程式設計來處理流程 payload 的節點，這個節點具有輸入連接器與輸出連接器。

#### **輸出和除錯節點**

![](~@plugins/Node-RED/node_debug.png)

該節點僅具有一個輸入連接器，該輸入連接器允許從流程中提取數據到Web編輯器中的第三方，檔案或除錯控制台。

### Palette

編輯器有一個稱為"palette"的圖形列表，提供建立流程時，簡單存取Node-RED伺服器中找到的所有可用節點。您可以使用位於Node-RED主選單上的"palette manager"擴展palette。在該選單中，您可以找到由Node-RED開發人員和社區貢獻者建立的2.000多個節點並將其附加到您的伺服器上。

### 流程(Flows)

流程在編輯器工作空間中以選項卡方式表示，並且是組織化節點的主要方法。每個流程可以具有一個名稱和描述，該名稱和描述顯示在[資訊側邊欄](https://nodered.org/docs/user-guide/editor/sidebar/info)中。流程中的所有節點都可以存取[相同流程範圍的上下文](https://nodered.org/docs/user-guide/context)。

使用流程編輯器可以輕鬆將palette中的各種節點將串流連接在一起。然後點擊**debloy**按鈕即可將編輯中的流程部署到執行階段：

![](~@plugins/Node-RED/NodeRED_deploy_button.png)

### 除錯控制台(Debug Console)

是右側側邊欄的一部分，提供以下內容：由除錯節點所發送消息的結構化視圖，使探查執行性能變得更加容易。

除每條訊息外，除錯側邊欄還包含有關接收訊息的時間以及除錯訊息的來源節點資訊。點擊來源節點ID將在工作區中顯示該節點。

::: tip
### NodeRED 文件

您可以在Node-RED的官方網站上找到有關使用此工具的其他文件： [https://nodered.org/docs/user-guide/editor/workspace/](https://nodered.org/docs/user-guide/editor/workspace/)
:::

## 擴充元件設定

在本節中，介紹了設定Node-RED擴充元件與Thinger.io伺服器一起使用需要遵循的步驟。

在Thinger.io Platform中安裝Node-RED擴充元件時，安裝管理器會將Thinger.io伺服器設定為Node-RED通訊的代理伺服器，但是在該擴充元件的首次啟動期間，必須設定擴充元件節點將要使用的特定伺服器實例。

要進行此設定，只需打開任何Thinger.io節點屬性表單，然後點擊末端一個名為**Server**的項目，點擊"編輯"按鈕，打開Thinger-Server設定選單。

![](~@plugins/Node-RED/nodeConfiguration.png)

然後，您可以填充將要用於接收您的Node-RED請求的Thinger.io實例的伺服器憑證。如果您想使用與託管擴充元件相同的伺服器，則只需在"Host"框中引入`$(THINGER_HOST)`，在"Token"框中引入`$(THINGER_TOKEN_NODE_RED_PLUGIN)`，接著可以關閉SSL通訊，因為所有訊息都將在同一台電腦上執行。

![](~@plugins/Node-RED/server-configuration.png)

::: warning
請注意，如果您想使用其他Thinger.io伺服器，或者您不是通過擴充元件運行Node-RED，則必須在"Host"框中 **加入其URL或IP位址** ，並且在"Token"框中使用具有 **Admin-Access 特權的 Thinger.io 存取令牌** ，在這種情況下，最好使用SSL。
:::

## Thinger.io 節點

如開始所述，此擴充元件有兩個目的：讓與Thinger.io IoT伺服器一起託管Node-RED伺服器實例，通過包含一組自定義節點來提高其整合度，從而簡化自Thinger.io IoT裝置提取數據或調用其他平台功能的過程。下一個列表包含每個節點及其屬性設定的完整描述：

###  Device Read
![](~@plugins/Node-RED/device-read-node.png)

這是一個 **Function** 節點，當注入節點需要時可從指定的Thinger.io裝置資源中檢索數據。它在Node-RED中設計以採樣間隔獲取裝置中的數據時非常有用。 

要設定此節點，只需在節點參數表單中包含`Device ID`和`Resource Name`即可。此節點的輸入是觸發事件，輸出將是帶有裝置資源變數的JSON格式訊息。

### Device Stream
![](~@plugins/Node-RED/device-stream-node.png)

這是一個 **Injection** 節點，它以指定的固定間隔（以秒為單位）自特定的Thinger.io裝置資源中檢索數據並傳入屬性表單。

要設定此節點，只需在節點參數表單中包含`Device ID`和`Resource Name`即可。此節點的輸出是帶有在屬性表單中指定的即時裝置資源數據的JSON格式訊息。

### Endpoint Call
![](~@plugins/Node-RED/nodeendpoint.png)

這是一個 **Output**節點，用於執行調用Thinger.io端點設定檔。它能夠接收可以在端點中引入的JSON，以便在電子郵件中使用該數據或發送給第三方，因此用於建立通知或將IoT項目與其他系統整合非常有用。  

該節點的設定僅需要引入`Endpoint ID`，但是對輸入的json進行適當的管理以傳送正確的數據非常重要。強烈建議使用"Change"節點過濾JSON密鑰，並使用 "Debug"節點檢查結果，以確保我們正在傳送的數據。

### Bucket Write
![](~@plugins/Node-RED/nodebucket.png)

這是一個 **Output** 節點，用於將數據儲存到Thinger.io數據儲存桶中。它能夠從Node-RED流程接收JSON並自動在Bucket中建立一個條目，因此對於將實現可縮放數據儲存的任何項目都非常有用。

該節點的設定僅需要引入`Bucket ID`，但是對輸入的json進行適當的管理以傳送正確的數據非常重要。強烈建議使用"Change"節點過濾JSON密鑰，並使用 "Debug"節點檢查結果，以確保我們正在傳送的數據。


### Device Write
![](~@plugins/Node-RED/devicewrite.png)

這是一個 **Output**節點，用於將數據傳送到與Thinger.io連接的裝置。它能夠從Node-RED流程接收JSON，並自動將其即時發送到其他裝置。

這個節點的設定僅需要引入 `Device ID` 和 `Resource ID`，但是對輸入的json進行適當的管理以傳送正確的數據非常重要。強烈建議使用"Change"節點過濾JSON密鑰，並使用 "Debug"節點檢查結果，以確保我們正在傳送的數據。。

### Server Events
![](~@plugins/Node-RED/serverevent.png)

這是一個**Inject**節點，允許即時觸發Thinger.io IoT 伺服器中發生的任何事件，包括：

1.儲存桶寫入
2.裝置狀態更改
3.裝置回調被調用
4.裝置屬性更新
5.裝置位置更新
6.端點被調用

每種類型的設定都需要包括要監控的元素ID。也可以將ID字段保留為空以監視每個元素。

當這些事件中的任何一個觸發時，該節點就可以在流程中注入JSON，該JSON具有已生成事件的儲存桶，裝置或端點的ID以及相關數據。

## 有用的流程範例

在本節中，您可以找到我們自己的說明書，其中包含一些有用的流程，您可以使用這些手冊從此整合的擴充元件中獲得最大的效益。

::::: tabs type:card
:::: tab 裝置連線中斷警報 lazy
使用伺服器事件節點的"Device Status Change"屬性，可以檢測到IoT網絡中任何裝置的中斷連線，並在Node-RED中執行流程以使用例如調用電子郵件端點來傳送通知。
::: tip
[在此處了解如何建立電子郵件端點。](../console/endpoints.html#%E9%9B%BB%E5%AD%90%E9%83%B5%E4%BB%B6%E7%AB%AF%E9%BB%9E)
:::

下一個流程使用兩個Thinger.io節點，第一個在裝置與伺服器中斷連線時觸發，該事件將產生包含裝置ID、狀態和變更時間的時間戳的JSON格式訊息。第二個節點允許調用Endpoint設定檔以發送帶有附加裝置資訊JSON的警報，因此可以自定義訊息以輕鬆識別問題。

![](~@plugins/Node-RED/Device_Disconnection_Alert.png)

使用這個JSON可以將此流程輕易的匯入到您使用的Node-RED工作區：

```
[{"id":"d577ba5d.a271b8","type":"tab","label":"Flow 1","disabled":false,"info":""},{"id":"b5b501a2.a5287","type":"server-events","z":"d577ba5d.a271b8","name":"","event":"device_state_change","bucket":"","device":"","endpoint":[{"id":"d577ba5d.a271b8","type":"tab","label":"Flow 1","disabled":false,"info":""},{"id":"b5b501a2.a5287","type":"server-events","z":"d577ba5d.a271b8","name":"","event":"device_state_change","bucket":"","device":"","endpoint":"","state":"disconnected","server":"4b6f387.dbcc5c8","x":231,"y":158.99999809265137,"wires":[["6fd24968.0dc1b8"]]},{"id":"6fd24968.0dc1b8","type":"endpoint-call","z":"d577ba5d.a271b8","name":"","endpoint":"DisconnectionAlert","server":"4b6f387.dbcc5c8","x":481,"y":158.99999809265137,"wires":[]},{"id":"4b6f387.dbcc5c8","type":"thinger-server","z":"","host":"$(THINGER_HOST)","name":"","ssl":true}]","state":"","server":"4b6f387.dbcc5c8","x":231,"y":158.99999809265137,"wires":[["6fd24968.0dc1b8"]]},{"id":"6fd24968.0dc1b8","type":"endpoint-call","z":"d577ba5d.a271b8","name":"","endpoint":"DisconnectionAlert","server":"4b6f387.dbcc5c8","x":481,"y":158.99999809265137,"wires":[]},{"id":"4b6f387.dbcc5c8","type":"thinger-server","z":"","host":"$(THINGER_HOST)","name":"","ssl":true}]
```

需要注意的是，為了監督我們的網絡中的每個裝置的狀態，因此伺服器事件節點的`裝置ID`參數為空。該節點下的綠色指示燈表示Node-RED與Thinger.io伺服器之間的連接狀態。
::::

:::: tab MQTT 到 Thinger.io lazy
MQTT是IoT中的擴展通訊協議，其執行在TCP/IP協議上。它被設計成用於連接需要"小型程式碼"或網絡頻寬受限的遠端位置。下一個流程允許從NodeRED MQTT Server託管的裝置以REST API回調的Thinger.io HTTP裝置發送數據，以使用Thinger.io的功能儲存、分析並顯示資訊。 

::: tip
[在此處了解如何使用Thinger.io HTTP裝置回調](../devices/http-devices.md)
:::

![MQTT to Thinger.io interface flow](~@plugins/Node-RED/MQTT_flow.png)

使用這個JSON可以將此流程輕易的匯入到您使用的Node-RED工作區：

```
[{"id":"a3d8dc1f.2ef57","type":"tab","label":"MQTT to Thinger.io","disabled":false,"info":""},{"id":"ce84849f.8d4278","type":"mqtt in","z":"a3d8dc1f.2ef57","name":"MQTT Device","topic":"Device","qos":"2","datatype":"json","broker":"","x":193.0000114440918,"y":139.99999332427979,"wires":[["af229fc2.2759a"]]},{"id":"af229fc2.2759a","type":"function","z":"a3d8dc1f.2ef57","name":"Json Creator","func":"msg.payload = {\"temperatura1\":msg.payload};\nreturn msg;","outputs":1,"noerr":0,"x":352.9999771118164,"y":139.99999332427979,"wires":[["157f8686.482779"]]},{"id":"157f8686.482779","type":"http request","z":"a3d8dc1f.2ef57","name":"","method":"POST","ret":"txt","paytoqs":false,"url":"https://<SERVER_ID>.do.thinger.io/v3/users/<USERNAME>/devices/<DEVICE_ID>/callback/data","tls":"","proxy":"","authType":"bearer","x":524.9999084472656,"y":138.9999885559082,"wires":[["da89c2c1.ce839"]]},{"id":"da89c2c1.ce839","type":"debug","z":"a3d8dc1f.2ef57","name":"Check Result","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","x":694.9999237060547,"y":138.99999618530273,"wires":[]}]
```

請注意，他是一個簡單的範例，僅從一個MQTT裝置檢索數據，但它可以建立複雜的整合。
::::

:::: tab GPS 地理圍欄 lazy
地理圍欄是一種有趣的IoT應用案例，在資產管理、車隊或包裹追蹤中有許多應用。下一個流程顯示如何監視每個裝置的位置，以在裝置離開地理圍欄節點指定的區域時建立警報。
![](~@plugins/Node-RED/Geofences.png)

通過"device\_location"屬性建立此整合，可以非常簡單的方式整合任何類型的裝置，包括Thinger.io軟體客戶端， Sigfox，TTN甚至HTTP裝置。

::: tip
[在此處了解如何建立電子郵件端點。](../console/endpoints.html#%E9%9B%BB%E5%AD%90%E9%83%B5%E4%BB%B6%E7%AB%AF%E9%BB%9E)
:::

使用這個JSON可以將此流程輕易的匯入到您使用的Node-RED工作區：

```
[{"id":"59de004e.ca5eb","type":"geofence","z":"d644cd0f.0093c","name":"","mode":"circle","inside":"false","rad":146402.02859820635,"points":[],"centre":{"latitude":40.636101528180916,"longitude":-4.011267721652985},"x":357.01296615600586,"y":209.84895133972168,"wires":[["c0dd553b.456428"]]}]
```
::::

:::: tab 調整傳入數據 lazy
::: danger
This is work in progress, sorry about the inconveniences 
:::
::::
:::::