var express = require('express');
var https = require("https");
var router = express.Router();
var logService = require(process.cwd() + '/acs/code/log/logService.js');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var taobao = require(process.cwd() + "/acs/code/taobao");
var fs = require("fs");
var getPage = require('./tenants');
var getData = require(process.cwd() + '/acs/code/data/data.js');
var request = require("request");
var http = require('http');


// var url = 'http://p0.meituan.net/tuanpic/3df525af5a3f7fe04077567d2a6caf794904.png';  //一张网络图片
// http.get(url, function (res) {
//     var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
//     var size = 0;　　 //保存缓冲数据的总长度
//     res.on('data', function (chunk) {
//         chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
//         //node会把接收到的数据片段逐段的保存在缓冲区（Buffer），
//         //这些数据片段会形成一个个缓冲对象（即Buffer对象），
//         //而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），
//         //如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，
//         //直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，
//         //利用下面的node.js内置的Buffer.concat()方法进行拼接
//         size += chunk.length;　　//累加缓冲数据的长度
//     });
//     res.on('end', function (err) {
//         var data = Buffer.concat(chunks, size);　　//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
//         console.log(Buffer.isBuffer(data));　　　　//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
//         console.log(data)
//     });
// });




//调用接口需要参数
var appKey = getData('appKey');
var secret = getData('secret');
var root = process.cwd();
var session = getData('troncellSession');
var faceGroupType = getData('faceGroupType');

var client = new taobao.ApiClient({
    'appkey': appKey,
    'appsecret': secret,
    'REST_URL': 'http://gw.api.taobao.com/router/rest'
});


logService.logger.info('router init');
/* GET home page. */
router.get('/', function (req, res) {
    var tenantName = req.query.TenantName || req.query.tenantName;
    if (!getPage(tenantName)) {
        res.sendFile(root + "/acs/code/public/html/404.html");
    } else {
        res.sendFile(root + "/acs/code/" + getPage(tenantName));
    }
})

//健康检测
router.get('/healthCheck', function (req, res) {
    res.end("success");
})
//会员注册
router.get('/register', function (req, res) {
    res.sendFile(root + "/acs/code/public/html/register_mark.html");
})
//活动
router.get('/activity', function (req, res) {
    res.sendFile(root + "/acs/code/public/html/activity_mark.html");
})


router.get('/game', function (req, res, next) {
    console.log(req.query)
    if (req.query.name && req.query.name == "qa" && req.query.brand && req.query.brand == "baiwei") {
        // res.redirect('/boxingCat/index')
        res.sendFile(root + "/acs/code/public/html/game.html");
    } else {
        next()
    }
})
//拳击猫
router.get('/game', function (req, res, next) {
    console.log(req.query)
    if (req.query.name && req.query.name == "qa" && req.query.brand && req.query.brand == "baiwei") {
        // res.redirect('/boxingCat/index')
        res.sendFile(root + "/acs/code/public/html/game.html");
    } else {
        next()
    }
})
router.get('/test', function (req, res) {//测试_活动开始页
    res.sendFile(root + "/acs/code/public/boxingCat/index.html");
})

router.get('/boxingCat/index', function (req, res) {//大屏端首页
    res.sendFile(root + "/acs/code/public/html/boxingCat_index.html");
})

router.get('/boxingCat/rotate', function (req, res) {//抽奖页
    res.sendFile(root + "/acs/code/public/html/boxingCat_rotate.html");
})


