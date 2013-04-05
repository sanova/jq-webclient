<?php
	session_start();
	ob_start();
?>

<?php
/*
 *  Pagina Principale (Test Accesso al DB
 */
include $_SERVER['DOCUMENT_ROOT'].'/chamois/app/config/globalPath.php';
include $CHAMOIS_ROOT.'/app/config/dbConfig.php';
include $CHAMOIS_ROOT.'/app/dal/connection.php';
include $CHAMOIS_ROOT.'/app/dal/security/authentication.php';

$urlRequest = $_POST['url'];

if (isset($_POST['user']) && isset($_POST['pass'])) {
	$userLogin			= $_POST['user'];
	$passLogin			= $_POST['pass'];
}
else {
	header('location: ../../../mainLogin.php?url='.$urlRequest);
}

// IMPOSTAZIONE QUERY LOGIN A DB
$objLogin = new queryAuth($GLOBALS['tableLogin'], $userLogin, $passLogin, $GLOBALS['fldUser'], $GLOBALS['fldPass'], $GLOBALS['fldTypeUser']);
$objLogin-> setQueryLogin();


// ESECUZIONE QUERY ED ESITO
$objLogin-> execQueryLogin(connessioneDb::getNewConnection(), $objLogin-> queryLogin);


if (!$objLogin-> queryLoginResult) {
	echo "Utente non autorizzato";
	header('location: ../../../mainLogin.php?url='.$urlRequest.'&nologin=1');
}
else {
	$objLogin-> getNumResult($objLogin-> queryLoginResult);
	$typeUser = $objLogin-> getTypeUser($objLogin-> queryLoginResult);
	
	if ($objLogin-> numResult != 0) {
		$_SESSION['logged'] 	= 'ok';
		$_SESSION['user']		= $userLogin;
		$_SESSION['typeUser']	= $typeUser;
		header('location: '.$urlRequest);
	}
	else {
		header('location: ../../../mainLogin.php?url='.$urlRequest.'&nologin=1');
	}
}
//connessioneDb::closeConnection();

?>