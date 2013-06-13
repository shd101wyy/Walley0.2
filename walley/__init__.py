
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
            output.append(input_str[start:i])
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
        table
        function
        symbol
'''

def interpreter(tree,table_space={}):
    length=len(tree)
    # (= x 3) x and 3 are just returned
    if type(tree)==str:
        print "tree---> "+tree
        if (tree in TABLE_SPACE.keys()):
            var_value = TABLE_SPACE[tree]
            if type(var_value)==str:
                return var_value
        return tree
    # x = 12
    if tree[0]=="=":
        if length!=3:
            print "Error. = need 3 values inside"
            exit(0)
        var_name=interpreter(tree[1])
        
        table_space[var_name]={}

        var_value=interpreter(tree[2],table_space[var_name])
        if type(var_value)==str and var_value!="nil":
            table_space[var_name]=var_value
        return "nil"
        
    
    if tree[0]=="+" or tree[0]=="-" or tree[0]=="*" or tree[0]=="/" or tree[0]=="%":
        i=2
        append_str=interpreter(tree[1])
        while i<length:
            append_str=append_str+tree[0]+interpreter(tree[i]) 
            i=i+1
        return str(eval(append_str))
    
    # ((= x 4)(= y 5))
    if type(tree[0])==list:
        for i in tree:
            interpreter(i,table_space)
        return "nil"
    
    # (x z) table
    print "Enter here--> ",
    print tree
    
    append_str="( "+tree[0]
    return_obj=TABLE_SPACE[tree[0]]
    i=1
    while i<length: #and type(return_obj)!=str:
        append_str=append_str +" "+ tree[i]
        return_obj=return_obj[tree[i]]
        i=i+1
    print return_obj
    append_str=append_str+" )"
    if type(return_obj)==dict:
        return append_str
    return return_obj
    
    
    
TABLE_SPACE={}
x=lexer("((= x (= z 12))(= z x))")
y=parser(x[0])
print x
print y
z=interpreter(y,TABLE_SPACE)
print z
print TABLE_SPACE







