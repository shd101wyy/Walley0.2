/*
	JavaScript Version Toy Language
	Developed by shd101wyy
*/
// lexer and parser
// convert input_str to list
// 直接转换为 list
var parseString = function(input_str){
	var new_lexer_iter = function(input_str,result){
		if (input_str=="")
			return result
		else if (input_str[0]=="("){
			var rest_result = new_lexer_iter(cdr(input_str),[])
			result.push(rest_result[1])
			return new_lexer_iter(rest_result[0],result)
		}
		else if (input_str[0]==")")
			return [cdr(input_str),result]
		// annotation
		else if (input_str[0]==";"){
			// ; 123\n4 -> 4
			var cleanAnnotation = function (input_str){
				if (input_str=="")
					return ""
				else if (input_str[0]=="\n")
					return cdr(input_str)
				else
					return cleanAnnotation( cdr(input_str) )
			}
			return new_lexer_iter( cleanAnnotation(input_str) , result)
		}
		// delete unused string
		else if (input_str[0]==" " || input_str[0]=="\n" || input_str[0]=="\t" )
			return new_lexer_iter( cdr(input_str) , result  )
		// quote unquote quasiquote
		else if (input_str[0]=="'" || input_str[0]=="," || input_str[0]=="@" ){
			// return rest string and result string
			// [rest , result ]
			var dealWith_Quote_Unquote_Quasiquote = function (input_str , result , count_of_double_quote, count_of_bracket) {
				if (input_str=="")
					return ["",result]
				else if (count_of_bracket==0 && (input_str[0]=="\n" || input_str[0]==" "))
					return [cdr(input_str) , result ]
				else if (input_str[0]=="\"")
					return dealWith_Quote_Unquote_Quasiquote(cdr(input_str) , result+"\"" , count_of_double_quote+1 , count_of_bracket )
				else if (input_str[0]=="(" && count_of_double_quote%2==0 )
					return dealWith_Quote_Unquote_Quasiquote(cdr(input_str) , result+"(" , count_of_double_quote, count_of_bracket+1 )
				else if (input_str[0]==")" && count_of_double_quote%2==0 ){
					if (count_of_bracket==0)
						return [input_str ,result]
					return dealWith_Quote_Unquote_Quasiquote(cdr(input_str) , result+")", count_of_double_quote , count_of_bracket-1)
				}
				else
					return dealWith_Quote_Unquote_Quasiquote(cdr(input_str), result+input_str[0],count_of_double_quote,count_of_bracket)
			}
			var quote;
			if (input_str[0]=="'")
				quote = "quote"
			else if (input_str[0]==",")
				quote = "unquote"
			else
				quote = "quasiquote"

			var rest_result = dealWith_Quote_Unquote_Quasiquote(cdr(input_str) ,"" , 0, 0 )
			var _rest_ = rest_result[0]
			var _result_ = [quote,parseString(rest_result[1])[0]]
			result.push(_result_)
			return new_lexer_iter(_rest_,result)
		}
		// string is atom as well
		else if (input_str[0]=="\""){
			var dealWith_string = function(input_str,result){
				if (input_str==""){
					console.log("Invalid String")
					return ["",""]
				}
				else if (input_str[0]=='\\')
					return dealWith_string(input_str.slice(2,input_str.length), result+input_str.slice(0,2))
				else if (input_str[0]=="\"")
					return [cdr(input_str),result]
				else
					return dealWith_string(cdr(input_str),result+input_str[0])
			}

			var rest_result = dealWith_string(cdr(input_str),"")
			var _result_ = ["quote",rest_result[1]]
			result.push(_result_)
			return new_lexer_iter(rest_result[0],result)
		}
		// atom
		else{
			var getString = function(input_str,result){
				if (input_str=="")
					return ["",result]
				else if (input_str[0]=="(" || input_str[0]==" " || input_str[0]=="\t" || input_str[0]=="\n" || input_str[0]==")")
					return [input_str,result]
				else
					return getString(cdr(input_str),result+input_str[0])
			}
			var rest_result = getString(input_str,"")
			result.push(rest_result[1])
			return new_lexer_iter(rest_result[0],result)
		}
	}
	var result = new_lexer_iter(input_str,[])
	return result	
}

/*
	7 primitive functions
	quote atom eq car cdr cons cond

*/
var quote = function(arg){return arg}
var atom = function( input_str ){
	if (typeof(input_str)=="string")
		return "1"
	return "0"
}
var eq = function(arg0, arg1){
	// "" eq [] 
	if (arg0.length==0 && arg1.length==0)
		return "1"
	var type0 = typeof(arg0)
	var type1 = typeof(arg1)
	if (type0!=type1)
		return "0"
	else if (arg0==arg1)
		return "1"
	else
		return "0"
}
var car = function ( arg ){ 
	if (arg.length==0){
		console.log("Error...cannot get car of empty list")
	}
	return arg[0]
}
var cdr = function ( arg ){
	if (arg.length==0){
		console.log("Error...cannot get cdr of empty list")
	}
	return arg.slice(1,arg.length)
}
var cons = function (value1, value2){
	var type1 = typeof(value1)
	var type2 = typeof(value2)
	if (type1=="string" && type2=="string")
		return value1+value2
	else if (type2!="string"){
		var output = [value1]
		for (var i in value2)
			output.push(value2[i])
		return output
	}
	else{
		console.log("Error...Function cons param type error")
		return ""
	}
}
var cond = function(tree,env,module_name){
	if (tree.length==0)
		return "0"
	if (toy(tree[0][0],env,module_name)[0]!='0')
		return toy(tree[0][1],env,module_name)
	return cond(cdr(tree),env,module_name)
}

