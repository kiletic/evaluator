#include "checker_lib.h"
#include <iostream>
#include <vector>
#include <sstream>

std::vector <std::vector <int>> graph;

int main(int argc, char** argv) {
	_init_checker(argc, argv);
	
	auto stream = _read_line(_in);

	int n = _get_int(stream);
	int m = _get_int(stream);
	
	graph.resize(n + 1);
	for (int i = 0; i < m; i++) {
		stream = _read_line(_in);

		int u = _get_int(stream);
		int v = _get_int(stream);
		
		graph[u].push_back(v);
		graph[v].push_back(u);
	}
	stream = _read_line(_in);
	int A = _get_int(stream);
	int B = _get_int(stream);
	
	
	stream = _read_line(_uout);
	
	int user_len = _get_int(stream, true);
	
	stream = _read_line(_sout);
	int sol_len = _get_int(stream);

	if (user_len != sol_len)
		_WA();
			
	stream = _read_line(_uout);
	
	std::vector <int> path;
	for (int i = 0; i < user_len; i++) 
		path.push_back(_get_int(stream));
	_stream_check_if_not_end(stream);

	if (path[0] != A || path[user_len - 1] != B)
		_WA();
	
	for (int i = 0; i < user_len - 1; i++) {
		bool exists = false;
		for (int v : graph[path[i]]) 
			if (v == path[i + 1]) 
				exists = true;
		if (!exists)
			_WA();
	}
	
	_AC();
}
