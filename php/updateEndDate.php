<?php

	//Richard
	//Update the End Date of an account in Lykaon_db - account_tb
	include "connectDb.php";

	$endDate = $_POST['endDate'];
	$accountId = $_POST['accountID'];


	// var_dump($_POST);
	// echo $accountId;

	$sql = "UPDATE account_tb SET account_end ='$endDate', account_update = NOW() WHERE account_id = '$accountId'";


	if ($conn->query($sql) === TRUE) {
         echo "Success";
	 } else {
	     echo "Error";
	}   

	$conn->close();
?>