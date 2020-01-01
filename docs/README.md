# 總覽

::: tip
本頁面是基於[Thinger.io說明文件](https://docs.thinger.io)進行翻譯的，內容進度或多或少會有不同。確切取決於官方文件進度或翻譯進度。
本頁面採用[vuepress](https://vuepress.vuejs.org/)進行建置。
翻譯的檔案放置於[這個REPO](https://github.com/Magic-Doufu/thinger.io-docs-zh-t)，官方原文件案則位於[此](https://github.com/thinger-io/Docs)處。
:::

>Thinger.io 是物聯網的開源平台。該文件可幫助您了解如何在幾分鐘內使用每個組件建立出色的項目。

## Thinger.io 是什麼?

Thinger.io為一開源物聯網平台專案，它提供了每個原型設計所需的工具，可以以非常簡單的方式對連接的產品進行原型設計，擴展和管理。我們的目標是使物聯網的使用在全世界被平民化，並簡化大型專案開發流程。
其提供了控制面板、資料可視化處理、Google map、資料串流、REST API、API Explorer、開發板框架等資源，並且整合Arduino IDE，讓創客與學生甚至非IT類業界人員皆可以快速上手。其開發框架只要開發板能夠支援Arduino IDE，幾乎都可以連上雲端平台。(但團隊仍建議ESP32，其性價比相對其他開發板高出許多。)

* **免費的雲端平台：** Thinger.io提供了學習與進行原型設計只有很少限制的終身免費帳戶，當產品準備好要拓展時即可快速大量部署。(大量部署非使用自己建立的平台則需要付費)
* **簡潔有力：** 只需要幾行程式即可連接裝置並開始使用我們基於Web的控制台讀取數據或控制其功能，從而能夠以簡單的方式連接和管理數千個裝置。
* **相容性佳：** 任何製造商的任何裝置都可以輕鬆地與Thinger.io基礎架構結合。
* **開源：** 大多數平台模組，程式庫和APP原始碼可在我們的github中找到，進行下載和修改的行為須遵循MIT授權條款。
* **高度個人化：** Thinger.io的前端平台允許使用個人的品牌顏色、標徽以及網域來個人化。

### Thinger.io 的主要功能

![](~@overview/thinger.io-platform-feature.png)

* **連接裝置：** Thinger.io 已經準備好與不同處理器、製造商、網路開發商所發行的裝置建立雙向通訊，包含使用 Sigfox 或 LoRaWAN 的裝置。
* **雙向的高效率通訊：** 平台允許您自數千個裝置中讀取即時數據，亦可以極低的延遲向其發送資料。此適用於自動控制項目或遠端控制系統。
* **蒐集裝置數據：** 只需幾次點擊即可快速建立數據儲存桶，以可擴展、高效且低成本的方式存儲IoT數據，還可以進行即時資料聚合。
* **視覺化即時或已存取的數據：** 透過我們強大的 Dashboard 功能，可以快速建立友善的數據可視化介面，並且在幾分鐘內與客戶共享。
* **致力於擴充性：** 可同時於平台上部署多個不同的插件建立可擴充的系統。
* **與第三方服務整合** 我們的開放式API可以讀取數據並與第三方網路平台與自定義程式共享。

您準備好開始建立物聯網項目了嗎？ [**在此建立您的免費帳戶**](https://console.thinger.io/#/signup) 然後透過以下教學學習這項技術的所有內容。

## 快速入門指南

要開始使用Thinger.io，只需 [**在我們的雲端平台上建立一個免費帳戶**](https://console.thinger.io/#/signup) ，然後按照以下步驟進行設定，即可連接您的第一個IoT裝置。

### 1. 建立裝置

使用 `Devices` 選單選項卡，只需點擊 `New device` 按鈕，然後在表格中填寫所需的 `device ID(裝置ID)`、`description(說明)` 和 `Credentials(憑證)`。

![](~@overview/guideDevice.png)

### 2. 連接裝置
在 Thinger.io 雲端平台中建立裝置後，就可以在硬體裝置中進行設定了。實際上有許多不同的硬體與通訊技術，其中Thinger.io平台可以使用的類型如下：

:::: tabs type:card
::: tab Arduino/Linux 裝置

1. 將Thinger.io程式庫安裝到Arduino IDE中
2. 檢視「文件>範例程式>Thinger.io」中相對應板子的範例程式。
3. 編輯範例程式中`USERNAME`、`DEVICE_ID`、`DEVICE_CREDENTIAL`的部分以符合您註冊時的資訊。如您使用 WiFi，則需要編輯`SSID`等設定以符合您網路環境的設定。如圖所示：

![](~@overview/editInfo.png)

可以修改此範例，以使裝置行為適應每個用例。 修改原始碼後，只需上傳草稿碼並等待裝置連接即可。

::: tip 在下一部分中找到有關Thinger.io裝置的額外資訊：
1. [**與 Arduino 和 Linux 相容的裝置**](/devices/)
2. [**從零開始： Thinger.io 韌體程式設計指南**](/coding/)
3. **連接故障排除指南**

:::

::: tab HTTP 裝置
1. 建立裝置時，將`Device Type`選擇為`HTTP Device`。
2. 切換至`Device`Dashboard，建立一個HTTP裝置回調(Callback)。
3. 建立裝置存取令牌以授權裝置向平台傳遞資料。
4. 將HTTP請求 \(API + TOKEN\) 引入裝置程式或第三方平台，即可開始向Thinger.io傳遞資料。
::: tip 
[有關HTTP裝置的詳細教學**在這裡！**](/devices/http-devices)

:::

::: tab Sigfox / LoRaWAN 裝置
任何單獨的Sigfox或LoraWAN裝置只需要將HTTP裝置回調設定到其回調管理器中，都可以使用我們的API作為HTTP裝置進行結合，但如果要使用這些技術建立TTN(物聯網間網路)，則最好使用我們發布的插件：

<linkref title="Sigfox" path="/plugins/sigfox"></linkref>
<linkref title="ThingsNetwork" path="/plugins/the-things-network"></linkref>

:::

::::

---

通過選單中的`Device`頁面可以顯示完整的裝置列表。該介面允許管理裝置並檢查其連接狀態並通過點擊每個`Device ID`來存取`Device Dashboard`。


### 3.管理裝置與數據

每個裝置都可以通過`Device Dashboard`進行管理。該介面可以顯示連接狀態與數據，還可以使用基於裝置原始資料的方式檢查`Device API`。

![](~@overview/guideDeviceAPI.png)

Thinger.io提供了雙向通訊，因此可以使用 **devices output resources \(裝置輸出資源\)** 將數據讀取至伺服器中，也可以將資訊傳遞到 **devices input resources \(裝置輸入資源\)** 裡。這兩種資源在`Device API(裝置 API)`中皆可表示。

![在API檢測器中的輸入 &amp; 輸出資源](~@overview/guideDeviceAPIExplorer.png)

### 4.存儲、顯示和共享數據

Thinger.io提供了三個用於處理裝置數據的基本工具，這些工具是創建任何IoT項目的基礎物件，接下來將介紹每個工具的特性。

:::: tabs type:card
::: tab 數據桶(Data Buckets)
以可拓展的方式 **存儲裝置數據** ，可以設定不同的採樣間隔或以串流形式存取。
:::

::: tab 儀表板(Dashboards)
具有 **自定義小工具(customizable widgets)** 的儀表板，可在幾分鐘內使用拖放方式建立儀錶板，並用以顯示即時與已存儲的數據。
:::

<!--::: tab 端點(Endpoints)

:::-->

::: tab 存取令牌(Access Tockens)
儀表板、數據儲存桶或裝置資源都可使用存取令牌和我們的API輕鬆與第三方服務共享。
:::

::::

---

### 5.擴充 Thinger.io

Thinger.io平台可以使用**插件(plugin)**來擴充其他網際網路服務，只要進入我們的 Marketplace 並選擇它。

<linkref title="插件" path="/plugins/"></linkref>

## [相容裝置](/devices/)

Thinger.io本身與硬體並無直接關聯，所以其允許連接基於任何製造商、硬體架構、網路技術或作業系統的電子裝置。此節內容為使用我們提供的程式庫或使用Thinger.io API與HTTP查詢發送數據來解釋如何連接常見的裝置。

<linkref title="裝置" path="/devices/"></linkref>

## [客戶端程式設計](/coding/)

![](~@overview/coding.png)

本節將介紹如何向裝置新增不同的功能，以公開資源，調用端點或讀取基於Websocket實現的即時數據串流。

<linkref title="程式設計" path="/coding/"></linkref>


## [雲端控制台(Cloud Console)](/console/)

雲端控制台與管理介面前端相關，旨在輕鬆管理您的裝置並在雲端中可視化數據。在本部分中，您將學習如何註冊裝置，建立即時儀表板，存取裝置API以及其他管理操作。

![](~@overview/console.png)

<linkref title="雲端控制台" path="/console/"></linkref>