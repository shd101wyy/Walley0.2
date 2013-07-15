# support 3 3.0 3.0e-12
# three kind of value
def isNumber(element):
	try:
	    float(element)
	    return True
	except ValueError:
	    #print "Not a float"
	    return False
print isNumber("Hello")