const ipw = param =>
	["identifier", "punctuation", "whitespace"].includes(param.type);

const hasModifier = (item, name) =>
	item.modifiers.filter(mod => mod.word === name);

const getModifierAtIndex = (item, index, word) => {
	if (item.modifiers[index] && item.modifiers[index].word === word)
		return item.modifiers[index];
};

const handleValkkaa = (transform, ast, item, i) => {
	let text = "SELECT ";
	if (getModifierAtIndex(item, 0, "NIINKU")) {
		text += "DISTINCT ";
		if (
			getModifierAtIndex(
				getModifierAtIndex(item, 0, "NIINKU"),
				0,
				"VITTU"
			)
		) {
			text += item.parameters.map(param => param.word).join(", ");
		} else {
			text += item.parameters
				.map(param => `lower(${param.word})`)
				.join(", ");
		}
	} else {
		text += item.parameters.map(param => param.word).join(", ");
	}
	transform.push(text);
};

const handleTost = (transform, ast, item, i) => {
	let text = "FROM ";
	text += item.parameters
		.map(
			param =>
				`${param.word}${param.modifiers.map(
					mod =>
						` ${mod.word === "NIINKU" ? "AS" : mod.word} ${
							mod.parameters[0].word
						}`
				)}`
		)
		.join(", ");

	transform.push(text);
};

const transform = ast => {
	let transform = [];
	for (let i = 0; i < ast.length; i++) {
		const item = ast[i];
		const itemBefore = ast[i - 1] || false;
		switch (item.word) {
			case "VALKKAA":
				handleValkkaa(transform, ast, item, i);
				break;
			case "TOST":
				handleTost(transform, ast, item, i);
				break;
		}
	}
	return transform;
};

exports.transform = transform;