/*=======================================
#=======================================
#======= builtin functions =============
*/
// (quasiquote '(1 ,(+ 1 2))) -> (1 3)
var quasiquote = function(arg,env,module_name){
    var calculateQuote = function(quote_value,env,module_name){
        // a
        if (typeof(quote_value)=="string")
            return quote_value
        // [quote a]
        else if (quote_value.length!=0 && typeof(quote_value[0])==="string" && quote_value[0]=="unquote" && quote_value.length==2)
            return toy(quote_value[1],env,module_name)[0]
        else{
            output=[]
            for (var i in quote_value){
            	output.push(calculateQuote(quote_value[i],env,module_name))
            }
            return output
        }
    }
    return calculateQuote(arg,env,module_name)
}

/*
# get value of var_name in env
# assoc("x",[["x",12],["y",13]])->12
*/
var assoc = function(var_name , env){
	if (env.length==0)
		return false
	if (env[0][0]==var_name)
		return env[0][1]
	return assoc(var_name,cdr(env))
}
// [a,b] [c,d] -> [a,b,c,d]
var append = function(x,y){
    if (x.length==0)
        return y
    return cons(x[0],append(cdr(x),y))
}

var number_ = function (value){
    if (stringIsNumber(value))
        return "1"
    return "0"
}

var display_ = function(value){
    /*
        convert
        [stms [+ a b]]
        to
        (stms (+ a b))
        */
    var convertArrayToString = function(arr){
        var output="("
        var i=0
        while (i<arr.length){
        	if (typeof(arr[i])=="string")
        		output = output+arr[i]+" "
        	else
        		output = output + convertArrayToString(arr[i])+" "
        	i=i+1
        }
        return output+")"
	}
    if (typeof(value)=="string")
        console.log(value)
    else
        console.log(convertArrayToString(value))
    return ""
}



var printArray = function(list){
	var convert_array_to_string = function(list){
		var output;
		if (typeof(list)!="object"){
			output = "'"+list+"'"
		}
		else{
			output = "[ "
			var i=0
			while (i<list.length-1){
				output = output + convert_array_to_string(list[i])
				output = output+", "
				i=i+1
			}
			if (list.length!=0)
				output = output + convert_array_to_string(list[i])
			output = output+" ]"
		}
		return output
	}
	console.log(convert_array_to_string(list))
}

// check char is digit
var charIsDigit = function(input_char){
	return input_char==="0" || input_char==="1"|| input_char==="2"|| input_char==="3"|| input_char==="4"|| input_char==="5"|| input_char==="6"|| input_char==="7"|| input_char==="8"|| input_char==="9"
}
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

var str=function(input_s){return input_s+""}
var len=function(obj){return obj.length}
// ...
//
//=======================================

var toy_language = function(trees,env,module_name){
    if (trees.length==0)
        return env
    else
        return toy_language(cdr(trees), toy(car(trees),env,module_name)[1] , module_name )
}

