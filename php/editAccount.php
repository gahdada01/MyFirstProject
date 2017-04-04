<?php
	include "connectDb.php";

	//$id = $conn->real_escape_string($_POST['id']);
	$id = $conn->real_escape_string($_POST['id']);
	$account = [];
	$places = [];


	$sql = "SELECT * FROM account_tb WHERE account_id='$id' LIMIT 1";

	$result =$conn->query($sql);
	
	$row = $result->fetch_assoc();

	$accountInfo = array(
	    		"Lid" => $row['account_id'],
	    		"Lclient" => $row['account_client'],
	    		"Lmail" => $row['account_mail'],
	    		"Ltel" => $row['account_tel'],
	    		"Lname" => $row['account_name'],
	    		"Lpass" => $row['account_pass']
			  );

	
	getEditPlace($id);

	$account = array(
						"info" => $accountInfo,
						"place" => $places
					);
	
	echo json_encode($account);

	function getEditPlace($accId) {
		Global $places;
		Global $conn;

		$sql = "SELECT * FROM place_tb WHERE place_account='$accId'";

			$result = $conn->query($sql);

			if ($result->num_rows > 0) {
			    // output data of each row
			    while($row = $result->fetch_assoc()) {
			    	$place = array(
			    		"Pid" => $row['place_id'],
			    		"Paccount" => $row['place_account'],
			    		"Pname" => $row['place_name'],
			    		"Ptel" => $row['place_tel'],
			    		"Padd" => $row['place_address'],
			    		"Pvalid" => $row['place_validity']
					  );
			    	$places[] = $place;
		    	}
		    	//echo json_encode($places);
			}
	}
	
?>













