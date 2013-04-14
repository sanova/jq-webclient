function toogleStateButton(obj) {
	if(obj.hasClass('ui-state-pressed')) {
		obj.removeClass('ui-state-pressed');		
	}
	else {
		removeStateActiveButtons();
		obj.addClass('ui-state-pressed');
	}
	activateDeactivateControl();
}

function removeStateActiveButtons() {
	$('#toolbarMap').find('button').removeClass('ui-state-pressed');
}

function activateDeactivateControl() {
	$('#toolbarMap').find('button').each(function(){
		
		if($(this).attr('id') == 'zoomButton') {
			if($(this).hasClass('ui-state-pressed')) {
				zoomSquareControl.activate();
				$(this).attr('title', 'Disable zooming to');
				$('#panelModText').html('Zooming to enabled');
			}
			else {
				zoomSquareControl.deactivate();
				$(this).attr('title', 'Enable zooming to');
			}
		}
		
		if($(this).attr('id') == 'infoButton') {
			if($(this).hasClass('ui-state-pressed')) {
				highlightLayer.removeAllFeatures();
				infoControls.click.activate();
				$(this).attr('title', 'Disabilita Modalità Info Mappa');
				$('#panelModText').html('Modalità Info Attiva');
			}
			else {
				highlightLayer.removeAllFeatures();
				infoControls.click.deactivate();
				$(this).attr('title', 'Abilita Modalità Info Mappa');
				if($('#wg-layerInfoContainer').is(':visible'))
					$('#wg-layerInfoContainer').toggle('slide', {direction: 'right'}, 400);
			}
		}
		
		if($(this).attr('id') == 'measureDistance') {
			if($(this).hasClass('ui-state-pressed')) {
				measureControls['line'].activate();
				$(this).attr('title', 'Disabilita Misura Distanza');
				$('#panelModText').html('Misura Distanza Attivo');
				$('#outputDistanceTextLabel').html('Lunghezza: ');
			}
			else {
				measureControls['line'].deactivate();
				$(this).attr('title', 'Abilita Misura Distanza');
				$('#outputDistanceText').html("");
			}
		}
		
		if($(this).attr('id') == 'measureArea') {
			if($(this).hasClass('ui-state-pressed')) {
				measureControls['polygon'].activate();
				$(this).attr('title', 'Disabilita Misura Area');
				$('#panelModText').html('Misura Area Attivo');
				$('#outputDistanceTextLabel').html('Area: ');
			}
			else {
				measureControls['polygon'].deactivate();
				$(this).attr('title', 'Abilita Misura Area');
				$('#outputDistanceText').html("");
			}
		}
		
		if($(this).attr('id') == 'modFeature') {
			if($(this).hasClass('ui-state-pressed')) {
				if(activeLayer == "" || typeof(activeLayer) == 'undefined') { 
					alert('Seleziona Un Layer Dalla Lista Layer');
					toogleStateButton($(this));
				}
				else {
					infoIdControls.click.activate();
					modControls.activate();
					$(this).attr('title', 'Disabilita Sposta Oggetto');
					$('#panelModText').html('Modifica Posizione Elemento Attiva');
				}
			}
			else {
				editableLayer.removeAllFeatures();
				infoIdControls.click.deactivate();
				modControls.deactivate();
				$(this).attr('title', 'Abilita Sposta Oggetto');
			}
		}
		
		if($(this).attr('id') == 'printFunc') {
			if($(this).hasClass('ui-state-pressed')) {
				$('#panelModText').html('Print mode enabled');
				openPrintPanel();
				createPolygonToPrint();
				controlMod.activate();
			}
			else {
				$(this).attr('title', 'Open print panel');
				closePrintPanel();
				editableLayer.removeAllFeatures();
				clearRotationSetting();
				removeRotationControl();
				controlMod.deactivate();
			}
		}
	});
	
	if($('#toolbarMap').find('button').hasClass('ui-state-pressed')){
		if($('#panelMod').is(':hidden'))
			$('#panelMod').toggle('slide', {direction: 'left'}, 400);
	}
	else {
		if($('#panelMod').is(':visible'))
			$('#panelMod').toggle('slide', {direction: 'left'}, 400);
	}
	
	if($('#measureArea').hasClass('ui-state-pressed') || $('#measureDistance').hasClass('ui-state-pressed')) {
		if($('#outputDistance').is(':hidden'))
			$('#outputDistance').toggle('slide', {direction: 'right'}, 400);		
	}
	else {
		if($('#outputDistance').is(':visible'))
			$('#outputDistance').toggle('slide', {direction: 'right'}, 400);
		$('#outputDistanceTextLabel').html('');
	}
}