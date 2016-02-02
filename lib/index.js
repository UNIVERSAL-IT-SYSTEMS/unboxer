'use strict';

var onmls = require('onml/lib/stringify');

module.exports = function (assets) {
    var moves = assets.moves;
    var root = document.getElementById('content');
    root.innerHTML = onmls(assets.template);

    Object.keys(moves).forEach(function (e) {
        var el = document.getElementById('_' + e);
        el.addEventListener('click', (function (name) {
            var dir = 1;
            var scale = 0;
            var origin = el.getAttribute('transform').split(/[(),]/);
            var delta = moves[name];
            var inter = setInterval(function () {
                if (dir === 1) {
                    if (scale < 0.9) {
                        scale += 0.1;
                    } else {
                        scale = 1;
                    }
                } else {
                    if (scale > 0.1) {
                        scale -= 0.1;
                    } else {
                        scale = 0;
                    }
                }
                // el.setAttribute('transform', 'translate(' + origin[1] + ',' + origin[2] + ')');
                el.setAttribute(
                    'transform', 'translate(' +
                    (Number(origin[1]) - scale * delta[0]) +
                    ',' +
                    (Number(origin[2]) - scale * delta[1]) +
                    ')'
                );
            }, 100);
            return function () {
                console.log(scale);
                if (dir === 0) {
                    dir = 1;
                } else {
                    dir = 0;
                }
            };
        })(e));
    });
};
