/*
	JavaScript Version Toy Language
	Developed by shd101wyy

    now list is linked list rather than array
*/

/*
	7 primitive functions
	quote atom eq car cdr cons cond
*/
// convert array to linked list
// [1,2,3] -> [1,[2,[3,[]]]]
var arrayToList = function(arg){
    if (arg.length == 0)
        return arg
    else
        return [arg[0],arrayToList(arg.slice(1,arg.length))]
}
// [1,[2,3]] -> [1,2,3]
// [1,[2,[3, [] ]]]
var listToArray = function(arg){
    if (arg.constructor == Vector)
        return arg.value
    var output = []
    while(arg.length!=0){
        output.push(arg[0])
        arg = arg[1]
    }
    return output
}
var quote = function(arg){
    return arg.slice(0)
}
var atom = function( input_str ){
	if (typeof(input_str)=="string")
		return "1"
	return []
}
var eq = function(arg0, arg1){
	// "" eq [] 
	if (arg0.length==0 && arg1.length==0)
		return "1"
	var type0 = typeof(arg0)
	var type1 = typeof(arg1)
	if (type0!=type1)
		return []
	else if (arg0==arg1)
		return "1"
	else
		return []
}
var car = function ( arg ){ 
	if (arg.length==0){
		console.log("Error...cannot get car of empty list")
        return 'undefined'
	}
	return arg[0]
}

var cdr = function (arg){
    if (arg.length==0){
        console.log("Error...cannot get cdr of empty list")
        return 'undefined'
    }
    return arg[1]
}
var cons = function(value1, value2){
    return [value1,value2]
}

var cond = function(tree,env,module_name){
	if (tree.length==0)
		return []
    // true
	if (toy(tree[0][0],env,module_name).length!=0)
		return toy(tree[0][1],env,module_name)
	return cond(cdr(tree),env,module_name)
}

/*=======================================
#=======================================
#======= builtin functions =============
*/
// (quasiquote '(1 ,(+ 1 2))) -> (1 3)
// ((unquote x) x)
var quasiquote = function(arg,env,module_name){
    var quasiquote_iter = function(arg0){
        if (typeof(arg0) === 'string')
            return arg0;
        else if (arg0.length == 0){
            return [];
        }
        else if (typeof(arg0[0]) == 'object' && arg0[0][0]=='unquote'){
            return cons(toy(arg0[0][1][0],env,module_name), quasiquote(cdr(arg0),env,module_name))
        }
        else if (typeof(arg0[0]) === 'object')
            return cons(quasiquote_iter(arg0[0],env,module_name), quasiquote(cdr(arg0),env,module_name))
        // car(argo) is string
        return cons(car(arg0), quasiquote_iter(cdr(arg0),env,module_name))
    }
    return quasiquote_iter(arg)
}

