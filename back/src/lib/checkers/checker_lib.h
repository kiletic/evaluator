#include <iostream>
#include <fstream>
#include <cassert>
#include <cerrno>
#include <climits>
#include <sstream>

// streams for input, user output and solution output
std::ifstream _in, _uout, _sout; 

void _init_checker(int argc, char** argv) {
	assert(argc == 4);

	_in.open(argv[1]);
	_uout.open(argv[2]);
	_sout.open(argv[3]);

	if (!_in.is_open() || !_uout.is_open() || !_sout.is_open()) {
		std::cout << "Cannot opet file stream.";
		exit(1);
	}
}

void _AC() {
	std::cout << "Accepted";

	exit(0);
}

void _WA() {
	std::cout << "Wrong Answer";

	exit(0);
}

std::istringstream _read_line(std::ifstream& stream) {
	std::string line;
	std::getline(stream, line);
	return std::istringstream(line);
}

void _stream_check_if_end(std::istringstream& stream) {
	while (stream.peek() == ' ')
		stream.get();
	if (stream.tellg() == -1)
		_WA();
}

void _stream_check_if_not_end(std::istringstream& stream) {
	while (stream.peek() == ' ')
		stream.get();
	if (stream.tellg() != -1)
		_WA();
}

// convert string to int
int _stoi(std::string& s) {
	char* s_end;
  long res = std::strtol(s.c_str(), &s_end, 10);
  if (errno == ERANGE) // overflow for long 
		_WA();
  if (*s_end != '\0') // didnt parse the whole string
		_WA();
  if (res < INT_MIN || res > INT_MAX) // overflow for int
		_WA();

	return (int) res;
}

// convert string to long long
long long _stoll(std::string& s) {
	char* s_end;
  long long res = std::strtol(s.c_str(), &s_end, 10);
  if (errno == ERANGE) // overflow for long long 
		_WA();
  if (*s_end != '\0') // didnt parse the whole string
		_WA();

	return res;
}

std::string _get_string(std::istringstream& stream) {
	_stream_check_if_end(stream);

	std::string ret;
	stream >> ret;
	return ret;
}

int _get_int(std::istringstream& stream, bool need_end = false) {
	std::string s = _get_string(stream);

	if (need_end) 
		_stream_check_if_not_end(stream);
	
	return _stoi(s);
}

long long _get_ll(std::istringstream& stream, bool need_end = false) {
	std::string s = _get_string(stream);

	if (need_end)
		_stream_check_if_not_end(stream);
	
	return _stoll(s);
}
