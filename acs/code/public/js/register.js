
(function(d,w,undefined){
    var c=d.getElementById("myCanvas");
    var ctx=c.getContext("2d"), imgGotten = false;
    $(d).ready(function(){
        $("#file").on('change',function(){
                var file = $("#file")[0].files[0];
                var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        base64Code=this.result;
                        $(".avatar_tips").hide();
                        $("#image").attr("src",base64Code);
                        imgGotten = true;
                      }
        });
    })  
    //提交注册
    $(d.forms['registerForm']).on('submit',function(e){
            e.preventDefault();
            var username = $("#name").val(),
                mixNick = localStorage.getItem("mixNick"),formData,
                seller_id = localStorage.getItem("taobaoID"),
                form = e.target;
            if(!imgGotten){
                return Tida.toast("请上传头像.");
            }
           Tida.showLoading("Loading..."); 
           formData = new FormData(form);
           formData.append('user_nick',mixNick);
           formData.append('seller_id',seller_id);
            $.ajax({
                url:'/doRegister',
                type:'POST',
                data:formData,
                dataType:'json',
                contentType:false,
                processData:false,
                success:function(result,status,xhr){
                    alert(JSON.stringify(result));
                    Tida.hideLoading();
                    Tida.toast('注册成功');
                    window.history.back();
                },
                error:function(error){
                    alert(JSON.stringify(error));
                    Tida.hideLoading();
                    Tida.toast('注册失败');
                }
            })     
    })
})(document,window)

