function changeToFilterTab(event, ui) {
	switch (ui.index) {
	    case 1:
	    	setFieldLayerCmbo($("#wb-layerComboDiv").find(".filterValue").text());
	        break;
	}
}

function setFieldLayerCmbo(layer) {
	$("#wb-fieldLayerComboDiv").find(".containerValuesCombo").children().remove();
	var valueFieldsFilter = $("#wb-fieldLayerComboDiv").find(".filterValue");
	
	valueFieldsFilter.text("");
	valueFieldsFilter.parent().find("input").val("");
	
    $.ajax({
		type: 'GET',
		url: serverURI,
		dataType: 'xml',
		data: {
	         'SERVICE': 'WFS',
	         'VERSION': '1.3',
	         'REQUEST': 'DescribeFeatureType',
	         'TYPENAME': layer
		},
		success:	function(response) {
			if( $(response).find('sequence').find('element').length == 0) {
				if(!$("#wb-formFilter").find(".warnignText").is(":visible")) {
					$("#wb-formFilter").find(".warnignText").show("fast");
					$('#execFilter').attr('disabled', 'disabled');
				}
			}
			else {
				$("#wb-formFilter").find(".warnignText").hide("fast");
				$(response).find('sequence').find('element').each(function(){
					if(typeof($(this).attr('alias')) != 'undefined' && $(this).attr('name') != "geometry") {
						if(valueFieldsFilter.text() == "") {
							valueFieldsFilter.text($(this).attr('alias'));
							valueFieldsFilter.parent().find("input").val($(this).attr('name'));
						}
						addItemsToComboLayerField($(this).attr('name'), $(this).attr('alias'));
					}
					else {
						if(typeof($(this).attr('name')) != 'undefined' && $(this).attr('name') != "geometry") {
							if($("#wb-fieldLayerComboDiv").find(".filterValue").text() == "") {
								valueFieldsFilter.text($(this).attr('name'));
								valueFieldsFilter.parent().find("input").val($(this).attr('name'));
							}							
							addItemsToComboLayerField($(this).attr('name'), null);
						}
					}
				});
			}
			enableDisableButtonFilter();
		}
	});	
}

function getFeatureFilter () {
	$('#wb-filterResultsAcoordion').accordion('destroy');
	$('#wb-filterResultsAcoordion').children().remove();
	
	var layer = $("#wb-layerComboDiv").find(".filterValue").text();
	var field = $("#wb-fieldLayerComboDiv").find(".titleItem").find("input").val();
	var value = $("#wb-valueFieldLayerInputDiv").find("input").val();
	
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
            		createAccordionFilterResults(layer, features[0]);
            		if(features[0].geometry.getBounds() != null) {
	               		bounds.bottom = features[0].geometry.getBounds().bottom - X1;
	               		bounds.top = features[0].geometry.getBounds().top + X2;
	               		bounds.left = features[0].geometry.getBounds().left - Y1;
	               		bounds.right = features[0].geometry.getBounds().right + Y2;
            		}
            	}
            	else {
	            	for(var i=0; i<features.length; i++){
	            		highlightLayer.addFeatures(features[i]);
	            		createAccordionFilterResults(layer, features[i]);
	            		if(i==0) {
	            			if(features[i].geometry.getBounds() != null) {
		            			bounds.bottom = features[i].geometry.getBounds().bottom;
		            			bounds.top = features[i].geometry.getBounds().top;
		            			bounds.left = features[i].geometry.getBounds().left;
		            			bounds.right = features[i].geometry.getBounds().right;
	            			}
	            		}
	            		else {
	            			if(features[i].geometry.getBounds() != null) {
			            		if(features[i].geometry.getBounds().bottom < bounds.bottom)
			            			bounds.bottom = features[i].geometry.getBounds().bottom;
			            		if(features[i].geometry.getBounds().top > bounds.top)
			            			bounds.top = features[i].geometry.getBounds().top;
			            		if(features[i].geometry.getBounds().left < bounds.left)
			            			bounds.left = features[i].geometry.getBounds().left;
			            		if(features[i].geometry.getBounds().right > bounds.right)
			            			bounds.right = features[i].geometry.getBounds().right;
	            			}
	            		}
		            }
            	}
            	if(typeof(bounds.bottom) !== "undefined" && bounds.bottom != null)
            		map.zoomToExtent(bounds);
            }
		}
	});
}

function createAccordionLayerFilter(layer) {
	var layer = layer.replace(/\s/g, "_");
	
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
	var layerSelected = layerSelected.replace(/\s/g, "_");
	
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