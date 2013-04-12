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
    
	// Inizializzazione tasto funzione zoom square
	$('#zoomButton').button().click(function(){
		toogleStateButton($(this));
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
	
	$("#wg-windowPdfDownload").dialog({
		height: 450,
		width: 650,
		modal:true,
		autoOpen: false
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
	var isAnimating = false;
	
	$("#wg-containerPrintTemplate").mouseover(function(){
		if(!isAnimating) {
			isAnimating = true;
			$(this).find(".containerPrintValuesCombo").show("fast", function(){
				setTimeout(function () { isAnimating = false; }, 100);
			});
			$(this).find(".printImg").css("opacity", "0.5");
		}
	}).mouseleave(function(){
		$(this).find(".containerPrintValuesCombo").hide("fast");
		$(this).find(".printImg").css("opacity", "1");
	});
	$("#wg-containerPrintScale").mouseover(function(){
		if(!isAnimating) {
			isAnimating = true;
			$(this).find(".containerPrintValuesCombo").show("fast", function(){
				setTimeout(function () { isAnimating = false; }, 100);
			});
			$(this).find(".printImg").css("opacity", "0.5");
		}
	}).mouseleave(function(){
		$(this).find(".containerPrintValuesCombo").hide("fast");
		$(this).find(".printImg").css("opacity", "1");
	});
	$("#wg-containerPrintDpi").mouseover(function(){
		if(!isAnimating) {
			isAnimating = true;
			$(this).find(".containerPrintValuesCombo").show("fast", function(){
				setTimeout(function () { isAnimating = false; }, 100);
			});
			$(this).find(".printImg").css("opacity", "0.5");
		}
	}).mouseleave(function(){
		$(this).find(".containerPrintValuesCombo").hide("fast");
		$(this).find(".printImg").css("opacity", "1");
	});
	$("#wg-containerPrintFormat").mouseover(function(){
		if(!isAnimating) {
			isAnimating = true;
			$(this).find(".containerPrintValuesCombo").show("fast", function(){
				setTimeout(function () { isAnimating = false; }, 100);
			});
			$(this).find(".printImg").css("opacity", "0.5");
		}
	}).mouseleave(function(){
		$(this).find(".containerPrintValuesCombo").hide("fast");
		$(this).find(".printImg").css("opacity", "1");
	});
	$("#buttonPrint").button({ label: "Print" }).click(function(){
		getPrint();
	});

});