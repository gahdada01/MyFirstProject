<?php
	include "connectDb.php";

	$id = $conn->real_escape_string($_POST['id']);
	$account = [];
	$applications = [];

	$sql = "SELECT * FROM Account_tb WHERE id='$id' LIMIT 1";
	$result =$conn->query($sql);
	
	$row = $result->fetch_assoc();
	$accountInfo = array(
	    		"id" => $row['id'],
	    		"clientName" => $row['client_name'],
	    		"email" => $row['mail'],
	    		"tel" => $row['number'],
	    		"accountName" => $row['account_name'],
	    		"password" => $row['account_pass'],
	    		"reg" => $row['reg']
			  );
	
	getAllApplicationOfAccount($id);
	$account = array(
						"info" => $accountInfo,
						"applications" => $applications
					);
	
	echo json_encode($account);

	function getAllApplicationOfAccount($accId){
		Global $account;
		Global $applications;
		Global $conn;

		$sql = "SELECT account_application_tb.ID, account_application_tb.application_id, account_application_tb.pepper_max, account_application_tb.start_date, account_application_tb.expiration, application_tb.application_name FROM account_application_tb INNER JOIN application_tb ON account_application_tb.application_id=application_tb.ID WHERE account_application_tb.account_id='$accId' AND account_application_tb.dis='1' AND application_tb.dis='1'";
		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	$peppers = getAllPepper($row['ID']);
		    	$app = array(
		    		"id" => $row['ID'],
		    		"appId" => $row['application_id'],
		    		"name" => $row['application_name'],
		    		"pepperMax" => $row['pepper_max'],
		    		"startDate" => $row['start_date'],
		    		"expiration" => $row['expiration'],
		    		"peppers" => $peppers
				  );
		    	$applications[] = $app;
	    	}
		}
	}

	function getAllPepper($accAppID){
		Global $conn;
		
		$peppers = [];

		$sql = "SELECT * FROM pepper_tb WHERE account_application_id='$accAppID' AND dis='1'";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	$pepper = array(
		    		"id" => $row['ID'],
		    		"accountApplicationId" => $row['account_application_id'],
		    		"bodyId" => $row['BodyID']
				  );
		    	$peppers[] = $pepper;
	    	}
		}
		return $peppers;
	}
?>