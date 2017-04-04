<?php

	//Richard
	//Add Place for Existing Accounts
	include "connectDb.php";

	$place_name = $_POST['PnameAdd'];
	$place_tel = $_POST['telAdd'];
	$place_address = $_POST['addAdd'];
	$accountId = $_POST['accountID'];


	// var_dump($_POST);
	// echo $accountId;

	$sql = "INSERT INTO `Lykaon_db`.`place_tb` (`place_id`, `place_account`, `place_pepper`, `place_name`, `place_tel`, `place_address`, `place_call`, `place_detectname`, `place_register`, `place_update`, `place_validity`) VALUES (NULL, '$accountId', '', '$place_name', '$place_tel', '$place_address', '0', '', NOW(), NOW(), '1');";

	if ($conn->query($sql) === TRUE) {
         echo "Success";

	 } else {
	     echo "Error";

	}   

	$conn->close();

?>

