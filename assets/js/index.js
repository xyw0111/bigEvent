$(function () {
    //1.获得用户信息
    getUserInfo()
    //3.退出登录
    var layer=layui.layer
    $("#btnLogout").on("click", function () {
        //3.1提示
        layer.confirm('是否确认退出', {icon: 3,title: '提示'}, function (index) {
            //do something
            //3.2删除本地token
            localStorage.removeItem("token")
            //3.3页面跳转
            location.href = "/login.html"
            //关闭提示框
            layer.close(index);
        });
    })

    function getUserInfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            //jQuery中的ajax,专门用于设置请求头信息的设置
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function (res) {
                console.log(res.data);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                renderUser(res.data);
            }
        })
    }
    //2.封装用户渲染函数
    function renderUser(user) {
        var uname = user.nickname || user.username
        $("#welcome").html("欢迎&nbsp;&nbsp;" + uname)
        if (user.user_pic != null) {
            $(".layui-nav-img").show().attr("src", user.user_pic)
            $(".text-avatar").hide()
        } else {
            $(".layui-nav-img").hide()
            $(".text-avatar").show().html(uname[0].toUpperCase())
        }
    }

})