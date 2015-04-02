$(
	function () {
		var pos = $("#windows").offset();
		console.log("Windows position:");
		console.log(pos);
		$("#editorContainer").height(
			$("body").height() - 
			$("#topBar").height() -
			28 );
		
	}
);




function customMenu(node) {
	var cloneCount = $('div[id^=pane]').length;
	// The default set of all items
	var menuPanes = {}
	console.log($(".windowPane"));
	$(".windowPane").each(function() {
		var paneNumber = $(this).attr('id').match(/\d+/);
		var objName = "openPane" + paneNumber;
		var tempPane = {
			objName: {
				label: "Open in Pane " + paneNumber,
				action: function() {
					alert("Open file in pane " + paneNumber);
				}
			}
		}
		console.log('menuPanes follows');
		console.log(menuPanes);
		menuPanes[$(this).attr('id')] = (tempPane.objName);
	});
	console.log('menuPanes follows');
	console.log(menuPanes);

	var items = {

		openItem: { //open with...
			label: "Open with...",
			action: false,
			submenu: menuPanes,

		},
		renameItem: { // The "rename" menu item
			label: "Rename",
			action: function() {
				alert("Your new name is Milo.");
			}
		},
		deleteItem: { // The "delete" menu item
			label: "Delete",
			action: function() {
				alert("You have been deleted.");
			}
		}

	};

	if ($(node).hasClass("folder")) {
		// Delete the "delete" menu item
		delete items.deleteItem;
		alert("bam!");
	}

	return items;
}


function initFileTree(data) {
	if (!data) {
		console.log("Asked to init with no data, using built-ins")
		data = [{
			"id": "ftroot0",
			"parent": "#",
			"text": "Mockup",
			"type": "root",
			"li_attr": {
				"class": "jsTreeRoot"
			}
		}, ]
	}
	console.log("Calling jstree() on");
	console.log($('#jsTree1'));
	$('#jsTree1').jstree({
		"core": {
			// so that create works
			check_callback: true,
			'data': data,
		},
		"dnd": {
			is_draggable: function(node) {

				return true;
			}
		},

		"types": {

			"file": {
				"icon": "jstree-file",
				"valid_children": []
			},
			"folder": {
				"icon": "jstree-folder",
				"valid_children": ["file"]
			},
			"root": {
				"icon": "jstree-folder",
				"valid_children": ["file", "folder"]
			}


		},
		"plugins": ["contextmenu", "dnd", "crrm", "types"],
		contextmenu: {
			items: customMenu
		}
	});
}

function initChatTree(data) {

}


