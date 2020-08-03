$(function () {

    // 定义校验规则
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function (value) {
            if (value.trim().length > 6) {
                return "昵称应该输入1~6位之间！"
            }
        }
    })

    //2.初始化用户信息
    initUserInfo()

    function initUserInfo() {
        //发送ajax
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                //展示用户信息
                form.val('formUserInfo',res.data)
            }
        })
    }

    //3.重置(只接受ckick事件绑定)
    $("#btnReset").on("click", function (e) {
        //取消浏览器的默认重置操作(取消清空表单功能)
        e.preventDefault()
        //初始化用户信息
        initUserInfo()
    })

    //4.提交用户修改
    $(".layui-form").on("submit",function (e) {
        e.preventDefault()
        $.ajax({
            type:'POST',
            url: '/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg("用户信息修改失败！")
                } else {
                    layer.msg("恭喜您，用户信息修改成功！")
                    //刷新父框架里面的用户信息
                    window.parent.getUserInfo()
                }
            }
        })
    })
})