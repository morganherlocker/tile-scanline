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
    var tiles = {};
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
    var minTile = tilebelt.pointToTile(min[0], min[1], max_zoom);
    var maxTile = tilebelt.pointToTile(max[0], max[1], max_zoom);
    var y = maxTile[1];
    while(y <= minTile[1]) {
        var intersections = [];
        var bbox = tilebelt.tileToBBOX([0, y, max_zoom]);
        var line = [[bbox[0], bbox[3]], 
                    [bbox[1], bbox[3]]];
        for(var i = 0; i < ring.length - 1; i++) {
            intersections.push(lineIntersects(line[0][0], line[0][1], line[1][0], line[1][1], 
                ring[i][0], ring[i][1], ring[i+1][0], ring[i+1][1]));
        }
        for(var i = 0; i < ring.length - 1; i++) {
            
        }
        y++;
    }
}

// modified from http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function lineIntersects(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    var denominator,
        a, 
        b,
        numerator1,
        numerator2,
        onLine1= false,
        onLine2= false,
        res = [null, null]

    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        if(result.x != null && result.y != null) {
            return result;
        } else {
            return false;
        }
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    res[0] = line1StartX + (a * (line1EndX - line1StartX));
    res[1] = line1StartY + (a * (line1EndY - line1StartY));


    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        return res;
    }
    else {
        return false;
    }
}
