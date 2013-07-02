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
    == >= <= > < != not and or
    
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

# the script that is required to run before starting the toy program
TO_RUN="(stms \"This program is written by Yiyi Wang to test Toy Language\" \"I recommended u to start the program by stating (stms ) function\" \"list? function will return 1 if it is list\" (= list? (lambda (a) (if (atom? a) 0 1))) \"======================================================================\" \" this is function ^ \" (= ^ (lambda (a b) (if (== b 1) a (* a (^ a (- b 1)))))) \"bind ** to ^\" (= ** ^) \"test ** function\" \"(print (** 3 4))\" \"======================================================================\" \"list \" \"list-length\" \"which can be used to get the length of list\" (= list-length (lambda (_list_) (if (list? _list_) (if (null? _list_) 0 (+ 1 (list-length (cdr _list_)))) (print \"Error...\nFunction list-length can not be used to get length of non-list type value\")))) \"test list-length\" \"(print (list-length '(1 2 3)))\" \"(print (list-length 12))\" \"=====================================\" \"list-get\" \"get list at index\" (= list-get (lambda (_list_ index) (if (== index 0) (car _list_) (list-get (cdr _list_) (- index 1))))) \"test list-get\" \"(print (list-get '(12 2 14) 2))\") "

#=========== MATH ==============
#===============================
#===============================


def cleanDotZeroAfterNum(num):
    if num.find(".") == -1:
        return num
    else:
        length=len(num)
        i=length-1
        zero_that_need_to_delete=0
        while i>=0:
            if num[i]=="0":
                zero_that_need_to_delete=zero_that_need_to_delete+1
                i=i-1
                continue
            if num[i]!='0' or num[i]=='.':
                break
            i=i-1
        
        if zero_that_need_to_delete!=0:
            num=num[0 : length-zero_that_need_to_delete]
        if num[len(num)-1]==".":
            num=num[0 : len(num)-1]
        
        return num
def stringIsDigit(input_str):
    if input_str=="":
        return False
    if input_str[0]=="-":
        input_str=input_str[1:len(input_str)]
    if input_str=="":
        return False

    isDigit=True

    # count of .
    count=0

    i=0
    while i<len(input_str):
        if input_str[i]==".":
            count=count+1
            i=i+1
            continue
        
        if input_str[i].isdigit()==False:
            return False
        i=i+1

    if count>1:
        isDigit=False

    return isDigit

# 12 --> true
# 3/4 --> true
# is Number includes fraction and float
def isNumber(input_str):
    if type(input_str)!=str:
        return False
    if stringIsDigit(input_str):
        return True

    index_of_gang=input_str.find("/")

    if index_of_gang==-1:
        return False

    if input_str.count("/")!=1:
        return False

    numerator=input_str[0 : index_of_gang]
    denominator=input_str[index_of_gang+1 : len(input_str)]

    if isNumber(numerator) and isNumber(denominator):
        return True
    else:
        return False

# get 1 from 1/3
def numerator_of_fraction(fraction):
    index_of_gang=fraction.find("/")
    if index_of_gang==-1:
        return fraction
    else:
        return fraction[0:index_of_gang]


def denominator_of_fraction(fraction):
    index_of_gang=fraction.find("/")
    if index_of_gang==-1:
        return "1"
    else:
        return fraction[index_of_gang+1:len(fraction)]

