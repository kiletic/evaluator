#include <iostream>
#include <fstream>
#include <cassert>

// streams for input, user output and soulution output
std::ifstream in, uout, sout; 

void init_checker(int argc, char** argv) {
	assert(argc == 4);

	in.open(argv[1]);
	uout.open(argv[2]);
	sout.open(argv[3]);

	if (!in.is_open() || !uout.is_open() || !sout.is_open()) {
		std::cout << "Cannot opet file stream.";
		exit(1);
	}
}
