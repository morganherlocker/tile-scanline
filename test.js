var test = require('tape');
var scanline = require('./');

var poly = require('./fixtures/polygon.json');
var hole = require('./fixtures/hole.json');
var line = require('./fixtures/line.json');

test('polygon', function(t) {
    var limits = {min_zoom: 25, max_zoom: 25};
    var tiles = scanline(poly, limits);
    t.ok(tiles);
    t.end();
});

test('hole', function(t) {
    var limits = {min_zoom: 10, max_zoom: 10};
    var tiles = scanline(hole, limits);
    t.ok(tiles);
    t.end();
});

test('line', function(t) {
    var limits = {min_zoom: 15, max_zoom: 15};
    var tiles = scanline(line, limits);
    t.ok(tiles);
    t.end();
});
