# codeset: utf8
'''
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
    
    
    
    
    
    Macro
    
    
    Macro Database
    variable must start with $
    
    ==================================
    (for i in 0 10
    (print i)
    )
    
    ->
    
    (stms
    (= i 0)
    (while (< i 0)
    (print i)
    )
    )
    
    (=>
    "translate"
    "symbol"
    '(for $i $v in $1 $2 $3))
    
    
    "return "
    "symbol"
    
    (cond
    ((< $1 $2)
    '(while (< $i $1) (stms $3 (= $1 (+ $1 1))))
    )
    )
    )
    
    
    ==================================
    
    (square x) -> (* x x)
    (square x y) -> (* x y)
    
    (=> start_name ([1] [translate 1 to .1]) ([2] [.2]))
    
    (=> square
    ('($) '(* $ $))
    ('($ $$) '(* $ $$))
    )
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    '''
# force float division
from __future__ import division
import sys
sys.setrecursionlimit(10000)

#================== Fraction Support ===================
# general common divisor
def gcd(n,d):
    if d==0:
        return n
    return gcd(d, n%d)
def make_rat(n,d):
    g = gcd(n,d)    # gcd
    return [int(n/g),int(d/g)]
def numer(fraction):
    return fraction[0]
def denom(fraction):
    return fraction[1]
def add_rat (x,y):
    return make_rat( numer(x)*denom(y)+numer(y)*denom(x) , denom(x)*denom(y))
def sub_rat (x,y):
    return make_rat( numer(x)*denom(y)-numer(y)*denom(x) , denom(x)*denom(y))
def mul_rat (x,y):
    return make_rat(numer(x)*numer(y), denom(x)*denom(y))
def div_rat (x,y):
    return make_rat(numer(x)*denom(y),denom(x)*numer(y))
def equal_rat (x,y):
    return numer(x)*denom(y) == denom(x)*numer(y)
def print_rat(x):
    print str(numer(x))+"/"+str(denom(x))
def rat_to_string(x):
    if denom(x)==1:
        return str(numer(x))
    return str(numer(x))+"/"+str(denom(x))
# [n,d]
def numerator_and_denominator_of_string(x):
    index = x.find("/")
    if index==-1:
        return [int(x),1]
    else:
        return [int(x[0:index]), int(x[index+1:len(x)])]
def charIsDigit(char):
    return char=="0" or char=="1" or char=="2" or char=="3" or char=="4" or char=="5" or char=="6" or char=="7" or char=="8" or char=="9"
def stringIsFloat(string):
    i=0
    count_of_dot=0
    count_of_e=0
    while i<len(string):
        if charIsDigit(string[i])==False:
            if string[i]==".":
                count_of_dot=count_of_dot+1
            elif string[i]=="e":
                count_of_e=count_of_e+1
            else:
                return False
        i=i+1
    if count_of_e==1 or count_of_dot==1:
        return True
    return False
def math_operation(x,y,sign):
    if stringIsFloat(x) or stringIsFloat(y):
        return str(eval(x+sign+y))
    f1 = numerator_and_denominator_of_string(x)
    f2 = numerator_and_denominator_of_string(y)
    if sign=="+":
        return rat_to_string(add_rat(f1,f2))
    elif sign=="-":
        return rat_to_string(sub_rat(f1,f2))
    elif sign=="*":
        return rat_to_string(mul_rat(f1,f2))
    else:
        return rat_to_string(div_rat(f1,f2))

#===================
#===================
# This is the virtual file system
# that hold all modules
VirtualFileSystem={}

