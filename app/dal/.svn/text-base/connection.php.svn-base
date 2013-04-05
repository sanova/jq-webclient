<?php 

/*
 *  Classe di connessione al DB
 */

class connessioneDb {
	 	
	private static $connection;
	
	public static function getNewConnection(){
		// PARAMETRI DI CONNESSIONE AL DB DALLE VARIABILI GLOBALI (dbConfig.php)
		$host 	= $GLOBALS['gHost'];
		$db 	= $GLOBALS['gDb'];
		$port 	= $GLOBALS['gPort'];
		$user 	= $GLOBALS['gUser'];
		$pass 	= $GLOBALS['gPass'];
		
		$connectionString = "host='".$host."' port='".$port."' dbname='".$db."'user='".$user."' password='".$pass."'";
		$connection = pg_connect($connectionString);
		
		if ($connection) {
			return $connection;
		}
		else {
			return pg_last_error($connection);
		}
	}
	
	public static function closeConnection() {
		pg_close($connection);	
	}
}

?>