var Benchmark = require('benchmark');
var scanline = require('./');
var poly = require('./fixtures/polygon.json');
var line = require('./fixtures/line.json');

var suite = new Benchmark.Suite('scanline')

suite.add('scan building - z6', function() {
    scanline(poly, {min_zoom: 6, max_zoom: 6})
}).add('scan building - z12', function() {
    scanline(poly, {min_zoom: 12, max_zoom: 12})
}).add('scan building - z18', function() {
    scanline(poly, {min_zoom: 18, max_zoom: 18})
}).add('scan building - z20', function() {
    scanline(poly, {min_zoom: 20, max_zoom: 20})
}).add('scan building - z22', function() {
    scanline(poly, {min_zoom: 22, max_zoom: 22})
}).add('scan building - z25', function() {
    scanline(poly, {min_zoom: 25, max_zoom: 25})
}).add('scan building - z28', function() {
    scanline(poly, {min_zoom: 28, max_zoom: 28})
}).add('scan road - z6', function() {
    scanline(line, {min_zoom: 6, max_zoom: 6})
}).add('scan road - z12', function() {
    scanline(line, {min_zoom: 12, max_zoom: 12})
}).add('scan road - z18', function() {
    scanline(line, {min_zoom: 18, max_zoom: 18})
}).add('scan road - z20', function() {
    scanline(line, {min_zoom: 20, max_zoom: 20})
}).add('scan road - z22', function() {
    scanline(line, {min_zoom: 22, max_zoom: 22})
}).add('scan road - z25', function() {
    scanline(line, {min_zoom: 25, max_zoom: 25})
}).add('scan road - z28', function() {
    scanline(line, {min_zoom: 28, max_zoom: 28})
}).on('cycle', function(event) {
    console.log(String(event.target));
}).run();