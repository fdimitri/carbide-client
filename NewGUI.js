var activeTabs = [];
var activePanes = [];

$(function() {
	$("#fileContainer").resizable({
		resize: function() {
			//THIS IS WHERE WE SHOULD RESIZE #rightWindow
		},
		handles: 'e'
	});


		$("#toolBarSide").tabs({
			activate: function(event, ui) {
				var active = $('#tabs').tabs('option', 'active');
			}
		});

	$(document).on('resize', function() {
		console.log($(document).height());
	});
	$(window).trigger('resize');
});

	function resetSizes() {
		var pos = $("#windows").offset();
		console.log("Windows position:");
		console.log(pos);
		$("#editorContainer").height(
			$("body").height() - 
			$("#topBar").height());
		$("#editorContainer").width($(window).width());


		$("#toolBarSide").height($(window).height() - 10);
		var te = $("#toolBarSide ul");
		var rw = $("#rightWindow");
		var wd = $("#windows");
		var rwWidth = $("#toolBarSide").outerWidth() + 21;
		te.width($("#toolBarSide").height() - 2);	
		console.log("Resize event setting #rightWindow left to " + rwWidth)
		rw.css("left", rwWidth);
		//rw.css("left", 0);
		rw.css("width", $(window).width() - rwWidth -20);
		rw.css("height", $(window).height() - rw.position()['top']);
		
		wd.css("width", rw.width());
		wd.css("height", rw.height());
		

	}

$(document).ready(function() {
	resetSizes();
	$(window).trigger('resize');
});

$(window).resize(function() {
	 resetSizes();
});


$(
	function () {		
		
		$('body').click(function(event) {
    
		    
		    if($(event.target).is('.paneMaximize')) {
		    	maximizePane($(event.target).closest(".windowPane").attr("id"));
		    }
		    else if($(event.target).is('.paneRestore')) {
		    	restorePane($(event.target).closest(".windowPane").attr("id"));
		    }
		    else if($(event.target).is('.paneMinimize')) {
		    	minimizePane($(event.target).closest(".windowPane").attr("id"));
		    }

		    else if($(event.target).is('.paneClose')) {
		    	if ($(event.target).closest(".windowPane").find("[role='tab']").length > 1) { //if there is more than 1 tab ask them to confirm
		    		closePaneConfirm($(event.target).closest(".windowPane").attr("id"));
		    	}
		    	else {
		    		closePane($(event.target).closest(".windowPane").attr("id"));
		    		closeWindowPaneTab($(event.target).closest(".windowPane").attr("id"));
		    	}
		    }
		   	else if($(event.target).is('.windowPaneTabClose')) {
		   			closeWindowPaneTab($(event.target).closest(".windowPaneTab").attr("pane"));
		   			closePane($(event.target).closest(".windowPaneTab").attr("pane"));
		   	}
		   	else if($(event.target).is('.windowPaneTab')) {
		   			restorePane($(event.target).closest(".windowPaneTab").attr("pane"));
		   			focusPane($(event.target).closest(".windowPaneTab").attr("pane"));
		   	}
			else if($(event.target).is('.tabBar a')) {
				
				$(".menuList").children("li").removeClass("activeTab"); //remove all active tabs and set a new one
				$(event.target).closest("li").addClass("activeTab");
				
				
				var activeTabId = $(event.target).closest("li").attr('aria-controls'); //add this tab to the activeTabs array and remove prior instances
				var thisTabLocation = $.inArray(activeTabId,activeTabs);
				if (thisTabLocation > -1) {
					activeTabs.splice(thisTabLocation,1);
				}
				
				activeTabs.push(activeTabId);
				console.log(activeTabs);
			}
			
			
			if($(event.target).closest(".windowPane").length > 0) { //when a pane is clicked, give it the activePane class (and remove that class from others)
				$(".windowPane").removeClass("activePane");
				$(event.target).closest(".windowPane").addClass("activePane"); 
				
				var activePaneId = $(event.target).closest(".windowPane").attr('id');
				var thisPaneLocation = $.inArray(activePaneId,activePanes);
				if (thisPaneLocation > -1) {
					activePanes.splice(thisPaneLocation,1);
				}
				activePanes.push(activePaneId);
			}
		});
		
	}
);		
		
/////////////////////////////////////////////////////		
		
