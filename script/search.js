var countFeature;

function getLayersToSearch() {
	countFeature = 0;
	var listLayersToFind = new Array;
	var value = $('#wb-valueSeacrh').val();
	var lastLayer = false;
	
	$('#wb-SeacrhResultsAcoordion').accordion('destroy');
	$('#wb-SeacrhResultsAcoordion').children().remove();

	$('.layerCheckBox input[type=checkbox]').each(function(){
		listLayersToFind.push($(this).attr('id'));
	});
	
	$('#countResult').html("");
	//$('#divLoading').show();
	createContainerResults();
	
	for(var i=0; i<listLayersToFind.length; i++)  {
//		if(i == (listLayersToFind.length - 1))
//			lastLayer = true;
		getFeaturesSearch(listLayersToFind[i], value, lastLayer);
	}
}

function getFeaturesSearch(currentLayer, value, lastLayer) {
	//var listLayerToFindString = getStringLayerToShow(listLayersToFind);
	var lastFeature = false;
	
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
	         'TYPENAME': currentLayer,
	         'REQUEST': 'GetFeature',
	         'MAXFEATURES': '5000',
	         'OUTPUTFORMAT': 'GML3',
	         'SRS': BBOXfromProject['SRS']
		},
		success:	function(response) {
	       	var format = new OpenLayers.Format.GML(gmlOptions);
        	var features = format.read(response);
            if(features){
            	var trovatoRisultato = false;
                for(var i=0; i<features.length; i++){
                	for(var attribute in $(features[i]).attr('attributes')) {
                		if($(features[i]).attr('attributes')[attribute] != null) {
                			if($(features[i]).attr('attributes')[attribute].toUpperCase().indexOf(value.toUpperCase()) != -1) {
                				if (!trovatoRisultato) {
                					if($('#wb-SeacrhResults').is(':hidden'))
                    		        	$('#wb-SeacrhResults').toggle('slide', {direction: 'right'}, 400);
                					trovatoRisultato = true;
                				}
                				
                				if (i % 10 == 0) {
                					createFeatureFind(features[i]);	
                				}
                				highlightLayer.addFeatures(features[i]);
                				
                				
                				//if($('#layerFind_'+currentLayer).length <= 0)
                					//createAccordionLayerFeature(currentLayer);
                				countFeature = countFeature+1;
                   				//$('#countResult').html(countFeature);
                				
                				
                			}
						}
        				if(i == (features.length - 1))
        					lastFeature = true;               				
        				if(lastLayer == true && lastFeature == true)
        					$('#divLoading').hide();
                	}
                }
                $('#countResult').html(countFeature);
            }
		}
	});

}

function createAccordionLayerFeature(currentLayer) {
	var featureContainer = $("<div>").attr("id", 'featuresFind-'+currentLayer).attr('class', 'singleFeatureContainer');
	$('#wb-SeacrhResultsAcoordion').append(
		$("<div>").attr('id', 'layerFind_'+currentLayer).attr("class", "layerFindContainer").append(
				$("<h3>").append(
					$("<a>").attr("href", "#").html(currentLayer)
				),
				featureContainer
			)
	);
}

			function createContainerResults() {
				var featureContainer = $("<div>").attr("id", 'featuresFindLayer').attr('class', 'singleFeatureContainer');
				$('#wb-SeacrhResultsAcoordion').append(
					$("<div>").attr('id', 'layerFind_Results').attr("class", "layerFindContainer").append(
							$("<h3>").append(
								$("<a>").attr("href", "#").html('layerFind_Results')
							),
							featureContainer
						)
				);
			}
			
			function createFeatureFind(feature) {
				var featureContainer = $('#featuresFindLayer');
				var featureAttributeContainer = $("<div>").attr('id', 'featureAttributes-'+feature.fid).attr('class', 'divFeatureAttribute');
				featureContainer.append(
					$("<div>").attr('id', 'feature-'+feature.fid).attr('class', 'bgGray').html('Elemento ID '+feature.fid),
					featureAttributeContainer
				);
				
				for(var attribute in $(feature).attr('attributes')) {
					featureAttributeContainer.append(
						$("<div>").attr('class', 'divAttributesFeature').html(attribute + ': ' 
							+$(feature).attr('attributes')[attribute])
					);
				}
				//$('#wb-SeacrhResultsAcoordion').accordion('destroy');
				//$('#wb-SeacrhResultsAcoordion').accordion(propertyAccordion);
			
			}

function createAccordionFeature(currentLayer, feature) {
	var featureContainer = $('#featuresFind-'+currentLayer);
	var featureAttributeContainer = $("<div>").attr('id', 'featureAttributes-'+feature.fid).attr('class', 'divFeatureAttribute');
	featureContainer.append(
		$("<div>").attr('id', 'feature-'+feature.fid).attr('class', 'bgGray').html('Elemento ID '+feature.fid),
		featureAttributeContainer
	);
	
	for(var attribute in $(feature).attr('attributes')) {
		featureAttributeContainer.append(
			$("<div>").attr('class', 'divAttributesFeature').html(attribute + ': ' 
				+$(feature).attr('attributes')[attribute])
		);
	}
	//$('#wb-SeacrhResultsAcoordion').accordion('destroy');
	//$('#wb-SeacrhResultsAcoordion').accordion(propertyAccordion);

}
