<?php
	
	//Update Status of Accounts in Lykaon_db - account_tb
	include "connectDb.php";

	$accId  = $_POST['accId'];
	$selected  = $_POST['selectedOption'];

	$sql = "UPDATE account_tb SET account_status ='$selected', account_update = NOW() WHERE account_id='$accId'";
	$conn->query($sql);
	
	$conn->close();

	echo 'Success';

?>