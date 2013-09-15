Walley0.2  
=========  
Toy language is a lisp dialect written in Python 2.7.5 ......
Well now in JavaScript and Python version has been stopped  
Well.... It cannot be regarded as lisp dialect cuz I did not learn lisp very well  
The whole language is like Scheme and has some js py style
	./----  
		toy        
		init.py  
		toy.py        toy language source code file  
		toy.toy       toy language libraries  
		test.py       test file  
		test.toy      test file  
		test2.toy     test file
    ./walley_ks
        ... 

For the JavaScript Version, please check walley_js folder

Attention:: Python version is stopped...

	commands:  
		toy    								# Run toy repl 一行一行地运行  
		toy [file_name]						# Run file [file_name] 运行[file_name]文件  
		toy compress [file_name]			# Compress file [file_name] to make it smaller  
											# will remove \n and extra spaces 压缩文件  
==================================

    Toy Language Data Type:
     5 data types
     <strong> atom(string) list vector dict number </strong>

    list is mutable data... attention


==================================
About Data Type

Atom:
    'abc - > (quote abc) return 'abc'
    "hello world" -> (quote hello world) return 'hello world'
    define:
        (define x "Hello World")
        (define y 'hello)
List:
    '(1 2 3)
    define:
        (define x '(1 2 3))
Number:
    12 13.4 3/4
    only support int float fraction(rational) now
    define:
        (define x 12)
        (define y 3/4)
        (define z 12.34)

Vector:
[value1 value2 value3 ...]
    [1 2 3]
    [1 x 2]
    define:
        (define x 12)
        (define y [1 2 3]) -> y is [1 2 3]
        (define z [x 1 2]) -> z is [12 1 2]
        
    quick access value at index:
        (vector index)
        eg:
            (define x [1 2 3])
            (x 2) -> 3

Dict:
{:key value :key value ...}
    key must start with ':' char
    {:a 12 :b 13}
    define:
        (define x {:a 12 :b 13})
        
    quick access value at key
        (dict key)
        eg:
            (define x {:Author 'Yiyi})
            (x :Author) -> Yiyi
  
=====================================
我想把Toy语言做成一种“寄生”语言。。  
我试图把Toy解释器做的尽可能小。。 I am trying to make Toy interpreter as tiny as possible  
然后便于用其他语言编写Toy解释器，已助于移植代码。。  
这样可以使得Toy语言寄生于任何一种语言之上  
  
支持lisp最基础的7个函数
atom? cons car cdr quote cond eq

  
operator:  
	+ - * / % float fraction  
  
	(/ 3 6) -> 1/2  
	(/ 3.0 6) -> 0.5  
	(float 1/2) -> 0.5  

comparison:  
	=(==) > < >= <= != not and or  
annotation:
	; ur annotation
  
assignment value:  
	===============
	define
	格式:  
		(define [var_name] [var_value])  
  
	这个函数可以被用来创造全局变量  
  
	eg:   
		(define x 12) assign 12 to x  
		(define x (/ 2 6)) assign 1/3 to x  

	===============
	set!：  change defined value  
		(set! [var_name] [var_value])  
	eg:  
		(define x 12) ; assign 12 to x  
		(set! x 13)	  ; change the value of x from 12 to 13  
		Similar as scheme  

quote:  
	eg:  
		(define x '(1 2)) assign (1 2) to x  
		# 加上'符号意味着不计算后面的值  
  
		'(1 2) 等价于 (quote 1 2)  
  
		如果事先    
		(define a 12)  
		那么  
		(define x '(,a a)) 则 assign (12 a) to x   但是不进行计算
			====> ((unquote a) a)
		# 加上 , 符号意味着进行计算 

		(define x @(,a a)) 则 assign (12 a) to x 并且进行计算
			====> (12 a) 
  
		所以 '(,a a) 会计算第一个a而不计算第二个a。。  

embeded functions:  
内嵌函数：  
  
	#########  
	car cdr cons cond let list if 和其他lisp一样  
  
	#########  
	begin  
	(begin [stm1] [stm2] ....)  
		依次运行 stm1 stm2 并且返回最后一个值  
  
	#########  
	lambda  
		定义函数  
		(define [func_name] (lambda ([var_argv] ...)  
				[stms]  
			)  
		)  
  
		eg:  
			(define add (lambda (a b)  
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
    int? 
    float?
    rational?
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
	display  
		eg:  
		>>> (display "Hello")  
			Hello  
		>>>    
  
	##########  
	Variadic Function parameters  
	. args  
	(define add (lambda (. args) (+ 12 (car args))))  
				    -------  
				    . args 为可变参数 variadic params  
	(add 3 4) -> 12+3=15, args = (3 4)  
  
    & args
    (define if (lambda (& params)))
    if I input (if 1 (/ 12 0) 13) then 
    'params' will be assigned value (1 (/ 12 0) 13) without 


    # deprecated
    ######### embed list function
    
    Function 'len':
    (len [list/atom]) return the length of list or atom
    eg:
        (len '(1 2 3)) -> 3
        (len '1234) ->4

    Function 'ref':
    (ref [life/atom] index) and the value at index
    eg:
        (ref '(1 2 3) 0) -> 1
        (ref '1234 2) -> 3

    Function 'slice':
    (slice [life/atom] slice-from slice-to)
        get slice of life or atom
        eg:
            (slice '(1 2 3) 0 2) -> (1 2)


    Function 'set-ref!'
    (set-ref! var-name index var-value)
        Attention: this function will change value at index of mutable data type list
        set value at index
        eg:
            (define x '(1 2 3)
            (set-ref! x 0 12) -> x=(12 2 3)
    
    Function 'pop'
    (pop [list])

    Function 'push'
    (push [list] [push_value])


    
     

===========  
About Macro  
由于本人正在学习macro。。。尚未完全理解macro。。所以只是简单的做了一个定义macro的函数  
<code>
(defmacro [macro-name] [params] [return-value ...])

    or

(define [macro-name] (macro [params] [return-value ...]))

eg:
    (define  square (macro (x) @(* ,x ,x)))
    (square 12) will return 144
 </code>










