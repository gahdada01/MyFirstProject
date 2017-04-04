<?php
	include "connectDb.php";

	$sql = "SELECT * FROM application_tb WHERE dis=1";
	$result=$conn->query($sql);

	$applications = [];

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	    	$application = array(
	    		"id" => $row['ID'],
	    		"name" => $row['application_name'],
	    		"appID" => $row['application_id'],
	    		"systemURL" => $row['application_systemURL'],
	    		"manualURL" => $row['application_manualURL']
			  );
	    	$applications[] = $application;
    	}  
	}
	echo json_encode($applications);
?>