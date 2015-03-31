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

$oldScript = '
$(function() {
	$("#pane01").click(function() {
		$(".windowPane").addClass("lowZ");
		$(".windowPane").removeClass("highZ");
		$("#pane01").removeClass("lowZ");
		$("#pane01").addClass("highZ");
	});
});

$(function() {
	$("#editorContextWindow01").menu({
		select: function(event, ui) {
			$("#editorContextWindow01").hide();
			alert("Menu element clicked!");
		}
	});

	$("#pane01").on("contextmenu", function(event) {
		$("#editorContextWindow01").show();
		$("#editorContextWindow01").position({
			collision: "none",
			my: "left top",
			of: event
		});
		console.log(event);

		return false;
	});

	$(document).click(function(event) {
		$("#editorContextWindow01").hide();
	});

	$("#editorContextWindow01").on("contextmenu", function(event) {
		return false;
	});
	$("#editorContextWindow01").hide();
	$(".windowPane").addClass("lowZ");
	$(".windowPane").removeClass("highZ");
	$("#pane01").removeClass("lowZ");
	$("#pane01").addClass("highZ");

});


$(function() {
	$("#pane01").resizable({
		containment: "parent",
		start: function(event, ui) {
			$(".windowPane").addClass("lowZ");
			$(".windowPane").removeClass("highZ");
			//ui.element.addClass("activeWindow");
			$(".windowPane").each(function() {
				var cssObj = {
					top: $(this).position().top,
					left: $(this).position().left
				};
				$(this).css(cssObj);
			});
			$(".windowPane").each(function() {
				$(this).css("position", "absolute");

			});
			ui.element.addClass("highZ");

		}

	});
	$("#pane01").draggable({
		containment: "parent",
		handle: ".paneHeader",
		start: function(event, ui) {
			$(".windowPane").addClass("lowZ");
			$(".windowPane").removeClass("highZ");
			$(".windowPane").each(function() {
				var cssObj = {
					top: $(this).position().top,
					left: $(this).position().left
				};
				$(this).css(cssObj);
			});
			$(".windowPane").each(function() {
				$(this).css("position", "absolute");

			});
			//$( this ).addClass("activeWindow");

			$(this).addClass("highZ");
		}

	});
	var tabs = $("#tabBar01").tabs();
	$("#tabBar01 ul").sortable();
	tabs.delegate("span.ui-icon-close", "click", function() {
		var panelId = $(this).closest("li").remove().attr("aria-controls");
		$("#" + panelId).remove();
		tabs.tabs("refresh");
	});
	tabs.bind("keyup", function(event) {
		if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
			var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
			$("#" + panelId).remove();
			tabs.tabs("refresh");
		}
	});

});
      
';
$oldHTML = '
<div id="pane01" class="windowPane ui-widget-content">
	<div class="paneHeader ui-widget-header"><span class="paneTitle">Pane 01</span><div class="paneBox"><span class="paneMinimize ui-icon ui-icon-minus"></span><span class="paneMaximize ui-icon ui-icon-extlink"></span><span class="paneClose ui-icon ui-icon-close"></span></div><div class="clearIcons"></div></div>
	<div id="tabBar01" class="tabBar">

		<ul class="menuList jstree-drop">
			<!--<li id="add_tab"><span class="ui-icon ui-icon-folder-open"></span></li>-->
		</ul>

		<div id="tabs-01">
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
		</div>

	</div>

</div>
';

$newScript = preg_replace('/\d+/', sprintf("%02d", $paneCounter), $oldScript);
$newHTML = preg_replace('/\d+/', sprintf("%02d", $paneCounter), $oldHTML);

$rval = array(
    'success' => TRUE,
    'html' => $newHTML,
    'script' => $newScript,
    );
    
file_put_contents('test.out', print_r($rval, TRUE), FILE_APPEND);
echo json_encode($rval);

?>
