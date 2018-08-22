var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var logservice = require(__dirname + '/log/logService.js');
var app = express();
var index = require(__dirname + "/routes/index.js");
var api = require(__dirname + "/routes/api.js");


logservice.use(app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
//app.use(multer({ dest: './uploads/'}))

//默认使用index路由配置
app.use("/", index);
//对外api调用
app.use("/api", api);


//测试端口5004 正式端口5002
var port = 5004;
var server = app.listen(port, '0.0.0.0', function () {
    console.log('127.0.0.1:' + port);
})