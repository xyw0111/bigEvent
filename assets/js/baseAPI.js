//设置路径（测试）
var baseURL = 'http://ajax.frontend.itheima.net'
//设置路径（生产）
// var baseURL='http://www.itcase.cm'

//拦截/过滤 每一次ajax请求,配置每次请求需要的路径
$.ajaxPrefilter(function (options) {
    options.url = baseURL + options.url
})