// get var_value according to var_name
var assoc = function(var_name , env_list){
    var i = env_list.length - 1
    while (i >= 0){
        if (var_name in env_list[i])
            return env_list[i][var_name]
        i = i - 1
    }
    return "undefined"
}
// compute function params
// ["x","y"] [["x",12],["y",13]] -> [12,13]
var evlis = function(params,env,module_name){
	if (params.length==0){
		return []
	}
	return cons(toy(params[0],env,module_name) , evlis(cdr(params),env,module_name))
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
    return []
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
/*
((macro (x) (quasiquote (* (unquote x) (unquote x)))) 3)
                expand to 
                -> (* 3 3)
*/
var macroexpand = function(tree,env,module_name){
    var pairs = function(a,b,env){
        if (a.length == 0)
            return
        // rest
        if (a[0]=="&"){
            env[env.length - 1][a[1][0]] = b
            return 
        }
        env[env.length - 1][a[0]] = b[0]
        return pairs(cdr(a),cdr(b),env)
    }
    var vars = car(cdr(car(tree)))
    var stms = cdr(cdr(car(tree)))
    stms = cons('begin',stms)
    var params = cdr(tree)
    
    env.push({})
    pairs(vars,params,env)
    var return_value = toy(stms, env, module_name)
    env.pop()
    return return_value
}


// check char is digit
var charIsDigit = function(input_char){
	return input_char==="0" || input_char==="1"|| input_char==="2"|| input_char==="3"|| input_char==="4"|| input_char==="5"|| input_char==="6"|| input_char==="7"|| input_char==="8"|| input_char==="9"
}
//Integer Float Fraction Unknown_or_Invalid
var checkTypeOfNum = function(input_str,num_of_e,num_of_dot,num_of_slash,has_digit){
    // finish
    if (input_str.length == 0){
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
        return checkTypeOfNum(input_str.slice(1),num_of_e+1,num_of_dot,num_of_slash,has_digit)
    else if (input_str[0]==".")
        return checkTypeOfNum(input_str.slice(1),num_of_e,num_of_dot+1,num_of_slash,has_digit)
    else if (input_str[0]=='/')
        return checkTypeOfNum(input_str.slice(1),num_of_e,num_of_dot,num_of_slash+1,has_digit)
    else if (charIsDigit(input_str[0]))
        return checkTypeOfNum(input_str.slice(1),num_of_e,num_of_dot,num_of_slash,true)
    else
        return "Unknown_or_Invalid"
}
// get type of num
var typeOfNum = function(input_str){
    if (input_str[0]=="-")
        return checkTypeOfNum(input_str.slice(1),0,0,0,false)
    return checkTypeOfNum(input_str,0,0,0,false)
}

// support integer 3 float 3.0 fraction 3/4
var stringIsNumber = function(input_str){
    if (typeof(input_str)!="string")
        return false
    var type = typeOfNum(input_str)
    if (type!="Unknown_or_Invalid")
        return type
    return false
}

var str=function(input_s){return input_s+""}
var len=function(obj){return obj.length}

// I changed false to []
// and true is all except []
var judge_ = function(value){
    if (value.length == 0)
        return true
    return false
}

var Vector = function(init_value){
    this.value = init_value
}

/*
    TOY DATA TYPE

    list
    atom
    vector
    number {
                Float
                Integer
                Rational
                Complex .. not supported now
            }
*/

// ...
//
//=======================================

var toy_language = function(trees,env,module_name){
    if (trees.length==0)
        return env
    else
        toy(trees[0],env,module_name)
        return toy_language(cdr(trees), env , module_name )
}
// I will change the way to express env on Aug 21st
/*
  now env is not [[var_name, var_value] , ..... ] anymore
  it is now as

        < --------
        right to left

      [..., [ var_list1] , [ var_list0]]
      where [var_list0] is -> [[var_name, var_value], [var_name, var_value] ...]


  now env is [{env0},{env1},{env2},{env3}]
  
  where {env0} is 
    object(dict) {
        var_name0 : var_value0,
        var_name1 : var_value1,
        ...
    }


*/
// TRY FUNCTIONAL PROGRAMMING, without global params
// [return_value,env]
/*
    Toy Language embed function

    quote atom? eq car cdr cons cond
    + - * /
    < > = >= <=
    or and not
    define set!
    let
    lambda
    begin 
    apply eval
    quasiquote
    load
    display 
    show-env
    defmacro macroexpand run-macro
*/
// init env_list
var ENV_LIST = [{
    "quote":"quote",
    "atom?":"atom?",
    "eq":"eq",
    "car":"car",
    "cdr":"cdr",
    "cons":"cons",
    "cond":"cond",
    "+":"+",'-':'-','*':'*','/':'/',
    '<':'<',
    '>':'>',
    '=':'=',
    '>=':'>=',
    '<=':'<=',
    'or':'or',
    'and':'and',
    'not':'not',
    'define':'define',
    'set!':'set!',
    'let':'let',
    'lambda':'lambda',
    'begin':'begin',
    'apply':'apply','eval':'eval',
    'quasiquote':'quasiquote',
    'load':'load',
    'display':'display',
    'show-env':'show-env',
    'set-car!':'set-car!','set-cdr!':'set-cdr!',
    'defmacro':'defmacro','macroexpand':'macroexpand','macro':'macro',
    'vector':'vector','vector?':'vector?','#vector':'#vector',
    'vector-ref':'vector-ref','vector-len':'vector-len','vector-slice':'vector-slice','vector-set!':'vector-set!','vector-push':'vector-push','vector-pop':'vector-pop','vector-copy':'vector-copy',
    'while':'while','for':'for'
    }]


var toy = function(tree,env,module_name){
	if (typeof(module_name)==="undefined")
		module_name = ""
    // number
    //else if (typeof(tree) === "number")
    //    return tree
    // the code below is removed... 
    // number
    if (stringIsNumber(tree)!=false){
        return tree
    }
        //return ['number',tree]
    // atom
    else if (typeof(tree)=="string")
        return assoc(tree,env)
    else
        if (typeof(tree[0])=='string'){
            // seven primitive functions
            // (quote abc)
            if (tree[0]=="quote")
                return quote(tree[1][0])
            // (atom? abc)
            else if (tree[0]=="atom?")
                return atom(toy(tree[1][0],env,module_name))
            // (eq a b)
            else if (tree[0]=="eq")
                return eq(toy(tree[1][0],env,module_name),toy(tree[1][1][0],env,module_name))
            // (car x)
            else if (tree[0]=="car")
                return car(toy(tree[1][0],env,module_name))
            // (cdr x)
            else if (tree[0]=="cdr")
                return cdr(toy(tree[1][0],env,module_name))
            // (cons x y)
            else if (tree[0]=="cons"){
                return cons(toy(tree[1][0],env,module_name),toy(tree[1][1][0],env,module_name))
            }
            else if (tree[0]=="cond")
                return cond(cdr(tree),env,module_name)
            // add + - * / functions to calculate numbers
            else if (tree[0]=="+")
            	return _add_array_(evlis(cdr(tree),env,module_name)) 
            else if (tree[0]=="-")
            	return _sub_array_(evlis(cdr(tree),env,module_name)) 
            else if (tree[0]=="*")
            	return _mul_array_(evlis(cdr(tree),env,module_name)) 
            else if (tree[0]=="/")
            	return _div_array_(evlis(cdr(tree),env,module_name))
            else if (tree[0]=="<")
              	return _lt_array_(cdr(tree),env,module_name)
            else if (tree[0]==">")
              	return _gt_array_(cdr(tree),env,module_name)
            else if (tree[0]=="=")
              	return _equal_array_(cdr(tree),env,module_name)
            else if (tree[0]==">=")
            	return _ge_array_(cdr(tree),env,module_name)
            else if (tree[0]=="<=")
            	return _le_array_(cdr(tree),env,module_name)
            else if (tree[0]=="or"){
                return _or_array_(cdr(tree),env,module_name)
            }
            else if (tree[0]=="and"){
                return _and_array_(cdr(tree),env,module_name)
            }
            else if (tree[0]=="not"){
            	return _not_(tree[1][0],env,module_name)
            }
            // (define var_name var_value)
            else if (tree[0]=="define"){
                var var_name = car(cdr(tree))
                if (module_name!="")
                    var_name = module_name + "." + var_name
                var var_value = toy(car(cdr(cdr(tree))),env,module_name)
                // var_name exsit
                if (var_name in env[env.length-1]){
                    console.log( "Error... "+var_name+" with value has been defined")
                    console.log( "In toy language, it is not allowed to redefine var.")
                    console.log( "While not recommended to change value of a defined var,")
                    console.log( "you could use set! function to modify the value.")
                    return var_value
                }
                else{
                    env[env.length-1][var_name] = var_value
                    return var_value
                }
            }
            // (set! var_name var_value)
            // (set (quote var_name) var_value)
            // the set function is the same it is in emacs lisp
            else if (tree[0]=="set!" || tree[0]=="set"){
                var set_ = function(var_name,env,var_value){
                    var i = env.length - 1
                    var found_var = false
                    while(i>=0){
                        // find var
                        if (var_name in env[i]){
                            env[i][var_name] = var_value 
                            found_var = true
                            break
                        }
                        i=i-1
                    }
                    if (found_var == false){
                        if (tree[0] == "set")
                            env[0][var_name] = var_value
                        else
                            console.log("Error...In function set! "+var_name+" does not existed")
                    }
                }
                var var_name = tree[1][0]
                if (tree[0] == "set")
                    var_name = toy(tree[1][0],env,module_name)
                if (module_name!="")
                    var_name = module_name + "." + var_name
                var var_value = toy(tree[1][1][0],env,module_name)
                set_(var_name,env,var_value)
                return var_value

			}

            else if (tree[0]=="let"){
                // add new env to env_list
            	// return new env_list
                /*
                    ((x 0)
                     (y 12)
                        )

                */
                var eval_let = function(expr , env_list){
                    if (expr.length == 0)
                        return;
                    var var_name = car(car(expr))
                    var var_value = toy(car(cdr(car(expr))),env,module_name)
                    env_list[env_list.length-1][var_name] = var_value
                    return eval_let(cdr(expr),env_list)
                }
                // 添加新的空 env
                env.push({})
                eval_let(tree[1][0],env)
                // (let ((x 1) (y 2)) (+ 3 4))
                var return_value = toy(tree[1][1][0],env,module_name)
                // delete 新加入的 env
                env.pop()
                return return_value
            }
            else if (tree[0]=="lambda")
                return tree
                /*

            (define square (macro (x) @(* ,x ,x)  ))
            square : macro name
            (x) : params
            @(* ,x ,x) : return value that will run when calling macro

                return
                (macro (x) @(* ,x ,x))
            */
            else if (tree[0]=='macro'){
                return tree
            }
            else if (tree[0]=="begin"){
                tree = cdr(tree)
                var value;
                while(tree.length!=0 && typeof(tree)!='string'){
                    value = toy(tree[0],env,module_name)
                    tree = tree[1]
                }
                return value
            }
            else if (tree[0]=="apply")
                return toy(cons(tree[1][0],toy(tree[1][1][0],env,module_name)),env,module_name)
            else if (tree[0]=="eval")
                return toy(toy(tree[1][0],env,module_name),env,module_name)
            else if (tree[0]=="quasiquote"){
                return quasiquote(tree[1][0],env,module_name)
            }
            /*
            # load module
            # (load a) will import content in a with module_name ""
            # (load a a) will import content in a with module_name "a"
            # eg:
            # a -> (define x 12)
            # (load 'a 'a) will cons ((a.x 12)) as env
            # (load 'a) will cons ((x 12)) as env
            */
            else if (tree[0]=="load"){
                var load_module = toy(tree[1][0],env,module_name)
                var as_name = ""
                if (tree.length==2)
                    as_name = ""
                else
                    as_name = toy(tree[1][1][0],env,module_name)
                if (load_module in VirtualFileSystem){
                    var module_content = VirtualFileSystem[load_module]
                    if (typeof(module_content)==='string')
                        toy_language( parseString(VirtualFileSystem[load_module]), env,as_name)
                    else
                        toy_language(VirtualFileSystem[load_module],env,as_name)
                }
                else
                    console.log("Error...Module " + load_module + "does not exist")
                return 'undefined'
         	}
            // io function
            else if (tree[0]=="display")
                return display(toy(tree[1][0],env,module_name))
            // show defined variables in env
            else if (tree[0]=="show-env"){
            	printArray(env)
                // here has some problem ... 
            	return env
            }

            // mutable list funcions
            // set-car! set-cdr!
            else if (tree[0]=='set-car!'){
                var value = toy(tree[1][0],env,module_name)
                value[0] = toy(tree[1][1][0],env,module_name)
                return value
            }
            else if (tree[0]=='set-cdr!'){
                var value = toy(tree[1][0],env,module_name)
                value[1] = toy(tree[1][1][0],env,module_name)
                return value
            }
            /*
                embed data type
            */
            else if (tree[0]=='#vector'){
                var return_value = new Vector(tree[1])
                return return_value
            }

            // FOR LISP LIST OPERATION
            // ref len slice set-ref! functions
            // push pop functions for mutable data
            // ref (ref '(a b c) 0) get 'a
            // (ref value index)
            else if (tree[0]=='vector'){
                var i = 1
                var return_value = []
                while (i < tree.length){
                    return_value[i-1] = toy(tree[i],env,module_name)
                    i = i + 1
                }
                return new Vector(return_value)
            }
            else if (tree[0]=='vector?'){
                var value = toy(tree[1],env,module_name)
                if (value.constructor == Vector)
                    return "1"
                return []
            }
            else if (tree[0]=="vector-ref"){
                var index = parseInt(toy(tree[2],env,module_name))
                var value = toy(tree[1],env,module_name)
                if (value.constructor != Vector){
                    console.log("Error...function vector-ref wrong type var")
                    return 'undefined'
                }

                if (index<0 || index>=value.length){
                    console.log("Error...ref index out of boundary")
                    return 'undefined'
                }
                return value.value[index]
            }
            // (len '(a b c)) ->3
            // get length of value
            else if (tree[0]=="vector-len"){
                var value = toy(tree[1],env,module_name)
                if (value.constructor != Vector){
                    console.log("Error...function vector-len wrong type var")
                    return 'undefined'
                }
                return str(value.value.length)
            }
            // (slice '(a b c) 0 2) -> '(a b)
            else if (tree[0]=="vector-slice"){
                var left = parseInt(toy(tree[2],env,module_name))
                var right = parseInt(toy(tree[3],env,module_name))
                var value = toy(tree[1],env,module_name)
                if (value.constructor != Vector){
                    console.log("Error...function vector-slice wrong type var")
                    return 'undefined'
                }
                if (left<0){
                    console.log("Error...slice left index < 0")
                    return 'undefined'
                }
                if (right > value.length){
                    console.log("Error...slice right index out of boundary")
                    return 'undefined'
                }
                return new Vector(value.value.slice(left,right))
            }

            // (set-ref! '(1 2 3) 0 12) -> (12 2 3)
            else if (tree[0]=="vector-set!"){
                // i can not do it now...
                var var_value = toy(tree[1],env,module_name)
                var index0 = toy(tree[2],env,module_name)
                var set_value = toy(tree[3],env,module_name)
                if (var_value.constructor != Vector){
                    console.log("Error...function vector-set! wrong type var")
                    return 'undefined'
                }
                var_value.value[index0] = set_value
                return var_value
            }
            else if (tree[0] == 'vector-push'){
                var value = toy(tree[1],env,module_name)
                if (value.constructor != Vector){
                    console.log("Error...function vector-set! wrong type var")
                    return 'undefined'
                }
                var push_value = toy(tree[2],env,module_name)
                value.value.push(push_value)
                return value
            }
            else if (tree[0] == 'vector-pop'){
                var value = toy(tree[1],env,module_name)
                if (value.constructor != Vector){
                    console.log("Error...function vector-pop! wrong type var")
                    return 'undefined'
                }
                if (value.value == [])
                    return 'undefined'
                var pop_value = value.value.pop()
                return pop_value
            }
            else if (tree[0] == 'vector-copy'){
                var value = toy(tree[1],env,module_name)
                if (value.constructor != Vector){
                    console.log("Error...function vector-copy! wrong type var")
                    return 'undefined'
                }
                var return_value = new Vector(value.value.slice(0))
                return return_value
            }
            

            /*
                for while statements

                for:
                    (for i in obj stm1, stm2 ...)
                
                while:
                    (while judge stm1, stm2 ...)
                
                does not create new env for env_list
                */
            else if (tree[0]=="while"){
                var judge = toy(tree[1][0],env,module_name)
                while(judge.length != 0){
                    var stms = cons('begin', cdr(cdr(tree)))
                    toy(stms,env,module_name)
                    judge = toy(tree[1][0],env,module_name)
                }
                return "undefined"
            }
            // this function has lots of problem
            else if (tree[0]=="for"){
                var var_name = tree[1][0]
                var in_value = toy(tree[1][1][1][0],env,module_name)
                var i = 0
                while (in_value.length!=0){
                    // update var_name value
                    //toy(['set!',var_name,['quote',in_value[i]]],env,module_name)
                    env[env.length-1][var_name] = in_value[0]
                    in_value = cdr(in_value)
                    toy(cons('begin',tree[1][1][1][1],env,module_name))
                    i=i+1
                }
                return "undefined"
            }
            // implement math functions
            else if (tree[0]=="^"){
                var value1 = toy(tree[1][0],env,module_name)
                var power = toy(tree[1][1][0],env,module_name)
                return str(Math.pow(eval(value1),eval(power)))
            }
            else if (tree[0]=="sin"){
                var value = toy(tree[1][0],env,module_name)
                return str(Math.sin(eval(value)))
            }
            else if (tree[0]=='cos'){
                var value = toy(tree[1][0],env,module_name)
                return str(Math.cos(eval(value)))
            }
            else if (tree[0]=='tan'){
                var value = toy(tree[1][0],env,module_name)
                return str(Math.tan(eval(value)))
            }

            // defmacro
            /*

            (defmacro square (x) @(* ,x ,x)  )
            square : macro name
            (x) : params
            @(* ,x ,x) : return value that will run when calling macro
            */
            else if (tree[0]=="defmacro"){
                var macro_name = tree[1][0]
                var macro_value = ["macro",tree[1][1][0],cdr(cdr(cdr(tree)))]
                env[env.length - 1][macro_name] = macro_value
                return macro_value
            }
            /*
                (macroexpand '(square 3))
                -> (* 3 3)
            */
            else if (tree[0]=="macroexpand"){
                var value = toy(tree[1][0],env,module_name)
                value[0]  = toy(value[0],env,module_name)
                var expanded = macroexpand(value,env,module_name)
                return expanded
            }
            //procedure value
            else{
                var value = assoc(tree[0],env)
                if (value === "undefined"){
                    console.log("Error...Undefined function |"+tree[0]+"|")
                    return "undefined"
                }
                return toy(cons(value , cdr(tree)),env,module_name)
            }
        }
        else{
            /*
                (
                    (lambda (a b) (+ a b))
                    3 4
                    )

            */
            if (tree[0][0]=="lambda"){
                // ["a","b"] ["1","2"] according to env_list -> [["a","1"],["b","2"]]
                var pair_params = function(names,params,env,module_name,output){
                    if (names.length==0)
                        return output
                    // calculate params
                    else if (names[0]=="."){
                        output[names[1][0]] =  arrayToList(evlis(params,env,module_name))
                        return output
                    }
                    // lazy and does not calculate params
                    else if (names[0]=="&"){
                        output[names[1][0]] = arrayToList(params)
                        return output
                    }
                    else{               
                        // add undefined support when there are not enough inputs
                        if (params.length == 0){
                            output[names[0]] = 'undefined'
                            return pair_params(cdr(names),[],env,module_name,output)
                        }
                        output[names[0]] = toy(params[0],env,module_name)
                        return pair_params(cdr(names) , cdr(params) , env , module_name ,output)
                    }
                }
                // add local env
                var output = pair_params(car(cdr(car(tree))),cdr(tree),env,module_name,{})
                env.push(output)
                
                var stms = cons('begin', cdr(cdr(car(tree))))
                display(stms)                
                var return_value = toy(stms, env , module_name)
                // delete 新加入的 env
                env.pop()
                return return_value
            }
            /* macro
            
((macro (x) (quasiquote (* (unquote x) (unquote x)))) 3)
                expand
                -> (* 3 3)
                run
                -> 9

            */
            else if (tree[0][0]=="macro"){
                var to_run = macroexpand(tree,env,module_name)
                return toy(to_run,env,module_name)
            }
            else
                return toy(cons(toy(tree[0],env,module_name) , cdr(tree)), env,module_name)
        }
}

/*
	Math Calculation
*/
/*
I removed fraction support on September/4/2013

// calculate two numbers 原生的计算
var calculateTwoNum = function(num1,num2,sign){
	return str(eval(num1+sign+num2))
}
*/

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
	return num[0]+get_numerator(num.slice(1))
}
// 3/4 -> 4
var get_denominator = function(num){
	if (num.length==0)
		return "1"
	else if (num[0]=="/")
		return num.slice(1)
	return get_denominator(num.slice(1))
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
    var type1 = typeOfNum(num1)
    var type2 = typeOfNum(num2)
    if (type1 == 'Unknown_or_Invalid' || type2 == 'string')
        return num1+num2
	if (type1 == "Float" || type2 == "Float")
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
		else if (toy(arr[0],env,module_name).length == 0)
			return []
		return _and_array_(cdr(arr),env,module_name)
}
var _or_array_ = function(arr,env,module_name){
		// pass
		if (arr.length==0)
			return []
		else if (toy(arr[0],env,module_name).length!=0)
			return "1"
		return _or_array_(cdr(arr),env,module_name)
}
var _not_ = function(value,env,module_name){
	var value = toy(value,env,module_name)
	if (value.length == 0)
		return "1"
	return []
}
// 结束定义 and or
// ======= 比较 =============================
// <
var _lt_two_values = function(value1,value2){
	if (typeof(value1)!=typeof(value2))
		return []
	if (value1<value2)
	    return "1"
	else
	    return []   
}
// eg ["3","4","5"] -> "1"
var _lt_array_ = function(arr,env,module_name){
	var _lt_array_iter_ = function(ahead,rest,env,module_name){
		// finish
		if (rest.length==0)
			return "1"
		else{
			value2 = toy(rest[0],env,module_name)
			if (stringIsNumber(value2))
	    		value2=eval(value2)
			if (_lt_two_values(ahead,value2).length==0)
				return []
			return _lt_array_iter_(value2 , cdr(rest), env, module_name)
		}
	}
	if (arr.length<2){
		console.log("Error...< or > invalid num of params")
		return []
	}
	var value1 = toy(arr[0],env,module_name)
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
			return []
		while (i<arr1.length){
			var value1 = arr1[i]
			var value2 = arr2[i]
			var result = _equal_two_values(value1,value2)
			if (result.length==0)
				return []
			i=i+1
		}
		return "1"
	}
	var type1 = typeof(value1)
	var type2 = typeof(value2)
	if (type1!=type2)
		return []
	else{
		if (type1=="object" || type1=="array"){
			return _equal_two_arrays_(value1,value2)
		}
		if (value1 == value2)
			return "1"
		return []
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
			value2 = toy(rest[0],env,module_name)
			if (stringIsNumber(value2))
	    		value2=eval(value2)
			if (_equal_two_values(ahead,value2).length==0)
				return []
			return _equal_array_iter_(value2 , cdr(rest), env, module_name)
		}
	}
	if (arr.length<2){
		console.log("Error...= invalid num of params")
		return []
	}
	var value1 = toy(arr[0],env,module_name)
	if (stringIsNumber(value1))
	    value1=eval(value1)
	return _equal_array_iter_(value1,cdr(arr),env,module_name)
}
// <=
var _le_two_values = function(value1,value2){
	if (_lt_two_values(value1,value2).length!=0 || _equal_two_values(value1,value2).length!=0)
		return "1"
	return []
}
var _le_array_ = function(arr,env,module_name){
	var _le_array_iter_ = function(ahead,rest,env,module_name){
		// finish
		if (rest.length==0)
			return "1"
		else{
			value2 = toy(rest[0],env,module_name)
			if (stringIsNumber(value2))
	    		value2=eval(value2)
			if (_le_two_values(ahead,value2).length==0)
				return []
			return _le_array_iter_(value2 , cdr(rest), env, module_name)
		}
	}
	if (arr.length<2){
		console.log("Error...<= or >= invalid num of params")
		return []
	}
	var value1 = toy(arr[0],env,module_name)
	if (stringIsNumber(value1))
       value1=eval(value1)
	return _le_array_iter_(value1,cdr(arr),env,module_name)
}
// >=
var _ge_array_ = function(arr,env,module_name){
	return _le_array_(arr.reverse(),env,module_name)
}

