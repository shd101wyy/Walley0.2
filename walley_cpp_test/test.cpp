#include <iostream>

int swap(int &a, int &b){
	int temp=a;
	a=b;
	b=a;
}

int main(void){
	std::cout<< "Hello World";
	int a=12;
	int b=15;
	swap(a,b);
	std::cout<< a;

	return 0;
}
