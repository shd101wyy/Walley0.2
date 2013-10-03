// toy language virtual machine




/*
    Toy Language JS compiler
*/

/*

	Implement Data Types
*/
/*
	Construct Number Data Type:
		INT FLOAT RATIONAL(FRACTION) three types
	Doesn't support complex number now
*/
var Number = function(numer, denom, type){
    this.numer = numer   // numer of number
    this.denom = denom   // denom of number 
    this.type = type     // 0:INT 1:FLOAT 2:RATIONAL
}
/*
	Save Function:

		value is an Array of Instructions
*/
var Function = function(value, param_num, is_embed_function){
	this.value = value // save function content
	this.param_num = param_num // save required param num
	this.is_embed_function = is_embed_function
}
/*
	List Data Type:
		maybe I will implement skip list or doubley linked list in the future
*/
// construct list data type
var List = function(){
	this.value  = null;
	this.next = null;
	this.prev = null
	this.push = function(value){  // push value behind
		if(this.value == null)
			this.value = value
		else{
			var pointer = this
			while(pointer.next!==null){
				pointer = pointer.next
			}
			pointer.next = new List()
			pointer.next.value = value
			pointer.next.prev = pointer
		}
	};
	this.cdr = function(){  // get cdr
		return this.next
	};
	this.car = function(){  // get car
		return this.value
	};
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
    if (input_str[0]=="-" || input_str[0]=="+")
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

/* 
	分数计算 
	/ GCD
	get general common divisor
*/
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

// add function
var __add__ = function(num1,num2){   
	if (num1.data_type!=$NUMBER || num2.data_type!=$NUMBER){
		console.log("Error...invalid data type")
		return
	} 
	num1 = num1.NUMBER
	num2 = num2.NUMBER

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

//==== substruction ===
var __sub__ = function(num1,num2){    
	if (num1.data_type!=$NUMBER || num2.data_type!=$NUMBER){
		console.log("Error...invalid data type")
		return
	} 
	num1 = num1.NUMBER
	num2 = num2.NUMBER
    if (num1.type == FLOAT || num2.type == FLOAT)
        return new Number(num1.numer/num1.denom - num2.numer/num2.denom, 1, FLOAT)
    // [numer, denom]
    var rat = sub_rat([num1.numer,num1.denom], [num2.numer, num2.denom])
    if (rat[1] == 1)
        return new Number(rat[0], 1, INT)
    else
        return new Number(rat[0], rat[1], RATIONAL)
}

//==== Multplication ===
var __mul__ = function(num1,num2){    
	if (num1.data_type!=$NUMBER || num2.data_type!=$NUMBER){
		console.log("Error...invalid data type")
		return
	} 
	num1 = num1.NUMBER
	num2 = num2.NUMBER
    if (num1.type == FLOAT || num2.type == FLOAT)
        return new Number( (num1.numer/num1.denom) * (num2.numer/num2.denom), 1, FLOAT)
    // [numer, denom]
    var rat = mul_rat([num1.numer,num1.denom], [num2.numer, num2.denom])
    if (rat[1] == 1)
        return new Number(rat[0], 1, INT)
    else
        return new Number(rat[0], rat[1], RATIONAL)
}

//==== Division ====
var __div__ = function(num1,num2){    
	if (num1.data_type!=$NUMBER || num2.data_type!=$NUMBER){
		console.log("Error...invalid data type")
		return
	} 
	num1 = num1.NUMBER
	num2 = num2.NUMBER
    if (num1.type == FLOAT || num2.type == FLOAT)
        return new Number((num1.numer/num1.denom) / (num2.numer/num2.denom), 1, FLOAT)
    // [numer, denom]
    var rat = div_rat([num1.numer,num1.denom], [num2.numer, num2.denom])
    if (rat[1] == 1)
        return new Number(rat[0], 1, INT)
    else
        return new Number(rat[0], rat[1], RATIONAL)
}


var _lt_two_values = function(value1,value2){
	if (typeof(value1)!=typeof(value2))
		return false
    if (value1.constructor == Number && value2.constructor == Number){
        if (value1.numer/value1.denom < value2.numer/value2.denom)
            return true
        return false
    }
	if (value1<value2)
	    return true
	else
	    return false
}


var eq = function(arg0, arg1){
	// "" eq [] 
	if (arg0.constructor == List && arg1.constructor == List && arg0.value==null && arg1.value==null)
		return true
	var type0 = typeof(arg0)
	var type1 = typeof(arg1)
	if (type0!=type1)
		return new List()
    if (type0=='string'){
        if (arg0==arg1)
            return true
        return false
    }
	else if (arg0.constructor == Number && arg1.constructor == Number){
        if (arg0.numer/arg0.denom == arg1.numer/arg1.denom)
            return true
        return false
    }
	else if (arg0 == arg1)
        return true
    else
		return false
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
        /*
			Ignore space tab newline
        */
        if (input_str[i]==' '||input_str[i]=='\t'||input_str[i]=='\n'){
            continue
        }
        /*
			special token
        */
        else if (input_str[i]=='('||input_str[i]==')'||
            input_str[i]=='['||input_str[i]==']'||
            input_str[i]=='{'||input_str[i]=='}'||
            input_str[i]=='@'||input_str[i]=="'"||input_str[i]==','||
            input_str[i]==':'){
            output.push(input_str[i])
        }
        /*
			Comment:
				;
        */
        else if (input_str[i]==";"){ // comment
            while( i!=input_str.length && input_str[i]!='\n'){i++}
            continue
        }
        /*
			String
        */
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

/*
	Parse Token List to Array
*/
var parseStringToArray = function(input_array){
    var output = []
    var i = 0

    var formatSpecial = function(input_array, i, output){
   		// quote
   		if(input_array[i]=="'"){
   			output.push('quote')
   		} 
   		// unquote
   		else if (input_array[i]==","){
   			output.push('unquote')
   		}
   		// quasiquote
   		else if (input_array[i]=="@"){
   			output.push('quasiquote')
   		}
   		// self->
   		else if (input_array[i]==":"){
   			output.push('quote')
   			var next = input_array[i+1]
   			if (next[0]=="("||next[0]=="{"||next[0]=="["){
   				console.log("Error...: invalid.")
   			}
   			output.push(input_array[i]+input_array[i+1])
   			return i+1
   		}

   		i++
		if(input_array[i]=="("){
            output.push([])
            i = formatList(input_array, i+1, output[output.length - 1])
            return i
        }
        else if (input_array[i]=="["){
            output.push([1])
            i = formatArray(input_array, i+1, output[output.length - 1])
            return i
        }
        else if (input_array[i]=='{'){
        	output.push([2])
        	i = formatDictionary(input_array, i+1, output[output.length - 1])
        	return i
        }
        else if (input_array[i]=="'" || input_array[i]=="," || input_array[i]=="@" || input_array[i]==":"){
        	output.push([])
        	i = formatSpecial(input_array, i, output[output.length - 1])
        	return i
        }
        else{
            output.push( formatSymbol ( input_array[i] ))
            return i
        }
    }
    // 12 -> [0,'12','1','int')
    // if its type is not Number
    // return itself
    var formatSymbol = function(input_str){
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
	        else if (input_array[i]=="'" || input_array[i]=="," || input_array[i]=="@" || input_array[i]==":"){
	        	output.push([])
	        	i = formatSpecial(input_array, i, output[output.length - 1])
	        }
            else{
                output.push( formatSymbol ( input_array[i] ))
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
	       	else if (input_array[i]=="'" || input_array[i]=="," || input_array[i]=="@" || input_array[i]==":"){
	        	output.push([])
	        	i = formatSpecial(input_array, i, output[output.length - 1])
	        }
            else if (input_array[i]=="]")
                return i
            else
                output.push(formatSymbol( input_array[i] ))
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
    		/*
    		// key
    		if(count%2==0){
    			var key = input_array[i]
    			key = parseStringToArray(key)
    			output.push(key)
    		}*/ 
    		// key can be anything now
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
    	        else if (input_array[i]=="'" || input_array[i]=="," || input_array[i]=="@" || input_array[i]==":"){
		        	output.push([])
		        	i = formatSpecial(input_array, i, output[output.length - 1])
		        }
		        else{
		        	output.push(formatSymbol( input_array[i] ))
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
        else if (input_array[i]=="'" || input_array[i]=="," || input_array[i]=="@" || input_array[i]==":"){
        	output.push([])
        	i = formatSpecial(input_array, i, output[output.length - 1])
	    }
        else{
            output.push( formatSymbol( input_array[i] ))
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

var tempName = function(offset){ // make temp name
	return offset[0]
	// return "temp_"+offset[0]+"___"
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
var MakeFunction = 4 // MakeFunction dest param_num
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

/*
	Number Types
*/
var INT = 0
var FLOAT = 1
var RATIONAL = 2

/*
	Toy Language Data Type
*/
var $FUNCTION = 0
var $ATOM = 1
var $LIST = 2
var $ARRAY = 3
var $DICTIONARY = 4
var $NUMBER = 5

/*
	Toy Language Data
*/

var DATA = function(data_type){
	this.data_type = data_type
	this.FUNCTION = null
	this.ATOM = null
	this.LIST = null
	this.ARRAY = null
	this.DICTIONARY = null
	this.NUMBER = null
}

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
	//else if (num==5)
	//	return "AddParam"
	//else if (num==6)
	//	return "EndParam"
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
	//else if (num==16)
	//	return "__ADD__"
	//else if (num==17)
	//	return "__SUB__"
	//else if (num==18)
	//	return "__MULT__"
	//else if (num==19)
	//	return "__DIV__"
	else if (num==20)
		return "IF"
	//else if (num==21)
	//	return "LT"
	//else if (num==22)
	//	return "EQ"
	//else if (num==23)
	//	return "EQVALUE"
	else if (num==24)
		return "JMP"
	//else if (num==25)
	//	return "Display"
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
var Toy_Compiler = function(tree, 
	module_name, 
	output, 
	offset,   // offset
	symbol_table      // symbol table for global and local , it is a array  []
	){

	var LENGTH = symbol_table.length
	var setCount = function(){
		offset[0] = symbol_table[symbol_table.length - 1].length
	}

	var getVar = function(var_name){
		for(var i = symbol_table.length - 1; i>=0; i--){
			for(var j = 0; j < symbol_table[i].length; j++){  
				if (var_name === symbol_table[i][j]){  // find var
					var temp_name = tempName(offset)
					offset[0] = offset[0] + 1
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
	
	var quoteFormatArray = function(arr, output){
		console.log("ARR===========")
		console.log(arr)
		var curr_count = offset[0]
		var temp_name = offset[0]
		offset[0] = offset[0] + 1
		output.push([MakeArray, temp_name])
		for(var i = 0; i < arr.length; i++){
			// atom
			if(typeof(arr[i])==='string'){
				output.push([SetConst, offset[0], arr[i]])
				output.push([ArrayPush, temp_name, offset[0]])
			}
			// Number
			else if (arr[i][0]===0){
				var num = arr[i]
                var type = INT // categorize number type
		        if(num[3]=='float')
		        	type = FLOAT
		        else if (num[3]=='rational')
		        	type = RATIONAL

		        output.push([MakeNumber, offset[0], num[1], num[2], type])
		        output.push([ArrayPush, temp_name, offset[0]])                                
			}
			// array
			else if (arr[i][0]===1){
				output.push([ArrayPush, temp_name, quoteFormatArray(arr[i].slice(1), output)])
			}
			// dictionary
			else if (arr[i][0]===2){
				output.push([ArrayPush, temp_name, quoteFormatDictionary(arr[i].slice(1), output)])
			}
			else { // list 
				output.push([ArrayPush, temp_name, quoteFormatList(arr[i], output)])
			}
		}	
		offset[0] = curr_count
		return temp_name
	}
	var quoteFormatDictionary = function(dict, output){		
		var curr_count = offset[0]
		var temp_name = offset[0]
		offset[0] = offset[0] + 1
		output.push([MakeDictionary, temp_name])
		for(var i = 0; i < dict.length; i++){
			var key = dict[i]
			var value = dict[i+1]
			// atom
			if(typeof(value)==='string'){
				output.push([SetConst, offset[0], key])
				output.push([SetConst, offset[0]+1, value])
				output.push([DictionarySet, temp_name, offset[0], offset[0]+1])
			}
			// Number
			else if (value[0]===0){
				var num = value
                var type = INT // categorize number type
		        if(num[3]=='float')
		        	type = FLOAT
		        else if (num[3]=='rational')
		        	type = RATIONAL

		        output.push([SetConst, offset[0], key])
		        output.push([MakeNumber, offset[0]+1, num[1], num[2], type])
		        output.push([DictionarySet, temp_name, offset[0] , offset[0]+1])                                
			}
			// array
			else if (value[0]===1){
				output.push([SetConst, offset[0], key])
			    output.push([DictionarySet, temp_name, offset[0], quoteFormatArray(value.slice(1), output)])
			}
			// dictionary
			else if (value[0]===2){
				output.push([SetConst, offset[0], key])
			    output.push([DictionarySet, temp_name, offset[0], quoteFormatDictionary(value.slice(1), output)])
			}
			else { // list 
				output.push([SetConst, offset[0], key])
				output.push([ArrayPush, temp_name, offset[0], quoteFormatList(value, output)])
			}
		}
		offset[0] = curr_count
		return temp_name
	}

	var quoteFormatList = function(list, output){
		var curr_count = offset[0]
		var temp_name = tempName(offset)
		offset[0] = offset[0] + 1
		output.push( [MakeList, temp_name] )
		for(var i = 0; i < list.length; i++){
			// atom
			if(typeof(list[i])==='string'){
				output.push([SetConst, offset[0], list[i]])
				output.push([ListPush, temp_name, offset[0]])
			}
			// Number
			else if (list[i][0]===0){
				var num = list[i]
                var type = INT // categorize number type
		        if(num[3]=='float')
		        	type = FLOAT
		        else if (num[3]=='rational')
		        	type = RATIONAL

		        output.push([MakeNumber, offset[0], num[1], num[2], type])
		        output.push([ListPush, temp_name, offset[0]])                                
			}
			// array
			else if (list[i][0]===1){
				output.push([ListPush, temp_name, quoteFormatArray(list[i].slice(1), output)])
			}
			// dictionary
			else if (list[i][0]===2){
				output.push([ListPush, temp_name, quoteFormatDictionary(list[i].slice(1), output)])
			}
			else { // list 
				if (list[i].length === 0){
					output.push([SetConst, offset[0], null])
					output.push([ListPush,temp_name, offset[0]])
					offset[0] = offset[0] - 1
					return temp_name
				}
				output.push([ListPush, temp_name, quoteFormatList(list[i], output)])
			}
		}
		output.push([SetConst, offset[0], null])
		output.push([ListPush,temp_name, offset[0]])
		offset[0] = curr_count
		return temp_name
	}

	// Create Array
	var makeArray = function(tree, offset){
		var temp_name = tempName(offset)  // make temp in current symbol_table_layer
        output.push( [MakeArray, temp_name] )
        offset[0] = offset[0] + 1

        for(var i = 0; i<tree.length; i++){
            var value = Toy_Compiler(tree[i], module_name, output, offset, symbol_table)
            output.push([ArrayPush, temp_name, value])
			offset[0] = offset[0] - 1 // update temp offset
        }
        return temp_name
	}
	// Create Dictionary
	var makeDictionary = function(tree, offset){
		var temp_name = tempName(offset)  // make temp in current symbol_table_layer
		output.push([MakeDictionary, temp_name])
    	offset[0] = offset[0] + 1

    	for(var i = 0; i<tree.length; i=i+2){
        	var key = Toy_Compiler(tree[i], module_name, output, offset, symbol_table) // calculate to get key
            var value = Toy_Compiler(tree[i+1], module_name, output, offset, symbol_table)    // calculate value

            output.push([DictionarySet, temp_name, key, value])
            offset[0] = offset[0] - 1
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
				// offset[0] = offset[0] + 1
            	if (typeof(tree[1]) === 'string'){
            		var temp_name = tempName(offset)
            		output.push([SetConst, temp_name, tree[1]])  // set constant
            		offset[0] = offset[0] + 1 // update offset
	                return temp_name 							 // return offset
            	}
            	// number 
    			else if (tree[1][0] === 0){
    				var num = tree[1]
	                var type = INT // categorize number type
			        if(num[3]=='float')
			        	type = FLOAT
			        else if (num[3]=='rational')
			        	type = RATIONAL

			        output.push([MakeNumber, offset[0], num[1], num[2], type])
			        output.push([ListPush, temp_name, offset[0]])     
    			}
    			// array
    			else if (tree[1][0] === 1){
    				return quoteFormatArray(tree[1].slice(1), output)
    			}
    			// dictionary
    			else if (tree[1][0] === 2){
    				return quoteFormatDictionary(tree[1].slice(1), output)
    			}
            	// list
            	else{
            		var o_ = quoteFormatList(tree[1], output)
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


                var var_value = Toy_Compiler(tree[2],module_name, output, offset, symbol_table)
                output.push([flag, var_name_index, var_value])

                setCount() // set offset number
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

                var var_value = Toy_Compiler(tree[2],module_name, output, offset, symbol_table)
                SET__( tree[1], var_value)

                setCount() // set offset number
                return
            }
            
            // IF judge jmp
            // if pass judge run next
            // else jmp
 
            else if (tree[0]=='if'){
            	var judge = Toy_Compiler(tree[1],module_name,output,offset, symbol_table)
            	var if_start_index = output.length // save below IF index
            	output.push([IF, judge]) // miss jump place
            	var value1_start_index = output.length
            	var value1 = Toy_Compiler(tree[2],module_name,output,offset, symbol_table)
            	output.push([JMP]) // if run value1, them jmp value2
            	var value2_start_index = output.length
            	var value2 = Toy_Compiler(tree[3],module_name,output,offset, symbol_table)
            	var value2_end_index = output.length

            	output[value2_start_index-1].push(value2_end_index - value2_start_index + 1)
            	output[if_start_index].push(value2_end_index - value2_start_index + 2)
            	return
            }

            // (lambda (a b) (+ a b) (- a b) )
            /*
				MakeFunction func_name param_num
				...
				procedure...
				EndFunction
				
				return temp_func_name
            */
            /*
				Lambda is data
				Lambda is function
				Lambda is structure
				Lambda is EveryThing
            */
            else if (tree[0]=='lambda'){
            	
            	var params = tree[1]
            	var stms = tree.slice(2)
            	var temp_name = tempName(offset)
            	offset[0] = offset[0] + 1

            	var makeFunction_array = [MakeFunction, temp_name]
            	
            	symbol_table.push([])                // push local symbol_table to save local variable


            	var params_num = 0
            	for(var i = 0; i<params.length; i++){
            		symbol_table[symbol_table.length-1].push(params[i]) // push var_name to symbol table
            		params_num++
            	}
            	makeFunction_array.push(params_num)  // MakeFunction func_dest func_param_num
            	output.push(makeFunction_array)   // push instruction to output

            	// output.push([AddParam, i]) // add params 
            	offset[0] = params_num  // set offset

            	Toy_JS_iter(stms, module_name, output, offset, symbol_table)

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

            	var current_count = offset[0]    // save current offset
            	
            	var temp_name = makeArray(params, offset)  // make params array
            	output.push([Call, func_name_index, temp_name]) // Call dest func_name params_array
            	return temp_name
            }
        }
        else if(typeof(tree[0])=='number'){
            // number
            if(tree[0]==0){
            	var temp_name = tempName(offset)  // make temp in current symbol_table_layer
            	offset[0] = offset[0] + 1          // update offset

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
            	return makeArray(tree.slice(1), offset)
            }
            // dictionary
            else if (tree[0]==2){
            	return makeDictionary(tree.slice(1), offset)
            }
        }
        // function
        else {
        	if(tree[0][0]=='lambda'){
        		// define function
        		var params = tree[0][1]
            	var stms = tree[0].slice(2)
            	var temp_name = tempName(offset)
            	var CALL_func_name = temp_name
            	// offset[0] = offset[0] + 1
            	output.push([MakeFunction, temp_name]) // begin to make function
            	for(var i = 0; i<params.length; i++){
            		output.push([AddParam, params[i]]) // add params
            	}
            	output.push([EndParam])
            	Toy_JS_iter(stms, module_name, output, offset, symbol_table)
            	output.push([EndFunction])

            	// call function
            	var func_name = temp_name
            	var params = tree.slice(1)
            	var temp_name = tempName(offset)
            	output.push([MakeArray, temp_name])
            	for(var i = 0; i < params.length; i++){
            		// offset[0] = offset[0] + 1
            		var o_ = Toy_Compiler(params[i], module_name, output, offset, symbol_table)
            		// offset[0] = offset[0] - 1
            		output.push([ArrayPush, temp_name, MakeString(o_)]) // i have to make it string at first
            	}
            	output.push([Call, MakeString(temp_name), func_name, temp_name])
            	return temp_name

        	}
        }
    }
}




var Toy_JS_iter = function(trees, module_name, output, offset, symbol_table){
    var i = 0
    while(i!=trees.length){
        var str_output = Toy_Compiler(trees[i], module_name, output, offset, symbol_table)
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

/*
	This function can be used to print array
*/
var printCompiledArray = function(input_array){
    for(var i = 0; i <input_array.length; i++){
        console.log(input_array[i])
    }
}


/*
	This function can be used to print Instructions
*/

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

	Lisp Machine :)
*/
var Toy_VM = function(instructions, ENV){
	var SAVE_INDEX = 0 // save value to current layer index
	for (var i = 0; i < instructions.length; i++){
		var instruction = instructions[i]
		// SetGlobal
		// SetGlobal save_index value_index
		if (instruction[0]===SetGlobal){
			var var_name_index = instruction[1]
			var var_value_index = instruction[2]
			var value = ENV[0][var_value_index]
			ENV[0][var_name_index] = value

			SAVE_INDEX = var_name_index
		}
		// GetGlobal global_var_index save_to_current_layer_index
		else if (instruction[0]===GetGlobal){
			var global_var_index = instruction[1]
			var save_to_current_layer_index = instruction[2]
			ENV[ENV.length - 1][save_to_current_layer_index] = ENV[0][global_var_index]

			SAVE_INDEX = save_to_current_layer_index
		} 
		// SetLocal local_save_index value_index
		else if (instruction[0]===SetLocal){
			var var_name_index = instruction[1]
			var var_value_index = instruction[2]
			var value = ENV[0][var_value_index]
			ENV[ENV.length - 1][var_name_index] = value

			SAVE_INDEX = var_name_index
		}
		// GetLocal local_index save_to_index
		else if (instruction[0]===GetLocal){
			var copy_index = instruction[1]
			var save_index = instruction[2]
			var value = ENV[ENV.length - 1][copy_index]
			ENV[ENV.length - 1][save_index] = value

			SAVE_INDEX = save_index
		}
		// SetConst local_save_index value
		else if (instruction[0]===SetConst){
			var var_name_index = instruction[1]
			var value = instruction[2]
			ENV[ENV.length - 1][var_name_index] = value

			SAVE_INDEX = var_name_index
		}
		// MakeNumber save_index numer denom type
		// Save at current layer
		else if (instruction[0]===MakeNumber){  // Init new Number
			var save_index = instruction[1]
			var numer = instruction[2]
			var denom = instruction[3]
			var type = instruction[4]
			var newNumber = new Number(numer, denom, type)
			var data = new DATA($NUMBER)
			data.NUMBER = newNumber
			ENV[ENV.length - 1][ save_index ] = data

			SAVE_INDEX = save_index
		}
		// Begin to make function
		// Save current line number i
		// When call function
		// JMP to current line
		else if (instruction[0]===MakeFunction){
			// jmp to EndFunction
			var offset = 1
			var function_content = [] // save function content
									  // it is slice between MakeFunction, EndFunction, and not including ENdFunction
			var func_param_num = instructions[i][2] // get param number
			i = i + 1
			while(offset!=0){
				function_content.push(instructions[i])
				if (instructions[i][0]==MakeFunction)
					offset++
				if (instructions[i][0]==EndFunction)
					offset--
				i++
			}
			function_content = function_content.slice(0, function_content.length - 1) // remove EndFunction identifier
			
			var data = new DATA($FUNCTION) // create functino data type data
			data.FUNCTION = new Function(function_content, func_param_num, 0)
			ENV[ENV.length - 1][instruction[1]] = data  // save function to that location

			SAVE_INDEX = instruction[i]
		}
		// MakeArray save_to_dest
		else if (instruction[0]===MakeArray){
			var data = new DATA($ARRAY)
			data.ARRAY = []
			ENV[ENV.length - 1][instruction[1]] = data
			SAVE_INDEX = instruction[i]
		}
		// ArrayPush save_to_dest push_value
		else if (instruction[0]===ArrayPush){
			var var_name_index = instruction[1]
			var value = ENV[ENV.length - 1][instruction[2]]
			ENV[ENV.length - 1][var_name_index].ARRAY.push(value)

			ENV[ENV.length - 1].pop() // pop push_value

			SAVE_INDEX = var_name_index
		}
		// MakeDictionary save_to_dest
		else if (instruction[0]===MakeDictionary){
			var data = new DATA($DICTIONARY)
			data.DICTIONARY = {}

			ENV[ENV.length - 1][instruction[1]] = data
			SAVE_INDEX = instruction[1]
		}
		// DictionarySet save_to_dict key value
		else if (instruction[0]===DictionarySet){
			var key_value = ENV[ENV.length - 1][instruction[2]]		// get key
			var value_value = ENV[ENV.length - 1][instruction[3]]   //  get value
			var var_value = ENV[ENV.length - 1][instruction[1]]     // get dictionary
			var_value.DICTIONARY[key_value] = value_value						// set value to key of dictionary

			ENV[ENV.length - 1].pop() // pop value
			ENV[ENV.length - 1].pop() // pop key

			SAVE_INDEX = instruction[1]
			continue
		}
		// MakeList save_index
		else if (instruction[0]===MakeList){
			ENV[ENV.length - 1][instruction[1]] = new List()

			SAVE_INDEX = instruction[1]
		}
		// MakeList push_to_index push_value
		else if (instruction[0]===ListPush){
			var list_value = ENV[ENV.length - 1][instruction[1]]
			var push_value = ENV[ENV.length - 1][instruction[2]]
			list_value.push(push_value)

			ENV[ENV.length - 1].pop()    // pop pushed value
		}
		else if (instruction[0]===IF){
			var judge_value = ENV[ENV.length - 1][instruction[1]]
			var jmp_steps = instruction[2]

			// it is list and false
			if (judge_value.constructor === List && judge_value.value===null){
				i = i + jmp_steps - 1
				continue
			}	
			// true
			else{
				continue
			}
		}
		// JMP steps
		else if (instruction[0]===JMP){
			i = i + instruction[1] - 1
		}
		// Call function
		else if (instruction[0]===Call){
			var func_index = instruction[1]					// get func index
			var func_value = ENV[ENV.length - 1][func_index]	// get value at that func index
			var params_value_arr = ENV[ENV.length - 1][instruction[2]].ARRAY	// get params array
			var save_at_index = instruction[2]                      // after calling save to that index
			// console.log(func_value)

			// Function
			if (func_value.data_type === $FUNCTION){
				/*
					Embed Function
				*/
				func_value = func_value.FUNCTION
				if (func_value.is_embed_function){
					// embed function
					var embed_func = func_value.value
					ENV.push([]) // create local
					var return_value = embed_func(params_value_arr)
					ENV.pop()
					ENV[ENV.length - 1][save_at_index] = (return_value) // occupy origninal parameter array position
					continue
				}

				var param_nums = func_value.param_num   // get parameters number
				var function_content = func_value.value // get function content

				// push new local env
				ENV.push([])
				/*
					Push Parameter to Env
				*/	
				for(var a = 0; a < param_nums; a++){
					ENV[ENV.length - 1].push(params_value_arr[a])   // push parameter value in local env
				}
				// Begin to run function_content
				Toy_VM(function_content, ENV)

				// after running function
				var return_value = ENV[ENV.length-1].pop()  // get return value
				ENV[ENV.length - 2][save_at_index] = return_value // occupy origninal parameter array position

				// pop local ENV
				ENV.pop()  // done
			}
			// Array
			else if( func_value.data_type == $ARRAY) { 
				var array_value = func_value.ARRAY
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
			else if (func_value.data_type == $DICTIONARY){
				var dict_value = func_value.DICTIONARY
				if(params_value_arr.length == 1){
					ENV[ENV.length - 1][save_at_index] = dict_value[params_value_arr[0]]
					continue
				}
				else if (params_value_arr.length == 2){
					var key = params_value_arr[0]					
					dict_value[key] = params_value_arr[1]
					ENV[ENV.length - 1][save_at_index] = dict_value
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

/*
	Embed Function
*/
var Embed_Function = {
	/*
		add function
		used to add two numbers
	*/
	__add : {func:
				function(__arr__){
					return __add__(__arr__[0], __arr__[1])
				},
			 param_num:2
			},
	/*
		sub function
		used to substract two numbers
	*/
	__sub: {func:
				function(__arr__){
					return __sub__(__arr__[0], __arr__[1])
				},
			 param_num:2
			},
	/*
		mul function
		used to mul two numbers
			*/
	__mul: {func:
				function(__arr__){
					return __mul__(__arr__[0], __arr__[1])
				},
			 param_num:2
			},
	/* 
		div function
		used to divide two numbers
		*/
	__div: {func:
				function(__arr__){
					return __div__(__arr__[0], __arr__[1])
				},
			 param_num:2
			},
	/*
		__lt function:
		compare <
		*/
	__lt: {
		func: function(__arr__){
			if (_lt_two_values(__arr__[0], __arr__[1]))
				return "true"
			return new List()
		},
		param_num:2
	},
	__eq: {
		func: function(__arr__){
			if (eq(__arr__[0], __arr__[1]))
				return "true"
			return new List()
		},
		param_num:2
	},
	__display:{
		func: function(__arr__){
			console.log("Display Function ======")
			console.log(__arr__[0])
			console.log("Finish ================")
		},
		param_num:1
	},
	car:{
		func: function(__arr__){
			return __arr__[0].value
		},
		param_num:1
	},
	cdr:{
		func: function(__arr__){
			return __arr__[0].next
		},
		param_num:1
	},
	'set-car!':{
		func: function(__arr__){
			__arr__[0].value = __arr__[1]
		},
		param_num:2
	},
	'set-cdr!':{
		func: function(__arr__){
			__arr__[0].next = __arr__[1]
		},
		param_num:2
	}
}

/*
	Generate symbol table according to embed function
	*/
var generateSymbolTable = function(Embed_Function){
	var symbol_table = [[]]
	for(var i in Embed_Function){
		symbol_table[0].push(i) // copy key to symbol table
								// [["__add", "__sub", ...]]
	}
	return symbol_table
}

/*
	Copy embed function to ENV
	*/
var generateEnv = function(Embed_Function){
	var ENV = [[]]
	for(var i in Embed_Function){
		var func = Embed_Function[i]
		var data = new DATA($FUNCTION)
		data.FUNCTION = new Function(func["func"], func["param_num"], 1) 
		var new_function = data
		ENV[ENV.length-1].push(new_function)
	}
	return ENV
}

var generateOffset = function(Embed_Function){
	var offset = [0]
	offset[0] = Object.keys(Embed_Function).length
	return offset
}
// var x = "(define x [2 a b]) (define b (quote (a b))) (add a (quote b c))"
//var x = "(add a (quote (b c)))"
var x = " (define x {:a 12}) (x :a 15) (__display (x :a)) "
var y = Tokenize_String(x)
var z = parseStringToArray(y)
console.log(z)
var output = []
var offset = generateOffset(Embed_Function)
var symbol_table = generateSymbolTable(Embed_Function)
var last = Toy_JS_iter(z, "", output,offset, symbol_table)

console.log(output)
printInstructions(output)
console.log("\n\n======\n\n")



if(1){
	var ENV = generateEnv(Embed_Function)
	var env = Toy_VM(output, ENV)
	console.log(env)
}























