# the script that is required to run before starting the toy program
TO_RUN="(stms (define display print) (define begin stms) (define list (lambda (. args) (if (null? args) (quote ()) (cons (car args) (apply list (cdr args)))))) (define + __ADD__) (define - __MINUS__) (define * __MULT__) (define / __DIV__) (define float (lambda (a) (* 1.0 a))) (define null? (lambda (a) (if (eq a (quote ())) 1 0))) (define empty? null?) (define = (lambda (. args) (cond ((__EQUAL__ 2 (len args)) (__EQUAL__ (car args) (car (cdr args)))) (1 (__AND__ (__EQUAL__ (car args) (car (cdr args))) (apply = (cdr args))))))) (define == =) (define eq? eq) (define equal =) (define < (lambda (. args) (if (= 2 (len args)) (__LT__ (car args) (car (cdr args))) (__AND__ (__LT__ (car args) (car (cdr args))) (apply < (cdr args)))))) (define <= (lambda (. args) (if (= 2 (len args)) (__OR__ (apply = args) (apply < args)) (__AND__ (__OR__ (apply = (list (car args) (car (cdr args)))) (apply < (list (car args) (car (cdr args))))) (apply <= (cdr args)))))) (define __GT__ (lambda (a b) (if (apply <= (list a b)) 0 1))) (define > (lambda (. args) (if (= 2 (len args)) (__GT__ (car args) (car (cdr args))) (__AND__ (__GT__ (car args) (car (cdr args))) (apply > (cdr args)))))) (define >= (lambda (. args) (if (= 2 (len args)) (or (apply = args) (apply > args)) (__AND__ (__OR__ (apply = (list (car args) (car (cdr args)))) (apply > (list (car args) (car (cdr args))))) (apply >= (cdr args)))))) (define != (lambda (. args) (if (= 2 (len args)) (not (= (car args) (car (cdr args)))) (__AND__ (not (= (car args) (car (cdr args)))) (apply != (cdr args)))))) (define __AND__ (lambda (a b) (if a (if b 1 0) 0))) (define __OR__ (lambda (a b) (if a 1 (if b 1 0)))) (define and (lambda (. args) (if (null? args) 1 (__AND__ (car args) (apply and (cdr args)))))) (define or (lambda (. args) (if (null? args) 0 (__OR__ (car args) (apply or (cdr args)))))) (define not (lambda (a) (if a 0 1))) (define nil (quote ())) (define remainder (lambda (a b) (if (< a b) a (remainder (- a b) b)))) (define % remainder) (define list? (lambda (a) (if (atom? a) 0 1))) (define charIsDigit (lambda (char) (if (or (eq char 0) (eq char 1) (eq char 2) (eq char 3) (eq char 4) (eq char 5) (eq char 6) (eq char 7) (eq char 8) (eq char 9)) 1 0))) (define isInteger (lambda (input) (if (null? input) 1 (if (charIsDigit (car input)) (isInteger (cdr input)) 0)))) (define isFloat (lambda (input) (define isFloatTest (lambda (input count_of_dot_and_e) (if (null? input) (if (eq count_of_dot_and_e 1) 1 0) (if (> count_of_dot_and_e 1) 0 (if (charIsDigit (car input)) (isFloatTest (cdr input) count_of_dot_and_e) (if (or (eq (car input) (quote .)) (eq (car input) (quote e))) (isFloatTest (cdr input) (+ count_of_dot_and_e 1)) 0)))))) (isFloatTest input 0))) (define isFraction (lambda (input) (define isFractionTest (lambda (input count_of_slash) (if (null? input) (if (eq count_of_slash 1) 1 0) (if (charIsDigit (car input)) (isFractionTest (cdr input) count_of_slash) (if (eq (car input) (quote /)) (isFractionTest (cdr input) (+ count_of_slash 1)) 0))))) (isFractionTest input 0))) (define +1 (lambda (x) (+ x 1))) (define last (lambda (__list__) (if (null? __list__) (print \"Error...Cannot get last atom of empty list\") (if (null? (cdr __list__)) (car __list__) (last (cdr __list__)))))) (define list-reverse (lambda (_list_) (define list-reverse (lambda (_list_ result) (if (null? _list_) result (list-reverse (cdr _list_) (cons (car _list_) result))))) (list-reverse _list_ (quote ())))) (define list-length (lambda (_list_) (define list-length-iter (lambda (_list_ count) (if (null? _list_) count (list-length-iter (cdr _list_) (+ count 1))))) (if (list? _list_) (list-length-iter _list_ 0) (print \"Error...Function list-length can not be used to get length of non-list type value\")))) (define len list-length) (define list-get (lambda (_list_ index) (if (>= index (list-length _list_)) (print \"Error...Index out of range\") (if (= index 0) (car _list_) (list-get (cdr _list_) (- index 1)))))) (define list-ref list-get) (define list-member (lambda (item _list_) (if (null? _list_) 0 (if (eq (car _list_) item) 1 (list-member item (cdr _list_)))))) (define list-atom-is-member? (lambda (element in_list) (if (null? in_list) 0 (if (eq? element (car in_list)) 1 (list-atom-is-member? element (cdr in_list)))))) (define list-atom-index (lambda (element in_list) (define list-atom-index-iter (lambda (in_list result) (if (null? in_list) -1 (if (eq? (car in_list) element) result (list-atom-index-iter (cdr in_list) (+ result 1)))))) (list-atom-index-iter in_list 0))) (define list-append (lambda (_list_ append_element) (if (null? _list_) (cons append_element nil) (cons (car _list_) (list-append (cdr _list_) append_element))))) (define range (lambda (arg0 . args) (stms (cond ((= args (quote ())) (stms (define begin 0) (define end arg0) (define interval 1) (define output (quote ())))) ((= 1 (list-length args)) (stms (define begin arg0) (define end (car args)) (define interval 1) (define output (quote ())))) (1 (stms (define begin arg0) (define end (car args)) (define interval (car (cdr args))) (define output (quote ()))))) (if (> interval 0) (while (< begin end) (stms (set! output (list-append output begin)) (set! begin (+ begin interval)))) (while (> begin end) (stms (set! output (list-append output begin)) (set! begin (+ begin interval))))) output))) (define atom-find (lambda (_atom_ find_string) (define atom-find-test (lambda (_atom_ find_string) (if (null? find_string) 1 (if (not (eq (car _atom_) (car find_string))) 0 (atom-find-test (cdr _atom_) (cdr find_string)))))) (define atom-find-iter (lambda (_atom_ count) (if (null? _atom_) -1 (if (atom-find-test _atom_ find_string) count (atom-find-iter (cdr _atom_) (+ count 1)))))) (atom-find-iter _atom_ 0))) (define atom-slice (lambda (_atom_ start end) (define atom-slice-ahead (lambda (result count) (if (eq count start) result (atom-slice-ahead (cdr result) (+ count 1))))) (define atom-slice-back (lambda (_atom_ result count) (if (eq count end) result (atom-slice-back (cdr _atom_) (cons (car _atom_) result) (+ count 1))))) (let ((ahead (atom-slice-ahead _atom_ 0)) (after (atom-slice-back ahead (quote ()) start))) (list-reverse after)))) (define atom->list (lambda (atom) (define atom->list-iter (lambda (atom result) (if (null? atom) result (atom->list-iter (cdr atom) (cons (car atom) result))))) (list-reverse (atom->list-iter atom (quote ()))))) (define atom-length (lambda (_atom_) (define atom-length-iter (lambda (_atom_ count) (if (null? _atom_) count (atom-length-iter (cdr _atom_) (+ count 1))))) (atom-length-iter _atom_ 0))) (define syntax-match (lambda (const_keywords arg1 test_match) (define syntax-match-iter (lambda (arg1 test_match variable_table) (if (null? test_match) (if (null? arg1) variable_table 0) (if (eq? (car arg1) (car test_match)) (if (eq? (list-atom-is-member? (car test_match) const_keywords) 1) (syntax-match-iter (cdr arg1) (cdr test_match) variable_table) 0) (if (eq? (list-atom-is-member? (car test_match) const_keywords) 1) 0 (syntax-match-iter (cdr arg1) (cdr test_match) (cons (car test_match) (cons (car arg1) variable_table)))))))) (syntax-match-iter arg1 (cdr test_match) (quote ())))) (define syntax-transfer (lambda (variable_table transfer) (define syntax-transfer-iter (lambda (transfer) (if (null? transfer) (quote ()) (let ((index (list-atom-index (car transfer) variable_table))) (if (eq? -1 index) (cons (car transfer) (syntax-transfer-iter (cdr transfer))) (cons (list-ref variable_table (+ 1 index)) (syntax-transfer-iter (cdr transfer)))))))) (syntax-transfer-iter transfer))) (define getmacro (lambda (args) (define VARIABLE_TABLE (quote ())) (define const_keywords (list-ref args 1)) (define pattern_lists (list-ref args 2)) (define arguments (list-ref args 3)) (define list?= (lambda (value) (if (list? value) (begin (set! VARIABLE_TABLE value) 1) 0))) (define getmacro-iter (lambda (pattern_lists) (if (null? pattern_lists) \"Error... Does not match\" (if (eq? 1 (list?= (syntax-match const_keywords arguments (car (car pattern_lists))))) (syntax-transfer VARIABLE_TABLE (car (cdr (car pattern_lists)))) (getmacro-iter (cdr pattern_lists)))))) (getmacro-iter pattern_lists))) (define macro-eg (quote (add (and) (((add stm1 stm2) (+ stm1 stm2)) ((add stm1 stm2 and stm3) (+ stm1 stm2 stm3))) (3 4 and 5)))) (define abs (lambda (a) (cond ((< a 0) (- 0 a)) (1 a)))) (define __SQRT_ACCURATE__ 0.001) (define sqrt (lambda (x) (define sqrt-iter (lambda (guess) (cond ((good-enough? guess) guess) (1 (sqrt-iter (improve guess)))))) (define improve (lambda (guess) (average guess (/ x guess)))) (define average (lambda (x y) (/ (+ x y) 2))) (define good-enough? (lambda (guess) (< (abs (- (* guess guess) x)) __SQRT_ACCURATE__))) (sqrt-iter __SQRT_ACCURATE__))) (define factorial (lambda (x) (define factorial_iter (lambda (outcome count) (if (== count 1) outcome (factorial_iter (* outcome (- count 1)) (- count 1))))) (factorial_iter x x))) (define expt (lambda (a b) (define expt_inter (lambda (result count) (if (== count 1) result (expt_inter (* result a) (- count 1))))) (if (== b 0) 1 (expt_inter a b)))) (define ^ expt) (define ** expt) (define __SIN_ACCURACY__ 0.01) (define cube (lambda (x) (* x x x))) (define p (lambda (x) (- (* 3 x) (* 4 (cube x))))) (define sine (lambda (angle) (if (not (> (abs angle) __SIN_ACCURACY__)) angle (p (sine (/ angle 3.0)))))) (define sin sine) (define pi 3.141592653589793) (define cos (lambda (x) (sin (+ x (/ pi 2))))) (define sec (lambda (x) (/ 1 (cos x)))) (define csc (lambda (x) (/ 1 (sin x)))) (define tan (lambda (x) (/ (sin x) (cos x)))) (define cot (lambda (x) (/ 1 (tan x)))) (define even? (lambda (x) (if (= (% x 2) 0) 1 0))) (define odd? (lambda (x) (if (even? x) 0 1))) (define gcd (lambda (a b) (if (= b 0) a (gcd b (remainder a b))))) (define deriv (lambda (f x dx) (/ (- (f (+ x dx)) (f x)) dx))) (define add-rat (lambda (x y) (make-rat (+ (* (numer x) (denom y)) (* (numer y) (denom x))) (* (denom x) (denom y))))) (define sub-rat (lambda (x y) (make-rat (- (* (numer x) (denom y)) (* (numer y) (denom x))) (* (denom x) (denom y))))) (define mul-rat (lambda (x y) (make-rat (* (numer x) (numer y)) (* (denom x) (denom y))))) (define div-rat (lambda (x y) (make-rat (* (numer x) (denom y)) (* (denom x) (numer y))))) (define equal-rat? (lambda (x y) (= (* (numer x) (denom y)) (* (denom x) (numer y))))) (define make-rat (lambda (n d) (let ((g (gcd n d))) (cons (/ n g) (/ d g))))) (define numer (lambda (x) (car x))) (define denom (lambda (x) (cdr x))) (define print-rat (lambda (x) (display \"\n\") (display (numer x)) (display \"/\") (display (denom x)))) (define map (lambda (process _list_) (if (null? _list_) nil (cons (process (car _list_)) (map process (cdr _list_))))))) "
VirtualFileSystem["walley_toy"]=TO_RUN


