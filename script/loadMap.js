var map, basicLayer, highlightLayer, editableLayer, googleLayer, osmLayer;
var infoControls, modControls, infoIdControls;
var cacheWrite, cacheRead;
var activeLayer = "";
var BBOXfromProject = "";
var googleProj = new OpenLayers.Projection("EPSG:900913");

var propertyAccordion =
{
    header: "> div > h3",
    collapsible: true,
    autoHeight: false
};

function getListLayers() {
	
	var gmlOptions = {
		    featureType: "point",
		    featureNS: serverURI
		};
	var gmlOptionsIn = OpenLayers.Util.extend(
	    OpenLayers.Util.extend({}, gmlOptions)
	);
	
    $.ajax ({
        url: serverURI,
        dataType: "xml",
        data: {
          'SERVICE': 'WMS',
          'VERSION': '1.1.1',
          'REQUEST': 'GetCapabilities'
        },
        method: 'GET',
        scope: this,
        success: function (response) {
        	BBOXfromProject = getBboxFromProject(response);
        	createListLayerAccordion(response);
        }
    });
}

function createListLayerAccordion(data) {
	var layersContainer = $("<div>").attr("id", 'layersContainer');

    $('#wb-LayerList').append(
		$("<div>").attr("id", 'projectLayer').attr("class", "project").append(
			$("<h3>").append(
				$("<a>").attr("href", "#").html($(data).find('Layer')[0].firstElementChild.textContent)
			),
			layersContainer
		)
	);
	
	for(var i=1; i < $(data).find('Layer').length; i++) {
		// Get layer for combo filter 
		$('select#wb-layerCombo').append($('<option />').attr('value', $(data).find('Layer')[i].firstElementChild.textContent)
				.text($(data).find('Layer')[i].firstElementChild.textContent)
		);
		layersContainer.append(
			$("<div>").attr('class', 'containerLayer').append(
				$("<div>").attr('class', 'layerCheckBox').append(
					$("<input>").attr('id', $(data).find('Layer')[i].firstElementChild.textContent).attr('type', 'checkbox').attr('checked', 'checked').attr('name', 'layerShowed')
				),
				$("<div>").attr('id', 'div|'+$(data).find('Layer')[i].firstElementChild.textContent).html($(data).find('Layer')[i].firstElementChild.textContent).attr('class', 'layerShowedText')		
			)			
		);
	}
	
	listLayer = getListVisibleLayer();
	viewMapLayer(listLayer);
	
	$('#wg-LayerListDiv').toggle('slide', {}, 400);	
	$('#wb-LayerList').accordion(propertyAccordion);
	
	$('#wg-layerLegendDiv').toggle('slide', {}, 400);
	
	$('.layerCheckBox input[type=checkbox]').click(function() {
		listLayer = getListVisibleLayer();
		var listLayerToView = getStringLayerToShow(listLayer);
		basicLayer.mergeNewParams({"layers": listLayerToView.reverse()});
	});
	
	$('.containerLayer').click(function() {
		// Selected layer as active layer
		activeLayer = setActiveLayer($(this).find('.layerShowedText').attr('id').split("|")[1]);
		// Remove selected items
		$('.containerLayer').removeClass('bgGrayRegular');
		$(this).removeClass('bgGray');
		// Select layer
		$(this).addClass('bgGrayRegular');
		// Disable function buttons 
		$('#toolbarMap').find('button').removeClass('ui-state-pressed');
		activateDeactivateControl();
		// Disable id info control
		map.removeControl(infoIdControls);
		// Enable info id filter control on active layer
		createInfoFilterControl(activeLayer);
		
	}).mouseover(function(){
		$(this).addClass('bgGray');
	}).mouseleave(function(){
		$(this).removeClass('bgGray');
	});
}

function enableCacheBrowser() {
	cacheWrite = new OpenLayers.Control.CacheWrite({
		 //autoActivate: true,
		 imageFormat: "image/png",
		 eventListeners: {
			 cachefull: function() {
				 clearCache();
			 }
		 }
	});
	map.addControl(cacheWrite);
	
	cacheRead = new OpenLayers.Control.CacheRead();
	map.addControl(cacheRead);
	
	cacheWrite.activate();
	cacheRead.activate();
}

function clearCache() {
	OpenLayers.Control.CacheWrite.clearCache();
}

