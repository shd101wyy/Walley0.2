var x = 12
var test = function(){
	console.log(x)
}
var test2 = function(){
	var x = 15
	test()
}
test2()