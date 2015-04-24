var fs = require("fs-extra");
var async = require("async");
var JSzip = require("jszip");
var randomstring = require("randomstring");
var concat = require("concat-files");
var onFinished = require("on-finished");

var xmlEscape = function(value) {
  if (value) {
    return value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
}

var odsTemplateRowStart = "<table:table-row table:style-name='ro1'>";
var odsTemplateRowEnd = "</table:table-row>";
var odsTemplateCell = function(val){
  return "<table:table-cell office:value-type='string' calcext:value-type='string'><text:p>" + xmlEscape(val) + "</text:p></table:table-cell>";
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
    fs.mkdir(__dirname + "/tmp/" + tmpDir, function(){
      fs.writeFile(__dirname + "/tmp/" + tmpDir + "/contentRow.xml", odsXML, function(){
        concat([
          __dirname + "/template/xml/contentHeader.xml",
          __dirname + "/tmp/" + tmpDir + "/contentRow.xml",
          __dirname + "/template/xml/contentFooter.xml"
        ], __dirname + "/tmp/" + tmpDir + "/content.xml", function(err){
          console.log(err);
          var zipper = new JSzip();
          zipper.file("content.xml", fs.readFileSync(__dirname + "/tmp/" + tmpDir + "/content.xml"));
          zipper.file("meta.xml", fs.readFileSync(__dirname + "/template/unzipped/meta.xml"));
          zipper.file("manifest.rdf", fs.readFileSync(__dirname + "/template/unzipped/manifest.rdf"));
          zipper.file("mimetype", fs.readFileSync(__dirname + "/template/unzipped/mimetype"));
          zipper.file("settings.xml", fs.readFileSync(__dirname + "/template/unzipped/settings.xml"));
          zipper.file("styles.xml", fs.readFileSync(__dirname + "/template/unzipped/styles.xml"));
          zipper.file("META-INF/manifest.xml", fs.readFileSync(__dirname + "/template/unzipped/META-INF/manifest.xml"));
          zipper.file("styles.xml", fs.readFileSync(__dirname + "/template/unzipped/styles.xml"));
          zipper.file("Configurations2/accelerator/current.xml", fs.readFileSync(__dirname + "/template/unzipped/Configurations2/accelerator/current.xml"));
          
          var base64Str = zipper.generate({type:"base64"});
          var buffer = new Buffer(base64Str, "base64");
          done(buffer);
        })
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