#simplify_fraction("3","6")--->"1/2"
#simplify_fraction("4","5")--->"4/5"
#simplify_fraction("4.3","2")--->"43/20"
#simplify_fraction("5","1")--->5
def simplify_fraction(num1_str, num2_str):
    num1_str=cleanDotZeroAfterNum(num1_str)
    num2_str=cleanDotZeroAfterNum(num2_str)
    
    is_negative=False
    num_of_minus=num1_str.count("-")+num2_str.count("-")
    if num_of_minus%2!=0:
        is_negative=True

    if num1_str.find("/")==-1 and num2_str.find("/")==-1:
        num_of_ten_need_to_times=0
        index_of_dot1=num1_str.find(".")
        index_of_dot2=num2_str.find(".")
        num1_of_ten_need_to_times=0
        num2_of_ten_need_to_times=0
        if index_of_dot1==-1:
            num1_of_ten_need_to_times=0
        else:
            num1_of_ten_need_to_times=len(num1_str)-1-index_of_dot1


        if index_of_dot2==-1:
            num2_of_ten_need_to_times=0
        else:
            num2_of_ten_need_to_times=len(num2_str)-1-index_of_dot2

        if num1_of_ten_need_to_times>=num2_of_ten_need_to_times:
            num_of_ten_need_to_times=num1_of_ten_need_to_times
        else:
            num_of_ten_need_to_times=num2_of_ten_need_to_times

        # if params are 0.3 4---->3 40
        num1=float(num1_str)
        num2=float(num2_str)
        num1=abs(num1)
        num2=abs(num2)
        num1=num1*pow(10, num_of_ten_need_to_times)
        num2=num2*pow(10, num_of_ten_need_to_times)


        smaller_number=int(num1)
        if num1>abs(num2):
            smaller_number=int(num2)

        num1_int=int(num1)
        num2_int=int(num2)

        i=0
        for i in range(2,smaller_number+1):
            if (num1_int%i==0 and num2_int%i==0) :
                num1_int=num1_int/i
                num2_int=num2_int/i
                while (num1_int%i==0 and num2_int%i==0) :
                    num1_int=num1_int/i
                    num2_int=num2_int/i



        if num2_int==1:
            if is_negative:
                return str(-1*num1_int)
            return str(num1_int)

        # get denominator and numerator after simplified
        output=str(num1_int)+"/"
        output=output+str(num2_int)
        if is_negative:
            output="-"+output
        return output

    # find / in num1_str or num2_str
    # like 1/3 4 or 2/3 4/5
    else:
        index_of_gang_of_num1=num1_str.find("/")
        index_of_gang_of_num2=num2_str.find("/")
        # like 2 and 1/3 --->2/(1/3)--->6
        if index_of_gang_of_num1==-1 and index_of_gang_of_num2!=-1:
            denominator=num2_str[index_of_gang_of_num2+1 : len(num2_str)]
            numerator=num2_str[0 : index_of_gang_of_num2]
            denominator=str(float(denominator)*float(num1_str))
            return simplify_fraction(denominator, numerator)
        # like 1/3 and 2---> (1/3)/2--->1/6
        elif index_of_gang_of_num2==-1 and index_of_gang_of_num1!=-1:
            denominator=num1_str[index_of_gang_of_num1+1 : len(num1_str)]
            numerator=num1_str[0 : index_of_gang_of_num1]
            denominator=str(float(denominator)*float(num2_str))
            return simplify_fraction(numerator, denominator)

        # like 1/3 and 2/3--->(1/3)/(2/3)--->1/2
        else :
            denominato_num1=num1_str[index_of_gang_of_num1+1 : len(num1_str)]
            numerator_num1=num1_str[0 : index_of_gang_of_num1]
            denominator_num2=num2_str[index_of_gang_of_num2+1 : len(num2_str)]
            numerator_num2=num2_str[0:index_of_gang_of_num2]
            denominator=str(float(denominato_num1)*float(numerator_num2))
            numerator=str(float(numerator_num1)*float(denominator_num2))
            
            
            return simplify_fraction(numerator, denominator)

    return "Mistake occurred while calling function simplify_fraction"


def fraction_plus(num1_str, num2_str):
    if num2_str == "0" :
        return simplify_fraction(num1_str, "1")
    if num1_str == "0" :
        return simplify_fraction(num2_str, "1")

    numerator_num1=numerator_of_fraction(num1_str)
    denominator_num1=denominator_of_fraction(num1_str)

    numerator_num2=numerator_of_fraction(num2_str)
    denominator_num2=denominator_of_fraction(num2_str)

    numerator=str(float(numerator_num1)*float(denominator_num2)+float(numerator_num2)*float(denominator_num1))
    denominator=str(float(denominator_num1)*float(denominator_num2))

    if float(numerator)==0:
        return "0"

    return simplify_fraction(numerator, denominator)

