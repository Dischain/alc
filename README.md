# alc

[alc](https://github.com/Dischain/alc) is asynchronous recursive line counter on [Node.js](https://nodejs.org).

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

in this project directorie, you should see the output in your console:

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