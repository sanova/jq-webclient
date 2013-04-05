<?php

include $CHAMOIS_ROOT.'/app/config/dbConfig.php';
include $CHAMOIS_ROOT.'/app/dal/connection.php';

class dalEditingLayer {
	
	private $geomFeature;
	private $idFeature;
	
	private $errorQuery;
	
	private $connection;
	private $sep;
	
	function __construct() {
		$this-> geomFeature	= $GLOBALS['fldGeom'];
		$this-> idFeature	= $GLOBALS['fldAreaFaunistica'];
		
		$this-> connection	= connessioneDb::getNewConnection();
		$this-> sep 		= "\"";
	
	}
	
	function updateGeomFeature($table, $idFeature, $lat, $long) {
	
		$countError				= 0;
		
		pg_query ("BEGIN");
		
		$stringUpdateFeature 		= "UPDATE ".$this-> sep.$table.$this-> sep."
										SET
										{$this-> geomFeature}='POINT($long $lat)' 
										WHERE {$this-> idFeature}=$idFeature
										";

		$execUpdateFeature			= pg_query($this-> connection , $stringUpdateFeature);

		$this-> errorQuery 			= pg_last_error($this-> connection);


		if($execUpdateFeature == FALSE) {
			$countError = $countError + 1;
		}
		
		if($countError == 0) {
			pg_query($this-> connection , 'COMMIT');
			return TRUE;
		}
		else {
			pg_query($this-> connection , 'ROLLBACK');
			return $this-> errorQuery;
		}
	
	}
	
	function updateWebGeomAreeFaun($idAreaFaun, $lat, $long) {
	
		$countError				= 0;
	
		pg_query ("BEGIN");
	
		$stringUpdateAreaFaun 		= "UPDATE ".$this-> sep.$this-> tbAreeFaun.$this-> sep."
										SET
										{$this-> geomAreaFaun}='POINT($long $lat)'
										WHERE {$this-> idAreaFaun}=$idAreaFaun
									  ";
					
		$execUpdateAreaFaun			= pg_query($this-> connection , $stringUpdateAreaFaun);
		
		$this-> errorQuery 			= pg_last_error($this-> connection);
		
		
		if($execUpdateAreaFaun == FALSE) {
			$countError = $countError + 1;
		}
	
		if($countError == 0) {
		pg_query($this-> connection , 'COMMIT');
			return TRUE;
		}
		else {
			pg_query($this-> connection , 'ROLLBACK');
			return $this-> errorQuery;
		}
	
	}
	
	function addWebAreaFaun($estensione, $comune, $lat, $long) {
		$countError				= 0;
	
		$stringaAddAreeFaun = "INSERT INTO ".$this-> sep.$this-> tbAreeFaun.$this-> sep."
								(
								{$this-> geomAreaFaun},
								{$this-> estensione},
								{$this-> dataAttivazione},
								{$this-> comune},
								{$this-> autorizzazione},
								{$this-> visitabile},
								{$this-> idArea}
								)
								VALUES
								(
								'POINT($long $lat)',
								$estensione,
								'10-06-2012',
								$comune,
								'Si',
								TRUE,
								1
								)
								";
			
		$execAddAreeFaun	= pg_query($this-> connection , $stringaAddAreeFaun);
		
		$this-> errorQuery	= pg_last_error($this-> connection);
		
		if($execAddAreeFaun == FALSE) {
			$countError = $countError + 1;
		}
		
		if($countError == 0) {
			pg_query($this-> connection , 'COMMIT');
			return TRUE;
		}
		else {
			pg_query($this-> connection , 'ROLLBACK');
			return $this-> errorQuery;
		}
		
	}
	
	function deleteWebAreaFaun($idAreaFaun) {
		$countError				= 0;
	
		
		pg_query ("BEGIN");
	
		$stringaDelAreaFaun		=   "DELETE FROM ".$this-> sep.$this-> tbAreeFaun.$this-> sep."
										WHERE {$this-> idAreaFaun}=$idAreaFaun";
			
		$execDelAreaFaun		= pg_query($this-> connection , $stringaDelAreaFaun);
			
		$this-> errorQueryAree	= pg_last_error($this-> connection);
	
		if($execDelAreaFaun == FALSE) {
			$countError = $countError + 1;
		}
	
		$stringaDelInterventi	=    "DELETE FROM ".$this-> sep.$this-> tbInterventi.$this-> sep."
										WHERE {$this-> idAreaFaun}=$idAreaFaun";
			
		$execDelInterventi		= pg_query($this-> connection , $stringaDelInterventi);
			
		$this-> errorQueryInterventi = pg_last_error($this-> connection);
	
		if($execDelInterventi == FALSE) {
			$countError = $countError + 1;
		}
	
		if($countError == 0) {
			pg_query($this-> connection , 'COMMIT');
			return TRUE;
		}
		else {
			pg_query($this-> connection , 'ROLLBACK');
			$errorTot = "{$this-> errorQueryAree} <br> {$this-> errorQueryInterventi}";
			return $errorTot;
		}
	}
}

?>