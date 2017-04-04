<?php
	
	//Richard
	//Get all data from Lykaon_db - account_tb
	include "connectDb.php";

	$sql = "SELECT * FROM account_tb";
	$result = $conn->query($sql);
	$accounts = [];

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	    	$account = array(
	    		"Lid" => $row['account_id'],
	    		"Lclient" => $row['account_client'],
			  	"Ltel" => $row['account_tel'],
			  	"Lmail" => $row['account_mail'],
			  	"Lname" => $row['account_name'],
			  	"Lpass" => $row['account_pass'],
			  	"Lregister" => $row['account_register'],
			  	"Lupdate" => $row['account_update'],
			  	"Lstart" => $row['account_start'],
			  	"Lend" => $row['account_end'],
			  	"Lvalid" => $row['account_status']
			  );
	    	$accounts[] = $account;
    	}
	    
    }
	echo json_encode($accounts);

	$conn->close();
?>