#!/usr/bin/env node

const cli = require('./lib/cli');
const isFileSync = require('./lib/util').isFileSync;

const countLinesRecursively = require('./lib/counter').countLinesRecursively;
const countLines = require('./lib/counter').countLines;
const countAtSingleFile = require('./lib/counter').countAtSingleFile;

cli.processInput(process.argv, console.log);

const args = cli.getConsoleArgs(process.argv, console.log);
const targetPath = args.targetPath;
if (targetPath && !args.error) {
    if (isFileSync(targetPath)) {
        countAtSingleFile(targetPath).then((result) => {
            cli.printResult(result, console.log);
            process.exit(0);
        });
    } else {
        countLinesRecursively(targetPath, args).then((result) => {
            cli.printResult(result, console.log);
        });
    }

} else {
    console.log('exit with error');
    process.exit(1);
}