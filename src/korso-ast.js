const untilNextKeyword = (lex, start, allowed) => {
	for (var i = start; i < lex.length; i++) {
		const item = lex[i];
		if (item.type === "keyword" && !allowed.includes(item.word))
			return lex.slice(start, i);
	}
	return lex.slice(start, lex.length);
};

const notWhitespace = item => (item.type !== "whitespace" ? item : undefined);

const isNextChild = (children, word, index) =>
	children.filter(notWhitespace)[index].word === word;

const notFalse = item => item !== false

const handleValkkaa = (lex, ast, item, i) => {
	const children = untilNextKeyword(lex, i + 1, [
		"NIINKU",
		"VITTU"
	]);
	ast.push({
		word: item.word,
		modifiers: [
			isNextChild(children, "NIINKU", 0) && {
				word: "NIINKU",
				modifiers: [
					isNextChild(children, "VITTU", 1) && {
						word: "VITTU",
						modifiers: []
					}
				].filter(notFalse)
			}
		].filter(notFalse),
		parameters: children.filter(child => child.type === 'identifier')
	});
};

const handleTost = (lex, ast, item, i) => {
	const children = untilNextKeyword(lex, i + 1, [
		"NIINKU"
	]);
	const params = [];
	const ik = children.filter(child => child.type === 'identifier' || child.type === 'keyword');
	ik.forEach((child, i) => {
		if (child.type === 'identifier') {
			if (ik[i + 1] && ik[i + 2] && ik[i + 1].word === 'NIINKU')
				params.push({
					...child,
					modifiers: [{
						word: 'NIINKU',
						type: 'keyword',
						parameters: [{
							...ik[i + 2]
						}]
					}]
				})
			else if (ik[i - 1] && ik[i - 1].word !== 'NIINKU')
				params.push({
					...child,
					modifiers: []
				})
			else if(ik.length === 1)
				params.push({
					...child,
					modifiers: []
				})
		}
	});
	ast.push({
		word: item.word,
		modifiers: [
		],
		parameters: params
	});
};


const getAst = lex => {
	let ast = [];
	let operation;
	for (var i = 0; i < lex.length; i++) {
		const item = lex[i];
		switch (item.word) {
			case "VALKKAA":
				handleValkkaa(lex, ast, item, i);
				break;
			case "TOST":
				handleTost(lex, ast, item, i);
				break;
		}
	}
	return ast;
};
exports.getAst = getAst;