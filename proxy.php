<?php 	
	$url = $_GET["url"];
	print json_encode(file_get_contents($url));
?>