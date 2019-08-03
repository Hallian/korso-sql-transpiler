import korso from '..';
import './index.css';
import { makeTable } from './table';

var db = openDatabase("korso", "1.0", "KorsoSQL Example database", 2 * 1024 * 1024);

db.transaction(function(tx) {
	[
		"CREATE TABLE IF NOT EXISTS velkalistast (iidee unique, jabaNimi, paljo)",
		'INSERT INTO velkalistast (iidee, jabaNimi, paljo) VALUES (1, "keijo", 130)',
		'INSERT INTO velkalistast (iidee, jabaNimi, paljo) VALUES (2, "Leiffii", 40)',
		'INSERT INTO velkalistast (iidee, jabaNimi, paljo) VALUES (3, "leiffii", 320)',
		'INSERT INTO velkalistast (iidee, jabaNimi, paljo) VALUES (4, "sauli", 70)',
		'INSERT INTO velkalistast (iidee, jabaNimi, paljo) VALUES (5, "simo", 70)',
		'INSERT INTO velkalistast (iidee, jabaNimi, paljo) VALUES (6, "Simo", 70)'
	].forEach(query => tx.executeSql(query))
});

function runQuery() {
	const value = document.getElementById("query").value;
	db.transaction(function(tx) {
		tx.executeSql(
			korso.transform(value),
			[],
			function(tx, results) {
				const table = makeTable(results.rows);
				if (status.children[0]) status.replaceChild(table, status.children[0])
				else status.appendChild(table)
			},
			null
		);
	});
}

const body = document.querySelector("body");
const status = document.createElement("div");
const textarea = document.createElement("textarea");
const button = document.createElement("button");
const queryBar = document.createElement("div");
queryBar.id = "query-bar";
status.id = "status";
textarea.id = "query";
textarea.textContent='VALKKAA NIINKU VITTU jabaNimi TOST velkalistast'
button.innerText = "run";
button.id = "run";
button.addEventListener("click", () => runQuery());
queryBar.appendChild(textarea);
queryBar.appendChild(button);
body.appendChild(queryBar);
body.appendChild(status);