// TRY FUNCTIONAL PROGRAMMING, without global params
// [return_value,env]
var toy = function(tree,env,module_name){
	if (typeof(module_name)==="undefined")
		module_name = ""
    // number
    //if stringIsNumber(tree):
    //    return [tree,env]
    // atom
    else if (typeof(tree)=="string")
        return [assoc(tree,env),env]
    else
        if (typeof(tree[0])=='string'){
            // seven primitive functions
            if (tree[0]=="quote")
                return [tree[1],env]
            else if (tree[0]=="atom?")
                return [atom(toy(tree[1],env,module_name)[0]),env]
            else if (tree[0]=="eq")
                return [eq(toy(tree[1],env,module_name)[0],toy(tree[2],env,module_name)[0]),env]
            else if (tree[0]=="car")
                return [car(toy(tree[1],env,module_name)[0]),env]
            else if (tree[0]=="cdr")
                return [cdr(toy(tree[1],env,module_name)[0]),env]
            else if (tree[0]=="cons")
                return [cons(toy(tree[1],env,module_name)[0],toy(tree[2],env,module_name)[0]),env]
            else if (tree[0]=="cond")
                return cond(cdr(tree),env,module_name)
            // add + - * / functions to calculate two numbers
            else if (tree[0]=="+" || tree[0]=="-" || tree[0]=="*" || tree[0]=="/")
                return [str(eval(toy(tree[1],env,module_name)[0]+tree[0]+toy(tree[2],env,module_name)[0])),env]
            else if (tree[0]=="__LT__"){
                value1=toy(tree[1],env,module_name)[0]
                if (stringIsNumber(value1))
                    value1=eval(value1)
                value2=toy(tree[2],env,module_name)[0]
                if (stringIsNumber(value2))
                    value2=eval(value2)

                if (typeof(value1)!=typeof(value2))
                	return ["0",env]
                if (value1<value2)
                    return ["1",env]
                else
                    return ["0",env]    
            }
            else if (tree[0]=="__OR__"){
                value1=toy(tree[1],env,module_name)[0]
                if (value1!="0")
                    return "1"
                value2=toy(tree[2],env,module_name)[0]
                if (value2!="0")
                    return "1"
                return "0"
            }
            else if (tree[0]=="__AND__"){
                value1=toy(tree[1],env,module_name)[0]
                if (value1=="0")
                    return "0"
                value2=toy(tree[2],env,module_name)[0]
                if (value2=="0")
                    return "0"
                return "1"
            }
            // (define var_name var_value)
            else if (tree[0]=="define"){
                var var_existed = function(var_name,env){
                    if (env.length==0)
                        return false
                    else if (var_name == env[0][0])
                        return true
                    return var_existed(var_name,cdr(env))
                }
                if (module_name=="")
                    var_name = tree[1]
                else
                    var_name = module_name+"."+tree[1]
                if (var_existed(var_name,env)){
                    console.log( "Error... "+var_name+" with value has been defined")
                    console.log( "In toy language, it is not allowed to redefine var.")
                    console.log( "While not recommended to change value of a defined var,")
                    console.log( "you could use set! function to modify the value.")
                    return ["",env]
                }
                return_obj = toy(tree[2],env,module_name)
                var_value = return_obj[0]
                if (var_value == false){
                	console.log("Invalid value")
                	console.log(tree[2])
                }
                new_env = return_obj[1]
                return [var_value,cons([var_name,var_value],new_env)]
            }
            else if (tree[0]=="lambda")
                return [tree,env]
            else if (tree[0]=="begin")
                return toy(tree[tree.length-1], toy_language(tree.slice(1,tree.length-1),env,module_name),module_name)
            else if (tree[0]=="apply")
                return toy(cons(tree[1],toy(tree[2],env,module_name)[0]),env,module_name)
            else if (tree[0]=="eval")
                return toy(toy(tree[1],env,module_name)[0],env,module_name)
            else if (tree[0]=="quasiquote")
                return [quasiquote(tree[1],env,module_name),env]
            /*
            # load module
            # (load a) will import content in a with module_name ""
            # (load a a) will import content in a with module_name "a"
            # eg:
            # a -> (define x 12)
            # (load a a) will cons ((a.x 12)) as env
            # (load a) will cons ((x 12)) as env
            */
            else if (tree[0]=="load"){
                if (tree.length==2)
                    module_name = ""
                else
                    module_name = tree[2]
                return toy_language(VirtualFileSystem[tree[1]], env , module_name)
         	}
            // io function
            else if (tree[0]=="display")
                return [display_(toy(tree[1],env,module_name)[0]),env]
            // show defined variables in env
            else if (tree[0]=="show_env"){
            	printArray(env)
            	return ["",env]
            }
            //procedure value
            else{
                value = assoc(tree[0],env)
                if (value == false){
                    console.log("Error...Undefined function "+tree[0])
                    return ["",env]
                }
                return toy(cons(value , cdr(tree)),env,module_name)
            }
        }
        else{
            if (tree[0][0]=="lambda"){
                // ["a","b"] ["1","2"] [["c","12"]] -> [["a","1"],["b","2"],["c","12"]]
                var pair_params = function(names,params,env,module_name){
                    if (names.length==0)
                        return env
                    else
                        return cons([names[0],toy(params[0],env,module_name)[0]],pair_params(cdr(names),cdr(params),env,module_name))
                }
                return_array = toy(tree[0][2], pair_params(tree[0][1],cdr(tree),env,module_name),module_name)
                return_value = return_array[0]
                return_env = return_array[1]
                return[return_value, return_env.slice(return_env.length-env.length,return_env.length)]
            }
            else
                return toy(cons(toy(tree[0],env,module_name) , cdr(tree)), env,module_name)
        }
}

