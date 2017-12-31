var Glob = require("glob");

var mg = new Glob("./dist/server/**", {}, function(err, matches){
    console.log(matches);
})