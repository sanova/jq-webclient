function getListVisibleLayer() {
	var listLayer = {};
	$('.layerCheckBox input[type=checkbox]:checked').each(function(){
		listLayer[$(this).attr('id')] = $(this).attr('id');
	});
	return listLayer;
}

function getLegendLayer(layer) {	
	var imageUrl = serverURI+'&SERVICE=WMS&VERSION=1.3&REQUEST=GetLegendGraphics&FORMAT=image/png&EXCEPTIONS=application/vnd.ogc.se_inimage&WIDTH=195&LAYERS='+layer;
	$('#wg-layerLegendContainer').append(
		$('<div>').attr('class', 'recordLegend').append(
			$('<img>').attr('id', 'img-'+layer).attr('src', imageUrl)
		)
	);
}

function collapseCenterPanelOnLeft(obj, duration, leftPx){
	// obj 		= elemento div da contrarre ( elemento jquery $('#foo') )
	// duration = millisecondi entro i quali deve concludersi l'effetto
    // leftPx 	= di quanto deve contrarsi il div in numero px
	obj.animate({
	    left: leftPx + 'px'
	},{
		duration: duration, queue:false
	});
}