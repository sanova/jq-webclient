$(function(){
	// Inizializzo il tabb panel pannello laterale sinistro in alto
	$('#wg-leftTabTop').tabs();
	// Evento cambio tab (da layer a filtro e viceversa). Ripulisce la combo dei campi layer
	$( "#wg-leftTabTop" ).bind( "tabsselect", function(event, ui) {
		$('select#wb-fieldLayerCombo option').remove();
		$('#wb-valueFieldLayerInput').val("");
		$('#wb-valueSeacrh').val("");
		highlightLayer.removeAllFeatures();
		changeToFilterTab(event, ui);
		// Rimozione Valore numero risultati ricerca
		$('#countResult').html("");
		// Rimozione risultati ricerca
		$('#wb-SeacrhResultsAcoordion').children().remove();
		// Rimozione risultati filtro
		$('#wb-filterResultsAcoordion').children().remove();
		if($('#wb-SeacrhResults').is(':visible'))
			$('#wb-SeacrhResults').toggle('slide', {direction: 'right'}, 400);
	});
	// Evento sulla selezione layer
    $('#wb-layerCombo').change(function(){
    	setFieldLayerCmbo($(this).val());
    });
    // Tasto Submit filter
    $('#execFilter').button({
    	label: "Esegui"
	}).click(function(){
		getFeatureFilter();
	});
    
    // Tasto Submit Seacrh
    $('#execSeacrh').button({
    	label: "Esegui"
	}).click(function(){
		getLayersToSearch();
	});
	
	// Inizializzazione tasto funzione get info
	$('#infoButton').button().click(function(){
		toogleStateButton($(this));
	});
	
	// Inizializzazione tasto calcola distanza
	$('#measureDistance').button().click(function(){
		toogleStateButton($(this));
	});
	
	// Inizializzazione tasto calcola aree
	$('#measureArea').button().click(function(){
		toogleStateButton($(this));
	});

	$('#modFeature').button().click(function(){
		toogleStateButton($(this));
	});
	
	$('#printFunc').button().click(function(){
		toogleStateButton($(this));
	});
	
	// Inizializzazione tasto chiusura pannello info elementi mappa
	$('#closeInfoDiv').button().click(function(){
		$('#wg-layerInfoContainer').toggle('slide', {direction: 'right'}, 400);
	});
	
	// Get coords from input fields
	$("#wg-coordinateX").keyup(function(e){
		if(e.keyCode == 13) goToCoords($("#wg-coordinateX").val(), $("#wg-coordinateY").val());
	}).attr("title", "Set coordinates you want and press <Enter> to go to position");
	$("#wg-coordinateY").keyup(function(e){
		if(e.keyCode == 13) goToCoords($("#wg-coordinateX").val(), $("#wg-coordinateY").val());
	}).attr("title", "Set coordinates you want and press <Enter> to go to position");
	
	// Scale input field
	$("#wg-containerScaleRange").hide();
	$("#wg-scalesValue").mouseover(function(){
		viewScaleRangeContainer();
	}).mouseleave(function(){
		hideScaleRangeContainer();
	}).keyup(function(e){
		if(e.keyCode == 13) goToScaleValue($(this).val());
	}).attr("title", "Choose a scale or write a value and press <Enter>");
	
	// Print panel
	$("#wg-printPanelContainer").hide();
	$("#selectTemplate").mouseover(function(){
		$("#wg-containerNamesTemplates").show();
	}).mouseleave(function(){ 
		$("#wg-containerNamesTemplates").hide();
	});

});