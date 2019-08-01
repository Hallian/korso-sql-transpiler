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
			if (word.length) lex.push({
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
			if (word.length) lex.push({
				word,
				type: getType(word)
			});
	return lex;
};
exports.getLex = getLex;