#include "checker_lib.h"
#include <iostream>
#include <vector>
#include <sstream>

std::vector <std::vector <int>> graph;

int main(int argc, char** argv) {
	_init_checker(argc, argv);
	
	// read line from input stream
	auto stream = _read_line(_in);

	// read number of nodes and edges
	int n = _get_int(stream);
	int m = _get_int(stream);
	
	graph.resize(n + 1);
	for (int i = 0; i < m; i++) {
		// get next line for input stream
		stream = _read_line(_in);

		// read endpoints of the edge
		int u = _get_int(stream);
		int v = _get_int(stream);
		
		graph[u].push_back(v);
		graph[v].push_back(u);
	}
	// get next line for input stream
	stream = _read_line(_in);
	// read nodes for the shortest path
	int A = _get_int(stream);
	int B = _get_int(stream);
	
	// read first line from user output stream
	stream = _read_line(_uout);
	// it should be an int (denoting shortest path length) and there shouldn't be any input after it
	int user_len = _get_int(stream, true);
	
	// read first line from solution output stream
	stream = _read_line(_sout);
	// it is an int
	int sol_len = _get_int(stream);

	// check if the lengths are the same
	if (user_len != sol_len)
		_WA();
			
	// read second line from output stream
	stream = _read_line(_uout);
	
	// there should be exactly [user_len] ints in this line
	std::vector <int> path;
	for (int i = 0; i < user_len; i++) 
		path.push_back(_get_int(stream));
	// there shouldn't be any more input in this line
	_stream_check_if_not_end(stream);

	// make sure that path begins at node A and ends at node B
	if (path[0] != A || path[user_len - 1] != B)
		_WA();
	
	for (int i = 0; i < user_len - 1; i++) {
		bool exists = false;
		for (int v : graph[path[i]]) 
			if (v == path[i + 1]) 
				exists = true; // next in path found as neighbour

		// if not found then this edge doesn't exist
		if (!exists)
			_WA();
	}
	
	// everything is correct
	_AC();
}
