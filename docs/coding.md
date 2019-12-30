# 編寫韌體程式
> 此節內容包含如何使用Thinger.io程式庫簡單的建立適用於裝置的韌體，其中包含輸入與輸出資源、調用端點或基於WebSockets的即時串流等等。
## 草圖概述
一支經典的Arduino程式結構通常長得像這樣，它具有一個`setup()`方法與一個`loop()`方法。

``` cpp
void setup() {
}

void loop() {
}
```

`setup()`用於初始化裝置，`loop()`則為執行階段的迴圈。
結合Thinger.io程式庫後，這些區段並不會有任何改變。
但是你需要知道需在何處定義你的裝置資源，或是在哪裡與外部服務進行互動。
一般而言，在`setup()`方法中，所有的裝置資源`(led、繼電器、控制接腳、伺服馬達、需要被執行的函數等`)都需要在此時被定義。
而當您在初始化您的裝置、設定腳位的輸入/輸出狀態或初始化串列埠的速度的同時，你也需要初始化您的資源。基本上包含設定哪些資源或值需要在網路上被公開。

並於loop()階段不斷的調用`thing.handle();`來回應伺服器的要求。因此thinger函式庫可以處理與平台的通訊。
在此處，您可以調用端點或開啟WebSocket即時串流資訊。

因此結構會變成如此範例所示：
```cpp
// add required headers according to your device
#include <SPI.h>
#include <Ethernet.h>
#include <ThingerEthernet.h>

// initialize Thinger instance (type can change depending on your device)
ThingerEthernet thing("username", "deviceId", "deviceCredential");

void setup() {
    // initialize your sensors and pins

    // initialize wifi (see examples for your device)

    // add resources here, like sensors, lights, etc.
}

void loop() {
  // call always the thing handle in the loop and avoid any delay here
  thing.handle(); 
  // here you can call endpoints
  // and also you can stream resources
}
```

::: info
請記得，不要在`loop()`中加入任何`dalay()`，除非您知道自己在做什麼，像是在您的裝置上使用深度睡眠模式等。
:::

這當中的任何延遲都將限制裝置的正常運作，如果傳感器讀取時間較長，那麼在每個循環中讀取傳感器值或許不是好方法，這將導致裝置接收來自控制台的命令時明顯延遲。

安裝程式庫後，您就可以輕鬆地從一些預設範例開始工作。

![](~@assets/Arduino/LibExample.jpg)

> 建議您從thinger.io程式庫提供的範例開始工作。

## 設定驗證資訊

所有連接到雲端平台的裝置都需要經過身分認證，其中包含三個部分

- `username`
- `deviceId`
- `deviceCredential`

