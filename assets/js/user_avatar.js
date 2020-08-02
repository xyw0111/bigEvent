$(function () {
    var layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on('click', function () {
        $("#file").click()
    })

    $("#file").on('change', function (e) {
        //$("#file")[0].files
        //document.querySelector("#file").files
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg("请选择照片！")
        }
        //1.获取唯一的文件
        var file = e.target.files[0]
        //2.原生js的方法，在内存中生成一个路径
        var newImgURL = URL.createObjectURL(file)
        //3.渲染到裁剪区
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src',newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
        
    })
    //头像上传
    $("#btnUpload").on("click",function () {
        var dataURL = $image
        .cropper('getCroppedCanvas', {
          // 创建一个 Canvas 画布
          width: 100,
          height: 100
        })
            .toDataURL('image/png')
        //ajax
        $.ajax({
            type: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar:dataURL,
            },
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("头像上传成功")
                //刷新父框架中的个人资料
                window.parent.getUserInfo()
            }
        })
    })
})