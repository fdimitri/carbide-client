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
$originId = $data->originId;
$chatTarget = $data->chatTarget;
		// 'tabName': tabName,
		// 'tabType' : tabType,
		// 'paneId': paneId,
		// 'originId': originId,
if ($tabType == 'chat') {
	$newDiv = '<div id="' . $chatTarget . '_';
	$html = $newDiv . 'Container" class="cContainer">' .
	$newDiv . 'ChatBox" class="cChatBox" chatRoom="' . $chatTarget . '" ></div>' .
	$newDiv . 'UserBox" class="cUserBox" chatRoom="' . $chatTarget . '" ></div>' .
	'<div style="clear:both;"></div>' .
	$newDiv . 'InputBoxContainer" class="cInputBoxContainer" chatRoom="' . $chatTarget . '" >' .
	'<input chatRoom="' . $chatTarget . '" class="cInputBox" id="' . $chatTarget . 'cInputBox type="text" role="textbox" value="" /></div>' .
	'</div>';
	$rval = array(
		'success' => TRUE, 
		'html' => $html,
		'script' => 'function test() { console.log("Hi from PHP and ' . $tabName . '!"); }; test();',
	);
}
else if ($tabType == 'file') {
	$newDiv = '<div id="' . $tabName . '_';
	$html = $newDiv . 'Container" class="eContainer">' .
	$newDiv . 'EditBox" class="eEditBox"><textarea id="' . $tabName . '"></textarea></div>' .
	'</div>';
	$rval = array(
		'success' => TRUE, 
		'html' => $html,
		'script' => 'function test() { console.log("Hi from file creation PHP and ' . $tabName . '!"); }; test();',
	);
}

echo json_encode($rval);
return;
?>