def fraction_minus(num1_str, num2_str) :
    numerator_num1=numerator_of_fraction(num1_str)
    denominator_num1=denominator_of_fraction(num1_str)
    
    numerator_num2=numerator_of_fraction(num2_str)
    denominator_num2=denominator_of_fraction(num2_str)
    
    numerator=str(float(numerator_num1)*float(denominator_num2)-float(numerator_num2)*float(denominator_num1))
    denominator=str(float(denominator_num1)*float(denominator_num2))
    
    if float(numerator)==0:
        return "0"
    
    return simplify_fraction(numerator, denominator)

#num1*num2
def fraction_time(num1_str, num2_str):
    numerator_num1=numerator_of_fraction(num1_str)
    denominator_num1=denominator_of_fraction(num1_str)
    
    numerator_num2=numerator_of_fraction(num2_str)
    denominator_num2=denominator_of_fraction(num2_str)
    
    numerator=str(float(numerator_num1)*float(numerator_num2))
    denominator=str(float(denominator_num1)*float(denominator_num2))
    
    return simplify_fraction(numerator, denominator)

# num1/num2
def fraction_divide(num1_str, num2_str):
    return simplify_fraction(num1_str, num2_str)

# make 1.2-->12/10--->6/5
def double_to_fraction(num):
    return simplify_fraction(num, "1")

# make 3/2-->1.5
def fraction_to_double(num):
    input_str=str(float(numerator_of_fraction(num))/float(denominator_of_fraction(num)))
    return input_str

def Walley_Operator_For_Fraction(num1_str, num2_str, sign):
    # float
    if num1_str.find(".")!=-1 or num2_str.find(".")!=-1:
        return str(float(eval(num1_str+sign+num2_str)))
    
    if isNumber(num1_str)==False or isNumber(num2_str)==False:
        print("Error... cannot process "+num1_str+sign+num2_str)
        return ""
    
    if sign=="+":
        return fraction_plus(num1_str, num2_str)
    elif sign=="-":
        return fraction_minus(num1_str, num2_str)
    elif sign=="/":
        return fraction_divide(num1_str, num2_str)
    elif sign=="*":
        return fraction_time(num1_str, num2_str)
    else:
        print("Mistake occurred while calling function Walley_Operator_For_Fraction\nUnseen sign "+sign+" occurred\n")
        return "Mistake occurred while calling function Walley_Operator_For_Fraction\nUnseen sign occurred\n"


def Walley_Calculation(value1, value2, sign):
    # number calculation
    if value1[0]!="\"" and value2[0]!="\"":
        return Walley_Operator_For_Fraction(value1,value2,sign)
    # string or number calculation
    else:
        value1IsString=False
        value2IsString=False
        if value1[0]=="\"" :
            value1=value1[1:len(value1)-1]
            value1IsString=True
        
        if value2[0]=="\"" :
            value2=value2[1:len(value2)-1]
            value2IsString=True
        
        if sign[0]=="+" :
            output_str="\""+value1+value2+"\""
            return output_str
        
        elif sign[0]=="*" :
            if value1IsString==True and value2IsString==True :
                print("Error.. Can not multiply two string "+value1+" and "+value2+"\n")
                return ""
            else:
                num=0
                mult_str=""
                if value1IsString==True:
                    mult_str=value1
                    num=int(value2)
                else:
                    mult_str=value2
                    num=int(value1)
        
                
                output_str="\""
                i=0
                while i<num:
                    output_str=output_str+mult_str
                    i=i+1
                output_str=output_str+"\""
                return output_str
        
        else:
            print("Error.. Sign "+sign+" can not be used for string calculation for "+value1+" and "+value2+"\n")
            return ""






#===============================
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


