const langs: Record<string, any> = {
	'c_cpp': {
		compile: (name: string) => `c++ ${name}.cpp -O3 -std=c++17 -o ${name}`,
		run: (name: string) => `./${name}`,
		ext: '.cpp'
	},
	'haskell': {
		compile: (name: string) => `ghc ${name}.hs -o ${name}`,
		run: (name: string) => `./${name}`,
		ext: '.hs'
	},
	'python': {
		run: (name: string) => `python3 ${name}.py`,
		ext: '.py'
	}
};

export default langs;
