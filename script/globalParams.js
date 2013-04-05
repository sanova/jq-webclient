/*
 * CONFIG PARAMETERS 
 * EDIT THIS VARIABLES TO SET BASE CONFIG OF MAP
 * 
 * */
 
// IP or server link 
var server = "";
// Path to project --> /path/to/project   
var pathProject = "";
// Project file --> example.qgs 
var nameProject = "";

//EPSG
// EPSG you want to display in map. If this variable is empty it will be epsg of project  (default empty)
var epsgcode_display = "";  

// Unit (degree, m ..)
var unit = "m";
// Scale
var maxScale = "200"; // Max (default: 200)
var minScale = "50000"; // Min (default 50000)

// LOAD GOOGLE. true if you want enable google layer  (default: false)
var GOOGLE_ENABLE = false; 
// LOAD OSM. true if you want to enable Open street map layer (default: false)
var OSM_ENABLE = false;
// Cache Browser. true if you want to enable local storage cache browser
var CACHE_BROWSER = false;



// WMS URI
var serverURI = "http://"+server+"/cgi-bin/qgis_mapserv.fcgi?map="+pathProject+"/"+nameProject;

var metersPerUnit = 111319.4908;  //value returned from mapguide
var inPerUnit = OpenLayers.INCHES_PER_UNIT.m * metersPerUnit;
OpenLayers.INCHES_PER_UNIT["dd"] = inPerUnit;
OpenLayers.INCHES_PER_UNIT["degrees"] = inPerUnit;
OpenLayers.DOTS_PER_INCH = 96;
