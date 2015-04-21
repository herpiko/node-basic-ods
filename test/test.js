var basicOds = require("../index.js");
var should = require("chai"). should();
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

var path = __dirname + "/testFromBuffer.ods";

describe("toBuffer", function(){
  it("should write an ods file from buffer", function(){
    basicOds.toBuffer(arr, function(buffer){
      fs.writeFile(path, buffer)
    });
  });
});
