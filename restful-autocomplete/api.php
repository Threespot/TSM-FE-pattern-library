<?php
$qs = $_GET['q'];
$res = array();

for ($i=0; $i < strlen($qs); $i++) {
	array_push($res, array('id'=>$i, 'name'=>"Dummy $qs response $i"));
}

echo json_encode($res);
?>