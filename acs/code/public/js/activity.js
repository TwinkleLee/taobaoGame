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

      // Tida.hideLoading();
      if (result.status == "OK") {
        // Tida.toast("OK");
        // alert(JSON.stringify(result))
        var arr = result.data;
        var a = 0, b = 0, c = 0;
        var hasGet;
        if (arr.indexOf('女王驾到') >= 0) {
          a = 1;
          $('#hui1').css('display', 'none')
          $('#liang1').css('display', 'block')
        }
        if (arr.indexOf('人脸魔镜') >= 0) {
          b = 1;
          $('#hui2').css('display', 'none')
          $('#liang2').css('display', 'block')
        }
        if (arr.indexOf('人脸试衣间') >= 0) {
          c = 1;
          $('#hui3').css('display', 'none')
          $('#liang3').css('display', 'block')
        }


        $('#span').text(a + b + c);
        if (a + b + c == 3) {
          $('#title').attr('src', './img/mark/title2.png')
        }

        if (a + b + c < 3) {
          $('#go img').attr('src', './img/mark/btn2.png');
          Tida.hideLoading();

        } else {
          $.post('https://taobao.troncell.com/api/v1/Taobao/CanAward4User?mixName=' + mixNick + '&sellerId=' + localStorage.getItem("taobaoID"), {}, function (result) {
            Tida.hideLoading();

            if (result.message.indexOf('不能') < 0) {
              // alert(result.message)
              hasGet = false;//是否已经领取过
            } else {
              // alert(result.message)
              hasGet = true;
            }
            if (!hasGet) {
              $('#go img').attr('src', './img/mark/btn3.png');
              if (localStorage.getItem("couponUrl_mark")) {
                $('#go').click(function () {
                  window.location.href = localStorage.getItem("couponUrl_mark");
                  $.post('https://taobao.troncell.com/api/v1/Taobao/AwardByUser?mixName=' + mixNick + '&sellerId=' + localStorage.getItem("taobaoID"), {}, function (result) {
                    // alert(result.message)
                  })
                })
              } else {
                Tida.toast('获取红包信息失败,请重新扫描二维码')
              }
            } else {
              $('#go img').attr('src', './img/mark/btn4.png');
            }
          })
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



