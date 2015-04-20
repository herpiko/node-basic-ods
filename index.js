var fs = require("fs-extra");
var async = require("async");
var zip = require("adm-zip");
var randomstring = require("randomstring");
var concat = require("concat-files");
var onFinished = require("on-finished");

var odsTemplateRowStart = "<table:table-row table:style-name='ro1'>";
var odsTemplateRowEnd = "</table:table-row>";
var odsTemplateCell = function(val){
  return "<table:table-cell office:value-type='string' calcext:value-type='string'><text:p>"+val+"</text:p></table:table-cell>";
}
var odsXML = "";



// TODO :
// - toBufferSync()
// - toFileSync()
// - use key as column header

var convert = function(arr, path, done){
  async.each(arr, function(item, cb){
    odsXML += odsTemplateRowStart;
    for (var key in item) {
      odsXML += odsTemplateCell(item[key]);
    }
    odsXML += odsTemplateRowEnd;
    cb();
  }, function(err){
    var tmpDir = randomstring.generate(7);
    var templateDir = __dirname + "/template";
    fs.copy(templateDir, __dirname + "/tmp/" + tmpDir, function(err){
      fs.writeFile(__dirname + "/tmp/"+tmpDir+"/xml/contentRow.xml", odsXML, function(err){
        concat([
          __dirname + "/tmp/" + tmpDir + "/xml/contentHeader.xml",
          __dirname + "/tmp/" + tmpDir + "/xml/contentRow.xml",
          __dirname + "/tmp/" + tmpDir + "/xml/contentFooter.xml"
        ], __dirname + "/tmp/" + tmpDir + "/unzipped/content.xml", function(){
          fs.remove(__dirname + "/tmp/" + tmpDir + "/xml", function(){
            var zipper = new zip();
            zipper.addLocalFolder(__dirname + "/tmp/" + tmpDir + "/unzipped");
            var buffer =  zipper.toBuffer();
            fs.remove(__dirname + "/tmp/" + tmpDir);
            done(buffer);
          });
        })
        if (err) return console.log(err); 
      });
    })
  })
}

var toBuffer = function(arr, callback){
  convert(arr, null, function(buffer){
    callback(buffer);
  });
}
module.exports = {
  toBuffer: toBuffer,
}
