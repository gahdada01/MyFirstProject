<?php
	include "connectDb.php";

	$id = $conn->real_escape_string($_POST['id']);
	$account = [];
	$places = [];
	// $applications = [];

	 $sql = "SELECT * FROM account_tb WHERE account_id='$id' LIMIT 1";
	//$sql = "SELECT * FROM account_tb";
	$result =$conn->query($sql);
	
	$row = $result->fetch_assoc();
	$accountInfo = array(
	    		"id" => $row['account_id'],
	    		"clientName" => $row['account_client'],
	    		"email" => $row['account_mail'],
	    		"tel" => $row['account_tel'],
	    		"accountName" => $row['account_name'],
	    		"password" => $row['account_pass']
	    		//"reg" => $row['reg']
			  );
	
	getAllPlacesOfAccount($id);
	$account = array(
						"info" => $accountInfo,
						"places" => $places
					);
	
	echo json_encode($account);

	function getAllPlacesOfAccount($accId){
		Global $account;
		// Global $applications;
		Global $places;
		Global $conn;

		$sql = "SELECT * FROM place_tb WHERE place_account = '$accId'";

		$result = $conn->query($sql);
		
		if ($result->num_rows > 0) {
		    // output data of each row
		    while($row = $result->fetch_assoc()) {
		    	//$peppers = getAllPepper($row['ID']);
		    	$place = array(
		    		"place_id" => $row['place_id'],
		    		"placeAccount" => $row['place_account'],
		    		"placeName" => $row['place_name'],
		    		"placeTel" => $row['place_tel'],
		    		"placeAdd" => $row['place_address'],
		    		"placeRegister" => $row['place_register'],
		    		"placeUpdate" => $row['place_update'],
		    		"placeValidity" => $row['place_validity']
				  );
		    	$places[] = $place;
	    	}

	    	//echo json_encode($places);
		}
	}

?>