/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Oskar Homburg
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/*global require, module, exports */
var
    canvas, ctx, id,
    grid = require('./grid'),
    generator = require('./generator');

function windowResize() {
    console.log('window resize');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function tick() {
    id = requestAnimationFrame(tick);
    render();
}

window.game = {};

window.game.stop = function () {
    cancelAnimationFrame(id);
};

window.game.grid = grid;

window.game.generator = generator;

var
    lineLength = 30;

function render() {
    ctx.beginPath();
    var cells = grid.cells();
    for (var i = 0; i < cells.length; i++) {
        var c = cells[i];
        var x1 = c.x * lineLength,
            x2 = (c.x + 1) * lineLength,
            y1 = c.y * lineLength,
            y2 = (c.y + 1) * lineLength;
        if (!c.up) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1);
        }
        if (!c.down) {
            ctx.moveTo(x1, y2);
            ctx.lineTo(x2, y2);
        }
        if (!c.left) {
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y2);
        }
        if (!c.right) {
            ctx.moveTo(x2, y1);
            ctx.lineTo(x2, y2);
        }
    }
    ctx.stroke();
}

function entrypoint() {
    canvas = document.getElementById('game-canvas');
    window.addEventListener('resize', windowResize, false);
    windowResize();
    ctx = canvas.getContext('2d');
    grid.clear();
    generator.run();
    tick();
}

if (document.readyState === 'interactive') {
    entrypoint();
} else {
    document.addEventListener('DOMContentLoaded', entrypoint);
}