#===============================
#===============================


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
        elif input_str[i]=="'" or input_str[i]==",":
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
                if count_of_bracket==0 and input_str[i]==" ":
                    break
                if count_of_bracket==-1:
                    break
                i=i+1
            to_append=input_str[start:i]
            output.append("(")
            
            # quote
            if input_str[start-1]=="'":
                output.append("quote")
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
                        output.append(input_str[start:i+1])
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
            # quote
            #if to_append=="quote":
            # delete spaces
            #    while i!=len(input_str) and input_str[i]==" ":
            #         i=i+1
            
            #    a=length-1
            #    count2=0
            #    while a>i:
            #        if input_str[a]=="(":
            #            count2=count2-1
            #        elif input_str[a]==")":
            #            count2=count2+1
            #            if count2==count:
            #                print input_str[i:a]
            #                output.append(input_str[i:a])
            #                break
            #        a=a-1
            #    i=a
            #    continue
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


#def pushSymbolicTable(SYMBOLIC_TABLE):
#    SYMBOLIC_TABLE=SYMBOLIC_TABLE[0:len(SYMBOLIC_TABLE)-1]
#    return SYMBOLIC_TABLE
'''
    var:
    function
    symbol
    
    support :
    quote
    car
    cdr
    '''


# GLOBAL VALUE
# SYMBOLIC_TABLE

