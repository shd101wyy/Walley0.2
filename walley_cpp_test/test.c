#include <stdio.h>
#include <stdlib.h>
#include <string.h>
typedef struct VALUE{
	char *string_value;
	struct VALUE *list_value;
	struct VALUE *next;
} VALUE;
void VALUE_init(VALUE *value,char *string_value, VALUE *list_value){
	(*value).string_value = string_value;
	(*value).list_value = list_value;
	(*value).next = NULL;
}
void VALUE_print(VALUE *value);

void VALUE_appendNext_iter(VALUE *value, VALUE *next_value, VALUE *next){
	if ((*next_value).next==NULL)
		(*next_value).next = next;
	else
		VALUE_appendNext_iter(value,(*next_value).next,next);
}
void VALUE_appendNext(VALUE *value, VALUE *next){
	if ((*value).next == NULL){
		(*value).next = next;
	}
	else
		VALUE_appendNext_iter(value,(*value).next,next);
}
// VALUE_append(&value, string value, list value)
// string value is NULL or list value is NULL
void VALUE_append(VALUE *value, char *string_value, VALUE *list_value){
	if ((*value).string_value==NULL && (*value).list_value==NULL){
		(*value).string_value = string_value;
		(*value).list_value = list_value;
		return;
	}

	VALUE *append_value;
	append_value = (VALUE *)malloc(sizeof(VALUE)*1);
	append_value->string_value = NULL;
	append_value->list_value = NULL;
	append_value->next = NULL;

	// string value
	if (string_value!=NULL)
		append_value->string_value = string_value;
	// list value
	else
		append_value->list_value = list_value;
	VALUE_appendNext(value,append_value);
}

int VALUE_length_iter(VALUE *value,int count){
	if (value==NULL)
		return count;
	return VALUE_length_iter(value->next,count+1);
}
int VALUE_length(VALUE *value){
	return VALUE_length_iter(value,0);
}

char* string_slice(char *input_str , int start, int end){
	char *output_str = (char*)malloc(sizeof(char)*(end-start+1));
	int i=start;
	int length = (int)strlen(input_str);
	while (i<end){
		output_str[i-start]=input_str[i];
		i=i+1;
	}
	output_str[i-start]='\0';
	return output_str;
}

VALUE *list_slice(VALUE *value, int start, int end){
	VALUE *output;
	output = (VALUE*)malloc(sizeof(VALUE)*1);
	output->string_value = NULL;
	output->list_value = NULL;
	output->next = NULL;
	// return empty list
	if (start==end)
		return output;

	VALUE *p=value;
	int i=0;
	while (i<start){
		p = (*p).next;
		i=i+1;
	}
	while (i<end){
		if (p==NULL)
			return output;
		VALUE_append(output,(*p).string_value,(*p).list_value);
		p = (*p).next;
		i=i+1;
	}
	return output;
}

void VALUE_print(VALUE *value){
	// string type
	if (value->string_value!=NULL){
		printf("%s\n", value->string_value);
	}
	else {
		printf("====\n");
		if (value->list_value!=NULL)
			VALUE_print(value->list_value);
		printf("====\n");
	}
	if (value->next!=NULL){
		VALUE_print(value->next);
	}
}

