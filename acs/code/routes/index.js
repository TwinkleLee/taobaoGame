var express = require('express');
var https = require("https");
var router = express.Router();
var logService = require(process.cwd()+'/acs/code/log/logService.js');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var taobao = require(process.cwd() + "/acs/code/taobao");
var fs = require("fs");
var getPage = require('./tenants');
var getData = require(process.cwd()+'/acs/code/data/data.js');

//调用接口需要参数
var appKey = getData('appKey');
var secret =getData('secret');
var root = process.cwd();
var session =  getData('troncellSession');
var faceGroupType =  getData('faceGroupType');

var client = new taobao.ApiClient({
    'appkey': appKey,
    'appsecret': secret,
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});


logService.logger.info('router init');
/* GET home page. */
router.get('/', function (req, res) {
    var tenantName = req.query.TenantName || req.query.tenantName;
    if(!getPage(tenantName)){
        res.sendFile( root + "/acs/code/public/html/404.html");
    }else{
        res.sendFile( root + "/acs/code/" + getPage(tenantName));
    }
})

//健康检测
router.get('/healthCheck',function(req,res){
    res.end("success");
})
//会员注册
router.get('/register', function (req, res) {
    res.sendFile( root + "/acs/code/public/html/register_mark.html" );
})
//活动
router.get('/activity', function (req, res) {
    res.sendFile( root + "/acs/code/public/html/activity_mark.html" );
})

//POST upload.array('file',1)
router.post('/doRegister', upload.array('file',1),function (req, res) {
    var params = req.body,byteArray=[];
    logService.logger.info('doRegister start');
    try{
        fs.readFile(req.files[0].path,function(error,data){
            if(error){return res.end(JSON.stringify(error));}
            byteArray = data;
            var apiParams = {
                'face_group_type':faceGroupType,
                'seller_id':params.seller_id,
                'user_nick':params.user_nick,
                'images':byteArray,
                'session':session,
                'sign_method':'md5',
                'app_key':appKey,
                'timestamp':client.timestamp(),
                'v':'2.0'
            };
            logService.logger.info('session',session);
            client.execute('taobao.wisdom.member.create',apiParams, function(error, response) {
                if(error){
                    logService.logger.error('taobao.wisdom.member.create return error:');
                    logService.logger.error(JSON.stringify(error));
                    res.writeHead(500);
                    res.end(JSON.stringify(error));
                }else{
                    logService.logger.info('taobao.wisdom.member.create return result:');
                    logService.logger.info(JSON.stringify(response));
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                }
            })       
        }) 
    }catch(e){
        logService.logger.error(JSON.stringify(e));
        res.writeHead(500);
        res.end(JSON.stringify(e));
    }finally{

    }
})
router.post('/isRegister', function (req, res) {
    var params = req.body;
    try{
        client.execute('taobao.wisdom.member.query.exist', {
            'taobao_nick':params.taobao_nick,
            'seller_id':params.seller_id,
            'session':session
        }, function(error, response) {
            if(error){
                    logService.logger.error(JSON.stringify(error));
                    res.writeHead(500);
                    res.end(JSON.stringify(error));
                }else{
                    logService.logger.info(JSON.stringify(response));
                    res.writeHead(200);
                    res.end(JSON.stringify(response));
                }
        })
    }catch(e){
        logService.logger.error(JSON.stringify(e));
        res.writeHead(500);
        res.end(JSON.stringify(e));  
    }finally{

    }
})
router.post('/getAvatar', function (req, res) {
    var params = req.body; 
    client.execute('taobao.user.avatar.get', {
        'nick':params.mixnick
    }, function(error, response) {
            if(error){
                res.writeHead(500);
                logService.logger.error(JSON.stringify(error));
                res.end(JSON.stringify(error));
            }else{
                res.writeHead(200);
                logService.logger.info(JSON.stringify(response));
                res.end(JSON.stringify(response));
            }
    })
})
//查询设备
router.post('/getDevice', function (req, res) {
    var apiParams = {
        'device_code':getData('markDeviceId'),
        'session':getData('markSession')
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.smartstore.device.get', apiParams, function(error, response) {
        if(error){
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        }else{
            res.writeHead(200);
            logService.logger.info(JSON.stringify(response));
            res.end(JSON.stringify(response));
        }
    })
})
//查询该用户是否是商家会员
router.post('/isBrandMember', function (req, res) {
    var params = req.body;
    // ,"itemId":557517857975
    var apiParams =  {
        'session':getData('kidslandSession'),
        'extraInfo':JSON.stringify({"source":"paiyangji","deviceId":getData('kidslandDeviceId')[0]}),
        'mix_nick':params.mixnick,
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.identity.get',apiParams, function(error, response) {
            logService.logger.info("taobao.crm.member.identity.get===>recevied");
            if(error){
                res.writeHead(500);
                logService.logger.error(JSON.stringify(error));
                res.end(JSON.stringify(error));
            }else{
                res.writeHead(200);
                logService.logger.info(JSON.stringify(response));
                res.end(JSON.stringify(response));
            }
    })
})
//品牌会员注册地址请求
router.post('/getRegisterUrl', function (req, res) {
    var params = req.body; 
    //,"itemId":557517857975
    var apiParams =   {
        'session':getData('kidslandSession'),
        'extra_info':JSON.stringify({"source":"paiyangji","deviceId":getData('kidslandDeviceId')[0]}),
        'callback_url':params.callback_url
    };
    logService.logger.info("taobao.crm.member.joinurl.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.joinurl.get',apiParams, function(error, response) {
            logService.logger.info("taobao.crm.member.joinurl.get===>recevied");
            if(error){
                res.writeHead(500);
                logService.logger.error(JSON.stringify(error));
                res.end(JSON.stringify(error));
            }else{
                res.writeHead(200);
                logService.logger.info(JSON.stringify(response));
                res.end(JSON.stringify(response));
            }
    })
})

