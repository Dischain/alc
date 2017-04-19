'use strict';

const fs = require('fs');
const path = require('path');

const getStat = require('../util').getStat;
const getFiles = require('../util').getFiles;
const EOL = require('./constants.js').EOL;

let result = {
	totalLines: 0,
	totalFiles: 0,
	totalByExtensions: [];
}

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

function countLinesRecursive(dir, excludings) {
	return getFiles(dir)
		.then((files) => {
			files.filter((file) => {
				let exclude = false;
				excludings.ignoredExts.forEach((ext) => {
					if (ext == file.split('.').slice(-1)[0]) {
						exclude = true;
					}
				});
				excludings.ignoredDirs.forEach((ignoredDir) => {
					if (ignoredDir == file) {
						exclude = true;
					}
				});
				return exclude;
			});
		})
		.then((files) => {
			return files.map((file) => {
				return getStat(path.join(dir, file));
			});
		})
		.then((statPromises) => {
			Promise.all(statPromises.map((statPromise) => {
				statPromise.then((stat) => {
					if (stat.isDirectory()) {
						return countLinesRecursive(stat.path, excludings);
					} else {
						return countLines(stat.path)
							.then((lines) => {
								result.totalLines += lines;
								result.totalFiles ++;
							});
					}
				})
			}))
		})
		.then(() => result);
}