當您[在控制台中建立裝置](./console/devices-administration/#-建立裝置)時，基本上是在建立一個新的`Device Id`並設定`Device Credential`。
因此您需要在給裝置的Arduino程式中加入您所提供的同一組驗證資訊，以讓伺服端可以識別裝置並與帳戶進行關聯。此行為通常在`thing`物件被實體化時完成。

因此，將範例中的`username`,`deviceId`和`deviceCredential`替換為您在雲端中註冊時的資訊吧：

```cpp
ThingerWifi thing("username", "deviceId", "deviceCredential");
```


## 開啟偵錯輸出

Thinger.io程式庫提供了對其活動的廣泛記錄，這在需要解決身份驗證和Wi-Fi連接問題時尤其有用。
在草稿碼最前端（所有`#include`出現之前）定義以下內容。

::: tip
在某些開發板上似乎會造成崩潰，尤其是對於程式儲存區使用接近上限的開發板。
:::

```cpp
#define _DEBUG_

// the rest of your sketch goes here
```

由於所有除錯訊息都通過`Serial`顯示，因此還需要啟用`Serial`。請在`setup()`中啟用它。

```cpp
void setup() {
  Serial.begin(115200);
}
```

## 新增資源

在 Thinger.io 平台中，每個裝置都可以定義多個資源，資源是您可以感測或觸發的任何東西。
例如溫度或濕度等傳感器值，或者打開和關閉燈的繼電器等。
你應該定義所有需要在網路上揭露的資源，且由於資源在初始化階段即被提供，因此所有資源都需要在草稿碼的`setup()`方法中定義，初始化後則可根據需求對資源進行存取。

資源的型別共有三種，將在以下各節中進行說明。

::::: tabs type:card

:::: tab 輸入資源 lazy

如果您需要控制或啟動IoT裝置，則需要定義輸入資源。通過這種方式，輸入資源可以為您的裝置提供資訊。
例如打開和關閉燈或繼電器，改變伺服馬達位置，調整裝置參數等的資源。
要定義輸入資源，請使用`<<`指向資源名稱的運算子，它使用了 C++ 11 Lambda 函數來定義函數。
範例為接受一個參數的輸入資源函數，`pson`是一種泛型，可以包含布林值、數字、浮點數、字符串，甚至是JSON文件中的結構化資訊。
以下小節將說明如何為典型應用定義輸入資源。

#### **打開/關閉LED、繼電器等**
這種資源只需要一個開/關狀態，因此可以根據需要啟用或禁用它。由於`pson`型別包含多種型別，我們可以認為`pson`輸入函數的參數類似於布林值。
因此，在`setup()`內，您可以放置​​一個名為`led`（您也可以使用任何其他名稱）的資源，使用`<<`作為運算子，然後使用`pson`作為輸入參數型別。
該範例將使用`in`參數作為條件，以三元運算子來打開/關閉數位引腳10。

```cpp
thing["led"] << [](pson& in){
  digitalWrite(10, in ? HIGH : LOW);
};
```

#### **修改伺服馬達位置**

修改伺服馬達位置非常類似於打開/關閉LED。但在這種情況下，參數必須使用整數。
由於`pson`可以包含多種型別，我們仍然可以將`pson`型別作為整數使用。

```cpp
thing["servo"] << [](pson& in){
    myServo.write(in);
};
```

#### **更新草稿碼中的變數**

您可以使用輸入資源更新變數，所以可以動態變更裝置行為。這在您臨時希望關閉警報，更改報告間隔，更新遲滯值\(hysteresis value\)等情況下，這非常有用。您可以通過定義額外的資源來更改變數。

```cpp
float hysteresis = 0; // 定義一個全域變數
thing["hysteresis"] << [](pson& in){
    hysteresis = in;
};
```

#### **傳遞多個資料**

`pson`型別可以同時容納不同的型別，與JSON文件也完全相容。因此，您可以使用`pson`型別同時接收多個值。此範例將接收使用`lat`和`lon`鍵(key)存儲的兩個不同的浮點數(float value)。

```cpp
thing["location"] << [](pson& in){
    float lat = in["lat"];
    float lon = in["lon"];
};
```

#### **在Dashboard與API中顯示輸入資源狀態**

::: tip 在儀錶板或API中顯示狀態
前幾項的編寫模式不適合由API或Dashboard存取，因其並無法處理`查詢`操作。
:::

儀表板與API的工作方式是：當您打開它們時，它們會查詢相關資源以同步顯示其目前狀態（即開關處於打開或關閉狀態）。
也就是說，當API或儀表板打開時，它們會使用空數據(意即`pson`輸入為空)調用每個相關的輸入資源以同步資訊。

那麼，Dashboards或API在同步階段如何知道輸入資源的目前狀態是什麼？

1. 如果接收到的資源為空，則表示客戶端資源值不存在。須由控制端先給定一個初始值。
2. 如果接收到的資源存在，則控制端使用客戶端資源值，同步完成。

因此，我們得到操作流程：

1. 查詢資源\(不進行修改\)
2. 修改資源
3. 查詢資源\(取得資源的預期輸入\)

因此，實際上允許在儀表板或API中顯示資源的目前狀態的正確輸入資源定義將類似於此範例程式碼。

```cpp
thing["resource"] << [](pson& in){
    if(in.is_empty()){
        in = currentState;
    }
    else{
        currentState = in;
    }
}
```

如果輸入值為空，以下範例程式基本上會回傳目前狀態（如布林值，數字等），否則使用傳入值更新目前狀態。這可以很容易地適用於控制LED，同時在儀表板打開或變更其狀態時顯示目前狀態。

```cpp
thing["led"] << [](pson& in){
    if(in.is_empty()){
        in = (bool) digitalRead(pin);
    }
    else{
        digitalWrite(pin, in ? HIGH : LOW);
    }
}
```

注意：要控制數位引腳，只需使用`更易用的資源定義`部分中說明的方法。
::::

:::: tab 輸出資源 lazy

當您需要感知或讀取傳感器值（如溫度，濕度等）時，通常應使用輸出資源。因此，輸出資源對於從裝置中提取資訊非常有用。
為了定義輸出資源，使用運算子`>>`指出資源名稱，它使用 C ++ 11 Lambda 函數來定義輸出函數。
範例為接受一個參數的輸出資源函數，`pson`是一種泛型，可以包含布林值、數字、浮點數、字符串，甚至是JSON文件中的結構化資訊。
以下小節將說明如何為典型應用定義輸出資源。

#### **讀取傳感器值**

定義輸出資源與定義輸入資源非常相似，不同的是它使用運算子`>>`。在回調函數中，可以用任何我們想要的值替換輸出值(out value)，比如像這樣輸出傳感器值。

```cpp
thing["temperature"] >> [](pson& out){
      out = dht.readTemperature();
};
```

#### **讀取多個數據**

輸入資源可以同時接收多個數據，輸出資源也可以相同的方式提供多個數據。這是從GPS提供緯度和經度的範例。

```cpp
thing["location"] >> [](pson& out){
      out["lat"] = gps.getLatitude();
      out["lon"] = gps.getLongitude();
};
```

#### **讀取草稿碼中的變數**

如果您的草稿碼無法提供單個傳感器讀數，因為它正在進行某種數據收集，則輸出資源也可用於讀取計算結果會經常更新的變數。

```cpp
float yaw = 0; // 定義一個全域變數
thing["yaw"] >> [](pson& out){
      out = yaw;
};
```
::::

:::: tab 輸入/輸出資源 lazy

最後一種資源類型是不僅僅只能接受輸入或輸出的資源，此種資源可以接受輸入或輸出。當您想要讀取依賴於輸入的輸出時，即當您需要向傳感器提供變化的參考值時，這非常有用。
這種資源通常由`=`運算子定義。這種資源採用兩個不同的`pson`參數。一個用於輸入數據，另一個用於輸出數據。
此範例使用BMP180傳感器提供高度讀數。它將參考高度作為輸入，並提供目前高度作為輸出。

```cpp
thing["altitude"] = [](pson& in, pson& out){
    out = bmp.readAltitude(in);
};
```

您還可以定義更複雜（具有多個輸入值）的輸入/輸出資源，以提供多個輸出值，例如此範例中包含`value1`和`value2`提供`sum`和`mult`值。

```cpp
thing["in_out"] = [](pson& in, pson& out){
    out["sum"] = (long)in["value1"] + (long)in["value2"];
    out["mult"] = (long)in["value1"] * (long)in["value2"];
};
```

::::

:::::

---

### 沒有參數的資源

您也可以定義不需要任何輸入也不會產生任何輸出的資源。它們就像可以根據請求執行的回調，例如重啟裝置或執行一些特定操作。
在這種情況下，資源將沒有任何輸入或輸出參數。

```cpp
thing["resource"] = [](){
    // write here your execution code
};
```

## 更易用的資源

客戶端程式庫中還包含用於更輕鬆聲明資源的語法定義，其無需考慮該資源屬於輸入或輸出。這種語法特性基於自動擴展定義成標準資源的腳本。

使用這種定義的優點是，當您從API查詢時，您的資源將能夠處理狀態查詢。例如，如果啟用或禁用了數位引腳，則可以在API資源管理器或儀表板中檢視其目前狀態。
:::: tabs type:card
::: tab 控制數位引腳

這種資源定義用於數位引腳控制的資源，因此您可以在開啟/關閉狀態間切換，這可以用於控制LED、繼電器、電燈等。

同時需要在`setup()`中將數位引腳定義為`OUTPUT`，否則資源將無法正常工作。


```cpp
thing["relay"] << digitalPin(PIN_NUMBER);
thing["relay"] << invertedDigitalPin(PIN_NUMBER);
```
:::
::: tab 定義輸出資源

這種資源定義唯讀資源，例如從傳感器獲取的值，或者草稿碼中給定的變數。
在這個例子中，我們定義了一個用於披露傳感器讀數的資源，比如DHT11傳感器溫度。

```cpp
thing["temperature"] >> outputValue(dht.readTemperature());
```

我們也可以在程式中為任何全域變數定義輸出資源。

```cpp
thing["variable"] >> outputValue(myVar);
```
:::
::: tab 修改草稿碼中的變數

我們的草稿碼常常定義了一些在`loop()`中使用的參數或變數，如要修改這種變數可以定義這種資源。
使用這種資源，我們可以修改我們想要披露的任何參數，比如浮點數，整數，布林值等。
這種資源通常用於處理或控制行為。

在此範例中，我們可以遠端修改被定義為全域變數的布林變數 `sdLogging`

```cpp
thing["logging"] << inputValue(sdLogging);
```

我們可以定義一個回調函數來知道變數何時發生了變化，因此可以透過回調函數執行其他操作。
對於此範例，資源定義的回調函數包含了其他內容，回調函數將在`hysteresisVar`被更改時執行已定義的內容。

```cpp
thing["hysteresis"] << inputValue(hysteresisVar, {
    // 當變數改變時做些事情
    Serial.println("Hystereis changed to: ");
    Serial.print(hysteresisVar);
});
```
:::
::: tab 控制伺服馬達

您也可以定義用於控制伺服馬達的資源，定義的資源將根據API互動自動處理伺服馬達的讀取或更新位置事件。

要定義伺服資源，只需像往常一樣定義和初始化伺服馬達，然後使用以下聲明作為資源定義中的實例。

```cpp
thing["servo"] << servo(myServoInstance);
```

:::
::::

---

## 裝置間的通訊

在Thinger.io中，裝置可以在彼此之間進行通訊。

這裡有兩種狀況，一個是來自相同帳戶的裝置之間的通訊，另一個是來自不同帳戶的裝置之間的通訊。

以下是我們對於兩種不同的方法的說明：

### 同帳戶的裝置通訊

對於此範例，裝置可以使用特定方法在相同帳戶下與其他裝置進行低延遲的簡單編碼通訊。且這個通訊中數據傳遞是可選的，意味著你也可以進行空調用。

假設我們有兩個裝置：`deviceA`和`deviceB`。並且希望由`deviceB`建立兩者間的通訊可以傳遞到`deviceA`的特定輸入資源，我們可以如下方範例一樣使用`thing.call_device(,);`。

在`deviceA`定義如下面的例子一樣的資源。
```cpp
setup(){
    thing[“resource_On_A”] = [](){
        Serial.println("Someone is calling me!");
    };
}
```

而 `deviceB` 可以通過執行以下指令輕鬆調用此方法。

```cpp
loop(){
    thing.handle();
    // 請務必以適當的頻率調用
    thing.call_device("deviceA", "resource_On_A");
}
```

另一方面，如果我們希望在裝置之間共享帶有`pson payload`的訊息，則`deviceA`可以通過定義資源時加入一些預期的輸入。

```cpp
setup(){
    thing[“resourceOnA”] << [](pson& in){
        int val1 = in["anyValue1"];
        float val2 = in["anyValue2"];
        // 在此處即可使用更新完成的參數
    };
}
```

`deviceB`也可以定義一個`pson`型別變數並填充相同`key`，再透過調用方法來提供`resourceOnA`適當的輸入。如同以下程式：

```cpp
loop(){
    thing.handle();
    // 請務必以適當的頻率調用
    pson data;
    data["anyValue1"] = 3;
    data["anyValue2"] = 43.1;
    thing.call_device("deviceA", "resourceOnA", data);
}
```

`deviceB`調用此方法時可以透過提供已定義資源產生輸入資訊。在此範例，調用方式與前面的範例類似，但使用資源作為數據源。

```cpp
setup(){
    thing["resourceName"] >> [](pson& out){
        out["anyValue1"] = 3;
        out["anyValue2"] = 43.1;
    };
}

loop(){
    thing.handle();
    // 請務必以適當的頻率調用
    thing.call_device("deviceA", "resourceOnA", thing["resourceName"]);
}
```

### 裝置位於不同帳戶

如果我們想要在不同帳戶的裝置間進行通訊，我們可以通過調用`Thinger.io Device Call`類型的端點來實現。只需在控制台中註冊此類型的端點，如下圖所示。

![](~@coding/device_call.png)

在這種情況下，需要在端點中定義幾個參數：

* Endpoint Identifier: 給予裝置調用的端點ID。
* Device Owner: 裝置擁有者
* Device Identifier: 裝置在其所在帳戶下的ID
* Resource Name: 該裝置上要被調用的資源名稱
* Device Access Token: 在裝置所在帳戶下產生的裝置令牌，用於授予裝置的外部存取權。

定義後，裝置將如調用端點一樣，可以使用`call_endpoint`方法進行調用。

```cpp
thing.call_endpoint("DeviceACall");
```

## 使用端點

在Thinger.io中，端點被定義為可由裝置存取的某種外部資源。借助端點功能，裝置可以輕鬆地發送電子郵件、SMS、向外部Web服務推送數據、與IFTTT互動以及使用WebHooks（調用HTTP / HTTPS URL）可以執行的任何操作。

從Arduino草稿碼上調用端點非常簡單，因為只需要在`thing`變數上調用`call_endpoint`方法。

```cpp
thing.call_endpoint("endpoint_id");
```

您可以很簡單地使用端點來進行如發送預定義的電子郵件，或者在調用端點時傳遞某些數據等操作，這在您使用需要裝置數據的第三方服務時特別有用。

::: warning
**在調用資源時應特別注意，並以適當的速率調用它們。否則，您將很容易消耗大量傳輸流量、寄出數百封電子郵件或在第三方服務中大量消耗API​​調用次數。**
:::

### 調用端點

這個簡單的範例將向您示範如何根據溫度來傳送高溫警報的email，對於範例我們已經先配置了一個名為`high_temp_email`的電子郵件端點，其中包含有關溫度的警告文本。

在此範例，我們不會希望每毫秒檢查溫度，因此引入一些參數來控制感測與發送警告的頻率。此範例中將每小時檢查一次溫度，如果溫度高於30ºC，它將調用`high_temp_email`端點，該端點將向我們發送包含預定義文本的電子郵件。

請不要在`loop()`方法中加入延遲，因為它會阻止`thing.handle()`方法執行，因此基於`millis()`函數的非阻塞延遲是個好方法。

```cpp
unsigned long lastCheck = 0;
loop(){
    thing.handle(); // thing handle是必須的
    unsigned long currentTs = millis();
    if(currentTs-lastCheck>=60*60*1000){
        lastCheck = currentTs;
        if(dht.readTemperature()>30){
            thing.call_endpoint("high_temp_email");
        }
    }
}
```

您可以在此處發揮創造力，建立在感測器感測時可調用的端點，例如：您的濕度傳感器報告您的植物中沒有水、裝置的位置不符合預期以及其他許多狀況時可以進行的調用。 使用端點的另一種有趣方式是將其與IFTTT集成，因此您可以與多個第三方服務進行互動！

### 向端點推送數據

將數據採用JSON格式推送到端點也非常簡單。我們需要根據`pson`的格式加入一些資訊，然後調用`call_endpoint`方法，這些資訊將自動轉換為JSON。 例如，如果我們想要將數據報告給像 Keen.io 這樣的第三方服務，我們可以在控制台中建立這種端點。 設定完成後，我們可以在調用端點時傳遞數值，例如DHT傳感器的濕度和溫度。

```cpp
// 小心傳送資料的頻率
pson data;
data["temperature"] = dht.readTemperature();
data["humidity"] = dht.readHumidity();
thing.call_endpoint("keen_endpoint", data);
```

您還可以根據已定義的資源發送數據，即假設您有一個已經提供溫度和濕度的資源。可以重複使用此定義將相同的數據發送到端點，而無需重新定義傳感器讀數，如下例所示。

```cpp
setup(){
    // 在setup中定義用於讀取感測器數值的資源
    thing["data"] >> (pson& out){
        out["temperature"] = dht.readTemperature();
        out["humidity"] = dht.readHumidity();
    }
}

loop(){
    // 小心傳送資料的頻率
    thing.call_endpoint("endpoint", thing["data"]);
}
```

### 電子郵件類型的端點範例

這是一個簡單的範例，應用於具有自定義內文的電子郵件類型端點：

```cpp
setup()
{
 thing["Level"] >> outputValue(actualRelative);
}
loop()
{
 if(actualLevel>UpperLevel && endpointUpperFlag)
   {
    thing.call_endpoint("endpoint_id",thing["Level"]);
    endpointUpperFlag=0;
   }
}
```

請注意，有一個變數限制此"if"只會執行一次，定義任何條件或方法以保證這種enpoint調用只執行一次（或以適當的頻率）是非常重要的，因為它可以造成一個微控制器通過thinger.io平台產生大量電子郵件的情況。
在端點配置中，在自定義內文電子郵件中，必須使用雙括號"{{}}"來調用微控制器發送的變數，在我們的範例中，我們使用了以下內文：

`"The actual level is %"`

並得到一封帶有文字的電子郵件：

`The actual level is 80.34%`

## 使用資料儲存桶

Thinger.io提供一個易用且富有擴充性的虛擬儲存系統，該系統允許存儲來自裝置輸出資源的長期數據。這些資訊可於儀表板中將其可視化，也可以使用不同格式匯出數據進行其它處理或第三方資料分析。

### 自裝置讀取資源(From Device Resource)

此方式無須編寫特定方法即可使用，因為他們將透過雲端平台自動蒐集資料，僅須建立數據統並設定採樣間隔即可，如控制台文檔所述[http://docs.thinger.io/console/\#data-buckets](http://docs.thinger.io/console/#data-buckets)。

### 串流寫入(Streaming Resource Data)

此方式可讓裝置在觸發特定條件時串流資訊。我們可以在資料儲存區設定時使用**"Update from device"**選項，並且使用串流資源傳送資料，如下所述：

此例使用事先定義的輸出資源，我們稱它為 \["location"\] ，它看起來像下面這樣：

```cpp
 void loop() {
  thing.handle();
  // 在這裡使用您自己的邏輯來確定何時進行串流/記錄資源。
  if(requires_recording){
      thing.stream("location");
  }
}
```

### 調用寫入(From Write Call)

此選項將允許設定資料儲存桶為不讀取任何資訊而是等待調用寫入命令的狀態，Arduino可以使用`write_bucket`方法(如此例)，而 Sigfox 也可以直接調用 REST API 來完成。此功能可以將來自不同裝置的資訊寫入至同一個儲存區中，或是儲存來自與伺服器未建立永久連接、處於睡眠狀態或諸如 Sigfox 之類的裝置所提供的資訊。

以下是ESP8266裝置使用`write_bucket`函數將資訊寫入的範例：

```cpp
void setup() {
  // 定義包含開關狀態的資源
  thing["door_status"] >> [](pson &out){ 
    out["OPEN"] = (bool)digitalRead(SENSOR_PIN);
  };
}

void loop() { 
  // 處理連接
  thing.handle();

  if(digitalRead(SENSOR_PIN)!=previous_status){
    // 當門更改狀態時寫入存儲桶BucketId中
    thing.write_bucket("BucketId", "door_status");
  }
  previous_status=digitalRead(SENSOR_PIN);
}
```

請注意：此指令將搜尋PSON中的\["door\_status"\]資源，因此也可以附加自定義PSON來調用此函數，如下所示：

```cpp
void loop(){
  // 處理連接
  thing.handle();

  if(digitalRead(SENSOR_PIN)!=previous_status){
    // 當門更改狀態時寫入存儲桶BucketId中
    thing.write_bucket("BucketId", "door_status");
  }
  previous_status=digitalRead(SENSOR_PIN);
}
```

## 串流資源

在Thinger.io中，您可以建立針對裝置的WebSockets連接，這樣您就可以即時接收傳感器值、事件或其他資訊。WebSockets主要用於控制台的儀表板功能，通常用於以可設定時間間隔傳輸資訊的資源。
定義輸出資源時，此功能可立即使用。
但是，如果您希望只在需要時才傳輸信息，例如當您的裝置檢測到移動、節能感測器偵測到目標等，您必須編寫一些程式，這與調用端點非常相似。

在這種情況下，你必須偵測並判斷何時才進行串流，例如加速計值超過某個閾值、您的節能感測器偵測到目標或者羅盤方向正在發生變化等。

串流資源還需要一個端點供其連接並監聽它們（即WebSocket的連接對象），因此如果沒有人監聽此數據，則不會發送數據。這由客戶端程式庫和伺服器自動處理，串流傳輸數據始終是安全的，因為裝置僅在有目的地時才傳輸信息。

以下範例將在航向值變化超過1度時即時回報羅盤航向：

![](~@coding/esp8266-real-time-websockets.gif)

```cpp
void setup(){
  thing["heading"] >> [](pson& out){     
    out = getHeading();
  };
}

float previousHeading = 0;
void loop() {
  thing.handle();
  float currentHeading = getHeading();
  if(abs(currentHeading-previousHeading)>=1.0f){
    thing.stream(thing["heading"]);
    previousHeading=currentHeading;
  }
}
```

## ESP8266 深度睡眠與 SmartConfig

`SmartConfig`允許使用者通過同一網路（例如智慧型手機或其他wifi客戶端）上的外部裝置設定主板的WiFi憑證。這意味著沒有敏感訊息寫入韌體或裝置上的設定文件。

`Deep Sleep`是ESP8266的一種特殊模式，它允許它關閉大部分電路並在一些可配置的時間後喚醒。 要使深度睡眠（和喚醒）正常工作，必須連接`GPIO16`（通常是開發板的`D0`）和`RST`引腳。

但是，有些電路板選擇將內建LED連接到`D0`引腳，由於該類別在執行時使用LED作為除錯輔助工具，因此使用`ThingerSmartConfig`類別時將進入崩潰循環。

解決方案是使用重構函數並禁止其使用LED。

```
ThingerSmartConfig thing(USERNAME,
                         DEVICE_ID,
                         DEVICE_CREDENTIAL,
                         false); // 當使用深度睡眠時是必須的
```

## 連接故障排除指南

在極少數的情況下，可能會導致軟體客戶端故障，妨礙與IoT平台的連接或使其變得不穩定。但是Thinger.io客戶端已經提供了一些工具來檢測和避免此類問題。
如果最近程式設計的裝置在Thinger.io伺服器上顯示為 "online" 甚至被鎖定，`_DEBUG_` 指令可以幫助您識別問題。 參照[DEBUG](./#開啟偵錯輸出)。

下一個列表顯示了主要問題並提供針對每個問題的解決方案

::: tip
作業中...
:::