$.ajaxSetup({
    cache: false //关闭AJAX缓存
});
(function (w, undefined) {
    //获取actionId  status
    var mixNick = "", actionId, status,tenantName,
        search = window.location.search.substring(1),
        querys = [];
    querys = search.split("&");
    querys.forEach((v, i) => {
        if (v.indexOf('actionId') + 1 > 0) {
            actionId = v.replace("actionId=", "");
            localStorage.setItem('actionId', actionId);
        } else if (v.indexOf('status') + 1 > 0) {
            status = v.replace("status=", "");
            localStorage.setItem('status', status);
        }else if (v.indexOf('tenantName') + 1 > 0) {
            tenantName = v.replace("tenantName=", "");
            localStorage.setItem('tenantName', tenantName);
        }
    });
})(window);




Tida.ready({
    module: ["device", "media", "server", "social", "widget", "sensor", "share", "buy", "draw", "im", "calendar", 'award', 'ar'],
    debug: 1,
    combo: 0,
    console: 1
}, function (e) {
    Tida.doAuth(true, function (data) {
        if (data.finish) {
            Tida.mixNick({}, function (d) {
                mixNick = d.mixnick;
                localStorage.setItem("mixNick", mixNick);
                //获取 gameImageUrl taobaoID couponUrl
                $.post('https://taobao.troncell.com/api/v1/Taobao/PostDataByUser?mixName='+mixNick+"&actionId="+ localStorage.getItem('actionId'),{}, function (result) {
                    if(result.status=="OK"){
                        localStorage.setItem("taobaoID",result.data.taobaoID);
                        $("#mainImg").attr('src', result.data.gameImageUrl);
                        localStorage.setItem("couponUrl_mark",result.data.couponUrl);
                        //判断是否是人脸头像会员
                        // $.post('/isRegister', { 'taobao_nick': mixNick, 'seller_id': localStorage.getItem("taobaoID") }, function (data, status) {
                        //     if (data.result.success && data.result.model == 'false') {
                        //         $("#coupon").attr('href', "/register");
                        //     } else {
                        //         if(localStorage.getItem("couponUrl_mark")){
                        //             $("#coupon").attr('href', localStorage.getItem("couponUrl_mark"));
                        //         }else{
                        //             Tida.toast("获取红包失败"); 
                        //         }
                        //     }
                        // }, 'json')

                    }else{
                        $("#coupon").attr('href', '#');
                        Tida.toast("网络故障,请重试."); 
                    }
                });


                 //判断是否是商家会员
                 $.post('/isMarkMember', { 'mixnick': mixNick }, function (data, status) {
                    // alert("是否是商家会员:" + JSON.stringify(data));
                    if (!data.result.member_info) {
                        // $("#coupon>img").attr("src","img/kissland/coupon1.png");
                        //非会员
                        //获取注册商家会员地址
                        $.post('/getMarkRegisterUrl', { 'callback_url': window.location.href }, function (data, status) {
                            // alert("注册商家会员地址:" + JSON.stringify(data));
                            if (data.result.success == true) {
                                $("#coupon").attr('href', "https:" + data.result.result);
                            } else {
                                Tida.toast("获取商家会员注册地址失败");
                            }
                        }, 'json')
                    } else {
                        $("#coupon").attr('href', localStorage.getItem("couponUrl_mark"));
                    }
                }, 'json')
                //获取头像
                $.post('/getAvatar', { 'mixnick': mixNick }, function (data, status) {
                    $("#avatar").attr("src", data.avatar || 'img/mark/avatar.png');
                }, 'json')

            })
        }
    });
});


