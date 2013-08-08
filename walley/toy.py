# codeset: utf8
#===================
#===================
# This is the virtual file system
# that hold all modules
# force float division
from __future__ import division
import sys
sys.setrecursionlimit(10000)
VirtualFileSystem={}
VirtualFileSystem["test"]="(begin (define x 12))"
# the script that is required to run before starting the toy program
TO_RUN="(stms (define display print) (define begin stms) (define list (lambda (. args) (if (null? args) (quote ()) (cons (car args) (apply list (cdr args)))))) (define symbol? (lambda (a) (if (and (atom? a) (not (number? a))) 1 0))) (define + __ADD__) (define - __MINUS__) (define * __MULT__) (define / __DIV__) (define and __AND__) (define or __OR__) (define float (lambda (a) (* 1.0 a))) (define null? (lambda (a) (if (eq a (quote ())) 1 0))) (define empty? null?) (define = (lambda (. args) (cond ((__EQUAL__ 2 (len args)) (__EQUAL__ (car args) (car (cdr args)))) (1 (__AND__ (__EQUAL__ (car args) (car (cdr args))) (apply = (cdr args))))))) (define == =) (define eq? eq) (define equal =) (define < (lambda (. args) (if (= 2 (len args)) (__LT__ (car args) (car (cdr args))) (__AND__ (__LT__ (car args) (car (cdr args))) (apply < (cdr args)))))) (define <= (lambda (. args) (if (= 2 (len args)) (__OR__ (apply = args) (apply < args)) (__AND__ (__OR__ (apply = (list (car args) (car (cdr args)))) (apply < (list (car args) (car (cdr args))))) (apply <= (cdr args)))))) (define __GT__ (lambda (a b) (if (apply <= (list a b)) 0 1))) (define > (lambda (. args) (if (= 2 (len args)) (__GT__ (car args) (car (cdr args))) (__AND__ (__GT__ (car args) (car (cdr args))) (apply > (cdr args)))))) (define >= (lambda (. args) (if (= 2 (len args)) (or (apply = args) (apply > args)) (__AND__ (__OR__ (apply = (list (car args) (car (cdr args)))) (apply > (list (car args) (car (cdr args))))) (apply >= (cdr args)))))) (define != (lambda (. args) (if (= 2 (len args)) (not (= (car args) (car (cdr args)))) (__AND__ (not (= (car args) (car (cdr args)))) (apply != (cdr args)))))) (define not (lambda (a) (if a 0 1))) (define nil (quote ())) (define remainder (lambda (a b) (if (< a b) a (remainder (- a b) b)))) (define % remainder) (define list? (lambda (a) (if (atom? a) 0 1))) (define charIsDigit (lambda (char) (if (or (eq char 0) (eq char 1) (eq char 2) (eq char 3) (eq char 4) (eq char 5) (eq char 6) (eq char 7) (eq char 8) (eq char 9)) 1 0))) (define isInteger (lambda (input) (if (null? input) 1 (if (charIsDigit (car input)) (isInteger (cdr input)) 0)))) (define isFloat (lambda (input) (define isFloatTest (lambda (input count_of_dot_and_e) (if (null? input) (if (eq count_of_dot_and_e 1) 1 0) (if (> count_of_dot_and_e 1) 0 (if (charIsDigit (car input)) (isFloatTest (cdr input) count_of_dot_and_e) (if (or (eq (car input) (quote .)) (eq (car input) (quote e))) (isFloatTest (cdr input) (+ count_of_dot_and_e 1)) 0)))))) (isFloatTest input 0))) (define isFraction (lambda (input) (define isFractionTest (lambda (input count_of_slash) (if (null? input) (if (eq count_of_slash 1) 1 0) (if (charIsDigit (car input)) (isFractionTest (cdr input) count_of_slash) (if (eq (car input) (quote /)) (isFractionTest (cdr input) (+ count_of_slash 1)) 0))))) (isFractionTest input 0))) (define +1 (lambda (x) (+ x 1))) (define last (lambda (__list__) (if (null? __list__) (print \"Error...Cannot get last atom of empty list\") (if (null? (cdr __list__)) (car __list__) (last (cdr __list__)))))) (define list-reverse (lambda (_list_) (define list-reverse (lambda (_list_ result) (if (null? _list_) result (list-reverse (cdr _list_) (cons (car _list_) result))))) (list-reverse _list_ (quote ())))) (define list-length (lambda (_list_) (define list-length-iter (lambda (_list_ count) (if (null? _list_) count (list-length-iter (cdr _list_) (+ count 1))))) (if (list? _list_) (list-length-iter _list_ 0) (print \"Error...Function list-length can not be used to get length of non-list type value\")))) (define len list-length) (define list-get (lambda (_list_ index) (if (>= index (list-length _list_)) (print \"Error...Index out of range\") (if (= index 0) (car _list_) (list-get (cdr _list_) (- index 1)))))) (define list-ref list-get) (define list-member (lambda (item _list_) (if (null? _list_) 0 (if (eq (car _list_) item) 1 (list-member item (cdr _list_)))))) (define list-atom-is-member? (lambda (element in_list) (if (null? in_list) 0 (if (eq? element (car in_list)) 1 (list-atom-is-member? element (cdr in_list)))))) (define list-atom-index (lambda (element in_list) (define list-atom-index-iter (lambda (in_list result) (if (null? in_list) -1 (if (eq? (car in_list) element) result (list-atom-index-iter (cdr in_list) (+ result 1)))))) (list-atom-index-iter in_list 0))) (define list-append (lambda (_list_ append_element) (if (null? _list_) (cons append_element nil) (cons (car _list_) (list-append (cdr _list_) append_element))))) (define list-combine (lambda (a b) (if (null? a) (if (null? b) (quote ()) (cons (car b) (list-combine a (cdr b)))) (cons (car a) (list-combine (cdr a) b))))) (define range (lambda (arg0 . args) (stms (cond ((= args (quote ())) (stms (define begin 0) (define end arg0) (define interval 1) (define output (quote ())))) ((= 1 (list-length args)) (stms (define begin arg0) (define end (car args)) (define interval 1) (define output (quote ())))) (1 (stms (define begin arg0) (define end (car args)) (define interval (car (cdr args))) (define output (quote ()))))) (if (> interval 0) (while (< begin end) (stms (set! output (list-append output begin)) (set! begin (+ begin interval)))) (while (> begin end) (stms (set! output (list-append output begin)) (set! begin (+ begin interval))))) output))) (define atom-find (lambda (_atom_ find_string) (define atom-find-test (lambda (_atom_ find_string) (if (null? find_string) 1 (if (not (eq (car _atom_) (car find_string))) 0 (atom-find-test (cdr _atom_) (cdr find_string)))))) (define atom-find-iter (lambda (_atom_ count) (if (null? _atom_) -1 (if (atom-find-test _atom_ find_string) count (atom-find-iter (cdr _atom_) (+ count 1)))))) (atom-find-iter _atom_ 0))) (define atom-slice (lambda (_atom_ start end) (define atom-slice-ahead (lambda (result count) (if (eq count start) result (atom-slice-ahead (cdr result) (+ count 1))))) (define atom-slice-back (lambda (_atom_ result count) (if (eq count end) result (atom-slice-back (cdr _atom_) (cons (car _atom_) result) (+ count 1))))) (let ((ahead (atom-slice-ahead _atom_ 0)) (after (atom-slice-back ahead (quote ()) start))) (list-reverse after)))) (define atom->list (lambda (atom) (define atom->list-iter (lambda (atom result) (if (null? atom) result (atom->list-iter (cdr atom) (cons (car atom) result))))) (list-reverse (atom->list-iter atom (quote ()))))) (define atom-length (lambda (_atom_) (define atom-length-iter (lambda (_atom_ count) (if (null? _atom_) count (atom-length-iter (cdr _atom_) (+ count 1))))) (atom-length-iter _atom_ 0))) (define syntax-match (lambda (const_keywords arg1 test_match) (define syntax-match-iter (lambda (arg1 test_match variable_table) (if (null? test_match) (if (null? arg1) variable_table 0) (if (null? arg1) (cons (quote ...) (cons (quote ()) variable_table)) (if (eq? (car arg1) (car test_match)) (if (eq? (list-atom-is-member? (car test_match) const_keywords) 1) (syntax-match-iter (cdr arg1) (cdr test_match) variable_table) 0) (if (eq? (list-atom-is-member? (car test_match) const_keywords) 1) 0 (if (eq? (quote ...) (car test_match)) (if (null? (cdr test_match)) (cons (quote ...) (cons arg1 variable_table)) (begin (define result (check (car (cdr test_match)) arg1)) (if (eq 0 result) 0 (syntax-match-iter (car result) (cdr test_match) (list-combine (cons (quote ...) (cdr result)) variable_table))))) (if (list? (car test_match)) (syntax-match-iter (cdr arg1) (cdr test_match) (list-combine (syntax-match-iter (car arg1) (car test_match) (quote ())) variable_table)) (syntax-match-iter (cdr arg1) (cdr test_match) (cons (car test_match) (cons (car arg1) variable_table))))))))))) (define check (lambda (stop_word arg1) (define check-iter (lambda (temp_arg1) (if (null? temp_arg1) 0 (if (eq (car temp_arg1) stop_word) (begin (set! arg1 temp_arg1) (quote ())) (cons (car temp_arg1) (check-iter (cdr temp_arg1))))))) (define value_need_to_assigned_to_ (check-iter arg1)) (if (eq? value_need_to_assigned_to_ 0) 0 (cons arg1 (cons value_need_to_assigned_to_ (quote ())))))) (syntax-match-iter arg1 (cdr test_match) (quote ())))) (define syntax-transfer (lambda (variable_table transfer) (define syntax-transfer-iter (lambda (transfer) (if (null? transfer) (quote ()) (if (list? (car transfer)) (cons (syntax-transfer-iter (car transfer)) (syntax-transfer-iter (cdr transfer))) (if (number? (car transfer)) (cons (car transfer) (syntax-transfer-iter (cdr transfer))) (let ((index (list-atom-index (car transfer) variable_table))) (if (eq? -1 index) (cons (car transfer) (syntax-transfer-iter (cdr transfer))) (if (and (not (null? (cdr transfer))) (eq? (car (cdr transfer)) (quote ...))) (cons (list-ref variable_table (+ 1 index)) (list-combine (list-ref variable_table (- index 1)) (syntax-transfer-iter (cdr (cdr transfer))))) (cons (list-ref variable_table (+ 1 index)) (syntax-transfer-iter (cdr transfer))))))))))) (syntax-transfer-iter transfer))) (define getmacro (lambda (args) (define VARIABLE_TABLE (quote ())) (define const_keywords (list-ref args 1)) (define pattern_lists (list-ref args 2)) (define arguments (list-ref args 3)) (define list?= (lambda (value) (if (list? value) (begin (set! VARIABLE_TABLE value) 1) 0))) (define getmacro-iter (lambda (pattern_lists) (if (null? pattern_lists) \"Error... Does not match\" (if (eq? 1 (list?= (syntax-match const_keywords arguments (car (car pattern_lists))))) (syntax-transfer VARIABLE_TABLE (car (cdr (car pattern_lists)))) (getmacro-iter (cdr pattern_lists)))))) (getmacro-iter pattern_lists))) (define macro-eg (quote (add (and) (((add stm1 stm2) (+ stm1 stm2)) ((add stm1 stm2 and stm3) (+ stm1 stm2 stm3))) (3 4 and 5)))) (define abs (lambda (a) (cond ((< a 0) (- 0 a)) (1 a)))) (define __SQRT_ACCURATE__ 0.001) (define sqrt (lambda (x) (define sqrt-iter (lambda (guess) (cond ((good-enough? guess) guess) (1 (sqrt-iter (improve guess)))))) (define improve (lambda (guess) (average guess (/ x guess)))) (define average (lambda (x y) (/ (+ x y) 2))) (define good-enough? (lambda (guess) (< (abs (- (* guess guess) x)) __SQRT_ACCURATE__))) (sqrt-iter __SQRT_ACCURATE__))) (define factorial (lambda (x) (define factorial_iter (lambda (outcome count) (if (== count 1) outcome (factorial_iter (* outcome (- count 1)) (- count 1))))) (factorial_iter x x))) (define expt (lambda (a b) (define expt_inter (lambda (result count) (if (== count 1) result (expt_inter (* result a) (- count 1))))) (if (== b 0) 1 (expt_inter a b)))) (define ^ expt) (define ** expt) (define __SIN_ACCURACY__ 0.01) (define cube (lambda (x) (* x x x))) (define p (lambda (x) (- (* 3 x) (* 4 (cube x))))) (define sine (lambda (angle) (if (not (> (abs angle) __SIN_ACCURACY__)) angle (p (sine (/ angle 3.0)))))) (define sin sine) (define pi 3.141592653589793) (define cos (lambda (x) (sin (+ x (/ pi 2))))) (define sec (lambda (x) (/ 1 (cos x)))) (define csc (lambda (x) (/ 1 (sin x)))) (define tan (lambda (x) (/ (sin x) (cos x)))) (define cot (lambda (x) (/ 1 (tan x)))) (define even? (lambda (x) (if (= (% x 2) 0) 1 0))) (define odd? (lambda (x) (if (even? x) 0 1))) (define gcd (lambda (a b) (if (= b 0) a (gcd b (remainder a b))))) (define deriv (lambda (f x dx) (/ (- (f (+ x dx)) (f x)) dx))) (define add-rat (lambda (x y) (make-rat (+ (* (numer x) (denom y)) (* (numer y) (denom x))) (* (denom x) (denom y))))) (define sub-rat (lambda (x y) (make-rat (- (* (numer x) (denom y)) (* (numer y) (denom x))) (* (denom x) (denom y))))) (define mul-rat (lambda (x y) (make-rat (* (numer x) (numer y)) (* (denom x) (denom y))))) (define div-rat (lambda (x y) (make-rat (* (numer x) (denom y)) (* (denom x) (numer y))))) (define equal-rat? (lambda (x y) (= (* (numer x) (denom y)) (* (denom x) (numer y))))) (define make-rat (lambda (n d) (let ((g (gcd n d))) (cons (/ n g) (/ d g))))) (define numer (lambda (x) (car x))) (define denom (lambda (x) (cdr x))) (define print-rat (lambda (x) (display \"\n\") (display (numer x)) (display \"/\") (display (denom x)))) (define map (lambda (process _list_) (if (null? _list_) nil (cons (process (car _list_)) (map process (cdr _list_)))))))"
VirtualFileSystem["walley_toy"]=TO_RUN

