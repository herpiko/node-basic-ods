var basicOds = require("./index.js");
var fs = require("fs-extra");
var arr = [
  {
    name: "foo",
    age: 4,
  },
  {
    name: "bar",
    age: 3,
  },
]

var path = __dirname + "/coba.ods";
basicOds.toBuffer(arr, function(buffer){
  console.log(buffer);
  fs.writeFileSync(path, buffer)
});
