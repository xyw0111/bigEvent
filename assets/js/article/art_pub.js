$(function () {
    var layer = layui.layer
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()
    initCate()
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！")
                }
                //调用摸板引擎
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //选择封面
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })
    $("#coverFile").on("change", function (e) {
        // 拿到用户选择的文件组
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //发布功能
    var state = '已发布'
    $("#btnSave2").on("click", function () {
        state = '草稿'
    })
    $("#form-add").on("submit", function (e) {
        e.preventDefault()
        var fd = new FormData(this)
        fd.append('state', state)
        // 将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // console.log(...fd);
                //ajax一定要放在回调函数里面
                //因为生成文件是耗时操作，必须保证发送ajax的时候图片已经生成
                publishArticle(fd)
                
            })
    })

    //发送发布功能ajax
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布成功后，跳转到文章列表页
                location.href = "/article/art_list.html"
                // window.parent.document.getElementById("a2").className = "layui-this"
                // window.parent.document.getElementById("a3").className = ""
                $('[href="/article/art_list.html"]').parent().click()
            }
        })
    }
})