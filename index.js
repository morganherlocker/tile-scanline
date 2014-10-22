var tilebelt = require('tilebelt');

module.exports = function(geom, limits) {
    if(geom.type === 'Point') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'MultiPoint') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'MultiPoint') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'LineString') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'MultiLineString') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'Polygon') {
        polyRing(geom.coordinates[0], limits.max_zoom);
    } else if(geom.type === 'MultPolygon') {
        throw new Error('Not Implemented');
    } 
}

function polyRing(ring, max_zoom) {
    //ignores holes
    var min = [null,Infinity];
    var max = [null,-Infinity];
    for(var i = 0; i < ring.length; i++) { 
        if(ring[i][1] < min[1]) {
            min = ring[i];
        } else if (ring[i][1] > max[1]) {
            max = ring[i];
        }
    }
    console.log(min)
    console.log(max)
    var maxTile = tilebelt.pointToTile(max[0], max[1], max_zoom);
    var minTile = tilebelt.pointToTile(min[0], min[1], max_zoom);
    console.log(minTile)
    console.log(maxTile)
}