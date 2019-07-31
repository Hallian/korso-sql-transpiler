const queryExp = `
VALKKAA NIINKU VITTU etunimi, sukunimi
TOST velkalistast NIINKU massit
TIETSÄ MISS sukunimi ON VÄHÄ NIINKU Â´joki%Â´
  JA TIETSÄ velka ON NIINKU AINASKI SAATANASTI()
MUT VAA 10
JA NIINKU JÄRJESTYKSES velka YLÃ–S;
`;
// const queryExp = `
// PAA VITTU NY jemmaan
// NÄÄ VITUN (Â´olutpullotÂ´, Â´röökitÂ´, Â´tussitÂ´ )
// `;

const whitespace = [..." \n"];
const puctuation = ",;";

const keywords = `ON AINASKI VÄHÄ SAATANASTI() VALKKAA NIINKU TOST MISS JA NIINKO JÄRJESTYKSES YLÃ–S ALAS MUT VAA PAA VITTU SIT NY NÄÄ VITUN TIETSÄ VALKKAA...`.split(
	" "
);

const getType = word => {
	if (word.startsWith("Â´") && word.endsWith("Â´")) return "string-literal";
	else if (parseFloat(word) == word) return "number-literal";
	else if (word === ",") return "comma";
	else return keywords.includes(word) ? "keyword" : "identifier";
};

const getLex = query => {
	let lex = [];
	let word = "";
	for (var i = 0; i < query.length; i++) {
		const char = query.charAt(i);
		if (puctuation.includes(char)) {
			lex.push({
				word,
				type: getType(word)
			});
			lex.push({
				word: char,
				type: "punctuation"
			});
			word = "";
		} else if (!whitespace.includes(char)) word += char;
		else if (whitespace.includes(char)) {
			lex.push({
				word,
				type: getType(word)
			});
			lex.push({
				word: char,
				type: "whitespace"
			});
			word = "";
		}
	}
	return lex;
};

const untilNextKeyword = (lex, start, allowed) => {
	for (var i = start; i < lex.length; i++) {
		const item = lex[i];
		if (item.type === "keyword" && !allowed.includes(item.word))
			return lex.slice(start, i);
	}
};

const notWhitespace = item => (item.type !== "whitespace" ? item : undefined);

const getAst = lex => {
	let ast = [];
	let operation;
	for (var i = 0; i < lex.length; i++) {
		const item = lex[i];
		switch (item.word) {
			case "VALKKAA":
				ast.push({
					name: item.word,
					caseSensitive: false,
					distinct: false,
					parameters: untilNextKeyword(lex, i + 1, [
						"NIINKU",
						"VITTU"
					])
				});
				break;
			case "TOST":
				ast.push({
					name: item.word,
					parameters: untilNextKeyword(lex, i + 1, ["NIINKU"]).filter(
						notWhitespace
					)
				});
				break;
			case "TIETSÄ":
				ast.push({
					name: item.word,
					parameters: untilNextKeyword(lex, i + 1, [
						"MISS",
						"ON",
						"VÄHÄ",
						"NIINKU",
						"AINASKI",
						"SAATANASTI()"
					]).filter(notWhitespace)
				});
				break;
			case "JA":
				ast.push({
					name: item.word,
					parameters: untilNextKeyword(lex, i + 1, [
						"NIINKU",
						"JÄRJESTYKSES"
					]).filter(notWhitespace)
				});
				break;
			case "MUT":
				ast.push({
					name: item.word,
					parameters: untilNextKeyword(lex, i + 1, ["VAA"]).filter(
						notWhitespace
					)
				});
				break;
		}
	}
	return ast;
};

const ipw = param => ['identifier' ,'punctuation' ,'whitespace'].includes(param.type);

const transform = ast => {
	let transform = [];
	for (let i = 0; i < ast.length; i++) {
		const item = ast[i];
		switch (item.name) {
			case "VALKKAA":
				transform.push({
					word: "SELECT",
					type: "keyword"
				});
				if (
					item.parameters.filter(param => param.word === "NIINKU")
						.length
				)
					transform.push({
						word: "DISTINCT",
						type: "keyword"
					});
				item.parameters.filter(ipw).forEach(item => transform.push(item))
				break;
			case "TOST":
				transform.push({
					word: "FROM",
					type: "keyword"
				});
				if (
					item.parameters.filter(param => param.word === "NIINKU")
						.length
				)
				item.parameters.filter(ipw).forEach(item => transform.push(item))
		}
	}
	return transform;
};

// console.log(JSON.stringify(getAst(getLex(queryExp)), null, 2));
// console.log(transform(getAst(getLex(queryExp))));
// console.log(getLex(queryExp));
// console.log(getLex(queryExp).map(obj => obj.word).join(''));
console.log(
	transform(getAst(getLex(queryExp)))
		.map(obj => obj.word)
		.join(" ")
);
