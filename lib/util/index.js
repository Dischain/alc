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

exports.getFiles = function(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, items) => {
            if (err) {
                return reject(err);
            } else {
                resolve(items);
            }
        });
    });
}

/**
 * @param {String} path - path to file or directory
 * @returns {Promise} - promise, which resolves file stats containing
 *                      the file extension and it path
 */
exports.getStat = function(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stat) => {
            if (err) {
                return reject(err);
            } else {
                stat.path = path;
                stat.extension = path.split('.').slice(-1)[0];
                resolve(stat);
            }
        });
    });
}

exports.rmDir = function(dir) {
    return new Promise((resolve, reject) => {
        fs.rmdir(dir, (err) => {
            if (err) {
                return reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.unlinkFile = function(file) {
    return new Promise((resolve, reject) => {
        fs.unlink(file, (err) => {
            if (err) {
                return reject(err);
            } else {
                resolve();
            }
        });
    });
}

exports.mkDir = function(file) {
    return new Promise((resolve, reject) => {
        fs.mkdir(file, (err) => {
            if (err) {
                return reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * @param {String} path to file to be created
 * @returns {Promise} promise to create an empty file if not exists
 */
exports.touch = function(file) {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, '', (err) => {
            if (err) {
                return reject(err);
            } else {
                resolve();
            }
        });
    });
}