function newTab(filename, paneId, originId, tabType, srcPath) {
	console.log("Called with filename:" + filename + " paneId:" + paneId + " originId" + originId + " srcPath:" + srcPath);
	var num_Tabs = $("#" + paneId + ' .menuList li').length;
	var tabName = "tab-" + paneId + "-" + filename;
	tabName = tabName.replace('.', '_');
	var tabNameNice = filename;
	var tabs = $(".tabBar").tabs();
	console.log("tabName is set to " + tabName + " and num_Tabs is set to " + num_Tabs);
	if ($("#" + tabName).length) {
		console.log("We already have this tab open!");
		var listItem = $("#" + tabName);
		$("#" + paneId).tabs("option", "active", listItem.index());
		return;
	}
	//tabs.find(".ui-tabs-nav").append(li);
	//tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );

	$("#" + paneId).tabs().find(".ui-tabs-nav").append(
		"<li><a href='#" + tabName + "'>" + tabNameNice + "</a><div class='tabIconBox'><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></div><div class='tabIconClear'></div></li>"
	);
	$("#" + paneId).tabs().append("<div class='AriaTab' id='" + tabName + "'></div>");
	var MyObject = [{
		'tabName': tabName,
		'tabType': tabType,
		'paneId': paneId,
		'originId': originId,
		'chatTarget': filename,
		'srcPath' : srcPath,
	}, ];
	$.ajax({
		url: "/createContent.php",
		type: 'post',
		data: {
			jsonSend: JSON.stringify(MyObject),
		},
		datatype: 'json',
		success: function(data) {
			console.log(data);
			var result = JSON.parse(data);
			if (result.success === false) {
				console.log(result['failReasons']);
				$("#" + tabName + " .ui-icon-close").click();
				return;
			}
			if (result.html) {
				var html_result = result.html;
				console.log(html_result);
				$("#" + tabName).html(html_result);
			}
			if (result.script) {
				console.log("Script receieved!");
				eval(result.script);
			}
			if (tabType == 'chat') {
				var statusJSON = {
					"commandSet": "chat",
					"chatCommand": "joinChannel",
					"chatTarget": filename,
					"joinChannel": {
						"chatTarget": filename,
					},
				};
				var rval = wsSendMsg(JSON.stringify(statusJSON));
				console.log("Informing server we are joining the channel !!! Return val from ws was: " + rval);
				console.log(statusJSON);
				console.log(ws);
				console.log("THE CONTAINER HEIGHT IS " + $("#" + tabName).find(".cContainer").height());
			}
			if (tabType == 'file') {
				var cm = $.fn.buildCodeMirror($("#" + tabName).find('textarea'), $("#" + tabName).find('textarea').attr('srcPath'));
			}

		},
		error: function(data, error, xqhr) {
			$("#" + tabName + " .ui-icon-close").click();
		},
	});
	tabs.tabs("refresh");
	return (num_Tabs + 1);

}

var paneCounter = 0;
createNewPane();


function createNewPane() {
	paneCounter++;
	var MyObject = [{
		'paneCounter': paneCounter,
	}, ];

	$.ajax({
		url: "/createPane.php",
		type: 'post',
		data: {
			jsonSend: JSON.stringify(MyObject),
		},
		datatype: 'json',
		success: function(data) {
			var result = JSON.parse(data);
			if (result.success === false) {
				console.log(result['failReasons']);
				return;
			}
			if (result.html) {
				console.log("Appending HTML..");
				var html_result = result.html;
				$("#windows").append(html_result);
			}
			if (result.script) {
				console.log("Script receieved! Evaluating! Smelloscope!");
				eval(result.script);
			}
			console.log("Successfully loaded data for new pane");
		},
		error: function(data, error, xqhr) {
			console.log("Error creating new pane: " + data);
			console.log("Error creating new pane: " + error);
			console.log("Error creating new pane: " + xqhr);
			return false;
		},
	});
}




