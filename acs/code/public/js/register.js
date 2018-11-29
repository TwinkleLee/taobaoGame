(function (d, w, undefined) {
    var phoneNumber;
    var verticicate;
    var c = d.getElementById("myCanvas");
    var ctx = c.getContext("2d"), imgGotten = false, base64Data;
    
    // $(d).ready(function () {
    // $("#file").on('change', function () {
    //     var file = $("#file")[0].files[0];
    //     var reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = function (e) {
    //         base64Code = this.result;
    //         $(".avatar_tips").hide();
    //         $("#image").attr("src", base64Code);
    //         imgGotten = true;
    //     }
    // });
    // $('#file').click(function(){
    //     Tida.toast('666')
    //     Tida.photoX({
    //         param: {
    //             v: '2.0',// 得到照片后的上传方式，建议总是传入 '2.0'（需设置bizCode属性，例如 'mtopupload'。特别提示：v: '2.0' 不能简写为 v: '2'）
    //             type: 0, // 得到照片后是否自动上传，'1' 表示得到照片后自动上传，'0' 表示得到照片后不自动上传，默认为 '0'。
    //             bizCode: 'c2b-customization',// v为2.0时需要设置 bizCode 属性 业务代码
    //             needBase64: true
    //         },

    //         success: function (res) {
    //             var str = JSON.stringify(res);
    //             // alert(JSON.stringify(str));//JSON.stringify(str)为图片的url地址。
    //             // alert(str)
    //             alert(res.base64Data);
    //             imgGotten = true;
    //             base64Data = res.base64Data;
    //             $("#image").attr("src", "data:image/png;base64,"+base64Data);
    //             $('#avatar_tips').css('display','none')

    //             console.log(res);
    //         },

    //         fail: function (res) {
    //             var str = JSON.stringify(res);
    //             alert(JSON.stringify(str));//JSON.stringify(str)为图片的url地址。
    //             console.log(res);
    //         }

    //     });

    // })
    // })


    Tida.ready({
        module: ["device", "media", "server", "social", "widget", "sensor", "share", "buy", "draw", "im", "calendar", 'award', 'ar'],
        debug: 1,
        combo: 0,
        console: 1
    }, function (e) {

        $('#file').click(function () {
            Tida.photoX({
                param: {
                    v: '2.0',// 得到照片后的上传方式，建议总是传入 '2.0'（需设置bizCode属性，例如 'mtopupload'。特别提示：v: '2.0' 不能简写为 v: '2'）
                    type: 1, // 得到照片后是否自动上传，'1' 表示得到照片后自动上传，'0' 表示得到照片后不自动上传，默认为 '0'。
                    bizCode: 'c2b-customization',// v为2.0时需要设置 bizCode 属性 业务代码
                    needBase64: false
                },

                success: function (res) {
                    var str = JSON.stringify(res);
                    // alert(JSON.stringify(str));//JSON.stringify(str)为图片的url地址。
                    // alert(str)
                    // alert(res.base64Data);
                    imgGotten = true;
                    // base64Data = res.base64Data;
                    base64Data = res.resourceURL;

                    // $("#image").attr("src", "data:image/png;base64," + base64Data);
                    $("#image").attr("src", base64Data);
                    $('#avatar_tips').css('display', 'none')

                    // console.log(res);
                },

                fail: function (res) {
                    var str = JSON.stringify(res);
                    // alert(JSON.stringify(str));//JSON.stringify(str)为图片的url地址。
                    console.log(res);
                }

            });

        })

        //验证码
        $('#verticicateImage').click(function () {
            var pattern = /^1[34578]\d{9}$/;
            phoneNumber = $('#phone').val();
            if (pattern.test(phoneNumber)) {
                verticicate = '' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)

                $.post('/verticicate', {
                    mobile: phoneNumber,
                    verticicate: verticicate
                }, function (result) {
                    // alert(result)
                    // Tida.toast(JSON.parse(result).message)
                    Tida.toast("验证码已发送,60秒后可重新尝试");

                })

                //此处调用接口发送验证码
                // Tida.toast("验证码已发送,60秒后可重新尝试");
                $('#verticicateImage').css('display', 'none');
                setTimeout(() => {
                    $('#verticicateImage').css('display', 'block');
                }, 60000);
            } else {
                Tida.toast("请填写正确的手机号");
            }
        })


        //提交注册
        $(d.forms['registerForm']).on('submit', function (e) {
            e.preventDefault();
            if (phoneNumber != $('#phone').val() || verticicate != $('#verticicate').val()) {
                Tida.toast('请填写正确的验证码')
                return
            }

            var username = $("#name").val(),
                mixNick = localStorage.getItem("mixNick"), formData,
                seller_id = localStorage.getItem("taobaoID"),
                form = e.target;
            if (!imgGotten) {
                return Tida.toast("请上传头像.");
            }
            Tida.showLoading("Loading...");
            formData = new FormData(form);
            formData.append('user_nick', mixNick);
            formData.append('seller_id', seller_id);
            formData.append('base64Data', base64Data);

            $.ajax({
                url: '/doRegister',
                type: 'POST',
                data: formData,
                dataType: 'json',
                contentType: false,
                processData: false,
                success: function (result, status, xhr) {
                    Tida.hideLoading();
                    // alert(JSON.stringify(result));
                    // alert(JSON.stringify(result.result.messages.string));
                    if (result.result.success) {
                        Tida.toast('注册成功');

                        if (localStorage.getItem("mixNick") && result.result.model && localStorage.getItem("taobaoID")) {
                            var mixNick = localStorage.getItem("mixNick");
                            var memberId = result.result.model;
                            var sellerId = localStorage.getItem("taobaoID")
                            //获取 gameImageUrl taobaoID couponUrl
                            $.post('https://taobao.troncell.com/api/v1/Taobao/RegisteredFaceMember?mixName=' + mixNick + '&memberId=' + memberId + '&sellerId=' + sellerId, {}, function (result) {
                                // alert(JSON.stringify(result));
                            })

                        }

                        // window.history.back();
                        window.location.href = "/activity";
                    } else {//失败
                        if (JSON.stringify(result.result.messages.string).indexOf('没有发现人脸') > 0) {
                            Tida.toast('无法识别人脸,请选择露出额头和耳朵的照片,且不要佩戴眼镜');
                        } else {
                            Tida.toast(JSON.stringify(result.result.messages.string));
                        }
                    }
                    // Tida.hideLoading();
                    // Tida.toast('注册成功');
                    // window.history.back();
                },
                error: function (error) {
                    // alert(error);
                    
                    Tida.hideLoading();
                    Tida.toast('注册失败');
                    Tida.toast(error);
                }
            })
        })

    });

})(document, window)







