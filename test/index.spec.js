const { getLex } = require("../src/korso-lex");
const { getAst } = require("../src/korso-ast");
const { transform } = require("../src/korso-transform");

describe("KorsoSQL AST", () => {
	const test = (query, expected) =>
		it(query, () => {
			expect.assertions(1);
			const ast = getAst(getLex(query));
			expect(ast).toEqual(expected);
		});

	test("VALKKAA NIINKU VITTU etunimi, sukunimi", [
		{
			word: "VALKKAA",
			modifiers: [
				{
					word: "NIINKU",
					modifiers: [
						{
							word: "VITTU",
							modifiers: []
						}
					]
				}
			],
			parameters: [
				{
					word: "etunimi",
					type: "identifier"
				},
				{
					word: "sukunimi",
					type: "identifier"
				}
			]
		}
	]);
	test("TOST velkalistast NIINKU massit, lompsa NIINKU sossu, jemma", [
		{
			word: "TOST",
			modifiers: [],
			parameters: [
				{
					word: "velkalistast",
					type: "identifier",
					modifiers: [
						{
							word: "NIINKU",
							type: "keyword",
							parameters: [
								{
									word: "massit",
									type: "identifier"
								}
							]
						}
					]
				},
				{
					word: "lompsa",
					type: "identifier",
					modifiers: [
						{
							word: "NIINKU",
							type: "keyword",
							parameters: [
								{
									word: "sossu",
									type: "identifier"
								}
							]
						}
					]
				},
				{
					word: "jemma",
					type: "identifier",
					modifiers: []
				}
			]
		}
	]);
});

describe("KorsoSQL Transform", () => {
	const test = (query, expected) =>
		it(`${query} -> ${expected}`, () => {
			expect.assertions(1);
			const ast = getAst(getLex(query));
			const sql = transform(ast).join(" ");
			expect(sql).toEqual(expected);
		});

	test(
		"VALKKAA NIINKU etunimi, sukunimi",
		"SELECT DISTINCT lower(etunimi), lower(sukunimi)"
	);
	test(
		"VALKKAA NIINKU VITTU etunimi, sukunimi",
		"SELECT DISTINCT etunimi, sukunimi"
	);
	test("VALKKAA etunimi, sukunimi", "SELECT etunimi, sukunimi");

	test("TOST velkalistast", "FROM velkalistast");
	test("TOST velkalistast NIINKU massit", "FROM velkalistast AS massit");
	test(
		"TOST velkalistast NIINKU massit, lompsa NIINKU sossu, jemma",
		"FROM velkalistast AS massit, lompsa AS sossu, jemma"
	);
});
