tile-scanline
===
[![Build Status](https://travis-ci.org/morganherlocker/tile-scanline.svg)](https://travis-ci.org/morganherlocker/tile-scanline)

tile-scanline is an algorithm for rasterizing vector geometry as [map tiles](http://msdn.microsoft.com/en-us/library/bb259689.aspx). It uses a combination of a modified [scanline polygon fill](http://en.wikipedia.org/wiki/Scanline_rendering) and a modified [Bresenham's line drawing algorithm](http://en.wikipedia.org/wiki/Bresenham's_line_algorithm). 

##Install
```sh
npm install tile-scanline
```

##Usage
```js
// accepts a polygon or linestring geojson geometry
scanline(geometry, {max_zoom: 20})
```
