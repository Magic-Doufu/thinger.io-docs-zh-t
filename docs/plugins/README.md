---
description: This section explains how to deploy and to use the platform 擴充元件 System
---

# 擴充元件

## 介紹

擴充元件可以讓Thinger.io擴展出一些特性或功能。

Thinger.io IoT平台的核心設計精簡輕巧，以最大程度提高靈活性，並極致簡化IoT網路的學習和常見設定。擴充元件提供了可以按需部署的自定義功能，從而允許每個使用者根據其特定需求擴充其IoT伺服器。

有關安裝，升級，故障排除和管理Thinger.io管理擴充的說明和資訊，請參閱 "[管理擴充元件](https://app.gitbook.com/@thinger-io/s/docs/~/drafts/-LrOtZT2lM_x5eeYS6ra/primary/plugins#managing-plugins)" 部分。要了解如何使用現有的擴充元件，可以自下面的列表中尋找並檢視相關內容。

::: tip
注意: 擴充元件僅適用於進階Thinger.io服務器。 選中[**此鏈接** ](https://pricing.thinger.io)以在幾分鐘之內建立您自己的實例
:::

## 預設擴充元件

| [![](~@plugins/Imagen1sas.png)](./node-red) | [![](~@plugins/Imagen12.png)](./sigfox) |
| :--- | :--- |
| [![](~@plugins/Imagen123.png)](./the-things-network) |   |

## 管理擴充元件

Marketplace可以由主選單中點擊"plugins"進入。

![](~@plugins/plugins.png)

此介面包含可安裝用以擴展Thinger.io IoT 平台的現有擴充元件列表，並將包括一些類別以進行過濾和可以輕鬆管理擴充元件的集合，雖然目前確實很少，但預計會在未來幾年內大幅增長。

### 安裝和部署現有的擴充元件

現有的每個擴充元件都有一個說明頁面，其中包含有用的資訊，像是了解如何使用其功能以及"管理擴充元件"功能如何安裝和管理其狀態。

![](~@plugins/pluginManagement.png)

此處的圖形界面來進行以下操作：

* **Install:** 安裝擴充元件的映像，以存取它的服務和功能，並在主選單中產生一個新標籤。
* **Start:** 執行部署擴充元件的過程。在安裝之後以及按下Kill或Stop按鈕之後，必須按下該按鈕才能重新啟動。
* **Stop:** 以通用方式結束擴充元件執行的過程。
* **Kill:** 強制關閉擴充元件進程。
* **Restart:** 重新啟動該擴充元件。
* **Pause:** 暫停擴充元件的執行而不結束進程，因此將保留所有執行時的變數。
* **Resume:** 啟動暫停後擴充元件。
* **Remove:** 移除擴充元件。

## 擴充元件開發

此節將提供有關支援擴充元件系統基礎設施與如何建構新擴充元件的深入資訊。

::: danger
抱歉！這正在進行中
:::

### 擴充元件系統基礎設施

### 擴充元件 Repository

### 寫一個擴充元件
