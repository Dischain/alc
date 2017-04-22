'use strict';

const fs = require('fs');
const path = require('path');

const getStat = require('../util').getStat;
const getFiles = require('../util').getFiles;
const getExtension = require('../util').getExtension;
const EOL = require('./constants.js').EOL;

let result = {
	totalLines: 0,
	totalFiles: 0,
	totalFolders: 0,
	extensions: {}
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

function countLinesRecursively(dir, excludings) {
	return getFiles(dir)
		.then((files) => {
			if (!excludings) {
				return files;
			}
			let filtered = files.filter((file) => {
				let notExclude = true;
				excludings.ignoredExts.forEach((ext) => {
					if (ext == getExtension(file)/*file.split('.').slice(-1)[0]*/) {
						notExclude = false; 
					}
				});
				excludings.ignoredDirs.forEach((ignoredDir) => {
					if (ignoredDir == file) {
						notExclude = false;
					}
				});
				return notExclude;
			});
			return filtered;
		})
		.then((files) => {
			return files.map((file) => {
				return getStat(path.join(dir, file));
			});
		})
		.then((statPromises) => {
			return Promise.all(statPromises.map((statPromise) => {
				return statPromise.then((stat) => {
					if (stat.isDirectory()) {
						result.totalFolders ++;
						return countLinesRecursively(stat.path, excludings);
					} else {
						return countLines(stat.path)
							.then((lines) => {
								result.totalLines += lines; 
								result.totalFiles ++;
								if (!result.extensions[stat.extension]) {
									result.extensions[stat.extension] = {
										lines: lines,
										files: 1
									}
								} else {
									result.extensions[stat.extension].lines += lines;
									result.extensions[stat.extension].files ++;
								}
							});
					}
				})
			}))
		})
		.then(() => { return result; });
}

function countAtSingleFile(file) {
	return countLines(file).then((lines) => {
            const extension = getExtension(file)
            let result = {}, info = {};
            info[extension] = {files : 1, lines: lines}
            result.extensions = info;

            result.totalLines = lines;
            result.totalFiles = 1;
            result.totalFolders = 0;
            return result;
        });
}

exports.countLinesRecursively = countLinesRecursively;
exports.countLines = countLines;
exports.countAtSingleFile = countAtSingleFile;