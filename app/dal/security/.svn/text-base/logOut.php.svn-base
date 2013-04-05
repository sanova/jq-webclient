<?php
	session_start();
?>

<?php	
	class logOut {
				
		function destroySession () {
			$_SESSION = array();
			session_destroy();
			
			if (!isset($_SESSION['logged']) || $_SESSION['logged'] == '') {
				return TRUE;
			}
			else {
				return FALSE;
			}
		}
	}
?>