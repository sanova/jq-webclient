<?php

/*
 *  DEFINIZIONE CLASSE PER L'URL RICHIESTO ALL'ACCESSO
 *  
 *  $protocol 	= $_SERVER['SERVER_PROTOCOL'] 	= Corrisponde al protocollo http (stringa HTTP/1.1)
 *  $host		= $_SERVER['HTTP_HOST']			= Corrisponde al dominio o host (www.dominio.com)
 *  $script		= $_SERVER['SCRIPT_NAME']		= Contiene il path completo dello script php attualmente richiamato \
 *  											  ( /esempio/test.php - Presente dopo il dominio)
 *	$params		= $_SERVER['QUERY_STRING']		= Corrisponde ai parametri richiamati con lo script php corrente 
 *												  (es. param1=1&param2=2)
 *
 *
 *	L'url completo corrisponde alla combinazione delle variabili sopra descritte:
 *
 *	$urlTot = $protocol + $host + script + $param
 *	$urlTot = $protocol :// $host $script ? $param 
 */ 

class urlRequest {
	
	public $protocol;
	public $host;
	public $script;
	public $params;
	public $protocolHtml;
	public $uriRequest;
	public $urlTot;
	
	function __construct($protocol, $host, $script, $params, $currentUri) {
		$this-> protocol			= $protocol;
		$this-> host				= $host;
		$this-> script				= $script;
		$this-> params				= $params;
		$this-> uriRequest			= $currentUri;
		
	}
	
	public function getProtocol() {
		$this-> protocolHtml = 	strpos(strtolower($this-> protocol), 'https') === FALSE ? 'http' : 'https';
		
		return $this-> protocolHtml;
	}
	
	public function getUrlScript() {
		return $this-> script;
	}
	
	public function getUrlTot($protHtml) {
		$this-> urlTot	= 	$protHtml.'://'.$this-> host . $this-> script. '?' . $this-> params;
		
		return $this-> urlTot;
	}
	
	public function getUri() {		
		return $this-> uriRequest;
	}
}

?>