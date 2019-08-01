# KorsoSQL Transpiler

[![Build Status](https://travis-ci.org/Hallian/korso-sql-transpiler.svg?branch=master)](https://travis-ci.org/Hallian/korso-sql-transpiler)

NodeJS transpiler for the world famous [KorsoSQL dialect of SQL](https://janit.iki.fi/shit/korsosql.html).

## Usage

```javascript
const korso = require('korso-sql-transpiler');
console.log(korso.transform('VALKKAA NIINKU VITTU etunimi, sukunimi TOST velkalistast'));
// Output: SELECT DISTINCT etunimi, sukunimi FROM velkalistast
```

## Spec compliance

At the moment `VALKKAA` and `TOST` keywords should be fully supported along with their modifiers.

## Tested

All supported keywords should be tested and the target for coverage is 100%.