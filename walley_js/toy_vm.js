// toy language virtual machine




/*
    Toy Language JS compiler
*/

/*

	Implement Data Types
*/
var Number = function(numer, denom, type){
    this.numer = numer   // numer of number
    this.denom = denom   // denom of number 
    this.type = type     // 0:INT 1:FLOAT 2:RATIONAL
}

var Function = function(value){
	this.value = value // save function content
}

// ==================

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



var MakeList = function(){
	this.value = null
}
var ListPush = function(list, push_value){
	if(list.value == null)
		list.value = push_value
	else 
		list.value = [list.value, push_value]
	return list
}
var ArrayPush = function(arr, push_value){
	arr.push(push_value)
}
var DictionarySet = function(dict, key, value){
	dict[key] = value
}

var Call = function(temp_name, func, params_str){
	// array
	if( Object.prototype.toString.call( func ) === '[object Array]' ) {
    	var index = eval(params_str[0])
    	return func[index]
	}
	// dictionary
	if(typeof(func)==='object'){
		var key = params_str[0]
		if(key[0]!=':')
			key = eval(key)
		key = key.slice(1)
		eval(temp_name+" = "+JSON.stringify(func[key]))
	}
	// func
	else{

	}
}


// tokenize input string
var Tokenize_String = function(input_str){
    var output = []
    for(var i = 0; i < input_str.length; i++){
        if (input_str[i]==' '||input_str[i]=='\t'||input_str[i]=='\n'){
            continue
        }
        else if (input_str[i]=='('||input_str[i]==')'||
            input_str[i]=='['||input_str[i]==']'||
            input_str[i]=='{'||input_str[i]=='}'||
            input_str[i]=='@'||input_str[i]=="'"||input_str[i]==','){
            output.push(input_str[i])
        }
        else if (input_str[i]==";"){ // comment
            while( i!=input_str.length && input_str[i]!='\n'){i++}
            continue
        }
        else if (input_str[i]=='"'){ // string
            var start = i
            i = i + 1
            while(input_str[i]!='"' && i!=input_str.length){
                if(input_str[i]=='\\')
                    i = i + 1
                i = i + 1
            }
            output.push('(')
            output.push('quote')
            output.push(input_str.slice(start+1, i))
            output.push(')')
        }
        else { // atom or number
            var start = i
            while (i!=input_str.length && input_str[i]!=' ' 
                && input_str[i]!='(' && input_str[i]!=')' 
                && input_str[i]!='[' && input_str[i]!=']' 
                && input_str[i]!='{' && input_str[i]!='}' 
                && input_str[i]!='\n' && input_str[i]!='\t'
                 && input_str[i]!=';'){
                    i = i + 1
                }
            output.push(input_str.slice(start, i))
            i = i - 1
        }
    }
    return output
}


