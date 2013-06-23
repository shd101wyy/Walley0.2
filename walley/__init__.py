
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
        print "tree---> "+tree
        if tree.isdigit():
            return tree
        else:
            if tree in table_space.keys():
                return table_space[tree]
            else:
                print "\nError...\nUndefined value "+tree+"\n"
                exit(0)
    # x = 12
    if tree[0]=="=":
        if length!=3:
            print "Error. = need 3 values inside"
            exit(0)
        var_name=tree[1]
        
        table_space[var_name]={}

        var_value=interpreter(tree[2],table_space)
        table_space[var_name]=var_value
        
        return "nil"
        
    if tree[0]=="+" or tree[0]=="-" or tree[0]=="*" or tree[0]=="/" or tree[0]=="%":
        i=2
        append_str=interpreter(tree[1],table_space)
        while i<length:
            append_str=append_str+tree[0]+interpreter(tree[i],table_space) 
            i=i+1
        return str(eval(append_str))
    
    if tree[0]=="quote":
        print 'it is quote'
        return tree[1]
    
    # car function
    # (car '(1 2 3)) -> 1
    if tree[0]=="car":
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
    if tree[0]=="cdr":
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
    if tree[0]=="cons":
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
    if tree[0]=="stms":
        i=1
        while i<len(tree):
            print interpreter(tree[i],table_space)
            i=i+1
    
    
TABLE_SPACE={}
x=lexer("(stms (= x 12) (= y (+ x 3)) y)")
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







