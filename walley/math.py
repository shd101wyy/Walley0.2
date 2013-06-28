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

# 12 --> true
# 3/4 --> true
# is Number includes fraction and float
def isNumber(input_str):
	if input_str.isdigit():
		return True

	index_of_gang=input_str.find("/")

	if (index_of_gang==-1):
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
		print "Error... cannot process "+num1_str+sign+num2_str
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
		printf("Mistake occurred while calling function Walley_Operator_For_Fraction\nUnseen sign %c occurred\n",sign)
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
                print "Error.. Can not multiply two string "+value1+" and "+value2+"\n"
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
            print "Error.. Sign "+sign+" can not be used for string calculation for "+value1+" and "+value2+"\n"
            return ""








   