VALUE* lexer(char *input_str){
	VALUE *value = (VALUE*)malloc(sizeof(VALUE));
	VALUE_init(value,NULL,NULL);

	int count = 0; // count of ( and )
	int length = (int)strlen(input_str);
	int i=0;
	while (i<length){
		if (input_str[i]=='('){
			count=count+1;
			VALUE_append(value,"(",NULL);
			i=i+1;
			continue;
		}
		else if (input_str[i]==')'){
			count=count-1;
			VALUE_append(value,")",NULL);
			i=i+1;
			continue;
		}
		// annotation
		else if(input_str[i]==';'){
			while (i<length){
				if (input_str[i]=='\n'){
					break;
				}
				i=i+1;
			}
			continue;
		}
		else if (input_str[i]==' ' || input_str[i]=='\n' || input_str[i]=='\t'){
            i=i+1;
            continue;
        }
        // quote and unquote
        else if (input_str[i]=='\'' || input_str[i]==',' || input_str[i]=='@'){
            int start=i+1;
            i=i+1;
            int count_of_bracket=0;
            int count_of_double_quote=0;
            while(i!=length){
                if (input_str[i]=='"')
                    count_of_double_quote=count_of_double_quote+1;
                else if (input_str[i]=='(' && count_of_double_quote%2==0) // make sure ( is not inside ""
                    count_of_bracket=count_of_bracket+1;
                else if (input_str[i]==')' && count_of_double_quote%2==0) // make sure ) is not inside ""
                    count_of_bracket=count_of_bracket-1;
                if (count_of_bracket==0 && (input_str[i]==' '  || input_str[i]=='\n' ))
                    break;
                if (count_of_bracket==-1)
                    break;
                i=i+1;
            }
            
            char *to_append = string_slice(input_str,start,i);
            VALUE_append(value,"(",NULL);

            // quote
            if(input_str[start-1]=='\'')
            	VALUE_append(value,"quote",NULL);
            // quasiquote 
            else if (input_str[start-1]=='@')
            	VALUE_append(value,"quasiquote",NULL);
            // unquote
            else
            	VALUE_append(value,"unquote",NULL);
            
            VALUE *temp_=lexer(to_append);
           
            while (temp_!=NULL){
            	VALUE_append(value,temp_->string_value,temp_->list_value);
            	temp_ = temp_->next;
            }
            VALUE_append(value,")",NULL);
            continue;
        }
        //string
        
        else if (input_str[i]=='"'){
            int count2=0;
            int start=i;
            while (i<length){

                if (input_str[i]=='"' && input_str[i-1]!='\\'){
                    count2=count2+1;
                    if (count2==2){
                    	VALUE *quote_value = (VALUE*)malloc(sizeof(VALUE)*1);
                    	quote_value->string_value="(";
                    	quote_value->list_value=NULL;
                    	quote_value->next=NULL;
                    	VALUE_append(quote_value,"quote",NULL);
                    	VALUE_append(quote_value,string_slice(input_str,start+1,i),NULL);
                    	VALUE_append(quote_value,")",NULL);

                        // remove " "
                        VALUE_appendNext(value,quote_value);
                        break;
                    }
            	}
            	i=i+1;
            }
            
            if (count2!=2){
                printf("Error...\nInvalid String");
                exit(0);
            }

            i=i+1;
            if (i!=length && input_str[i]!=' ' && input_str[i]!=')' && input_str[i]!='\n'){
                printf("Error...\nInvalid String -> %s ...\n",string_slice(input_str,start,i+1));
                exit(0);
            }

            continue;
        }
      
        
        else{
            int start=i;
            while (i!=length && input_str[i]!=' ' && input_str[i]!='(' && input_str[i]!=')' && input_str[i]!='\n' && input_str[i]!='\t'){
                i=i+1;
            }
            char *to_append=string_slice(input_str,start,i);
 			VALUE_append(value,to_append,NULL);            
            continue;
        }

	}
	return value;
}

VALUE *parser(VALUE *arr){
	VALUE *output=(VALUE*)malloc(sizeof(VALUE)*1);
	output->string_value = NULL;
	output->list_value = NULL;
	output->next = NULL;

	int length = VALUE_length(arr);
    if (length==1)
        return arr;
    // empty list
    if (1==length-1)
    	return output;
    VALUE *temp = list_slice(arr,1,length-1);
    arr = temp;
    int i=0;
    VALUE *arr_copy = arr;
    while (arr!=NULL){
        if (strcmp(arr->string_value,"(")==0){
           	// find ")"
            int start=i;
            int count=0;
            while (i<length){
                if (strcmp(arr->string_value,"(")==0)
                    count=count+1;
                else if (strcmp(arr->string_value,")")==0){
                    count=count-1;
                    if (count==0){							
                    	temp = list_slice(arr_copy,start,i+1);
                    	temp = parser(temp);
                    	VALUE_append(output,NULL,temp);
                        break;
                    }
                }
                i=i+1;
                arr = arr->next;
            }
        }
        else{
        	VALUE_append(output,arr->string_value,NULL);
        }

        i=i+1;
        arr = arr->next;
    }
    free(arr);
    free(temp);
    return output;
}

