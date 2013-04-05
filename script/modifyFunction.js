function getDelWfsLayer (layer, idFeature) {
	
	var gmlOptions = {
		    featureType: "point",
		    featureNS: wmsURI
		};
	var gmlOptionsIn = OpenLayers.Util.extend(
	    OpenLayers.Util.extend({}, gmlOptions)
	);
	
    Ext.Ajax.request({
        url: wmsURI,
        params: {
          'SERVICE': 'WFS',
          'VERSION': '1.1.1',
          'TYPENAME': layer,
          'REQUEST': 'GetFeature',
          'MAXFEATURES': '5000',
          'OUTPUTFORMAT': 'GML3',
          'SRS': 'EPSG:' + epsgcode,
          'FEATUREID': idFeature
        },
        method: 'GET',
        scope: this,
        success: function (response) {
        	var format = new OpenLayers.Format.GML(gmlOptions);
        	var features = format.read(response.responseText);
            if(features){
                for(var i=0; i<features.length; i++){
                    editableLayer.addFeatures(features[i]);
                }
            }
		}
	});

}

function execModificaFeature(layerWMS, feature, activeLayer) {
	$.ajax({
		type: 'GET',
		url: 'web-service/modifyFeature.php',	
		dataType:	'text',
		data: {
			layer:					activeLayer,
			id: 					feature.fid,
			latitudine:				feature.geometry.y,
			longitudine:			feature.geometry.x
		},
		success:	function(response) {
			if	(response == 1) {
				layerWMS.redraw(true);
				editableLayer.removeAllFeatures();
				alert('Salvataggio dati completato');
			}
			else {
				alert('Aggiornamento non eseguito: '+result);
			}
        },
        error: function (response) {
    		alert('Salvataggio dati non eseguito')
		}
	});
}