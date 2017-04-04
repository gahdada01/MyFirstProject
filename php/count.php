<?php

	//Richard
	//Count Existing Accounts
	include "connectDb.php";


	$sql = "SELECT COUNT(*) AS COUNT FROM `Lykaon_db`.`account_tb`";

	$result = $conn->query($sql);
	$row = $result->fetch_assoc();
	
	$totalExistingAccount = $row["COUNT"];
	// var_dump($row);
	
	echo $totalExistingAccount;

	$conn->close();

?>

