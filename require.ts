const path = require('path')
const fs = require('fs')
const vm = require('vm')

interface ModuledDefinition<T> {
  path: string
  exports: {}
  extend: {
    [index: string]: T
  }
  cache: {
    [index: string]: Module
  }
  load: () => void
}

const wrapper: string[] = [
  '(function(module){'
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
      fn(this)
    },
    json: () => {
      const script = fs.readFileSync(this.path, 'utf8') // 读取
      this.exports = JSON.parse(script)
    }
  }
  public cache = {

  }

  constructor(outId: string) { this.path = outId }

  load () {
    const ext = path.extname(this.path)
    this.extend[ext.slice(1)]()
  }
}

function Require (filePath: string) {
  const absolutePath = path.resolve(__dirname, filePath)  // 绝对值路径
  let judgeFetch = true
  fs.access(absolutePath, (err) => {
    if (err) {
      judgeFetch = false
    }
  })

  // 从这往下伪代码未测试，肯定还有更好的方法实现
  // 而且缓存总也得有个容量, 不能一直存下去
  if (judgeFetch) {
    const module = new Module(absolutePath)
    if (module.cache[absolutePath]) {
      return module.cache[absolutePath].exports
    } else {
      module.cache[absolutePath] = module
      module.load()
      return module.exports
    }
  }
}

let result = Require('./a/test.js')
