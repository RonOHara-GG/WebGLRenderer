<?php
	$vid = $_GET['v'];
	header('Content-type: application/xml');
	$url = "http://www.youtube.com/get_video_info?video_id=" . $vid;
	$url .= "&Html5=True";
	//echo $url;
	echo file_get_contents($url );
?>