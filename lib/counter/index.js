'use strict';

const fs = require('fs');

const EOL = require('./constants.js').EOL;

function countLines(file) {
	return new Promise((resolve, reject) => {
		let totalLines = 0;

		fs.createReadStream(file)
			.on('data', (chunk) => {
				chunk.forEach((symbol, index) => {
					if (symbol == EOL
						|| (index == chunk.length - 1 
							&& symbol != EOL)) {
						totalLines ++;
					} 

				});
				resolve(totalLines);
			})
			.on('error', (err) => {
				reject(err);
			});
	});
}

countLines('constants.js').then((lines) => {
	console.log(lines);
})