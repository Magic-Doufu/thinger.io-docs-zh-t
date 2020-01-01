# LINUX / RASPBERRY PI

![](~@linux/Linux-versions.png)
本操作方法將介紹如何在Raspberry Pi中使用Thinger.io平台。其中包括如何下載，編譯和執行[GitHub 儲存庫](https://github.com/thinger-io/Linux-Client)中可用的主要範例。

## 需求

* 執行Raspbian的Raspberry Pi，且需可透過終端或SSH存取。像Ubuntu這樣的其他操作系統可能也行，但尚未經過測試。
* 在thinger.io控制台中註冊裝置並手動保存憑據(`credentials`)。如果您需要有關此部分的幫助，請檢視[此文件](https://community.thinger.io/t/register-a-device-in-the-console/23)。

## Installing a newer GCC Version

**注意：Raspbian Jessie開始的更新版本不須執行，請跳過此部分。**

thinger.io的程式需使用現代編譯器來編譯。從Jessie開始的Raspbian版本已經提供了一個現代編譯器，但如果您使用較舊的Raspbian版本，則需要安裝更新的編譯器。

至少需要使用**GCC 4.8.2以上**的編譯器。請在終端中鍵入`gcc -v`以檢查是否需要更新編譯器。

另外，必須將系統更新至最新，因此請首先鍵入以下命令來進行升級。這可能需要一些時間，具體取決於您的網速。

```
sudo apt-get update
sudo apt-get upgrade
```

接下來，使用編輯器打開`/etc/apt/sources.list`，並將名稱`wheezy`替代為`jessie`。

```
sudo nano /etc/apt/sources.list
```

然後我們將再次更新列表，用以存取jessie的更新：

```
sudo apt-get update
```

現在，我們終於可以安裝GCC4.9了。

```
sudo apt-get install gcc-4.9 g++-4.9
```

最後一步是將`Jessie`恢復為`Wheezy`，打開`/etc/apt/sources.list`將`jessie`取代為`wheezy`，然後更新列表：

```
sudo nano /etc/apt/sources.list
sudo apt-get update
```

如果我們此時輸入gcc -v，預設版本仍為4.7。

我們需要刪除所有gcc備用方案以將預設版本設為新的gcc 4.9。

```
sudo update-alternatives --remove-all gcc
sudo update-alternatives --remove-all g++
```

之後新增兩個gcc備用方案，並設`GCC 4.9`為優先。

```
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.6 40 --slave /usr/bin/g++ g++ /usr/bin/g++-4.6
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.9 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.9
```

在此階段，如果鍵入`gcc-v`，則應顯示版本4.9.2或更高版本。您始終可以使用以下指令更改預設編譯器。

```
sudo update-alternatives --config gcc
```

## 安裝額外的依賴項

如果您需要將thinger安裝為常駐程式，則必須使用`CMake`編譯範例。如果我們想要使用TLS安全地連接到平台，還需要安裝`Open SSL`。

首先更新apt列表

```
sudo apt-get update
```

安裝依賴項 \(CMake和OpenSSL\)

```
sudo apt-get install cmake libssl-dev
```

## 連上雲端

從GitHub下載最新的Linux客戶端版本。

```
git clone https://github.com/thinger-io/Linux-Client.git
```

進入我們剛剛複製的Linux-Client文件夾。

```
cd Linux-Client
```

是時候輸入驗證資訊了，請修改`src`文件夾下的`main.cpp`文件。

您可以使用任何你所希望的編輯器，此範例使用`nano`編輯文件。

```
nano src/main.cpp
```

在此畫面中，您必須將字段`USER_ID`，`DEVICE_ID`以及`DEVICE_CREDENTIAL`替換為您在平台中註冊裝置時提供的資訊。以下是編輯這些字段之前的`main.cpp`文件截圖。
完成變更參數後，離開`nano`請鍵入`ctrl+x`並輸入`y`來儲存變更。

![](~@linux/thinger-linux.png)

如果您在Raspberry Pi上執行腳本，請確保run.sh包含`-DRASPBERRY=ON`參數，如下所示-

```
cmake -DCMAKE_BUILD_TYPE=Release -DDAEMON=OFF -DRASPBERRY=ON
```

現在，您必須向run.sh腳本加入執行權限。

```
chmod +x run.sh
```

現在您可以執行它來測試是否所有功能都正常。

```
./run.sh
```

如果一切順利，你應該看看程式是如何自動編譯和執行的。該程式實際上回報了一些除錯訊息，幫助我們檢查我們是否正確配置了驗證資訊。您應該看到的預期結果如下圖所示。

![](~@linux/thinger-linux-run.png)

現在，您可以切換到thinger.io控制台並檢查Raspberry是否顯示為已連接。您甚至可以嘗試透過`API Explorer`執行`main.cpp`中定義的資源`sum`來測試加總。

![](~@linux/thinger-linux-dashboard.png)

## 將客戶端作為常駐程式

如果關閉終端或結束SSH連接，客戶端將會停止運作。

您可以將客戶端作為常駐程式執行以避免關閉，即使您的Raspberry重新啟動它也會自動啟動。

要將客戶端作為服務執行，請切換至Raspberry安裝資料夾：

```
cd install/raspberry/
```

然後執行`install.sh`腳本，其將編譯並將客戶端作為服務安裝。

此步驟將複製`init腳本`到`/etc/init.d/thinger`，並將已編譯的二進制文件複製到`/usr/local/bin/thinger`。因此，如果要刪除客戶端常駐程式，可以停止該服務並刪除這些文件。

```
chmod +x install.sh
./install.sh 
```

請注意，此指令將安裝並在後台作為常駐程式執行thinger.io客戶端，因此如果再次調用run.sh執行獨立客戶端的腳本，則兩個客戶端將同時連接到平台並持續中斷彼此的連接。如果需要停止後台客戶端，請使用此指令。

```
sudo service thinger stop
```

## 然後呢？

現在，您可以參考已經存在的範例`sum`，將您所需的資源結合到main.cpp文件中，您可以嘗試定義用於打開和關閉LED、讀取傳感器值、執行系統命令等的資源。此處將很快提供一些基本教學。

