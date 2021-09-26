const isLocalPath = require('../dist/compiler/index').isLocalPath;

let id = "./component.js";

console.log(isLocalPath(id));
