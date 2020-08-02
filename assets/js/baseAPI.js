//设置路径（测试）
var baseURL = 'http://ajax.frontend.itheima.net'
//设置路径（生产）
// var baseURL='http://www.itcase.cm'

//拦截/过滤 每一次ajax请求,配置每次请求需要的路径
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url

    //判断请求路径是否包含my
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete=function (res) {
        var data = res.responseJSON
        // console.log(data);
        if (data.status == 1 && data.message == "身份认证失败！") {
            localStorage.removeItem("token")
            location.href='/login.html'
        }
    }
})