function focusPane(paneId) {
	$(".windowPane").not("#" + paneId).removeClass("highZ"); //remove highZ class from all the other elements
	$("div #" + paneId).removeClass("lowZ"); //remove lowZ class from this element
	$("div #" + paneId).addClass("highZ"); //add highZ class to this element so its focus comes to the front
	var reversePanes = activePanes;
	reversePanes.reverse();
	for (var i = 1; i < reversePanes.length; i++) {
		$("div #" + reversePanes[i]).zIndex(50-i);
		console.log("setting the Z index of ");
		console.log(reversePanes[i]);
		console.log(" to ");
		console.log(50-i);
	}

}
function maximizePane(paneId) {
	// This is the html for a Maximize button: <span class="paneMaximize ui-icon ui-icon-extlink">
	
	var thisPane = 	$("div #" + paneId);

	//these lines prevent jquery shenanigans (resizing the parent window)
	thisPane.parent("div").css({position: 'relative'});
	thisPane.parent("div").css({maxHeight: thisPane.parent("div").height()});
	thisPane.parent("div").css({minHeight: thisPane.parent("div").height()});
	thisPane.parent("div").css({maxwidth: thisPane.parent("div").width()});
	thisPane.parent("div").css({minwidth: thisPane.parent("div").width()});
	
	var spanMinMax = thisPane.find(".paneMinMax");

	spanMinMax.addClass("paneRestore"); //add class for restore
	spanMinMax.removeClass("paneMaximize"); //remove class for maximize
	spanMinMax.removeClass("ui-icon-extlink"); //remove the icon for maximize
	spanMinMax.addClass("ui-icon-newwin"); //add icon for restore
	
	thisPane.attr("oldx", thisPane.position().left);
	thisPane.attr("oldy", thisPane.position().top);
	thisPane.attr("oldwidth", thisPane.width());
	thisPane.attr("oldheight", thisPane.height());
	thisPane.addClass("maximizedPane");
	thisPane.css({top: 5, left: 5, position:'absolute'});
	thisPane.css("display", "block");
	thisPane.height(thisPane.parent().height()-10);
	thisPane.width(thisPane.parent().width()-10);
	

	

}
function restorePane(paneId) {
	var thisPane = 	$("div #" + paneId);
	var spanMinMax = thisPane.find(".paneMinMax");
	spanMinMax.removeClass("paneRestore");
	spanMinMax.addClass("paneMaximize");
	thisPane.height(thisPane.attr("oldheight"));
	thisPane.width(thisPane.attr("oldwidth"));
	thisPane.css("display", "block");
	thisPane.removeClass("maximizedPane");
	spanMinMax.removeClass("ui-icon-newwin"); //remove icon for restore
	spanMinMax.addClass("ui-icon-extlink"); //add the icon for maximize

	thisPane.css({ top: thisPane.attr("oldy"), left: thisPane.attr("oldx"), position:'absolute'});
}
function minimizePane(paneId) {
	var thisPane = 	$("div #" + paneId);
	var spanMinMax = thisPane.find(".paneMinMax");
	thisPane.attr("oldx", thisPane.position().left);
	thisPane.attr("oldy", thisPane.position().top);
	thisPane.attr("oldwidth", thisPane.width());
	thisPane.attr("oldheight", thisPane.height());	
	thisPane.removeClass("maximizedPane");
	thisPane.css("display", "none");
}

