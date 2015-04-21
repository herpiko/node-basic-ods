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
  after(function(){
    /* fs.remove(path); */
  });
  it("should write an ods file from buffer", function(){
    var buffer = basicOds.toBuffer(arr);
    console.log(buffer);
    fs.writeFile(path,buffer, function(){
      fs.ensureFileSync(path, function(err){
        console.log(err)
        should(err).to.be.null;
      })
    })
  });
});
