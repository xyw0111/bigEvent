$(function () {
    var form = layui.form
    var layer=layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd:function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码不能与原密码相同！'
            }
        },
        rePwd:function (value) {
            if (value !== $('[name=newPwd').val()) {
                return '再次输入的密码不一致'
            }
        }
    })
    //3.修改密码
    $(".layui-form").on('submit',function (e) {
        e.preventDefault()
        $.ajax({
            type:'POST',
            url: '/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if (res.status != 0) {
                    return layer.msg(res.message)
                } else {
                    layer.msg('恭喜您，密码修改成功！')
                    //重置表单，不能用$(this)
                    $(".layui-form")[0].reset()
                }
            }
        })
    })
})