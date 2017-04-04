<?php
	include "connectDb.php";

	$appId = $conn->real_escape_string($_POST['id']);

	$sql = "UPDATE application_tb SET dis=0 WHERE ID='$appId'";
	if($conn->query($sql) === true){
		echo 'Success';
	}else{
		echo 'Fail';
	}
	$conn->close();
?>