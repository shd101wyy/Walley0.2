
'''

walley

obj
func
val

keyword:
    + - * /  %
    if def = 
        == >= <= > < != not and or 

(= x 12)  ->          x = 12
(= x) -> 12
x ->  TABLE: 0
    FUNCTION: 0
    SYMBOL: 1

(= x (+ 3 4)) ->     x = 7

# eg (= x (+ 3 (- 4 5) ))-> [['(', '=', 'x', '(', '+', '3', '(', '-', '4', '5', ')', ')', ')'], True]
'''




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
        elif input_str[i]==" ":
            i=i+1
            continue
        else:
            start=i
            while(i!=len(input_str) and input_str[i]!=" " and input_str[i]!="(" and input_str[i]!=")"):
                i=i+1
            to_append=input_str[start:i]
            
                
            output.append(to_append)
            # quote
            if to_append=="quote":
                # delete spaces
                while i!=len(input_str) and input_str[i]==" ":
                     i=i+1
                     
                a=length-1
                count2=0
                while a>i:
                    if input_str[a]==")":
                        count2=count2+1
                        if count2==count:
                            print input_str[i:a]
                            output.append(input_str[i:a])
                            break
                    a=a-1
                i=a
                continue
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


'''
    var:
        function
        symbol
        
    support :
        quote
        car
        cdr
'''

def interpreter(tree,table_space={}):
    length=len(tree)
    # (= x 3) x and 3 are just returned
    if type(tree)==str:
        #print "tree---> "+tree
        if tree.isdigit():
            return tree
        else:
            if tree in table_space.keys():
                return table_space[tree]
            else:
                print "\nError...\nUndefined value "+tree+"\n"
                exit(0)
    # x = 12
    elif tree[0]=="=":
        if length!=3:
            print "Error. = need 3 values inside"
            exit(0)
        var_name=tree[1]
        
        table_space[var_name]={}

        var_value=interpreter(tree[2],table_space)
        table_space[var_name]=var_value
        
        return "nil"
        
    elif tree[0]=="+" or tree[0]=="-" or tree[0]=="*" or tree[0]=="/" or tree[0]=="%":
        i=2
        append_str=interpreter(tree[1],table_space)
        while i<length:
            append_str=append_str+tree[0]+interpreter(tree[i],table_space) 
            i=i+1
        return str(eval(append_str))
    
    elif tree[0]=="quote":
        print 'it is quote'
        return tree[1]
    
    # car function
    # (car '(1 2 3)) -> 1
    elif tree[0]=="car":
        print "it is car"
        value=interpreter(tree[1],table_space)
        print value
        if value[0]!="(":
            print "Error...\nFunction 'car' only support list like (1 2 3)\nNot like "+value
        else:
            value=value[1:len(value)-1]
            i=0
            while i!=len(value) and value[i]!=" ":
                i=i+1
            return value[0:i]
        
    # cdr function
    # (cdr '(1 2 3)) -> (2 3)
    elif tree[0]=="cdr":
        print "it is cdr"
        value=interpreter(tree[1],table_space)
        print value
        if value[0]!="(":
            print "Error...\nFunction 'cdr' only support list like (1 2 3)\nNot like "+value
        else:
            value=value[1:len(value)-1]
            i=0
            while i!=len(value) and value[i]!=" ":
                i=i+1
            # trim
            return "("+value[i:len(value)].strip()+")"
    
    # function cons
    # (cons 12 '(1 2 3)) -> (12 1 2 3)
    elif tree[0]=="cons":
        print "it is cons"
        value1=interpreter(tree[1],table_space)
        value2=interpreter(tree[2],table_space)
        print value1
        print value2
        if value2[0]!="(":
            print "Error...\nFunction 'cons' only support (cons [value] [list])\n"
        else:
            return "("+value1+" "+value2[1:len(value2)]
    
    # function stms
    # (stms [stm1] [stm2]) run stm1,stm2... in turn
    elif tree[0]=="stms":
        i=1
        while i<len(tree):
            print interpreter(tree[i],table_space)
            i=i+1
    # (= add (lambda (a b) (+ a b)))
    elif tree[0]=="lambda":
        return_str="<procedure ("
        for i in tree[1]:
            return_str=return_str+i+" "
        
        return_str=return_str.strip()
        
        return_str=return_str+") ("
        for i in tree[2]:
            return_str=return_str+i+" "
            
        return_str=return_str.strip()

        return_str=return_str+") >"
        return return_str
    
    elif tree[0]=="print":
        print interpreter(tree[1],table_space)
    
    # call function let
    # (let [assignment] [stm])
    # (let ((x 12)) (print x))
    # (let (x 12) (print x)) is invalid
    # x is local
    elif tree[0]=="let":
        # local
        temp_table_space={}
        
        print "It is let"
        assignment=tree[1]
        for i in assignment:
            var_name=i[0]
            temp_table_space[var_name]={}
            var_value=interpreter(i[1],temp_table_space)
            temp_table_space[var_name]=var_value
                
        stm=tree[2]
        return interpreter(stm,temp_table_space)
    # call function directly
    else:
        function_name=tree[0]
        # function_procedure
        if type(function_name)==str:
            function_procedure=table_space[function_name]
            pass
        # ((lambda (a b) (+ a b)) 3 4) ---> 7
        else:
            function_procedure=interpreter(function_name,table_space)
        
        # remove <procedure  >
        function_procedure=function_procedure[11:len(function_procedure)-2]
        i=0
        count=0
        
        params=""
        stms=""
        
        while i<len(function_procedure):
            if function_procedure[i]=="(":
                count=count+1
            elif function_procedure[i]==")":
                count=count-1
                if count==0:
                    params=function_procedure[0:i+1]
                    stms=function_procedure[i+1:len(function_procedure)]
                    break
            i=i+1
        #print function_procedure
        #print params
        #print stms
        
        params_tree=parser(lexer(params)[0])
        
        print params_tree
        
        run_str="(let ("
        a=1
        for i in params_tree:
            run_str=run_str+"("+i+" "+tree[a]+")"
            a=a+1
        run_str=run_str+")"
        run_str=run_str+stms+")"
        
        print "run_str---> "+run_str
        run_str_tree=parser(lexer(run_str)[0])
        
        return interpreter(run_str_tree,table_space)
        
        
        
TABLE_SPACE={}
x=lexer("(= x ((lambda (a b) (+ a b)) 3 4))")
if x[1]==False:
    print "Incomplete Statement"
    exit(0)
y=parser(x[0])
print x
print y
z=interpreter(y,TABLE_SPACE)
print "\n\n\n\n=========="
print z
print TABLE_SPACE







