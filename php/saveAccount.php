<?php
	include "connectDb.php";

	$Account = json_decode($_POST['data']);
	$AccountStatus = $conn->real_escape_string($_POST['status']);
	$AccountID = $conn->real_escape_string($_POST['id']);
	
    $clientName = $conn->real_escape_string($Account->ClientName);
	$email = $conn->real_escape_string($Account->Email);
	$telephone = $conn->real_escape_string($Account->Tel);
	$accountName = $conn->real_escape_string($Account->AccountName);
	$accountPass = $conn->real_escape_string($Account->AccountPass);
	$date = date("Y-m-d H:i:s");

	$conflicts = checkIfAccountExistInDatabase();
	if( $conflicts == 'None'){
		if($AccountStatus == 'new'){
			
			$sql = "INSERT INTO Account_tb(client_name, mail, number, account_name, account_pass, account_reg) VALUES('$clientName','$email','$telephone','$accountName','$accountPass','$date')";
			$conn->query($sql);

			saveAccountApplicationsToDatabase($conn->insert_id, $Account->Applications);
		}
		elseif ($AccountStatus == 'edit') {
			$sql = "UPDATE Account_tb SET client_name='$clientName', mail='$email', number='$telephone', account_name='$accountName', account_pass='$accountPass', account_reg='$date' WHERE id='$AccountID'";
			$conn->query($sql);
			
			setAllAccountApplicationDisToZero($AccountID);
			saveAccountApplicationsToDatabase($AccountID, $Account->Applications);
		}

		$conn->close();
		echo 'Success';
	}
	else{
		$conn->close();
		echo json_encode(array('conflicts'=>$conflicts));
	}

	function saveAccountApplicationsToDatabase($accId, $apps){
		Global $date;
		Global $pepperMax;
		Global $conn;

		foreach ($apps as $app) {		
			$appRegId = $app->id;
			$appId = $app->appId;
			$startDate = $app->start;
			$limitDate = $app->limit;
			$pepperMax = $app->pepperMax;
			 
			if($app->status == 'new'){
				$sql = "INSERT INTO account_application_tb(account_id, application_id, pepper_max, start_date, expiration, reg, dis) VALUES('$accId','$appId','$pepperMax', '$startDate','$limitDate','$date','1')";
				$conn->query($sql);
			}
			else{
				$sql = "UPDATE account_application_tb SET account_id='$accId', application_id='$appId', pepper_max='$pepperMax', start_date='$startDate', expiration='$limitDate', reg='$date', dis=1 WHERE ID='$appRegId'";
				$conn->query($sql);
			}
		}
	}
	function setAllAccountApplicationDisToZero($accId){
		Global $conn;

		$sql = "UPDATE account_application_tb SET dis='0' WHERE account_id=$accId";
		$conn->query($sql);
	}
	function checkIfAccountExistInDatabase(){
		Global $clientName, $accountName, $email,$AccountStatus,$AccountID, $conn;

		if($AccountStatus == 'new'){
			$sql = "SELECT * FROM Account_tb WHERE client_name='$clientName' OR mail='$email' OR account_name='$accountName'";
		}
		elseif ($AccountStatus == 'edit') {
			$sql = "SELECT * FROM Account_tb WHERE (client_name='$clientName' OR mail='$email' OR account_name='$accountName') AND id!='$AccountID'";
		}
		$result = $conn->query($sql);

		if($result->num_rows > 0){
			$conflictInClientName = 0;
			$conflictInEmail = 0;
			$conflictInAccountName = 0;

			while($row = $result->fetch_assoc()) {
		    	if(strtoupper($row['client_name']) == strtoupper ( $clientName )){
		    		$conflictInClientName++;
		    	}
		    	if(strtoupper($row['mail']) == strtoupper($email)){
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