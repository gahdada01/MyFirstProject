<?php

	//Richard
	//Save or add new Account to Lykaon_db - account_tb
	include "connectDb.php";


	$closePlaces = json_decode($_POST['closePlace']);
	
	//$Xplaces = $closePlaces->placeValue_ID;


	foreach ($closePlaces as $xplace) {

			$closePlace_ = $xplace->placeValue_ID;

			$sql = "UPDATE `Lykaon_db`.`place_tb` SET `place_update` = NOW() , `place_validity`= '0' WHERE `place_tb`.`place_id` = '$closePlace_' ;";

			$conn->query($sql);
	}


	$conn->close();


	echo 'Success';

?>