var ENV = [ [ '/_array', [ 'lambda', [ 'list' ], [ '/_array_iter', [ 'cdr', 'list' ], [ 'car', 'list' ] ] ] ], [ '/_array_iter', [ 'lambda', [ 'list', 'result' ], [ 'cond', [ [ 'null?', 'list' ], 'result' ], [ [ 'quote', '1' ], [ '/_array_iter', [ 'cdr', 'list' ], [ '$/$', 'result', [ 'car', 'list' ] ] ] ] ] ] ], [ '*_array', [ 'lambda', [ 'list' ], [ '*_array_iter', [ 'cdr', 'list' ], [ 'car', 'list' ] ] ] ], [ '*_array_iter', [ 'lambda', [ 'list', 'result' ], [ 'cond', [ [ 'null?', 'list' ], 'result' ], [ [ 'quote', '1' ], [ '*_array_iter', [ 'cdr', 'list' ], [ '$*$', 'result', [ 'car', 'list' ] ] ] ] ] ] ], [ '-_array', [ 'lambda', [ 'list' ], [ 'cond', [ [ 'null?', [ 'cdr', 'list' ] ], [ 'cons', [ 'quote', '-' ], [ 'car', 'list' ] ] ], [ [ 'quote', '1' ], [ '-_array_iter', [ 'cdr', 'list' ], [ 'car', 'list' ] ] ] ] ] ], [ '-_array_iter', [ 'lambda', [ 'list', 'result' ], [ 'cond', [ [ 'null?', 'list' ], 'result' ], [ [ 'quote', '1' ], [ '-_array_iter', [ 'cdr', 'list' ], [ '$-$', 'result', [ 'car', 'list' ] ] ] ] ] ] ], [ '+_array', [ 'lambda', [ 'list' ], [ '+_array_iter', [ 'cdr', 'list' ], [ 'car', 'list' ] ] ] ], [ '+_array_iter', [ 'lambda', [ 'list', 'result' ], [ 'cond', [ [ 'null?', 'list' ], 'result' ], [ [ 'quote', '1' ], [ '+_array_iter', [ 'cdr', 'list' ], [ '$+$', 'result', [ 'car', 'list' ] ] ] ] ] ] ], [ '$/$', [ 'lambda', [ 'num1', 'num2' ], [ 'cond', [ [ '__OR__', [ 'eq', [ 'quote', 'Float' ], [ 'typeOfNum', 'num1' ] ], [ 'eq', [ 'quote', 'Float' ], [ 'typeOfNum', 'num2' ] ] ], [ '/', 'num1', 'num2' ] ], [ [ 'quote', '1' ], [ 'make_rat_string', [ 'div-rat', [ 'format_number', 'num1' ], [ 'format_number', 'num2' ] ] ] ] ] ] ], [ '$*$', [ 'lambda', [ 'num1', 'num2' ], [ 'cond', [ [ '__OR__', [ 'eq', [ 'quote', 'Fraction' ], [ 'typeOfNum', 'num1' ] ], [ 'eq', [ 'quote', 'Fraction' ], [ 'typeOfNum', 'num2' ] ] ], [ 'make_rat_string', [ 'mul-rat', [ 'format_number', 'num1' ], [ 'format_number', 'num2' ] ] ] ], [ [ 'quote', '1' ], [ '*', 'num1', 'num2' ] ] ] ] ], [ '$-$', [ 'lambda', [ 'num1', 'num2' ], [ 'cond', [ [ '__OR__', [ 'eq', [ 'quote', 'Fraction' ], [ 'typeOfNum', 'num1' ] ], [ 'eq', [ 'quote', 'Fraction' ], [ 'typeOfNum', 'num2' ] ] ], [ 'make_rat_string', [ 'sub-rat', [ 'format_number', 'num1' ], [ 'format_number', 'num2' ] ] ] ], [ [ 'quote', '1' ], [ '-', 'num1', 'num2' ] ] ] ] ], [ '$+$', [ 'lambda', [ 'num1', 'num2' ], [ 'cond', [ [ '__OR__', [ 'eq', [ 'quote', 'Fraction' ], [ 'typeOfNum', 'num1' ] ], [ 'eq', [ 'quote', 'Fraction' ], [ 'typeOfNum', 'num2' ] ] ], [ 'make_rat_string', [ 'add-rat', [ 'format_number', 'num1' ], [ 'format_number', 'num2' ] ] ] ], [ [ 'quote', '1' ], [ '+', 'num1', 'num2' ] ] ] ] ], [ 'number?', [ 'lambda', [ 'input_str' ], [ 'number?_accordint_to_type', [ 'typeOfNum', 'input_str' ] ] ] ], [ 'number?_accordint_to_type', [ 'lambda', [ 'type' ], [ 'cond', [ [ 'eq', 'type', [ 'quote', 'Float' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'type', [ 'quote', 'Fraction' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'type', [ 'quote', 'Integer' ] ], [ 'quote', '1' ] ], [ [ 'quote', '1' ], [ 'quote', '0' ] ] ] ] ], [ 'typeOfNum', [ 'lambda', [ 'input_str' ], [ 'cond', [ [ 'eq', [ 'quote', '0' ], [ 'atom?', 'input_str' ] ], [ 'quote', '0' ] ], [ [ 'eq', [ 'car', 'input_str' ], [ 'quote', '-' ] ], [ 'checkTypeOfNum', [ 'cdr', 'input_str' ], [ 'quote', '0' ], [ 'quote', '0' ], [ 'quote', '0' ], [ 'quote', '0' ] ] ], [ [ 'quote', '1' ], [ 'checkTypeOfNum', 'input_str', [ 'quote', '0' ], [ 'quote', '0' ], [ 'quote', '0' ], [ 'quote', '0' ] ] ] ] ] ], [ 'checkTypeOfNum', [ 'lambda', [ 'input_str', 'num_of_e', 'num_of_.', 'num_of_/', 'hasDigit' ], [ 'cond', [ [ 'null?', 'input_str' ], [ 'cond', [ [ 'eq', 'hasDigit', [ 'quote', '0' ] ], [ 'quote', 'Unknown_or_Invalid' ] ], [ [ 'eq', 'num_of_/', [ 'quote', '1' ] ], [ 'cond', [ [ 'eq', 'num_of_e', [ 'quote', '0' ] ], [ 'cond', [ [ 'eq', 'num_of_.', [ 'quote', '0' ] ], [ 'quote', 'Fraction' ] ], [ [ 'quote', '1' ], [ 'quote', 'Unknown_or_Invalid' ] ] ] ], [ [ 'quote', '1' ], [ 'quote', 'Unknown_or_Invalid' ] ] ] ], [ [ '__AND__', [ 'eq', 'num_of_/', [ 'quote', '0' ] ], [ '__AND__', [ 'eq', 'num_of_e', [ 'quote', '0' ] ], [ 'eq', 'num_of_.', [ 'quote', '0' ] ] ] ], [ 'quote', 'Integer' ] ], [ [ '__OR__', [ 'eq', 'num_of_e', [ 'quote', '1' ] ], [ 'eq', 'num_of_.', [ 'quote', '1' ] ] ], [ 'quote', 'Float' ] ], [ [ 'quote', '1' ], [ 'quote', 'Unknown_or_Invalid' ] ] ] ], [ [ 'eq', [ 'car', 'input_str' ], [ 'quote', 'e' ] ], [ 'checkTypeOfNum', [ 'cdr', 'input_str' ], [ '+', 'num_of_e', [ 'quote', '1' ] ], 'num_of_.', 'num_of_/', 'hasDigit' ] ], [ [ 'eq', [ 'car', 'input_str' ], [ 'quote', '.' ] ], [ 'checkTypeOfNum', [ 'cdr', 'input_str' ], 'num_of_e', [ '+', 'num_of_.', [ 'quote', '1' ] ], 'num_of_/', 'hasDigit' ] ], [ [ 'eq', [ 'car', 'input_str' ], [ 'quote', '/' ] ], [ 'checkTypeOfNum', [ 'cdr', 'input_str' ], 'num_of_e', 'num_of_.', [ '+', 'num_of_/', [ 'quote', '1' ] ], 'hasDigit' ] ], [ [ '这个数字是整数', [ 'car', 'input_str' ] ], [ 'checkTypeOfNum', [ 'cdr', 'input_str' ], 'num_of_e', 'num_of_.', 'num_of_/', [ 'quote', '1' ] ] ], [ [ 'quote', '1' ], [ 'quote', 'Unknown_or_Invalid' ] ] ] ] ], [ '这个数字是整数', [ 'lambda', [ 'value' ], [ 'cond', [ [ 'eq', 'value', [ 'quote', '0' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '1' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '2' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '3' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '4' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '5' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '6' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '7' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '8' ] ], [ 'quote', '1' ] ], [ [ 'eq', 'value', [ 'quote', '9' ] ], [ 'quote', '1' ] ], [ [ 'quote', '1' ], [ 'quote', '0' ] ] ] ] ], [ 'format_number', [ 'lambda', [ 'num' ], [ 'cons', [ 'get_numerator', 'num' ], [ 'cons', [ 'get_denominator', 'num' ], [ 'quote', [  ] ] ] ] ] ], [ 'get_denominator', [ 'lambda', [ 'num' ], [ 'cond', [ [ 'null?', 'num' ], [ 'quote', '1' ] ], [ [ 'eq', [ 'car', 'num' ], [ 'quote', '/' ] ], [ 'cdr', 'num' ] ], [ [ 'quote', '1' ], [ 'get_denominator', [ 'cdr', 'num' ] ] ] ] ] ], [ 'get_numerator', [ 'lambda', [ 'num' ], [ 'cond', [ [ 'null?', 'num' ], [ 'quote', '' ] ], [ [ 'eq', [ 'car', 'num' ], [ 'quote', '/' ] ], [ 'quote', '' ] ], [ [ 'quote', '1' ], [ 'cons', [ 'car', 'num' ], [ 'get_numerator', [ 'cdr', 'num' ] ] ] ] ] ] ], [ 'make_rat_string', [ 'lambda', [ 'rat' ], [ 'cons', [ 'car', 'rat' ], [ 'cons', [ 'quote', '/' ], [ 'cadr', 'rat' ] ] ] ] ], [ 'denom', [ 'lambda', [ 'x' ], [ 'cadr', 'x' ] ] ], [ 'numer', [ 'lambda', [ 'x' ], [ 'car', 'x' ] ] ], [ 'make-rat', [ 'lambda', [ 'n', 'd' ], [ '约分函数根据gcd', 'n', 'd', [ 'gcd', 'n', 'd' ] ] ] ], [ '约分函数根据gcd', [ 'lambda', [ 'n', 'd', 'g' ], [ 'cons', [ 'removeDot', [ '/', 'n', 'g' ] ], [ 'cons', [ 'removeDot', [ '/', 'd', 'g' ] ], [ 'quote', [  ] ] ] ] ] ], [ 'removeDot', [ 'lambda', [ 'num' ], [ 'removeDot_iter', 'num' ] ] ], [ 'removeDot_iter', [ 'lambda', [ 'num' ], [ 'cond', [ [ 'null?', 'num' ], [ 'quote', '' ] ], [ [ 'eq', [ 'car', 'num' ], [ 'quote', '.' ] ], [ 'quote', '' ] ], [ [ 'quote', '1' ], [ 'cons', [ 'car', 'num' ], [ 'removeDot_iter', [ 'cdr', 'num' ] ] ] ] ] ] ], [ 'equal-rat?', [ 'lambda', [ 'x', 'y' ], [ '=', [ '*', [ 'numer', 'x' ], [ 'denom', 'y' ] ], [ '*', [ 'denom', 'x' ], [ 'numer', 'y' ] ] ] ] ], [ 'div-rat', [ 'lambda', [ 'x', 'y' ], [ 'make-rat', [ '*', [ 'numer', 'x' ], [ 'denom', 'y' ] ], [ '*', [ 'denom', 'x' ], [ 'numer', 'y' ] ] ] ] ], [ 'mul-rat', [ 'lambda', [ 'x', 'y' ], [ 'make-rat', [ '*', [ 'numer', 'x' ], [ 'numer', 'y' ] ], [ '*', [ 'denom', 'x' ], [ 'denom', 'y' ] ] ] ] ], [ 'sub-rat', [ 'lambda', [ 'x', 'y' ], [ 'make-rat', [ '-', [ '*', [ 'numer', 'x' ], [ 'denom', 'y' ] ], [ '*', [ 'numer', 'y' ], [ 'denom', 'x' ] ] ], [ '*', [ 'denom', 'x' ], [ 'denom', 'y' ] ] ] ] ], [ 'add-rat', [ 'lambda', [ 'x', 'y' ], [ 'make-rat', [ '+', [ '*', [ 'numer', 'x' ], [ 'denom', 'y' ] ], [ '*', [ 'numer', 'y' ], [ 'denom', 'x' ] ] ], [ '*', [ 'denom', 'x' ], [ 'denom', 'y' ] ] ] ] ], [ 'gcd', [ 'lambda', [ 'a', 'b' ], [ 'cond', [ [ 'eq', 'b', [ 'quote', '0' ] ], 'a' ], [ [ 'quote', '1' ], [ 'gcd', 'b', [ 'remainder', 'a', 'b' ] ] ] ] ] ], [ 'remainder', [ 'lambda', [ 'a', 'b' ], [ 'cond', [ [ '__LT__', 'a', 'b' ], 'a' ], [ [ 'quote', '1' ], [ 'remainder', [ '-', 'a', 'b' ], 'b' ] ] ] ] ], [ 'toy', [ 'lambda', [ 'expr', 'env', 'module_name' ], [ 'cond', [ [ 'number?', 'expr' ], [ 'cons_env', 'expr', 'env' ] ], [ [ 'atom?', 'expr' ], [ 'cons', [ 'assoc', 'expr', 'env' ], [ 'cons', 'env', [ 'quote', [  ] ] ] ] ], [ [ 'atom?', [ 'car', 'expr' ] ], [ 'cond', [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'quote' ] ], [ 'cons', [ 'cadr', 'expr' ], [ 'cons', 'env', [ 'quote', [  ] ] ] ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'atom?' ] ], [ 'cons_env', [ 'atom?', [ 'car', [ 'toy', [ 'cadr', 'expr' ], 'env', 'module_name' ] ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'eq' ] ], [ 'cons_env', [ 'eq', [ 'car', [ 'toy', [ 'cadr', 'expr' ], 'env', 'module_name' ] ], [ 'car', [ 'toy', [ 'caddr', 'expr' ], 'env', 'module_name' ] ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'car' ] ], [ 'cons_env', [ 'car', [ 'car', [ 'toy', [ 'cadr', 'expr' ], 'env', 'module_name' ] ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'cdr' ] ], [ 'cons_env', [ 'cdr', [ 'car', [ 'toy', [ 'cadr', 'expr' ], 'env', 'module_name' ] ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'cons' ] ], [ 'cons_env', [ 'cons', [ 'car', [ 'toy', [ 'car', [ 'cdr', 'expr' ] ], 'env', 'module_name' ] ], [ 'car', [ 'toy', [ 'car', [ 'cdr', [ 'cdr', 'expr' ] ] ], 'env', 'module_name' ] ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'cond' ] ], [ 'eval_cond', [ 'cdr', 'expr' ], 'env', 'module_name' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'define' ] ], [ 'define_procedure', [ 'var_name_update', [ 'cadr', 'expr' ], 'module_name' ], [ 'caddr', 'expr' ], 'env', 'module_name' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'set!' ] ], [ 'set!_procedure', [ 'cadr', 'expr' ], [ 'toy', [ 'caddr', 'expr' ], 'env', 'module_name' ] ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'lambda' ] ], [ 'cons_env', 'expr', 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'begin' ] ], [ 'eval_begin', [ 'cdr', 'expr' ], 'env', 'module_name' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'let' ] ], [ 'let_procedure', [ 'toy', [ 'caddr', 'expr' ], [ 'eval_let', [ 'cadr', 'expr' ], 'env', 'module_name' ], 'module_name' ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'apply' ] ], [ 'toy', [ 'cons', [ 'cadr', 'expr' ], [ 'cdr', [ 'cdr', 'expr' ] ] ], 'env', 'module_name' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'eval' ] ], [ 'toy', [ 'car', [ 'toy', [ 'cadr', 'expr' ], 'env', 'module_name' ] ], 'env', 'module_name' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', '+' ] ], [ 'cons_env', [ '+_array', [ 'evlis', [ 'cdr', 'expr' ], 'env', 'module_name' ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', '-' ] ], [ 'cons_env', [ '-_array', [ 'evlis', [ 'cdr', 'expr' ], 'env', 'module_name' ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', '*' ] ], [ 'cons_env', [ '*_array', [ 'evlis', [ 'cdr', 'expr' ], 'env', 'module_name' ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', '/' ] ], [ 'cons_env', [ '/_array', [ 'evlis', [ 'cdr', 'expr' ], 'env', 'module_name' ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', '__LT__' ] ], [ 'cons_env', [ '__LT__', [ 'car', [ 'toy', [ 'car', [ 'cdr', 'expr' ] ], 'env', 'module_name' ] ], [ 'car', [ 'toy', [ 'car', [ 'cdr', [ 'cdr', 'expr' ] ] ], 'env', 'module_name' ] ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'display' ] ], [ 'cons_env', [ 'display', [ 'car', [ 'toy', [ 'cadr', 'expr' ], 'env', 'module_name' ] ] ], 'env' ] ], [ [ 'eq', [ 'car', 'expr' ], [ 'quote', 'if' ] ], [ 'cond', [ [ 'car', [ 'toy', [ 'cadr', 'expr' ], 'env', 'module_name' ] ], [ 'toy', [ 'caddr', 'expr' ], 'env', 'module_name' ] ], [ [ 'quote', '1' ], [ 'toy', [ 'car', [ 'cdr', [ 'cdr', [ 'cdr', 'expr' ] ] ] ], 'env', 'module_name' ] ] ] ], [ [ 'quote', '1' ], [ 'procedure_procedure', [ 'car', 'expr' ], [ 'cdr', 'expr' ], 'env', 'module_name' ] ] ] ], [ [ 'eq', [ 'caar', 'expr' ], [ 'quote', 'lambda' ] ], [ 'lambda_procedure', [ 'toy', [ 'caddr', [ 'car', 'expr' ] ], [ 'append', [ 'pair_params', [ 'cadr', [ 'car', 'expr' ] ], [ 'cdr', 'expr' ], 'env', 'module_name' ], 'env' ], 'module_name' ], 'env', 'module_name' ] ] ] ] ], [ 'eval_cond', [ 'lambda', [ 'expr', 'env', 'module_name' ], [ 'cond', [ [ 'car', [ 'toy', [ 'caar', 'expr' ], 'env', 'module_name' ] ], [ 'toy', [ 'cadar', 'expr' ], 'env', 'module_name' ] ], [ [ 'quote', '1' ], [ 'eval_cond', [ 'cdr', 'expr' ], 'env', 'module_name' ] ] ] ] ], [ 'lambda_procedure', [ 'lambda', [ 'return_obj', 'env', 'module_name' ], [ 'deal_with_return_obj_for_lambda_procedure', [ 'car', 'return_obj' ], [ 'cadr', 'return_obj' ], 'env' ] ] ], [ 'deal_with_return_obj_for_lambda_procedure', [ 'lambda', [ 'return_value', 'return_env', 'env' ], [ 'cons', 'return_value', [ 'cons', [ 'restore_env', 'env', 'return_env', 'return_env' ], [ 'quote', [  ] ] ] ] ] ], [ 'pair_params', [ 'lambda', [ 'names', 'params', 'env', 'module_name' ], [ 'cond', [ [ 'null?', 'names' ], [ 'quote', [  ] ] ], [ [ 'eq', [ 'car', 'names' ], [ 'quote', '.' ] ], [ 'cons', [ 'cons', [ 'cadr', 'names' ], [ 'cons', [ 'evlis', 'params', 'env', 'module_name' ], [ 'quote', [  ] ] ] ], [ 'quote', [  ] ] ] ], [ [ 'eq', [ 'car', 'names' ], [ 'quote', '&' ] ], [ 'cons', [ 'cons', [ 'cadr', 'names' ], [ 'cons', 'params', [ 'quote', [  ] ] ] ], [ 'quote', [  ] ] ] ], [ [ 'quote', '1' ], [ 'cons', [ 'cons', [ 'car', 'names' ], [ 'cons', [ 'car', [ 'toy', [ 'car', 'params' ], 'env', 'module_name' ] ], [ 'quote', [  ] ] ] ], [ 'pair_params', [ 'cdr', 'names' ], [ 'cdr', 'params' ], 'env', 'module_name' ] ] ] ] ] ], [ 'evlis', [ 'lambda', [ 'params', 'env', 'module_name' ], [ 'cond', [ [ 'null?', 'params' ], [ 'quote', [  ] ] ], [ [ 'quote', '1' ], [ 'cons', [ 'car', [ 'toy', [ 'car', 'params' ], 'env', 'module_name' ] ], [ 'evlis', [ 'cdr', 'params' ], 'env', 'module_name' ] ] ] ] ] ], [ 'procedure_procedure', [ 'lambda', [ 'func_name', 'params', 'env', 'module_name' ], [ 'cond', [ [ 'null?', 'env' ], [ 'display', [ 'cons', [ 'quote', 'Undefined Function ' ], 'func_name' ] ] ], [ [ 'eq', 'func_name', [ 'car', [ 'car', 'env' ] ] ], [ 'toy', [ 'cons', [ 'cadar', 'env' ], 'params' ], 'env', 'module_name' ] ], [ [ 'quote', '1' ], [ 'procedure_procedure', 'func_name', 'params', [ 'cdr', 'env' ], 'module_name' ] ] ] ] ], [ 'eval_begin', [ 'lambda', [ 'expr', 'env', 'module_name' ], [ 'cond', [ [ 'null?', 'expr' ], [ 'display', [ 'quote', 'Error...begin function params num error' ] ] ], [ [ 'null?', [ 'cdr', 'expr' ] ], [ 'toy', [ 'car', 'expr' ], 'env', 'module_name' ] ], [ [ 'quote', '1' ], [ 'eval_begin', [ 'cdr', 'expr' ], [ 'cadr', [ 'toy', [ 'car', 'expr' ], 'env', 'module_name' ] ], 'module_name' ] ] ] ] ], [ 'let_procedure', [ 'lambda', [ 'return_obj', 'env' ], [ 'cons', [ 'car', 'return_obj' ], [ 'cons', [ 'restore_env', 'env', [ 'cadr', 'return_obj' ], [ 'cadr', 'return_obj' ] ], [ 'quote', [  ] ] ] ] ] ], [ 'restore_env', [ 'lambda', [ 'old_env', 'new_env', 'new_env_copy' ], [ 'cond', [ [ 'null?', 'old_env' ], [ 'cond', [ [ 'null?', 'new_env' ], 'new_env_copy' ], [ [ 'quote', '1' ], [ 'restore_env', 'old_env', [ 'cdr', 'new_env' ], [ 'cdr', 'new_env_copy' ] ] ] ] ], [ [ 'quote', '1' ], [ 'restore_env', [ 'cdr', 'old_env' ], [ 'cdr', 'new_env' ], 'new_env_copy' ] ] ] ] ], [ 'eval_let', [ 'lambda', [ 'expr', 'env', 'module_name' ], [ 'cond', [ [ 'null?', 'expr' ], 'env' ], [ [ 'quote', '1' ], [ 'eval_let', [ 'cdr', 'expr' ], [ 'cons', [ 'cons', [ 'caar', 'expr' ], [ 'cons', [ 'car', [ 'toy', [ 'cadar', 'expr' ], 'env', 'module_name' ] ], [ 'quote', [  ] ] ] ], 'env' ], 'module_name' ] ] ] ] ], [ 'set!_procedure', [ 'lambda', [ 'var_name', 'return_obj' ], [ 'cons', [ 'car', 'return_obj' ], [ 'cons', [ 'set_index', 'var_name', [ 'car', 'return_obj' ], [ 'cadr', 'return_obj' ] ], [ 'quote', [  ] ] ] ] ] ], [ 'set_index', [ 'lambda', [ 'var_name', 'var_value', 'env' ], [ 'cond', [ [ 'null?', 'env' ], [ [ 'lambda', [ 'a', 'b' ], 'b' ], [ 'display', [ 'cons', [ 'cons', [ 'quote', 'Error...In function set! ' ], 'var_name' ], [ 'quote', ' does not exist' ] ] ], [ 'quote', [  ] ] ] ], [ [ 'eq', 'var_name', [ 'caar', 'env' ] ], [ 'cons', [ 'cons', 'var_name', [ 'cons', 'var_value', [ 'quote', [  ] ] ] ], [ 'cdr', 'env' ] ] ], [ [ 'quote', '1' ], [ 'cons', [ 'car', 'env' ], [ 'set_index', 'var_name', 'var_value', [ 'cdr', 'env' ] ] ] ] ] ] ], [ 'define_procedure', [ 'lambda', [ 'updated_var_name', 'uncalculated_var_value', 'env', 'module_name' ], [ 'cond', [ [ 'var_existed', 'updated_var_name', 'env' ], [ 'display', [ 'cons', [ 'cons', [ 'quote', 'Error ' ], 'updated_var_name' ], [ 'quote', ' Has already be defined' ] ] ] ], [ [ 'quote', '1' ], [ 'deal_with_return_obj', [ 'toy', 'uncalculated_var_value', 'env', 'module_name' ], 'updated_var_name' ] ] ] ] ], [ 'deal_with_return_obj', [ 'lambda', [ 'return_obj', 'var_name' ], [ 'cons', [ 'car', 'return_obj' ], [ 'cons', [ 'cons', [ 'cons', 'var_name', [ 'cons', [ 'car', 'return_obj' ], [ 'quote', [  ] ] ] ], [ 'cadr', 'return_obj' ] ], [ 'quote', [  ] ] ] ] ] ], [ 'var_name_update', [ 'lambda', [ 'var_name', 'module_name' ], [ 'cond', [ [ 'eq', 'module_name', [ 'quote', '' ] ], 'var_name' ], [ [ 'quote', '1' ], [ 'cons', [ 'module_name', [ 'quote', '.' ] ], 'var_name' ] ] ] ] ], [ 'var_existed', [ 'lambda', [ 'var_name', 'env' ], [ 'cond', [ [ 'null?', 'env' ], [ 'quote', '0' ] ], [ [ 'eq', 'var_name', [ 'caar', 'env' ] ], [ 'quote', '1' ] ], [ [ 'quote', '1' ], [ 'var_existed', 'var_name', [ 'cdr', 'env' ] ] ] ] ] ], [ 'cons_env', [ 'lambda', [ 'value', 'env' ], [ 'cons', 'value', [ 'cons', 'env', [ 'quote', [  ] ] ] ] ] ], [ 'toy_language', [ 'lambda', [ 'trees', 'env', 'module_name' ], [ 'cond', [ [ 'null?', 'trees' ], 'env' ], [ [ 'quote', '1' ], [ 'toy_language', [ 'cdr', 'trees' ], [ 'cdar', [ 'toy', [ 'car', 'trees' ], 'env', 'module_name' ] ], 'module_name' ] ] ] ] ], [ 'assoc', [ 'lambda', [ 'x', 'y' ], [ 'cond', [ [ 'null?', 'y' ], [ 'display', [ 'cons', [ 'quote', 'Error cannot find ' ], 'x' ] ] ], [ [ 'eq', [ 'caar', 'y' ], 'x' ], [ 'cadar', 'y' ] ], [ [ 'quote', '1' ], [ 'assoc', 'x', [ 'cdr', 'y' ] ] ] ] ] ], [ 'pair', [ 'lambda', [ 'x', 'y' ], [ 'cond', [ [ 'and', [ 'null?', 'x' ], [ 'null?', 'y' ] ], [ 'quote', [  ] ] ], [ [ 'quote', '1' ], [ 'cons', [ 'cons', [ 'car', 'x' ], [ 'cons', [ 'car', 'y' ], [ 'quote', [  ] ] ] ], [ 'pair', [ 'cdr', 'x' ], [ 'cdr', 'y' ] ] ] ] ] ] ], [ 'append', [ 'lambda', [ 'x', 'y' ], [ 'cond', [ [ 'null?', 'x' ], 'y' ], [ [ 'quote', '1' ], [ 'cons', [ 'car', 'x' ], [ 'append', [ 'cdr', 'x' ], 'y' ] ] ] ] ] ], [ 'null?', [ 'lambda', [ 'x' ], [ 'eq', 'x', [ 'quote', [  ] ] ] ] ], [ 'caddar', [ 'lambda', [ '_list_' ], [ 'car', [ 'cdr', [ 'cdr', [ 'car', '_list_' ] ] ] ] ] ], [ 'caddr', [ 'lambda', [ '_list_' ], [ 'car', [ 'cdr', [ 'cdr', '_list_' ] ] ] ] ], [ 'cadar', [ 'lambda', [ '_list_' ], [ 'car', [ 'cdr', [ 'car', '_list_' ] ] ] ] ], [ 'cdar', [ 'lambda', [ '_list_' ], [ 'cdr', [ 'car', '_list_' ] ] ] ], [ 'caar', [ 'lambda', [ '_list_' ], [ 'car', [ 'car', '_list_' ] ] ] ], [ 'cadr', [ 'lambda', [ '_list_' ], [ 'car', [ 'cdr', '_list_' ] ] ] ] ]

// env is ENV
// return value  [0][0]
// return env [0][1]
var Toy_Run = function(trees,toy_env,env,module_name){
    if (trees.length==0)
        return toy_env
    else{
    	var toy_base = ['toy',["quote",trees[0]],["quote",toy_env],["quote",""]]
    	var return_obj = toy(toy_base,env,module_name)
    	//var return_value = return_obj[0][0]
    	var toy_env = return_obj[0][1]
        return Toy_Run(cdr(trees), toy_env, return_obj[1],module_name )
    }
}

// exports to Nodejs 
module.exports.parseString = parseString
module.exports.toy = toy 
module.exports.toy_language =toy_language
module.exports.printArray = printArray
module.exports.ENV = ENV
module.exports.Toy_Run = Toy_Run


//x = parseString("(define x 'abc)(define y 'bcd)(display x)(define c (/ 4 6 7))(display c)")
//Toy_Run(x,[],ENV,"")
/*
console.log("=============")

x = parseString("( display 'HelloWorld )")
console.log(toy_language(x,[],""))
*/