'''
    7 primitives:
    quote atom eq car cdr cons cond(or if)
    
    9 primitives:
        atom eq car cdr cons
        quote cond lambda label


    walley
    
    Copyright shd101wyy Yiyi Wang 2013~2014
    Released under MIT license
    
    
    
    TOY LANGUAGE
    
    |======|
       ||
       ||
       ||    /==\   \\ //
       ||    |  |    \//
       ||    \++/    //         language
                    //
                   //
    
    obj
    func
    val
    
    keyword:
    + - * /  %
    =
    == >= <= > < != not and or (only need to program == > and or not, and program < <= >= != in toy language)
    
    function:
    car cdr cond if cons stms eval let print list quote atom? list? number? lambda
    ... while [digit] len empty? null? float fraction
    
    
    
    
    
    (= x 12)  ->          x = 12
    (= x) -> 12
    
    (= x (+ 3 4)) ->     x = 7
    
    # eg (= x (+ 3 (- 4 5) ))-> [['(', '=', 'x', '(', '+', '3', '(', '-', '4', '5', ')', ')', ')'], True]
    
    


    1. support lazy evaluation

    '''
def charIsDigit(char):
    return char=="0" or char=="1" or char=="2" or char=="3" or char=="4" or char=="5" or char=="6" or char=="7" or char=="8" or char=="9"
    #Integer Float Fraction Unknown_or_Invalid
