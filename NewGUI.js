var activeTabs = [];
var activePanes = [];
var lastPaneFormat = 0;
var deletedPanes = 0;

 $(document).on('keydown', function ( e ) {

    
     if ( e.altKey && ( String.fromCharCode(e.which) === 'r' || String.fromCharCode(e.which) === 'R' ) ) { //ALT-R keypress
        console.log("keydown acknowledged")
		}
});

$(function() {
	$("#toolBarSide").resizable({
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
		arrangePanes(lastPaneFormat);
		$("body").css({maxHeight: $(window).height()});
		$("body").css("overflow", "hidden");
		
		$(".maximizedPane").height($(".maximizedPane").parent().height()-10);
		$(".maximizedPane").width($(".maximizedPane").parent().width()-10);

		

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
		    		
		    	}
		    }
		   	else if($(event.target).is('.windowPaneTabClose')) {
		   			
		   			closePane($(event.target).closest(".windowPaneTab").attr("pane"));
		   	}
		   	else if($(event.target).is('.windowPaneTab') || $(event.target).is('.windowPaneTabText') || $(event.target).is('.windowPaneTabFocus')) { //if a window pane tab is clicked...
		   		
		   			var paneId = $(event.target).closest(".windowPaneTab").attr("pane");
		   			if ($("#" + paneId).hasClass("maximizedPane")) { //this is what we do if the pane is maximized.
		   					focusPane($(event.target).closest(".windowPaneTab").attr("pane")); //for now we'll just focus the page
		   			}
		   			else {
			   			restorePane($(event.target).closest(".windowPaneTab").attr("pane")); //if the pane wasn't maximized we'll restore it
			   			focusPane($(event.target).closest(".windowPaneTab").attr("pane")); //and we'll also focs it.
		   			}
		   	}
		   	else if ($(event.target).is('.addNewTab')) {
		   		dialog.dialog( "open" );
		   	
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
			
			
			if($(event.target).closest(".windowPane").length > 0) { //when a pane is clicked, make it the active pane


		
				if(!$(event.target).is('.paneClose')) { //don't trigger when we are closing a pane
					focusPane($(event.target).closest(".windowPane").attr('id'));
				}
			}
		});
		
		// modal dialog init: custom buttons and a "close" callback resetting the form inside
	var dialog = $( "#newTabDialog" ).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Add: function() {
				addTab();
				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
			form[ 0 ].reset();
		}
	});
	// addTab form: calls addTab function on submit and closes the dialog
	var form = dialog.find( "form" ).submit(function( event ) {
		//newTab();
		dialog.dialog( "close" );
		event.preventDefault();
	});
	}
);		
		
/////////////////////////////////////////////////////		
function closeTab(tab){
	
			var numberOfTabs = tab.closest(".menuList").find("li").length;
			var controllerPane = tab.closest(".windowPane").attr("id");
			var panelId = tab.closest("li").remove().attr("aria-controls");
			var $paneId = $("#" + panelId);
			$paneId.remove();
		
			if (tab.attr('type') == 'chat') {
				var chatName = tab.attr('filename');
				var statusJSON = {
					"commandSet": "chat",
					"chatCommand": "leaveChannel",
					"chatTarget": chatName,
					"leaveChannel": {
						"status" : true,
					},
				};
				console.log(statusJSON);
				wsSendMsg(JSON.stringify(statusJSON));
			}
			
			console.log("NUMTABS = " + numberOfTabs);
			if (numberOfTabs == 1) { //if this was the last tab, recreate the addNewTabButton
				appendAddTabButton(controllerPane);
			}
			tabs.tabs("refresh");
}