SYMBOLIC_TABLE=[]
SYMBOLIC_TABLE.append({})

# add embeded function

SYMBOLIC_TABLE[0]["float"]="float"
SYMBOLIC_TABLE[0]["fraction"]="fraction"


SYMBOLIC_TABLE[0]["global="]="global="
SYMBOLIC_TABLE[0]["local="]="local="
SYMBOLIC_TABLE[0]["define"]="define"
SYMBOLIC_TABLE[0]["set!"]="set!"



SYMBOLIC_TABLE[0]["car"]="car"
SYMBOLIC_TABLE[0]["cdr"]="cdr"
SYMBOLIC_TABLE[0]["quote"]="quote"
SYMBOLIC_TABLE[0]["cons"]="cons"
SYMBOLIC_TABLE[0]["cond"]="cond"
SYMBOLIC_TABLE[0]["eq"]="eq"


SYMBOLIC_TABLE[0]["print"]="print"
SYMBOLIC_TABLE[0]["stms"]="stms"
SYMBOLIC_TABLE[0]["eval"]="eval"
SYMBOLIC_TABLE[0]["let"]="let"
SYMBOLIC_TABLE[0]["lambda"]="lambda"
SYMBOLIC_TABLE[0]["len"]="len"
SYMBOLIC_TABLE[0]["if"]="if"


SYMBOLIC_TABLE[0]["atom?"]="atom?"
SYMBOLIC_TABLE[0]["number?"]="number?"


'''
ADD EMBEDED FUNCTION WHICH CANNOT BE USED AS VAR NAME
'''

SYMBOLIC_TABLE[0]["__ADD__"]="__ADD__"
SYMBOLIC_TABLE[0]["__MINUS__"]="__MINUS__"
SYMBOLIC_TABLE[0]["__MULT__"]="__MULT__"
SYMBOLIC_TABLE[0]["__DIV__"]="__DIV__"
SYMBOLIC_TABLE[0]["__EQUAL__"]="__EQUAL__"
SYMBOLIC_TABLE[0]["__LT__"]="__LT__"



MARCRO_DATABASE={}



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

# convert string to Array
# "Hi" -> ["H","i"]
def convertStringToArray(input_str):
    output=[]
    for i in input_str:
        output.append(i)
    return output

# support 3 3.0 3.0e-12 2/5
# three kind of value
# does not support complex number
def isNumber(element):
    if type(element)!=str:
        return False
    try:
        float(element)
        return True
    except ValueError:
        #print "Not a float"
        # check fraction
        # check fraction
        i=0
        if element[0]=="-":
            i=i+1
        count=0
        while i<len(element):
            if element[i].isdigit()==False:
                if element[i]=="/":
                    i=i+1
                    count=count+1
                    continue
                else:
                    return False
            else:
                i=i+1
                continue
        if count==1:
            return True
        return False


