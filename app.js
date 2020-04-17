var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var fs = require('fs');

// const allowCrossDomain = function(req, res, next){
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET, POST');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, access_token');
//     if('OPTIONS' == req.method){
//         res.send(200);
//     }else{
//         next();
//     }
// }
// app.use(allowCrossDomain);

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 5000; // port番号を指定


// GET http://localhost:5000/api/
app.get('/api/',function(req,res){
    res.json({"body": "hello"});
});

app.get('/api/warning/city', async (req, res) => {
  var warning = fs.readFileSync("sample-data/warning/city.json");
  res.json(await JSON.parse(warning));
});

app.get('/api/warning/pref', (req, res) => {
  var warning = fs.readFileSync("sample-data/warning/pref.json");
  res.json(JSON.parse(warning));
});

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => {
    res.sendStatus(404);
  });

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);