def pushSymbolicTable(SYMBOLIC_TABLE):
    SYMBOLIC_TABLE=SYMBOLIC_TABLE[0:len(SYMBOLIC_TABLE)-1]
    return SYMBOLIC_TABLE
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
SYMBOLIC_TABLE[0]["+"]="+"
SYMBOLIC_TABLE[0]["-"]="-"
SYMBOLIC_TABLE[0]["*"]="*"
SYMBOLIC_TABLE[0]["/"]="/"
SYMBOLIC_TABLE[0]["%"]="%"
SYMBOLIC_TABLE[0]["float"]="float"
SYMBOLIC_TABLE[0]["fraction"]="fraction"


SYMBOLIC_TABLE[0]["="]="="
SYMBOLIC_TABLE[0]["local="]="local="

SYMBOLIC_TABLE[0][">"]=">"
SYMBOLIC_TABLE[0]["<"]="<"
SYMBOLIC_TABLE[0]["=="]="=="
SYMBOLIC_TABLE[0]["!="]="!="
SYMBOLIC_TABLE[0][">="]=">="
SYMBOLIC_TABLE[0]["<="]="<="

SYMBOLIC_TABLE[0]["and"]="and"
SYMBOLIC_TABLE[0]["or"]="or"
SYMBOLIC_TABLE[0]["not"]="not"

SYMBOLIC_TABLE[0]["car"]="car"
SYMBOLIC_TABLE[0]["cdr"]="cdr"
SYMBOLIC_TABLE[0]["quote"]="quote"
SYMBOLIC_TABLE[0]["cons"]="cons"
SYMBOLIC_TABLE[0]["cond"]="cond"


SYMBOLIC_TABLE[0]["print"]="print"
SYMBOLIC_TABLE[0]["list"]="list"
SYMBOLIC_TABLE[0]["if"]="if"
SYMBOLIC_TABLE[0]["stms"]="stms"
SYMBOLIC_TABLE[0]["eval"]="eval"
SYMBOLIC_TABLE[0]["let"]="let"
SYMBOLIC_TABLE[0]["lambda"]="lambda"
SYMBOLIC_TABLE[0]["len"]="len"


SYMBOLIC_TABLE[0]["atom?"]="atom?"
SYMBOLIC_TABLE[0]["number?"]="number?"
SYMBOLIC_TABLE[0]["empty?"]="empty?"
SYMBOLIC_TABLE[0]["null?"]="null?"



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
            output=output+convertArrayToString(i)
    return output.strip()+")"