function viewMapLayer(listLayer) {
	var layersList = new Array();
	
	if(epsgcode_display == "") epsgcode_display = BBOXfromProject['SRS'];
	
	if(GOOGLE_ENABLE)
		epsgMap = googleProj;
	else
		epsgMap = new OpenLayers.Projection(BBOXfromProject['SRS']);
	
	var mapOptions = {
			//projection: "EPSG:"+epsgcode, units: unit,
			projection: epsgMap,
			displayProjection: new OpenLayers.Projection("EPSG:"+epsgcode_display),
			units: unit,
			//maxExtent: new OpenLayers.Bounds(BBOXfromProject['minx'],BBOXfromProject['miny'],BBOXfromProject['maxx'],BBOXfromProject['maxy']),
			maxScale: maxScale,
			minScale: minScale,
			singleTile: false,
			tileSize: new OpenLayers.Size(512,512), 
	        controls: [
	                   new OpenLayers.Control.Navigation({
	        			dragPanOptions: {enableKinetic: true}
	        		}),
	        	    new OpenLayers.Control.PanZoomBar(),
	        	    new OpenLayers.Control.Attribution()
	        ]			
	};
	var styleEditableLayer 		= new OpenLayers.Style();
	var styleMapEditableLayer 	= new OpenLayers.StyleMap({"default": styleEditableLayer});
	
	// Creo la mappa
    map = new OpenLayers.Map( 'wg-MapPanel', mapOptions);
    
    // CREATE GOOGLE LAYER IF ENABLE AND ADD IT TO LAYERS LIST
    if(GOOGLE_ENABLE) {
    	googleLayer = createGoogleLayer();
    	layersList.push(googleLayer);
    }
    
//    var gmap = new OpenLayers.Layer.Google(
//            "Google Streets", // the default
//            {numZoomLevels: 20}
//    );
//    var ghyb = new OpenLayers.Layer.Google(
//            "Google Hybrid",
//            {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
//    );
//    var gsat = new OpenLayers.Layer.Google(
//            "Google Satellite",
//            {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
//    );
    
    //Creo layer di OSM
    if(OSM_ENABLE) {
    	osmLayer = createOsmLayer();
    	layersList.push(osmLayer);
    }
    
	// create a WMS layer and add it to LAYERS LIST
    basicLayer = createWMSLayer(listLayer);
    layersList.push(basicLayer);
    
    highlightLayer = createHighLightLayer();
    layersList.push(highlightLayer);
    
    editableLayer = createEditableLayer();
    layersList.push(editableLayer);
 
    // create legend	
    for(var key in listLayer) {
    	getLegendLayer(listLayer[key]);
    }
    
    // ADD CONTROLS TO MAP
    addInfoControlsMap();
    addGeneralControlsMap();
    
    for (var i=0; i<layersList.length; i++) {
    	map.addLayer(layersList[i]);
    }  
    
	var mapExtent = new OpenLayers.Bounds(BBOXfromProject['minx'],BBOXfromProject['miny'],BBOXfromProject['maxx'],BBOXfromProject['maxy']);
	//var projectProj = new OpenLayers.Projection(BBOXfromProject['SRS']);
	//var mapProj = map.getProjection();
    
     // Set map to max extent
      //map.zoomToExtent(mapExtent.transform(projectProj, mapProj));
	map.zoomToExtent(mapExtent);
	
	if(CACHE_BROWSER)
		enableCacheBrowser();
}

function createGoogleLayer() {
    // Creo layer di google
	//var extentProj = new OpenLayers.Bounds(BBOXfromProject['minx'],BBOXfromProject['miny'],BBOXfromProject['maxx'],BBOXfromProject['maxy']);
	//var projectProj = new OpenLayers.Projection(BBOXfromProject['SRS']);
	
	//var extentGoogle = extentProj.transform(projectProj, googleProj);
	
	if(epsgcode_display == "") epsgcode_display = BBOXfromProject['SRS'];
	
    var googleLayer = new OpenLayers.Layer.Google("Google Satellite",
	    {
	      	sphericalMercator: true,
	        projection: googleProj,
	        displayProjection: new OpenLayers.Projection("EPSG:"+epsgcode_display),
	        units: unit,
	        minZoomLevel: 5,
	        maxZoomLevel: 20,
	        maxExtent: extentGoogle,
	         isBaseLayer: true,
	        'reproject': true
	    });
    
    return googleLayer;
}

