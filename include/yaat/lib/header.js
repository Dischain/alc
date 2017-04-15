'use strict';

const Row = require('./row.js');
const Cell = require('./cell.js');

module.exports = class Header extends Row {

	constructor() {
		super();

		if (arguments.length > 0) {
			let args = Array.from(arguments);
			args.map((cell) => {
				this._cells.push(new Cell(cell, 0));
			});
		}
	}

	draw() {
		var row = super.bottomEdge + '\n' + super.draw();
		return row;
	}
};