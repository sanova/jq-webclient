// Parametro server IP/Indirizzo
var server = "192.168.1.93";
// Percorso server project
var pathProject = "/var/www/jq-webclient/projects";
// Nome Progetto
var nameProject = "polygon.qgs";

/* EPSG
 * This is the epsg code for the coordinates you want to display on map
*/
var epsgcode_display = "3003"; //

/* BBOX
 * If your qgis project has a bbox configured you can leave these parameters empty.
 * If you want to configure them manually set x min, y min, x max and y max of the Bounding box you want 
 */
var bbox_minx = ""; // X min
var bbox_miny = ""; // Y min
var bbox_maxx = ""; // X max
var bbox_maxy = ""; // Y max

// Unit (degree, m ..)
var unit = "m";
// Scale
var maxScale = "200"; // Massima
var minScale = "50000"; // Minima

// LOAD GOOGLE
// ATTENTION: to enable this option keep in mind that qgs project must have epsg 900913 or equivalent (3857 for example) 
var GOOGLE_ENABLE = true;
// LOAD OSM
var OSM_ENABLE = false;

var CACHE_BROWSER = true;


/*
 * NOT MODIFY THE FOLLOWING 
 */
// WMS URI
var serverURI = "http://"+server+"/cgi-bin/qgis_mapserv.fcgi?map="+pathProject+"/"+nameProject;

var BBOX = {};

var metersPerUnit = 111319.4908;  //value returned from mapguide
var inPerUnit = OpenLayers.INCHES_PER_UNIT.m * metersPerUnit;
OpenLayers.INCHES_PER_UNIT["dd"] = inPerUnit;
OpenLayers.INCHES_PER_UNIT["degrees"] = inPerUnit;
OpenLayers.DOTS_PER_INCH = 96;