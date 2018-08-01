var express = require('express');
var router = express.Router();
var taobao = require(process.cwd() + "/acs/code/taobao");
var getData = require(process.cwd()+'/acs/code/data/data.js');
var log = require(process.cwd()+'/acs/code/log/logService.js').logger;

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

/* GET api listing. */
router.get('/', function(req, res, next) {
    res.end("taobao-nodejs ews api is openning");
});
/**
 * 智慧门店设备创建
 * 淘宝api：taobao.smartstore.device.add
 * 参数：
 *    device_name：string 设备名称
 *    store_id：Number 门店ID
 *    os_type：string 操作系统类型 WINDOWS / ANDROID / IOS /  LINUX / OTHER
 *    device_type: string 设备类型 MALL_INTERACTIVE_GAME("MALL_INTERACTIVE_GAME", "商场大屏互动游戏"), STORE_INTERACTIVE_GAME("STORE_INTERACTIVE_GAME", "店头互动游戏"), CAMERA("CAMERA", "客流摄像头"), SHELF("SHELF", "云货架"), VR_SHELF("VR_SHELF", "VR云货架"), INTERACTIVE_SHELF("INTERACTIVE_SHELF", "互动云货架"), MAKEUP_MIRROR("MAKEUP_MIRROR", "试妆镜"), FITTING_MIRROR("FITTING_MIRROR", "试衣镜"), VENDOR("VENDOR", "售货机"), OTHER("OTHER", "OTHER")
 *    outer_code: string 商家自定义设备编码
 */
router.post('/createDevice',function(req, res, next){
  var params = req.body;
  try{
      log.info(JSON.stringify(params));
      params.session = session;
      client.execute('taobao.smartstore.device.add',params, function(error, response) {
          if(error){
                  log.error(JSON.stringify(error));
                  res.writeHead(500);
                  res.end(JSON.stringify(error));
              }else{
                  log.info(JSON.stringify(response));
                  res.writeHead(200);
                  res.end(JSON.stringify(response));
              }
      })
  }catch(e){
      log.error(JSON.stringify(e));
      res.writeHead(500);
      res.end(JSON.stringify(e));  
  }finally{

  }
});

module.exports = router;
