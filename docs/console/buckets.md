# 資料儲存桶(Data buckets)

>數據存儲桶是一種虛擬儲存機制，您可以在其中保留時序資訊，例如隨時間變化的溫度或濕度。也可以使用它們存儲其他事件，例如移動偵測、車庫門打開、溫度警告等。儲存的資訊可在儀表板中進行繪製，或者以不同的格式匯出以進行離線處理。

## 建立儲存桶

要建立數據儲存桶，您需要點擊選單中的`Data Buckets`進行存取：

![](~@cloud/MenuBuckets.jpg)

要建立數據儲存桶，只需按下**Add Bucket**按鈕，它將顯示以下畫面：

![](~@cloud/AddBucket.jpg)

接著設定必要的參數：

* **Bucket Id**: 您的數據儲存桶的ID。
* **Bucket name**: 使用代稱來協助記憶數據儲存桶用途，例如`WeatherData`。
* **Bucket description**: 在這裡填寫更多細節描述，如室內溫度和濕度。
* **Enabled**: 可以啟用或禁用數據儲存桶寫入。將其打開即可啟用寫入。
* **Data source**:
  * **From Device Resource**: 這意味著它將從特定裝置資源（如溫度，運動等）獲取資訊。在此選項中，裝置應與伺服器保持連接。這個功能所提供的好處是：我們可以根據需要更改`Sampling Interval`選項設定採樣率，而無需更動裝置程式。

    ![](~@cloud/BucketTimeSample.png)

    **請記住** [此處](/coding.html#新增資源)更詳細地描述了如何在裝置中定義資源的過程，不過由DHT傳感器回報溫度和濕度的資源可以這樣寫：

    ```cpp
    // 在setup階段定義資源
    thing["TempHum"] >> [](pson &out){ 
      out["temperature"] = dht.readTemperature();
      out["humidity"] = dht.readHumidity();
    };
    ```

    也可以讓裝置在滿足特定條件時發起事件來串流傳輸資訊。在這種情況下，我們可以在設定數據儲存桶時使用`Update by Device`選項，並按照[此處](/coding.html#%E4%B8%B2%E6%B5%81%E5%AF%AB%E5%85%A5-streaming-resource-data)所述的傳輸串流資源。
    
    使用前面的`TempHum`範例資源，完成後會如下面的程式片段那樣。

    ```cpp
    void loop() {
      thing.handle();
      // 使用您個人的邏輯判斷何時進行串流
      if(requires_recording){
          thing.stream("TempHum");
      }
    }
    ```

    這樣，數據儲存桶就訂閱了裝置資源，並且在每次串流調用中都登錄了它的資訊。

  * **From Write Call**: 此選項將設定數據儲存桶為在預設情況不會記錄任何資訊的狀態。它會等待調用寫入函數，如像[這樣](http://docs.thinger.io/hardware/climaStick/#quickstart-examples-data-recording-using-sleep)從Arduino程式庫調用`write_bucket`方法或與 [Sigfox](/devices/sigfox.html#%E5%BB%BA%E7%AB%8B%E6%95%B8%E6%93%9A%E5%84%B2%E5%AD%98%E6%A1%B6) 一樣直接調用REST API。此功能允許從不同裝置寫入資料到同一數據儲存桶中，或者紀錄來自未與伺服器永久連接裝置的資訊(處於睡眠模式的裝置或使用Sigfox等其他技術的資訊)。

  以下是ESP8266裝置使用`write_bucket`功能將資訊寫入數據儲存桶的範例：

    ```cpp
    void setup() {
      // define the resource with temperature and humidity
      thing["TempHum"] >> [](pson &out){ 
        out["temperature"] = dht.readTemperature();
        out["humidity"] = dht.readHumidity();
      };
    }

    void loop() { 
      // handle connection
      thing.handle();
      // write to bucket BucketId the TempHum resource
      thing.write_bucket("BucketId", "TempHum");
      // sleep the device SLEEP_MS milliseconds
      ESP.deepSleep(SLEEP_MS*1000, WAKE_RF_DEFAULT); 
    }
    ```

## 檢視儲存桶數據

當設定了數據儲存桶並且開始記錄來自裝置或調用寫入的數據，它即在表中顯示資訊。每條記錄都包含伺服器中的UTC時間戳（但以雲端平台中設定的時區時間顯示）和記錄值。存儲在數據數據儲存桶中的值可以是單個值，也可以是任何其他JSON文件。如果是JSON文件，則由鍵值對組成，如前面的範例所示，它們將以表格格式顯示，就像在下面的畫面截圖中一樣。

![](~@cloud/IoTBucketData.png)

## 清除儲存桶數據

這個功能對於清除數據儲存桶資訊，而非刪除整個數據儲存桶並再次建立和設定它可能很有用。因此，您可以從數據儲存桶頁面輕鬆清除數據儲存桶或其中的一部分。在清除過程中，數據儲存桶仍然可以記錄裝置中的資訊。

![](~@cloud/Data-Bucket-Clear.png)

## 匯出儲存桶數據

可以不同的文件格式導出所有儲存的資訊，因此您可以離線處理數據，例如應用人工智慧、業務分析、大數據等。您可以存取數據儲存桶並設定匯出細節，比如選擇文件類型或匯出範圍。幾分鐘後，您將收到一封附檔包含您所需資料的電子郵件（預設情況下，雲端平台中的資料有效期為3個月）。

![](~@cloud/DowloadBucket.png)