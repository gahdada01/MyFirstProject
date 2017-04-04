<?php
	include "connectDb.php";

	$sql = "SELECT * FROM Account_tb";
	$result = $conn->query($sql);
	$accounts = [];
	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	    	$account = array(
	    		"id" => $row['id'],
	    		"name" => $row['client_name'],
	    		"email" => $row['mail'],
	    		"phone" => $row['number'],
	    		"username" => $row['account_name'],
	    		"password" => $row['account_pass'],
	    		"status" => $row['account_dis']
			  );
	    	$accounts[] = $account;
    	}
	    
    }
	echo json_encode($accounts);

	$conn->close();
?>