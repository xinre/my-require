var path = require('path');
var fs = require('fs');
var vm = require('vm');
var wrapper = [
    '(function(exports,module,require,__dirname,__filename){',
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
                console.log(fn());
            },
            json: function () {
                var script = fs.readFileSync(_this.path, 'utf8'); // 读取
                _this.exports = JSON.parse(script);
                console.log(JSON.parse(script), '666');
            }
        };
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
    var module = new Module(absolutePath);
    module.load();
    return module.exports;
}
var result = Require('./test.json');
