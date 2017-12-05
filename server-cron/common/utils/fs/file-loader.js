var path = require('path');
var fs = require('fs');

exports.readTextSync = function(filePath){
  if(!fs.existsSync(filePath)) throw new Error("Can't found File");
  
  var data = fs.readFileSync(filePath, 'utf8');
  return data;
}

exports.readText = function(filePath){
  if(!fs.existsSync(filePath)) throw new Error("Can't found File");

  fs.readFile(filePath, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + filePath);
    var parsedData = JSON.parse(data);
    for (var value of parsedData){
      console.log(value.btg);
    }
  });
}

function readFile(filePath){
    fs.open(filePath, 'r', function(err, fd){
      if(err) {throw err;}

      var readBuffer = new Buffer(1024),
          bufferOffset = 0,
          bufferLength = readBuffer.length,
          filePosition = 0;

          fs.read(fd, readBuffer, bufferOffset, bufferLength, filePosition, function read(err, readBytes){
          if(err) {throw err;}

          console.log("readed byte" + readBytes + '..');

          if(readBytes > 0){
              console.log(decodeURIComponent(readBuffer.slice(0, readBytes)));
          }
      });
  });
}