function closePaneConfirm(paneId) {

	$( "#dialog-confirm" ).dialog({
      resizable: false,
      height:230,
      modal: true,
      buttons: {
        "Close Window": function() {
        	$( this ).dialog( "close" );
        	closePane(paneId);
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });
	
}
function closePane(paneId) {
	$("div #" + paneId).remove();
}
function closeWindowPaneTab(paneAttr) {
	
	$("div .windowPaneTab[pane=" + paneAttr + "]").remove();
	
	
}
function customMenu(node) {
	var cloneCount = $('div[id^=pane]').length;
	// The default set of all items
	var menuPanes = {}
	console.log($(".windowPane"));
	$(".windowPane").each(function() {
		var paneNumber = $(this).attr('id').match(/\d+/);
		var objName = "openPane" + paneNumber;
		var windowPane = this;
		var tempPane = {
			objName: {
				label: "Open in Pane " + paneNumber,
				action: function() {
					//alert("Open file in pane " + paneNumber);
					console.log(	$(windowPane).attr('id'));
					console.log(	node.text);
					
					newTab(node.text, $(windowPane).find(".tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
		
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
	$('div .jstree').on('dblclick','.jstree-anchor', function (e) {
	   var instance = $.jstree.reference(this),
	   node = instance.get_node(this);
   
	   if(node.type == "file"  || node.type == "chat") {

		newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
//	   	console.log(node);
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
		"<li type='" + tabType + "' srcpath='" + srcPath + "' filename='" + filename + "'><a href='#" + tabName + "'>" + tabNameNice + "</a><div class='tabIconBox'><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></div><div class='tabIconClear'></div></li>"
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
	console.log("AJAX POST gto createConte with srcPath = " + srcPath);
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
				//var te = $("#" + tabName).find('textarea');
				var te = $("#" + tabName).find('.preAceEdit');
				console.log("Searching " + tabName + " to add editor to..");
				console.log($("#" + tabName));
				console.log("find() Reports:");
				console.log(te);
				$.fn.buildAce("#" + te.attr('id'), te.attr('srcPath'), "#statusBar")
				var statusJSON = {
					"commandSet" : "document",
					"command" : "getContents",
					"documentTarget" : te.attr('srcPath'),
					"getContents" : {
						"document" : te.attr('srcPath'),
					},
				};
				var rval = wsSendMsg(JSON.stringify(statusJSON));
				
			}

		},
		error: function(data, error, xqhr) {
			$("#" + tabName + " .ui-icon-close").click();
		},
	});
	tabs.tabs("refresh").tabs({ active:num_Tabs});
	
	$(".menuList").children("li").removeClass("activeTab"); //remove all active tabs and set a new one
	$('a[href="#' + tabName + '"]').parent("li").addClass("activeTab");
	
	var activeTabId = $('a[href="#' + tabName + '"]').closest("li").attr('aria-controls'); //add this tab to the activeTabs array and remove prior instances
	var thisTabLocation = $.inArray(activeTabId,activeTabs);
	if (thisTabLocation > -1) {
		activeTabs.splice(thisTabLocation,1);
	}
	activeTabs.push(activeTabId);
	
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
			if (result.paneId) {
				$(".windowPane").removeClass("activePane");
				$(result.paneId).addClass("activePane");
				
				var activePaneId = result.paneId;
				activePaneId = activePaneId.slice(1);
				var thisPaneLocation = $.inArray(activePaneId,activePanes);
				if (thisPaneLocation > -1) {
					activePanes.splice(thisPaneLocation,1);
				}
				activePanes.push(activePaneId); //after having removed this pane from any prior instances in the array we push it to the end
				console.log(activePanes);
				
				if (result.paneId != "#pane01") {
					var newY = $(result.paneId).parent().height()/2 - $(result.paneId).height()/2;
					var newX = $(result.paneId).parent().width()/2 - $(result.paneId).width()/2 - $("#toolBarSide").width() - $("#leftBar").width();
					$(result.paneId).css({top: newY, left: newX, position:'absolute'});
				}
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
	// var left = $("#leftBar").width() + $("#toolBarSide").width();
	// var screenWidth = $('body').width();
	// console.log("Setting new width to " + (screenWidth - (left + 24)));
	// $("#rightWindow").width(screenWidth - left - 224);
	// $("#rightWindow").offset({
	// 	'left': left + 224,
	// 	'top': '64'
	// });
	var statusJSON = {
		"commandSet": "FileTree",
		"command": "getFileTreeJSON",
	};
	wsSendMsg(JSON.stringify(statusJSON));
	// var statusJSON = {
	// 	"commandSet": "base",
	// 	"command": "getChatTreeJSON",
	// }; 
	// wsSendMsg(JSON.stringify(statusJSON));

	$.fn.buildAce = function(mySelector, myFileName, statusBar) {
	    var fileExt = myFileName.match(/\.\w+/);
	    var myLang;
	    if (fileExt == ".rb") {
	        myLang = "ruby";
	    }
	    else {
	        myLang = "html";
	    }
	    console.log("buildAce called with mySelector: " + mySelector + " and myFileName: " + myFileName);
	    console.log("buildAce Calaculated ace.edit() call: " + mySelector.replace(/\#/, ''));
	    console.log($(mySelector));
		$(mySelector).each(
			function() {
                var editor = ace.edit(mySelector.replace(/\#/, ''));
                $(mySelector).ace = editor;
                $(editor).attr('srcPath', $(mySelector).attr('srcPath'));
                var StatusBar = ace.require("ace/ext/statusbar").StatusBar;
                // create a simple selection status indicator
                //var statusBar = new StatusBar(editor, $(statusBar));
                $(editor).attr('ignore', 'FALSE')
                editor.setTheme("ace/theme/dawn");
                editor.session.setMode("ace/mode/" + myLang);
                console.log(editor);
        		var statusJSON = {
        		    "commandSet": "document",
        			"command" : "getContents",
        			"targetDocument" : $(editor).attr('srcPath'),
        			"getContents" : {
        				"document" : $(editor).attr('srcPath'),
        			},
        		};
		   	    console.log("The pre should still exist right now..");
			    console.log($(mySelector));

	    		wsSendMsg(JSON.stringify(statusJSON));
                
				editor.getSession().on("change", function(e) {
				    //console.log("Change on editor");
				    //console.log(editor);
				    //console.log(e);
				    $.fn.aceChange(editor, e)
				});
			}
		);
	}

	$.fn.aceChange = function(editor, e) {
        console.log(e);
        if ($(editor).attr('ignore') == 'TRUE') return;
        var action = e.data.action;
        if (action == 'insertText') {
            var startChar = e.data.range.start.column;
            var startLine = e.data.range.start.row;
            var text = e.data.text;
    		var statusJSON = {
    		    "commandSet": "document",
    			"command" : "insertDataSingleLine",
    			"document" : $(editor).attr('srcPath'),
    			"insertDataSingleLine" : {
    				"type" : "input",
    				"ch" : startChar,
    				"line" : startLine,
    				"data" : text,
    			}
    		};
    		wsSendMsg(JSON.stringify(statusJSON));
    		console.log(statusJSON);
        }
        if (action == 'removeText') {
            var startChar = e.data.range.start.column;
            var startLine = e.data.range.start.row;
            var text = e.data.text;
			var statusJSON = {
				"commandSet" : "document",
				"command": "deleteDataSingleLine",
    			"document" : $(editor).attr('srcPath'),
				"deleteDataSingleLine": {
					"type": "input",
					"ch": startChar,
					"line": startLine,
					"data": text,
				},
			};
			wsSendMsg(JSON.stringify(statusJSON));
			console.log(statusJSON);
        }
        if (action == 'insertLines') {
            var startChar = e.data.range.start.column;
            var startLine = e.data.range.start.row;
            var endChar = e.data.range.end.column;
            var endLine = e.data.range.end.row;
            var linesChanged = e.data.lines;
    		var statusJSON = {
    		    "commandSet": "document",
    			"command" : "insertDataMultiLine",
    			"document" : $(editor).attr('srcPath'),
    			"insertDataMultiLine" : {
    				"type" : "input",
    				"startChar" : startChar,
    				"startLine" : startLine,
    				"endChar" : endChar,
    				"endLine" : endLine,
    				"data" : linesChanged,
    			}
    		};
    		wsSendMsg(JSON.stringify(statusJSON));
    		console.log(statusJSON);

        }
        if (action == 'removeLines') {
            var startChar = e.data.range.start.column;
            var startLine = e.data.range.start.row;
            var endChar = e.data.range.end.column;
            var endLine = e.data.range.end.row;
            var linesChanged = JSON.stringify(e.data.lines);
    		var statusJSON = {
    		    "commandSet": "document",
    			"command" : "deleteDataMultiLine",
    			"document" : $(editor).attr('srcPath'),
    			"deleteDataMultiLine" : {
    				"type" : "input",
    				"startChar" : startChar,
    				"startLine" : startLine,
    				"endChar" : endChar,
    				"endLine" : endLine,
    				"data" : linesChanged,
    			}
    		};
    		wsSendMsg(JSON.stringify(statusJSON));
    		console.log(statusJSON);
        }
        
        // e.type, etc
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
			"text": "3rd_shift_rulez",
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
	/*THIS NEEDS TO BE FIXED TO RESTORE CONTEXT MENU*/
	"plugins": [/*"contextmenu", */"dnd", "crrm", "types"]//,
	//contextmenu: {
	//	items: customMenu
	//}
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
}); 
$(document)
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
	console.log("VAKATA " + e + " " + data);
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

