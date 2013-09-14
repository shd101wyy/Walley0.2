var fs=require("fs")
var toy=require("./toy.js")
var vm=require("vm")
var util=require("util")
var readline = require('readline')
var argv = process.argv

// write string to file
var file_write = function(file_name, write_line){
    fs.writeFile(file_name, write_line, function(err) {
        if(err) {
            console.log(err);
        } else {
            //console.log("The file was saved!");
        }
    }); 
}

var file_read = function(file_name){
    var content_in_file=fs.readFileSync(file_name,"utf8")   
    return content_in_file.split('\n')
}

file_write('./file_test',"I am super handsome")