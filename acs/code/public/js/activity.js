$.ajaxSetup({
  cache: false //关闭AJAX缓存
});
(function (w) {

})(window);

Tida.ready({
  module: ["device", "media", "server", "social", "widget", "sensor", "share", "buy", "draw", "im", "calendar", 'award', 'ar'],
  debug: 1,
  combo: 0,
  console: 1
}, function (e) {
  Tida.showLoading("Loading...");
  // Tida.doAuth(true, function (data) {
  // if (data.finish) {
  // Tida.mixNick({}, function (d) {
  if (localStorage.getItem("mixNick")) {
    var mixNick = localStorage.getItem("mixNick");
    //获取 gameImageUrl taobaoID couponUrl
    $.get('https://taobao.troncell.com/api/v1/Taobao/GetGamesByUser?mixName=' + mixNick, {}, function (result) {
      Tida.hideLoading();
      if (result.status == "OK") {
        Tida.toast("OK");

        var testArr = [1, 2, 3]//已完成的任务数组
        var hasGet = false;//是否已经领取过

        $('#span').text(testArr.length)
        $('#title').attr('src', './img/mark/title2.png')
        $('#hui1').css('display', 'none')
        $('#liang1').css('display', 'block')
        if (testArr.length == 3&&!hasGet) {
          $('#go img').attr('src','./img/mark/btn3.png');
          if (localStorage.getItem("couponUrl_mark")) {
            $('#go').click(function () {
              window.location.href = localStorage.getItem("couponUrl_mark");
            })
          } else {
            alert('获取红包信息失败,请重新扫描二维码')
          }
        }else if(hasGet){
          $('#go img').attr('src','./img/mark/btn4.png');
        }
      } else {
        Tida.toast("网络故障,请刷新页面重试.");
      }
    });
  } else {
    // window.history.back();
  }

  // })
  // }
  // });
});