def checkTypeOfNum(input_str,num_of_e,num_of_dot,num_of_slash,has_digit):
    # finish
    if input_str=="":
        if has_digit!=True:
            return "Unknown_or_Invalid"
        elif num_of_slash==1 and num_of_e==0 and num_of_dot==0:
            return "Fraction"
        elif num_of_slash==0 and num_of_e==0 and num_of_dot==0:
            return "Integer"
        elif num_of_dot==1 or num_of_e==1:
            return "Float"
        return "Unknown_or_Invalid"
    elif input_str[0]=="e":
        return checkTypeOfNum(input_str[1:len(input_str)],num_of_e+1,num_of_dot,num_of_slash,has_digit)
    elif input_str[0]==".":
        return checkTypeOfNum(input_str[1:len(input_str)],num_of_e,num_of_dot+1,num_of_slash,has_digit)
    elif input_str[0]=='/':
        return checkTypeOfNum(input_str[1:len(input_str)],num_of_e,num_of_dot,num_of_slash+1,has_digit)
    elif charIsDigit(input_str[0]):
        return checkTypeOfNum(input_str[1:len(input_str)],num_of_e,num_of_dot,num_of_slash,True)
    else:
        return "Unknown_or_Invalid"
# get type of num
def typeOfNum (input_str):
    if input_str[0]=="-":
        return checkTypeOfNum(input_str[1:len(input_str)],0,0,0,False)
    return checkTypeOfNum(input_str,0,0,0,False)

