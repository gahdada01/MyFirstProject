<?php
	include "connectDb.php";

	$app = json_decode($_POST['data']);
	$appStatus = $conn->real_escape_string($_POST['status']);
	$appId =  $conn->real_escape_string($_POST['id']);

	$appName = $conn->real_escape_string($app->name);
	$choregrapheAppID = $conn->real_escape_string($app->ID);
	$webURL = $conn->real_escape_string($app->weburl);
	$manualURL = $conn->real_escape_string($app->manualurl);
	$date = date("Y-m-d H:i:s");

	$conflicts = checkIfApplicationIsAlreadyExist();

	if ($conflicts == 'None') {
		if($appStatus == 'new'){
			$sql = "INSERT INTO application_tb(application_name, application_id, application_systemURL, application_manualURL,reg,dis) VALUES('$appName', '$choregrapheAppID','$webURL','$manualURL','$date','1')";
		}elseif ($appStatus == 'edit') {
			$sql = "UPDATE application_tb SET application_name='$appName', application_id='$choregrapheAppID', application_systemURL='$webURL', application_manualURL='$manualURL', reg='$date' WHERE ID='$appId'";
		}
		$conn->query($sql);
		$conn->close();
		echo 'Success';
	}else{
		$conn->close();
		echo json_encode(array('conflicts'=>$conflicts));
	}

	function checkIfApplicationIsAlreadyExist(){
		Global $appName, $choregrapheAppID, $webURL, $manualURL, $conn, $appStatus, $appId;

		if($appStatus == 'new'){
			$sql = "SELECT * FROM application_tb WHERE (application_name='$appName' OR application_id='$choregrapheAppID' OR application_systemURL='$webURL' OR application_manualURL='$manualURL') AND dis=1";
		}
		elseif ($appStatus == 'edit') {
			$sql = "SELECT * FROM application_tb WHERE (application_name='$appName' OR application_id='$choregrapheAppID' OR application_systemURL='$webURL' OR application_manualURL='$manualURL') AND dis=1 AND ID!='$appId'";
		}
		$result = $conn->query($sql);

		if($result->num_rows > 0){
			$conflictInAppName = 0;
			$conflictInAppID = 0;
			$conflictInWebURL = 0;
			$conflictInManualURL = 0;

			while($row = $result->fetch_assoc()) {
		    	if(strtoupper($row['application_name']) == strtoupper ( $appName )){
		    		$conflictInAppName++;
		    	}
		    	if(strtoupper($row['application_id']) == strtoupper ( $choregrapheAppID )){
		    		$conflictInAppID++;
		    	}
		    	if(strtoupper($row['application_systemURL']) == strtoupper($webURL)){
		    		$conflictInWebURL++;
		    	}
		    	if(strtoupper($row['application_manualURL']) == strtoupper($manualURL)){
		    		$conflictInManualURL++;
		    	}
    		} 
    		return array(
    					'appNameNoOfConflicts'=>$conflictInAppName,
    					'appIDNoOfConflicts'=>$conflictInAppID,
    					'webURLNoOfConflicts'=>$conflictInWebURL,
    					'manualURLNoOfConflicts'=>$conflictInManualURL
    				);
		}
		else{
			return 'None';
		}
	}
?>