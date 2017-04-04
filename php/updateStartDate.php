<?php

	//Richard
	//Update the Start Date of an account in Lykaon_db - account_tb
	include "connectDb.php";

	$startDate = $_POST['startDate'];
	$accountId = $_POST['accountID'];


	// var_dump($_POST);
	// echo $accountId;

	$sql = "UPDATE account_tb SET account_start ='$startDate', account_update = NOW() WHERE account_id = '$accountId'";


	if ($conn->query($sql) === TRUE) {
         echo "Success";
	 } else {
	     echo "Error";
	}   

	$conn->close();
?>