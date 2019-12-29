# Arduino 開發板範例
::: warning
  各大開發板如非同款，使用時請參考供應商提供的說明書來連接平台，以下幾款為團隊實際測試成功連接平台的範例參考。
:::

## 共通流程

Arduino Library本身即附帶範例，請參考圖示處的資料夾內，打該相應開發板的範例。

![](~@arduino/LibExample.jpg)

## ESP32 / ESP8266
### 前置作業
本範例使用`BPI UNO32`作為實驗板
詳細單元資訊請參考：[BPI-UNO32](http://wiki.banana-pi.org/BPI-UNO32)

![](~@arduino/ESP32/Board.jpg)

### 新增擴充套件來源
將套件來源新增這個文件：`https://dl.espressif.com/dl/package_esp32_index.json`

![](~@arduino/ESP32/ESP32Tutorial0.png)

![](~@arduino/ESP32/ESP32Tutorial1.png)

### 安裝開發板(透過Board Manager)

![](~@arduino/ESP32/ESP32Tutorial2.png)

### 選到NodeMCU

![](~@arduino/ESP32/ESP32Tutorial3.png)

### 完成（請務必確認有選到連接上的COM PORT喔！）


### 燒錄範例程式

燒錄範例程式，將認證資訊修改為Server上設定的Device細節，即可確認連線囉!

## CC3000

本處使用集成了Arduino Leonardo+CC3000 的開發板`DFRobot WiDo` 作為測試板
Arduino Leonardo使用ATmega32U4作為MCU

::: warning
  不建議使用此組合，能夠正常使用的CC3000 Library將直接使用一半以上的儲存空間，加上thinger.io的client後，光是連上WiFi就達到90%大小。
:::

![](~@arduino/WiDo/Board.jpg)

### 前置作業
### 安裝模組程式庫(透過Lib Manager)

安裝Adafruit CC3000 Lib

![](~@arduino/WiDo/WiDoTutorial0.png)

### 選到Leonardo
因為CC3000是做為附掛的擴充模組，提供Leonardo額外功能的，燒錄部分是對Leonardo喔!

![](~@arduino/WiDo/WiDoTutorial1.png)

### 完成（請務必確認有選到連接上的COM PORT喔！）
::: tip
如果燒錄後MCU卡住不動，請看一下官方文件提供的範例程式，檢查程式中設定的中斷IRQ在廠商的LAYOUT中是否一樣。
:::

以我手上的WiDo為例，`ThingerCC3000.h`中設定的`IRQ`是`3`，但廠商的程式是`7`，自然就不會動。
解決方法為修改ThingerCC3000.h(位於Arduino Lib資料夾下)中的IRQ值，使其與廠商提供值相同。

![](~@arduino/WiDo/WiDoErrorFix.png)


### 燒錄範例程式

燒錄範例程式，將認證資訊修改為Server上設定的Device細節，即可確認連線囉!
## MKR1000
本處使用Arduino MKR1000進行操作

![](~@arduino/MKR1000/Board.png)

### 前置作業
### 安裝開發板(透過Board Manager)

![](~@arduino/MKR1000/MKR1000Tutorial0.png)

### 選到MKR1000

![](~@arduino/MKR1000/MKR1000Tutorial1.png)

### 完成（請務必確認有選到連接上的COM PORT喔！）
### 燒錄範例程式
燒錄範例程式，將認證資訊修改為Server上設定的Device細節，即可確認連線囉!

### 注意
由於此開發板在腳本`min`與`max`定義上與`Arduino.h`衝突，因此解決方法是本範例最前端插入下列程式：

```
#undef max
#undef min
```

此發現正好解了thinger.io開發團隊專案中的[issue](https://github.com/thinger-io/Arduino-Library/issues/30)

## Arduino YUN

![](~@arduino/YUN/Board.jpg)

### 前置作業
### 連線到 YUN 更改 WiFi 連線設定

預設IP：192.168.240.1
預設密碼：arduino
請確保YUN與Thinger.io Server在同一個區域網路內，或是YUN可以順利透過WiFi連線到雲端。
如版本不同可能預設密碼不同，請參考自己取得開發板所提供的說明。
如需變更WiFi或登入密碼設定，請按住WLAN-RST五秒以上再放開，YUN將進入設定模式，重新開啟SSID廣播。

![](~@arduino/YUN/YUNTutorial0.png)

連線到YUN

![](~@arduino/YUN/YUNTutorial1.png)

登入後尋找Configure

![](~@arduino/YUN/YUNTutorial2.png)

尋找WiFi設定區段

![](~@arduino/YUN/YUNTutorial3.png)

可手動輸入SSID或自動尋找，輸入密碼後儲存重開，連線到同一個區域網路內即可。

### 選到YUN
![](~@arduino/YUN/YUNTutorial4.png)

::: tip
### 完成（請務必確認有選到連接上的COM PORT喔！）
### 燒錄範例程式
燒錄範例程式，將認證資訊修改為Server上設定的Device細節，即可確認連線囉！
:::
## Linkit ONE
此為聯發科開發的物聯網平台其中一員，更多資訊請參閱[此處](https://docs.labs.mediatek.com/resource/linkit-one/en/getting-started)
![](~@arduino/LinkitONE/Board.jpg)
### 前置作業
建議先不要將`Linkit ONE`連接到電腦

如需透過WiFi連線，請先在`斷電狀態`下安裝WiFi天線以獲得較佳增益。

### 安裝COM Driver

::: tip
請先至[聯發科物聯網平台](https://docs.labs.mediatek.com/resource/linkit-one/en/getting-started)，根據您的系統下載所需的COM Driver並且安裝後再進行下列操作
:::

### 安裝SDK到Arduino IDE

將套件來源新增這個文件：`http://download.labs.mediatek.com/package_mtk_linkit_index.json`

![](~@arduino/ESP32/ESP32Tutorial0.png)

![](~@arduino/LinkitONE/LinkitONETutorial0.png)

### 安裝開發板(透過Board Manager)

![](~@arduino/LinkitONE/LinkitONETutorial1.png)

### 選到 LinkitONE

![](~@arduino/LinkitONE/LinkitONETutorial3.png)

### 確認是在通常模式下接上Linkit ONE

![](~@arduino/LinkitONE/Boardmode.jpg)

### 透過裝置管理員尋找哪個COM Port才是Modem Port

![](~@arduino/LinkitONE/findport.jpg)

### 每次燒錄前務必選擇該Port

![](~@arduino/LinkitONE/selport.jpg)

### 完成（請務必確認有選到連接上的COM PORT喔！）
### 燒錄範例程式
燒錄範例程式，將認證資訊修改為Server上設定的Device細節，即可確認連線囉!

## CC3200
本開發板由基於 Arduino IDE 開發的 energia 提供支援，操作前 [請先由此](https://energia.nu/download/) 下載適當版本energia
本例採用開發板為amomcu所開發的CC3200實驗板，會選這款主要是其售價較為親民。以下教程在Switch開關上或許不適用於TI所提供之CC3200 LaunchPadXL

![](~@arduino/CC3200/Energia.jpg)

amomcu之CC3200開發板

![](~@arduino/CC3200/Board.jpg)

### 重要的開關簡介
SOP開關 Flash模式

![](~@arduino/CC3200/FlashMode.jpg)

SOP開關 Run模式

![](~@arduino/CC3200/RunMode.jpg)

確認連接CC3200的RX與TX開關為全開狀態(下圖中間)才可正常燒錄
此開發板利用CH340來對CC3200進行寫入，需要開啟該SW電腦才能識別該開發板。(見下圖中間偏右 CH340G_VCC)

![](~@arduino/CC3200/CH340G.jpg)

### 安裝開發板

![](~@arduino/CC3200/EnergiaBoardManager.jpg)


### 燒錄範例程式
燒錄範例程式，將認證資訊修改為Server上設定的Device細節即可。

::: warning
注意！燒錄完成後，請斷線並將SOP2關閉，離開燒錄模式，再重新連接上電源線，即可確認是否有連接上伺服器。
:::