var parseStringToArray = function(input_array){
    var output = []
    var i = 0


    // 12 -> [0,'12','1','int')
    // if its type is not Number
    // return itself
    var formatNumber = function(input_str){
    var type = stringIsNumber(input_str)
    if (type!=false){
        var append_obj
        if(type == "Integer"){
            append_obj = [0, input_str, '1', 'int']
        }
        else if (type == "Float"){
            append_obj = [0, input_str, '1' ,'float']
        }
        else if (type == "Fraction"){
            append_obj = [0, get_numerator(input_str), get_denominator(input_str), 'rational']
        }
        return append_obj
    }
    return input_str
}

    var formatList = function(input_array, i, output){
        while(i<input_array.length){
            if(input_array[i]=="("){
                output.push([])
                i = formatList(input_array, i+1, output[output.length - 1])
            }
            else if(input_array[i]==")"){
                return i
            }
            else if (input_array[i]=="["){
                output.push([1])
                i = formatArray(input_array, i+1, output[output.length - 1])
            }
            else if (input_array[i]=='{'){
	        	output.push([2])
	        	i = formatDictionary(input_array, i+1, output[output.length - 1])
	        }
            else{
                output.push( formatNumber ( input_array[i] ))
            }
            i++
        }
    }
    var formatArray = function(input_array, i, output){
        while(i<input_array.length){
            if(input_array[i]=="("){
                output.push([])
                i = formatList(input_array, i+1, output[output.length - 1])
            }
            else if (input_array[i]=="["){
                output.push([1])
                i = formatArray(input_array, i+1, output[output.length - 1])
            }
            else if (input_array[i]=='{'){
	        	output.push([2])
	        	i = formatDictionary(input_array, i+1, output[output.length - 1])
	        }
            else if (input_array[i]=="]")
                return i
            else
                output.push(formatNumber( input_array[i] ))
            i++
        }
    }
    var formatDictionary = function(input_array, i, output){
    	var count = 0
    	while(i<input_array.length){
    		// key : count%2 == 0
    		// value : count%2 == 1
    		if(input_array[i]=='}'){
    			if(count%2 == 1){
    				console.log("Error...invalid dictionary")
    				return i
    			}
    			return i
    		}
    		// key
    		if(count%2==0){
    			var key = input_array[i]
    			if(key[0]!=':'){
    				console.log("Error...invalid key.")
    				return i
    			}
    			output.push(key)
    		}
    		// value
    		else{
    			if(input_array[i]=="("){
	                output.push([])
	                i = formatList(input_array, i+1, output[output.length - 1])
	            }
	            else if (input_array[i]=="["){
	                output.push([1])
	                i = formatArray(input_array, i+1, output[output.length - 1])
	            }
	            else if (input_array[i]=='{'){
		        	output.push([2])
		        	i = formatDictionary(input_array, i+1, output[output.length - 1])
		        }
		        else{
		        	output.push(formatNumber( input_array[i] ))
		        }
    		}

    		i++
    		count++
    	}
    }
    while(i<input_array.length){
        if(input_array[i]=="("){
            output.push([])
            i = formatList(input_array, i+1, output[output.length - 1])
        }
        else if (input_array[i]=="["){
            output.push([1])
            i = formatArray(input_array, i+1, output[output.length - 1])
        }
        else if (input_array[i]=='{'){
        	output.push([2])
        	i = formatDictionary(input_array, i+1, output[output.length - 1])
        }
        else{
            output.push( formatNumber( input_array[i] ))
        }
        i++
    }
    return output
}

var Define = function(var_name, var_value){
    return "var "+var_name+" = " + var_value
}
var Set = function(var_name, var_value){
    return var_name+" = " + var_value
}
var MakeString = function(x){return "\""+x+"\""}

var tempName = function(count){ // make temp name
	return count[0]
	// return "temp_"+count[0]+"___"
}
// get value of var where var is string
var getValue = function(str_var){
	return eval(str_var)
}


/*
	Define 				
	Set

	ListPush : dest
	MakeList

	MakeFunction : dest
	AddParam
	EndParam
	EndFunction
	Call

	MakeArray : dest
	ArrayPush
	ArrayPop
	ArraySet

	MakeDictionary : dest
	DictionarySet

	MakeNumber  : dest numer denom type

	#ADD#
	#SUB#
	#MULT#
	#DIV#

	IF 
	LT
	EQ
*/
var Define = 0      // Define dest value
var Set = 1         // Set dest value
var MakeList = 2    // MakeList dest 
var ListPush = 3    // ListPush dest value
var MakeFunction = 4 // MakeFunction dest 
var AddParam = 5     // AddParam num_of_param
var EndParam = 6     // EndParam
var EndFunction = 7  // EndFunction
var Call = 8         // Call func_index param_array_addr_and_after_call_save_to_that_place
var MakeArray = 9    // MakeArray dest
var ArrayPush = 10   // ArrayPush dest value
var ArrayPop = 11    // ArrayPost save_dest pop_array
var ArraySet = 12    // ArraySet dest index value
var MakeDictionary = 13 // MakeDictionary dest
var DictionarySet = 14  // Dictionary dest key value
var MakeNumber = 15     // MakeNumber dest numer denom type  在当前的 layer
var __ADD__ = 16        // __ADD__ dest value1 value2
var __SUB__ = 17
var __MULT__ = 18
var __DIV__ = 19
var IF = 20            // IF judge jmp  // if pass judge, run next, else jump
var LT = 21            // LT save_dest value1 value2
var EQ = 22
var EQVALUE = 23
var JMP = 24           // JMP steps  
var Display = 25
var SetGlobal = 26     // set Layer 0   
var SetUP = 27         // set Layer (lay_num)   SetUP layer index var_name value
var SetLocal = 28      // set Layer set_index   
var GetGlobal = 29	   // 						   GetGlobal index save_to_index
var GetUP = 30		   // 						   GetUp  layer index save_to_index
var GetLocal = 31	   //						   GetLocal index save_to_index
var SetConst = 32      // set constant, like string, to current layer
					   // SetConst save_index value

