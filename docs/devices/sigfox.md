# SIGFOX

![](~@sigfox/sigfox_thinger.png)

## 簡介

Sigfox是一家成立於2009年的法國公司，其建立無線網絡以連接電表、智慧手錶和洗衣機等低功耗物體，這些物體需要不斷的發射少量數據。Sigfox採用專有技術，使用工業、科學和醫療的ISM無線頻段進行通訊，該無線頻段在歐洲使用868MHz，在美國使用902MHz。它使用超窄頻技術，可以在極低電力消耗下覆蓋大範圍區域，也因此這種網路被稱為"低功率廣域網（LPWAN）"。該網路基於單跳(single-hop)星型拓撲，需要ISP承載其產生的流量。該訊號還可用於輕鬆覆蓋大面積區域與位於地下的物體。

Sigfox與LPWAN行業的許多公司合作，如德州儀器公司或Silicon Labs公司。ISM無線頻段支援雙向通訊。現有的Sigfox通訊標準**每天最多支援140個上傳訊息**，每個訊息可以承載**12字節**的payload（不包括訊息表頭和傳輸資訊）和每天最多4個下載訊息，每個訊息可以承載8個字節的 payload。如果您想了解有關Sigfox的更多詳細資訊，請造訪[Sigfox Developer Portal](http://makers.sigfox.com/about/)。

本文檔將介紹如何將SigFox裝置及其數據結合到Thinger.io平台。在第一步中，我們將回顧如何設定Thinger.io資源，然後在Sigfox方面，我們將設定與平台的通訊以推送我們的傳感器數據。

## 將Sigfox裝置與Thinger.io結合

此過程分為兩個部分，一方面，準備Thinger.io以從Sigfox接收數據，另一方面，配置Sigfox雲端回調，該回調將訊息發送回Thinger.io。在下一部分中，我們將從Thinger.io的步驟開始，對這兩個部分進行說明：

有兩種方法可以配置Thinger.io與Sigfox裝置一起使用。最好的選擇是部署`Sigfox插件`，該插件將提供管理與裝置自動設定功能，上傳/下載鏈路payload處理和裝置管理等進階功能，但是此選項僅適用於已付費訂閱的開發人員。Freemium使用者還是可以按照下面的"傳統結合"部分來結合Sigfox裝置：

### **進階結合 \(使用Sigfox插件\)**

{% page-ref page="../plugins/sigfox.md" %}

### 傳統結合 \(無插件\)

我們需要在Thinger.io帳戶中設定一些資源，例如，定義Sigfox數據的存儲位置，以及對Sigfox平台的存取以將數據存儲在我們的帳戶中。所需的步驟在以下小節中定義。

#### 建立數據儲存桶
數據儲存桶用於儲存從Sigfox裝置接收的資訊。因此我們需要建立一個數據儲存桶來存儲我們的Sigfox裝置中的資訊。我們可以使用一個數據儲存桶存儲來自多個裝置的數據，但最好是每個裝置使用一個數據儲存桶。這樣，我們就可以透過建立儀表板，顯示來自每個裝置或感測實體的儲存桶時間序列數據。

然後，打開雲控制台中的`Buckets`部分，並建立一個新的`Data Bucket`。我們需要填寫一些細節，例如：

1. `Bucket Id`, 您帳戶中的唯一儲存桶ID，稍後與Sigfox結合時使用。此範例中的ID將是`SmartEverything`。保留此ID，因為它將在Sigfox端使用。
2. `Bucket Name`, 比ID的更加易記的標示。
3. `Bucket Description`, 關於儲存桶的詳細說明。
4. `Enabled`, 此開關用於允許儲存桶寫入，必須打開。
5. `Data Source`, 需要設定為`From Write Call`，因為Sigfox裝置不會直接連接到平台，而是通過REST API接口推送數據。

![](~@sigfox/create_sigfox_bucket.png)

填寫表格後，只需點擊`Add Bucket`即可創建存儲桶。

#### 建立存取令牌

此時我們已經建立了一個數據儲存桶來存儲我們的Sigfox數據，與任何Thinger.io資源一樣，它們受我們的帳戶憑據保護。這樣，我們需要發出一個存取令牌，允許Sigfox後端與我們的數據儲存桶進行互動。在此範例中，我們將建立一個存取令牌，該令牌僅授予對我們的數據儲存桶的存取權限，並且只授予寫入操作權限。這樣，如果令牌以某種方式洩露，我們就不會向攻擊者公開其他資源。

打開雲控制台中的"存取令牌"部分，並建立一個新的存取令牌。我們需要一些細節，例如：

1. `Token Id`, 您帳戶中的唯一令牌標識符。
2. `Token Name`,  比ID的更加易記的標示。
3. `Enabled`, 必須打開以允許使用令牌。如果需要，可以隨時將其關閉。
4. `Token permissions`, 此設定為該令牌允許存取儲存桶資源的權限，`SmartEverything`在此例會使用到`WriteBucket`權限進行操作。

![](~@sigfox/create_sigfox_token.png)

填寫表單後，只需點擊"Add Bucket"即可建立令牌。此時將出現令牌值。在我們的例子中，產生的令牌如下。保留此令牌，因為它將在Sigfox端使用。

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJTbWFydEV2ZXJ5dGhpbmciLCJ1c3IiOiJhbHZhcm9sYiJ9.0Qb48c_ToBiIVcCOdvXU2Kn51mTnGLDcN44shVRzNls
```

## Sigfox 雲端設定

此時，我們已經完成在Thinger.io數據儲存桶上接收數據所需的一切。下一步是使用我們的令牌ID和我們生成的令牌設定Sigfox後端以將數據推送給Thinger.io平台。

### 建立 Sigfox 回調

現在，我們建立一個Sigfox回調(Callback)，將訊息從我們的Sigfox裝置推送到我們的Thinger.io數據儲存桶。在我們的範例中，回調是在Sigfox裝置通過網絡發送數據時調用的端點，因此我們將設定指向數據儲存桶的回調。

要在Sigfox中建立回調，請按照以下步驟操作：

1. 前往 [https://backend.sigfox.com](https://backend.sigfox.com) 並登錄您的帳戶。我們假設您已經在平台上註冊了您的裝置。
2. 點擊`Device Type`頂部的選項卡，然後點擊要設定的裝置類型名稱。或者，您可以切換到`Device`選項卡，然後點擊裝置的`Device type`。
3. 於左側選單點擊`Callbacks`，然後進行新增。

在此步驟中，您需要選擇要建立`Custom Callback`的埠口，因為我們需要調用Sigfox後端不直接支援的端點。

![](~@sigfox/create_sigfox_callback.png)

接著，我們需要設定回調以寫入我們的數據儲存桶。如果您想了解設定的外觀，請參考我們的截圖，你會在截圖中看到每個區域的詳細資訊。

![](~@sigfox/sigfox_callback.png)

我們的範例中的設定如下：

1. `Type` 為 `DATA` 與 `UPLINK`, 因為我們希望發送裝置中的數據。
2. `Channel` 類型是 `URL`，因為我們將調用HTTP端點。
3. `Send duplicate` 禁用以避免寫入不同基站收到的重複訊息。
4. `Custom payload config` 將完全取決於您的裝置發送的payload。在我們的例子中，我們的裝置將溫度和濕度發送為32位浮點數，因此我們將payload設定為 `temp::float:32:little-endian hum::float:32:little-endian`，其中我們將`temp`與`hum` 參數定義為小頭順序的32位浮點數。請注意，Sigfox每則訊息僅支援12字節的payload，因此您必須對此空間最佳化，例如，如果不需要達浮點數的精度，則將溫度和濕度作為整數發送。
5. `Url pattern` 必需根據您的Thinger.io使用者ID和我們的儲存桶名稱進行配置。
   * 格式應該是這樣的 `https://api.thinger.io/v1/users/{user_id}/buckets/{bucket_id}/data`. 
   * 你必須根據您的帳戶改變`{user_id}`與`{bucket_id}`。在我們的範例中，模式最終的url將是`https://api.thinger.io/v1/users/alvarolb/buckets/SmartEverything/data`.
   * 請注意，您還可以使用Sigfox變數來構建您的URL，即為了將來自每個裝置的數據存儲到不同的數據儲存桶，我們可以建立一個URL，如：`https://api.thinger.io/v1/users/alvarolb/buckets/{device}/data`. 
6. `HTTP Method` 應該設定為POST。
7. 我們必須在`Headers`中加入`Authorization`項目，其包含一個裝置令牌，以便對數據儲存桶寫入請求進行身份驗證。
   * 標頭名稱應為 `Authorization`
   * 其值應該是 `Bearer {access_token}`，且 `{access_token}` 為您在前一個章節中產生的令牌。
   * 在我們的例子中，我們的最終標頭值如下。注意`Bearer`和令牌之間的空格。

     ```
     Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJTbWFydEV2ZXJ5dGhpbmciLCJ1c3IiOiJhbHZhcm9sYiJ9.0Qb48c_ToBiIVcCOdvXU2Kn51mTnGLDcN44shVRzNls
     ```
8. 最後一步是設定`Body`和它的`Content type`。對於`Content type`，我們使用`application/json`，儲存桶可以存儲任意JSON數據。然後，`Body`將包含我們要以JSON格式格式化的所有資訊。在Sigfox中，您可以根據可用變數定義您的`Body`，這些變數由平臺定義（如裝置ID，連接品質或裝置位置），或由您的payload定義。在我們的例子中，我們定義了變數`temp`與`hum`並且將其包含在一個Sigfox變數中。對於此範例，我們的payload將如下所示：

   ```javascript
    {
       "device" : "{device}",
       "snr" : {snr},
       "rssi" : {rssi},
       "station": "{station}",
       "latitude": {lat},
       "longitude": {lng},
       "temperature" : {customData#temp},
       "humidity" : {customData#hum}
    }
   ```

   請注意，我們正在將Sigfox變數，像是`{device}`與我們在payload中的自定義數據如`{customData#temp}`混合使用。然後在每次接收訊息時處理它，並且將用即時值取代變數。因此，伺服器將接收具有裝置ID，裝置溫度，濕度，粗略位置（km精度）和訊號品質的JSON payload。

完成這些步驟後，我們現在完成了將數據推送到數據儲存桶的回調設定。

### 編寫Sigfox裝置的程式

現在是時候開始程式設計給我們的Sigfox裝置，它將把數據發送到我們的數據儲存桶。在這種情況下，我們提供了[SmartEverything](http://www.smarteverything.it/)和[Arduino MKRFOX1200](https://www.arduino.cc/en/Main.ArduinoBoardMKRFox1200)的範例。

#### Arduino MKRFOX1200

Arduino MKRFOX1200旨在為尋求為項目中加入SigFox連接的製造商提供實用且經濟高效，同時具有最少網路成本的解決方案。它基於Microchip SAMD21和ATA8520 SigFox模組。可以使用典型用途的2節AA 1.5V電池執行六個月以上。該設計包括使用兩節1.5V AA或AAA電池或外部5V為電路板供電的能力。

![](~@sigfox/arduino_mkrfox1200.jpeg)

**初始化**

要對此裝置進行編輯，我們將使用 [Arduino IDE](https://arduino.cc)。在這種情況下，有必要安裝或更新電路板工具組，可以直接從電路板管理器完成，搜尋`mrk`和選擇Arduino SAMD電路板。

![](~@sigfox/mkrfox1200_install.png)

您還需要安裝程式庫管理器中提供的`Arduino SigFox for MKRFox1200`程式庫，同時也**必需**安裝`Arduino Low Power`和`RTCZero`程式庫。

![](~@sigfox/arduino_sigfox_library.png)

安裝成功後，我們現在可以在Arduino IDE中選擇Arduino MKRFOX12000。您還必須像任何其他Arduino板一樣選擇裝置所連接的埠口。

![](~@sigfox/arduino_mkr1200_board_selection.png)

您可以通過燒錄以下範例來檢查所有內容是否已啟動並執行，該範例將提供有關模組的訊息，例如電路板ID和PAC。在Sigfox中註冊裝置需要這些資訊。

```cpp
#include <SigFox.h>

void setup() {
  Serial.begin(9600); 

  while(!Serial) {};

  if (!SigFox.begin()) {
    Serial.println("Shield error or not present!");
    return;
  }

  String version = SigFox.SigVersion();
  String ID = SigFox.ID();
  String PAC = SigFox.PAC();

  // Display module informations
  Serial.println("MKRFox1200 Sigfox first configuration");
  Serial.println("SigFox FW version " + version);
  Serial.println("ID  = " + ID);
  Serial.println("PAC = " + PAC);

  Serial.println("");

  Serial.print("Module temperature: ");
  Serial.println(SigFox.internalTemperature());

  Serial.println("Register your board on https://backend.sigfox.com/activate with provided ID and PAC");

  delay(100);

  // Send the module to the deepest sleep
  SigFox.end();
}

void loop() {
  // put your main code here, to run repeatedly:
}
```

**注意**：從現在開始，我們假設您已經註冊了您的Sigfox帳戶。如果還沒，請閱讀Arduino 的[First Configuration](https://www.arduino.cc/en/Tutorial/SigFoxFirstConfiguration)教學。

**將數據推送到Sigfox**

我們已經啟動了工具鏈，可以開始寫程式來將數據推送到Sigfox後端了。在介紹程式碼之前，**請記住**我們在Sigfox中定義的回調中，我們建立了一個payload設定，期望接收兩個代表溫度和濕度的浮點數。因此，我們的payload必須與此定義匹配：

```
 temp::float:32:little-endian hum::float:32:little-endian
```

在我們的程式碼中，這個payload可以很容易地用一個`struct`包含兩個浮點數的表示。

顯然您可以使用不同的數據類型定義自己的`struct`（但要注意結構偏移和層次），同時必須重新設定Sigfox payload以正確解碼您要發送的字段。

```cpp
 struct data{
  float temp;
  float hum;
 };
```

因此，程式碼最終將如下所示。我們使用Arduino MKRFOX1200和DHT傳感器，提供在Sigfox後端設定的回調所需的溫度和濕度。如果您沒有DHT傳感器，可以嘗試使用電路板的內部溫度傳感器，通過調用`SigFox.internalTemperature()`，並將濕度值設置為0或任何其他值。

```cpp
 #include <SigFox.h>
 #include <SimpleDHT.h>
 #include <ArduinoLowPower.h>

 #define DHT11_PIN 0

 void setup() {
   Serial.begin(9600);
   pinMode(LED_BUILTIN, OUTPUT);
 }

 void blink(unsigned int count, unsigned long ms){
   for(int i=0; i<count; i++){
     digitalWrite(LED_BUILTIN, HIGH);
     delay(ms);
     digitalWrite(LED_BUILTIN, LOW);    
     delay(ms);
   }
 }

 void send_data(){
   // initialize sigfox module
   SigFox.begin();
   delay(100);

   // Enable debug led and disable automatic deep sleep
   SigFox.debug();

   // clears all pending interrupts
   SigFox.status();
   delay(1);

   // define sigfox payload data structure
   struct data{
     float temp;
     float hum;
   };

   // read temperature and humidity from DHT sensor connected at pin DHT11_PIN
   SimpleDHT11 dht11;
   byte temp, hum;
   dht11.read(DHT11_PIN, &temp, &hum, NULL);

   // NOTE! it is not quite efficient sending bytes as floats over the net, but this is just for illustrative purposes
   struct data reading;
   reading.temp = temp;
   reading.hum = hum;

   // send the structure to sigfox (8 bytes)
   Serial.println("Sending SigFox message!");

   // start a packet
   SigFox.beginPacket();

   // write our buffer
   SigFox.write((const char*)&reading, sizeof(reading));

   // send buffer to SIGFOX network
   int ret = SigFox.endPacket();  
   if (ret > 0) {
     Serial.println("No transmission");
     // 3 quick blink on error
     blink(3, 500);
   } else {
     Serial.println("Transmission ok");
     // 1 blink on success
     blink(1, 1000);
   }

   SigFox.end();
 }

 void loop() {
   send_data();
   delay(10*60*1000);
   // you can deep sleep the device if you want
   //LowPower.sleep(10*60*1000);
 }
```

**請注意**，如果您想使Arduino MRKFOX1200深度睡眠，即使用電池運作時，您可以取消`LowPower.sleep`的註解，並註解`sleep`。你也可以避免使用`Serial`，以及僅有偵錯目的`SigFox.debug()`。在睡眠模式下，裝置需要手動重置才能再次燒錄。

#### SmartEverything

SmartEverything是專為快速原型設計而設計的物聯網裝置，因為它完全相容於Arduino，可以使用多個傳感器，如MEMS壓力傳感器，接近和環境光傳感器，iNEMO 9軸慣性模組，濕度和溫度傳感器，甚至NFC NTAG，或GPS / GNSS天線。這些功能非常有趣，該主板還結合了低功耗藍牙（BLE），當然還有Sigfox模組（Telit LE51-868 S 868MHz模組）。

![](~@sigfox/sigfox_smarteverything_thinger.jpg)

憑藉這些出色的功能，我們可以將電路板用於多種用途，例如使用GPS進行車輛追蹤、建立微型氣象站、使用加速度計偵測震動和衝擊，以及用於其他任何地方。

而在此例僅記錄溫度和濕度，我們建立了一個簡單的程式碼，每10分鐘就會記錄一次溫度和濕度。

**初始化**

要對此裝置進行程式設計，我們將使用[Arduino IDE](https://arduino.cc)。在這種情況下，需要安裝電路板工具鏈，可以直接從電路板管理器完成，搜尋`smarteverything`並選擇`Axel Elettronica`的Arrow Boards。

![](~@sigfox/smarteverything_install_arduino.png)

安裝成功後，我們現在可以在Arduino IDE中選擇開發板。只需選擇`SmartEverything Fox（Native USB Port）`即可。您還必須像任何其他Arduino板一樣選擇裝置所連接的埠口。

![](~@sigfox/smarteverything_sigfox_board.png)

**將數據推送到Sigfox**

現在是時候編寫一個簡單的程式來將我們的傳感器讀數發送給Sigfox。提供的範例程式將在`setup()`中基本初始化Sigfox調製解調器、傳感器和USB串列埠以進行一些偵錯。然後，在`loop()`中，我們的程式將讀取溫度和濕度，並將數據傳輸到Sigfox。它還將檢查傳輸是否成功，成功時閃爍綠色LED或否則為紅色LED。在那之後，它會睡10分鐘，正如我們在介紹中所提到的，Sigfox每天只允許140則訊息。

在介紹程式碼之前，**請記住**在我們在Sigfox定義的回調中，我們建立了一個payload設定，期望接收兩個代表溫度和濕度的浮點數。因此，我們的payload必須與此定義匹配：

```
temp::float:32:little-endian hum::float:32:little-endian
```

在我們的程式碼中，這個payload可以很容易地用一個`struct`包含兩個浮點數的表示。

顯然您可以使用不同的數據類型定義自己的`struct`（但要注意結構偏移和層次），同時必須重新設定Sigfox payload以正確解碼您要發送的字段。

```cpp
struct data{
 float temp;
 float hum;
};
```

因此，程式碼最終將如下所示。**請注意**，此程式碼尚未針對電池供電的情況進行最佳化。如果需要，可以對裝置啟用省電模式，但這超出了本範例的範圍。

```cpp
#include <Wire.h>
#include <SmeSFX.h>
#include <Arduino.h>
#include <HTS221.h>

void setup() {
  // init temp & hum sensor
  Wire.begin();
  smeHumidity.begin();

  // init serial
  SerialUSB.begin(115200);

  // init sigfox module
  sfxAntenna.begin(19200, &SigFox);
  sfxAntenna.setSfxDataMode(); 
}

void send_data(){
  // define sigfox payload data structure
  struct data{
    float temp;
    float hum;
  };

  // read sensor data into the struct
  struct data reading;
  reading.temp = smeHumidity.readHumidity();
  reading.hum = smeHumidity.readTemperature();

  // send the structure to sigfox (8 bytes)
  SerialUSB.println("Sending SigFox message!");
  sfxAntenna.sfxSendData((const char*)&reading, sizeof(reading));
}

void loop() {
  // send sigfox data
  send_data();

  // wait for a response
  bool response=false;
  do{
    if (sfxAntenna.hasSfxAnswer()) {
      switch (sfxAntenna.sfxDataAcknoledge()) {
      case SFX_DATA_ACK_OK:
          ledGreenLight(HIGH);
          SerialUSB.println("Answer OK! :)");
          delay(2000);
          ledGreenLight(LOW);
          response = true;
          break;
      case SFX_DATA_ACK_KO:
          ledRedLight(HIGH);
          SerialUSB.println("Answer KO :(");
          delay(2000);
          ledRedLight(LOW);
          response = true;
          break;
      }
    }
  }while(!response);

  // sleep ten minutes for the next message
  delay(10*60*1000);
}
```

## 檢查 Sigfox 的設定

在我們同時執行裝置程式碼，設定Sigfox回調以及建立數據儲存桶之後，我們應該立即檢查所有內容是否已啟動並執行。

我們可以從檢查Sigfox平台是否正在接收我們的訊息開始。只需切換到Sigfox平台後端，然後打開左側面板上`Messages`的部分。我們應該看到類似於以下截圖畫面的內容，其中已收到一些訊息。您還可以檢視正在發送的有效負載（十六進制）以及鏈路品質，時間戳或回調結果等其他訊息。

![](~@sigfox/sigfox_messages.png)

這裡有趣的是檢查我們的回調響應是否成功，因為回調圖示會根據結果從綠色變為紅色。在我們的例子中，我們的回調是綠色的，所以請求沒問題。您可以點擊該圖示以檢視伺服器響應，即HTTP響應200 OK 。

![](~@sigfox/sigfox_callback_response.png)

然後我們還可以檢查我們的數據儲存桶是否正在填充從Sigfox收到的數據。在Thinger.io中打開數據儲存桶應如下所示。

![](~@sigfox/sigfox_bucket_data.png)

太好了！我們現在存儲了數據。請注意，儲存桶中的欄位是我們在Sigfox回調中設定的字段。

## 建立儀表板

現在我們已將數據存儲在儲存桶中，我們可以使用Sigfox數據建立即時儀表板。您可以建立小工具，選擇您的儲存桶作為數據源，以上就是全部！

![](~@sigfox/sigfox_dashboard.png)

