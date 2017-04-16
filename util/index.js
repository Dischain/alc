'use strict';

const fs = require('fs');

exports.readFile = function (path) {
	return new Promise((resolve, reject) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				reject(err);
			} else {
				 resolve(data.toString());
			}
		})
	})
}