var INT = 0
var FLOAT = 1
var RATIONAL = 2

var opcode = function(num){
	if(num===0)
		return "Define"
	else if (num==1)
		return "Set"
	else if (num==2)
		return "MakeList"
	else if (num==3)
		return "ListPush"
	else if (num==4)
		return "MakeFunction"
	else if (num==5)
		return "AddParam"
	else if (num==6)
		return "EndParam"
	else if (num==7)
		return "EndFunction"
	else if (num==8)
		return "Call"
	else if (num==9)
		return "MakeArray"
	else if (num==10)
		return "ArrayPush"
	else if (num==11)
		return "ArrayPop"
	else if (num==12)
		return "ArraySet"
	else if (num==13)
		return "MakeDictionary"
	else if (num==14)
		return "DictionarySet"
	else if (num==15)
		return "MakeNumber"
	else if (num==16)
		return "__ADD__"
	else if (num==17)
		return "__SUB__"
	else if (num==18)
		return "__MULT__"
	else if (num==19)
		return "__DIV__"
	else if (num==20)
		return "IF"
	else if (num==21)
		return "LT"
	else if (num==22)
		return "EQ"
	else if (num==23)
		return "EQVALUE"
	else if (num==24)
		return "JMP"
	else if (num==25)
		return "Display"
	else if (num==26)
		return "SetGlobal"
	else if (num==27)
		return "SetUP"
	else if (num==28)
		return "SetLocal"
	else if (num==29)
		return "GetGlobal"
	else if (num==30)
		return "GetUP"
	else if (num==31)
		return "GetLocal"
	else if (num==32)
		return "SetConst"

	//else if (num==29)
	//	return "Get"
	//else if (num==30)
	//	return "Set"
}

