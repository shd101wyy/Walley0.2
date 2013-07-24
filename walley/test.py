def test(x,count):
	if count==0:
		x[0]=12
		return x
	else:
		return test(x[1:len(x)],count-1)
x=[1,2,3,4]
test(x,0)
print x