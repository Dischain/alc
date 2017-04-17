'use strict';

const fs = require('fs');
const path = require('path');

const Table = require('../../include/yaat').Table;
const Row = require('../../include/yaat').Row;
const Header = require('../../include/yaat').Header;

const util = require('../util');

const cliFlagsPath = path.join(process.cwd(), './lib/cli/cli-flags.json');
let cliFlagsString;
let cliFlags;

function init() {
	cliFlagsString = fs.readFileSync(cliFlagsPath).toString();
	cliFlags = JSON.parse(cliFlagsString);
}

function getTargetPath(args) {
	return args[getLastElIndex(args)];
}

function getLastElIndex(arr) {
	return arr.length - 1;
}

function getRange(arr, from, to) {
	return arr.slice(from ,to);
}

function getExts(args, extFlagIndex, dirFlagIndex) {
	if (dirFlagIndex) {
		if (extFlagIndex < dirFlagIndex) {
			return getRange(args, extFlagIndex + 1, dirFlagIndex);
		} else {
			return getRange(args, extFlagIndex + 1, getLastElIndex(args));
		}
	} else {
		return getRange(args, extFlagIndex + 1, getLastElIndex(args));
	}
}

function getDirs(args, extFlagIndex, dirFlagIndex) {
	if (extFlagIndex) {
		if (extFlagIndex > dirFlagIndex) {
			return getRange(args, dirFlagIndex + 1, extFlagIndex);
		} else {
			return getRange(args, dirFlagIndex + 1, getLastElIndex(args));
		}	
	} else {
		return getRange(args, dirFlagIndex + 1, getLastElIndex(args));		
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
	} else if (!validateFlags(args)) {
		printError(cb);
	}
}

function printError(cb) {
	let errorMessage = 'alc: invalid flags'; 
	cb(errorMessage);
	process.exit(1) // TODO: make process handling outside this module.
}

function validateFlags(args) {
	const arrOfArgs = args;

	let isValid = false;

	arrOfArgs.forEach((element, index) => {
		if (element.startsWith('-') && index != getLastElIndex(arrOfArgs)) {
			for (let key in cliFlags) {
				if (cliFlags[key].flag == element) {
					isValid = true;
				} 
			}
		}
	});

	return isValid;
}

function checkMissingArguments(extFlagIndex, dirFlagIndex, lastIndex, cb) {
	if (Math.abs(extFlagIndex - dirFlagIndex) == 1
		|| Math.abs(lastIndex - extFlagIndex) == 1
		|| Math.abs(lastIndex - dirFlagIndex) == 1) {

		cb('alc: missing arguments');
		process.exit(1); // TODO: make process handling outside this module.
	}
}

function checkPathExists(path) {

}

function getConsoleArgs(args, cb) {
	let extFlagIndex = args.indexOf(cliFlags.ignoreExt.flag);
	let dirFlagIndex = args.indexOf(cliFlags.ignoreDir.flag);
	let targetPath = getTargetPath(args);

	checkMissingArguments(extFlagIndex, dirFlagIndex, getLastElIndex(args), cb);

	if (extFlagIndex != -1 && dirFlagIndex != -1) {
		return {
			ingoredExts: getExts(args, extFlagIndex, dirFlagIndex),
			ignoredDirs: getDirs(args, extFlagIndex, dirFlagIndex),
			targetPath: targetPath
		};
	}

	else if (dirFlagIndex == -1 && extFlagIndex != -1) {
		return {
			ingoredExts: getExts(args, extFlagIndex),
			targetPath: targetPath
		};
	} 

	else if (extFlagIndex == -1 && dirFlagIndex != -1) {
		return {
			ignoredDirs: getDirs(args, undefined, dirFlagIndex),
			targetPath: targetPath
		};
	}

	else if (extFlagIndex == -1 && dirFlagIndex == -1 && targetPath) {
		return {
			targetPath: targetPath
		};
	}

	else {
		cb('alc: missing operand\n'
			+ 'Try alc ' + cliFlags.help.flag);

		return {
			error: 1
		};
	}
}

function printHelp(cb) {
	cb(getHelpMessage());
	process.exit(0); // TODO: make process handling outside this module.
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
	getConsoleArgs: getConsoleArgs,
};