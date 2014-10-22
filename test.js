var test = require('tape');
var scanline = require('./');

var poly = require('./fixtures/polygon.json');

test('polygon', function(t) {
    var limits = {min_zoom: 25, max_zoom: 25};
    var tiles = scanline(poly, limits);
    t.ok(tiles);
    t.end();
});