//POST upload.array('file',1)
// router.post('/doRegister', upload.array('file', 1), function (req, res) {
router.post('/doRegister', upload.array(), function (req, res) {
    var params = req.body, byteArray = [];
    logService.logger.info('doRegister start');
    // logService.logger.info(req.body);
    try {
        // fs.readFile(req.files[0].path, function (error, data) {
        // if (error) { return res.end(JSON.stringify(error)); }
        // byteArray = data;

        logService.logger.info(123);

        var url = params.base64Data;  //一张网络图片
        // var url = 'http://p0.meituan.net/tuanpic/3df525af5a3f7fe04077567d2a6caf794904.png'
        https.get(url, function (res2) {

            // logService.logger.info(223);

            var chunks = []; //用于保存网络请求不断加载传输的缓冲数据
            var size = 0;　　 //保存缓冲数据的总长度
            res2.on('data', function (chunk) {
                chunks.push(chunk);　 //在进行网络请求时，会不断接收到数据(数据不是一次性获取到的)，
                //node会把接收到的数据片段逐段的保存在缓冲区（Buffer），
                //这些数据片段会形成一个个缓冲对象（即Buffer对象），
                //而Buffer数据的拼接并不能像字符串那样拼接（因为一个中文字符占三个字节），
                //如果一个数据片段携带着一个中文的两个字节，下一个数据片段携带着最后一个字节，
                //直接字符串拼接会导致乱码，为避免乱码，所以将得到缓冲数据推入到chunks数组中，
                //利用下面的node.js内置的Buffer.concat()方法进行拼接
                size += chunk.length;　　//累加缓冲数据的长度
                logService.logger.info(333);
            });
            res2.on('end', function (err) {
                var data = Buffer.concat(chunks, size);　　//Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
                console.log(Buffer.isBuffer(data));　　　　//可通过Buffer.isBuffer()方法判断变量是否为一个Buffer对象
                byteArray = data;
                // console.log(data)
                var apiParams = {
                    'face_group_type': faceGroupType,
                    'seller_id': params.seller_id,
                    'user_nick': params.user_nick,
                    'images': byteArray,
                    'session': session,
                    'sign_method': 'md5',
                    'app_key': appKey,
                    'timestamp': client.timestamp(),
                    'v': '2.0',
                    'user_full_name': params.name ? params.name : '',
                    'mobile': params.phone ? params.phone : ''
                };

                logService.logger.info('params1', apiParams.images);


                client.execute('taobao.wisdom.member.create', apiParams, function (error, response) {
                    if (error) {
                        logService.logger.error('taobao.wisdom.member.create return error:');
                        logService.logger.error(JSON.stringify(error));
                        res.writeHead(500);
                        // res.set('Content-Type','text/html')
                        res.end(JSON.stringify(error));
                    } else {
                        logService.logger.info('taobao.wisdom.member.create return result:')
                        // logService.logger.info('hello1')
                        logService.logger.info(JSON.stringify(response));
                        res.writeHead(200);
                        res.end(JSON.stringify(response));
                        // logService.logger.info('hello3')
                    }
                })
            });
        }).on('error', function (err) {
            logService.logger.info('https error');
            logService.logger.info(JSON.stringify(err));
        })



        // var byteArray = new Buffer(params.base64Data)
        // b1<Buffer 61 62 63 31 32 33>
        // Buffer.prototype.toByteArray = function () {
        //     return Array.prototype.slice.call(this, 0)
        // }
        // byteArray = b1.toByteArray()

        // byteArray = [params.base64Data];



        // })
    } catch (e) {
        logService.logger.error(JSON.stringify(e), 'catch了');
        res.writeHead(500);
        res.end(JSON.stringify(e));
    } finally {

    }
})
router.post('/isRegister', function (req, res) {
    var params = req.body;
    try {
        client.execute('taobao.wisdom.member.query.exist', {
            'taobao_nick': params.taobao_nick,
            'seller_id': params.seller_id,
            'session': session
        }, function (error, response) {
            if (error) {
                logService.logger.error(JSON.stringify(error));
                res.writeHead(500);
                res.end(JSON.stringify(error));
            } else {
                logService.logger.info(JSON.stringify(response));
                res.writeHead(200);
                res.end(JSON.stringify(response));
            }
        })
    } catch (e) {
        logService.logger.error(JSON.stringify(e));
        res.writeHead(500);
        res.end(JSON.stringify(e));
    } finally {

    }
})
router.post('/getAvatar', function (req, res) {
    var params = req.body;
    client.execute('taobao.user.avatar.get', {
        'nick': params.mixnick
    }, function (error, response) {
        if (error) {
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        } else {
            res.writeHead(200);
            logService.logger.info(JSON.stringify(response));
            res.end(JSON.stringify(response));
        }
    })
})
//查询设备
router.post('/getDevice', function (req, res) {
    var apiParams = {
        'device_code': getData('markDeviceId'),
        'session': getData('markSession')
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.smartstore.device.get', apiParams, function (error, response) {
        if (error) {
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        } else {
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
    var apiParams = {
        'session': getData('kidslandSession'),
        'extraInfo': JSON.stringify({ "source": "paiyangji", "deviceId": getData('kidslandDeviceId')[0] }),
        'mix_nick': params.mixnick,
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.identity.get', apiParams, function (error, response) {
        logService.logger.info("taobao.crm.member.identity.get===>recevied");
        if (error) {
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        } else {
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
    var apiParams = {
        'session': getData('kidslandSession'),
        'extra_info': JSON.stringify({ "source": "paiyangji", "deviceId": getData('kidslandDeviceId')[0] }),
        'callback_url': params.callback_url
    };
    logService.logger.info("taobao.crm.member.joinurl.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.joinurl.get', apiParams, function (error, response) {
        logService.logger.info("taobao.crm.member.joinurl.get===>recevied");
        if (error) {
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        } else {
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
    var apiParams = {
        'session': getData('markSession'),
        'extraInfo': JSON.stringify({ "source": "paiyangji", "deviceId": getData('markDeviceId'), "itemId": 557517857975 }),
        'mix_nick': params.mixnick,
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.identity.get', apiParams, function (error, response) {
        logService.logger.info("taobao.crm.member.identity.get===>recevied");
        if (error) {
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        } else {
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
    var apiParams = {
        'session': getData('markSession'),
        'extra_info': JSON.stringify({ "source": "paiyangji", "deviceId": getData('markDeviceId'), "itemId": 557517857975 }),
        'callback_url': params.callback_url
    };
    logService.logger.info("taobao.crm.member.joinurl.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.joinurl.get', apiParams, function (error, response) {
        logService.logger.info("taobao.crm.member.joinurl.get===>recevied");
        if (error) {
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        } else {
            res.writeHead(200);
            logService.logger.info(JSON.stringify(response));
            res.end(JSON.stringify(response));
        }
    })
})

//查询该用户是否关注商家
router.post('/isBrandFollow', function (req, res) {
    var params = req.body;
    var apiParams = {
        'session': getData('kidslandSession'),
        'extraInfo': JSON.stringify({ "source": "paiyangji", "deviceId": getData('kidslandDeviceId')[0] }),
        'mix_nick': params.mixnick,
    };
    logService.logger.info("taobao.crm.member.identity.get===>sending");
    logService.logger.info(JSON.stringify(apiParams));
    client.execute('taobao.crm.member.identity.get', apiParams, function (error, response) {
        logService.logger.info("taobao.crm.member.identity.get===>recevied");
        if (error) {
            res.writeHead(500);
            logService.logger.error(JSON.stringify(error));
            res.end(JSON.stringify(error));
        } else {
            res.writeHead(200);
            logService.logger.info(JSON.stringify(response));
            res.end(JSON.stringify(response));
        }
    })
})


//发送验证码
router.post('/verticicate', function (req, res) {
    var params = req.body;
    var options = {
        method: 'POST',
        url: 'http://api.sms.cn/sms/',
        headers:
        {
            'Postman-Token': '687fbcc3-0dcc-4852-99f9-5979aab6ee7e',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Abp.TenantId': '18'
        },
        form:
        {
            ac: 'send',
            uid: 'troncell',
            pwd: '9aa2bf57779f3f56c9c18e6a0a8957ab',
            template: '439062',
            mobile: params.mobile,
            content: encodeURI(params.verticicate)
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        logService.logger.info(body);
        // res.end(JSON.stringify(body)[message]);
        res.end(body);
    });

})
module.exports = router;