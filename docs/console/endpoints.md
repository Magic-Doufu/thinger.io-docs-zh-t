# 端點(Endpoints)

>端點是服務，程序或其他目標的進入點。因此在Thinger.io中，端點可以定義為目標被裝置調用以執行任何操作，例如發送電子郵件，發送SMS，調用REST API，與IFTTT互動，從不同的帳戶調用裝置，或調用其他任何HTTP端點。

在微控制器中，直接存取這些服務可能很複雜，並且在裝置中需要更多頻寬。通過端點，Thinger.io可以處理裝置請求的端點調用，通過使用ID啟動它們並傳遞所需的任何資訊。它還增加了一些彈性，因為端點請求可以根據需要進行動態更改，而不更動裝置中部署的程式。

## 建立端點

要管理所有端點，您需要點擊選單中的`Endpoints`進行存取：

![](~@cloud/MenuEndpoints.jpg)

然後點擊`Add Endpoint`按鈕，該按鈕將打開一個新界面以輸入端點詳細資訊，如以下畫面截圖所示：

![](~@cloud/AddEndpoint.png)

還有設定必要的參數：

* **Endpoint Id**: 端點的唯一ID（裝置必須使用此ID來啟動端點）。
* **Endpoint Description**: 在這裡填寫更多有關該端點的細節描述。
* **Endpoint Type**: 定義端點類型，根據所選類型，端點將顯示不同的內容。在以下部分中描述了其中一些類型。

## 電子郵件端點

電子郵件端點允許從您的裝置發送電子郵件。您可以定義目標電子郵件地址，主旨和撰寫電子郵件內文。

可設定的參數如下：

* **Email Address**: 郵件的目標電子郵件地址。
* **Email Subject**: 電子郵件主旨。
* **Email Body**: 可自定義電子郵件內文，內文可以是包含向您的裝置發送數據的普通JSON文件，也可以是包含從您的裝置收集的資訊。

在下面的畫面截圖中，有一個電子郵件端點範例，其中包含一些文字和變數，這些文字和變數在裝置調用端點時填充裝置回報的目前溫度和濕度。請注意，`temperature`和`humidity`變數在雙括號內`{{}}`，所以端點將預期會得到這些資訊來完成主體。在下文中，有一些程式範例調用此端點。

![](~@cloud/EmailEndpoint.png)

有關如何調用端點可參考[此文檔](/thinger.io/coding/#調用端點)基本上需要使用`call_endpoint`方法調用端點，其需要端點ID，在此範例中為`ExampleEmail`，並且要將選擇的數據以`pson`文檔發送到端點，此處的`pson`文檔非常類似於JSON，有兩個鍵(key)分別命名為`temperature`與`humidity`分別儲存DHT傳感器的讀數。以下將示範調用端點。

```cpp
pson data;
data["temperature"] = dht.readTemperature();
data["humidity"] = dht.readHumidity();
thing.call_endpoint("ExampleEmail", data);
```

**注意**: 如果要在電子郵件正文中包含單個值，則可以使用不帶任何鍵的雙括號`{{}}`，並在`pson`使用單個值從裝置發送文檔。如以下結構：

```
Temperature is: {{}} ºC
```

可以在裝置中調用此程式進行填充：

```cpp
pson data = dht.readTemperature();
thing.call_endpoint("ExampleEmail", data);
```

## HTTP 端點

HTTP 端點是一種通用類型的端點，可用於與其他 Web 服務或 Web 應用程式進行互動。因此，可以為此端點發出的任何 HTTP 請求設定方法(method)，URL，標頭和內文。

可設定的參數如下：

* **Request URL**: 設定方法（GET，POST，PUT，PATCH或DELETE）和欲請求的URL。
* **Request Headers**: 可以向請求新增標頭，這對於新增授權、暫存控制、設定內容類型等非常有用。
* **Request Body**: 內文可以是具有特定內容的自定義內文，也可以是具有裝置發送的資訊的 JSON payload。
在自定義正文中，可以新增自定義變數，如電子郵件範例中所示。這樣，就可以建立不同格式的內容，如XML，SOAP等（請記得在這種情況下新增適當的內容類型\(content-type\)）。

![](~@cloud/HTTPEndpoint.png)