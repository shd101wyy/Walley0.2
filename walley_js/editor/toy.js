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
        // [unquote a]
        else if (quote_value.length==2 && typeof(quote_value[0])==="string" && quote_value[0]=="unquote" )
            return toy(quote_value[1],env,module_name)[0]
        else{
            var output=[]
            i = 0
            while (i<quote_value.length){
            	output.push(calculateQuote(quote_value[i],env,module_name))
                i = i + 1
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
// compute function params
// ["x","y"] [["x",12],["y",13]] -> [12,13]
var evlis = function(params,env,module_name){
	if (params.length==0){
		return []
	}
	return cons(toy(params[0],env,module_name)[0] , evlis(cdr(params),env,module_name))
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
    if (stringIsNumber(tree))
        return [tree,env]
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
            // add + - * / functions to calculate numbers
            else if (tree[0]=="+")
            	return [ _add_array_(evlis(cdr(tree),env,module_name)) , env]
            else if (tree[0]=="-")
            	return [ _sub_array_(evlis(cdr(tree),env,module_name)) , env]
            else if (tree[0]=="*")
            	return [ _mul_array_(evlis(cdr(tree),env,module_name)) , env]
            else if (tree[0]=="/")
            	return [ _div_array_(evlis(cdr(tree),env,module_name)) , env]
            else if (tree[0]=="<")
              	return [ _lt_array_(cdr(tree),env,module_name),env]
            else if (tree[0]==">")
              	return [ _gt_array_(cdr(tree),env,module_name),env]
            else if (tree[0]=="=")
              	return [ _equal_array_(cdr(tree),env,module_name),env]
            else if (tree[0]==">=")
            	return [_ge_array_(cdr(tree),env,module_name),env]
            else if (tree[0]=="<=")
            	return [_le_array_(cdr(tree),env,module_name),env]
            else if (tree[0]=="or"){
                return [_or_array_(cdr(tree),env,module_name),env]
            }
            else if (tree[0]=="and"){
                return [_and_array_(cdr(tree),env,module_name),env]
            }
            else if (tree[0]=="not"){
            	return [_not_(tree[1],env,module_name),env]
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
                var return_obj = toy(tree[2],env,module_name)
                var var_value = return_obj[0]
                if (var_value == false){
                	console.log("Invalid value")
                	console.log(tree[2])
                }
                var new_env = return_obj[1]
                return [var_value,cons([var_name,var_value],new_env)]
            }
            // (set! var_name var_value)
            else if (tree[0]=="set!"){
                var set_index = function(var_name,env,var_value){
                    if (env.length==0){
                        console.log("Error...In function set! "+var_name+" does not existed")
                        return false
                    }
                    else if (var_name==env[0][0])
                        return cons([var_name,var_value],cdr(env))
                    return cons(car(env), set_index(var_name,cdr(env),var_value))
                }
                var return_obj = toy(tree[2],env)
                var var_value = return_obj[0]
                var new_env = return_obj[1]
                var index = set_index(tree[1],new_env,var_value)
                // var does not exist
                if (index==false)
                	return ["",env]
                return [var_value,index]
			}

            else if (tree[0]=="let"){
            	//return new env
				//expr -> ((a 12)(b 13)) 
				//env -> ((c 14))
				//return ((a 12)(b 13)(c 14))
				var eval_let = function(expr,env){
				    if (expr.length==0)
				        return env
				    // now ((x 12)(y x)) -> y = 12
				    return eval_let(cdr(expr), cons( [expr[0][0],toy(expr[0][1],env)[0]] , env) )
				}
                var return_obj = toy(tree[2],eval_let(tree[1],env))
                var return_value = return_obj[0]
                var return_env = return_obj[1]
                return[return_value, return_env.slice(return_env.length-env.length,return_env.length)]
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
            else if (tree[0]=="show-env"){
            	printArray(env)
            	return ["",env]
            }
            // defmacro
            /*

            (defmacro square (x) @(* ,x ,x)  )
            square : macro name
            (x) : params
            @(* ,x ,x) : return value that will run when calling macro
            */
            else if (tree[0]=="defmacro"){
                var macro_name = tree[1]
                var macro_value = ["run-macro",tree[2],tree[3]]
                var new_env = cons( [macro_name , macro_value] , env)
                return [macro_value,new_env]
            }
            //procedure value
            else{
                var value = assoc(tree[0],env)
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
                    // calculate params
                    else if (names[0]==".")
                        return cons([names[1],evlis(params,env,module_name)],env)
                    // lazy and does not calculate params
                    else if (names[0]=="&")
                        return cons([names[1],params],env)
                    else
                        return cons([names[0],toy(params[0],env,module_name)[0]],pair_params(cdr(names),cdr(params),env,module_name))
                }

                var return_array = toy(tree[0][2], pair_params(tree[0][1],cdr(tree),env,module_name),module_name)
                return_value = return_array[0]
                return_env = return_array[1]
                return[return_value, return_env.slice(return_env.length-env.length,return_env.length)]
            }
            /* macro
            
((run-macro (x) (quasiquote (* (unquote x) (unquote x)))) 3)
                expand
                -> (* 3 3)
                run
                -> 9

            */
            else if (tree[0][0]=="run-macro"){
                var pairs = function(a,b,env){
                    if (a.length == 0)
                        return env
                    return cons([a[0],b[0]], pairs(cdr(a),cdr(b)))
                }
                var vars = tree[0][1]
                var stm = tree[0][2]
                var params = cdr(tree)
                var new_env = pairs(vars,params,env)
                var return_obj = toy(stm,new_env,module_name)
                var to_run = return_obj[0]
                return toy(to_run,env,module_name)
            }
            else
                return toy(cons(toy(tree[0],env,module_name)[0] , cdr(tree)), env,module_name)
        }
}

/*
	Math Calculation
*/

// calculate two numbers 原生的计算
var calculateTwoNum = function(num1,num2,sign){
	return str(eval(num1+sign+num2))
}
// 分数计算 
// GCD
var gcd = function(a,b){
	if (b==0)
		return a
	return gcd(b,a%b)
}
// 创建分数
// n is numerator
// d is denominator
// simplify the fraction 
var make_rat = function(n,d){
	var g = gcd(n,d)
	return [(n/g),(d/g)]
}
var numer = function(rat){return rat[0]}
var denom = function(rat){return rat[1]}
// fraction arithematic
var add_rat = function(x,y){
   return make_rat( numer(x)*denom(y)+numer(y)*denom(x) , denom(x)*denom(y))
}
var sub_rat = function(x,y){
    return make_rat( numer(x)*denom(y)-numer(y)*denom(x) , denom(x)*denom(y))
}
var mul_rat = function(x,y){
    return make_rat(numer(x)*numer(y), denom(x)*denom(y))
}
var div_rat = function (x,y){
    return make_rat(numer(x)*denom(y),denom(x)*numer(y))
}
// 3/5 -> 3
var get_numerator = function(num){
	if (num.length==0)
		return ""
	else if (num[0]=="/")
		return ""
	return num[0]+get_numerator(cdr(num))
}
// 3/4 -> 4
var get_denominator = function(num){
	if (num.length==0)
		return "1"
	else if (num[0]=="/")
		return cdr(num)
	return get_denominator(cdr(num))
}
// format number
// 3/4 -> ['3','4']
var format_number = function(num){return [parseInt(get_numerator(num)),parseInt(get_denominator(num))]}
// ['3','4'] -> 3/4
var make_rat_string = function(rat){
	if (rat[1]==1)
		return str(rat[0])
	return rat[0]+"/"+rat[1]
}
// calculate two numbers only
//==== add ========
var _add_ = function(num1,num2){
	if (typeOfNum(num1)=="Float" || typeOfNum(num2)=="Float")
		return calculateTwoNum(num1,num2,"+")
	return make_rat_string(add_rat(format_number(num1),format_number(num2)))
}
//==== substruction ===
var _sub_ = function(num1,num2){
	if (typeOfNum(num1)=="Float" || typeOfNum(num2)=="Float")
		return calculateTwoNum(num1,num2,"-")
	return make_rat_string(sub_rat(format_number(num1),format_number(num2)))
}
//==== Multplication ===
var _mul_ = function(num1,num2){
	if (typeOfNum(num1)=="Float" || typeOfNum(num2)=="Float")
		return calculateTwoNum(num1,num2,"*")
	return make_rat_string(mul_rat(format_number(num1),format_number(num2)))
}
//==== Division ====
var _div_ = function(num1,num2){
	if (typeOfNum(num1)=="Float" || typeOfNum(num2)=="Float")
		return calculateTwoNum(num1,num2,"/")
	return make_rat_string(div_rat(format_number(num1),format_number(num2)))
}
// add array
// eg [1,2,3]-> 6
var _add_array_ = function(arr){
	var _add_array_iter_ = function(list,result){
		if (list.length==0)
			return result
		return _add_array_iter_(cdr(list),_add_(result,list[0]))
	}
	return _add_array_iter_(cdr(arr),arr[0])
}
// substract array
var _sub_array_ = function(arr){
	var _sub_array_iter_ = function(list,result){
		if (list.length==0)
			return result
		return _sub_array_iter_(cdr(list),_sub_(result,list[0]))
	}
	if (arr.length==1)
		return "-"+arr[0]
	return _sub_array_iter_(cdr(arr),arr[0])
}
var _mul_array_ = function(arr){
	var _mul_array_iter_ = function(list,result){
		if (list.length==0)
			return result
		return _mul_array_iter_(cdr(list),_mul_(result,list[0]))
	}
	return _mul_array_iter_(cdr(arr),arr[0])
}
var _div_array_ = function(arr){
	var _div_array_iter_ = function(list,result){
		if (list.length==0)
			return result
		return _div_array_iter_(cdr(list),_div_(result,list[0]))
	}
	return _div_array_iter_(cdr(arr),arr[0])
}
// ======== 结束定义 数学计算 ================

var _and_array_ = function(arr,env,module_name){
		// pass
		if (arr.length==0)
			return "1"
		else if (toy(arr[0],env,module_name)[0]=="0")
			return "0"
		return _and_array_(cdr(arr),env,module_name)
}
var _or_array_ = function(arr,env,module_name){
		// pass
		if (arr.length==0)
			return "0"
		else if (toy(arr[0],env,module_name)[0]!="0")
			return "1"
		return _or_array_(cdr(arr),env,module_name)
	
}
var _not_ = function(value,env,module_name){
	var value = toy(value,env,module_name)[0]
	if (value=="0")
		return "1"
	return "0"
}
// 结束定义 and or
// ======= 比较 =============================
// <
var _lt_two_values = function(value1,value2){
	if (typeof(value1)!=typeof(value2))
		return "0"
	if (value1<value2)
	    return "1"
	else
	    return "0"   
}
// eg ["3","4","5"] -> "1"
var _lt_array_ = function(arr,env,module_name){
	var _lt_array_iter_ = function(ahead,rest,env,module_name){
		// finish
		if (rest.length==0)
			return "1"
		else{
			value2 = toy(rest[0],env,module_name)[0]
			if (stringIsNumber(value2))
	    		value2=eval(value2)
			if (_lt_two_values(ahead,value2)=="0")
				return "0"
			return _lt_array_iter_(value2 , cdr(rest), env, module_name)
		}
	}
	if (arr.length<2){
		console.log("Error...< or > invalid num of params")
		return "0"
	}
	var value1 = toy(arr[0],env,module_name)[0]
	if (stringIsNumber(value1))
	    value1=eval(value1)
	return _lt_array_iter_(value1,cdr(arr),env,module_name)
}
// >
var _gt_array_ = function(arr,env,module_name){
	return _lt_array_(arr.reverse(),env,module_name)
}

// =
// value equal
var _equal_two_values = function(value1,value2){
	// check whether two arrays equal
	var _equal_two_arrays_ = function(arr1,arr2){
		var i=0
		var length1 = arr1.length
		var length2 = arr2.length
		if (length1!=length2)
			return "0"
		while (i<arr1.length){
			var value1 = arr1[i]
			var value2 = arr2[i]
			var result = _equal_two_values(value1,value2)
			if (result=="0")
				return "0"
			i=i+1
		}
		return "1"
	}
	var type1 = typeof(value1)
	var type2 = typeof(value2)
	if (type1!=type2)
		return "0"
	else{
		if (type1=="object" || type1=="array"){
			return _equal_two_arrays_(value1,value2)
		}
		if (value1 == value2)
			return "1"
		return "0"
	}
}
// values equal , not objects equal
// [[1,2],[1,2]] = "1"
var _equal_array_ = function(arr,env,module_name){
	var _equal_array_iter_ = function(ahead,rest,env,module_name){
		// finish
		if (rest.length==0)
			return "1"
		else{
			value2 = toy(rest[0],env,module_name)[0]
			if (stringIsNumber(value2))
	    		value2=eval(value2)
			if (_equal_two_values(ahead,value2)=="0")
				return "0"
			return _equal_array_iter_(value2 , cdr(rest), env, module_name)
		}
	}
	if (arr.length<2){
		console.log("Error...= invalid num of params")
		return "0"
	}
	var value1 = toy(arr[0],env,module_name)[0]
	if (stringIsNumber(value1))
	    value1=eval(value1)
	return _equal_array_iter_(value1,cdr(arr),env,module_name)
}
// <=
var _le_two_values = function(value1,value2){
	if (_lt_two_values(value1,value2)!="0" || _equal_two_values(value1,value2)!="0")
		return "1"
	return "0"
}
var _le_array_ = function(arr,env,module_name){
	var _le_array_iter_ = function(ahead,rest,env,module_name){
		// finish
		if (rest.length==0)
			return "1"
		else{
			value2 = toy(rest[0],env,module_name)[0]
			if (stringIsNumber(value2))
	    		value2=eval(value2)
			if (_le_two_values(ahead,value2)=="0")
				return "0"
			return _le_array_iter_(value2 , cdr(rest), env, module_name)
		}
	}
	if (arr.length<2){
		console.log("Error...<= or >= invalid num of params")
		return "0"
	}
	var value1 = toy(arr[0],env,module_name)[0]
	if (stringIsNumber(value1))
	    value1=eval(value1)
	return _le_array_iter_(value1,cdr(arr),env,module_name)
}
// >=
var _ge_array_ = function(arr,env,module_name){
	return _le_array_(arr.reverse(),env,module_name)
}
// 
// exports to Nodejs 
if (typeof(module)!="undefined"){
    module.exports.parseString = parseString
    module.exports.toy = toy 
    module.exports.toy_language =toy_language
    module.exports.printArray = printArray
    }


















