$(function () {
    //1.点击“去注册账号”的链接
    $("#link_reg").on('click', function () {
        $(".login-box").hide()
        $(".reg-box").show()
    })
    //点击“去登录”的链接
    $("#link_login").on('click', function () {
        $(".login-box").show()
        $(".reg-box").hide()
    })
    //2.从layui中获取form对象
    var form = layui.form
    //通过form.verify()函数自定义校验规则
    form.verify({
        //属性的值即可以是数组也可以是函数
        pwd: [/^\S{6,12}$/, '密码必须6到12位，且不能出现空格!'],
        //校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            // var pwd = $('.reg-box [name=password]').val()
            // if (pwd !== value) {
            //   return '两次密码不一致！'
            // }
            if ($("#reg-pwd").val() !== value) {
                return "两次密码不一致"
            }
        }
    })
    var layer = layui.layer
    //3.注册功能
    $("#form_reg").on("submit", function (e) {
        e.preventDefault()
        // console.log($("#form_reg").serialize())
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                $("#link_login").click()
                //清空表单
                $("#form_reg")[0].reset()
            }
        })
    })

    //4.登录
    $("#form_login").on("submit", function (e) {
        e.preventDefault()
        // console.log($("#form_reg").serialize())
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                //保存token
                localStorage.setItem("token",res.token)
                //页面跳转
                location.href="/index.html"
            }
        })
    })
})