# support integer 3 float 3.0 fraction 3/4
def stringIsNumber(input_str):
    if type(input_str)!=str:
        return False
    if typeOfNum(input_str)!="Unknown_or_Invalid":
        return True
    return False




#===============================
#===============================

#Tokenize string
def lexer(input_str):
    output=[]
    count=0 # count of ( and )
    length=len(input_str)
    i=0
    while i<length:
        if input_str[i]=="(":
            count=count+1
            output.append(input_str[i])
            i=i+1
            continue
        elif input_str[i]==")":
            count=count-1
            output.append(input_str[i])
            i=i+1
            continue
        # annotation
        elif input_str[i]==";":
            while i<length:
                if input_str[i]=="\n":
                    break
                i=i+1
            continue
        elif input_str[i]==" " or input_str[i]=="\n" or input_str[i]=="\t":
            i=i+1
            continue

        # quote and unquote
        elif input_str[i]=="'" or input_str[i]=="," or input_str[i]=="@":
            start=i+1
            i=i+1
            count_of_bracket=0
            count_of_double_quote=0
            while(i!=len(input_str)):
                if input_str[i]=="\"":
                    count_of_double_quote=count_of_double_quote+1
                elif input_str[i]=="(" and count_of_double_quote%2==0: # make sure ( is not inside ""
                    count_of_bracket=count_of_bracket+1
                elif input_str[i]==")" and count_of_double_quote%2==0: # make sure ( is not inside ""
                    count_of_bracket=count_of_bracket-1
                if count_of_bracket==0 and (input_str[i]==" " or input_str[i]=="\n" ):
                    break
                if count_of_bracket==-1:
                    break
                i=i+1
            to_append=input_str[start:i]
            output.append("(")
            
            # quote
            if input_str[start-1]=="'":
                output.append("quote")
            # quasiquote 
            elif input_str[start-1]=="@":
                output.append("quasiquote")
            # unquote
            else:
                output.append("unquote")
            
            x=lexer(to_append)[0]
            for a in x:
                output.append(a)


            output.append(")")
            continue

        # string
        elif input_str[i]=="\"":
            count2=0
            start=i
            while i<length:
                if input_str[i]=="\"" and input_str[i-1]!="\\":
                    count2=count2+1
                    if count2==2:
                        # remove " "
                        output.append(["quote",input_str[start+1:i]])
                        break
                i=i+1
            
            if count2!=2:
                print("Error...\nInvalid String")
                return [[],False]

            i=i+1
            if i!=length and input_str[i]!=" " and input_str[i]!=")" and input_str[i]!="\n":
                print("Error...\nInvalid String -> "+input_str[start:i+1]+"...\n")
                return [[],False]

            continue
        
        else:
            start=i
            while(i!=len(input_str) and input_str[i]!=" " and input_str[i]!="(" and input_str[i]!=")") and input_str[i]!="\n" and input_str[i]!="\t":
                i=i+1
            to_append=input_str[start:i]
            
            
            output.append(to_append)
            continue
    
    return_obj=[]
    return_obj.append(output)
    if count!=0:
        return_obj.append(False) # incomplete
    else:
        return_obj.append(True)  # complete
    return return_obj

