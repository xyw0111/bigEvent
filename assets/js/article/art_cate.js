$(function () {
    //1.文章分类列表渲染
    initArtCateList()
    var form = layui.form
    var layer = layui.layer
    var index = null
    //2.添加文章分类
    $("#addArtCate").on("click", function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html(),
        });
    })

    //文章分类列表渲染函数封装
    function initArtCateList() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                var htmStr = template("tpl-table", res)
                $("tbody").html(htmStr)
            }
        })
    }

    //通过代理的形式 为表单绑定submit事件

    $('body').on("submit", "#form-add", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg("新增文章分类失败！")
                }
                initArtCateList()
                layer.msg("恭喜您，新增文章分类成功！")
                //关闭添加区域
                layer.close(index)
            }
        })
    })

    //通过代理的形式 
    var indexEdit = null
    $('tbody').on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html(),
        });

        var id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    //通过代理的形式 
    $('body').on("submit", "#form-edit", function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新文章分类失败！")
                }
                layer.msg("更新文章分类成功！")
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    $('tbody').on('click','.btn-delete',function () {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？',{icon:3,title:'提示'},function () {
            $.ajax({
                type:'GET',
                url:'/my/article/deletecate/'+id,
                success:function(res){
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})