<?php

/*
 * Autenticazione al DB.
 * Settaggio ed esecuzione della query sulla tabella login
 * 
 */

class queryAuth {
	public $tableLogin;
	public $fieldUser;
	public $fieldPass;
	public $userLogin;
	public $passLogin;
	public $typeUser;
	public $queryLogin;
	public $queryLoginResult;
	public $numResult;
	
	function __construct($tableLogin, $userLogin, $passLogin, $fieldUser, $fieldPass, $typeUser) {
		$this-> tableLogin				= $tableU;
		$this-> userLogin				= $userLogin;
		$this-> passLogin				= $passLogin;
		$this-> fieldUser				= $fieldUser;
		$this-> fieldPass				= $fieldPass;
		$this-> typeUser				= $typeUser;
	}
	
	public function setQueryLogin() {
		$sep = "\"";  // QUOTE AL NOME TABELLA (CASESENSITIVE)
		$this-> queryLogin =	"SELECT * FROM ".$sep.$this-> tableLogin.$sep."
									WHERE {$this-> fieldUser} = '{$this-> userLogin}'
									AND {$this-> fieldPass} = '{$this-> passLogin}'
									";
		
		return $this-> queryLogin;
	}
	
	public function execQueryLogin($connection, $query) {
		$this-> queryLoginResult = pg_query($connection, $query);
		
		return $this-> queryLoginResult;
	}
	
	public function getNumResult($result) {
		$this-> numResult = pg_num_rows($result);
		
		return $this-> numResult;
	}
	
	public function getTypeUser($result) {
		$typeUserLoginResult	= pg_fetch_row($result);
		$typeUserLogin			= $typeUserLoginResult[4];
		
		return $typeUserLogin;
	}
}

?>