'''
	Toy Language Virtual Machine 
									by Yiyi Wang
										shd101wyy

	opcode:				instruction

	+						 0
	-    					 1
	*   					 2
	/ 						 3
	set						 4
	if                       5
	jmp						 6
	call					 7


	# if
	if judge true, run next
	else jmp steps
	[if judge jmp_steps]

	# jump
	jump steps
	[jmp jmp_steps]

	# call
	[call function_index parameters_start_index return_store_in_index]

	# call function
	(add 3 4)
	# add is located in stack 0
	set 1 "3"
	set 2 "4"
	call 0 1 1 # call function at 0 with parameter from stack 1 and store return value at index 1

	# define function
	(define add (lambda (a b) (__ADD__ a b)))
	create a local stack []
	procedure:
		set a at index 0
		set b at index 1
		return call __ADD__ with parameter a and b
	4     0 nil nil
	4     1 nil nil
	7     -1 0 0

'''
from toy import *
STACK = []
# init stack
def init_STACK(stack,size):
	i=0
	while i<size:
		stack.append("")
		i=i+1

# global stack can store 256 values
init_STACK(STACK,256)


# 7 primitive functions index in stack
# quote -1
# atom -2
# eq -3
# car -4
# cdr -5
# cons -6
# cond -7 (I use if instead)

# symbolic table
# used to save var index
# [x,y,x]
#  0 1 0

# symbolic table list
# [[x,y,z],[x,y]]

# generate byte code
OFF_SET = 0
SYMBOLIC_TABLE = [[]]
def toy_bytecode(tree,symbolic_table_list=[[]]):
	# get var_name index according to symbolic_table
	# return [symbolic_table_index , var_name_index]
	def get_var_name_index(var_name,symbolic_table_list,count):
		def get_var_name_index_iter(var_name,symbolic_table,count):
			if symbolic_table==[]:
				return -1
			elif var_name == symbolic_table[0]:
				return count
			return get_var_name_index_iter(var_name,symbolic_table[1:len(symbolic_table)],count+1)
		if symbolic_table_list==[]:
			return -1
		else:
			index = get_var_name_index_iter(var_name,symbolic_table_list[0],0)
			if index==-1:
				return get_var_name_index(var_name,symbolic_table_list[1:len(symbolic_table_list)], count+1)
			else:
				return [count,index]


	global OFF_SET
	# string
	if tree[0]=="\"":
		OFF_SET = OFF_SET+1
		return [[4,OFF_SET-1,tree,0]]
	# number
	elif stringIsNumber(tree):
		OFF_SET = OFF_SET+1
		return [[4,OFF_SET-1,tree,0]]
	# atom
	elif type(tree) == str:
		OFF_SET = OFF_SET + 1
		# [symbolic_table_index , var_name_index]
		var_name_index = get_var_name_index(tree,symbolic_table_list,0)
		return [[4,OFF_SET-1,var_name_index[1],var_name_index[0]]]
	else:
		if type(tree[0])==str:
			def value_ol_iter(tree,symbolic_table_list):
				if tree==[]:
					return []
				return cons(toy_bytecode(tree[0],symbolic_table_list) ,value_ol_iter(tree[1:len(tree)] , symbolic_table_list ))
			# define variable
			if tree[0]=="define":
				# define x 12
				return_ol =  toy_bytecode(tree[2],symbolic_table_list)
				OFF_SET = OFF_SET - 1
				var_name = tree[1]
				var_name_index = get_var_name_index(var_name,symbolic_table_list,0)
				# var_name does not existed
				if var_name_index == -1:
					symbolic_table_list[len(symbolic_table_list)-1].append(var_name)
					OFF_SET = OFF_SET + 1
					return [return_ol]
				else:
					set_ol=[4,var_name_index[1],OFF_SET,var_name_index[0]]
					return [return_ol,set_ol]
			elif tree[0]=="quote":
				value_ol = [4,OFF_SET,tree[1],0]
				return [value_ol,[7,-1,OFF_SET,OFF_SET]]
			elif tree[0]=="atom":
				value_ol = toy_bytecode(tree[1],symbolic_table_list)
				return [value_ol,[7,-2,OFF_SET,OFF_SET]]
			elif tree[0]=="eq":
				temp_off_set = OFF_SET
				value_ol = value_ol_iter(tree[1:len(tree)],symbolic_table_list)
				OFF_SET = temp_off_set
				value_ol.append([7,-3,OFF_SET,OFF_SET])
				return value_ol
			elif tree[0]=="car":
				value_ol = toy_bytecode(tree[1],symbolic_table_list)
				return [value_ol,[7,-4,OFF_SET,OFF_SET]]
			elif tree[0]=="cdr":
				value_ol = toy_bytecode(tree[1],symbolic_table_list)
				return [value_ol,[7,-5,OFF_SET,OFF_SET]]  
			elif tree[0]=="cons":
				temp_off_set = OFF_SET
				value_ol = value_ol_iter(tree[1:len(tree)],symbolic_table_list)
				OFF_SET = temp_off_set
				value_ol.append([7,-6,OFF_SET,OFF_SET])
			elif tree[0]=="if":
				temp_off_set = OFF_SET
				judge_ol = toy_bytecode(tree[1],symbolic_table_list)
				stm1_ol = toy_bytecode(tree[2],symbolic_table_list)
				stm2_ol = toy_bytecode(tree[3],symbolic_table_list)
				if_ol = [5,temp_off_set,len(stm1_ol),0]
				OFF_SET = temp_off_set
				output=[judge_ol,if_ol,stm1_ol,stm2_ol]
				return output


				value_ol = value_ol_iter(tree[1:len(tree)],symbolic_table_list)
				OFF_SET = temp_off_set
				value_ol.append([7,-7,OFF_SET,OFF_SET])
				return value_ol
			elif tree[0]=="lambda":
				OFF_SET = OFF_SET + 1
				param_tree = [tree[1]]
				byte_code = toy_bytecode(tree[2],append(symbolic_table_list,param_tree))
				#					formatted bytecode,source_code
				return [4,OFF_SET-1,[byte_code,tree],len(symbolic_table_list)-1]

			else:
				temp_off_set = OFF_SET
				var_name_index = get_var_name_index(tree[0],symbolic_table_list)
				value_ol = value_ol_iter(tree[1:len(tree)],symbolic_table_list)
				OFF_SET = temp_off_set
				value_ol.append([7,var_name_index,OFF_SET,OFF_SET])
		else:
			# lambda
			if tree[0][0]=="lambda":
				
				pass
			else:
				pass
	pass