def interpreter(tree):
    global SYMBOLIC_TABLE
    global MARCRO_DATABASE
    
    length=len(tree)
    # (= x 3) x and 3 are just returned
    if type(tree)==str:
        #print "tree---> "+tree
        if isNumber(tree):
            return tree
        elif tree[0]=="\"" and tree[len(tree)-1]=="\"":
            return tree
        else:
            
            length=len(SYMBOLIC_TABLE)
            i=length-1
            while i>=0:
                if tree in SYMBOLIC_TABLE[i].keys():
                    return SYMBOLIC_TABLE[i][tree]
                i=i-1
            print("\nError...\nUndefined value "+tree+"\n")

    # x = 12
    # add to global symbolic table
    elif tree[0]=="=":
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
            if var_name.isdigit():
                print("Error...\nBad variable name -> "+var_name)
                return ""
            if length==3:
                var_value=interpreter(tree[2])
                SYMBOLIC_TABLE[0][var_name]=var_value
                return var_value
    #else:
    #    var_name_value=interpreter(tree[1])
    #    print "var name value ---> ",
    #    print var_name_value
    #    # string
    #    if var_name_value[0]=="\"":
    #        var_value=var_name_value[1:len(var_name_value)-1]
    #
    #        print "var value ---> ",
    #        print var_value
    #
    #        change_to_var_value=interpreter(tree[3])
    #        if change_to_var_value[0]!="\"":
    #            print "Error,,,,,"
    #        change_to_var_value=change_to_var_value[1:len(change_to_var_value)-1]
    #        var_value[int(tree[2])]=change_to_var_value
    #        SYMBOLIC_TABLE[0][var_name]=var_value
    #        return var_value
    #    # list
    #    elif var_name_value[0]=="(":
    #        pass
    #    else:
    #        print "Error...\n"
    #    pass
    
    # local x = 12
    # add to local symbolic table
    elif tree[0]=="local=":
        if length!=3:
            print("Error. = need 3 values inside")
        var_name=tree[1]
        
        var_value=interpreter(tree[2])
        SYMBOLIC_TABLE[len(SYMBOLIC_TABLE)-1][var_name]=var_value

    elif tree[0]=="+" or tree[0]=="-" or tree[0]=="*" or tree[0]=="/" or tree[0]=="%":
        
        sign=interpreter(tree[0])
        
        i=2
        append_str=interpreter(tree[1])
        while i<length:
            
            append_str = Walley_Calculation(append_str,interpreter(tree[i]),sign)
            #append_str=append_str+sign+interpreter(tree[i])
            i=i+1
        #return str(eval(append_str))
        return append_str


    elif tree[0]=="float":
        return fraction_to_double(interpreter(tree[1]))
    elif tree[0]=="fraction":
        return double_to_fraction(interpreter(tree[1]))
    elif tree[0]=="==":
        #print "It is =="
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)
        
        previous=value1
        i=2
        while i<length:
            value=interpreter(tree[i])
            if isNumber(value):
                value=eval(value)
            
            if previous==value:
                previous=value
            else:
                return "0"
            i=i+1
        return "1"

    elif tree[0]==">":
        #print "It is >"
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)
        
        previous=value1
        i=2
        while i<length:
            value=interpreter(tree[i])
            if isNumber(value):
                value=eval(value)
            
            if previous>value:
                previous = value
            else:
                return "0"
            i=i+1
        return "1"

    elif tree[0]=="<":
        #print "It is <"
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)
        
        previous=value1
        i=2
        while i<length:
            value=interpreter(tree[i])
            if isNumber(value):
                value=eval(value)
            
            if previous<value:
                previous = value
            else:
                return "0"
            i=i+1
        return "1"

    elif tree[0]=="!=":
        #print "It is !="
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)
        
        previous=value1
        i=2
        while i<length:
            value=interpreter(tree[i])
            if isNumber(value):
                value=eval(value)
            
            if previous!=value:
                previous = value
            else:
                return "0"
            i=i+1
        return "1"

    elif tree[0]==">=":
        #print "It is >="
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)
        
        previous=value1
        i=2
        while i<length:
            value=interpreter(tree[i])
            if isNumber(value):
                value=eval(value)
            
            if previous>=value:
                previous = value
            else:
                return "0"
            i=i+1
        return "1"

    elif tree[0]=="<=":
        #print "It is <="
        value1=interpreter(tree[1])
        if isNumber(value1):
            value1=eval(value1)
        
        previous=value1
        i=2
        while i<length:
            value=interpreter(tree[i])
            if isNumber(value):
                value=eval(value)
            
            if previous<=value:
                previous = value
            else:
                return "0"
            i=i+1
        return "1"

    elif tree[0]=="not":
        value = interpreter(tree[1])
        if value=="0":
            return "1"
        else:
            return "0"
    ###
    #    p  q  and  or
    #    1  0  0    1
    #    1  1  1    1
    #    0  0  0    0
    #    0  1  0    1
    ###

    elif tree[0]=="and":
        i=1
        while i<length:
            if interpreter(tree[i])=="0":
                return "0"
            i=i+1
        return "1"

    elif tree[0]=="or":
        i=1
        while i<length:
            if interpreter(tree[i])!="0":
                return "1"
            i=i+1
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
    elif tree[0]=="car":
        #print "it is car"
        value=interpreter(tree[1])
        #print value
        return value[0]

    #if value[0]!="(" or value[len(value)-1]!=")":
    #    print "Error...\nFunction 'car' only support list like (1 2 3)\nNot like "+value
    #else:

    #    _tree_=parser(lexer(value)[0])
    #    if type(_tree_[0])==str:
    #        return _tree_[0]
    #    else:
    #        return interpreter(_tree_[0])

    # function cdr
    # (cdr '(1 2 3)) -> (2 3)
    elif tree[0]=="cdr":
        #print "it is cdr"
        value=interpreter(tree[1])
        #print value
        if len(value)==0:
            print("Error\nFunction 'cdr' cannot be used on empty list")
        elif len(value)==1:
            return []
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
    elif tree[0]=="cons":
        #print "it is cons"
        value1=interpreter(tree[1])
        value2=interpreter(tree[2])
        if type(value2)==str:
            print("Error...\nFunction 'cons' only support (cons [value] [list])\n")
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
        
        return_str="<procedure ("
        for i in tree[1]:
            return_str=return_str+i+" "

        return_str=return_str.strip()

        return_str=return_str+") "

        stms=convertArrayToString(tree[2])

        return_str=return_str+stms
        #for i in tree[2]:
        #    return_str=return_str+i+" "

        return_str=return_str.strip()

        return_str=return_str+" >"

        #print "Lambda ----> "+return_str

        return return_str

    # function list
    # (list 1 2 3) ---> (1 2 3)
    elif tree[0]=="list":
        i=1
        output=[]
        while i<len(tree):
            output.append(interpreter(tree[i]))
            i=i+1
        return output

    # function number?
    # (number? 12) -> 1
    elif tree[0]=="number?":
        value=interpreter(tree[1])
        # list
        if type(value)!=str:
            return "0"
        # not list
        if isNumber(value):
            return "1"
        else:
            return "0"

    # function atom?
    # (atom? 12) -> 1
    # (atom? '(1 2)) -> 0
    elif tree[0]=="atom?":
        value=interpreter(tree[1])
        if type(value)!=str:
            return "0"
        else:
            return "1"
    # function empty? and null?
    # if () -> true 1
    # if not () like (1 2) -> false 0
    elif tree[0]=="empty?" or tree[0]=="null?":
        value=interpreter(tree[1])
        if type(value)==str:
            return "Error...Function empty? and null? can only be used for list type value"
        else:
            if len(value)==0:
                return "1"
            else:
                return "0"


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
        SYMBOLIC_TABLE=pushSymbolicTable(SYMBOLIC_TABLE)

        return return_value

    # function if
    # (if [judge] [run if pass] [run if not pass])
    elif tree[0]=="if":
        judge=interpreter(tree[1])
        if judge=="1":
            return interpreter(tree[2])
        else:
            return interpreter(tree[3])

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

    # function ...
    # (= add (lambda (a b) (+ (... 0) (... 1))))
    # I haven't decided how to implement this function
    elif tree[0]=="...":
        pass


    # function eval
    elif tree[0]=="eval":
        #print "It is eval"
        return interpreter(parser(lexer(interpreter(tree[1]))[0]))

    # function while
    # (while (< i 10) (= i (+ i 1)))
    elif tree[0]=="while":
        while interpreter(tree[1])=="1":
            interpreter(tree[2])
        return ""


    # function digit
    # (0 '(1 2 3)) -> 1
    # (2 '(1 2 3)) -> 3
    # (3 '(1 2 3)) -> error

    #elif tree[0].isdigit():
    #    print "It is digit"
    #    value = interpreter(tree[1])
    #
    #    # (1 '(1 2 3))
    #    if value[0]=="(" and value[len(value)-1]==")":
    #        _tree_=parser(lexer(value)[0])
    #        print _tree_
    #        print convertArrayToString(_tree_[int(tree[0])])
    #        return convertArrayToString(_tree_[int(tree[0])])
    #    # (1 "Hello")
    #    elif value[0]=="\"" and value[len(value)-1]=="\"":
    #        value=value[1:len(value)-1]
    #        return value[int(tree[0])]
    #    else:
    #        print "Error...\nDigit only support list and string type param"

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

    
    # function denominator
    # get denominator of number
    elif tree[0]=="denominator":
        value = interpreter(tree[1])
        return denominator_of_fraction(value)
    # function numerator
    # get numerator of number
    elif tree[0]=="numerator":
        value = interpreter(tree[1])
        return numerator_of_fraction(value)

    # macro
    #elif tree[0]=="=>":
    #    print "It is => macro"
    #    print tree
    #
    #    start_name=tree[1]
    #
    #    i=2
    #    while i<length:
    #        inside=tree[i]
    #
    #        from_=interpreter(tree[i][0])
    #        to_=interpreter(tree[i][1])
    
    #        print "from ---> "+from_
    #        print "to   ---> "+to_
    #        print "\n"
    
    #        SYMBOLIC_TABLE[0][start_name]=[]
    
    #        to_append=[]
    #        to_append.append(parser(lexer(from_)[0]))
    #        to_append.append(to_)
    
    #        SYMBOLIC_TABLE[0][start_name].append(to_append)
    
    #        i=i+1
    
    
    #    print SYMBOLIC_TABLE
    #    return ""
    
    
    # (macroexpand '(square 3))
    # ->
    # (* 3 3)
    #elif tree[0]=="macroexpand":
    #    print "It is macroexpand"
    #'square': [[['$'], '(* $ $)\n\t\t']]
    #    value=interpreter(tree[1])
    #    if value[0]!="(" or value[len(value)-1]!=")":
    #        print "Error...Function macroexpand"
    #        return ""
    #
    #    _tree_=parser(lexer(value)[0])
    #    print _tree_
    #
    #    start_name=_tree_[0]
    #
    #    if start_name in SYMBOLIC_TABLE[0].keys():
    #        modes=SYMBOLIC_TABLE[0][start_name]
    #        for i in modes:
    #            mode_0=i[0]
    #            if len(mode_0)+1!=len(_tree_):
    #                continue
    #    else:
    #        print "Error..."
    
    
    
    #    print value
    
    
    # point ->
    # (-> y x)
    #
    #eg
    #    (= x 12)    : x=12
    #    (-> y x)    : y points to x
    #    (= x 13)    : x=13 then y=13 as well
    #
    
    
    # call function directly
    else:
        function_name=tree[0]
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
        
        
        # MACRO
        # it has problem now here
        #if type(function_procedure)!=str:
        #    print "MACRO"
        #    print tree
        #    print function_procedure
        
        # eg
        # tree                  ['square', '5']
        # function_procedure    [['square', '$'], ['quote', '(* $ $)']]
        
        
        #    from_=function_procedure[0]
        #    len1=len(tree)
        #    len2=len(function_procedure[0])
        
        #    if len1!=len2:
        #        pass
        #    else:
        #        pass
        #    exit(0)
        
        #print "function_procedure --> "+function_procedure
        
        if function_procedure[0:11]!="<procedure ":
            # solve ((car '(+ -)) 3 4) problem
            #print "IT IS NOT PROCEDURE"
            tree[0]=function_procedure
            return interpreter(tree)

        
        # remove <procedure  >
        function_procedure=function_procedure[11:len(function_procedure)-2]
        i=0
        count_of_bracket=0
        count_of_double_quote=0
        
        params=""
        stms=""
        
        while i<len(function_procedure):
            if function_procedure[i]=="\"":
                count_of_double_quote=count_of_double_quote+1
            elif function_procedure[i]=="(" and count_of_double_quote%2==0:
                count_of_bracket=count_of_bracket+1
            elif function_procedure[i]==")" and count_of_double_quote%2==0:
                count_of_bracket=count_of_bracket-1
                if count_of_bracket==0:
                    params=function_procedure[0:i+1]
                    stms=function_procedure[i+1:len(function_procedure)]
                    break
            i=i+1
        #print function_procedure
        #print params
        #print stms
        params_tree=parser(lexer(params)[0])

        # ... is the function argument list
        run_str="(let ((... (quote "+params+"))"


        a=1
        for i in params_tree:
            if type(tree[a])==str:
                param=tree[a]
            else:
                param = convertArrayToString(tree[a])
            
            run_str=run_str+"("+i+" "+param+")"
            a=a+1
        
        run_str=run_str+")"
        run_str=run_str+stms+")"
        
        #print "run_str---> "+run_str
        run_str_tree=parser(lexer(run_str)[0])
        
        return interpreter(run_str_tree)



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
toy_runString(TO_RUN)


