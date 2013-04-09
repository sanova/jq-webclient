var pathImageDown = "./images/gis_icons/arrow_down_16.png";
var mathMax = Math.max;
var mathMin = Math.min;

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
	
	$("#wg-containerScaleRange").css("width", width).offset({ left: x, top: yScaleContainer}).mouseover(function(){
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

function goToExtentSquare(obj) {
	var bounds = obj.feature.geometry.getBounds();
	map.zoomToExtent(bounds);
	editableLayer.removeAllFeatures();
}

/*
 * PRINT UTILS
 */
function openPrintPanel() {	
	$("#wg-printPanelContainer").show("slide", {direction: 'up'}, "fast");
	var currentScale = map.getScale().toString().split(".")[0];
	$("#wg-containerPrintScale").find(".printValue").text("1:" + currentScale);
}

function closePrintPanel() {
	if($("#wg-printPanelContainer").is(":visible"))
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
	// **************
	// Template names
	// **************
	for(var key in list) {
		var mapPrint = list[key];
		$("#wg-containerPrintTemplate").append(
			$("<div>").attr("class", "titleItem").append(
				$("<div>").attr("class", "printValue").addClass("map-"+mapPrint).text(key),
				$("<div>").attr("class", "printDesc").text("Select template"),
				$("<div>").attr("class", "printImg").append(
					$("<img>").attr("src", pathImageDown)
				)
			),
			$("<div>").attr("class", "containerPrintValuesCombo").addClass("box-shadow-combo")
		)
		break;
	}
	
	for(var key in list) {
		var mapPrint = list[key];
		$("#wg-containerPrintTemplate").find(".containerPrintValuesCombo").append(
			$("<div>").attr("class", "itemsValuesTemplate").addClass("map-"+mapPrint).text(key).click(function() {
				$(this).parent().parent().find(".printValue").text($(this).text());
			})
		)
	}
	
	// *****
	// Scale
	// *****
	$("#wg-containerPrintScale").append(
		$("<div>").attr("class", "titleItem").append(
			$("<div>").attr("class", "printValue").text(""),
			$("<div>").attr("class", "printDesc").text("Select scale"),
			$("<div>").attr("class", "printImg").append(
				$("<img>").attr("src", pathImageDown)
			)
		),
		$("<div>").attr("class", "containerPrintValuesCombo").addClass("box-shadow-combo")
	)
	
	for(var key in scaleArray) {
		var valueScale = scaleArray[key];
		var denomScale = valueScale.split(":")[1];
		if(parseInt(denomScale) < parseInt(minScale)) {
			$("#wg-containerPrintScale").find(".containerPrintValuesCombo").append(
				$("<div>").attr("class", "itemsValuesScale").text(valueScale).click(function() {
					$(this).parent().parent().find(".printValue").text($(this).text());
	
					var polyBound = editableLayer.features[0].geometry.getBounds();
					var originObj = polyBound.getCenterLonLat();
					
					var origin = new OpenLayers.Geometry.Point(originObj.lon, originObj.lat);
					var scale = ($(this).text().split(":")[1])/map.getScale();
					editableLayer.features[0].geometry.resize(scale, origin);
					editableLayer.redraw();
					goToScaleValue($(this).text().split(":")[1]);
					map.setCenter(originObj);
					
				})
			)
		}
	}
	$("#wg-containerPrintScale").find(".containerPrintValuesCombo").append(
		$("<div>").attr("class", "itemsValuesScale").text("1:"+minScale).click(function() {
			$(this).parent().parent().find(".printValue").text($(this).text());

			var polyBound = editableLayer.features[0].geometry.getBounds();
			var originObj = polyBound.getCenterLonLat();
			
			var origin = new OpenLayers.Geometry.Point(originObj.lon, originObj.lat);
			var scale = ($(this).text().split(":")[1])/map.getScale();
			editableLayer.features[0].geometry.resize(scale, origin);
			editableLayer.redraw();
			goToScaleValue($(this).text().split(":")[1]);
			map.setCenter(originObj);
			
		})
	)	
	
	
	/*
	 * DPI
	 */
	var dpiDefault = dpiArray[0];
	$("#wg-containerPrintDpi").append(
		$("<div>").attr("class", "titleItem").append(
			$("<div>").attr("class", "printValue").text(dpiDefault),
			$("<div>").attr("class", "printDesc").text("Select dpi"),
			$("<div>").attr("class", "printImg").append(
				$("<img>").attr("src", pathImageDown)
			)
		),
		$("<div>").attr("class", "containerPrintValuesCombo").addClass("box-shadow-combo")
	)
	
	for(var i=0; i<dpiArray.length; i++) {
		var dpiVal = dpiArray[i];
		$("#wg-containerPrintDpi").find(".containerPrintValuesCombo").append(
			$("<div>").attr("class", "itemsValuesDpi").text(dpiVal).click(function() {
				$(this).parent().parent().find(".printValue").text($(this).text());			
			})
		)
	}
	
	/*
	 * FORMAT
	 */
	var pdfFromat = "pdf";
	var pngFormat = "png";
	var jpgFormat = "jpg";
	$("#wg-containerPrintFormat").append(
		$("<div>").attr("class", "titleItem").append(
			$("<div>").attr("class", "printValue").text(pdfFromat),
			$("<div>").attr("class", "printDesc").text("Select format"),
			$("<div>").attr("class", "printImg").append(
				$("<img>").attr("src", pathImageDown)
			)
		),
		$("<div>").attr("class", "containerPrintValuesCombo").addClass("box-shadow-combo")
	)
	$("#wg-containerPrintFormat").find(".containerPrintValuesCombo").append(
		$("<div>").attr("class", "itemsValuesDpi").text(pdfFromat).click(function() {
			$(this).parent().parent().find(".printValue").text($(this).text());			
		}),
		$("<div>").attr("class", "itemsValuesDpi").text(pngFormat).click(function() {
			$(this).parent().parent().find(".printValue").text($(this).text());			
		}),
		$("<div>").attr("class", "itemsValuesDpi").text(jpgFormat).click(function() {
			$(this).parent().parent().find(".printValue").text($(this).text());			
		})
	)
}

function createPolygonToPrint() {
	editableLayer.removeAllFeatures();
	
	var scale = 0.7;
	
	var mapBound = map.getExtent();
	var mapCenter = map.getCenter();
	var origin = new OpenLayers.Geometry.Point(mapCenter.lon, mapCenter.lat);
	
	var c1 = {lon: mapBound.left, lat: mapBound.bottom};
	var c2 = {lon: mapBound.left, lat: mapBound.top};
	var c3 = {lon: mapBound.right, lat: mapBound.top};
	var c4 = {lon: mapBound.right, lat: mapBound.bottom};
	
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
		feature.geometry.resize(scale, origin);
	
	editableLayer.addFeatures([feature]);
	
}

function getRotationPolygon(polygon) {
	var vertex = polygon.geometry.components[0].components;
	
	// Check rotation directrion and get angle
	var sides = getSidesTriangle(vertex);	
	
	// Calculate rotation
	if( sides != false)
		var rotation = Math.atan(sides["sideY"] / sides["sideX"]) / Math.PI * 180;
	else
		rotation = 0;
	
	return rotation;
}

function getSidesTriangle(vertex) {
	var sides = {};
	
	if((vertex[3].x > vertex[0].x && vertex[3].y > vertex[0].y) || (vertex[0].x > vertex[3].x && vertex[0].y > vertex[3].y)) {
		var sideX = (vertex[3].x - vertex[0].x);
		var sideY = (vertex[3].y - vertex[0].y);
		
		sides["sideX"] = sideX;
		sides["sideY"] = sideY;
	}
	
	else if((vertex[3].x > vertex[0].x && vertex[3].y < vertex[0].y) || (vertex[3].x < vertex[0].x && vertex[3].y > vertex[0].y)) {
		var sideX = (vertex[3].x - vertex[0].x);
		var sideY = (vertex[3].y - vertex[0].y);
		
		sides["sideX"] = sideX;
		sides["sideY"] = sideY;
	}
	
	else sides = false;
	
	return sides;
	
}

function getPrint() {
	
	var template = $("#wg-containerPrintTemplate").find(".printValue").text();
	var scale = $("#wg-containerPrintScale").find(".printValue").text();
	var dpi = $("#wg-containerPrintDpi").find(".printValue").text();
	var format = $("#wg-containerPrintFormat").find(".printValue").text();
	var rotation = getRotationPolygon(editableLayer.features[0]);
	
	var listLayer = getListVisibleLayer();
	var listLayerToView = getStringLayerToShow(listLayer);
	
	var polyBound = editableLayer.features[0].geometry.getBounds();	
	var extent = polyBound.left+","+polyBound.bottom+","+polyBound.right+","+polyBound.top;
	
	var urlPrintRequest = 
		serverURI + 
		"&SERVICE=WMS" +
		"&VERSION=1.3.0" +
		"&REQUEST=GetPrint" +
		"&TEMPLATE=" + template +
		"&map0:ROTATION=" + rotation +
		"&map0:extent=" + extent +
		"&BBOX=" + extent +
		"&CRS=" + SRSMap.projCode +
		"&LAYERS=" + listLayerToView +
		"&FORMAT=" + format +
		"&map0:SCALE=" + scale +
		"&DPI=" + dpi +
		"&TRANSPARENTE=true";
	
//	if(format != "pdf")
		window.open(urlPrintRequest);
//	else {
//		$("<div>").attr("id", "wg-windowPdfDownload").appendTo("body").append(
//			$("<object>").attr("id", "pdfObject").attr("data", urlPrintRequest).attr("type", "application/pdf")
//		)
//	}
} 

function getCurrentScaleMap() {
	return map.getScale();
} 