<?php



if (!isset($_POST) || !count($_POST)) {
    $paneCounter = 13;
}
else {
    if (!($data = json_decode($_POST['jsonSend']))) {
    	$rval = array(
    		'success' => FALSE,
    		'failReasons' => array(
    			"Couldn't json_decode POST['jsonSend']",
    		),
    	);
    	echo json_encode($rval);
    	return;
    }
    $data = $data[0];
    $paneCounter = $data->paneCounter;
    $delPanes = $data->delPanes;
    
}

$oldScript = file_get_contents('createPaneScript.js');
$oldHTML = file_get_contents('createPane.html');
		

$newScript = preg_replace('/%pane%/', sprintf("#pane%02d", $paneCounter), $oldScript);
$newScript = preg_replace('/%tabBar%/', sprintf("#tabBar%02d", $paneCounter), $newScript);
$newScript = preg_replace('/%paneX%/', sprintf("pane%02d", $paneCounter), $newScript);
$newScript = preg_replace('/%paneTitle%/', sprintf("Pane %02d", ($paneCounter - $delPanes)), $newScript);


$newHTML = preg_replace('/\d+/', sprintf("%02d", $paneCounter), $oldHTML);
$newHTML = preg_replace('/%paneTitle%/', 'Pane ' . sprintf("%02d", ($paneCounter - $delPanes)), $newHTML);

$rval = array(
    'success' => TRUE,
    'html' => $newHTML,
    'script' => $newScript,
    'paneId' => sprintf("#pane%02d", $paneCounter),
    );
    
file_put_contents('test.out', print_r($rval, TRUE), FILE_APPEND);
echo json_encode($rval);


//newPaneTab = preg_replace('/\d+/', sprintf("%02d", $paneCounter), $newPaneTab);


?>