def interpreter(tree):
    global SYMBOLIC_TABLE
    global MARCRO_DATABASE
    
    length=len(tree)
    if length == 0:
        return ""
    if tree=="":
        return ""
    # (= x 3) x and 3 are just returned
    if type(tree)==str:        
        if isNumber(tree):
            return tree
        # string
        elif tree[0]=="\"" and tree[len(tree)-1]=="\"":
            return tree
        else:
            length=len(SYMBOLIC_TABLE)
            i=length-1
            while i>=0:
                if tree in SYMBOLIC_TABLE[i].keys():
                    
                    tree = SYMBOLIC_TABLE[i][tree]
                    # Deal with Lazy Evaluation
                    #['__LAZY_VALUE__', SYMBOLIC_TABLE_index, var_name, var_value]
                    if type(tree)!=str and len(tree)==4 and tree[0]=="__LAZY_VALUE__":
                        index = tree[1]                        
                        value = interpreter(tree[3])
                        # stop running the code below
                        # to solve bug in recursion function
                        # SYMBOLIC_TABLE[index][tree[2]] = value
                        return value

                    return tree
                i=i-1
            print("\nError...\nUndefined value "+tree+"\n")

    # x = 12
    # add to global symbolic table
    elif tree[0]=="global=":
        var_name=tree[1]
        
        # (= x 12)
        
        # or
        # (= x '(1 2 3))
        #
        # (= x 0 12) -> x = (12 2 3)
        #
        #
        #
        if type(var_name)==str:
            if var_name.isdigit() or var_name==".":
                print("Error...\nBad variable name -> "+var_name)
                return ""
            if length==3:
                var_value=interpreter(tree[2])
                SYMBOLIC_TABLE[0][var_name]=var_value
                return var_value
    
    # local x = 12
    # add to local symbolic table
    elif tree[0]=="local=" or tree[0]=="define":
        if length!=3:
            print("Error. = need 3 values inside")
        var_name=tree[1]
        var_value=interpreter(tree[2])
        SYMBOLIC_TABLE[len(SYMBOLIC_TABLE)-1][var_name]=var_value
        return var_value

    # can be used to change value
    elif tree[0]=="set!":
        var_name = tree[1]
        var_value = interpreter(tree[2])
        i = len(SYMBOLIC_TABLE)-1
        while i>=0:
            if var_name in SYMBOLIC_TABLE[i]:
                SYMBOLIC_TABLE[i][var_name] = var_value
                return var_value
            i=i-1
        print "Error...\nUndefined var "+var_name
        return ""

    #elif tree[0]=="+" or tree[0]=="-" or tree[0]=="*" or tree[0]=="/":    
    #    sign=interpreter(tree[0])
        
    #    i=2
    #    append_str=interpreter(tree[1])
    #    while i<length:
            
    #        append_str = Walley_Calculation(append_str,interpreter(tree[i]),sign)
    #        i=i+1
    #    return append_str

    elif tree[0]=="__ADD__" or tree[0]=="__MINUS__" or tree[0]=="__MULT__" or tree[0]=="__DIV__":
        sign = "+"
        if tree[0]=="__ADD__":
            sign="+"
        elif tree[0]=="__MINUS__":
            sign="-"
        elif tree[0]=="__MULT__":
            sign="*"
        else:
            sign="/"
        previous = interpreter(tree[1])
        i = 2
        while i<len(tree):
            next = interpreter(tree[i])
            previous = math_operation(previous,next,sign)
            i=i+1
        return previous

    elif tree[0]=="__EQUAL__":
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)

        value2=interpreter(tree[2])
        if isNumber(value2):
            value2=eval(value2)

        if type(value1)==str and  value1[0]=="\"":
            value1 = convertStringToArray(value1[1:len(value1)-1])
        if type(value2)==str and value2[0]=="\"":
            value2 = convertStringToArray(value2[1:len(value2)-1])

        if value1==value2:
            return "1"
        else:
            return "0"
    elif tree[0]=="__LT__":
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)

        value2=interpreter(tree[2])
        if isNumber(value2):
            value2=eval(value2)

        if type(value1)==str and  value1[0]=="\"":
            value1 = convertStringToArray(value1[1:len(value1)-1])
        if type(value2)==str and value2[0]=="\"":
            value2 = convertStringToArray(value2[1:len(value2)-1])

        if value1<value2:
            return "1"
        else:
            return "0"       
        


    # function quote
    # (quote (1,2,3)) --> (1,2,3)
    elif tree[0]=="quote":
        #print 'it is quote'
        quote_value=tree[1]
        
        # if a=12
        # a -> a
        # [[unquote a] a]-> [12 a]
        # [unquote a]-> 12
        def calculateQuote(quote_value):
            # a
            if type(quote_value)==str:
                return quote_value
            # [quote a]
            elif len(quote_value)!=0 and type(quote_value[0])==str and quote_value[0]=="unquote" and len(quote_value)==2:
                return interpreter(quote_value[1])
            else:
                output=[]
                for a in quote_value:
                    output.append(calculateQuote(a))
                return output

        
        return_tree = calculateQuote(quote_value)
        return return_tree
    
    # function car
    # (car '(1 2 3)) -> 1
    # (car 'Hello) -> H
    elif tree[0]=="car":
        #print "it is car"
        value=interpreter(tree[1])
        # string
        if value[0]=="\"":
            return value[0:2]+"\""
        #print value
        return value[0]

    # function cdr
    # (cdr '(1 2 3)) -> (2 3)
    # (cdr 'Hello) -> ello
    # (cdr 'H) -> ()
    elif tree[0]=="cdr":
        #print "it is cdr"
        value=interpreter(tree[1])

        # string
        if value[0]=="\"":
            return "\""+value[2:len(value)]

        #print value
        if len(value)==0:
            print("Error\nFunction 'cdr' cannot be used on empty list")
        elif len(value)==1:
            return []
        # pair
        elif type(value)!=str and len(value)==3 and value[1]==".":
            return value[2]
        else:
            return value[1:len(value)]

    #if value[0]!="(" or value[len(value)-1]!=")":
    #    print "Error...\nFunction 'cdr' only support list like (1 2 3)\nNot like "+value
    #else:
    #    _tree_=parser(lexer(value)[0])
    #    if len(_tree_)==0:
    #        print "Error\nFunction 'cdr' cannot be used on empty list"
    #    elif len(_tree_)==1:
    #        return "()"
    #    else:
    #        _tree_=_tree_[1:len(_tree_)]
    #        return convertArrayToString(_tree_)
    
    # function cons
    # (cons 12 '(1 2 3)) -> (12 1 2 3)
    # (cons "Hi" "Hello") -> "HiHello"
    # (cons 12 "Hello") -> "12Hello"
    # (cons '(1 2) "Hello") -> "(1 2)Hello"
    elif tree[0]=="cons":
        #print "it is cons"
        value1=interpreter(tree[1])
        value2=interpreter(tree[2])

        if type(value2)==str:

            # cons string
            if value2[0]=="\"":
                # (cons "H" "e") -> "He"
                if value1[0]=="\"":
                    return value1[0:len(value1)-1]+value2[1:len(value2)]
                elif type(value1)!=str:
                    return "\""+convertArrayToString(value1)+value2[1:len(value2)]
                else:
                    return "\""+value1+value2[1:len(value2)]

            # add pair support
            #print("Error...\nFunction 'cons' only support (cons [value] [list])\n")
            output=[]
            output.append(value1)
            output.append(".")
            output.append(value2)
            return output
        else:
            output=[]
            output.append(value1)
            for a in value2:
                output.append(a)
            return output

    # function stms
    # (stms [stm1] [stm2]) run stm1,stm2... in turn
    elif tree[0]=="stms":
        i=1
        while i<len(tree)-1:
            interpreter(tree[i])
            i=i+1
        
        # only return the last one
        return interpreter(tree[i])
    # function lambda
    # (= add (lambda (a b) (+ a b)))
    elif tree[0]=="lambda":
        
        #print "It is lambda"
        
        param_tree = parser(lexer(tree[1])[0])

        stm_tree=["begin"]
        i=2
        while i<len(tree):
            stm_tree.append(parser(lexer(tree[i])[0]))
            i=i+1

        function_array = ["<procedure"]
        function_array.append(param_tree)
        function_array.append(stm_tree)
        function_array.append(">")
        return function_array

        return_str="<procedure ("
        for i in tree[1]:
            return_str=return_str+i+" "

        return_str=return_str.strip()

        return_str=return_str+") "

        stms=convertArrayToString(tree[2])

        return_str=return_str+stms

        return_str=return_str.strip()

        return_str=return_str+" >"

        return return_str


    # function atom?
    # (atom? 12) -> 1
    # (atom? '(1 2)) -> 0
    elif tree[0]=="atom?":
        value=interpreter(tree[1])
        if type(value)!=str:
            return "0"
        else:
            # string is list not atom
            if value[0]=="\"":
                return "0"
            return "1"

    elif tree[0]=="print":
        value = interpreter(tree[1])
        if type(value)==str:
            if len(value)!=0 and value[0]=="\"":
                print eval(value),
            else:
                print value,
        else:
            print convertArrayToString(value),
        return ""
    #print interpreter(tree[1])

    # function let
    # (let [assignment] [stm] [stm] ...)  return last stm
    # (let ((x 12)) (print x)) is valid
    # (let (x 12) (print x)) is invalid
    # x is local
    elif tree[0]=="let":
        # local
        SYMBOLIC_TABLE.append({})
        
        
        #print "It is let"
        assignment=tree[1]
        for i in assignment:
            var_name=i[0]
            var_value=interpreter(i[1])
            SYMBOLIC_TABLE[len(SYMBOLIC_TABLE)-1][var_name]=var_value
        
        
        i=2
        while i<length-1:
            interpreter(tree[i])
            i=i+1
        
        stm=tree[i]
        return_value=interpreter(stm)

        # push SYMBOLIC_TABLE
        #SYMBOLIC_TABLE=pushSymbolicTable(SYMBOLIC_TABLE)
        del(SYMBOLIC_TABLE[len(SYMBOLIC_TABLE)-1])
        return return_value


    # function cond
    #
    #    (cond [[judge1] [run stm1 if judge1 passed and then return]] [[judge2] [stm2]] ...)
    #    (cond
    #        (
    #            (== 12 13)
    #            (print "1")
    #        )
    #        (
    #            (== 12 12)
    #            (print "2")
    #        )
    #    )
    #      will print "2"
    elif tree[0]=="cond":
        i=1
        while i<length:
            judge=interpreter(tree[i][0])
            
            if judge=="1":
                # pas
                return interpreter(tree[i][1])
            
            i=i+1


    # function eval
    elif tree[0]=="eval":
        #print "It is eval"
        return interpreter(parser(lexer(interpreter(tree[1]))[0]))


    # function len
    # (len "Hello") -> 5
    # (len '(1 2 3)) -> 3
    elif tree[0]=="len":
        value = interpreter(tree[1])
        # (len '(1 2 3))
        if type(value)!=str:
            return str(len(value))
        # (len "Hello")
        elif value[0]=="\"" and value[len(value)-1]=="\"":
            value=value[1:len(value)-1]
            return len(value)
        else:
            print("Error...\nFunction len only support list and string type param")


    # load module (file) from virtual file system
    # (load "walley_toy")
    elif tree[0]=="load":
        value = interpreter(tree[1])
        toy_runString(VirtualFileSystem[value[1:len(value)-1]])

