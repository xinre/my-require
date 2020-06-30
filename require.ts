const path = require('path')
const fs = require('fs')
const vm = require('vm')

interface ModuledDefinition<T> {
  path: string
  exports: {}
  extend: {
    [index: string]: T
  }
  load: () => void
}

const wrapper: string[] = [
  '(function(exports,module,require,__dirname,__filename){'
  ,   
  '})'
]


class Module implements ModuledDefinition<() => void> {
  public path
  public exports
  public extend = {
    js: () => {
      const script = fs.readFileSync(this.path, 'utf8') // 读取
      const functStr = wrapper[0] + script + wrapper[1] // 包裹
      const fn = vm.runInThisContext(functStr)    // 转化为函数 这个是怎样把字符串转化为函数的？
    },
    json: () => {
      const script = fs.readFileSync(this.path, 'utf8') // 读取
      this.exports = JSON.parse(script)
      console.log(JSON.parse(script), '666')
    }
  }

  constructor(outId: string) { this.path = outId }

  load () {
    const ext = path.extname(this.path)
    this.extend[ext.slice(1)]()
  }
}

function Require (filePath: string) {
  const absolutePath = path.resolve(__dirname, filePath)  // 绝对值路径
  const module = new Module(absolutePath)
  module.load()
  return module.exports
}

let result = Require('./test.json')
