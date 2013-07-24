x=[["x",[1,2,3]]]
y=["y",x[0][1]]
import operator
print operator.is_(y[1],x[0][1])
print y 
print x