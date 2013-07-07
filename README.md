Walley0.2
=========
Toy language is a lisp dialect written in Python 2.7.5 ......
Well.... It cannot be regarded as lisp dialect cuz I did not learn lisp very well
It does not support "Macro" now cuz.... idk what macro really is ..... so hard... XD

	./----
		toy      
		init.py
		toy.py        toy language source code file
		toy.toy       toy language libraries
		test.py       test file
		test.toy      test file

#=================
In toy.py file:
	function:
		lexer: used to tokenize string, return array, array[0] is token list, array[1] is the result of lexical analysis
		parser: used to parse token list to generate tree
		interpreter: used to run parsed tree

		to run one string, eg:
			interpreter(parser(lexer("(That is the string you want to run)")[0]))
			
#================
To Run Toy Language, run "toy" file in walley folder
type "./toy" in terminal or cmd

	commands:
		toy    								# Run toy repl 一行一行地运行
		toy [file_name]						# Run file [file_name] 运行[file_name]文件
		toy compress [file_name]			# Compress file [file_name] to make it smaller
											# will remove \n and extra spaces 压缩文件


我想把Toy语言做成一种“寄生”语言。。
我试图把Toy解释器做的尽可能小。。 I am trying to make Toy interpreter as tiny as possible
然后便于用其他语言编写Toy解释器，已助于移植代码。。
这样可以使得Toy语言寄生于任何一种语言之上


operator:
	+ - * / % float fraction

	(/ 3 6) -> 1/2
	(/ 3.0 6) -> 0.5
	(float 1/2) -> 0.5
	(fraction 0.5) -> 1/2

comparison:
	== > < >= <= != not and or


assignment value:
	=
	格式:
		(= [var_name] [var_value])

	这个函数可以被用来创造全局变量

	eg: 
		(= x 12) assign 12 to x
		(= x (/ 2 6)) assign 1/3 to x
quote:
	eg:
		(= x '(1 2)) assign (1 2) to x
		# 加上'符号意味着不计算后面的值

		'(1 2) 等价于 (quote 1 2)

		如果事先
		(= a 12)
		那么
		(= x '(,a a)) 则 assign (12 a) to x
		# 加上 , 符号意味着进行计算

		所以 '(,a a) 会计算第一个a而不计算第二个a。。

embeded functions:
内嵌函数：
	#########
	local=
		(local= [var_name] [var_value])
		eg:
			(local= x 12) 
			it will create local variable x and then assign 12 to x
			创建局部变量x并赋值12
	这个函数推荐在定义函数内使用

	#########
	car cdr cons cond let list if 和其他lisp一样

	#########
	stms
	(stms [stm1] [stm2] ....)
		依次运行 stm1 stm2 并且返回最后一个值

	#########
	lambda
		定义函数
		(= [func_name] (lambda ([var_argv] ...)
				[stms]
			)
		)

		eg:
			(= add (lambda (a b)
					(+ a b)
				)
			)
			将会将函数 (lambda (a b) (+ a b)) assign 给 add

			运行add函数可以直接如下：
				(add 3 4) 将会返回 7
				((lambda (a b) (+ a b)) 3 4) 同样会返回 7

	#########
	number?  检查值是否为数字
		number? :-	float eg: 2.3
				:-  int   eg: 3
				:-  fraction eg: 1/3
	#########
	list? 检查值是否为列表
		eg:
		(list? '(1 2 3)) -> 1 返回 1 因为 (1 2 3) 为列表
		(list? 12)		 -> 0 返回 0 因为 12 不是列表。。。0 是 atom

	#########
	atom? 检查值是否为原子:
		eg:
		(atom? 'a123) -> 1 返回 1 因为 a123 为 原子
		(atom? '(a b c) ) -> 0 返回 0 因为 (a b c) 是列表不是原子

	#########
	empty? null? 检查列表是否为空
		注意： empty? <=> null?
		eg:
		(null? '()) -> 1 因为 () 是空的
		(null? '(1 2 3)) -> 0 因为  (1 2 3) 不是空的

	#########
	print
		eg:
		>>> (print "Hello")
			Hello

		>>>
	
	#########
	while 
	和C语言等语言一样的while语句
	格式：
		(while [judge] [stms])

	
	#########
	len
	格式：
		(len [list/string])
		返回 列表 或 字符串 的长度



	##########
	Variadic Function parameters
	. args
	(= add (lambda (. args) (+ 12 (car args))))
				    -------
				    . args 为可变参数 variadic params
	(add 3 4) -> 12+3=15, args = (3 4)





===========
About Lazy Evaluation
关于惰性求值
	if 函数的源代码 source code
	如果 函数参数前加了 &， 则表示该参数为惰性求值，传递参数时不会计算
	if & is ahead param, then this param is for lazy evaluation...
	(= if (lambda (condition &stm1 &stm2) (cond (condition stm1) (1 stm2))))









