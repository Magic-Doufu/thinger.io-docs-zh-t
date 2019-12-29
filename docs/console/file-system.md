# 檔案系統

![](~@cloud/MenuFileSystem.jpg)

Thinger.io提供了一個靈活的雲端存儲系統，該系統允許將檔案上傳到IoT伺服器供其他平台功能（如HTML小工具或OTA系統）使用。該資料將存儲在伺服器的非揮發性記憶體中，因此，請務必注意檔案的大小，尤其是與其他使用者共用時，以防止伺服器的儲存空間用罄。

## 建立儲存區設定檔

每個存儲設定檔將建立一個具有不同存取權限的隔離目錄。要建立一個新的存儲設定檔，請按下**"Add Storage"**按鈕，並如下圖所示填寫表單：

![](~@cloud/StorageDetails.png)

* **Storage ID:** 在此處輸入存儲設定檔的唯一ID
* **Storage name:** 每個存儲可以有一個幫助您記憶的名稱
* **Storage Description:** 用於輕鬆識別存儲設定檔建議的其他資訊。
* **Public Read:** 此開關用於向第三方服務提供唯讀權限，該HTTP路徑將使用`Storage ID`自動建立。

表單填寫完成後，按**"Add Storage"**按鈕即建立一個新的存儲設定檔。

![](~@cloud/StorageDetailsPublic.png)

* **Index File:** 是透過HTTP路徑存取存儲系統時將打開的檔案。預設情況下為"index.html"，也可以更改為存儲系統中的任何檔案。
* **HTTP Path:** 當"Public Read"選項被打開時，允許第三方程式存取"Index File"的URL。
* **Storage Explorer Button:** 此元件將打開實驗性的Storage Explorer，該檔案瀏覽器允許管理檔案系統。

## Storage Explorer \(實驗性質功能\)

Storage Explorer是一個完整的檔案管理工具，可以隨時從檔案系統上傳，修改和刪除文件。它的圖形界面由三部分組成：

![](~@cloud/StorageExplorer.png)

* 頂部欄包含帶有不同功能的logo
  * **刷新**：如果從此終端以外的其他來源對檔案系統進行了任何更改，則使用"Refresh"按鈕可以更新文件的狀態。
  * **刪除檔案**："-"按鈕可刪除所有選定的檔案。
  * **上傳檔案**：此按鈕將打開檔案上傳介面，這將在下一部分中進行說明。
  * **約束**：折疊/打開檔案導航列(左側)。
  * **存儲**：儲存所有已編輯文件的當前狀態
* 左側欄是一個檔案導航列，可在其中顯示和選擇要編輯或刪除的內容。
* 在界面的底部，資源管理器顯示一個終端控制台，使用擴充指令時可以在其中顯示一些訊息。

## 上傳檔案

Thinger.io的文件瀏覽器具有一個上傳管理器，可以通過"Upload files"圖標存取。該管理器支援從任何電腦使用拖放方式上傳大量文件，只需將文件或目錄拖動到上傳框中央，然後按綠色的"upload all"按鈕即可。

![](~@cloud/UplodFiles.png)

## 編輯檔案

Storage Explorer包含一個導航列，其中顯示了檔案的層次結構。每個文件都將顯示在層次結構中。還包括一個具有增強功能的文本編輯器，可以在雲端檢視和修改檔案。

![](~@cloud/EditFiles.png)

## 刪除檔案

在檔案系統中，若您不再需要某些檔案時，可以使用Storage Explorer將其刪除。通過按下鍵盤上的command或ctrl按鈕並點擊選擇要刪除的檔案。完成後按頂部欄的"-"圖標。

![](~@cloud/DeleteFiles.png)