#   > (eq 'a 'a)
#   1
#   > (eq 'a 'b)
#   0
#   > (eq '() '())
#   1
#   > (eq '(a b c) '(a b c))
#   0
#   > (eq '() "")       ; "" is ()
#   1

    elif tree[0]=="eq":
        value1 = interpreter(tree[1])
        value2 = interpreter(tree[2])
        if type(value1)==str and  value1[0]=="\"":
            value1 = convertStringToArray(value1[1:len(value1)-1])
        if type(value2)==str and value2[0]=="\"":
            value2 = convertStringToArray(value2[1:len(value2)-1])

        if isNumber(value1):
            value1=str(eval(value1))
        if isNumber(value2):
            value2=str(eval(value2))

        if type(value1)!=type(value2):
            return "0"
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

    # cam be used to convert one-dimensional list
    elif tree[0]=="list->atom":
        output=""
        value = interpreter(tree[1])
        i=0
        while i<len(value):
            append_value = value[i]
            if type(append_value)!=str:
                append_value = convertArrayToString(append_value)
            output = output + append_value
            i=i+1
        return output
    # (symbol->list 'Hello)  -> (H e l l o)
    elif tree[0]=="symbol->list":
        value = interpreter(tree[1])
        return convertStringToArray(value)

    # point ->
    # (-> y x)
    #
    #eg
    #    (= x 12)    : x=12
    #    (-> y x)    : y points to x
    #    (= x 13)    : x=13 then y=13 as well
    #
    elif tree[0]=="apply":
        call_function_name = tree[1]
        params = interpreter(tree[2])
        output=[]
        output.append(call_function_name)
        for i in params:
            output.append(i)
        return interpreter(output)
    
    elif tree[0]=="number?":
        value = interpreter(tree[1])
        if isNumber(value):
            return "1"
        else:
            return "0"
    elif tree[0]=="if":
        judge = interpreter(tree[1])
        if judge=="0":
            return interpreter(tree[3])
        else:
            return interpreter(tree[2])

    # add macro support
    #   (defmacro <macro_name> (<const_keywords>)  
    #       ((<pattern> <template>))
    #          ...
    #       )
    #   
    elif tree[0]=="defmacro":
        #macro
        # ['getmacro' , macro_name , const_keywords , pattern_list ]
        macro=[tree[1],tree[2],[]]
        #macro_name = tree[1]
        #macro_const_keywords = tree[2]
        #macro_patterns = []
        i = 3
        while i<len(tree):
            macro[2].append(tree[i])
            i=i+1
        # add to macro database
        MARCRO_DATABASE[tree[1]] = macro
        return macro
    elif tree[0]=="expandmacro":
        if tree[1] in MARCRO_DATABASE:
            macro = MARCRO_DATABASE[tree[1]]
            macro.append([])
            i=2
            while i<len(tree):
                macro[3].append(tree[i])
                i=i+1
            to_run = ["getmacro",["quote"]]
            to_run[1].append(macro)
            expand = interpreter(to_run)
            return expand
        print "Error...\n"+tree[1]+" is not macro"
        return ""
    # For Lazy Evaluation, I will add __LAZY_VALUE__ property   
    # (__LAZY_VALUE__ [SYMBOLIC_TABLE_index] [var_name] [var_value])
    # To appoint Lazy Evaluation value, you need to:
    # Require & sign to inform that the param is lazy evaluation param
    #   (= if (lambda (condtion, &stm1, &stm2) (
    #    cond (condtion, stm1) (1 stm2)
    #        )
    #    )
    #)
    # when call var_name value, calculate var_value and then set it to var_name
    # according to SYMBOLIC_TABLE_index
    # call function directly
    else:
        function_name=tree[0]

        # is macro
        if function_name in MARCRO_DATABASE:
            macro = MARCRO_DATABASE[function_name]
            macro.append([])
            i=1
            while i<len(tree):
                macro[3].append(tree[i])
                i=i+1
            to_run = ["getmacro",["quote"]]
            to_run[1].append(macro)
            expand = interpreter(to_run)
            #print "expand-----> "
            #print expand
            return interpreter(expand)

        # function_procedure
        if type(function_name)==str:
            length=len(SYMBOLIC_TABLE)
            i=length-1
            find=False
            while i>=0:
                if function_name in SYMBOLIC_TABLE[i].keys():
                    function_procedure=SYMBOLIC_TABLE[i][function_name]
                    find=True
                    break
                i=i-1
            if find==False:
                print("\nError...\nUndefined function '"+function_name+"'\n")
                return ""
        # ((lambda (a b) (+ a b)) 3 4) ---> 7
        else:
            function_procedure=interpreter(function_name)
        
        if type(function_procedure)==str:
            tree[0]=function_procedure
            return interpreter(tree)
        

        #let_tree=["let"]
        #param_tree=[]
        
        # ADD NEW SYMBOLIC_TABLE
        LOCAL_SYMBOLIC_TABLE={}
        

        #(add 3 4)
        # user_param_tree -> [3,4]
        #(for i in 14)
        # user_param_tree -> [i,in,14]
        user_param_tree=[]
        a = 1
        while a<len(tree):
            value = tree[a]
            # Does not calculate, use Lazy Evaluation
            user_param_tree.append(value)
            a=a+1
            
        #===== FINISH GETTING USER_PARAM_TREE

        num_of_function_param = len(function_procedure[1])
        num_of_user_param = len(user_param_tree)

        i=0
        while i<num_of_function_param:
            if function_procedure[1][i]==".":
                num_of_function_param = num_of_function_param-1
                break
            i=i+1

        #if num_of_user_param<num_of_function_param:
        #    print "Error...Missing params"
        #    return "";

        a = 0
        i = 0
        while a < num_of_function_param :
            # too many parameters
            #if a>=num_of_function_param:
            #    print "Error...Too many params"
            #    return ""

            if function_procedure[1][a]==".":
                variadic_var_name = function_procedure[1][a+1]

                quote_array = ["quote"]
                temp=["__LAZY_VALUE__",len(SYMBOLIC_TABLE)]
                temp.append(variadic_var_name)
                quote_array=["quote"]
                quote_array.append([])
                while i<num_of_user_param:
                    #Does not support Lazy Evalutation
                    quote_array[1].append( interpreter( user_param_tree[i] ) )
                    i=i+1
                temp.append(quote_array)
                
                # ADD TO SYMBOLIC_TABLE
                LOCAL_SYMBOLIC_TABLE[variadic_var_name] = temp
                #param_tree.append(temp)
                break

            var_name = function_procedure[1][a]
            # Lazy Evaluation
            if var_name[0]=="&":
                var_name = var_name[1:len(var_name)]                
                # solve lazy evaluation recursion bug
                if type(user_param_tree[i])==str and (user_param_tree[i] in SYMBOLIC_TABLE[len(SYMBOLIC_TABLE)-1]) and len(SYMBOLIC_TABLE)>1:
                    LOCAL_SYMBOLIC_TABLE[var_name] = SYMBOLIC_TABLE[len(SYMBOLIC_TABLE)-1][user_param_tree[i]]
                    i=i+1
                    a=a+1
                    continue

                temp=["__LAZY_VALUE__",len(SYMBOLIC_TABLE)]
                temp.append(var_name)

                #Lazy Evaluation
                temp.append(user_param_tree[i])

                # ADD TO SYMBOLIC_TABLE
                LOCAL_SYMBOLIC_TABLE[var_name] = temp
            #This is not Lazy Evaluation
            else:
                ### SUCH A BIG BUG
                value = interpreter(user_param_tree[i])
                ### SUCH A BIG BUG
                ### I HAVE TO CALCULATE VALUE AT FIRST
                ### CUZ DICTIONARY WILL INIT VAR_NAME AT FIRST
                ### WHICH MAY CAUSE BUG
                LOCAL_SYMBOLIC_TABLE[var_name] = value

            i=i+1
            a=a+1

        # PUSH LOCAL SYMBOLIC TABLE TO SYMBOLIC_TABLE
        SYMBOLIC_TABLE.append(LOCAL_SYMBOLIC_TABLE)


        # print SYMBOLIC_TABLE
        # print "\n"

        return_value = interpreter(function_procedure[2])
        # push SYMBOLIC_TABLE
        # SYMBOLIC_TABLE=pushSymbolicTable(SYMBOLIC_TABLE)
        del(SYMBOLIC_TABLE[len(SYMBOLIC_TABLE)-1])
        
        return return_value
        
#SYMBOLIC TABLE
#0     GLOBAL 
#1...n LOCAL

def toy_runString(input_str):
    x=lexer(input_str)
    if x[1]==False:
        print "Error...Incomplete Statements"
    else:
        x=parser(x[0])
        interpreter(x)

# RUN TO_RUN
toy_runString("(load \"walley_toy\")")


