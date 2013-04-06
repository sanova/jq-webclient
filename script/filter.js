function changeToFilterTab(event, ui) {
	switch (ui.index) {
	    case 1:
	    	setFieldLayerCmbo($('select#wb-layerCombo').val());
	        break;
	}
}

function setFieldLayerCmbo(layer) {
	$('select#wb-fieldLayerCombo option').remove();
    $.ajax({
		type: 'GET',
		url: serverURI,
		dataType: 'xml',
		data: {
	         'SERVICE': 'WFS',
	         'VERSION': '1.1.1',
	         'REQUEST': 'DescribeFeatureType',
	         'TYPENAME': layer
		},
		success:	function(response) {
			$(response).find('sequence').find('element').each(function(){
				if(typeof($(this).attr('alias')) != 'undefined')
					$('select#wb-fieldLayerCombo').append($('<option />').attr('value', $(this).attr('name')).text($(this).attr('alias')));
				else {
					if(typeof($(this).attr('name')) != 'undefined')
						$('select#wb-fieldLayerCombo').append($('<option />').attr('value', $(this).attr('name')).text($(this).attr('name')));
				}
			});
		}
	});	
}

function getFeatureFilter () {
	$('#wb-filterResultsAcoordion').accordion('destroy');
	$('#wb-filterResultsAcoordion').children().remove();
	
	var layer = $('select#wb-layerCombo').val();
	var field = $('select#wb-fieldLayerCombo').val();
	var value = $('#wb-valueFieldLayerInput').val();
	
	var gmlOptions = {
	    featureType: "polygon",
	    featureNS: serverURI
	};
	
	highlightLayer.removeAllFeatures();
	
	if(value != "") {
		var filter =         	  	
			"<Filter>" +
				"<PropertyIsEqualTo>" +
					"<PropertyName>"+ field +"</PropertyName>" +
					"<Literal>"+ value +"</Literal>" +
				"</PropertyIsEqualTo>" +
			"</Filter>";			
	}
	else
		return;
	
	$.ajax({
		type: 'GET',
		url: serverURI,
		dataType: 'xml',
		data: {         
	          'SERVICE': 'WFS',
	          'VERSION': '1.1.1',
	          'TYPENAME': layer,
	          'REQUEST': 'GetFeature',
	          'MAXFEATURES': '5000',
	          'OUTPUTFORMAT': 'GML3',
	          'SRS': EPSGdefault,
	          //'FEATUREID': idFeature
	          'FILTER': filter
		},
		success:	function(response) {
	       	var format = new OpenLayers.Format.GML(gmlOptions);
        	var features = format.read(response);
        	
        	var bounds = new OpenLayers.Bounds();
        	var format = new OpenLayers.Format.GML(gmlOptions);
        	var features = format.read(response);
            if(features){
            	createAccordionLayerFilter(layer);
            	if(features.length == 1) {
            		highlightLayer.addFeatures(features[0]);
            		createAccordionFilterResults(layer, features[i]);
            		//boundsCatasto.extend(features[0].geometry.getBounds());
               		bounds.bottom = features[0].geometry.getBounds().bottom - X1;
               		bounds.top = features[0].geometry.getBounds().top + X2;
               		bounds.left = features[0].geometry.getBounds().left - Y1;
               		bounds.right = features[0].geometry.getBounds().right + Y2;
            	}
            	else {
	            	for(var i=0; i<features.length; i++){
	            		highlightLayer.addFeatures(features[i]);
	            		createAccordionFilterResults(layer, features[i]);
	            		if(i==0) {
	            			bounds.bottom = features[i].geometry.getBounds().bottom;
	            			bounds.top = features[i].geometry.getBounds().top;
	            			bounds.left = features[i].geometry.getBounds().left;
	            			bounds.right = features[i].geometry.getBounds().right;
	            		}
	            		else {
		            		if(features[i].geometry.getBounds().bottom < boundsCatasto.bottom)
		            			bounds.bottom = features[i].geometry.getBounds().bottom;
		            		if(features[i].geometry.getBounds().top > boundsCatasto.top)
		            			bounds.top = features[i].geometry.getBounds().top;
		            		if(features[i].geometry.getBounds().left < boundsCatasto.left)
		            			bounds.left = features[i].geometry.getBounds().left;
		            		if(features[i].geometry.getBounds().right > boundsCatasto.right)
		            			bounds.right = features[i].geometry.getBounds().right;
	            		}
		            }
            	}
            	map.zoomToExtent(bounds);
            }
        	
        	
//            if(features){
//            	if($('#layerFilterFind_'+layer).length <= 0)
//            		createAccordionLayerFilter(layer);
//                for(var i=0; i<features.length; i++){
//                	if($(features[i]).attr('attributes')[field].toUpperCase().indexOf(value.toUpperCase()) != -1) {
//                		highlightLayer.addFeatures(features[i]);
//                		createAccordionFilterResults(layer, features[i]);
//                	}
//                }
//            }
		}
	});
}