function createOsmLayer() {
	var osm = new OpenLayers.Layer.OSM();
	
	return osm;
}

function createWMSLayer(listLayer) {
	var listLayerToView = getStringLayerToShow(listLayer);
	
	if(epsgcode_display == "") epsgcode_display = BBOXfromProject['SRS'];
	
	var mapExtent = new OpenLayers.Bounds(BBOXfromProject['minx'],BBOXfromProject['miny'],BBOXfromProject['maxx'],BBOXfromProject['maxy']);
	
	//if(GOOGLE_ENABLE) {
	//	var mapExtent = mapExtentDefault.transform(new OpenLayers.Projection(BBOXfromProject['SRS']), googleProj);
	//}
	//else
	//	var mapExtent = mapExtentDefault;
	
	if(!GOOGLE_ENABLE && !OSM_ENABLE)
		var isBaseLayer = true;
	
	// Create Base WMS with all layers to show
	var basicLayer = new OpenLayers.Layer.WMS( "Progetto",
		serverURI,
		{layers: listLayerToView.reverse(),transparent: 'TRUE',format:"image/png"},
		{
            projection: new OpenLayers.Projection(BBOXfromProject['SRS']),
            displayProjection: new OpenLayers.Projection("EPSG:"+epsgcode_display),
			buffer: 0,
			isBaseLayer: isBaseLayer,
			maxExtent: mapExtent,
			redraw: function(force) {
				if(force)
					return this.mergeNewParams({"_olSalt": Math.random()});
				else
					return OpenLayers.Layer.prototype.redraw.apply(this, []);        			
        	}
        }
	);
	
	return basicLayer;
}

function createEditableLayer() {
	var editableLayer = new OpenLayers.Layer.Vector("EditLayer",
		{
			isBaseLayer: false, 
			displayInLayerSwitcher: true, 
			styleMap: styleMapHighLightLayer
		}
	);
	
	return editableLayer;
}

function createHighLightLayer() {
	var highLightLayer = new OpenLayers.Layer.Vector("attribHighLight",
		{
			isBaseLayer: false, 
			displayInLayerSwitcher: true, 
			styleMap: styleMapHighLightLayer
		}
	);
	
	return highLightLayer;
}

function addInfoControlsMap() {
    infoControls = {
        click: new OpenLayers.Control.WMSGetFeatureInfo({
            url: serverURI, 
            title: 'Controlli Info',
            layers: [basicLayer],
            infoFormat: 'text/xml',
            queryVisible: true
        })
    };
    
    infoIdControls = {
        click: new OpenLayers.Control.WMSGetFeatureInfo({
            url: serverURI, 
            title: 'Controlli Info id',
            layers: [basicLayer],
            infoFormat: 'text/xml',
            queryVisible: true,
            vendorParams: {QUERY_LAYERS: activeLayer,STYLES: ""}
        })
    };
    
    modControls = new OpenLayers.Control.ModifyFeature(editableLayer, {
		onModificationEnd: function(feature){
			//execModificaFeatureTest(thematicLayer, editableLayer, feature, getSelectedLayer());
			execModificaFeature(basicLayer, feature, activeLayer);
		}
	});
    
    map.addControl(modControls);
    
    // Add click event to info Control
    infoControls.click.events.register("getfeatureinfo", this, showInfo);
    infoIdControls.click.events.register("getfeatureinfo", this, getIdFeatureSelected);
    
    // Link controls to map
    map.addControl(infoControls.click); 
    map.addControl(infoIdControls.click);
}

function addGeneralControlsMap() {  
    // Associazione controlli di misura alla mappa
    for(var key in measureControls) {
        measureControls[key].events.on({
            "measure": handleMeasurements,
            "measurepartial": handleMeasurements
        });
        map.addControl(measureControls[key]);
    }   

    map.addControl(new OpenLayers.Control.LayerSwitcher());
}

function getStringLayerToShow(listLayer) {
	var listLayerToView = new Array();
	
	for(var key in listLayer) {
		listLayerToView.push(listLayer[key]);
	}
	return listLayerToView;
}

// Event click on map to get info elements
function showInfo(evt) {
   if($('#wg-layerInfoContainer').is(':hidden'))
	   $('#wg-layerInfoContainer').toggle('slide', {direction: 'right'}, 400);
   $('#wg-layerInfo').children().remove();
   $('#wg-layerInfo').accordion('destroy');
   createListInfoAccordion(evt);	
}

