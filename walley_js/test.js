var x = 6
var test = function(){
	var x = 1
	var test2 = function(){
		var test3 = function(){
			x = 5
		}
		test3()
	}
	test2()
	console.log(x)
}
test()
console.log(x)