var VirtualFileSystem = {}
VirtualFileSystem["toy"] = [ [ 'define', 'toy-author', [ 'quote', 'Yiyi-Wang' ] ], [ 'define', 'true', '1' ], [ 'define', 'false', [ 'quote', [  ] ] ], [ 'define', 'nil', [ 'quote', [  ] ] ], [ 'define', [ '#vector', 't' ], '1' ], [ 'define', [ '#vector', 'f' ], [ 'quote', [  ] ] ], [ 'define', '**', '^' ], [ 'define', 'cot', [ 'lambda', [ 'a' ], [ '/', '1', [ 'tan', 'a' ] ] ] ], [ 'define', 'sec', [ 'lambda', [ 'a' ], [ '/', '1', [ 'cos', 'a' ] ] ] ], [ 'define', 'csc', [ 'lambda', [ 'a' ], [ '/', '1', [ 'sin', 'a' ] ] ] ], [ 'define', 'list?', [ 'lambda', [ 'var' ], [ 'cond', [ [ 'atom?', 'var' ], 'false' ], [ [ 'vector?', 'var' ], 'false' ], [ '1', 'true' ] ] ] ], [ 'define', 'ref', [ 'lambda', [ 'arg', 'index' ], [ 'define', 'ref-iter', [ 'lambda', [ 'arg', 'index' ], [ 'cond', [ [ 'eq', '0', 'index' ], [ 'car', 'arg' ] ], [ [ 'null?', 'arg' ], [ 'quote', 'undefined' ] ], [ '1', [ 'ref-iter', [ 'cdr', 'arg' ], [ '-', 'index', '1' ] ] ] ] ] ], [ 'cond', [ [ 'list?', 'arg' ], [ 'ref-iter', 'arg', 'index' ] ], [ '1', [ 'quote', 'undefined' ] ] ] ] ], [ 'define', 'push*', [ 'lambda', [ 'arg', 'push_value' ], [ 'define', 'push-iter', [ 'lambda', [ 'arg', 'push_value' ], [ 'cond', [ [ 'null?', 'arg' ], [ 'cons', 'push_value', [ 'quote', [  ] ] ] ], [ '1', [ 'cons', [ 'car', 'arg' ], [ 'push-iter', [ 'cdr', 'arg' ], 'push_value' ] ] ] ] ] ], [ 'cond', [ [ 'list?', 'arg' ], [ 'push-iter', 'arg', 'push_value' ] ], [ '1', [ 'quote', 'undefined' ] ] ] ] ], [ 'define', 'push', [ 'macro', [ 'var_name', 'push_value' ], [ 'quasiquote', [ 'set!', [ 'unquote', 'var_name' ], [ 'push*', [ 'unquote', 'var_name' ], [ 'unquote', 'push_value' ] ] ] ] ] ], [ 'define', 'len', [ 'lambda', [ 'arg' ], [ 'define', 'len-iter', [ 'lambda', [ 'arg', 'count' ], [ 'cond', [ [ 'null?', 'arg' ], 'count' ], [ '1', [ 'len-iter', [ 'cdr', 'arg' ], [ '+', 'count', '1' ] ] ] ] ] ], [ 'len-iter', 'arg', '0' ] ] ], [ 'define', 'setq', [ 'macro', [ 'var_name', 'var_value' ], [ 'quasiquote', [ 'set', [ 'quote', [ 'unquote', 'var_name' ] ], [ 'unquote', 'var_value' ] ] ] ] ], [ 'define', 'test-hash', [ 'quote', [ ':a', '12', ':b', '13', ':c', [ 'lambda', [ 'x', 'y' ], [ '+', 'x', 'y' ] ] ] ] ], [ 'define', 'hash-keys', [ 'lambda', [ 'hash' ], [ 'cond', [ [ 'eq', 'hash', [ 'quote', [  ] ] ], [ 'quote', [  ] ] ], [ '1', [ 'cons', [ 'car', 'hash' ], [ 'hash-keys', [ 'cdr', [ 'cdr', 'hash' ] ] ] ] ] ] ] ], [ 'define', 'hash-get', [ 'lambda', [ 'x', 'key' ], [ 'cond', [ [ 'eq', 'x', [ 'quote', [  ] ] ], [ 'quote', 'undefined' ] ], [ [ 'eq', [ 'car', 'x' ], 'key' ], [ 'ref', 'x', '1' ] ], [ '1', [ 'hash-get', [ 'cdr', [ 'cdr', 'x' ] ], 'key' ] ] ] ] ], [ 'define', 'hash-set', [ 'lambda', [ 'x', 'key', 'value' ], [ 'define', 'hash-set-iter', [ 'lambda', [ 'x', 'x_copy', 'key', 'value', 'count' ], [ 'cond', [ [ 'eq', 'x', [ 'quote', [  ] ] ], [ 'begin', [ 'push', 'x_copy', 'key' ], [ 'push', 'x_copy', 'value' ], 'x_copy' ] ], [ [ 'eq', [ 'car', 'x' ], 'key' ], [ 'set-ref!', 'x', '1', 'value' ] ], [ '1', [ 'hash-set-iter', [ 'cdr', [ 'cdr', 'x' ] ], 'x_copy', 'key', 'value', [ '+', 'count', '1' ] ] ] ] ] ], [ 'hash-set-iter', 'x', 'x', 'key', 'value', '0' ] ] ], [ 'define', 'check-in', [ 'lambda', [ 'x', 'y' ], [ 'cond', [ [ 'eq', 'y', [ 'quote', [  ] ] ], [ 'quote', [  ] ] ], [ [ 'eq', 'x', [ 'car', 'y' ] ], '1' ], [ '1', [ 'check-in', 'x', [ 'cdr', 'y' ] ] ] ] ] ], [ 'define', 'defun', [ 'macro', [ 'func-name', '&', 'rest' ], [ 'define', 'params', [ 'car', 'rest' ] ], [ 'define', 'body', [ 'cdr', 'rest' ] ], [ 'quasiquote', [ 'define', [ 'unquote', 'func-name' ], [ 'lambda', [ 'unquote', 'params' ], [ 'unquote', 'body' ] ] ] ] ] ], [ 'define', 'if', [ 'lambda', [ '&', 'params' ], [ 'define', 'judge', [ 'eval', [ 'ref', 'params', '0' ] ] ], [ 'cond', [ 'judge', [ 'eval', [ 'ref', 'params', '1' ] ] ], [ '1', [ 'eval', [ 'ref', 'params', '2' ] ] ] ] ] ], [ 'define', 'range-1', [ 'lambda', [ 'x' ], [ 'define', 'i', '0' ], [ 'define', 'output', [ 'quote', [  ] ] ], [ 'while', [ '<', 'i', 'x' ], [ 'push', 'output', 'i' ], [ 'set!', 'i', [ '+', 'i', '1' ] ] ], 'output' ] ], [ 'define', 'range-2', [ 'lambda', [ 'x', 'y' ], [ 'define', 'i', 'x' ], [ 'define', 'output', [ 'quote', [  ] ] ], [ 'while', [ '<', 'i', 'y' ], [ 'push', 'output', 'i' ], [ 'set!', 'i', [ '+', 'i', '1' ] ] ], 'output' ] ], [ 'define', 'range-3', [ 'lambda', [ 'x', 'y', 'interval' ], [ 'define', 'i', 'x' ], [ 'define', 'output', [ 'quote', [  ] ] ], [ 'cond', [ [ '<=', 'interval', '0' ], [ 'while', [ '>', 'i', 'y' ], [ 'push', 'output', 'i' ], [ 'set!', 'i', [ '+', 'i', 'interval' ] ] ] ], [ '1', [ 'while', [ '<', 'i', 'y' ], [ 'push', 'output', 'i' ], [ 'set!', 'i', [ '+', 'i', 'interval' ] ] ] ] ], 'output' ] ], [ 'define', 'range', [ 'lambda', [ '&', 'params' ], [ 'cond', [ [ 'eq', [ 'len', 'params' ], '1' ], [ 'apply', 'range-1', 'params' ] ], [ [ 'eq', [ 'len', 'params' ], '2' ], [ 'apply', 'range-2', 'params' ] ], [ '1', [ 'apply', 'range-3', 'params' ] ] ] ] ], [ 'define', 'null?', [ 'lambda', [ 'x' ], [ 'cond', [ [ 'eq', 'x', [ 'quote', [  ] ] ], '1' ], [ '1', [ 'quote', [  ] ] ] ] ] ], [ 'define', 'empty?', 'null?' ], [ 'define', 'append', [ 'lambda', [ 'x', 'y' ], [ 'cond', [ [ 'null?', 'x' ], 'y' ], [ '1', [ 'cons', [ 'car', 'x' ], [ 'append', [ 'cdr', 'x' ], 'y' ] ] ] ] ] ], [ 'define', 'dolist', [ 'macro', [ '&', 'params' ], [ 'define', 'var-name', [ 'car', 'params' ] ], [ 'define', 'iter-list', [ 'ref', 'params', '1' ] ], [ 'define', 'body', [ 'cdr', [ 'cdr', 'params' ] ] ], [ 'append', [ 'quasiquote', [ 'for', [ 'unquote', 'var-name' ], 'in', [ 'unquote', 'iter-list' ] ] ], 'body' ] ] ], [ 'define', 'list', [ 'lambda', [ '.', 'args' ], 'args' ] ], [ 'define', 'list-add', [ 'lambda', [ 'x', 'y' ], [ 'define', 'list-add-iter', [ 'lambda', [ 'x', 'y', 'result' ], [ 'cond', [ [ 'or', [ 'null?', 'x' ], [ 'null?', 'y' ] ], 'result' ], [ '1', [ 'list-add-iter', [ 'cdr', 'x' ], [ 'cdr', 'y' ], [ 'push', 'result', [ 'apply', '+', [ 'list', [ 'car', 'x' ], [ 'car', 'y' ] ] ] ] ] ] ] ] ], [ 'list-add-iter', 'x', 'y', [ 'quote', [  ] ] ] ] ], [ 'define', 'factorial', [ 'lambda', [ 'n' ], [ 'define', 'factorial-iter', [ 'lambda', [ 'n', 'result' ], [ 'cond', [ [ 'eq', 'n', '1' ], 'result' ], [ '1', [ 'factorial-iter', [ '-', 'n', '1' ], [ '*', 'result', 'n' ] ] ] ] ] ], [ 'factorial-iter', 'n', '1' ] ] ], [ 'display', [ 'len', [ 'quote', [ '1', '2', '3', '4' ] ] ] ], [ 'display', [ 'range', '2', '10' ] ] ]




