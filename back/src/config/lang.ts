const langs: Record<string, any> = {
	'c_cpp': {
		compile: 'c++ solution.cpp -O3 -std=c++17 -o solution',
		run: './solution',
		ext: '.cpp'
	},
	'haskell': {
		compile: 'ghc solution.hs -o solution',
		run: './solution',
		ext: '.hs'
	},
	'python': {
		run: 'python3 solution.py',
		ext: '.py'
	}
};

export default langs;
