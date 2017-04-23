# alc

[alc](https://github.com/Dischain/alc) is an asynchronous recursive line counter on [Node.js](https://nodejs.org), based on chain of JavaScript ```Promises```.


## Quick start

### Installing

I did not published it with `npm`, so if you want to try, just clone this repo to your computer, ```cd``` to project folder and print:

```
npm install -g
```
So afterwards you would be able to run ```alc [path]``` to count total amount of lines in directorie by specific path.

### Example

So if you print something like 

```
alc -d .git ./
```

in this project directory, you should see the output in your console:

```
-----------------------
|extension|files|lines|
-----------------------
|md       |1    |28   |
-----------------------
|js       |10   |753  |
-----------------------
|json     |2    |52   |
-----------------------

total lines:       833
total files:       13
total directories: 7

```

In this example we specified a flag ```-d``` option, which should exclude all the directories with specified name (```.git```). And the last argument is the path to folder to be processed.

Or you can print something like this:

```alc -d .git -e md json ./```

and should get the output like this:

```
-----------------------
|extension|files|lines|
-----------------------
|js       |10   |753  |
-----------------------

total lines:       753
total files:       10
total directories: 7
```

There we specified ```-e```option, wich should eclude all the files with specified etensions (```md``` and ```json```)

### Options

```-d [DIRECTORY NAME]...``` - excludes the specified directories from counting. Example:

```alc -d node_modules .git ./```


```-e [EXTENSION NAME]...``` - excludes the files with specified extension from counting. Example:

```alc -e sh md ./```


```alc --help``` - should print short help information.


## Dependencies

The only dependencie this project contains is [yet-another-ascii-table](https://github.com/Dischain/yet-another-ascii-table) for printing a simple ASCII-tables with results.