// get ) index,
// start is index of first (
var indexOfLastParenthesis = function (input_str,start){
    var count = 0
    for(var i = start; i < input_str.length; i = i + 1){
        if (input_str[i]=="("){
            count+=1
            continue
        }
        else if (input_str[i]==")"){
            count-=1
            if (count==0){
                return i
            }
            continue
        }
    }
    return -1
}
/*
    one complete statement at a time
    (define x 12) -> ['define' ['x' ['12' []]]]
                     linked list
    only valid () string
    no atom, comment...
*/
var parseOneSentence = function (input_str){
    if (input_str == "")
        return []
    else if (input_str[0] == ' ' || input_str[0] == '\t' || input_str[0] == '\n')
        return parseOneSentence(input_str.slice(1))
    else if (input_str[0]==";"){
        // ; 123\n4 -> 4
        while( i!=input_str.length && input_str[i]!='\n'){i++}
        return parseString(input_str.slice(i))
    }
    else if (input_str[0] == '('){
        var i = indexOfLastParenthesis(input_str, 0)
        if (i==-1){
            console.log("Error code 1")
            return ;
        }
        return cons(parseOneSentence(input_str.slice(1,i)),parseOneSentence(input_str.slice(i+1)))
    }
    else if (input_str[0] == "'" || input_str[0]==',' || input_str[0]=='@' || input_str == '#'){
        var flag;
        if (input_str[0]=="'")
            flag = 'quote'
        else if (input_str[0]==',')
            flag = 'unquote'
        else  if (input_str[0]=='@')
            flag = 'quasiquote'
        else
            flag = '#vector'

        var dealWith_Quote_Unquote_Quasiquote = function (input_str , result , count_of_double_quote, count_of_bracket) {
               if (input_str=="")
                   return ["",result]
               else if (count_of_bracket==0 && (input_str[0]=="\n" || input_str[0]==" "))
                   return [input_str.slice(1) , result ]
               else if (input_str[0]=="\"")
                   return dealWith_Quote_Unquote_Quasiquote(input_str.slice(1) , result+"\"" , count_of_double_quote+1 , count_of_bracket )
               else if (input_str[0]=="(" && count_of_double_quote%2==0 )
                   return dealWith_Quote_Unquote_Quasiquote(input_str.slice(1) , result+"(" , count_of_double_quote, count_of_bracket+1 )
               else if (input_str[0]==")" && count_of_double_quote%2==0 ){
                   if (count_of_bracket==0)
                       return [input_str ,result]
                   return dealWith_Quote_Unquote_Quasiquote(input_str.slice(1) , result+")", count_of_double_quote , count_of_bracket-1)
               }
               else
                   return dealWith_Quote_Unquote_Quasiquote(input_str.slice(1), result+input_str[0],count_of_double_quote,count_of_bracket)
           }

        var rest_result = dealWith_Quote_Unquote_Quasiquote(input_str.slice(1), "", 0, 0)
        var rest = rest_result[0]
        var result = rest_result[1]
        return cons(cons(flag, parseOneSentence(result)), parseOneSentence(rest))
    }
    else {
        var i = 0
        while (i!=input_str.length && input_str[i]!=' ' && input_str[i]!='(' && input_str[i]!=')' && input_str[i]!='\n' && input_str[i]!='\t' && input_str[i]!=';'){
            i = i + 1
        }
        return cons(input_str.slice(0,i),parseOneSentence(input_str.slice(i+1)))
    }
}
var formatList = function (list){
    var display_string = ""
    while(1){
        if (typeof(list[0]) == 'string')
            display_string = display_string + ' ' + list[0]
        else
            display_string = display_string + ' ' + formatList(list[0])
        list = list[1]
        if(list.length == 0)
            break
        if(typeof(list) == 'string'){
            display_string = display_string + ' . ' + list
            break
        }
    }
    display_string += ')'
    display_string = display_string.slice(1)
    display_string = "(" + display_string
    return display_string
}
/*
    mode :
        parse    0
        eval     1
        compile  2
*/
var TOY_Parse = function (input_str){
    for(var i = 0; i < input_str.length; i = i + 1){
        if (input_str[i] == ' ' || input_str[i] == '\t' || input_str[i] == '\n')
            continue
        else if (input_str[i]==";"){
            // ; 123\n4 -> 4
            while( i!=input_str.length && input_str[i]!='\n'){i++}
            continue
        }
        else if (input_str[i]=='('){
            var start = i
            i = indexOfLastParenthesis(input_str, start)
            var parsed = parseOneSentence(input_str.slice(start+1,i))
            displayList(parsed)
            continue
        }
        else{
            while (i!=input_str.length && input_str[i]!=' ' && input_str[i]!='(' && input_str[i]!=')' && input_str[i]!='\n' && input_str[i]!='\t' && input_str[i]!=';'){
                i = i + 1
            }
            continue
        }
    }
}
var TOY_Eval = function (input_str,env,module_name){
    var return_value;
    for(var i = 0; i < input_str.length; i = i + 1){
        if (input_str[i] == ' ' || input_str[i] == '\t' || input_str[i] == '\n')
            continue
        else if (input_str[i]==";"){
            // ; 123\n4 -> 4
            while( i!=input_str.length && input_str[i]!='\n'){i++}
            continue
        }
        else if (input_str[i]=='('){
            var start = i
            i = indexOfLastParenthesis(input_str, start)
            var parsed = parseOneSentence(input_str.slice(start+1,i))
            
            //console.log(parsed)
            //display(parsed)
            return_value = toy(parsed,env,module_name)
            //display(return_value)
            continue
        }
        else{
            var start = i
            while (i!=input_str.length && input_str[i]!=' ' && input_str[i]!='(' && input_str[i]!=')' && input_str[i]!='\n' && input_str[i]!='\t' && input_str[i]!=';'){
                i = i + 1
            }
            return_value = toy(input_str.slice(start, i), env, module_name)
            continue
        }
    }
    return return_value
}
var displayList = function (list){
    console.log(formatList(list))
}
var display = function(arg){
    if (typeof(arg) == 'string')
        console.log(arg)
    // does not support vector yet
    else 
        displayList(arg)
    return 'undefined'
}
//var output = TOY_Parse("(define x (lambda (a b) (define x 12) (+ a b))) (define y 12) (define z 13)")
//console.log(output)
//displayList(output)


// 
// exports to Nodejs 
if (typeof(module)!="undefined"){
    module.exports.TOY_Eval = TOY_Eval
    module.exports.toy = toy 
    module.exports.toy_language =toy_language
    module.exports.printArray = printArray
    module.exports.ENV_LIST = ENV_LIST
    module.exports.display = display
    }

var output = "(define square (macro (x) @(* ,x ,x))) (square 12)"
//display( parseOneSentence(output) )
TOY_Eval(output,ENV_LIST,"")












