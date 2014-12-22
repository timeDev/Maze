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

function easeQuartInCubeOut(t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t * t + b;
    }
    t -= 2;
    return -c / 2 * (t * t * t * t - 2) + b;
}

function ease(t) {
    return easeQuartInCubeOut(t, 0, 1, 0.3) - 1;
}

function tick() {
    var dt = (Date.now() - time) / 1000.0;
    time = Date.now();
    if (player.moveCooldown > 0) {
        player.moveCooldown -= dt;
        player.animProgress += dt;
    } else {
        var moved = 0;
        if (keys[keycode.w] && player.getCell().up) {
            moved = player.animateMove(0, -1);
        }
        if (keys[keycode.s] && player.getCell().down) {
            moved = player.animateMove(0, 1);
        }
        if (keys[keycode.a] && player.getCell().left) {
            moved = player.animateMove(-1, 0);
        }
        if (keys[keycode.d] && player.getCell().right) {
            moved = player.animateMove(1, 0);
        }
        if (moved) {
            player.moveCooldown = 0.3;
            player.animProgress = 0.0;
        } else {
            player.animateMove(0, 0);
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
    var playerPosX = player.pos.x + player.pos.xa * ease(player.animProgress) + 0.5;
    var playerPosY = player.pos.y + player.pos.ya * ease(player.animProgress) + 0.5;
    ctx.translate(window.innerWidth / 2 - playerPosX * lineLength, window.innerHeight / 2 - playerPosY * lineLength);

    ctx.save();
    ctx.beginPath();
    //ctx.strokeStyle = '';
    //ctx.fillStyle = '';
    ctx.arc(playerPosX * lineLength, playerPosY * lineLength, 5, 0, 2 * Math.PI, false);
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
    player.animProgress = 0;
    player.pos = {x: 0, y: 0, xa: 0, ya: 0};

    player.getCell = function () {
        return grid.getCellAt(player.pos.x, player.pos.y);
    };

    player.animateMove = function (x, y) {
        player.pos.xa = x;
        player.pos.x += x;
        player.pos.ya = y;
        player.pos.y += y;
        // Just to make it minify better
        return true;
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
    grid.makeChunk(-1, 0);
    grid.makeChunk(0, -1);
    grid.makeChunk(-1, -1);
    generator.run();
    time = Date.now();
    tick();
}

if (document.readyState === 'interactive') {
    entrypoint();
} else {
    document.addEventListener('DOMContentLoaded', entrypoint);
}
