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
    
}

$oldScript = file_get_contents('createPaneScript.js');

$oldHTML = '
<div id="pane01" class="windowPane ui-widget-content">
	<div class="paneHeader ui-widget-header"><span class="paneTitle">Pane 01</span><div class="paneBox"><span class="paneMinimize ui-icon ui-icon-minus"></span><span class="paneMinMax paneMaximize ui-icon ui-icon-extlink"></span><span class="paneClose ui-icon ui-icon-close"></span></div><div class="clearIcons"></div></div>
	<div id="tabBar01" class="tabBar">

		<ul class="menuList jstree-drop">
			
		</ul>

		';
		/*
			<ul id="editorContextWindow01" class="editorContextMenu">

				<li><span class="ui-icon ui-icon-undo"></span>Undo</li>
				<li><span class="ui-icon ui-icon-redo"></span>Redo</li>
				<li><span class="ui-icon ui-icon-cut"></span>Cut</li>
				<li><span class="ui-icon ui-icon-copy"></span>Copy</li>
				<li><span class="ui-icon ui-icon-paste"></span>Paste</li>
				<li>
					Find...
					<ul>
						<li><span class="ui-icon ui-icon-search"></span>Find in File</li>
						<li><span class="ui-icon ui-icon-zoomin"></span>Find in All Files</li>
						<li><span class="ui-icon ui-icon-wrench"></span>Find and Replace</li>

					</ul>
				</li>


			</ul>
			*/
$oldHTML .= '
		

	</div>

</div>
';

$newScript = preg_replace('/%pane%/', sprintf("#pane%02d", $paneCounter), $oldScript);
$newScript = preg_replace('/%tabBar%/', sprintf("#tabBar%02d", $paneCounter), $newScript);
$newScript = preg_replace('/%paneX%/', sprintf("pane%02d", $paneCounter), $newScript);
$newScript = preg_replace('/%paneTitle%/', sprintf("Pane #%02d", $paneCounter), $newScript);

$newHTML = preg_replace('/\d+/', sprintf("%02d", $paneCounter), $oldHTML);

$rval = array(
    'success' => TRUE,
    'html' => $newHTML,
    'script' => $newScript,
    );
    
file_put_contents('test.out', print_r($rval, TRUE), FILE_APPEND);
echo json_encode($rval);


//newPaneTab = preg_replace('/\d+/', sprintf("%02d", $paneCounter), $newPaneTab);


?>