print toy_bytecode(["define","x","12"],SYMBOLIC_TABLE)
#print toy_bytecode(["define","x","14"],SYMBOLIC_TABLE)
#print toy_bytecode(["quote","a"],SYMBOLIC_TABLE)
#print toy_bytecode(["atom",["quote","a"]],SYMBOLIC_TABLE)
#print toy_bytecode(["eq",["quote","a"],["quote","a"]],SYMBOLIC_TABLE)
#print toy_bytecode(["if","1","12","13"],SYMBOLIC_TABLE)
print toy_bytecode(["lambda",["a","b"],"a"])

print "======================"
print SYMBOLIC_TABLE

# instruction:
# eg ["4","0","#12"] -> set 12 to stack 0
# ol = operation list
def vm(ol,stack = STACK):
	if ol==[]:
		return ""

	def get_value(index,stack):
		if type(index)==str or type(index)==list:
			return index
		value = stack[index]
		if type(value[0])==str:
			return value
		return get_value(value,stack)
	def get_operator(num):
		if num==0:
			return "+"
		elif num==1:
			return "-"
		elif num==2:
			return "*"
		else:
			return "/"
	opcode = ol[0][0]
	arg1 = ol[0][1]
	arg2 = ol[0][2]
	arg3 = ol[0][3]

	# set
	if opcode==4:
		stack[arg1] = get_value(arg2,stack)
	# + - * /
	elif opcode==0 or opcode==1 or opcode==2 or opcode==3:
		dest = arg1
		value1 = get_value(arg2,stack)
		value2 = get_value(arg3,stack)
		stack[dest] = math_operation(value1,value2,get_operator(opcode))
	# if
	elif opcode==5:
		judge = get_value(arg1)
		# false, jmp
		if judge=="0":
			return vm(ol[arg2:len(ol)],stack)
		# true
		else:
			return vm(ol[1:len(ol)],stack)
	# jmp
	elif opcode==6:
		return vm(ol[arg1:len(ol)],stack)
	# call
	else:
		function_procedure = get_value(arg1,stack)
		# save returned value at arg3
		return_index = arg3
		stack[arg3] = vm(function_procedure,stack)
		pass

	return vm(ol[1:len(ol)],stack)

# string means value
# integer means reference
ol = [ 
	[4,0,"12",0],
	[4,1,"13",0],
	[0,2, 0, 1]
]

vm(ol,STACK)
print STACK













