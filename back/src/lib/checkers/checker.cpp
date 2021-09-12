#include <iostream>
#include <sstream>
#include <vector>
#include "checker_lib.h"

bool lines_equal(std::string& uline, std::string& sline) {
	std::istringstream user(uline), sol(sline); 	

	std::string ubuf;
	std::vector <std::string> uvec;
	while (user >> ubuf) {
		uvec.push_back(ubuf);
	}

	std::string sbuf;
	std::vector <std::string> svec;
	while (sol >> sbuf) {
		svec.push_back(sbuf);
	}

	return uvec == svec;
}

int main(int argc, char** argv) {
	_init_checker(argc, argv);

	std::string uline, sline;
	while (std::getline(_uout, uline) && std::getline(_sout, sline)) 
		if (!lines_equal(uline, sline)) 
			_WA();

	if (std::getline(_uout, uline) || std::getline(_sout, sline)) 
		_WA();

	_AC();
}
