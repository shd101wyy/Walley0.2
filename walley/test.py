from __future__ import division

#================== Fraction Support ===================
# general common divisor
def gcd(n,d):
	if d==0:
		return n
	return gcd(d, n%d)
def make_rat(n,d):
	g = gcd(n,d)	# gcd
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

print math_operation("1/3","12","-")
