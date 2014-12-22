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
    canvas, ctx, id, player, time,
    grid = require('./grid'),
    generator = require('./generator'),
    keycode = require('./keycode');

function windowResize() {
    console.log('window resize');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function tick() {
    var dt = (Date.now() - time) / 1000.0;
    time = Date.now();
    if (player.moveCooldown > 0) {
        player.moveCooldown -= dt;
    } else {
        var moved = 0;
        if (keys[keycode.w] && player.getCell().up) {
            player.position.y--;
            moved = 1;
        }
        if (keys[keycode.s] && player.getCell().down) {
            player.position.y++;
            moved = 1;
        }
        if (keys[keycode.a] && player.getCell().left) {
            player.position.x--;
            moved = 1;
        }
        if (keys[keycode.d] && player.getCell().right) {
            player.position.x++;
            moved = 1;
        }
        if (moved) {
            player.moveCooldown = 0.1;
        }
    }

    render();
    id = requestAnimationFrame(tick);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(window.innerWidth / 2 - (player.position.x + 0.5) * lineLength, window.innerHeight / 2 - (player.position.y + 0.5) * lineLength);

    ctx.save();
    ctx.beginPath();
    //ctx.strokeStyle = '';
    //ctx.fillStyle = '';
    ctx.arc((player.position.x + 0.5) * lineLength, (player.position.y + 0.5) * lineLength, 5, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

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
    ctx.restore();
}

var
    keys = {};

function initPlayer() {
    game.player = player = {};
    player.moveCooldown = 1;
    player.position = {x: 0, y: 0};

    player.getCell = function () {
        return grid.getCellAt(player.position.x, player.position.y);
    };

    window.addEventListener('keydown', function (e) {
        keys[e.which] = true;
    });

    window.addEventListener('keyup', function (e) {
        keys[e.which] = false;
    });
}

function entrypoint() {
    canvas = document.getElementById('game-canvas');
    window.addEventListener('resize', windowResize, false);
    initPlayer();
    windowResize();
    ctx = canvas.getContext('2d');
    grid.clear();
    grid.makeChunk(0, 0);
    generator.run();
    time = Date.now();
    tick();
}

if (document.readyState === 'interactive') {
    entrypoint();
} else {
    document.addEventListener('DOMContentLoaded', entrypoint);
}
