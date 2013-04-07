function setRangeScaleInPanel() {	
	for(var key in scaleArray) {
		var valueScale = scaleArray[key];
		$("#wg-containerScaleRange").append(
			$("<div>").attr("class", "itemsSclae").text(valueScale).click(function() {
				goToScaleValue($(this).text().split(":")[1]);
			})
		)
	}
}

function setPositionContainerScale() {	
	var y = $("#wg-scalesValue").offset().top;
	var x = $("#wg-scalesValue").offset().left;
	var width = $("#wg-scalesValue").width();
	var yScaleContainer = y - $("#wg-containerScaleRange").height();
	
	$("#wg-containerScaleRange").css("width", width).offset({ top: yScaleContainer, left: x}).mouseover(function(){
		$(this).show();
	}).mouseleave(function(){
		$(this).hide();
	});
}

function setPositionContainerNamesTemplates() {
	if($("#wg-containerNamesTemplates").offset().top > 0)
		return;
	
	var y = $("#selectTemplate").offset().top;
	var x = $("#selectTemplate").offset().left;
	var width = $("#selectTemplate").width();
	var yContTemp = y + 15;
	
	$("#wg-containerNamesTemplates").css("width", width).offset({ top: yContTemp, left: x}).mouseover(function(){
		$(this).show();
	}).mouseleave(function(){
		$(this).hide();
	});
}

function viewScaleRangeContainer() {
	$("#wg-containerScaleRange").show();
}

function hideScaleRangeContainer() {
	$("#wg-containerScaleRange").hide();
}

function setCurrentScale(obj) {
	var currentScale = map.getScale();
	currentScale = currentScale.toString().split(".")[0];
	
	$("#wg-scalesValue").val(currentScale);
}

function goToScaleValue(scale) {
	$("#wg-containerScaleRange").hide();
	map.zoomToScale(scale, false);
}

/*
 * PRINT UTILS
 */
function openPrintPanel() {	
	$("#wg-printPanelContainer").show("slide", {direction: 'up'}, "fast", setPositionContainerNamesTemplates);
}

function closePrintPanel() {
	$("#wg-printPanelContainer").hide("slide", {direction: 'up'}, "fast");
}

function getTemplatesPrint(data) {
	var templatesArray = {};	
	var tagTemplate = $(data).find('ComposerTemplates');

	if($(tagTemplate).find("ComposerTemplate").length > 0) {
		$(tagTemplate).each(function(){
			$(this).find("ComposerTemplate").each(function(){
				var nameTemplate = $(this).attr("name"); 
				var nameMap = $(this).find("ComposerMap").attr("name");
				templatesArray[nameTemplate] = nameMap;
			})
		});
		
		return templatesArray;
	}
	else
		return false;
	
}

function setPanelPrint(list) {
	// Template names
	for(var key in list) {
		var map = list[key];
		$("#wg-containerNamesTemplates").append(
			$("<div>").attr("class", "itemNameTemplate").attr("class", map).text(key)
		)
		if($("#wg-containerNamesTemplates").contents().length == 1)
			$("#selectTemplate").val(key);
	}	
}

function createPolygonToPrint() {
	var p1 = {x: 150,y: 200};
	var p2 = {x: 150,y: 600};
	var p3 = {x: 600,y: 600};
	var p4 = {x: 600,y: 200};
	
	var c1 = map.getLonLatFromPixel(p1);
	var c2 = map.getLonLatFromPixel(p2);
	var c3 = map.getLonLatFromPixel(p3);
	var c4 = map.getLonLatFromPixel(p4);
	
	var points = 
	[
	 	new OpenLayers.Geometry.Point(c1.lon, c1.lat),
	 	new OpenLayers.Geometry.Point(c2.lon, c2.lat),
	 	new OpenLayers.Geometry.Point(c3.lon, c3.lat),
	 	new OpenLayers.Geometry.Point(c4.lon, c4.lat)
	];
	
	var line = new OpenLayers.Geometry.LinearRing(points);
	var polygon = new OpenLayers.Geometry.Polygon([line]);
	
	var feature = new OpenLayers.Feature.Vector(polygon);
	editableLayer.addFeatures([feature]);
}