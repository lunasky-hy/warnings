# 気象警報・注意報時系列表示  
## URL  

http://wethinfo.azurewebsites.net/  


## 情報ソース  
気象庁防災XML 提供元:先端IT活用推進コンソーシアム(AITC)  
http://api.aitc.jp/  

公開APIは2020/08まで。  

## ファイル構成  
`/`  
Test用Node API サーバー  

`/client/`  
React クライアント  

クライアントのみで動作可能  

### 主要なファイル
注意報・警報ラベル表示`/client/component/WarningLabel.js`  
図表形式表示`/client/component/WarnPeriod.js`  

## 開発用コマンド  
`\ > npm run develop`  
テスト用サーバーと同時起動  


`\client\ > npm run build`  
静的reactファイルの作成  

