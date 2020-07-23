var path = require('path');
var fs = require('fs');
var vm = require('vm');
var wrapper = [
    '(function(module){',
    '})'
];
var Module = /** @class */ (function () {
    function Module(outId) {
        var _this = this;
        this.extend = {
            js: function () {
                var script = fs.readFileSync(_this.path, 'utf8'); // 读取
                var functStr = wrapper[0] + script + wrapper[1]; // 包裹
                var fn = vm.runInThisContext(functStr); // 转化为函数 这个是怎样把字符串转化为函数的？
                fn(_this);
            },
            json: function () {
                var script = fs.readFileSync(_this.path, 'utf8'); // 读取
                _this.exports = JSON.parse(script);
            }
        };
        this.cache = {};
        this.path = outId;
    }
    Module.prototype.load = function () {
        var ext = path.extname(this.path);
        this.extend[ext.slice(1)]();
    };
    return Module;
}());
function Require(filePath) {
    var absolutePath = path.resolve(__dirname, filePath); // 绝对值路径
    var judgeFetch = true;
    fs.access(absolutePath, function (err) {
        if (err) {
            judgeFetch = false;
        }
    });
    // 从这往下伪代码未测试，肯定还有更好的方法实现
    // 而且缓存总也得有个容量, 不能一直存下去
    if (judgeFetch) {
        var module_1 = new Module(absolutePath);
        if (module_1.cache[absolutePath]) {
            return module_1.cache[absolutePath].exports;
        }
        else {
            module_1.cache[absolutePath] = module_1;
            module_1.load();
            return module_1.exports;
        }
    }
}
var result = Require('./a/test.js');
