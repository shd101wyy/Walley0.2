var test1 = function(){
    console.log("test1")
    console.log("test1")
    console.log("test1")
}

var testFunction = function(func_to_run){
    var start = new Date().getTime()
    func_to_run()
    var end = new Date().getTime()
    console.log("Collapse "+(end - start) + "ms")
}

testFunction(test1)

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var charIsDigit = function(input_char){
	return input_char==="0" || input_char==="1"|| input_char==="2"|| input_char==="3"|| input_char==="4"|| input_char==="5"|| input_char==="6"|| input_char==="7"|| input_char==="8"|| input_char==="9"
}

var cdr = function(arg){return arg.slice(1,arg.length)}
//Integer Float Fraction Unknown_or_Invalid
var checkTypeOfNum = function(input_str,num_of_e,num_of_dot,num_of_slash,has_digit){
    // finish
    if (input_str===""){
        if (has_digit!=true)
            return "Unknown_or_Invalid"
        else if (num_of_slash==1){
        	if (num_of_e==0 && num_of_dot==0)
            	return "Fraction"
            return "Unknown_or_Invalid"
        }
        else if (num_of_slash==0 && num_of_e==0 && num_of_dot==0)
            return "Integer"
        else if (num_of_dot==1 || num_of_e==1)
            return "Float"
        return "Unknown_or_Invalid"
    }
    else if (input_str[0]=="e")
        return checkTypeOfNum(cdr(input_str),num_of_e+1,num_of_dot,num_of_slash,has_digit)
    else if (input_str[0]==".")
        return checkTypeOfNum(cdr(input_str),num_of_e,num_of_dot+1,num_of_slash,has_digit)
    else if (input_str[0]=='/')
        return checkTypeOfNum(cdr(input_str),num_of_e,num_of_dot,num_of_slash+1,has_digit)
    else if (charIsDigit(input_str[0]))
        return checkTypeOfNum(cdr(input_str),num_of_e,num_of_dot,num_of_slash,true)
    else
        return "Unknown_or_Invalid"
}
// get type of num
var typeOfNum = function(input_str){
    if (input_str[0]=="-")
        return checkTypeOfNum(cdr(input_str),0,0,0,false)
    return checkTypeOfNum(input_str,0,0,0,false)
}

// support integer 3 float 3.0 fraction 3/4
var stringIsNumber = function(input_str){
    if (typeof(input_str)!="string")
        return false
    if (typeOfNum(input_str)!="Unknown_or_Invalid")
        return true
    return false
}


var test2 = function(n){
    var output = 1
    while(n!=1){
        output = output * n
        n = n-1
    }
    return output
}
var test3 = function(n){
    var test3_iter = function(n,r){
        if (n == 1)
            return r
        return test3_iter(n-1,r*n)
        }
    return test3_iter(n,1)
}

var start = new Date().getTime()

//console.log(isNumber("123.123"))
//console.log(typeof(123.123) === 'number')
//console.log(stringIsNumber("123.123"))
console.log(test3(12))
var end = new Date().getTime()
console.log("Collapse "+(end - start) + "ms")

