const { getLex } = require("./korso-lex");
const { getAst } = require("./korso-ast");
const { transform } = require("./korso-transform");

exports.getLex = getLex;
exports.getAst = getAst;
exports.astToSql = transform;
exports.transform = query => transform(getAst(getLex(query))).join(' ');
