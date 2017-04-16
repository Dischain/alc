#!/usr/bin/env node

const cli = require('./cli');

cli.processInput(process.argv, console.log);
console.log(cli.getConsoleArgs(process.argv));

cli.printResult([{
		ext: 'js',
		files: 12,
		lines: 10
	},
	{
		ext: 'json',
		files: 11,
		lines: 15
	}],
	console.log);