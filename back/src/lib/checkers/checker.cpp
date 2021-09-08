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
	init_checker(argc, argv);

	std::string uline, sline;
	while (std::getline(uout, uline) && std::getline(sout, sline)) {
		if (!lines_equal(uline, sline)) {
			// RETURN WA
			std::cout << "Wrong answer";
			return 0;
		}
	}

	if (std::getline(uout, uline) || std::getline(sout, sline)) {
		// RETURN WA
		std::cout << "Wrong answer";
		return 0;
	}

	// RETURN AC
	std::cout << "Accepted";
}
