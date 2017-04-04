<?php

	//Richard
	//Add Place for Existing Accounts
	include "connectDb.php";

	$accountExpired = [];
	//$now = (new \DateTime())->format('Y-m-d');

	$now = date("Y-m-d");
	// var_dump($_POST);
	// echo $accountId;

	$sql = "SELECT * FROM account_tb WHERE account_status = '1'";

	$result =$conn->query($sql);

	if ($result->num_rows > 0) {
		    while($row = $result->fetch_assoc()) {
		    	$checkValidStat = array(
		    		"id" => $row['account_id'],
		    		"end" => $row['account_end'],
		    		"status" => $row['account_status']
				  );
		    	$accountExpired[] = $checkValidStat;
	    	}

	    	echo json_encode($accountExpired);
		}

	foreach ($accountExpired as $validStats) {	

		$id = $validStats['id'];
		$end = $validStats['end'];

			if ($end <= $now) {

				$sql1 = "UPDATE `Lykaon_db`.`account_tb` SET `account_status`= 0 WHERE `account_tb`.`account_id` = '$id' ;";

				$conn->query($sql1);

			}
			
	}

	$conn->close();

?>

