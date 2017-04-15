'use strict';

module.exports = class Cell {
	constructor(text, width, vertSeparator) {
		this._text = text || '';
		this._width = width || text.length;
		this._vertSeparator = vertSeparator || '|';

		this._checkWidth(width);

	}

	get width() {
		return this._width;
	}

	get text() {
		return this._text;
	}

	get textLength() {
		return this._text.length;
	}

	set width(width) {
		this._checkWidth(width);
	}

	draw() {
		let spacing = this._countSpacing();
		let cell = '';
		cell = this._text + new Array(spacing).join(' ') + this._vertSeparator;
		
		return cell;		
	}

	_checkWidth(width) {
		if (width < this._text.length) {
			this._width = this._text.length;
		} else {
			this._width = width;
		}
	}

	_countSpacing() {
		let spacing = 0;
		spacing = this._width - this._text.length;

		return spacing;
	}
};