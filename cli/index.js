'use strict';

const fs = require('fs');

const cliFlagsPath = './cli-flags.js';
let cliFlagsString;
let cliFlags;

function init() {
	cliFlagsString = fs.readFileSync(cliFlagsPath).toString();
	cliFlags = JSON.parse(cliFlagsString);
}

function getTargetPath(args) {
	return getLastElIndex(args)[0];
}

function getLastElIndex(arr) {
	return arr.length;
}

function getRange(arr, from, to) {
	return arr.slice(from ,to);
}

function getExts(args, extFlagIndex, dirFlagIndex) {
	if (extFlagIndex < dirFlagIndex) {
		return getRange(args, extFlagIndex + 1, dirFlagIndex);
	} else {
		return getRange(args, extFlagIndex + 1, getLastElIndex(args));
	}
}

function getDirs(args, extFlagIndex, dirFlagIndex) {
	if (extFlagIndex > dirFlagIndex) {
		return getRange(args, dirFlagIndex + 1, extFlagIndex);
	} else {
		console.log(dirFlagIndex + 1 + ' ' + getLastElIndex(args));
		return getRange(args, dirFlagIndex + 1, getLastElIndex(args));
	}	
}

function processInput() {
	init();

	let args = process.argv;

	let extFlagIndex = args.indexOf(cliFlags.ignoreExt.flag);
	let dirFlagIndex = args.indexOf(cliFlags.ignoreDir.flag);
	let helpFlagIndex = args.indexOf(cliFlags.help.flag);

	if (args.length <= 2) {
		console.log(args[1] + ': missing operand\n'
			+ 'Try ' + args[1] + ' ' + cliFlags.help.flag);
	}

	else if (extFlagIndex != -1 && dirFlagIndex != -1) {
		return {
			ingoredExts: getExts(args, extFlagIndex, dirFlagIndex),
			ignoredDirs: getDirs(args, extFlagIndex, dirFlagIndex)
		};
	}

	console.log(extFlagIndex + ' ' + dirFlagIndex + ' ' + helpFlagIndex);
	console.log(getExts(args, extFlagIndex, dirFlagIndex));
}

console.log(processInput());

nodejs index.js -e d df d -d ff f ./

//module.exports = processInput;