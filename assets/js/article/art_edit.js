$(function () {
    var form = layui.form
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // console.log(location.search);
    var Id = location.search.split('=')[1]
    $.ajax({
        method: 'get',
        url: '/my/article/' + Id,
        success: function (res) {
            $("[name=Id]").val(res.data.Id);
            //1.标题
            $('[name="title"]').val(res.data.title)
            //2.文章分类
            initCate(res.data.cate_id)
            //3.文章内容
            setTimeout(function () {
                tinyMCE.activeEditor.setContent(res.data.content)
            }, 1000)
            //4.文章封面
            $("#image").attr("src", baseURL + res.data.cover_img)
            // console.log(res.data.cover_img);///uploads/upload_2cf38c99e05e368aa1c75724ad53e6a8
        }
    })
    //定义加载文章分类的方法
    function initCate(cate_id) {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！")
                }
                //调用摸板引擎
                res.cate_id = cate_id;
                // console.log(res.cate_id);
                var htmlStr = template("tpl-cate", res)
                // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr)
                form.render()
            }
        })
    }
    //发布功能
    var state = '已发布'
    $("#btnSave2").on("click", function () {
        state = '草稿'
    })
    $("#form-edit").on("submit", function (e) {
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
            url: '/my/article/edit',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res)
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                //发布成功后，跳转到文章列表页
                location.href = "/article/art_list.html"
                window.parent.document.getElementById("a2").className = "layui-this"
                window.parent.document.getElementById("a3").className = ""
                
            }
        })
    }
})