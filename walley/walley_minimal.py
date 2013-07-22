'''
The minimal walley
Toy Language 
using

    7 primitives:
    quote atom eq car cdr cons cond(or if)
    
    9 primitives:
        atom eq car cdr cons
        quote cond lambda label
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
            # unquote
            else:
                output.append("unquote")
            
            x=lexer(to_append)[0]
            for a in x:
                output.append(a)


            output.append(")")
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

# 1
# function quote:
# (quote expr) -> expr
def quote(expr):
    return expr
# 2
# returns the atom t if the value of x is an atom or the empty list
# Otherwise it returns '() 
# In Lisp we conventionally use the atom t to represent truth
# and the empty list to represent falsity
def atom(expr):
    if type(expr)==str or expr==[]:
        return "1"
    return []
# 3
#eq x y returns t if the values of x and y are the same atom 
#                    or both the empty list
# and '() otherwise
def eq(arg1, arg2):
    if arg1==[] and arg1==arg2:
        return "1"
    elif type(arg1)==str and arg1==arg2:
        return "1"
    return []
# 4
# return first element
def car(arg1):
    if len(arg1)==0:
        print "Function car error"
        return ""
    return arg1[0]
# 5
# return remain list:
def cdr(arg1):
    if len(arg1)==0:
        print "Function cdr error"
        return ""
    elif len(arg1)==1:
        return []
    # pair
    elif type(arg1)!=str and len(arg1)==3 and arg1[1]==".":
        return arg1[2]
    return arg1[1:len(arg1)]
    
# 6
#expects the value of y to be a list and returns a list containing the value of x followed by the elements of the value of y
def cons(arg1,arg2):
    # pair
    if type(arg2)==str:
        return [arg1,".",arg2] 
    output = [arg1]
    for a in arg2:
        output.append(a)
    return output
# 7
# (cond (judge1 stm1) (judge2 stm2) ...)
def cond(expr):
    i=1
    while i<len(expr):
        judge = interpreter(expr[i][0])
        if judge!=[]:
            return interpreter(expr[i][1])
        i=i+1
    return ""

# 8 

# a simple interpreter
def interpreter(tree):
    func_name=tree[0]
    if type(tree)==str:
        return tree
    elif tree[0]=="quote":
        return quote( tree[1] )
    elif tree[0]=="atom":
        return atom( interpreter(tree[1]) )
    elif tree[0]=="eq":
        return eq(interpreter(tree[1]) , interpreter(tree[2]) )
    elif tree[0]=="car":
        return car(interpreter(tree[1]))
    elif tree[0]=="cdr":
        return cdr(interpreter(tree[1]))
    elif tree[0]=="cons":
        return cons(interpreter(tree[1]) , interpreter(tree[2]))
    elif tree[0]=="cond":
        return cond(tree)
    else:
        print "Error"

l="(cond ((eq 'a 'b) 'First) ((atom 'a) 'Second ) )"
l=lexer(l)
print interpreter(parser(l[0]))