/*
=====================================================================================================================================
=====================================================================================================================================
====================================== TOY OPCODE GENERATOR =========================================================================
=====================================================================================================================================	
=====================================================================================================================================

*/
var Toy_JS = function(tree, 
	module_name, 
	output, 
	count,   // offset
	symbol_table      // symbol table for global and local , it is a array  []
	){

	var LENGTH = symbol_table.length
	var setCount = function(){
		count[0] = symbol_table[symbol_table.length - 1].length
	}

	var getVar = function(var_name){
		for(var i = symbol_table.length - 1; i>=0; i--){
			for(var j = 0; j < symbol_table[i].length; j++){  
				if (var_name === symbol_table[i][j]){  // find var
					var temp_name = tempName(count)
					count[0] = count[0] + 1
					var flag = GetGlobal
					if(i === 0){ // get global
						flag = GetGlobal
						output.push([flag, j, temp_name])
						return temp_name;
					}
					else if (i === symbol_table.length - 1){  // get local
						flag = GetLocal
						output.push([flag, j, temp_name])
						return temp_name;
					}
					else{  // get up
						flag = GetUP
						output.push([flag, i, j, temp_name])
						return temp_name;
						
					}
				}
			}
		}
		console.log("Error...unbound var " + var_name)
	}
	
	var quoteFormatList = function(list, output, temp_name){
		output.push( [MakeList, temp_name] )
		for(var i = 0; i < list.length; i++){
			if(typeof(list[i])==='string')
				output.push([ListPush, temp_name, MakeString(list[i])])
			else { // list 
				quoteFormatList(list[i], output, tempName(count))
				output.push([ListPush, temp_name, tempName(count)])
			}
		}
		output.push([ListPush, temp_name, null] )
		return temp_name
	}

	// Create Array
	var makeArray = function(tree, count){
		var temp_name = tempName(count)  // make temp in current symbol_table_layer
        output.push( [MakeArray, temp_name] )
        count[0] = count[0] + 1

        for(var i = 0; i<tree.length; i++){
            var value = Toy_JS(tree[i], module_name, output, count, symbol_table)
            output.push([ArrayPush, temp_name, value])
			count[0] = count[0] - 1 // update temp count
        }
        return temp_name
	}
	// Create Dictionary
	var makeDictionary = function(tree, count){
		var temp_name = tempName(count)  // make temp in current symbol_table_layer
		output.push([MakeDictionary, temp_name])
    	count[0] = count[0] + 1

    	for(var i = 0; i<tree.length; i=i+2){
        	var key = tree[i].slice(1) // get key name // remove : ahead key
        	var key_index = tempName(count)
        	count[0] = count[0] + 1
        	output.push([SetConst, key_index, key])  // set key to local index

            var value = Toy_JS(tree[i+1], module_name, output, count, symbol_table)   
            output.push([DictionarySet, temp_name, key_index, value])
            count[0] = count[0] - 1
        }
        return temp_name
	}

    if (module_name === "undefined")
        module_name = ""
    if (typeof(tree) == "string"){
        return getVar(tree)
    }
    // else if (typeof(tree) === 'number'){
    // 	return [LENGTH-1, tree]
    // }
    else{
        if(typeof(tree[0])=="string"){
            if(tree[0]==="quote"){
            	var temp_name = tempName(count)
				// count[0] = count[0] + 1
            	if (typeof(tree[1]) === 'string'){
	                return MakeString(tree[1])
            	}
            	// list
            	else{
            		var o_ = quoteFormatList(tree[1],output,temp_name)
            		return o_
            	}
            }
            /*
				Define(var_name, var_value)
				var_name must be string
            */
            else if (tree[0]=="define"){
                var var_name = tree[1]               // get var_name

                symbol_table[symbol_table.length - 1].push( var_name ) // push var_name to symbol table
                var var_name_index = symbol_table[symbol_table.length - 1].length - 1 // get that var_name index

                var flag = SetLocal
                var length_of_symbol_table = symbol_table.length
                if(length_of_symbol_table == 1)
                	flag = SetGlobal


                var var_value = Toy_JS(tree[2],module_name, output, count, symbol_table)
                output.push([flag, var_name_index, var_value])

                setCount() // set count number
                return
            }
             /*
				Set(var_name, var_value)
				var_name must be string
            */
            else if (tree[0]=="set!"){
        		// This function is for set!
				// return [local/up/global, index]
				// local: 0
				// up : 1
				// global : 2
				var SET__ = function(var_name, var_value){
					var length = symbol_table.length
					var start = length - 1
					for(var i = length - 1; i >= 0; i--){
						for(var j = 0; j < symbol_table[i].length; j++){
							if (symbol_table[i][j] === var_name){
								if ( i === 0){ // Global
									output.push([SetGlobal, j, var_value])
									return 
								}
								else if (start === i ) {// local
									output.push([SetLocal, j, var_value])
									return
								}
								else {// Up
									output.push([SetUP, i, j, var_value]) // set var at index
									return
								}
							}

						}
					}
					
					console.log("Error...unbound variable "+var_name)
				}

                var var_value = Toy_JS(tree[2],module_name, output, count, symbol_table)
                SET__( tree[1], var_value)

                setCount() // set count number
                return
            }
            // #ADD# dest value1 value2
            // save value1+value2 - > dest
            else if (tree[0]=="__ADD__"){
            	var temp_name = tempName(count)
            	// count[0] = count[0] + 1
            	var value1 = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var value2 = Toy_JS(tree[2],module_name,output,count, symbol_table)
            	output.push([__ADD__, temp_name, value1, value2])
            	return temp_name
            }
            else if (tree[0]=="__SUB__"){
            	var temp_name = tempName(count)
            	// count[0] = count[0] + 1
            	var value1 = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var value2 = Toy_JS(tree[2],module_name,output,count, symbol_table)
            	output.push([__SUB__, temp_name, value1, value2])
            	return temp_name
            }

            else if (tree[0]=="__MULT__"){
            	var temp_name = tempName(count)
            	// count[0] = count[0] + 1
            	var value1 = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var value2 = Toy_JS(tree[2],module_name,output,count, symbol_table)
            	output.push([__MULT__, temp_name, value1, value2])
            	return temp_name
            }

            else if (tree[0]=="__DIV__"){
            	var temp_name = tempName(count)
            	// count[0] = count[0] + 1
            	var value1 = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var value2 = Toy_JS(tree[2],module_name,output,count, symbol_table)
            	output.push([__DIV__, temp_name, value1, value2])
            	return temp_name
            }
            // IF judge jmp
            // if pass judge run next
            // else jmp
            /*
            else if (tree[0]=='if'){
            	var judge = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var if_start_index = output.length // save below IF index
            	output.push([IF, judge]) // miss jump place
            	var value1_start_index = output.length
            	var value1 = Toy_JS(tree[2],module_name,output,count, symbol_table)
            	output.push([JMP]) // if run value1, them jmp value2
            	var value2_start_index = output.length
            	var value2 = Toy_JS(tree[3],module_name,output,count, symbol_table)
            	var value2_end_index = output.length

            	output[value2_start_index-1].push(value2_end_index - value2_start_index + 1)
            	output[if_start_index].push(value2_end_index - value2_start_index + 2)
            	return
            }*/
            else if (tree[0]=='LT'){
            	var count_copy = count[0]
            	var value1 = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var value2 = Toy_JS(tree[2],module_name,output,count, symbol_table)

            	count[0] = count_copy
            	var temp_name = tempName( count )
            	output.push([LT, temp_name, value1, value2])
            	return temp_name
            }
            else if (tree[0]=='EQ'){
            	var value1 = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var value2 = Toy_JS(tree[2],module_name,output,count, symbol_table)
            	var temp_name = tempName(count)
            	output.push([EQ, temp_name, value1, value2])
            	return temp_name
            }
            else if (tree[0]=='EQVALUE'){
            	var value1 = Toy_JS(tree[1],module_name,output,count, symbol_table)
            	var value2 = Toy_JS(tree[2],module_name,output,count, symbol_table)
            	var temp_name = tempName(count)
            	output.push([EQ, temp_name, value1, value2])
            	return temp_name
            }
            else if (tree[0]=='display'){
            	var value = Toy_JS(tree[1],module_name,output, count, symbol_table)
            	output.push([Display, value])
            	return
            }

            // (lambda (a b) (+ a b) (- a b) )
            /*
				MakeFunction( temp_func_name )
				AddParam(param1)
				...
				procedure...
				EndFunction()
				
				return temp_func_name
            */
            /*
				Lambda is data
				Lambda is function
				Lambda is structure
				Lambda is EveryThing
            */
            else if (tree[0]=='lambda'){
            	/*
        		var compileLambdaList = function(list, output, temp_name){
					for(var i = 0; i < list.length; i++){
						if(typeof(list[i])==='string'){
							var value = Toy_JS(list[i], module_name, output, count, symbol_table)
							output.push([ListPush, temp_name, value])
						}
						else { // list 
							var temp_name = tempName(count)
							count[0] = symbol_table[symbol_table.length - 1].length
							output.push( [MakeList, temp_name] )          // create list and save to temp_name
							output.push([ListPush, temp_name, compileLambdaList(list[i], output, temp_name)])
						}
					}
					output.push([ListPush, temp_name, null] )
					return temp_name
				}

            	
            	symbol_table.push([]) // add local 
            	// add params at first
            	for(var i = 0; i < tree[1].length; i++){
            		symbol_table[symbol_table.length - 1].push(tree[1][i])
            	}

            	setCount()

            	var temp_name = tempName(count)
            	count[0] = count[0] + 1

            	output.push( [MakeList, temp_name] )          // create list and save to temp_name
				output.push( [ListPush, temp_name, "lambda"]) // push lambda

            	var o_ = compileLambdaList(tree.slice(1),output,temp_name)
            	symbol_table.pop([])
            	return o_ */

            	
            	var params = tree[1]
            	var stms = tree.slice(2)
            	var temp_name = tempName(count)
            	count[0] = count[0] + 1

            	output.push([MakeFunction, temp_name]) // begin to make function
            	
            	symbol_table.push([])                // push local symbol_table to save local variable


            	var params_num = 0
            	for(var i = 0; i<params.length; i++){
            		symbol_table[symbol_table.length-1].push(params[i]) // push var_name to symbol table
            		params_num++
            	}
            	output.push([AddParam, i]) // add params 
            	count[0] = params_num  // set count

            	Toy_JS_iter(stms, module_name, output, count, symbol_table)

            	output.push([EndFunction])	// End Function

            	symbol_table.pop()			// remvoe local 

            	return temp_name
            }
            // call function
            // (add a b)
            else {
            	var func_name = tree[0]	        // get function name  (add a b) => add
            	var func_name_index = getVar(func_name)   // get function index 

            	var params = tree.slice(1) // get params (add a b) => (a b)

            	var current_count = count[0]    // save current count
            	/*
            	var temp_name = tempName(count) // get temp name for MakeList
            	count[0] = count[0] + 1         // increase temp

            	output.push([MakeList, temp_name])  // at temp_name position make list
            	for(var i = 0; i < params.length; i++){
            		var curr_count = count[0]
            		var value = Toy_JS(params[i], module_name, output, count, symbol_table) // calculate each param
            		output.push([ListPush, temp_name, value])	// add value to list 
            		count[0] = curr_count // restore to last count
            	}
            	count[0] = current_count // restore count
            	*/
            	var temp_name = makeArray(params, count)  // make params array
            	output.push([Call, func_name_index, temp_name]) // Call dest func_name params_array
            	return temp_name
            }
        }
        else if(typeof(tree[0])=='number'){
            // number
            if(tree[0]==0){
            	var temp_name = tempName(count)  // make temp in current symbol_table_layer
            	count[0] = count[0] + 1          // update count

                var type = INT // categorize number type
                if(tree[3]=='float')
                	type = FLOAT
                else if (tree[3]=='rational')
                	type = RATIONAL

                output.push([MakeNumber, temp_name, tree[1], tree[2], type])
                                
                return temp_name
            }
            // array
            else if(tree[0]==1){
            	return makeArray(tree.slice(1), count)
            }
            // dictionary
            else if (tree[0]==2){
            	return makeDictionary(tree.slice(1), count)
            }
        }
        // function
        else {
        	if(tree[0][0]=='lambda'){
        		// define function
        		var params = tree[0][1]
            	var stms = tree[0].slice(2)
            	var temp_name = tempName(count)
            	var CALL_func_name = temp_name
            	// count[0] = count[0] + 1
            	output.push([MakeFunction, temp_name]) // begin to make function
            	for(var i = 0; i<params.length; i++){
            		output.push([AddParam, params[i]]) // add params
            	}
            	output.push([EndParam])
            	Toy_JS_iter(stms, module_name, output, count, symbol_table)
            	output.push([EndFunction])

            	// call function
            	var func_name = temp_name
            	var params = tree.slice(1)
            	var temp_name = tempName(count)
            	output.push([MakeArray, temp_name])
            	for(var i = 0; i < params.length; i++){
            		// count[0] = count[0] + 1
            		var o_ = Toy_JS(params[i], module_name, output, count, symbol_table)
            		// count[0] = count[0] - 1
            		output.push([ArrayPush, temp_name, MakeString(o_)]) // i have to make it string at first
            	}
            	output.push([Call, MakeString(temp_name), func_name, temp_name])
            	return temp_name

        	}
        }
    }
}