function removeAddTabButton(paneId)	{
		$('#' + paneId).find(".addNewTab").remove();
	    $('#' + paneId).find(".addTabAria").remove();
}	
function appendAddTabButton(paneId) {
	var numToInsert = paneId.replace(/\D/g, ''); //strip everything but numbers, get the pane id number
	var newLi = '<li class="addNewTab"><a href="#addTab' + numToInsert + '"><span class="ui-icon ui-icon-folder-open"></span><p class="addTabText">+Add Tab</p></a></li>';
	var newAriaDiv = '<div id="addTab' + numToInsert + '" class="addTabAria"><p class="addTabIntro">Drag a file onto the tab bar above, or click the "Add Tab" button to get started. The contents will appear here. You can add any type of content to this window pane. Files, Chats, Video; whatever you\'ve got.</p></div>';
    $("#" + paneId).find(".menuList").append(newLi);
    $("#" + paneId).find(".tabBar").append(newAriaDiv);
    		
}
		
function focusPane(paneId) {

	if (paneId.indexOf('#') !== -1) {
		paneId = paneId.slice(1);
	}
	console.log(paneId);
	var thisPaneLocation = $.inArray(paneId,activePanes); //find this pane in the active panes. if it exists remove it
	if (thisPaneLocation > -1) {
		activePanes.splice(thisPaneLocation,1);
	}
	activePanes.push(paneId); //after having removed this pane from any prior instances in the array we push it to the end


	$(".windowPane").removeClass("activePane");
	$("div #" + paneId).addClass("activePane");
	
	$("div #" + paneId).zIndex(50); //50 is the z-index of the active pane!
	$(".windowPane").not("#" + paneId).zIndex(1); //set all other panes to z-index 1 in case some of them are not on the active list
	


	var reversePanes = Array.prototype.slice.call(activePanes);
	reversePanes.reverse();

	for (var i = 1; i < reversePanes.length; i++) { //we reverse the order of the active panes so we're going from newest to oldest and set consecutively smaller z-index
		$("div #" + reversePanes[i]).zIndex(50-i);


	}

}
function maximizePane(paneId) {
	// This is the html for a Maximize button: <span class="paneMaximize ui-icon ui-icon-extlink">
	
	var thisPane = 	$("div #" + paneId);

	//these lines prevent jquery shenanigans (resizing the parent window)
/*	thisPane.parent("div").css({position: 'relative'});
	thisPane.parent("div").css({maxHeight: thisPane.parent("div").height()});
	thisPane.parent("div").css({minHeight: thisPane.parent("div").height()});
	thisPane.parent("div").css({maxwidth: thisPane.parent("div").width()});
	thisPane.parent("div").css({minwidth: thisPane.parent("div").width()});
	*/
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

	var boundBottom = (parseInt(thisPane.attr("oldy")) + parseInt(thisPane.height()));
	var boundRight = (parseInt(thisPane.attr("oldx")) + parseInt(thisPane.width()));
	if ((boundBottom > thisPane.parent().height()) || (boundRight > thisPane.parent().width()))
	{
		thisPane.css({ top: 10, left: 10, position:'absolute'});
		if (thisPane.height() > (thisPane.parent().height()-10)) { 
			thisPane.height(thisPane.parent().height()-10);
		}
		if (thisPane.width() > (thisPane.parent().width()-10)) { 
			thisPane.width(thisPane.parent().width()-10);
		}
		
	}
	else {
		thisPane.css({ top: thisPane.attr("oldy"), left: thisPane.attr("oldx"), position:'absolute'});
	}
	$(".windowPaneTab[pane='"+paneId+"']").find(".windowPaneTabFocus").css("visibility","hidden");
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
	//now find the pane in the windowPaneTabs and show the restore button
	$(".windowPaneTab[pane='"+paneId+"']").find(".windowPaneTabFocus").css("visibility","visible");
	console.log($(".windowPaneTab[pane='"+paneId+"']").find(".windowPaneTabFocus").length);
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
	deletedPanes = deletedPanes + 1; //we keep track of the number of panes that have been deleted for purposes of adjusting names when new panes are created

	var paneTitleRemove = $("div #" + paneId).find(".paneTitle").text();
	$("div #" + paneId).remove();
	
	var thisPaneLocation = $.inArray(paneId,activePanes); //find this pane in the active panes. if it exists remove it
	if (thisPaneLocation > -1) {
		activePanes.splice(thisPaneLocation,1);
	}
	
	
	var paneNumber =  parseInt(paneTitleRemove.match(/\d+/)[0]);
	$("div .windowPane").each(function() { //check every window pane for higher numbered panes and reduce their name by 1
		var thisNumber = $(this).find(".paneTitle").text();
		thisNumber = parseInt(thisNumber.match(/\d+/)[0]);
		if (thisNumber > paneNumber) { //process the current pane if it was numbered higher than the original pane
			var newNumber = thisNumber - 1;
			var s1 = newNumber+""; //turn the number into a string to add leading zeros to numbers less than 10
			var s2 = thisNumber+""; //turn the old number into a string also because we need it to use as a selector
			while (s1.length < 2) {
				s1 = "0" + s1;
			}
			while (s2.length < 2) {
				s2 = "0" + s2;
			}

			
			if ($(this).find(".paneTitle").html().match(/Pane \d+/g)) //if the pane was titled Pane XX we should rename it to avoid confusion
			{
				
				$(this).find(".paneTitle").html("Pane "+s1);
			}


			
			var paneSearch = "Pane " + s2; //we search the window pane tabs, copy the icon box, and insert the new name where appropriate
			var foundPane = $("div .windowPaneTab[panetitle='" + paneSearch + "']");
			var windowPaneBox = foundPane.children(".windowPaneTabIcons").get(0).outerHTML; //this is the icon box
			foundPane.empty().append("Pane " + s1 + windowPaneBox); //add the new name and the new icon box
			foundPane.attr("panetitle", "Pane " + s1); //update the pane title attribute which is used for searching
			
		}
	});

	closeWindowPaneTab(paneId); //close the window pane tab of the closed pane

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
	removeAddTabButton(paneId);
	
	var num_Tabs = $("#" + paneId + ' .menuList li').length;
	var tabName = "tab-" + paneId + "-" + filename;
	tabName = tabName.replace('.', '_');
	var tabNameNice = filename;
	var tabs = $(".tabBar").tabs();
	console.log("tabName is set to " + tabName + " and num_Tabs is set to " + num_Tabs);
	
	//this was our old check to see if a tab was already open. It will no longer work. We have to go by srcpath.
	/*if ($("#" + tabName).length) {
		console.log("We already have this tab open!");
		var listItem = $("#" + tabName);
		$("#" + paneId).tabs("option", "active", listItem.index());
		return;
	}*/
	if ($("#" + paneId).find('li[srcpath="' + srcPath + '"]').length) {
		console.log("We already have this tab open!");
		var listItem = $("#" + paneId).find('li[srcpath="' + srcPath + '"]');
		$("#" + paneId).tabs("option", "active", listItem.index());
		return;
	}
	
	
	//tabs.find(".ui-tabs-nav").append(li);
	//tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
	$("#" + paneId).tabs().find(".ui-tabs-nav").append(
		"<li type='" + tabType + "' srcpath='" + srcPath + "' filename='" + filename + "'><a href='#" + tabName + "'>" + tabNameNice + "</a><div class='tabIconBox'><!--<span class='reloadButton ui-icon-arrowrefresh-1-s ui-icon'>Refresh Tab</span>--><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></div><div class='tabIconClear'></div></li>"
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
		'delPanes' : deletedPanes,
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
				
				focusPane(result.paneId);
				
				

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
    				"startLine" : startLine,
    				"endLine" : endLine,
    				"startChar" : startChar,
    				"endChar" : endChar,
    				"lines" : linesChanged,
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


function moveTab (receiver, sender, tab) { 


				//first check if the tab already exists in the receiver pane. If it does, remove the tab from the sender pane and move focus to the tab in the receiver
				
				var srcPath = tab.attr("srcpath");
				var paneId = receiver.closest(".windowPane").attr("id");
				var movedLiObject = $("#" + paneId).find('li[srcpath="' + srcPath + '"]');
				var itemType = movedLiObject.attr("type");
				if (movedLiObject.length > 1) {
					console.log("We already have this tab open!");
					movedLiObject.last().remove(); //remove the new LI and then...
					var senderPaneId = sender.closest(".windowPane").attr("id"); 
					var thisAriaName = tab.attr( "aria-controls" );
					var oldPanelId = $("#" + senderPaneId).find("div#" + thisAriaName).remove();	//remove the old aria tab. We'll then..
					var listItem = movedLiObject; //shift the focus to the correct tab in the new pane.
					$("#" + paneId).tabs();
					$("#" + paneId).tabs("option", "active", listItem.index());
					$("#" + paneId).removeClass("ui-widget");
					
					return;
				}
				
				
                tab.appendTo(receiver.find("ul"));
                // Find the id of the associated panel
                var panelId = tab.attr( "aria-controls" );
                // Remove the panel
                
                $( "#" + panelId ).appendTo(receiver);
                
                //This is where we have to change the attributes to match the new tab bar. Change: li aria-controls attribute, a href attribute, div (class AriaTab) ID attr,
                //pre (class preAceEdit) ID attr
                var numToReplace = sender.attr("id").replace(/\D/g, ''); //the tab bar id number of the sender
                var numReplaceTo = receiver.attr("id").replace(/\D/g, ''); //the tab bar id number of the receiver
                var newRegExp = new RegExp(numToReplace,"g");
    
    			console.log("REPLACE DATA!!!! " + numToReplace + " is going to turn into " + numReplaceTo + " because " + newRegExp);
                var newVal = movedLiObject.attr("aria-controls").replace(newRegExp,numReplaceTo);

                movedLiObject.attr("aria-controls",newVal);
                
                
                var aToSearchFor = "#" + panelId; //this is the a-href we need to change.
                newVal = aToSearchFor.replace(newRegExp,numReplaceTo);
                receiver.find('a[href=' + aToSearchFor + ']').attr("href", newVal); //replace the A href with the number of the new tabbar
                
                var ariaDivToSearchFor = panelId;
                newVal = ariaDivToSearchFor.replace(newRegExp,numReplaceTo);
                var foundAriaDiv = receiver.find("#" + ariaDivToSearchFor);
                foundAriaDiv.attr("id", newVal); //replace the id of the aria controls div with the new number
                
                var preToSearchFor = itemType + "_" + panelId;
                newVal = preToSearchFor.replace(newRegExp,numReplaceTo);
                var foundPre = receiver.find("#" + preToSearchFor);
                foundPre.attr("id", newVal); //replace the id of the pre with the new number

                $(".tabBar").tabs("refresh");
                $(".tabBar").tabs( "option", "active", -1 );
                 $(".tabBar").tabs("refresh");
                 
                 
                //console.log(tabs2);
                
				/*console.log(tabs);
				console.log(receiver);
				console.log(sender);
				console.log(tab);

				var tab$ = $(tab);
                var theUL$ = tab$.closest("ul");
	            var panelId = tab$.attr( "aria-controls" );
			
				var newIndex = receiver.find("li").length;
                newIndex = newIndex - 1; //it's a 0 based index
                if (newIndex < 0) { 
                	newIndex = 0;
                }
                //console.log(panelId);
                //console.log(newIndex);
                //console.log(theUL$);
                
                tab$ = $(tab$.removeAttr($.makeArray(tab.attributes).
                              map(function(item){ return item.name;}).
                              join(' ')).remove());
                tab$.find('a').removeAttr('id tabindex role class');

                theUL$.append(tab$);

                $($( "#" + panelId ).remove()).appendTo(receiver);
                //var newIndex = $(this).data("ui-sortable").currentItem.index();
               	//var newIndex = ui.item.index();
               	tabs.tabs("refresh");
                tabs.tabs({ active:newIndex});
          */
	
}
