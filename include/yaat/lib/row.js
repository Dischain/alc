'use strict';

const Cell = require('./cell.js');

module.exports = class Row {
	constructor() {
		this._cells = [];

		if (arguments.length > 0) {
			let args = Array.from(arguments);
			args.map((cell) => {
				this._cells.push(new Cell(cell, 0));
			});
		}
		
		this._vertSeparator = '|';
		this._rowWidth = 0;
	}

	get cellsCount() {
		return this._cells.length;
	}

	get cellsWidthes() {
		let cellWidthes = this._cells.map((cell) => {
			return cell.width;
		});
		return cellWidthes;
	}

	get cells() {
		return this._cells;
	}

	get content() {
		let content = this._cells.reduce((init, cell) => {
			return init += cell.draw();
		}, this._vertSeparator);
		return content;
	}

	get bottomEdge() {
		let line = new Array(this.content.length + 1).join('-');

		return line;
	}

	get width() {
		this._rowWidth = this._cells.reduce((init, cell) => {
			// Plus one for file separator, not accounted in Cell
			return init += cell.width + 1; 
		}, 0);

		return this._rowWidth;
	}

	getCellById(cellId) {
		return this._cells[cellId];
	}

	resizeCell(cellId, size) {
		if (size > this.getCellById(cellId).text.length) {
			this._cells[cellId].width = size;
		} else {
			throw new Error('New size could not be lesser then current '
				+ 'text length in the cell');
		}
	}

	addCell(cell) {
		this._cells.push(cell);
	}

	draw() {
		return this.content + '\n' + this.bottomEdge + '\n';
	}
};