'''
    [['(', '=', 'x', '(', '+', '3', '(', '-', '4', '5', ')', ')', ')'], True]
    ->
    ['=',
    'x',
    ['+',
    '3',
    ['-',
    '4',
    '5'
    ]
    ]
    ]
    
    '''
def parser(arr):
    if len(arr)==1:
        return arr[0]
    arr=arr[1:len(arr)-1]
    output=[]
    length=len(arr)
    i=0
    while i<length:
        if arr[i]=="(":
            # find ")"
            start=i
            count=0
            while i<length:
                if arr[i]=="(":
                    count=count+1
                elif arr[i]==")":
                    count=count-1
                    if count==0:
                        output.append(parser(arr[start:i+1]))
                        break
                i=i+1
        else:
            output.append(arr[i])
        i=i+1
    return output

# ===============================
# SEVEN primitives
# ===============================
# (quote arg) -> arg
def quote(arg):
    return arg
# (quasiquote '(1 ,(+ 1 2))) -> (1 3)
def quasiquote(arg,env):
    def calculateQuote(quote_value,env):
        # a
        if type(quote_value)==str:
            return quote_value
        # [quote a]
        elif len(quote_value)!=0 and type(quote_value[0])==str and quote_value[0]=="unquote" and len(quote_value)==2:
            return toy(quote_value[1],env)[0]
        else:
            output=[]
            for a in quote_value:
                output.append(calculateQuote(a,env))
            return output
    return calculateQuote(arg,env)