//function getFeatureFilter() {
//	$('#wb-filterResultsAcoordion').accordion('destroy');
//	$('#wb-filterResultsAcoordion').children().remove();
//	
//	var layer = $('select#wb-layerCombo').val();
//	var field = $('select#wb-fieldLayerCombo').val();
//	var value = $('#wb-valueFieldLayerInput').val();
//	
//	var gmlOptions = {
//	    featureType: "polygon",
//	    featureNS: serverURI
//	};
//    
//	highlightLayer.removeAllFeatures();
//	
//	$.ajax({
//		type: 'GET',
//		url: serverURI,
//		dataType: 'xml',
//		data: {
//	         'SERVICE': 'WFS',
//	         'VERSION': '1.1.1',
//	         'TYPENAME': layer,
//	         'REQUEST': 'GetFeature',
//	         'MAXFEATURES': '5000',
//	         'OUTPUTFORMAT': 'GML3',
//	         'SRS': EPSGdefault
//		},
//		success:	function(response) {
//	       	var format = new OpenLayers.Format.GML(gmlOptions);
//        	var features = format.read(response);
//            if(features){
//            	if($('#layerFilterFind_'+layer).length <= 0)
//            		createAccordionLayerFilter(layer);
//                for(var i=0; i<features.length; i++){
//                	if($(features[i]).attr('attributes')[field].toUpperCase().indexOf(value.toUpperCase()) != -1) {
//                		highlightLayer.addFeatures(features[i]);
//                		createAccordionFilterResults(layer, features[i]);
//                	}
//                }
//            }
//		}
//	});
//}

function createAccordionLayerFilter(layer) {
	var featureContainer = $("<div>").attr("id", 'featuresFindFilter-'+layer).attr('class', 'singleFeatureContainer');
	
	$('#wb-filterResultsAcoordion').append(
		$("<div>").attr('id', 'layerFilterFind_'+layer).attr("class", "layerFindContainer").append(
			$("<h3>").append(
				$("<a>").attr("href", "#").html(layer)
			),
			featureContainer
		)
	);
}

function createAccordionFilterResults(layerSelected, feature) {		
	var featureAttributeContainer = $("<div>").attr('id', 'featureFilterAttributes-'+feature.fid).attr('class', 'divFeatureAttribute');

	$('#featuresFindFilter-'+layerSelected).append(
		$("<div>").attr('id', 'featureFilter-'+feature.fid).attr('class', 'bgGray').html('Elemento ID '+feature.fid),
		featureAttributeContainer
	);
	
	for(var attribute in $(feature).attr('attributes')) {
		if($(feature).attr('attributes')[attribute] == null) 
			$(feature).attr('attributes')[attribute] = 'null';
		featureAttributeContainer.append(
			$("<div>").attr('class', 'divAttributesFeature').html(attribute + ': ' 
				+$(feature).attr('attributes')[attribute])
		);
	}
	$('#wb-filterResultsAcoordion').accordion('destroy');
	$('#wb-filterResultsAcoordion').accordion(propertyAccordion);
}