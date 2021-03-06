var tilebelt = require('tilebelt');

module.exports = function(geom, limits) {
    if(geom.type === 'Point') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'MultiPoint') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'MultiPoint') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'LineString') {
        return lineCover(geom.coordinates, limits.max_zoom);
    } else if(geom.type === 'MultiLineString') {
        throw new Error('Not Implemented');
    } else if(geom.type === 'Polygon') {
        return polyRingCover(geom.coordinates, limits.max_zoom);
    } else if(geom.type === 'MultPolygon') {
        throw new Error('Not Implemented');
    }
}

function polyRingCover(ring, max_zoom) {
    // construct segments
    var segments = [];
    for(var i = 0; i < ring.length; i++) {
        for(var k = 0; k < ring[i].length - 1; k++) {
            segments.push([[ring[i][k][0], ring[i][k][1]], [ring[i][k+1][0], ring[i][k+1][1]]]);
        }
    }
    var tileHash = {};
    var min = [null,Infinity];
    var max = [null,-Infinity];
    for(var i = 0; i < ring[0].length; i++) { 
        if(ring[0][i][1] < min[1]) {
            min = ring[0][i];
        } else if (ring[0][i][1] > max[1]) {
            max = ring[0][i];
        }
    }
    var minTile = tilebelt.pointToTile(min[0], min[1], max_zoom);
    var maxTile = tilebelt.pointToTile(max[0], max[1], max_zoom);
    var y = maxTile[1];
    while(y <= minTile[1]) {
        // calculate intersections at each tile top-line
        var intersections = [];
        var bbox = tilebelt.tileToBBOX([0, y, max_zoom]);
        var line = [[bbox[0], bbox[3]], 
                    [bbox[1], bbox[3]]];
        for(var i = 0; i < segments.length; i++) {
            //console.log(segments[i])
            var intersection = lineIntersects(line[0][0], line[0][1], line[1][0], line[1][1], 
                segments[i][0][0], segments[i][0][1], segments[i][1][0], segments[i][1][1]);
            if(intersection[0]) {
                intersections.push(intersection);
            }
        }
        // sort intersections by x
        intersections = intersections.sort(function(a, b) {
            return a[0] - b[0];
        });
        // add tiles between intersection pairs
        for(var i = 0; i < intersections.length - 1; i++) {
            if(i % 2 === 0){
                var enter = tilebelt.pointToTile(intersections[i][0], intersections[i][1], max_zoom);
                var exit = tilebelt.pointToTile(intersections[i+1][0], intersections[i+1][1], max_zoom);
                var x = enter[0];
                while (x <= exit[0]) {
                    tileHash[x+'/'+y+'/'+max_zoom] = true;
                    x++;
                }
            }
        }
        y++;
    }
    // add any missing tiles with a segments pass
    for(var i = 0; i < ring.length; i++) { 
        for(var k = 0; k < ring[i].length - 1; k++) {
            segments.push([[ring[i][k][0], ring[i][k][1]], [ring[i][k+1][0], ring[i][k+1][1]]]);
        }
    }
    
    return Object.keys(tileHash);
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
        res = [null, null];

    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator === 0) {
        if(res[0] !== null && res[1] !== null) {
            return res;
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

function lineCover(coordinates, max_zoom) {
    // break into segments
    var segments = [];
    for(var i = 0; i < coordinates.length - 1; i++) { 
        segments.push([[coordinates[i][0], coordinates[i][1]], [coordinates[i+1][0], coordinates[i+1][1]]]);
    }
    var tileHash = {};
    for (var i = 0; i < segments.length; i ++) {
        // encode coordinates as tile relative pairs
        segments[i][0] = pointToTileFraction(segments[i][0][0], segments[i][0][1], max_zoom);
        segments[i][1] = pointToTileFraction(segments[i][1][0], segments[i][1][1], max_zoom);       

        // modified Bresenham digital differential analyzer algorithm
        var x0 = segments[i][0][0];
            y0 = segments[i][0][1];
            x1 = segments[i][1][0];
            y1 = segments[i][1][1];
        // verify x0,y0 is far left
        if(x0 > x1) {
            var firstX = x0;
            var firstY = y0;
            x0 = x1;
            y0 = y1;
            x1 = firstX;
            y1 = firstY;
        }
        x0 = Math.floor(x0);
        y0 = Math.floor(y0);
        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        var dx = Math.abs(x1-x0);
        var dy = Math.abs(y1-y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;

        while(true) {
            tileHash[x0+'/'+y0+'/'+max_zoom] = true;
            if(x0 > x1) throw new Error('Unable to find end of segment');
            if (x0==x1 && y0==y1) break;
            var e2 = 2*err;
            if (e2 >-dy){ err -= dy; Math.round(x0 += sx); }
            if (e2 < dx){ err += dx; Math.round(y0 += sy); }
        }
    }
    return Object.keys(tileHash);
}

function pointToTileFraction (lon, lat, z) {
    var tile = tilebelt.pointToTile(lon, lat, z);
    var bbox = tilebelt.tileToBBOX(tile);
    var tileNW = [bbox[0], bbox[3]];
    var tileSE = [bbox[2], bbox[1]];

    var xTileOffset = tileSE[0] - tileNW[0];
    var xPointOffset = lon - tileNW[0];
    var xPercentOffset = xPointOffset / xTileOffset;

    var yTileOffset = tileSE[1] - tileNW[1];
    var yPointOffset = lat - tileNW[1];
    var yPercentOffset = yPointOffset / yTileOffset;

    return [tile[0]+xPercentOffset, tile[1]+yPercentOffset];
}