# (atom? 'Hi)
def atom(arg): 
    if type(arg)!=str:
        return "0"
    else:
        # string is list not atom
        if arg.find(" ")!=-1:
            return "0"
        return "1"
def eq(var_name1, var_name2,env):
    from operator import is_
    value1 = toy(var_name1,env)[0]
    value2 = toy(var_name2,env)[0]
    if type(value1)!=type(value2):
        return "0"
    if is_(value1,value2):
        return "1"

    if stringIsNumber(value1):
        value1=str(eval(value1))
    if stringIsNumber(value2):
        value2=str(eval(value2))

    if type(value1)==str:
        if value1==value2:
            return "1"
        else:
            return "0"
    else:
        if value1==[] and value2==[]:
            return "1"
        else:
            return "0"
# (car '(1 2 3)) -> 1
def car(value):
    if value==[]:
        print "Error... Cannot get car of empty list"
        return ""
    return value[0]

def cdr(value):
    if len(value)==0:
        print("Error\nFunction 'cdr' cannot be used on empty list")
    elif len(value)==1:
        return []
    else:
        return value[1:len(value)]
'''
I removed pair 
now (cons 'a 'b) -> 'ab
now (cons 'a '(a b)) -> '(a a b)
now (cons '(a b) 'a) Error ... you cannot do that

now no pair anymore
'''
def cons(value1,value2):
    type_value1 = type(value1)
    type_value2 = type(value2)
    # 'a 'a -> 'aa
    if type_value1==str and type_value2==str:
        return value1 + value2
    # 'a '(a) -> '(a a)
    # '(a) '(b) -> '((a) b)
    elif type_value2!=str:
        output = [value1]
        for i in value2:
            output.append(i)
        return output
    else:
        print "Error...Function cons param type error"
        return ""


