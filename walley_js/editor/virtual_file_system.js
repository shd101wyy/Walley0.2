/*

	Design Virtual File System

*/

// path = ["default","a"]
// means now we are in /default/a
var Path =[]
var VirtualFileSystem={}

VirtualFileSystem = {
	// define a folder
	"default": {"a":"contentInA"},
	// define a file
	"hi": "content of Hi"
}

// file_system is like VirtualFileSystem above
// current_path is ["a","b"] -> ./a/b/
var ls = function(file_system,current_path){
	var now_in_file_system
	if (current_path.length==0)
		now_in_file_system = file_system
	else{
		now_in_file_system = file_system[current_path[0]]
		var i=1
		while(i<current_path.length){
			now_in_file_system = now_in_file_system[current_path[i]]
			i=i+1
		}
	}
	for (var i in now_in_file_system){
		console.log(i+" ")
	}
}

// return current path
var cd = function(file_system,command,current_path){
	//	 到上一层
	if (command==".."){
		current_path=current_path.slice(0,current_path.length-1)
		return current_path
	}
	// in path
	if (command in file_system){
		current_path.push(command)
		return current_path
	}
	// 没有这个地方
	else{
		console.log("Can not goto "+command)
	}
}


ls(VirtualFileSystem,["default"])







