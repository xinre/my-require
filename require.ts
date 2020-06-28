const path = require('path');
const fs = require('fs');

interface ModuledDefinition {
  id: string
  exports: {}
}

class Module implements ModuledDefinition {
  public id
  public exports

  constructor(outId: string) { this.id = outId }
}

function Require (filePath: string): void {
  let absolutePath = path.resolve(__dirname, filePath)
  let module = new Module(filePath)
}

let result = Require('./test.js')