def cond(tree,env):
    if tree==[]:
        return "0"
    if toy(tree[0][0],env)[0]!="0":
        return toy(tree[0][1],env)
    return cond(tree[1:len(tree)],env) 

#=======================================
#=======================================
#======= builtin functions =============
# get value of var_name in env
# assoc("x",[["x",12],["y",13]])->12
def assoc(var_name, env):
    if env==[]:
        # print "Error...Cannot find "+var_name
        return False
    if env[0][0]==var_name:
        return env[0][1]
    return assoc(var_name,env[1:len(env)])

# [a,b],[3,4] -> [[a,3],[b,4]]
def pair(x,y):
    if x==[] and y==[]:
        return []
    return cons([x[0],y[0]], pair(x[1:len(x)],y[1:len(x)]))

# [a,b] [c,d] -> [a,b,c,d]
def append(x,y):
    if x==[]:
        return y
    return cons(x[0],append(x[1:len(x)],y))

def number_(value):
    if stringIsNumber(value):
        return "1"
    return "0"
def display_(value):
    '''
        convert
        [stms [+ a b]]
        to
        (stms (+ a b))
        '''
    def convertArrayToString(array):
        #if type(array)==str:
        #    return array
        output="("
        for i in array:
            if type(i)==str:
                output=output+i+" "
            else:
                output=output+convertArrayToString(i)+" "
        return output.strip()+")"

    if type(value)==str:
        if len(value)!=0 and value[0]=="\"":
            print eval(value),
        else:
            print value,
    else:
        print convertArrayToString(value),
    return ""
# ...
#
#=======================================

def toy_language(trees,env,module_name):
    if trees==[]:
        return env
    else:
        return toy_language(cdr(trees), toy(car(trees),env,module_name)[1] , module_name )

