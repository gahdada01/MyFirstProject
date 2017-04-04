<?php
	include "connectDb.php";

	$appId = $conn->real_escape_string($_POST['id']);

	$sql = "SELECT * FROM application_tb WHERE ID='$appId' AND dis=1";
	$result = $conn->query($sql);

	$row = $result->fetch_assoc();
	$appData = array(
	    		"id" => $row['ID'],
	    		"name" => $row['application_name'],
	    		"appID" => $row['application_id'],
	    		"webURL" => $row['application_systemURL'],
	    		"manualURL" => $row['application_manualURL'],
	    		"reg" => $row['reg']
			  );

	echo json_encode($appData);
?>