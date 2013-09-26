var x = 7
var test = function(){
	var x = 8
	var test2 = function(){
		console.log(x)
	}
	test2()
}
test()