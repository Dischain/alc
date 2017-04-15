'use strict';

module.exports = class Table {
	constructor() {
		//this._header;
		this._rows = [];
		this._maxCellsWidthes = [];
		this._maxCellsCount = 0;
		this._maxRowWidth = 0;
	}

	addRow(row) {
		if (!this._header) {
			throw new Error('Can not to add row into the table '
				+ 'without header');
		}

		this._checkCellsCount(row);
		this._checkCellsSizes(row);
		
		this._rows.push(row);

		this._calculateMaxRowWidth(row);
	}

	_checkCellsCount(row) {
		if (row.cells.length != this._maxCellsCount) {
			throw new Error('The amount of cells at row must '
				+ 'be equal to header cells amount');
		}
	}

	_checkCellsSizes(row) {
		for (let i = 0; i < this._maxCellsWidthes.length; i ++) {
			let curRowCell = row.cells[i].width;
			if (this._maxCellsWidthes[i] < curRowCell) {
				this._maxCellsWidthes[i] = curRowCell;
				this._resizeColumn(i, this._maxCellsWidthes[i]);
			} else if (this._maxCellsWidthes[i] > curRowCell) {
				row.resizeCell(i, this._maxCellsWidthes[i] + 1);
			}
		}
	}

	setHeader(header) {
		if (this._header) {
			throw new Error('Can not set up new header when it`s exists');
		}
		this._header = header;

		this._maxCellsWidthes = header.cells.map((cell) => {
				return cell.width;
		});

		this._maxCellsCount = header.cells.length;
		this._maxRowWidth = header.width; 
	}

	draw() {
		return this._rows.reduce((init, row) => {
			return init += row.draw();
		}, this._header.draw());
	}

	get maxCellsCount() {
		return this._maxCellsCount;
	}

	get maxCellsWidthes() {
		return this._maxCellsWidthes;
	}

	get maxRowWidth() {
		return this._maxRowWidth;
	}

	_calculateMaxCellsWidth(row) {
		for (let i = 0; i < this._maxCellsWidthes.length; i ++) {
			if (this._maxCellsWidthes[i] < row.cells[i].width)
				this._maxCellsWidthes[i] = row.cells[i].width;
		}
	}

	_calculateMaxRowWidth(row) {
		if (!this._maxRowWidth) {
			this._maxRowWidth = row.width;
		} else {
			if (row.width > this._maxRowWidth) {
				this._maxRowWidth = row.width;
			}
		}
	}

	_resizeColumn(index, size) {
		this._header.resizeCell(index, size + 1);
		this._rows.forEach((row) => {
			row.resizeCell(index, size + 1);
		});
	}
};