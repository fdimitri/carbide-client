var activeTabs = [];
var activePanes = [];
var lastPaneFormat = 0;
var deletedPanes = 0;
var clickedElement = "";




/*$(document).on('keydown', function(e) {


	if (e.altKey && (String.fromCharCode(e.which) === 'r' || String.fromCharCode(e.which) === 'R')) { //ALT-R keypress
		console.log("keydown acknowledged")
	}
});*/



function triggerPaneResizes() {
    $(".maximizedPane").each(function() {
			console.log("found a maximized pane to resize");
			maximizePane($(this).attr("id"));
	});
}

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

function removeAddTabButton(paneId) {
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

function resetSizes() {
	var pos = $("#windows").offset();
	console.log("Windows position:");
	console.log(pos);
	$("#editorContainer").height(
		$(window).height() -
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
	rw.css("width", $(window).width() - rwWidth - 20);
	rw.css("height", $(window).height() - rw.position()['top']);

	wd.css("width", rw.width());
	wd.css("height", rw.height());

	arrangePanes(lastPaneFormat);
	$("body").css({
		maxHeight: $(window).height()
	});
	$("body").css("overflow", "hidden");

	$(".maximizedPane").height($(".maximizedPane").parent().height() - 10);
	$(".maximizedPane").width($(".maximizedPane").parent().width() - 10);
	triggerPaneResizes();
	$(".windowPane").each(function() { //check each window pane to see if has become too big for the window.
		if (!$(this).hasClass("maximizedPane")) { //don't adjust maximized panes
			var maxWidth = $(this).parent("#windows").width();
			var maxHeight = $(this).parent("#windows").height();
			//if this pane has become bigger than the maximum width/height due to window resizing, shrink it
			console.log("MAX " + maxWidth + " " + maxHeight)
			if ($(this).width() > maxWidth) {

				$(this).width(maxWidth - 10);
				$(this).css({left: 0, position:'absolute'});
			}
			if ($(this).height() > maxHeight) {

				$(this).height(maxHeight - 10);
				$(this).css({top: 0, position:'absolute'});
			}
		}
	});


}



$(document).ready(function() {
	resetSizes();
	$(window).trigger('resize');
});

$(window).resize(function() {
	resetSizes();
});


$(
	function() {

		$('body').mousedown(function(event) { //keep track of when the mouse goes down on buttons so dragging can be disabled
			if ($(event.target).is('.paneMaximize') || $(event.target).is('.paneRestore') || $(event.target).is('.paneMinimize') || $(event.target).is('.paneClose')) {
				clickedElement = "paneButton";
			}
			else if ($(event.target).is('.windowPaneTabClose')) {
				clickedElement = "paneTabButton";
			}
			else {
				clickedElement = "";
			}
		});
		$('body').click(function(event) {


			if ($(event.target).is('.paneMaximize')) {
				maximizePane($(event.target).closest(".windowPane").attr("id"));
			}
			else if ($(event.target).is('.paneRestore')) {
				restorePane($(event.target).closest(".windowPane").attr("id"));
			
			}
			else if ($(event.target).is('.paneMinimize')) {
				minimizePane($(event.target).closest(".windowPane").attr("id"));
			}

			else if ($(event.target).is('.paneClose')) {
				if ($(event.target).closest(".windowPane").find("[role='tab']").length > 1) { //if there is more than 1 tab ask them to confirm
					closePaneConfirm($(event.target).closest(".windowPane").attr("id"));
				}
				else {
					closePane($(event.target).closest(".windowPane").attr("id"));

				}
			}
			else if ($(event.target).is('.windowPaneTabClose')) {
				closePane($(event.target).closest(".windowPaneTab").attr("pane"));
			}
			else if ($(event.target).is('.windowPaneTab') || $(event.target).is('.windowPaneTabText') || $(event.target).is('.windowPaneTabFocus')) { //if a window pane tab is clicked...
				var paneId = $(event.target).closest(".windowPaneTab").attr("pane");
				if ($("#" + paneId).hasClass("maximizedPane")) { //this is what we do if the pane is maximized.
					focusPane($(event.target).closest(".windowPaneTab").attr("pane")); //for now we'll just focus the page
				}
				else {
					if ($('#' + $(event.target).closest(".windowPaneTab").attr("pane")).hasClass("wasMaximized")) {
						maximizePane($(event.target).closest(".windowPaneTab").attr("pane"));
						$('#' + $(event.target).closest(".windowPaneTab").attr("pane")).removeClass("wasMaximized");
					}
					else {
						restorePane($(event.target).closest(".windowPaneTab").attr("pane")); //if the pane wasn't maximized we'll restore it}
					}
					focusPane($(event.target).closest(".windowPaneTab").attr("pane")); //and we'll also focs it.
				}
			}
			else if ($(event.target).is('.tabBar a')) {
				$(".menuList").children("li").removeClass("activeTab"); //remove all active tabs and set a new one
				$(event.target).closest("li").addClass("activeTab");


				var activeTabId = $(event.target).closest("li").attr('aria-controls'); //add this tab to the activeTabs array and remove prior instances
				var thisTabLocation = $.inArray(activeTabId, activeTabs);
				if (thisTabLocation > -1) {
					activeTabs.splice(thisTabLocation, 1);
				}

				activeTabs.push(activeTabId);
				console.log(activeTabs);
			}
			


			if ($(event.target).closest(".windowPane").length > 0) { //when a pane is clicked, make it the active pane


				// $(".windowPane").removeClass("activePane");
				// $(event.target).closest(".windowPane").addClass("activePane"); 
				// var activePaneId = $(event.target).closest(".windowPane").attr('id');
				

			
					// var thisPaneLocation = $.inArray(activePaneId,activePanes);
					// if (thisPaneLocation > -1) {
					// 	activePanes.splice(thisPaneLocation,1);
					// }
					// activePanes.push(activePaneId);
				if (!$(event.target).is('.paneClose')) { //don't trigger when we are closing a pane
					focusPane($(event.target).closest(".windowPane").attr('id'));
				}
			}
		});

	}
);

/////////////////////////////////////////////////////		
function closeTab(tab) {
					var thisLi = tab.parents("li");

					var numberOfTabs = tab.closest(".menuList").find("li").length;
					var controllerPane = tab.closest(".windowPane").attr("id");
					
					//var tabs = tab.find(".tabBar").tabs();
					
					

					if (thisLi.attr('type') == 'chat') {
						var chatName = thisLi.attr('filename');
						var statusJSON = {
							"commandSet": "chat",
							"chatCommand": "leaveChannel",
							"chatTarget": chatName,
							"leaveChannel": {
								"status": true,
							},
						};
						console.log(statusJSON);
						wsSendMsg(JSON.stringify(statusJSON));
					}
					
					if (thisLi.attr('type') == 'terminal') {
						var ariaTabName = thisLi.attr("aria-controls");
						
						var termName = $('#' + ariaTabName).find('.terminalWindow').attr('terminalId');
						registerTerminalClose(getTerminalByName(termName));
					/*	var statusJSON = {
							"commandSet": "terminal",
							"command": "leaveTerminal",
							"termTarget": termName,
							"leaveTerminal": {
								"status": true,
							},
						};
						console.log(statusJSON);
						wsSendMsg(JSON.stringify(statusJSON));*/
						removeTerminal(getTerminalByName(termName));
						console.log("REMOVED TERMINAL " + termName);
					}

					
					console.log("NUMTABS = " + numberOfTabs);
					if (numberOfTabs == 1) { //if this was the last tab, recreate the addNewTabButton
						console.log("calling AppendTab with controllerid " + controllerPane);
						appendAddTabButton(controllerPane);
						tab.closest(".menuList").find("li").eq(0).addClass("activeTab");
					}
					else {
						
						tab.closest(".menuList").find("li").eq(numberOfTabs - 2).addClass("activeTab");
					
					}
					//tabs.tabs("refresh");
					
					var panelId = tab.closest("li").remove().attr("aria-controls");
					
					var $paneId = $("#" + panelId);
					$paneId.remove();
					console.log(terminalArray);
					
					
					$("#" + controllerPane).find(".tabBar").tabs().tabs("refresh");
}


function focusPane(paneId) {
	//	$(".windowPane").not("#" + paneId).removeClass("highZ"); //remove highZ class from all the other elements
	//	$("div #" + paneId).removeClass("lowZ"); //remove lowZ class from this element
	//	$("div #" + paneId).addClass("highZ"); //add highZ class to this element so its focus comes to the front

	if (paneId.indexOf('#') !== -1) {
		paneId = paneId.slice(1);
	}
	console.log(paneId);
	var thisPaneLocation = $.inArray(paneId, activePanes); //find this pane in the active panes. if it exists remove it
	if (thisPaneLocation > -1) {
		activePanes.splice(thisPaneLocation, 1);
	}
	activePanes.push(paneId); //after having removed this pane from any prior instances in the array we push it to the end


	$(".windowPane").removeClass("activePane");
	$("div #" + paneId).addClass("activePane");

	$("div #" + paneId).zIndex(50); //50 is the z-index of the active pane!
	$(".windowPane").not("#" + paneId).zIndex(1); //set all other panes to z-index 1 in case some of them are not on the active list



	var reversePanes = Array.prototype.slice.call(activePanes);
	reversePanes.reverse();

	for (var i = 1; i < reversePanes.length; i++) { //we reverse the order of the active panes so we're going from newest to oldest and set consecutively smaller z-index
		$("div #" + reversePanes[i]).zIndex(50 - i);


	}

}

function maximizePane(paneId) {

	// This is the html for a Maximize button: <span class="paneMaximize ui-icon ui-icon-extlink">

	var thisPane = $("div #" + paneId);

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

	// thisPane.attr("oldx", thisPane.position().left);
	// thisPane.attr("oldy", thisPane.position().top);
	// thisPane.attr("oldwidth", thisPane.width());
	// thisPane.attr("oldheight", thisPane.height());
	thisPane.addClass("maximizedPane");
	thisPane.css({
		top: 5,
		left: 5,
		position: 'absolute'
	});
	thisPane.css("display", "block");
	thisPane.height(thisPane.parent().height() - 25);
	thisPane.width(thisPane.parent().width() - 10);
	
	checkTerminalSizes(paneId);
	
	thisPane.resizable("disable");




}



function restorePane(paneId) {
	var thisPane = $("div #" + paneId);
	var spanMinMax = thisPane.find(".paneMinMax");
	thisPane.resizable("enable");
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
	if ((boundBottom > thisPane.parent().height()) || (boundRight > thisPane.parent().width())) {
		thisPane.css({
			top: 10,
			left: 10,
			position: 'absolute'
		});
		if (thisPane.height() > (thisPane.parent().height() - 10)) {

			thisPane.height(thisPane.parent().height() - 10);
		}
		if (thisPane.width() > (thisPane.parent().width() - 10)) {
			thisPane.width(thisPane.parent().width() - 10);
		}

	}
	else {

		thisPane.css({
			top: thisPane.attr("oldy"),
			left: thisPane.attr("oldx"),
			position: 'absolute'
		});
	}
	$(".windowPaneTab[pane='" + paneId + "']").find(".windowPaneTabFocus").css("visibility", "hidden");
	
	checkTerminalSizes(paneId);
	
}

function minimizePane(paneId) {
	var thisPane = $("div #" + paneId);
	var spanMinMax = thisPane.find(".paneMinMax");
	
	if (thisPane.hasClass("maximizedPane")) {
		thisPane.addClass("wasMaximized");
	}
	else {
		thisPane.attr("oldx", thisPane.position().left);
		thisPane.attr("oldy", thisPane.position().top);
		thisPane.attr("oldwidth", thisPane.width());
		thisPane.attr("oldheight", thisPane.height());

	}
	thisPane.removeClass("maximizedPane");
	thisPane.css("display", "none");
	//now find the pane in the windowPaneTabs and show the restore button
	$(".windowPaneTab[pane='" + paneId + "']").find(".windowPaneTabFocus").css("visibility", "visible");
	console.log($(".windowPaneTab[pane='" + paneId + "']").find(".windowPaneTabFocus").length);
}

function closePaneConfirm(paneId) {

	var thisDialog = "dialog-info";
	changeDialogTitle(thisDialog,"Close Window Pane?");
	addDialogIcon (thisDialog, "ui-icon-alert");
	addDialogInfo (thisDialog, "All your tabs will be closed. Are you sure?");
	$("#" + thisDialog).dialog({
		resizable: false,
		height: 230,
		modal: true,
		buttons: {
			"Close Window": function() {
				$(this).dialog("close");
				closePane(paneId);
			},
			Cancel: function() {
				$(this).dialog("close");

			}
		}
	});

}

function closePane(paneId) {
	deletedPanes = deletedPanes + 1; //we keep track of the number of panes that have been deleted for purposes of adjusting names when new panes are created

	//Cycle through each terminal in the pane and inform the server that it's closed
	$('#' + paneId).find(".terminalWindow").each(function() {
		
		registerTerminalClose(getTerminalByName($(this).attr("terminalId")));
		removeTerminal(getTerminalByName($(this).attr("terminalId")));
		//console.log($(this).attr("terminalId"));
		
	});
	//Cycle through each Chat in the pane and inform the server that it's closed
	$('#' + paneId).find(".cContainer").each(function() {		
			var chatName = $(this).attr('chatroom');
			var eMsg = {
				"commandSet": "chat",
				"chatCommand": "leaveChannel",
				"chatTarget": chatName,
				"leaveChannel": {
					"status": true,
				},
			};
			 wsSendMsg(JSON.stringify(eMsg));
	});

	var paneTitleRemove = $("div #" + paneId).find(".paneTitle").text();
	$("div #" + paneId).remove();

	var thisPaneLocation = $.inArray(paneId, activePanes); //find this pane in the active panes. if it exists remove it
	if (thisPaneLocation > -1) {
		activePanes.splice(thisPaneLocation, 1);
	}


	var paneNumber = parseInt(paneTitleRemove.match(/\d+/)[0]);
	$("div .windowPane").each(function() { //check every window pane for higher numbered panes and reduce their name by 1
		var thisNumber = $(this).find(".paneTitle").text();
		thisNumber = parseInt(thisNumber.match(/\d+/)[0]);
		if (thisNumber > paneNumber) { //process the current pane if it was numbered higher than the original pane
			var newNumber = thisNumber - 1;
			var s1 = newNumber + ""; //turn the number into a string to add leading zeros to numbers less than 10
			var s2 = thisNumber + ""; //turn the old number into a string also because we need it to use as a selector
			while (s1.length < 2) {
				s1 = "0" + s1;
			}
			while (s2.length < 2) {
				s2 = "0" + s2;
			}


			if ($(this).find(".paneTitle").html().match(/Pane \d+/g)) //if the pane was titled Pane XX we should rename it to avoid confusion
			{

				$(this).find(".paneTitle").html("Pane " + s1);
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






function waitForNewWindow(conditions, callback, filename, originId, tabType, srcPath) {
    setTimeout(function() {
        if (numWindowPanes() >= conditions) {
            if (callback != null) {
            	console.log("calling a function because numwindowpanes is " + numWindowPanes());
                callback(filename,  $(".activePane .tabBar").attr('id'), originId, tabType, srcPath);
            }
            return;
        }
        else {
            console.log("WAITING: " + numWindowPanes() + " UNTIL " + conditions)
            waitForNewWindow(conditions, callback, filename, originId, tabType, srcPath);
        }
    }, 50); // wait 10ms for the connection...
}





function newTab(filename, tabBarId, originId, tabType, srcPath) {
	console.log("Called with filename:" + filename + " tabBarId:" + tabBarId + " originId " + originId + " srcPath:" + srcPath);
	
	// if (filename == "Default Terminal") {
	// 	var numTerminals = $('li[type="terminal"]').length; //count the terminals
	// 	filename = "Terminal_" + (numTerminals + 1);
	// }
	var paneId = $("#" + tabBarId).closest(".windowPane").attr("id");
	var num_Tabs = $("#" + tabBarId + ' .menuList li').length;
	var tabName = "tab-" + tabBarId + "-" + filename;
	var tabSaved = $(".tabBar").tabs();
	tabName = tabName.replace('.', '_');
	var tabNameNice = filename;
	console.log("tabName is set to " + tabName + " and num_Tabs is set to " + num_Tabs);
	//if ($("#" + tabName).length) {
	if (tabType == "file") {
		if ($("#" + tabBarId).find("#" + tabName).length) { //check for duplicate files
			console.log("We already have this tab open!");
			$("#" + paneId).find(".tabBar").tabs().tabs("refresh");
			var listItemIndex = $("#" + paneId).find('[srcpath="' + srcPath + '"]').index();
		
			$("#" + paneId).find(".tabBar").tabs().tabs("refresh").tabs("option", "active", listItemIndex).tabs("refresh");
			console.log("attempted to set active tab to " + listItemIndex + " because of ");
			console.log("#" + paneId);
			return;
		}
	}
	else if (tabType == "chat") { //a duplicate chat is considered to be any chat active within any pane
		var foundFile = $('li[filename="' + filename + '"]');
		if (foundFile.length) {
			focusPane(foundFile.closest(".windowPane").attr("id")); //focus the location of the already existing chat
			foundFile.closest(".tabBar").tabs().tabs("refresh");
			foundFile.closest(".tabBar").tabs().tabs("option", "active", foundFile.index()).tabs("refresh");
			
			return;
		}
	}
	else if (tabType == "terminal") {
		
		
		/*WE ACTUALLY WANT TO ALLOW MULTIPLE TERMINALS PER PANE!!!!!!!!!!!!!!!
		
		if ($("#" + tabBarId).find("#" + tabName).length) { //only allow 1 terminal per window Pane
			console.log("We already have this tab open!");
			$("#" + paneId).find(".tabBar").tabs().tabs("refresh");
			var listItemIndex = $("#" + paneId).find('[srcpath="' + srcPath + '"]').index();
		
			$("#" + paneId).find(".tabBar").tabs().tabs("refresh").tabs("option", "active", listItemIndex).tabs("refresh");
			console.log("attempted to set active tab to " + listItemIndex + " because of ");
			console.log("#" + paneId);
			return;
		}*/
	}
	removeAddTabButton(tabBarId);
	
	
	//tabs.find(".ui-tabs-nav").append(li);
	//tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
	$("#" + tabBarId).tabs().find(".ui-tabs-nav").append(
		"<li type='" + tabType + "' srcpath='" + srcPath + "' filename='" + filename + "'><a href='#" + tabName + "'>" + tabNameNice + "</a><div class='tabIconBox'><!--<span class='reloadButton ui-icon-arrowrefresh-1-s ui-icon'>Refresh Tab</span>--><span class='reloadButton ui-icon-arrowrefresh-1-s ui-icon'>Refresh Tab</span><span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></div><div class='tabIconClear'></div></li>"
	);
	$("#" + tabBarId).tabs().append("<div class='AriaTab' id='" + tabName + "'></div>");
	var MyObject = [{
		'tabName': tabName,
		'tabType': tabType,
		'paneId': tabBarId,
		'originId': originId,
		'chatTarget': filename,
		'srcPath': srcPath,
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
		//ADD SERVER CALL HERE
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
			else if (tabType == 'file') {
				//var te = $("#" + tabName).find('textarea');
				var te = $("#" + tabName).find('.preAceEdit');
				console.log("Searching " + tabName + " to add editor to..");
				console.log($("#" + tabName));
				console.log("find() Reports:");
				console.log(te);
				$.fn.buildAce("#" + te.attr('id'), te.attr('srcPath'), "#statusBar")
				var statusJSON = {
					"commandSet": "document",
					"command": "getContents",
					"documentTarget": te.attr('srcPath'),
					"getContents": {
						"document": te.attr('srcPath'),
					},
				};
				var rval = wsSendMsg(JSON.stringify(statusJSON));

			}
			

		},
		error: function(data, error, xqhr) {
			$("#" + tabName + " .ui-icon-close").click();
		},
	});
	//tabs.tabs("refresh").tabs({ active:num_Tabs});
	tabSaved.tabs("refresh");
	$("#" + tabBarId).tabs({
		active: num_Tabs
	});

	$(".menuList").children("li").removeClass("activeTab"); //remove all active tabs and set a new one
	$('a[href="#' + tabName + '"]').parent("li").addClass("activeTab");

	var activeTabId = $('a[href="#' + tabName + '"]').closest("li").attr('aria-controls'); //add this tab to the activeTabs array and remove prior instances
	var thisTabLocation = $.inArray(activeTabId, activeTabs);
	if (thisTabLocation > -1) {
		activeTabs.splice(thisTabLocation, 1);
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
		'delPanes': deletedPanes,
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
					var newY = $(result.paneId).parent().height() / 2 - $(result.paneId).height() / 2;
					var newX = $(result.paneId).parent().width() / 2 - $(result.paneId).width() / 2 - $("#toolBarSide").width() - $("#leftBar").width();
					$(result.paneId).css({
						top: newY,
						left: newX,
						position: 'absolute'
					});
				}
				else {
				
					
					maximizePane("pane01");
					$('#pane01').attr('oldheight', ($('#pane01').height() / 2 ));
					$('#pane01').attr('oldwidth', ($('#pane01').width() / 2 ));

				}
			}
			$(result.paneId).addClass("activePane");
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
	var statusJSON = {
		"commandSet": "base",
		"command": "getChatListJSON",
	};
	wsSendMsg(JSON.stringify(statusJSON));

	var statusJSON = {
		"commandSet": "base",
		"command": "getTermListJSON",
	};
	wsSendMsg(JSON.stringify(statusJSON));

	// var statusJSON = {
	// 	"commandSet": "base",
	// 	"command": "getChatTreeJSON",
	// }; 
	// wsSendMsg(JSON.stringify(statusJSON));

	$.fn.buildAce = function(mySelector, myFileName, statusBar) {
		var fileExt = myFileName.match(/\.\w+$/);
		var modelist = require("ace/ext/modelist")
		var mode = modelist.getModeForPath(myFileName).mode;
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
				editor.setTheme("ace/theme/twilight");
				editor.session.setMode(mode);
				console.log(editor);
				var statusJSON = {
					"commandSet": "document",
					"command": "getContents",
					"targetDocument": $(editor).attr('srcPath'),
					"getContents": {
						"document": $(editor).attr('srcPath'),
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
				"command": "insertDataSingleLine",
				"document": $(editor).attr('srcPath'),
				"sourceEditor": $(editor).attr('id'),
				"insertDataSingleLine": {
					"type": "input",
					"ch": startChar,
					"line": startLine,
					"data": text,
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
				"commandSet": "document",
				"command": "deleteDataSingleLine",
				"document": $(editor).attr('srcPath'),
				"sourceEditor": $(editor).attr('id'),
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
				"command": "insertDataMultiLine",
				"document": $(editor).attr('srcPath'),
				"sourceEditor": $(editor).attr('id'),
				"insertDataMultiLine": {
					"type": "input",
					"startChar": startChar,
					"startLine": startLine,
					"endChar": endChar,
					"endLine": endLine,
					"data": linesChanged,
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
				"command": "deleteDataMultiLine",
				"document": $(editor).attr('srcPath'),
				"sourceEditor": $(editor).attr('id'),
				"deleteDataMultiLine": {
					"type": "input",
					"startLine": startLine,
					"endLine": endLine,
					"startChar": startChar,
					"endChar": endChar,
					"lines": linesChanged,
				}
			};
			wsSendMsg(JSON.stringify(statusJSON));
			console.log(statusJSON);
		}

		// e.type, etc
	}





});


function moveTab(receiver, sender, tab) {



	var tabType = tab.attr("type");
	
	var srcPath = tab.attr("srcpath");
	
	
	if (tabType == "file") {	//check if tab (as file) already exists in the receiver pane, and if so, disallow move
		if (receiver.closest(".windowPane").find('[type="file"][srcpath="' + srcPath + '"]').length > 1) { //look for a file with the same srcpath
			var ariaToRemove = tab.attr("aria-controls");
			tab.remove();
			sender.closest(".windowPane").find("#" + ariaToRemove).remove();
			if (sender.closest(".windowPane").find("li").length < 1) { //bring back the add tab button if need be
				appendAddTabButton(sender.closest(".windowPane").attr("id"));
				sender.closest(".windowPane").find(".tabBar").tabs().tabs("refresh");
				receiver.closest(".windowPane").find(".tabBar").tabs().tabs("refresh");
				var indexToShow = receiver.closest(".windowPane").find('[srcpath = "' + srcPath + '"]').index();
				receiver.closest(".windowPane").find(".tabBar").tabs().tabs("option", "active", indexToShow).tabs("refresh");
			}
			return;
			
		}
	
	}
	else if(tabType == "chat") { //we don't allow multiple chats to exist at all, even in different panes, so this shouldn't have to trigger an action at the moment
		
		//respond here if it becomes desireable to limit chat movement
	}
	
	var paneId = receiver.closest(".windowPane").attr("id");
	var sentPaneId = sender.closest(".windowPane").attr("id");
	var movedLiObject = $("#" + paneId).find('li[srcpath="' + srcPath + '"]');
	var itemType = movedLiObject.attr("type");
	movedLiObject.find(".tabBar").tabs().tabs("refresh");
	//$("#" + sentPaneId).find(".tabBar").tabs().tabs("refresh");.find(".tabBar")


	//$("#" + paneId).removeClass("ui-widget");

	//add the addNewTabButton to the sender if it is out of tabs
	if (sender.find("li").length == 0) {

		appendAddTabButton(sentPaneId);
		$("#" + sentPaneId).find(".tabBar").tabs("refresh");
		$("#" + sentPaneId).find(".tabBar").tabs("option", "active", 0);
	}
	//Now we rmeove the Add Tab Button from the receiver
	removeAddTabButton(paneId);
	tab.appendTo(receiver.find("ul"));
	// Find the id of the associated panel
	var panelId = tab.attr("aria-controls");
	// Remove the panel

	$("#" + panelId).appendTo(receiver);

	//This is where we have to change the attributes to match the new tab bar. Change: li aria-controls attribute, a href attribute, div (class AriaTab) ID attr,
	//pre (class preAceEdit) ID attr
	var numToReplace = sender.attr("id").replace(/\D/g, ''); //the tab bar id number of the sender
	var numReplaceTo = receiver.attr("id").replace(/\D/g, ''); //the tab bar id number of the receiver
	var newRegExp = new RegExp(numToReplace, "g");

	console.log("REPLACE DATA!!!! " + numToReplace + " is going to turn into " + numReplaceTo + " because " + newRegExp);
	var newVal = movedLiObject.attr("aria-controls").replace(newRegExp, numReplaceTo);

	movedLiObject.attr("aria-controls", newVal);


	var aToSearchFor = "#" + panelId; //this is the a-href we need to change.
	newVal = aToSearchFor.replace(newRegExp, numReplaceTo);
	receiver.find('a[href=' + aToSearchFor + ']').attr("href", newVal); //replace the A href with the number of the new tabbar

	var ariaDivToSearchFor = panelId;
	newVal = ariaDivToSearchFor.replace(newRegExp, numReplaceTo);
	var foundAriaDiv = receiver.find("#" + ariaDivToSearchFor);
	foundAriaDiv.attr("id", newVal); //replace the id of the aria controls div with the new number

	var preToSearchFor = itemType + "_" + panelId;
	newVal = preToSearchFor.replace(newRegExp, numReplaceTo);
	var foundPre = receiver.find("#" + preToSearchFor);
	foundPre.attr("id", newVal); //replace the id of the pre with the new number


	//add the addNewTabButton to the sender if it is out of tabs
	if (sender.find("li").length == 0) {
		appendAddTabButton(sentPaneId);
	}


	$(".tabBar").tabs("refresh");
	$("#" + paneId).find(".tabBar").tabs("option", "active", -1);
	$("#" + sentPaneId).find(".tabBar").tabs("option", "active", -1);
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