$(document).ready(function() {
	var left = $("#leftBar").width() + $("#toolBarSide").width();
	var screenWidth = $('body').width();
	console.log("Setting new width to " + (screenWidth - (left + 24)));
	$("#rightWindow").width(screenWidth - left - 224);
	$("#rightWindow").offset({
		'left': left + 224,
		'top': '64'
	});
	var statusJSON = {
		"commandSet": "FileTree",
		"fileTreeCommand": "getFileTreeJSON",
	};
	wsSendMsg(JSON.stringify(statusJSON));
	$.fn.buildCodeMirror = function(mySelector, myFileName) {
		var cmOption = {
			lineNumbers: true,
			styleActiveLine: true,
			matchBrackets: true,
		};
		$(mySelector).each(
			function() {
				console.log('Create new CodeMirror instance');
				var cm = CodeMirror.fromTextArea(this, {
					lineNumbers: true,
					styleActiveLine: true,
					matchBrackets: true,
					ownerArea: this,
					fileName: myFileName,
					srcPath: myFileName,
					mode: "text/html",
					highlightSelectionMatches: {
						showToken: /\w/
					},
					extraKeys: {
						/*					  "'<'": completeAfter,
											  "'/'": completeIfAfterLt,
											  "' '": completeIfInTag,
											  "'='": completeIfInTag,*/
						"Ctrl-Space": "autocomplete"
					},
					value: document.documentElement.innerHTML
				});
				cm.on("change", $.fn.cmChange);
			}
		);
	}

	$.fn.cmChange = function(cm, change) {
		console.log("srcPath for cm is " + cm.getOption('srcPath'))
		var totalText = cm.getValue();
		var statusText = "Change type: " + change.origin + "";
		if (change.origin == "+input") {
			statusText += "@ " + change.to.line + ":" + change.to.ch + " text: ";
			if (change.text[0].length) {
				statusText += change.text;
			}
			else {
				change.text = "\n";
			}
			var statusJSON = {
				"commandSet": "document",
				"command": "insertDataSingleLine",
				"document": cm.getOption('srcPath'),
				"insertDataSingleLine": {
					"type": "input",
					"ch": change.to.ch,
					"line": change.to.line,
					"data": change.text,
				},
			};
			ws.send(JSON.stringify(statusJSON));
		}
		if (change.origin == "paste") {
			if (change.removed.length == 1 && change.removed[0].length == 0 && change.text.length == 1) {
				/* Simplest case */
				statusText += "@ " + change.to.line + ":" + change.to.ch + " text: ";
				if (change.text[0].length) {
					statusText += change.text;
				}
			}

		}
		if ((change.origin == "+delete" || change.origin == "cut")) {
			if (change.removed.length == 1) {
				/* This is a simple single line modification */
				var startPosition = change.to.ch - change.removed[0].length;
				var endPosition = change.to.ch;
				statusText += "@ " + change.to.line + ":" + startPosition + "-" + endPosition + " text: ";
				statusText += change.removed;
				console.log("Change information: ");
				console.log(change);
				// var docName = cm.getOption('ownerArea');
				// console.log(docName);
				var statusJSON = {
					"commandSet" : "document",
					"command": "deleteDataSingleLine",
					"document": cm.getOption('srcPath'),
					"deleteDataSingleLine": {
						"type": "input",
						"ch": startPosition,
						"line": change.to.line,
						"data": change.removed,
					},
				};
			ws.send(JSON.stringify(statusJSON));

		}
		else {
			/* This is a multi-line delete/cut which needs to be handled differently */
		}

	}

	var statusBarInstance = cm.getOption('ownerArea').id;
	$('#statusBar_' + statusBarInstance).text(statusText);
	console.log('Attempting to update #statusBar_' + statusBarInstance + " to " + statusText);
	//	console.log(change);
	//	console.log(cm.getCursor());

}




$('#jsTree2').jstree({

	"core": {
		// so that create works
		check_callback: true,
		'data': [{
			"id": "chatroot",
			"parent": "#",
			"text": "Chat Rooms",
			"type": "root",
			"li_attr": {
				"class": "jsRoot"
			}
		}, {
			"id": "chat1",
			"parent": "chatroot",
			"text": "StdDev",
			"type": "chat",
			"li_attr": {
				"class": "jsTreeChat"
			}
		}, {
			"id": "chat2",
			"parent": "chatroot",
			"text": "Java",
			"type": "chat",
			"li_attr": {
				"class": "jsTreeChat"
			}
		}, {
			"id": "chat3",
			"parent": "chatroot",
			"text": "Coffee",
			"type": "chat",
			"li_attr": {
				"class": "jsTreeChat"
			}
		}, {
			"id": "chat4",
			"parent": "chatroot",
			"text": "3rd shift rulez",
			"type": "chat",
			"li_attr": {
				"class": "jsTreeChat"
			}
		}],


	},
	"dnd": {
		is_draggable: function(node) {

			return true;
		}
	},

	"types": {

		"chat": {
			"icon": "jstree-chat",
			"valid_children": []
		},
		"root": {
			"icon": "jstree-folder",
			"valid_children": ["chat"]
		}


	},
	"plugins": ["contextmenu", "dnd", "crrm", "types"],
	contextmenu: {
		items: customMenu
	}
});


$('.drag')
.on('mousedown', function(e) {
	/*
	//This block of code should make dragging work better with context menus if we need it later
	var evt = e;
    if (e.button != 2) return; //Added to make this compatible with draggable
    evt.stopPropagation();
    jQuery(this).mouseup( function(e) {
    e.stopPropagation();
    var srcElement = jQuery(this);
    });
    //end of context menu dragging fix
    */    
        
	var jsTreeDiv = '<div id="jstree-dnd" class="jstree-default"><i class="jstree-icon jstree-er"></i>' + $(this).text() + '</div>';
	var nodes = [{
		id: true,
		text: $(this).text()
	}];
	return $.vakata.dnd.start(e, {
		'jstree': true,
		'obj': $(this),
		'nodes': nodes
	}, jsTreeDiv);
}); $(document)
.on('dnd_move.vakata', function(e, data) {
	var t = $(data.event.target);
	if (!t.closest('.jstree').length) {
		if (t.closest('.menuList').length) {
			var dragItem = $("#" + data.data.obj[0].id);
			if (dragItem.hasClass("jsTreeFile") || dragItem.hasClass("jsTreeChat")) {
				data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
			}
			else {
				data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
			}
		}
		else {
			data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
		}
	}
})
.on('dnd_stop.vakata', function(e, data) {
	var t = $(data.event.target);
	if (!t.closest('.jstree').length) {
		if (t.closest('.menuList').length) {


			// We probably just need to add hasClass jsTreeChat here as well to allow a chat drop
			console.log("Data");
			console.log(data);
			console.log("Data . Data");
			console.log(data.data);
			var draggedItem = $("#" + data.data.obj[0].id);

			console.log(draggedItem);
			if (draggedItem.hasClass("jsTreeFile")) {
				console.log("TARGET");
				console.log(data.event.target);
				console.log("ID");
				var thisParent = $(data.event.target).closest('div').attr('id');
				if ($("#" + thisParent).find('li.' + data.data.obj[0].id).length) { //the tab already exists 
					var listItem = $("#" + thisParent).find('li.' + data.data.obj[0].id);
					$("#" + thisParent).tabs("option", "active", listItem.index()); //set the active tab to the file they dragged in
				}
				else {
					console.log(data);
					console.log($("#" + data.data.obj[0].id));
					//console.log($("#" + data.data.obj[0].id).closest('li').attr('srcPath'));
					console.log("Dragged " + data.element.outerText + " to " + data.event.target);
					var tabCounter = newTab(data.element.text, t.closest('div').attr('id'), data.data.obj[0].id, 'file', $("#" + data.data.obj[0].id).attr('srcpath'));
					var tabItem = $("#tabs-" + tabCounter);
					var itemParent = tabItem.closest('div').attr('id');
				}
			}
			else if (draggedItem.hasClass("jsTreeChat")) {
				console.log("Has class jsTreeChat");
				var thisParent = $(data.event.target).closest('div').attr('id');
				if ($("#" + thisParent).find('li.' + data.data.obj[0].id).length) { //the tab already exists 
					console.log("Tab already exists, not adding -- but setting active");
					var listItem = $("#" + thisParent).find('li.' + data.data.obj[0].id);
					$("#" + thisParent).tabs("option", "active", listItem.index()); //set the active tab to the file they dragged in
				}
				else {
					console.log(data);
					console.log($("#" + data.data.obj[0].id));
					console.log($("#" + data.data.obj[0].id).closest('li'));
					console.log("Dragged " + data.element.outerText + " to " + data.event.target);
					var tabCounter = newTab(data.element.text, t.closest('div').attr('id'), data.data.obj[0].id, 'chat', '');
					var tabItem = $("#tabs-" + tabCounter);
					var itemParent = tabItem.closest('div').attr('id');
				}
			}
		}
	}
});

});
$(function() {
	$("#fileContainer").resizable({
		handles: 'e'
	});

});
