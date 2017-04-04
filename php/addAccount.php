<?php

	//Richard
	//Save or add new Account to Lykaon_db - account_tb
	include "connectDb.php";

	$Account = json_decode($_POST['data']);
	$AccountStatus = $conn->real_escape_string($_POST['status']);


	$AccountID = $conn->real_escape_string($_POST['id']);
	
    $clientName = $conn->real_escape_string($Account->ClientName);
	$email = $conn->real_escape_string($Account->Email);
	$telephone = $conn->real_escape_string($Account->Tel);
	$accountName = $conn->real_escape_string($Account->AccountName);
	// $accountPass = md5($conn->real_escape_string($Account->AccountPass));
	$accountPass = $conn->real_escape_string($Account->AccountPass);
	$start_date = $conn->real_escape_string($Account->Start_Date);
	$end_date = $conn->real_escape_string($Account->End_Date); 
	$places = $Account->Place;
	$editPlaces = $Account->PlaceEdit;

	$date = date("Y-m-d H:i:s");

	$conflicts = checkIfAccountExistInDatabase();


	if( $conflicts == 'None'){
		if ($AccountStatus == 'new'){


			$sql = "INSERT INTO `Lykaon_db`.`account_tb` (`account_id`, `account_client`, `account_tel`, `account_mail`, `account_name`, `account_pass`, `account_register`, `account_update`, `account_start`, `account_end`, `account_status`) VALUES (NULL, '$clientName', '$telephone', '$email', '$accountName', '$accountPass', NOW(), NOW(), '$start_date', '$end_date', '1');";

			$conn->query($sql);

			$accountId = mysqli_insert_id($conn);
			
			foreach ($places as $place) {	

					$name = $place->name;
					$tel = $place->tel;
					$address = $place->address;

					$sql1  = "INSERT INTO `Lykaon_db`.`place_tb` (`place_id`, `place_account`, `place_pepper`, `place_name`, `place_tel`, `place_address`, `place_call`, `place_detectname`, `place_register`, `place_update`, `place_validity`) VALUES (NULL, '$accountId', '', '$name', '$tel', '$address', '', '', NOW(), NOW(), '1');";

					$conn->query($sql1);
			}
		}

		elseif ($AccountStatus == 'edit') {


			$sql = "UPDATE `Lykaon_db`.`account_tb` SET `account_client` = '$clientName', `account_tel` = '$telephone', `account_mail` = '$email', `account_name` = '$accountName', `account_pass` = '$accountPass', `account_update` = NOW()  WHERE `account_tb`.`account_id` = '$AccountID' ;";

			$conn->query($sql);

			foreach ($editPlaces as $editPlace) {	

					$name = $editPlace->nameEdit;
					$tel = $editPlace->telEdit;
					$address = $editPlace->addressEdit;

					$sql1  = "INSERT INTO `Lykaon_db`.`place_tb` (`place_id`, `place_account`, `place_pepper`, `place_name`, `place_tel`, `place_address`, `place_call`, `place_detectname`, `place_register`, `place_update`, `place_validity`) VALUES (NULL, '$AccountID', '', '$name', '$tel', '$address', '', '', NOW(), NOW(), '1');";

					$conn->query($sql1);
			}

		}
		$conn->close();
		echo 'Success';
	}
	else{
		$conn->close();
		echo json_encode(array('conflicts'=>$conflicts));
	}

	function checkIfAccountExistInDatabase(){
		Global $clientName, $accountName, $email,$AccountStatus,$AccountID, $conn;

		if($AccountStatus == 'new'){
			$sql = "SELECT * FROM account_tb WHERE account_client ='$clientName' OR account_mail ='$email' OR account_name='$accountName'";
		}
		elseif ($AccountStatus == 'edit') {
			$sql = "SELECT * FROM account_tb WHERE (account_client ='$clientName' OR account_mail ='$email' OR account_name='$accountName') AND account_id!='$AccountID'";
		}

		$result = $conn->query($sql);

		if($result->num_rows > 0){
			$conflictInClientName = 0;
			$conflictInEmail = 0;
			$conflictInAccountName = 0;

			while($row = $result->fetch_assoc()) {
		    	if(strtoupper($row['account_client']) == strtoupper ($clientName)){
		    		$conflictInClientName++;
		    	}
		    	if(strtoupper($row['account_mail']) == strtoupper($email)){
		    		$conflictInEmail++;
		    	}
		    	if(strtoupper($row['account_name']) == strtoupper($accountName)){
		    		$conflictInAccountName++;
		    	}
    		} 
    		return array(
    					'clientNameNoOfConflicts'=>$conflictInClientName,
    					'emailNoOfConflicts'=>$conflictInEmail,
    					'accountNameNoOfConflicts'=>$conflictInAccountName
    				);
		}
		else{
			return 'None';
		}
	}

?>