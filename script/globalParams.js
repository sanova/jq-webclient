/* 
 * *******************
 * SETTINGS PARAMETERS
 * *******************
 */

/*
 * IP or server url of machine where jq-weclient is installed
 * Examples: 
 * 	- 192.168.1.12
 * 	- test.yourserver.com
 */
var server = "192.168.1.93";

/*
 * Path where you copy your qgis project (qgs file)
 * I suggest to copy your qgs file into "project" directory of jq-webclient
 * Example: /var/www/jq-webclient/projects
 */
var pathProject = "/var/www/jq-webclient/projects";

/*
 * File name of your qgis project (example: polygon.qgs)
 */
var nameProject = "polygon.qgs";

/* EPSG
 * This is the epsg code for the coordinates you want to display on map
 * Leave empty if you want to display coordinates in the same epsg of project 
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

/*
 * Unit of coordinate map
 * m : meters
 * degree: degree
 */
var unit = "m";

/*
 * Scale
 * You can set here max and min scale of map
 */ 
var maxScale = "200"; // Max
var minScale = "50000"; // Min

/*
 * LOAD GOOGLE 
 * true to enable google layer
 * 
 * ATTENTION: to enable this option keep in mind that qgs project must have epsg 900913 or equivalent (3857 for example) 
 */
var GOOGLE_ENABLE = false;

/* 
 * LOAD OSM
 * true to enable Open Street Map layer 
 */
var OSM_ENABLE = false;

/*
 * true to enable local storage of browser
 * Browser will cache during moving and zooming map
 */
var CACHE_BROWSER = false;


/*
 * WMS URI
 * If you are using Windows UNCOMMENT FIRST LINE and COMMENT THE SECOND ONE
 * 
 * ATTENTION: you have to properly configure qgis_mapserver.fcgi to have it working
 * Read here for more details: http://hub.qgis.org/projects/quantum-gis/wiki/QGIS_Server_Tutorial 
 * May be you have to modify "qgis" directory into the following URI string 
 * depending on how you have configured your qgis_mapserver.fcgi.exe 
 */

// -- For windows users --
//var serverURI = "http://"+server+"/qgis/qgis_mapserv.fcgi.exe?map="+pathProject+"/"nameProject;

// -- For linux users --
var serverURI = "http://"+server+"/cgi-bin/qgis_mapserv.fcgi?map="+pathProject+"/"+nameProject;

/* 
 * ************************
 * NOT MODIFY THE FOLLOWING
 * ************************ 
 */
var BBOX = {};

var metersPerUnit = 111319.4908;  //value returned from mapguide
var inPerUnit = OpenLayers.INCHES_PER_UNIT.m * metersPerUnit;
OpenLayers.INCHES_PER_UNIT["dd"] = inPerUnit;
OpenLayers.INCHES_PER_UNIT["degrees"] = inPerUnit;
OpenLayers.DOTS_PER_INCH = 96;