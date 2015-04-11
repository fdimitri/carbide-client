<?php
if ($data = json_decode($_POST['jsonSend'])) {
} 
else {
	$rval = array(
		'success' => FALSE,
		'failReasons' => array(
			"Couldn't json_decode POST['jsonSend']",
		),
	);
	echo json_encode($rval);
	file_put_contents('return.out', print_r($rval, TRUE));
	return;
}
$data = $data[0];
$tabName = $data->tabName;
$tabType = $data->tabType;
$paneId = $data->paneId;
//$originId = $data->originId;
$chatTarget = $data->chatTarget;

		// 'tabName': tabName,
		// 'tabType' : tabType,
		// 'paneId': paneId,
		// 'originId': originId,
		$script = "console.log('test script eval');";
if ($tabType == 'chat') {
	$html = file_get_contents('createContentChat.html');
	$html = str_replace('%tabName%', $tabName, $html);
	$html = str_replace('%srcPath%', $data->srcPath, $html);
	$html = str_replace('%chatTarget%', $data->chatTarget, $html);

	$script = file_get_contents('createContentChat.js');
	$script = str_replace('%tabName%', $tabName, $script);
	$script =  str_replace('%srcPath%', $data->srcPath, $script);
	$script =  str_replace('%paneId%', $data->paneId, $script);
	$script = str_replace('%chatTarget%', $data->chatTarget, $script);
	$rval = array(
		'success' => TRUE, 
		'html' => $html,
		'script' => $script,
	);
}
else if ($tabType == 'file') {
	$html = file_get_contents('createContentFile.html');
	$html = str_replace('%tabName%', $tabName, $html);
	$html = str_replace('%srcPath%', $data->srcPath, $html);

	$script = file_get_contents('createContentFile.js');
	$script = str_replace('%tabName%', $tabName, $script);
	$script =  str_replace('%srcPath%', $data->srcPath, $script);
	$script =  str_replace('%paneId%', $data->paneId, $script);


	$rval = array(
		'success' => TRUE, 
		'html' => $html,
		'script' => $script,
	);
}

echo json_encode($rval);
return;
?>
