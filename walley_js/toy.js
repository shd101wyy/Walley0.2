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
			var _result_ = [quote,new_lexer(rest_result[1])[0]]
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
	var type0 = typeof(arg0)
	var tyoe1 = typeof(arg1)
	if (type0!=type1)
		return "0"
	else if (arg0==arg1)
		return "1"
	// "" eq [] 
	else if (arg0.length==0 && arg1.length==0)
		return "1"
	else
		return "0"
}
var car = function ( arg ){ 
	return arg[0]
}
var cdr = function ( arg ){
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
			output = list
		}
		else{
			output = "[ "
			var i=0
			while (i<list.length-1){
				output = output + convert_array_to_string(list[i])
				output = output+", "
				i=i+1
			}
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
                return [eq(toy(tree[1],env,module_name)[0],toy(tree[2],env,module_name)),env]
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

                if (tyoeof(value1)!=tyoeof(value2))
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
                return_obj = toy(tree[2],env)
                var_value = return_obj[0]
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
            elif tree[0]=="load":
                if len(tree)==2:
                    module_name = ""
                else:
                    module_name = tree[2]
                return toy(parser(lexer(VirtualFileSystem[tree[1]])[0]) , env , module_name)
               */
            // io function
            else if (tree[0]=="display")
                return [display_(toy(tree[1],env)[0]),env]
            //procedure value
            else{
                value = assoc(tree[0],env)
                if (value == false)
                    console.log("Error...Undefined function "+tree[0])
                    return ["",env]
                return toy(cons(value , cdr(tree)),env)
            }
        }
        else{
            if (tree[0][0]=="lambda"){
                // ["a","b"] ["1","2"] [["c","12"]] -> [["a","1"],["b","2"],["c","12"]]
                var pair_params = function(names,params,env){
                    if (names.length==0)
                        return env
                    else
                        return cons([names[0],toy(params[0],env)[0]],pair_params(cdr(names),cdr(params),env))
                }
                return_array = toy(tree[0][2], pair_params(tree[0][1],cdr(tree),env))
                return_value = return_array[0]
                return_env = return_array[1]
                return[return_value, return_env.slice(return_env.length-env.length,return_env.length)]
            }
            else
                return toy(cons(toy(tree[0],env,module_name) , cdr(tree)), env,module_name)
        }
}






x = parseString("12 (define x \"Hello World\" ) ;(define y 15) ")
printArray(x)
console.log(stringIsNumber("1.2e12"))





















