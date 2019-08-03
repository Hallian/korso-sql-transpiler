function makeTable(data) {
	const headers = getTableHeaders(data);
	const rows = getTableRows(data);
	const tableEl = document.createElement('table');
	const thead = document.createElement('thead');
	const theadTr = document.createElement('tr');
	const tbody = document.createElement('tbody');
	const tfoot = document.createElement('tfoot');
	const headerEls = headers.map(head => {
		const el = document.createElement('th');
		el.innerHTML = head;
		return el;
	})
	const rowEls = rows.map(row => {
		const rowEl = document.createElement('tr');
		const columnEls = row.map(column => {
			const el = document.createElement('td');
			el.innerHTML = column;
			rowEl.appendChild(el);
			return el;
		})
		columnEls.forEach(el => rowEl.appendChild(el));
		return rowEl;
	})
	headerEls.forEach(el => theadTr.appendChild(el));
	rowEls.forEach(el => tbody.appendChild(el));
	const countEl = document.createElement('tr');
	countEl.innerHTML = 'Found ' + rows.length + ' rows';
	thead.appendChild(theadTr)
	tableEl.appendChild(thead)
	tableEl.appendChild(tbody)
	tfoot.appendChild(countEl)
	tableEl.appendChild(tfoot)
	return tableEl;
}
exports.makeTable = makeTable;

function getTableHeaders(rows) {
	const headers = {};
	const len = rows.length;
	for (let i = 0; i < len; i++) {
		Object.keys(rows.item(i)).forEach(key => headers[key] = true)
	}
	return Object.keys(headers);
}

function getTableRows(rows) {
	const values = [];
	const len = rows.length;
	for (let i = 0; i < len; i++) {
		values.push(Object.values(rows.item(i)))
	}
	return values;
}