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
  //https://s3-ap-northeast-1.amazonaws.com/vector-tile/warning/city.json
});

app.get('/api/warning/pref', async (req, res) => {
  var warning = fs.readFileSync("sample-data/warning/pref.json");
  res.json(await JSON.parse(warning));
  // https://s3-ap-northeast-1.amazonaws.com/vector-tile/warning/pref.json
});

// api/period/400000/401000 -> city info
// api/period/400000/ -> pref info(created info)
app.get('/api/period/:pref', async (req, res) => {
  console.log(req.params);
  // 北海道地方：["012010", "016020", "016030", "011000", "013000", "014010", "014020", "014030", "015020", "015010", "016010", "012020", "017010", "017020"]
  try{
    var warntext = fs.readFileSync("sample-data/warning-details/"+ req.params.pref +".json");
  }catch{
    res.sendStatus(404);
  }
  var infos = await JSON.parse(warntext);
  res.json(infos["Body"]["Warning"][3]["Item"][1])
})

//{"Kind":[{"Name":"雷注意報","Code":"14","Status":"発表","Addition":{"Note":"突風"},"Property":{"Type":"雷","AdvisoryPeriod":{"StartTime":{"Date":"１５日","Term":"昼過ぎ"},"EndTime":{"Date":"１６日","Term":"昼前"}}}},{"Name":"強風注意報","Code":"15","Status":"継続","Property":{"Type":"風","AdvisoryPeriod":{"EndTime":{"Date":"１６日","Term":"未明"}},"WindDirectionPart":{"Base":{"WindDirection":{"value":"南東","description":"南東の風","type":"風向","unit":"８方位漢字"}},"Becoming":{"WindDirection":{"value":"南西","description":"南西の風","type":"風向","unit":"８方位漢字"}}},"WindSpeedPart":{"Base":{"Local":[{"AreaName":"玄界灘","WindSpeed":{"value":"12","description":"１２メートル","type":"最大風速","unit":"m/s"}},{"AreaName":"沖ノ島周辺","WindSpeed":{"value":"12","description":"１２メートル","type":"最大風速","unit":"m/s"}}]}}}}],"Area":{"Name":"福岡市","Code":"4013000"},"ChangeStatus":"警報・注意報種別に変化有"}

var templete = JSON.parse(fs.readFileSync("static/templete.json"));
app.get('/api/templete/:type', async (req, res) => {
  console.log(req.params);
  res.json(await templete);
});

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res) => {
    res.sendStatus(404);
});

//サーバ起動
app.listen(port);
console.log('listen on port ' + port);