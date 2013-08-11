/*

	Design Virtual File System

*/

// path = ["default","a"]
// means now we are in /default/a
var Path =[]
var VirtualFileSystem={}

VirtualFileSystem = {
	// define a package
	"toy_default": 
		// define a default file
		{"run":";Toy Language\n;all you want to run should be write here\n(define x 15)\n"}
}

// file_system is like VirtualFileSystem above
// current_path is ["a","b"] -> ./a/b/
/*
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
// command只能是一个名字 不能使 /a/b这种，只能是 a
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
*/
//===================
/*
	virtual file system should be like

	{
		"package1":{
			"run":";all you want to run should be write here",
			"file1":"your content",
			"file2":"your content",
			...
		},
		"package2":{...},
		...
	}


*/
// 创建 package 到 virtual file system
var makePackage = function(virtual_file_system,package_name){
	if (package_name in virtual_file_system)
		console.log("Error... Package "+package_name + " has already existed")
	else
		virtual_file_system[package_name] = {"run":";all you want to run should be written here"}
}
// 在 package 中 创建 file 基于 file_name
var createFileInPackage = function(virtual_file_system,package_name,file_name){
	virtual_file_system[package_name][file_name]=";File Name: "
}

// return the innerHTML that ul should have
var createListForPackage = function(virtual_file_system){
	// format
	/*
	<li>
	  <img src='./Folder-icon.png'/ width="25px" height="30px">
	  		math
	</li>
	*/			  
	var output=""
	for (var i in virtual_file_system){
		output = output+"<li id=\"" + i + "\" onclick=\"clickPackageItem('" + i + "')\"><img src='./Folder-icon.png'/ width='25px' height='30px'>&nbsp;"
		output = output + i 
		output = output + "</li>"
	}
	return output

}

var createListForFiles = function(virtual_file_system){
	// format
	/*
	<li>
	  <img src='./Folder-icon.png'/ width="25px" height="30px">
	  		math
	</li>
	*/			  
	var output=""
	for (var i in virtual_file_system){
		output = output+"<li id=\"" + i + "\" onclick=\"clickFileItem('" + i + "')\"><img src='./Document-icon.png'/ width='25px' height='30px'>&nbsp;"
		output = output + i 
		output = output + "</li>"
	}
	return output

}





















