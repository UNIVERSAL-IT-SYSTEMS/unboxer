#!/usr/bin/env node
'use strict';

var fs = require('fs'),
    path =require('path'),
    yargs = require('yargs'),
    onml = require('onml');

var argv = yargs.argv;

function assets (ml) {
    var res = [];
    onml.traverse(ml, {
        enter: function (node) {
            if (node.attr.id && node.attr.id.match(/mv\-/)) {
                res.push(node.full);
                this.skip();
            }
        }
    });
    return res;
}

function f2o (name, cb) {
    var full, ml;
    full = path.resolve(process.cwd(), name);
    fs.readFile(full, { encoding: 'utf8'}, function (err, dat) {
        if (err) {
            throw err;
        }
        ml = onml.parse(dat);
        ml = assets(ml)
        cb(ml);
    });
}

if (typeof argv.i === 'string') {
    f2o(argv.i, console.log);
}
