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
file_put_contents('test.out', print_r($_POST, TRUE));
file_put_contents('json.out', print_r($data, TRUE));
$data = $data[0];
$tabName = $data->tabName;
$newDiv = '<div id="' . $tabName . '_';
$html = $newDiv . 'Container" class="cContainer">' .
$newDiv . 'ChatBox" class="cChatBox" chatRoom="' . $tabName . '" >ChatBox</div>' .
$newDiv . 'UserBox" class="cUserBox" chatRoom="' . $tabName . '" >UserBox</div>' .
'<div style="clear:both;"></div>' .
$newDiv . 'InputBoxContainer" class="cInputBoxContainer" chatRoom="' . $tabName . '" ><input chatRoom="' . $tabName . '" class="cInputBox" id="' . $tabName . 'cInputBox type="text" role="textbox" value="" /></div>' .
'</div>';
$rval = array(
	'success' => TRUE, 
	'html' => $html,
	'script' => 'function test() { console.log("Hi from PHP and ' . $tabName . '!"); }; test();',
);
echo json_encode($rval);
return;
?>
