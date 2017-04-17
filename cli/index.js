'use strict';

const fs = require('fs');
const path = require('path');

const Table = require('../include/yaat').Table;
const Row = require('../include/yaat').Row;
const Header = require('../include/yaat').Header;

const cliFlagsPath = path.join(__dirname, './cli-flags.json');
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
	if (dirFlagIndex) {
		if (extFlagIndex < dirFlagIndex) {
			return getRange(args, extFlagIndex + 1, dirFlagIndex);
		} else {
			return getRange(args, extFlagIndex + 1, getLastElIndex(args) - 1);
		}
	} else {
		console.log('only exts');
		return getRange(args, extFlagIndex + 1, getLastElIndex(args) - 1);
	}
}

function getDirs(args, extFlagIndex, dirFlagIndex) {
	if (extFlagIndex) {
		if (extFlagIndex > dirFlagIndex) {
			return getRange(args, dirFlagIndex + 1, extFlagIndex);
		} else {
			return getRange(args, dirFlagIndex + 1, getLastElIndex(args) - 1);
		}	
	} else {
		console.log('only dirs');
		return getRange(args, dirFlagIndex + 1, getLastElIndex(args) - 1);		
	}
}

function getHelpMessage() {
	let helpMsg ='';
	let ignoreExtDesc = cliFlags.ignoreExt.flag 
					+ ', ' 
					+ cliFlags.ignoreExt.params 
					+ '  ' 
					+ cliFlags.ignoreExt.description;

	let ignoredDirsDesc = cliFlags.ignoreDir.flag 
					+ ', ' 
					+ cliFlags.ignoreDir.params 
					+ '  ' 
					+ cliFlags.ignoreDir.description;

	let helpDesc = cliFlags.help.flag
					+ ', '
					+ cliFlags.help.description;

	helpMsg += cliFlags.usage;
	helpMsg += cliFlags.description;

	helpMsg += ignoreExtDesc;
	helpMsg += ignoredDirsDesc;
	helpMsg += helpDesc;

	helpMsg += cliFlags.info;

	return helpMsg;
}

function processInput(args, cb) {
	init();

	let helpFlagIndex = args.indexOf(cliFlags.help.flag);
	
	if (helpFlagIndex == 2) {
		printHelp(cb);
	}
}

function getConsoleArgs(args) {
	let extFlagIndex = args.indexOf(cliFlags.ignoreExt.flag);
	let dirFlagIndex = args.indexOf(cliFlags.ignoreDir.flag);

	if (extFlagIndex != -1 && dirFlagIndex != -1) {
		return {
			ingoredExts: getExts(args, extFlagIndex, dirFlagIndex),
			ignoredDirs: getDirs(args, extFlagIndex, dirFlagIndex)
		};
	}

	else if (dirFlagIndex == -1 && extFlagIndex != -1) {
		return {
			ingoredExts: getExts(args, extFlagIndex)
		};
	} 

	else if (extFlagIndex == -1 && dirFlagIndex != -1) {
		return {
			ignoredDirs: getDirs(args, undefined, dirFlagIndex)
		};
	}

	else {
		console.log('alc: missing operand\n'
			+ 'Try alc ' + cliFlags.help.flag);
	}
}

function printHelp(cb) {
	cb(getHelpMessage());
}

function printResult(resultObj, cb) {
	let table = new Table();
	let header = new Header('extension', 'files', 'lines');
	table.setHeader(header);

	let rows = resultObj.map((obj) => {
		let row = new Row(obj.ext, obj.files, obj.lines);
		return row;
	});

	rows.forEach((row) => {
		table.addRow(row);
	});

	cb(table.draw());
}

module.exports = {
	processInput: processInput,
	printResult: printResult,
	getConsoleArgs: getConsoleArgs
};

//TODO:
//- add error in input handling