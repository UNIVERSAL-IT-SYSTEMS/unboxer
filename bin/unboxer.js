#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    path =require('path'),
    yargs = require('yargs'),
    browserify = require('browserify'),
    jsof = require('jsof'),
    onml = require('onml');

var argv = yargs.argv;

function assets (ml) {
    var name, d, type, res = {};
    onml.traverse(ml, {
        enter: function (node) {
            if (node.attr.id && node.attr.id.match(/mv\-/)) {
                name = node.attr.id.slice(3);
                d = node.attr.d.split(' ');
                type = d.shift();
                d = d.map(function (e) {
                    return e.split(',').map(function (e) {
                        return Number(e);
                    });
                });
                if (type === 'm') {
                    res[name] = { dx: d[1][0], dy: d[1][1] };
                } else {
                    throw 'unknown path type: ' + node.attr.d;
                }
                this.remove();
            }
        }
    });
    return jsof.s(res);
}

function f2o (name, cb) {
    var full, ml, res;
    full = path.resolve(process.cwd(), name);
    fs.readFile(full, { encoding: 'utf8'}, function (err, dat) {
        if (err) {
            throw err;
        }
        ml = onml.parse(dat);
        res = `
'use strict';
var unboxer = require('../lib');
var assets = {
moves: ${assets(ml)},
template: ${jsof.s(ml)}
};
unboxer(assets);
`;
        cb(res);
    });
}

if (typeof argv.i === 'string') {
    f2o(argv.i, console.log);
}
