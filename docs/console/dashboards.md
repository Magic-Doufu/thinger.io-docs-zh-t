# 儀表板(DASHBOARD)

儀表板是一個圖形使用者界面，能將您的資訊以不同的圖形和圖表顯示。您可以在儀表板中使用不同的小工具，設定其佈局，維度，顏色和數據源，以便為您的業務或流程產生有用的資訊。

儀表板可以從您的裝置**即時顯示資訊**（使用伺服器上的Websockets達到最小延遲），或使用定期輪詢的數據儲存桶中存儲的歷史資訊。您可以單獨為每個儀表板視窗小工具設定數據源。對於連接到平台的裝置，甚至可以動態地設定每個資源的採樣間隔，即在定義為回報傳感器數值的資源中，它將允許調整其物理採樣間隔和通過線路的傳輸。儀表板不僅僅用於顯示數據，還可以對連接的裝置**即時操作**，您可以使用一些控制小工具，如開/關值或滑桿。

這是一個範例儀表板，其中定義了一些小工具，例如時序圖，甜甜圈圖，地圖或數值，您還可以使用其他許多的小工具。

![](https://discoursefiles.s3-eu-west-1.amazonaws.com/original/1X/c05197985d9ee92a9e12aaa71ab7508682bc3fbc.gif)

準備好建立您獨特的儀表板了嗎？

## 建立儀表板

要管理儀表板，必須通過點擊`Dashboards`選單項來存取該部分：

![](~@cloud/MenuDashboards.jpg)

然後點擊`Add Dashboard`按鈕將打開新界面，以輸入儀表板詳細資訊，如以下畫面截圖所示：

![](~@cloud/CreateDashboard.png)

這裡有一些必須設定的參數：

* **Dashboard Id**: 儀表板的唯一ID。
* **Dashboard name**: 儀表板的代稱，可以比其ID更友善的方式填寫。
* **Dashboard description**: 在此填寫您需要為儀表板保留的任何說明或詳細資訊。

完成此過程後，即可存取新的儀表板，預設情況下該儀表板為空的。

## 編輯儀表板

預設情況下，儀表板以檢視模式顯示，您無法在其中修改或設定儀表板。通過點擊儀表板的右上方開關，可以輕鬆啟用編輯模式。每當需要新增，移動或調整視窗小工具時，都要先啟用編輯模式。編輯模式下可支援共享儀表板的設定。

![](~@cloud/emptyDashboard.png)

## 新增顯示小工具

在儀表板中啟用編輯模式後，將出現一個名為`Add Widget`的新按鈕。點擊它將顯示一個彈出視窗，可以在儀表板中選擇要新增的顯示小工具類型。有不同的小工具用於顯示資訊或控制連接的裝置，如下圖所示：

![](~@cloud/widgetTypes.png)

以下小節介紹了每種視窗小工具類型的不同參數。

### 時序圖表(Time Series Chart)

時序圖表是可以隨時間顯示值的圖表。也就是說，在需要顯示時序數據時，例如隨時間變化的溫度變數，這非常有用。可以在同一圖表中繪製單個或多個變數。此小工具的初始設定如下圖所示：

![](~@cloud/TimeSeriesChart.png)

可設定的參數如下：

![](~@cloud/TimeSeriesChartWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Chart Input**: 設定將值提供何種值給時間序列圖表。有`From device`或`From data bucket`兩種選項。
  * **From Device**: 使用此選項，必須選擇一個裝置（必須已連接才可提供資訊）並指定要繪製的目標資源。下圖是從裝置中選擇裝置`deviceA`和資源`millis`的範例。請注意，當從裝置提供時間序列視窗小工具時，如果關閉或刷新儀表板，它將不會保留資訊，因為它只是從您的裝置到儀表板的即時數據。您可以在兩種不同的刷新模式之間進行選擇，例如以不同的間隔採樣（這將會在線上完成刷新），或者由裝置發起圖表刷新。

  * **From Data Bucket**: 使用此選項，視窗小工具將從指定的數據儲存桶中取得歷史資訊以在其上進行繪製。因此，只需選擇在您的帳戶中建立的數據儲存桶ID即可。如果數據儲存桶包含了多個變數，則允許選擇要繪製的變數，如下圖所示。從數據儲存桶中選擇資訊時，您需要建立要顯示的數據時間範圍，可以相對於目前時間，或兩個日期之間的絕對時間段。

![](~@cloud/dataSource.png)

* **Options**: 可以設定一些與圖形有關的功能，如填充、長條圖、軸等。
* **Chart Color**: 對於從device或data bucket中選擇的數據，可以設定每個序列的顏色。根據資源中可用的資訊，它將僅顯示一個可設定的顏色，或每個序列的顏色，如下截圖。

![](~@cloud/multipleVariable.png)

* **資料匯集(Data Aggregation)**: 

當數據點很多時，直接從存儲桶中顯示原始數據可能會比較棘手，尤其是在測量值非常嘈雜或不規則的情況下。
此功能允許使用不同的統計方法匯集數據，例如中位數、均值、最小值或最大值並提供每個週期的數據點計數及計算總結。
通過使用小工具設定中的下一個表單頁面輸入，以及使用每個時序圖小工具上右上角的參數，可以聚合五分鐘到一周的時間間隔中的數據。

![](~@cloud/IoT-data-aggregation.png)

下圖展示了使用四種使用不同算法匯集出的同一採樣間隔的數據集：

![](~@cloud/IoT-data-aggregation-after.png)

::: warning
請注意，只有在具有**InfluxDB** 的"私有伺服器"中，才能使用**Data Aggregation**系統。
:::

### 指針表(Tachometer Chart)

這是一個相當直觀的小工具，允許以傳統的"指針表"表示形式顯示裝置數據，可自定義不同的數值範圍以及搭配顏色標記，使其令人一目了然從而精確/簡化原有操作。

![](~@cloud/IoT-tachometer.png)

可設定參數如下：

![](~@cloud/IoT-tachometer-configure.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\)。該小工具具有與以下參數有關的特殊行為。 按下綠色的"+"按鈕，可以根據即時顯示的值顯示不同的背景顏色：

![](~@cloud/IoT-tachometer-backcolor.png)

圖片為一個當量測到的變數達到危險壓力值，背景將變為紅色的示範。因此，如果您的產品中沒有任何自動系統，此工具將協助您更容易識別和管理事件。

![](~@cloud/IoT-tachometer-chart-input.png)

* **Chart Input**: 設定如何將值輸入指針表。可以從已連接的**裝置**或**數據桶**。
  * **From Device Resource**: 使用此選項，必須選擇一個裝置（該裝置必須連接上系統提供資源），並指定要使用的資源。
  * **From Device Property:** 此選項允許從裝置屬性中檢索數據，這對於顯示裝置設定數據非常有用，同時也是顯示來自HTTP裝置的即時（或最後收到的）數據的更好方法。
  * **From Data Bucket**: 使用此選項，視窗小工具將從指定的數據儲存桶中取得歷史資訊以在其上進行繪製。因此，只需選擇在您的帳戶中建立的數據儲存桶ID即可。如果數據儲存桶包含了多個變數，則允許選擇要繪製的變數，如下圖所示。從數據儲存桶中選擇資訊時，您需要建立要顯示的數據時間範圍，可以相對於目前時間，或兩個日期之間的絕對時間段。
  * **Manual Data**: 該選項允許您隨時手動設定輸入值對小工具行為進行測試。

最後一個選項卡包含所有有關顯示的選項。這可能是Thinger.io平台中最可自定義的小工具，它允許選擇很多不同的參數，如下圖所示：

![](~@cloud/IoT-tachometer-display-option.png)

* **Display options:**
  * **Units**: 用於顯示數據單位的可選資訊，例如ºC。
  * **Value Ranges**: 此參數設定將在圖表上顯示的數據整體範圍，並且還允許加入可以用不同顏色設定的子範圍，以使其更直覺。
  * **Plate Color**: 設定背景的顏色。
  * **Text Color**: 設定文字顏色。
  * **Tick Color**: 設定分區刻度的顏色。
  * **Major Ticks**: 設定每個刻度的範圍。
  * **Show Value**: 決定在數字顯示框中顯示或隱藏數值。

### 虛擬LED(Virtual LED)

使用LED指示器是在電子項目中建立簡單圖形界面以表示系統狀態，警報等的常用方法。Thinger.io平台中包含此小工具的目的相同，因此可以用於通過更改其顏色來顯示二進制狀態，通過設定閃爍行為來建立警報或通過使用多個顏色在一個RGB模擬中來顯示多個數據。

![](~@cloud/Virtual-LED.png)

通過三個步驟，可以用許多不同的方式使用此小工具。首先，在"小工具"選單選項卡中選擇"LED指示器"，然後指出：

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\)。

::: details 官方文件似乎有點問題
This widget has a particularity behavior in relation to this parameter. Pressing into the green "+" button, It is possible to select different background colors depending on the real time value that is being shown: 

Then, the Led indicator menu tab allows selecting the data source, that can be a connected device or a data bucket:

* **Chart Input**: Configure how to feed the values to the tachometer chart. It is possible to feed the information from a connected **device** or from a **data bucket**
  * **From Device Resource**: With this option it is necessary to select a device \(that must be connected to provide information\) and specify the resources to plot. The following figure is an example that is selecting the device `deviceA`, and the resource `millis` from the device. Notice that when a time series widget is feed from a device, it will not keep the information if the dashboard is closed or refreshed, as it is just real-time data from your device to your dashboard. You can also select between different refresh modes, like sampling at different intervals \(that can be updated online\), or the chart is updated by the device.
  * **From Device Property:** This option allows retrieving data from device properties, which is really useful to show device configuration data, but also is the better way to show real time \(or last received\) data from HTTP devices. 
  * **From Data Bucket**: With this option, the widget will take the information from a given bucket to plot the historic information on it. So, it is necessary to just select the bucket identifier created in your account. If the bucket is composed by multiple variables, it will allow selecting the variables to plot, like in the following picture. When the information is selected from the data bucket, you will require to establish a data timeframe to be displayed, that can be relative to the current time, or an absolute period between two dates.
  * **Manual Data**: It is always possible to manually introduce values in order to create simulate the behavior of the widget.
:::

最後，"Display Options"選項卡允許在以下參數中自定義led行為：

* **Led Size**: 設定led點像素的直徑。
* **Color**: 設定led預設顏色，以及允許通過按下右側的綠色"+"按鈕來建立顏色範圍。
  * **Color ranges**: 每次按下"+"按鈕時，都會包含一個新的顏色範圍，從而可以定義一個新的範圍以及當所選輸入值屬於該範圍時將顯示的顏色。 
  * **Blinking led option:** 當輸入達到文件設定的範圍時，右側開關可為LED加入指示燈閃爍行為。也可以通過按下LED小工具來關閉閃爍。

![](~@cloud/Virtual-LED-display-option.png)

### 環形圖(Donut Chart)

環形圖是可以顯示值的圖表，通常以圓整百分比的形式顯示。也就是說，當你知道變數只會在最大值和最小值之間變動時這非常有用。此小工具只能顯示單個變數，來源可以從裝置即時更新，也可以從數據儲存桶中更新。

![](~@cloud/DonutChart.png)

可設定的參數如下：

![](~@cloud/DonutChartWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Donut Value**: 設定饋送給圖表的值。可以以與時序圖類似的方式從連接的`device`或`data bucket`提供資訊。
* **Units**: 用於顯示數據單位的可選資訊，像是ºC.
* **Min Value**: 變數預期的最小值。
* **Max Value**: 變數預期的最大值。
* **Donut Color**: 環形圖內顯示的顏色。

### 進度條(Progressbar)

進度條是一個圖表，可以輕鬆地表示某個操作或過程的進度。也就是說，當您有任何流程需要長時間完成並且需要進行監控時這非常有用。這種小工具只能表示單個變數，既可以從裝置即時更新，也可以從數據儲存桶中更新。

![](~@cloud/ProgressBar.png)

可設定的參數如下：

![](~@cloud/ProgressbarWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Progressbar Value**: 設定如何提供進度條值。可以與時間序列圖類似的方式從連接的**device**或**data bucket**提供資訊。
* **Units**: 用於顯示數據單位的可選資訊，像是%。
* **Min Value**: 變數預期的最小值。
* **Max Value**: 變數預期的最大值。

### Google地圖(Google Maps)

此時，地圖可用於表示地圖中的單個位置。即時跟蹤裝置非常方便，因為圖表可以通過GPRS連接從連接的裝置即時提供。也可以從數據儲存桶中繪製位置，因此也可以跟蹤像Sigfox這樣的裝置。

![](~@cloud/GoogleMap.png)

以下是此小工具與連接裝置即時協作的範例：

 [![Real-Time GPS location over GPRS using IoT Solution](https://img.youtube.com/vi/3QDDOPMg22g/0.jpg)](https://www.youtube.com/watch?v=3QDDOPMg22g)

可設定的參數如下：

![](~@cloud/GoogleMapWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Location**: 設定如何在地圖中提供位置。可以從連接的**device**或**data bucket**中提供資訊。從數據儲存桶或裝置饋送繪圖(plot)時，所需的緯度和經度（以度為單位）應與數據儲存桶中或裝置資源中存在的變數進行匹配。

![](~@cloud/LocationValue.png)

* **Center**: 強制地圖自動保持在中心位置。

### Image/MJPEG

image / MJPEG小工具可用於表示靜態圖片，如商業Logo，或來自MJPEG源的即時串流，如監控鏡頭。要供給此小工具，必須使用image / MJPEG網址。

![](~@cloud/CameraMJPEG.png)

可設定的參數如下：

![](~@cloud/ImageWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Image Source**: 設定圖源是靜態圖片還是MJPEG串流。在這兩種情況下，都需要提供源URL，如下面的畫面截圖所示：

![](~@cloud/MJPEGCamera.png)

### Text/Value

text/value 小工具是一個有用的小工具，用於顯示任意數據，特別是無法用其他小工具表示的文字值。與其他小工具一樣，可以顯示來自連接的**device**或**data bucket**的數據。

![](~@cloud/TextValue.png)

可設定的參數如下：

![](~@cloud/TextWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Text Value**: 與其他小工具一樣，可以從連接的**device**中選擇資源，也可以從**data bucket**中選擇值。
* **Units**:用於顯示數據單位的可選資訊。
* **Text Color**: 設定文字顏色。

### 時鐘(Clock)

這是一個時鐘小工具，可以在本機時區或UTC時間中顯示目前時間，這在即時監視時非常有用。請注意，此視窗小工具僅從您的電腦取得目前時間。

![](~@cloud/Clock.png)

可設定的參數如下：

![](~@cloud/ClockWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Color**: 文字的顏色。
* **UTC**: 時鐘顯示UTC時間或本機時區時間。

## 新增控制小工具

在Thinger.io中，不僅可以在儀表板中顯示資訊，還可以即時控制裝置。在本節中描述了一些可用於控制連接裝置的可用小工具。

### 開關(On/Off State)

On / Off小工具允許控制連接裝置的布爾狀態，例如打開/關閉燈，電機，繼電器或任何其他元件。裝置應該披露一個布爾輸入，就像控制led的那些例子一樣。然後將資源映射到此小工具即可即時更改裝置狀態。如果正確定義了[輸入資源屬性](/coding.html#%E6%96%B0%E5%A2%9E%E8%B3%87%E6%BA%90)，這個小工具也能顯示目前裝置狀態。

![](~@cloud/SwitchButton.png)

可設定的參數如下：

![](~@cloud/BooleanWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Device Resource**: 指定要控制的特定裝置和資源。使用連接的裝置進行簡單的設定，您可以自動的選擇裝置和資源。

![](~@cloud/DeviceResource.png)

該小工具有兩種不同的外觀，可以在**Switch Style**參數中指定：
* **Switch**是帶有少量不可設定開關的標準類型。
* **Button**則是改進後的樣式，可以設定用不同的顏色和Logo。選擇此選項時，將顯示下一個參數：

![](~@cloud/Button-option.png)

* **On Color**: 當此裝置跟隨的資源值為true時顯示的顏色。
* **Off Color**: 當此裝置跟隨的資源值為false時顯示的顏色。
* **Icon**: 此按鈕能夠顯示favicon庫或任何其他圖標庫URL中的可自定義圖標。
* **Icon Color**: 圖標顏色也可以使用十六進制值進行配置。請注意，兩個按鈕狀態都有不同的顏色選項，因此您可以根據需要自定義它。

  ![](~@cloud/Buttons-display.png)

### 滑桿(slider)

slider小工具允許控制已連接裝置的數字狀態，例如設定閾值，目標溫度或可能遠端控制的任何其他內部裝置狀態。裝置應披露數字輸入，然後將資源映射到此小工具，可以即時更改目標值。如果正確定義了[輸入資源屬性](/coding.html#%E6%96%B0%E5%A2%9E%E8%B3%87%E6%BA%90)，這個小工具也能顯示目前裝置狀態。

![](~@cloud/Slider.png)

可設定的參數如下：

![](~@cloud/SliderWidget.png)

* **Title**: 小工具的標題。
* **Subtitle**: 小工具的副標題。
* **Background**: 可供選擇的小工具背景顏色 \(預設是白色的\).
* **Device Resource**: 確定要控制的特定設備和資源。使用連接的設備進行簡單設定，因為您可以自動選擇設備和資源。
* **Min Value**: 滑桿的最小值。
* **Max Value**: 滑桿的最大值。
* **Step Width**: 滑桿的精確度。

## 共享儀表板

預設情況下，任何儀表板對帳戶所有者都是私有的。但是可以共享儀表板給其他人，使其可以存取您的資訊。要共享儀表板，只需進入儀表板的設定並啟用`Share`開關即可。啟用儀表板共享後，將產生一個可以公開共享的URL。

**Note:** 產生的授權（附加在URL末尾）可用於部分存取您的資源，例如用於提供圖表的設備或數據存儲區。檢視產生的存取令牌以獲取更多詳細資訊

**Note:** 如果通過新增新數據源（設備或數據存儲區）來更改儀表板，則必須禁用並重新啟用儀表板共享以更新授權。出於安全原因，新數據源不會自動共享。

![](~@cloud/ShareDashboard.png)