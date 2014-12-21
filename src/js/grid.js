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
    rows,
    width = 20,
    height = 20;

exports.clear = function () {
    exports.rows = rows = [];
    for (var i = 0; i < height; i++) {
        rows[i] = [];
        for (var j = 0; j < width; j++) {
            rows[i][j] = exports.makeCell(j, i);
        }
    }
};

exports.cells = function () {
    var array = [];
    for (var i = 0; i < rows.length; i++) {
        array = array.concat(rows[i]);
    }
    return array;
};

exports.makeCell = function (x, y) {
    return {
        x: x,
        y: y,
        up: false,
        down: false,
        right: false,
        left: false,

        neighbors: function () {
            var neighbors = [];
            if (x > 0) {
                neighbors.push(rows[y][x - 1]);
            }
            if (x + 1 < width) {
                neighbors.push(rows[y][x + 1]);
            }
            if (y > 0) {
                neighbors.push(rows[y - 1][x]);
            }
            if (y + 1 < height) {
                neighbors.push(rows[y + 1][x]);
            }
            return neighbors;
        },

        connections: function () {
            var connections = [];
            if (this.up) {
                connections.push(rows[y - 1][x]);
            }
            if (this.down) {
                connections.push(rows[y + 1][x]);
            }
            if (this.left) {
                connections.push(rows[y][x - 1]);
            }
            if (this.right) {
                connections.push(rows[y][x + 1]);
            }
            return connections;
        },

        makeConnection: function (cell) {
            if (y - 1 === cell.y) {
                this.up = cell.down = true;
            } else if (y + 1 === cell.y) {
                this.down = cell.up = true;
            } else if (x - 1 === cell.x) {
                this.left = cell.right = true;
            } else if (x + 1 === cell.x) {
                this.right = cell.left = true;
            } else {
                console.warn("Attempted invalid connection");
                console.log(this, cell);
                console.trace();
            }
        }
    };
};

exports.pickRandCell = function () {
    var x = Math.floor(Math.random() * width),
        y = Math.floor(Math.random() * height);
    return rows[y][x];
};
