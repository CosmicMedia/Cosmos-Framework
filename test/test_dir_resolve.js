const path = require('path');

let id = "C:\\\\sdfhjdsfhdf\\dfsijdsfhufd\\dsfhgdfsghbfd\\component.js";

let src = "/test/bruh.js"


if(id.split('/')[0] == id){
    const fullPath = id.split('\\');
    console.log(fullPath);
    fullPath.splice(fullPath.length-1, 1);
    console.log(fullPath);
    console.log(path.resolve(fullPath.join('\\') + "\\" + src));
} else {
    const fullPath = id.split('/');
    console.log(fullPath);
    fullPath.splice(fullPath.length-1, 1);
    console.log(fullPath);
    console.log(path.resolve(fullPath.join('/') + "/" + src));
}
