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

function getFeatureFilter() {
	$('#wb-filterResultsAcoordion').accordion('destroy');
	$('#wb-filterResultsAcoordion').children().remove();
	
	var layer = $('select#wb-layerCombo').val();
	var field = $('select#wb-fieldLayerCombo').val();
	var value = $('#wb-valueFieldLayerInput').val();
	
	var gmlOptions = {
	    featureType: "point",
	    featureNS: serverURI
	};
    
	highlightLayer.removeAllFeatures();
	
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
	         'SRS': EPSGdefault
		},
		success:	function(response) {
	       	var format = new OpenLayers.Format.GML(gmlOptions);
        	var features = format.read(response);
            if(features){
            	if($('#layerFilterFind_'+layer).length <= 0)
            		createAccordionLayerFilter(layer);
                for(var i=0; i<features.length; i++){
                	if($(features[i]).attr('attributes')[field].toUpperCase().indexOf(value.toUpperCase()) != -1) {
                		//highlightLayer.addFeatures(features[i]);
                		createAccordionFilterResults(layer, features[i]);
                	}
                }
            }
		}
	});
}

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