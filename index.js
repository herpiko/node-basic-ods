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

var convert = function(arr, path){
  async.each(arr, function(item, cb){
    odsXML += odsTemplateRowStart;
    for (var key in item) {
      odsXML += odsTemplateCell(item[key]);
    }
    odsXML += odsTemplateRowEnd;
    cb();
  }, function(err){
    var tmpDir = randomstring.generate(7);
    fs.copy(__dirname + "/template", "tmp/" + tmpDir, function(){
      fs.writeFile("tmp/"+tmpDir+"/xml/contentRow.xml", odsXML, function(err){
        concat([
          "tmp/" + tmpDir + "/xml/contentHeader.xml",
          "tmp/" + tmpDir + "/xml/contentRow.xml",
          "tmp/" + tmpDir + "/xml/contentFooter.xml"
        ], "tmp/" + tmpDir + "/unzipped/content.xml", function(){
          fs.remove("tmp/" + tmpDir + "/xml", function(){
            var zipper = new zip();
            zipper.addLocalFolder("tmp/" + tmpDir + "/unzipped");
            if (path) {
              zipper.writeZip(path);
            } else {
              return zipper.toBuffer();
            }
              fs.remove(__dirname + "/tmp/" + tmpDir);
          });
        })
        if (err) return console.log(err); 
      });
    })
  })
}

var toBuffer = function(arr){
  return convert(arr, null);
}
var toFile = function(arr, path){
  return convert(arr, path);
}

module.exports = {
  toBuffer: toBuffer,
  toFile: toFile
}