var Toy_JS_iter = function(trees, module_name, output, count, symbol_table){
    var i = 0
    while(i!=trees.length){
        var str_output = Toy_JS(trees[i], module_name, output, count, symbol_table)
        // if(str_output!=null)
        // 	output.push(str_output)
        i++
    }
    return output
}


/*==========================================
==  =  ====
===  = ===
====  =================
====== ==========
==========================================*/

var printCompiledArray = function(input_array){
    for(var i = 0; i <input_array.length; i++){
        console.log(input_array[i])
    }
}




var printInstructions = function(instructions){
	for(var i = 0; i < instructions.length; i++){
		if(typeof(instructions[i]) === 'string'){
			console.log(i+": "+instructions[i])
			continue
		}
		var output = i+": "+opcode( instructions[i][0] )
		for(var j = 1; j < instructions[i].length; j++){
			output=output+" "+instructions[i][j]
		}
		console.log(output)
	}
}

/*
	TOY Language Virtual Machine
*/
var Toy_VM = function(instructions, ENV){
	for (var i = 0; i < instructions.length; i++){
		var instruction = instructions[i]
		//console.log(instruction)
		//console.log(ENV)
		// SetGlobal
		// SetGlobal save_index value_index
		if (instruction[0]===SetGlobal){
			var var_name_index = instruction[1]
			var var_value_index = instruction[2]
			var value = ENV[0][var_value_index]
			ENV[0][var_name_index] = value
		}
		// GetGlobal global_var_index save_to_current_layer_index
		else if (instruction[0]===GetGlobal){
			var global_var_index = instruction[1]
			var save_to_current_layer_index = instruction[2]
			ENV[ENV.length - 1][save_to_current_layer_index] = ENV[0][global_var_index]
		} 
		// SetLocal local_save_index value_index
		else if (instruction[0]===SetLocal){
			var var_name_index = instruction[1]
			var var_value_index = instruction[2]
			var value = ENV[0][var_value_index]
			ENV[ENV.length - 1][var_name_index] = value
		}
		// SetConst local_save_index value
		else if (instruction[0]===SetConst){
			var var_name_index = instruction[1]
			var value = instruction[2]
			ENV[ENV.length - 1][var_name_index] = value
		}
		// MakeNumber save_index numer denom type
		// Save at current layer
		else if (instruction[0]===MakeNumber){  // Init new Number
			var save_index = instruction[1]
			var numer = instruction[2]
			var denom = instruction[3]
			var type = instruction[4]
			ENV[ENV.length - 1][ save_index ] = new Number(numer, denom, type)
		}
		// Begin to make function
		// Save current line number i
		// When call function
		// JMP to current line
		else if (instruction[0]===MakeFunction){
			// jmp to EndFunction
			var count = 1
			var function_content = [] // save function content
									  // it is slice between and not including MakeFunction, EndFunction
			i=i+1
			while(count!=0){
				function_content.push(instructions[i])
				if (instructions[i][0]==MakeFunction)
					count++
				if (instructions[i][0]==EndFunction)
					count--
				i++
			}
			function_content = function_content.slice(0, function_content.length - 1) // remove EndFunction identifier
			ENV[ENV.length - 1][instruction[1]] = new Function(function_content)  // save function to that location
		}
		// MakeArray save_to_dest
		else if (instruction[0]===MakeArray){
			ENV[ENV.length - 1][instruction[1]] = []
		}
		// ArrayPush save_to_dest push_value
		else if (instruction[0]===ArrayPush){
			var var_name_index = instruction[1]
			var value = ENV[ENV.length - 1][instruction[2]]
			ENV[ENV.length - 1][var_name_index].push(value)
		}
		// MakeDictionary save_to_dest
		else if (instruction[0]===MakeDictionary){
			ENV[ENV.length - 1][instruction[1]] = {}
		}
		// DictionarySet save_to_dict key value
		else if (instruction[0]===DictionarySet){
			var key_value = ENV[ENV.length - 1][instruction[2]]		// get key
			var value_value = ENV[ENV.length - 1][instruction[3]]   //  get value
			var var_value = ENV[ENV.length - 1][instruction[1]]     // get dictionary
			var_value[key_value] = value_value						// set value to key of dictionary
			continue
		}
		// Display value_index
		else if (instruction[0]===Display){
			console.log("Display Function ======")
			var value_index = instruction[1]
			console.log(ENV[ENV.length - 1][value_index])
			console.log("Finish ================")
		}
		else if (instruction[0]===__ADD__){
			// add function
			var __add__ = function(num1,num2){    
			    if (num2.constructor != Number){
			        if (typeof(num2)!='string')
			            num2 = num2.value
			        if (num1.constructor != Number){
			            if (typeof(num1)!='string')
			                num1 = num1.value
			            return num1+num2
			        }
			        else if (num1.type == RATIONAL)
			            return (num1.numer + "/" + num1.denom)+num2
			        else 
			            return num1.numer + num2
			    }
				if (num1.type == FLOAT || num2.type == FLOAT)
					return new Number(num1.numer/num1.denom + num2.numer/num2.denom, 1, FLOAT)
			    // [numer, denom]
				var rat = add_rat([num1.numer,num1.denom], [num2.numer, num2.denom])
			    if (rat[1] == 1)
			        return new Number(rat[0], 1, INT)
			    else
			        return new Number(rat[0], rat[1], RATIONAL)
			}
			var dest = instruction[1]
			var value1 = ENV[ENV.length - 1][instruction[2]]
			var value2 = ENV[ENV.length - 1][instruction[3]]
			console.log("value1: "+value1)
			console.log("value2: "+value2)
			ENV[ENV.length - 1][dest] = __add__(value1, value2)
		}
		/*
			(fn params....)

			(array index)  - > return array[index]
			(array index value) - > array[index] = value

			(dictionary key)  - > return dictionary[key]
			(dictionary key value) - > dictionary[key] = value
	
			Call save_to_index func_index param_array_index
			Call func_index param_array_index_and_after_call_save_to_that_index
		*/
		else if (instruction[0]===Call){
			var func_index = instruction[1]					// get func index
			var func_value = ENV[ENV.length - 1][func_index]	// get value at that func index
			var params_value_arr = ENV[ENV.length - 1][instruction[2]]	// get params array
			var save_at_index = params_value_arr                      // after calling save to that index
			// console.log(func_value)

			// Function
			if (func_value.constructor === Function){
			
				var param_nums = func_value.value[0][1]   // get parameters number

				// push new local env
				ENV.push([])
				for(var a = 0; a < param_nums; a++){
					ENV[ENV.length - 1].push(params_value_arr[a])   // push parameter value in local env
				}

				console.log("Func_Value: ")
				printInstructions(func_value.value)
				// Begin to run func_value
				Toy_VM(func_value.value, ENV)

				// after running function
				// Pop Last value and save it to last layer save_at_index
				var return_value = ENV[ENV.length-1].pop()
				ENV[ENV.length - 2][save_at_index] = return_value

				// pop local ENV
				ENV.pop()  // done

				console.log("Return Value: ")
				console.log(return_value)
				/*

				console.log(ENV)
				console.log("Return Value: ")
				console.log(return_value)

				console.log("Params Number:")
				console.log(param_nums)

				console.log("Params:")
				console.log(params_value_arr)

				console.log("Env:")
				console.log(ENV[ENV.length - 1])

				console.log("Func_Value: ")
				console.log(func_value)
				*/
			}
			// Array
			else if( Object.prototype.toString.call( func_value ) === '[object Array]' ) { 
				var array_value = func_value
				// get value at index
				if (params_value_arr.length == 1){
					ENV[ENV.length - 1][save_at_index] = array_value[params_value_arr[0]]
				}
				else if (params_value_arr.length == 2){
					// Check Index
					if(params_value_arr[0].type !== INT){
						console.log("Error...invalid index "+params_value_arr)
						continue
					}
					var set_index = params_value_arr[0].numer
					// check boundary
					if(set_index>=array_value.length || set_index<0){
						cnosole.log("Error...index out of boundary")
						continue
					}
					array_value[set_index] = params_value_arr[1]
					ENV[ENV.length - 1][save_at_index] = array_value
				}
				else{
					console.log("Error... invalid params for array operation")
					continue
				}
			}
			// Dictionary(obj)
			else if (typeof(func_value) === 'object'){
				var dict_value = func_value
				if(params_value_arr.length == 1){
					ENV[ENV.length - 1][save_at_index] = dict_value[params_value_arr[0]]
				}
				else if (params_value_arr.length == 2){
					var key = params_value_arr[0]
					if(key[0]!=":"){
						console.log("Error...invalid key")
						continue
					}
					key=key.slice(1)
					dict_value[key] = params_value_arr[1]
					ENV[ENV.length - 1][key] = dict_value
					continue
				}
				else{
					console.log("Error... invalid params for dictionary operation")
					continue
				}
			}

		}
	}

	return ENV
}

// var x = "(define x [2 a b]) (define b (quote (a b))) (add a (quote b c))"
//var x = "(add a (quote (b c)))"
var x = "(define add (lambda (a b) (__ADD__ a b) )) (display (add 1 2))"
var y = Tokenize_String(x)
var z = parseStringToArray(y)
console.log(z)
var output = []
var count = [0]
var symbol_table = [[]]
var last = Toy_JS_iter(z, "", output,count, symbol_table)

console.log(output)
printInstructions(output)
console.log("\n\n======\n\n")

// var env = Toy_VM(output)
// console.log(env)

	var ENV = []
	ENV[0] = []
var env = Toy_VM(output, ENV)
console.log(env)
// eval(js)


