# TRY FUNCTIONAL PROGRAMMING, without global params
# [return_value,env]
def toy(tree,env,module_name=""):
    # number
    #if stringIsNumber(tree):
    #    return [tree,env]
    # atom
    if type(tree)==str:
        return [assoc(tree,env),env]
    else:
        if type(tree[0])==str:
            # seven primitive functions
            if tree[0]=="quote":
                return [tree[1],env]
            elif tree[0]=="atom?":
                return [atom(toy(tree[1],env)[0]),env]
            elif tree[0]=="eq":
                return [eq(tree[1],tree[2],env),env]
            elif tree[0]=="car":
                return [car(toy(tree[1],env)[0]),env]
            elif tree[0]=="cdr":
                return [cdr(toy(tree[1],env)[0]),env]
            elif tree[0]=="cons":
                return [cons(toy(tree[1],env)[0],toy(tree[2],env)[0]) ,env]
            elif tree[0]=="cond":
                return cond(tree[1:len(tree)],env)
            # add + - * / functions to calculate two numbers
            elif tree[0]=="+" or tree[0]=="-" or tree[0]=="*" or tree[0]=="/":
                return [str(eval(toy(tree[1],env)[0]+tree[0]+toy(tree[2],env)[0])),env]
            elif tree[0]=="__EQUAL__":
                value1=toy(tree[1],env)[0]
                if stringIsNumber(value1):
                    value1=eval(value1)

                value2=toy(tree[2],env)[0]
                if stringIsNumber(value2):
                    value2=eval(value2)

                if value1==value2:
                    return ["1",env]
                else:
                    return ["0",env]
            elif tree[0]=="__LT__":
                value1=toy(tree[1],env)[0]
                if stringIsNumber(value1):
                    value1=eval(value1)

                value2=toy(tree[2],env)[0]
                if stringIsNumber(value2):
                    value2=eval(value2)

                if value1<value2:
                    return ["1",env]
                else:
                    return ["0",env]    
            elif tree[0]=="__OR__":
                value1=toy(tree[1],env)[0]
                if value1!="0":
                    return "1"
                value2=toy(tree[2],env)[0]
                if value2!="0":
                    return "1"
                return "0"
            elif tree[0]=="__AND__":
                value1=toy(tree[1],env)[0]
                if value1=="0":
                    return "0"
                value2=toy(tree[2],env)[0]
                if value2=="0":
                    return "0"
                return "1"
            # (define var_name var_value)
            elif tree[0]=="define":
                def var_existed(var_name,env):
                    if env==[]:
                        return False
                    elif var_name == env[0][0]:
                        return True
                    return var_existed(var_name,env[1:len(env)])
                if module_name=="":
                    var_name = tree[1]
                else:
                    var_name = module_name+"."+tree[1]
                if var_existed(var_name,env):
                    print "Error... "+var_name+" with value has been defined"
                    print "In toy language, it is not allowed to redefine var."
                    print "While not recommended to change value of a defined var,"
                    print "you could use set! function to modify the value."
                    return ["",env]
                return_obj = toy(tree[2],env)
                var_value = return_obj[0]
                new_env = return_obj[1]
                #env.insert(0,[var_name,var_value])   
                return [var_value,cons([var_name,var_value],new_env)]
            
            elif tree[0]=="lambda":
                return [tree,env]
            elif tree[0]=="begin":
                return toy(tree[len(tree)-1], toy_language(tree[1:len(tree)-1],env,module_name),module_name)
                #return eval_begin(tree[1:len(tree)],env,module_name)
            elif tree[0]=="apply":
                return toy(cons(tree[1],toy(tree[2],env)[0]),env)
            elif tree[0]=="eval":
                return toy(toy(tree[1],env,module_name)[0],env,module_name)
            #elif tree[0]=="number?":
            #    return [number_(toy(tree[1],env)[0]),env]
            elif tree[0]=="quasiquote":
                return [quasiquote(tree[1],env),env]
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
            # io function
            elif tree[0]=="display":
                return [display_(toy(tree[1],env)[0]),env]
            #elif tree[0]=="input":
            #    value = raw_input(toy(tree[1],env))
            #    return value
            #procedure value
            else:
                value = assoc(tree[0],env)
                if value == False:
                    print "Error...Undefined function "+tree[0]
                    return ["",env]
                return toy(cons(value , cdr(tree)),env)
        else:
            # label function
            if tree[0]=="label":
                pass
            elif tree[0][0]=="lambda":
                # ["a","b"] ["1","2"] -> [["a","1"],["b","2"]]
                # [". args"] ["1","2"] -> [["args", ["1","2"]]] 
                def pair_params(names,params,env):
                    if names==[]:
                        return []
                    else:
                        return cons([names[0],toy(params[0],env)[0]],pair_params(names[1:len(names)],params[1:len(params)],env))

                return_array = toy(tree[0][2], append(pair_params(tree[0][1],cdr(tree),env),env))
                return_value = return_array[0]
                return_env = return_array[1]
                return[return_value, return_env[len(return_env)-len(env):len(return_env)]]
                #return eval_begin( tree[0][2:len(tree[0])], append(pair(tree[0][1],evlis(cdr(tree),env)),env))
                #return toy(tree[0][2], append(pair_params(tree[0][1],cdr(tree),env),env))
            else:
                return toy(cons(toy(tree[0],env,module_name) , tree[1:len(tree)] ), env,module_name)

# ["x","y"] [["x",12],["y",13]] -> [12,13]
def evlis(params,env):
    if params==[]:
        return []
    return cons(toy(params[0],env)[0], evlis(params[1:len(params)],env))

