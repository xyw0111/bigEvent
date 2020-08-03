$(function () {
    //定义一个查询的参数对象，将来请求数据的时候，
    //需要将请求参数对象提交到服务器
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态，可选值有：已发布、草稿
    }

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new Date(data)
        var y = padZero(dt.getFullYear())
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    initTable()
    //渲染文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！")
                }
                // console.log(res);
                //使用摸板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initCate()
    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //为筛选表单绑定submit事件
    $("#form-search").on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            //触发jump回调的方式有两种：
            //1.点击页码的时候，会触发jump回调
            //2.只要调用了laypage.render()方法，会触发jump回调
            jump: function (obj, first) {
                //可以通过first的值，来判断是通过哪种方式，触发的jump回调
                //如果first的值为true,证明是方式2触发的，否则是方式1触发的
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //把最新的页码值赋值到q这个查询参数对象中
                q.pagenum = obj.curr;
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit;
                //根据最新的q获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        });
    }

    //通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var len = $('.btn-delete').length
        // console.log(len);
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', {icon: 3,title: '提示'}, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    if (len === 1) {
                        q.pagenum=q.pagenum===1?1:q.pagenum-1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})