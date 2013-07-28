#include <stdio.h>
void test(void *value){
	printf("%s\n","Hi");
}
int main(int argc, char *argv[]){
	int a  =  12;
	void *b = &a;
	printf("%d\n", *(int*)b);
}
