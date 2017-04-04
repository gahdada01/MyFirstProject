<?php
	include "connectDb.php";

	$tb = $conn->real_escape_string($_POST['table']);
	$field = $conn->real_escape_string($_POST['row']);
	$val = $conn->real_escape_string($_POST['value']);

	$sql = "SELECT * FROM ".$tb." WHERE ".$field."='$val'";
	$result = $conn->query($sql);

	if ($result->num_rows > 0){
		echo 'true';
	}
	else{
		echo 'false';
	}
?>