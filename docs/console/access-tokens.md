# 存取令牌

可以通過REST API存取所有Thinger.io平台功能，以便將我們的服務作為結合其他項目的後端伺服器。實際上，控制台只是一個與API互動以管理裝置，數據儲存桶，端點，儀表板等的Angular REST客戶端。每個REST API請求必須經過身份驗證才能生效，因此，任何客戶端都需要在每次調用時提供授權。存取令牌是向第三方服務或應用程式提供授權以進行API請求的方式，而無需與其共享使用者名和密碼。此外，通過存取令牌，可以授予對帳戶的特定資源和操作的存取權限，例如讀取特定裝置或寫入自定義數據儲存桶（如[本示例](http://docs.thinger.io/sigfox/#steps-in-thingerio-create-an-access-token)中所示）。

::: tip
**筆記：**[此處](http://docs.thinger.io/api/#authentication-api-rest-api-authentication)更詳細地介紹了如何通過API使用存取令牌。
:::

點擊選單中的`Access Tokens`部分，即可輕鬆管理所有令牌。

![](~@cloud/MenuAccessTokens.jpg)

## 建立令牌設定檔(Access Token Profile)

點擊綠色`Add Token`按鈕將打開新界面以輸入端點詳細資訊，如以下畫面截圖所示：

![](~@cloud/AddToken.png)

可設定的參數如下：

* **Token ID**: 使用者帳戶中的唯一令牌ID。
* **Token Name**: 令牌名稱，以便輕鬆識別令牌用途與範圍。
* **Enabled**: 控制是啟用還是禁用令牌。
* **Token Permissions**: 在本處可以定義令牌的存取範圍或權限級別。根據給定的權限，令牌可以存取您帳戶的不同部分。新增新權限通常需要選擇權限類型（存取裝置，數據儲存桶，儀表板等），權限級別（某些特定資源或所有類型）以及允許的操作（全部或部分）。此設定由`Add Token Permission`處理：

![](~@cloud/AddUserTokenPermission.png)

填寫完所有參數後，再次按下綠色的`New Access Token`以新增一個存取令牌設定檔。接著授權訊息會出現在如下圖所示的藍色文本框中

![](~@cloud/AddTokenDone.png)

授權訊息可以`bearer`進行身分驗證，這將允許第三方系統使用Thinger.io平台的功能。
This authorization can be added as bearer auth. to allow a third party system to work with Thinger.io Platform features. 

### 向存取令牌加入授權

每個存取令牌設定檔都可以包含對許多不同功能的授權，以下列表顯示了所有可用的授權類型以及每個權限類型對應的操作：

* **Admin Access**: 提供對整個帳戶的存取權限。
* **Device**: 提供對單個裝置或所有裝置的存取。可以定義以下範圍的操作：
  * `AccessDeviceResources`: 授予對存取裝置資源的權限，例如讀取傳感器變數。
  * `ListDeviceResources`: 授予列出裝置資源名稱的權限。
  * `GetDeviceStats`: 授予讀取裝置統計資訊的權限，如IP，連接時間，頻寬等。
  * `CreateDeviceToken`: 授予建立裝置令牌的權限。
  * `ListDeviceTokens`: 授予列出裝置令牌的權限。
  * `DeleteDeviceToken`: 授予刪除裝置令牌的權限。
  * `ListDevices`: 授予列出帳戶中裝置的權限。
  * `DeleteDevice`: 授予刪除裝置的權限。
  * `CreateDevice`: 授予建立新裝置的權限。
  * `UpdateDevice`: 授予修改裝置，例如其描述或憑證的權限。
  * `ListDeviceLocations`: 授予取得連接的裝置位置的權限。
* **Bucket**: 提供對單個數據儲存桶或所有數據儲存桶的存取。可以定義以下範圍的操作：
  * `ReadBucket`：授予讀取數據儲存桶中資訊的權限。
  * `WriteBucket`：授予寫入資訊到數據儲存桶的權限。
  * `ExportBucket`：授予匯出數據儲存桶中資訊的權限。
  * `ClearBucket`：授予清除數據儲存桶中資訊的權限。
  * `ListBuckets`：授予列出帳戶數據儲存桶的權限。
  * `DeleteBucket`：授予刪除數據儲存桶的權限。
  * `CreateBucket`：授予建立新數據儲存桶的權限。
  * `UpdateBucket`：授予修改數據儲存桶設定的權限，如數據源，描述等。
  * `ReadBucketConfig`：授予讀取數據儲存桶設定的權限。
* **Endpoint**: 提供對單個端點或所有端點的存取。可以定義以下範圍的操作：
  * `ListEndpoints`：授予列出帳戶端點的權限。
  * `CreateEndpoint`：授予建立新端點的權限。
  * `ReadEndpointConfig`：授予讀取目前端點設定的權限。
  * `UpdateEndpoint`：授予以修改端點設定的權限。
  * `DeleteEndpoint`：授予刪除端點的權限。
  * `CallEndpoint`：授予調用端點的權限。
* **Dashboard**: 提供對單個儀表板或所有儀表板的存取。可以定義以下範圍的操作：
  * `ListDashboards`：授予列出帳戶資訊中心的權限。
  * `CreateDashboard`：授予建立新儀表板的權限。
  * `ReadDashboardConfig`：授予讀取目前儀表板設定的權限。
  * `UpdateDashboard`：授予修改儀表板設定的權限。
  * `DeleteDashboard`：授予刪除儀表板的權限。
* **Token**:提供對單個令牌或所有令牌的存取。可以定義以下範圍的操作：
  * `ListTokens`：授予列出帳戶令牌的權限。
  * `CreateToken`：授予建立新令牌的權限。
  * `ReadTokenConfig`：授予讀取目前令牌設定的權限。
  * `UpdateToken`：授予修改令牌設定的權限。
  * `DeleteToken`：授予刪除令牌的權限。

## 修改權限

通過點擊令牌列表中的設定檔ID並點擊"Edit Token"部分的綠色"+Add"按鈕，可以隨時從"Edit Token"界面中修改存取令牌設定檔權限。 這將再次打開"Add Token Permission"界面，因此可以按照與首次設定相同的方式加入其他權限。

## 刪除存取令牌

可以從存取令牌列表中刪除一個或多個存取令牌設定檔，方法是在左側的複選框中選中它，然後按紅色的"delete"按鈕。

![](~@cloud/RemoveAccessToken.png)