// Event click on map for get distance
function handleMeasurements(event) {
    var geometry = event.geometry;
    var units = event.units;
    var order = event.order;
    var measure = event.measure;
    var out = "";
    if(order == 1) {
        out += measure.toFixed(3) + " " + units;
    } else {
        out += measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
    }
    $('#outputDistanceText').html(out);
}

function createListInfoAccordion(data) {
	
	// Create accordion with info elements
	$(data.text).find('Layer').each(function(){
		var layersInfoContainer = $("<div>").attr("id", 'layersInfoContainer_'+this.attributes[0].textContent);
	    $('#wg-layerInfo').append(
			$("<div>").attr('id', 'container_'+this.attributes[0].textContent).attr("class", "infoLayerContainer").append(
				$("<h3>").append(
					$("<a>").attr("href", "#").html(this.attributes[0].textContent)
				),
				layersInfoContainer
			)
		);

		for(var i=0; i<this.children.length; i++) {
			for(var j=0; j<$(this.children[i]).find('ATTRIBUTE').length - 1; j++) {
				layersInfoContainer.append(
					$("<div>").attr('class', 'divAttributes')
						.html($($(this.children[i]).find('ATTRIBUTE')[j].outerHTML).attr('name') + ': ' 
							 +$($(this.children[i]).find('ATTRIBUTE')[j].outerHTML).attr('value'))
				);
			}
		}
	});
	
	$('#wg-layerInfo').accordion(propertyAccordion);
}

// Set active layer
function setActiveLayer(obj){
	activeCurrentLayer = obj;
	return activeCurrentLayer;
}

// Get id of selected element
function getIdFeatureSelected(data){
	$(data.text).find('Feature').each(function(){
		getEditWfsLayer(activeLayer, $(this).attr('id'));
	});
}

// Create info control for active layer
function createInfoFilterControl(activeCurrentLayer) {
    infoIdControls = {
        click: new OpenLayers.Control.WMSGetFeatureInfo({
            url: serverURI, 
            title: 'Controlli Info id',
            layers: [basicLayer],
            infoFormat: 'text/xml',
            queryVisible: true,
            vendorParams: {QUERY_LAYERS: activeCurrentLayer,STYLES: ""}
        })
    };
    infoIdControls.click.events.register("getfeatureinfo", this, getIdFeatureSelected);
    map.addControl(infoIdControls.click);
}

function getEditWfsLayer (layer, idFeature) {
	
	var gmlOptions = {
		    featureType: "point",
		    featureNS: serverURI
		};
	var gmlOptionsIn = OpenLayers.Util.extend(
	    OpenLayers.Util.extend({}, gmlOptions)
	);
    
    $.ajax({
		type: 'GET',
		url: serverURI,
		dataType: 'text',
		data: {
	         'SERVICE': 'WFS',
	         'VERSION': '1.1.1',
	         'TYPENAME': layer,
	         'REQUEST': 'GetFeature',
	         'MAXFEATURES': '5000',
	         'OUTPUTFORMAT': 'GML3',
	         'SRS': 'EPSG:' + epsgcode,
	         'FEATUREID': idFeature
		},
		success:	function(response) {
	       	var format = new OpenLayers.Format.GML(gmlOptions);
        	var features = format.read(response);
            if(features){
                for(var i=0; i<features.length; i++){
                    editableLayer.addFeatures(features[i]);
                }
            }
		}
	});

}

function getBboxFromProject(data) {
	var bboxObj = {};
	// <BoundingBox maxx="1.01957e+06" minx="958453" maxy="5.75244e+06" miny="5.64631e+06" SRS="EPSG:3785"/>
	var bbox = $(data).find('BoundingBox')[0].attributes;
	
	for(var i=0; i<bbox.length; i++) {
		if(bbox[i].localName == "maxx") bboxObj[bbox[i].localName] = bbox[i].value;
		if(bbox[i].localName == "maxy") bboxObj[bbox[i].localName] = bbox[i].value;
		if(bbox[i].localName == "minx") bboxObj[bbox[i].localName] = bbox[i].value;
		if(bbox[i].localName == "miny") bboxObj[bbox[i].localName] = bbox[i].value;
		if(bbox[i].localName == "SRS") bboxObj[bbox[i].localName] = bbox[i].value;
	}
	
	return bboxObj;
}