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
    _ = require('lodash'),
    regions,
    chunkSize = 16;


exports.clear = function () {
    exports.regions = regions = [];
    regions[0] = []; // +x +y
    regions[1] = []; // -x +y
    regions[2] = []; // +x -y
    regions[3] = []; // -x -y
};

exports.makeChunk = function (x, y) {
    var rows = [];
    for (var i = 0; i < chunkSize; i++) {
        rows[i] = [];
        for (var j = 0; j < chunkSize; j++) {
            rows[i][j] = exports.makeCell(x * 16 + j, y * 16 + i);
        }
    }
    // Get region number.
    var r = 0;
    if (x < 0) {
        r++;
    }
    if (y < 0) {
        r += 2;
    }
    // Get the coordinates of the chunk inside the region
    var rx = x < 0 ? Math.abs(x + 1) : x,
        ry = y < 0 ? Math.abs(y + 1) : y;

    // Make the row if it does not exist yet
    if (!regions[r][ry]) {
        regions[r][ry] = [];
    }
    regions[r][ry][rx] = rows;
};

exports.getCellAt = function (x, y) {
    // Coordinates relative to the chunk start
    var cx = x < 0 ? chunkSize - Math.abs((x + 1) % chunkSize) - 1 : x % chunkSize,
        cy = y < 0 ? chunkSize - Math.abs((y + 1) % chunkSize) - 1 : y % chunkSize;
    // Coordinates of the chunk in the world
    var wx = Math.floor(x / chunkSize),
        wy = Math.floor(y / chunkSize);
    // Region number
    var r = 0;
    if (x < 0) {
        r++;
    }
    if (y < 0) {
        r += 2;
    }
    // Coordinates of the chunk in the region
    var rx = wx < 0 ? Math.abs(wx + 1) : wx,
        ry = wy < 0 ? Math.abs(wy + 1) : wy;
    if (!regions[r][ry] || !regions[r][ry][rx]) {
        return null;
    }
    var val = regions[r][ry][rx][cy][cx];
    if (val === undefined) {
        debugger;
    }
    return val;
    //return regions[r][ry][rx][cy][cx];
};

exports.cells = function () {
    var array = [], chunk, r, ry, rx, cy;
    for (r = 0; r < regions.length; r++) {
        for (ry = 0; ry < regions[r].length; ry++) {
            for (rx = 0; rx < regions[r][ry].length; rx++) {
                chunk = regions[r][ry][rx];
                for (cy = 0; cy < chunk.length; cy++) {
                    array = array.concat(chunk[cy]);
                }
            }
        }
    }
    return array;
};

exports.makeCell = function (x, y) {
    var neighbors = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]];
    return {
        x: x,
        y: y,
        up: false,
        down: false,
        right: false,
        left: false,

        neighbors: function () {
            return neighbors.map(function (a) {
                return exports.getCellAt.apply(exports, a);
            }).filter(function (c) {
                return c !== null;
            });
        },

        connections: function () {
            var connections = [];
            if (this.up) {
                connections.push(exports.getCellAt(x, y - 1));
            }
            if (this.down) {
                connections.push(exports.getCellAt(x, y + 1));
            }
            if (this.left) {
                connections.push(exports.getCellAt(x - 1, y));
            }
            if (this.right) {
                connections.push(exports.getCellAt(x + 1, y));
            }
            return connections.filter(function (c) {
                return c !== null;
            });
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
    return _.sample(exports.cells());
};
