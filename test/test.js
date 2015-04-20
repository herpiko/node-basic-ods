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


var path = __dirname + "/test.ods";
var path2 = __dirname + "/testFromBuffer.ods";
describe("toFile", function(){
  before(function(){
    basicOds.toFile(arr,path);
  });
  /* after(function(){ */
  /*   fs.removeSync(path) */
  /* }); */
  it("should write an ods file", function(){
    fs.ensureFileSync(path, function(){
      should(err).to.not.be.ok;
    })
  });
});

/* describe("toBuffer", function(){ */
/*   /1* after(function(){ *1/ */
/*   /1*   fs.remove(path); *1/ */
/*   /1* }); *1/ */
/*   it("should write an ods file from buffer", function(){ */
/*     var buffer = basicOds.toBuffer(arr); */
/*     console.log(buffer); */
/*     fs.writeFile(path2,buffer, function(){ */
/*       fs.ensureFileSync(path2, function(err){ */
/*         console.log(err) */
/*         should(err).to.be.null; */
/*       }) */
/*     }) */
/*   }); */
/* }); */