// '() is empty
int isEmpty(VALUE *value){
	if(value->string_value==NULL && value->list_value==NULL && value->next==NULL)
		return 1;
	return 0;
}
int isString(VALUE *value){
	if (value->string_value!=NULL)
		return 1;
	return 0;
}
int isList(VALUE *value){
	if (value->next!=NULL)
		return 1;
	return 0;
}
// return the type of value
char *type(VALUE *value){
	if (value->next==NULL){
		return "str";
	}
	return "list";
}
// ===============================
// SEVEN primitives
// ===============================
// (quote arg) -> arg
VALUE* quote(VALUE *arg){
	return arg;
}

VALUE* atom(VALUE *arg){
	VALUE *output;
	output = (VALUE*)malloc(sizeof(VALUE));
	if (isString(arg)){
		VALUE_init(output,"1",NULL);
		return output;
	}
	VALUE_init(output,"0",NULL);
	return output;
}

// it is a copy 
VALUE* car(VALUE *value){
	VALUE *output = (VALUE*)malloc(sizeof(VALUE));
	output->string_value = value->string_value;
	output->list_value = value->list_value;
	output->next=NULL;
	return output;
}

VALUE* cdr(VALUE *value){
	if (isEmpty(value)){
		printf("Error...function cdr does not support empty list\n");
	}
	VALUE *output = (VALUE*)malloc(sizeof(VALUE));
	output->string_value = NULL;
	output->list_value = NULL;
	output->next = NULL;

	value = value->next;
	while (value!=NULL){
		VALUE_append(output,value->string_value,value->list_value);
		value = value->next;
	}
	return output;
}


// has problem here
VALUE* cons(VALUE *value1, VALUE *value2){
    if (strcmp(type(value2),"str")==0){
    	VALUE *output;
    	output = (VALUE*)malloc(sizeof(VALUE));
    	VALUE_init(output,NULL,NULL);
    	VALUE_append(output,value1->string_value,value1->list_value);
    	
    	// pair
    	VALUE_append(output,".",NULL);
    	VALUE_append(output,value2->string_value,value2->list_value);
        return output;
    }
    // not pair
    else{
    	VALUE *output;
    	output = (VALUE*)malloc(sizeof(VALUE));
    	VALUE_init(output,NULL,NULL);
    	if (strcmp(type(value1),"list")==0){
   			VALUE_append(output,NULL,value1);
    	}
    	else{
			VALUE_append(output,value1->string_value,value1->list_value);
    	}
    	//VALUE_append(output,value1->string_value,value1->list_value);
    	while (value2!=NULL){
    		VALUE_append(output,value2->string_value,value2->list_value);
    		value2 = value2->next; 
    	}
        return output;
    }
}

int main(int argc, char * argv[]){
	
	VALUE *value;
	value = (VALUE*)malloc(sizeof(VALUE)*1);
	value->string_value = NULL;
	value->list_value = NULL;
	value->next = NULL;

	value=lexer("(1 2 3)");
	VALUE_print(value);
	
	printf("@======================@\n");

	VALUE *output = parser(value);

	VALUE_print(output);

	printf("@@@@@@======================\n");
	VALUE_print(cons(parser(lexer("(1 12)")),output));
	if (cdr(output)==cdr(output))
		printf("EQUAL\n" );


	return 0;
}
















