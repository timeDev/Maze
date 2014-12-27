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
    grid = require('./grid'),
    _ = require('lodash');

exports.hunt = function () {
    var cells = _(grid.cells()).filter(function (cell) {
        return cell.connections().length === 0 &&
            _.any(cell.neighbors(), function (c) {
                return c.connections().length > 0;
            });
    });
    var hCell = cells.sample();
    if (!hCell || (_.isArray(hCell) && hCell.length === 0)) {
        console.log('No cells found');
        return undefined;
    }
    var possibleNbs = _.filter(hCell.neighbors(), function (cell) {
        return cell.connections().length > 0;
    });
    var cCell = _.first(possibleNbs);
    if (cCell && !(_.isArray(cCell) && cCell.length === 0)) {
        hCell.makeConnection(cCell);
    }
    return hCell;
};

exports.walk = function (cell) {
    var neighbors = cell.neighbors();
    var nCell = _.sample(
        _.filter(neighbors, function (cell) {
            return cell.connections().length === 0;
        }));
    if (nCell !== undefined) {
        cell.makeConnection(nCell);
    }
    return nCell;
};

exports.run = function (c) {
    if (c === undefined) {
        c = grid.pickRandCell();
    }
    while (c) {
        c = exports.step(c);
    }
};

exports.step = function (c) {
    c = exports.walk(c);
    if (!c) {
        c = exports.hunt(c);
    }
    return c;
};
