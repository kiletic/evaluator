#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <cassert>

// streams for input, user output and soulution output
std::ifstream in, uout, sout; 

void init_checker(char** argv) {
	in.open(argv[1]);
	uout.open(argv[2]);
	sout.open(argv[3]);

	if (!in.is_open() || !uout.is_open() || !sout.is_open()) {
		std::cout << "Cannot opet file stream.";
		exit(1);
	}
}

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
	assert(argc == 4);
	init_checker(argv);

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