//mark
//查询该用户是否是商家会员
router.post('/isMarkMember', function (req, res) {
    var params = req.body;
    var apiParams =  {
        'session':getData('markSession'),
        'extraInfo':JSON.stringify({"source":"paiyangji","deviceId":getData('markDeviceId'),"itemId":557517857975}),
        'mix_nick':params.mixnick,
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.identity.get',apiParams, function(error, response) {
            logService.logger.info("taobao.crm.member.identity.get===>recevied");
            if(error){
                res.writeHead(500);
                logService.logger.error(JSON.stringify(error));
                res.end(JSON.stringify(error));
            }else{
                res.writeHead(200);
                logService.logger.info(JSON.stringify(response));
                res.end(JSON.stringify(response));
            }
    })
})
//品牌会员注册地址请求
router.post('/getMarkRegisterUrl', function (req, res) {
    var params = req.body; 
    //,"itemId":557517857975
    var apiParams =   {
        'session':getData('markSession'),
        'extra_info':JSON.stringify({"source":"paiyangji","deviceId":getData('markDeviceId'),"itemId":557517857975}),
        'callback_url':params.callback_url
    };
    logService.logger.info("taobao.crm.member.joinurl.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.joinurl.get',apiParams, function(error, response) {
            logService.logger.info("taobao.crm.member.joinurl.get===>recevied");
            if(error){
                res.writeHead(500);
                logService.logger.error(JSON.stringify(error));
                res.end(JSON.stringify(error));
            }else{
                res.writeHead(200);
                logService.logger.info(JSON.stringify(response));
                res.end(JSON.stringify(response));
            }
    })
})

//查询该用户是否关注商家
router.post('/isBrandFollow', function (req, res) {
    var params = req.body;
    var apiParams =  {
        'session':getData('kidslandSession'),
        'extraInfo':JSON.stringify({"source":"paiyangji","deviceId":getData('kidslandDeviceId')[0]}),
        'mix_nick':params.mixnick,
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.identity.get',apiParams, function(error, response) {
            logService.logger.info("taobao.crm.member.identity.get===>recevied");
            if(error){
                res.writeHead(500);
                logService.logger.error(JSON.stringify(error));
                res.end(JSON.stringify(error));
            }else{
                res.writeHead(200);
                logService.logger.info(JSON.stringify(response));
                res.end(JSON.stringify(response));
            }
    })
})
module.exports = router;