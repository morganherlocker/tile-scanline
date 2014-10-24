var test = require('tape');
var tilebelt = require('tilebelt');
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

test('line -- z25', function(t) {
    var limits = {min_zoom: 25, max_zoom: 25};
    var tiles = scanline(line, limits);
    t.ok(tiles.length);
    t.end();
});

test('line -- z20', function(t) {
    var limits = {min_zoom: 20, max_zoom: 20};
    var tiles = scanline(line, limits);
    t.ok(tiles.length);
    t.end();
});

function logFeatures(tiles) {
    var fc = [];
    tiles.forEach(function(tile){
        tile = tile.split('/').map(function(t){return parseInt(t)});
        fc.push(tilebelt.tileToGeoJSON(tile));
    })
    console.log(JSON.stringify(fc));
}