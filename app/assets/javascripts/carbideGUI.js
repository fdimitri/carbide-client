var activeTabs = [];
var activePanes = [];
var deletedPanes = 0;
var lastFocusedPane = "";
var paneCounter = 0;

////TESTING FUNCTIONS/////////////////////////////////////////////////////////////////////////

$(document).ready(function() {

	$(document).on('keydown', function(e) {
	
	
		if (e.altKey && (String.fromCharCode(e.which) === 'w' || String.fromCharCode(e.which) === 'W')) { //ALT keypress
			console.log("keydown acknowledged");
			var options = [];
			options['speed'] = .4;
			updateConnectionStatus(options);
		}
		if (e.altKey && (String.fromCharCode(e.which) === 'q' || String.fromCharCode(e.which) === 'Q')) { //ALT keypress
			console.log("keydown acknowledged");
			var options = [];
			options['speed'] = 1;
			updateConnectionStatus(options);
			enableScreen();
		}
		if (e.altKey && (String.fromCharCode(e.which) === 'a' || String.fromCharCode(e.which) === 'A')) { //ALT keypress
			console.log("keydown acknowledged");
			var options = [];
			options['speed'] = 0;
			options['reconnect'] = 0;
			updateConnectionStatus(options);
			disableScreen();
		}
		if (e.altKey && (String.fromCharCode(e.which) === 'm' || String.fromCharCode(e.which) === 'M')) { //ALT keypress
			console.log("keydown acknowledged");
			var options = [];
			var testVar = Math.floor((Math.random() * 1000) + 1);
			var test2 = Math.floor((Math.random() * 10) + 11);
			addConnectedUser(testVar, 'Dummy' + testVar, 'test.js', '/test.js', 'file', test2, {showLines: false});
		}
		if (e.altKey && (String.fromCharCode(e.which) === 'n' || String.fromCharCode(e.which) === 'N')) { //ALT keypress
			console.log("keydown acknowledged");
			var options = [];
			var testVar = $('.projectUserBox').last().attr("uid");
			removeConnectedUser(testVar);
		}
		if (e.altKey && (String.fromCharCode(e.which) === 'b' || String.fromCharCode(e.which) === 'B')) { //ALT keypress
			console.log("keydown acknowledged");
			var options = [];
			options['showLines'] = true;
			options['linesHour'] = Math.floor((Math.random() * 10) + 1);
			options['linesDay'] = Math.floor((Math.random() * 100) + 1);
			options['linesProj'] = Math.floor((Math.random() * 10) + 1);
			
			var testVar = $('.projectUserBox').last().attr("uid");
			var test2 = Math.floor((Math.random() * 1000) + 1);
			var testVar2 = parseInt(testVar) + Math.floor((Math.random() * 10) + 1);
			console.log("renaming user id " + testVar + " to " + "Dummy" + testVar2);
			updateConnectedUser(testVar, '', 'testterm', '', 'terminal', '', options);
		}
		if (e.altKey && (String.fromCharCode(e.which) === 'v' || String.fromCharCode(e.which) === 'V')) { //ALT keypress
			console.log("keydown acknowledged");
			var options = [];
			options['showLines'] = true;
			options['linesHour'] = Math.floor((Math.random() * 10) + 1);
			options['linesDay'] = Math.floor((Math.random() * 100) + 1);
			options['linesProj'] = Math.floor((Math.random() * 10) + 1);
			
			var testVar = $('.projectUserBox').last().attr("uid");
			var test2 = Math.floor((Math.random() * 1000) + 1);
			var testVar2 = parseInt(testVar) + Math.floor((Math.random() * 10) + 1);
			console.log("renaming user id " + testVar + " to " + "Dummy" + testVar2);
			updateConnectedUser(testVar, '', 'oldtestlongfilenameyeah.css', '/new/src/path/oldtest.css', 'file', testVar2, options);
		}
	});
});
///////////////////////////////////////////////////////////////////////////////////////////////








		

	












$(document).ready(function() {
	

	createNewPane();
	resetSizes();
	

	$(document).on('resize', function() {
		
		//console.log($(document).height());
	});
	
	
	
	$( "#userBar" ).sortable({
			//put sortable options here
    });
    
    
	
	// var left = $("#leftBar").width() + $("#toolBarSide").width();
	// var screenWidth = $('body').width();
	// console.log("Setting new width to " + (screenWidth - (left + 24)));
	// $("#rightWindow").width(screenWidth - left - 224);
	// $("#rightWindow").offset({
	// 	'left': left + 224,
	// 	'top': '64'
	// });

	

	// var statusJSON = {
	// 	"commandSet": "base",
	// 	"command": "getChatTreeJSON",
	// }; 
	// wsSendMsg(JSON.stringify(statusJSON));

	$.fn.buildAce = function(mySelector, myFileName, statusBar) {
//		var fileExt = myFileName.match(/\.\w+$/);
		var modelist = require("ace/ext/modelist");
		var mode = modelist.getModeForPath(myFileName).mode;
		console.log("buildAce called with mySelector: " + mySelector + " and myFileName: " + myFileName);
		console.log("buildAce Calaculated ace.edit() call: " + mySelector.replace(/\#/, ''));
		console.log($(mySelector));
		$(mySelector).each(
			function() {
				var editor = ace.edit(mySelector.replace(/\#/, ''));
				$(mySelector).ace = editor;
				$(editor).attr('srcPath', $(mySelector).attr('srcPath'));
				require("ace/ext/statusbar").StatusBar;
				editor.session.setMode(mode);
				var lt = require("ace/ext/language_tools");
				console.log("Language tools:");
				console.log(lt);
				
				// create a simple selection status indicator
				//var statusBar = new StatusBar(editor, $(statusBar));
				$(editor).attr('ignore', 'FALSE');
				editor.setTheme(currentTheme);
    // enable autocompletion and snippets
				editor.setOptions({
					enableBasicAutocompletion: true,
					enableSnippets: true,
					enableLiveAutocompletion: true,
				});				
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
					$.fn.aceChange(editor, e);
				});
			}
		);
	};
	
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


function createNewPane() {
	paneCounter++;
	var MyObject = {
	};

	$.ajax({
		url: "/create_gui_content/createPane.json",
		type: 'post',
		data: {
		'paneCounter': paneCounter,
		'delPanes': deletedPanes,
		},
		datatype: 'json',
		success: function(data) {
			var result = $.parseJSON(data);
			result = result.reply;
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
				eval(result.script);
			}
			if (result.paneId) {

				
				
				//send a message to the server to let it know that we've created a new pane
				var statusJSON = {
						"commandSet": "client",
						"command": "paneOpen",
						"paneOpen" : {
							"paneId" : result.paneId.replace('#',''),
						},
						
				};
				wsSendMsg(JSON.stringify(statusJSON));


				if (result.paneId != "#pane01") {
					var interval_id = setInterval(function(){
				     
				     if($(result.paneId).length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         //
				         focusPane(result.paneId);
				         var newY = $(result.paneId).parent().height() / 2 - $(result.paneId).height() / 2;
						 var newX = $(result.paneId).parent().width() / 2 - $(result.paneId).width() / 2 - $("#toolBarSide").width() - $("#leftBar").width();
						 $(result.paneId).css({
							top: newY,
							left: newX,
							position: 'absolute'
						 });
						 $(result.paneId).attr("oldx", $(result.paneId).position().left);
						 $(result.paneId).attr("oldy", $(result.paneId).position().top);
				      }
					}, 10);
					
				}
				else {
				
					var interval_id = setInterval(function(){
				     
				     if($(result.paneId).length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         //
				         focusPane(result.paneId);
				         maximizePane("pane01");
					 	 $('#pane01').attr('oldheight', ($('#pane01').height() / 2 ));
					 	 $('#pane01').attr('oldwidth', ($('#pane01').width() / 2 ));
					 	 $(result.paneId).attr("oldx", $(result.paneId).position().left);
						 $(result.paneId).attr("oldy", $(result.paneId).position().top);
				      }
					}, 10);
					

				}
			}
			$(result.paneId).addClass("activePane");
			console.log("Successfully loaded data for new pane");
			$(result.paneId).attr("oldx", $(result.paneId).position().left); //these attributes are used if a pane is restored
			$(result.paneId).attr("oldy", $(result.paneId).position().top);
			$(result.paneId).attr("oldheight", $(result.paneId).height());
			$(result.paneId).attr("oldwidth", $(result.paneId).width());


		},
		error: function(data, error, xqhr) {
			console.log("Error creating new pane: " + data);
			console.log("Error creating new pane: " + error);
			console.log("Error creating new pane: " + xqhr);
			return false;
		},
	});
}


function closeTab(tab) {
					var thisLi = tab.parents("li");
console.log(thisLi)
					var numberOfTabs = tab.closest(".menuList").find("li").length;
					var controllerPane = tab.closest(".windowPane").attr("id");
					
					//var tabs = tab.find(".tabBar").tabs();
					
					
					//inform the server that we've closed a tab in case someone is tracking the layout
					var statusJSON = {
						"commandSet": "client",
						"command": "tabClose",
						"tabClose" : {
							"tabId" :  thisLi.attr("aria-controls"),
							"paneId" : controllerPane,
							
						},
										
					};
					wsSendMsg(JSON.stringify(statusJSON));
					
					
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

					
					
					
					$("#" + controllerPane).find(".tabBar").tabs().tabs("refresh");
}


function focusPane(paneId) {
	//	$(".windowPane").not("#" + paneId).removeClass("highZ"); //remove highZ class from all the other elements
	//	$("div #" + paneId).removeClass("lowZ"); //remove lowZ class from this element
	//	$("div #" + paneId).addClass("highZ"); //add highZ class to this element so its focus comes to the front

	if (paneId.indexOf('#') !== -1) {
		paneId = paneId.slice(1);
	}
	if ($('#' + paneId).hasClass('minimizedPane')) { //restore the pane if it is minimized
		restorePane(paneId);
	}
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
	
	
	if (lastFocusedPane != paneId) {
		//send a message to the server to inform it that we have changed the focus of the pane
		var statusJSON = {
				"commandSet": "client",
				"command": "paneFocus",
				"paneFocus" : {
					"paneId" :  paneId,
				},
				
		};
		wsSendMsg(JSON.stringify(statusJSON));

		//now tell the server that there's a new focused tab
		var focusedTab = $('#' + paneId).find('.ui-tabs-active').attr('aria-controls');
		var statusJSON = {
							"commandSet": "client",
							"command": "tabFocus",
							"tabFocus" : {
								"tabId" :  focusedTab,
								"paneId" : paneId,
								
							},
											
		};
		wsSendMsg(JSON.stringify(statusJSON));
		
		//set last focused pane to this one
		lastFocusedPane = paneId;
		checkTerminalSizes(paneId);
	}


}

function maximizePane(paneId) {
	// This is the html for a Maximize button: <span class="paneMaximize ui-icon ui-icon-extlink">

	var thisPane = $("div #" + paneId);
	
	//take a recording from any task boards
	var labelWidths = [];
	thisPane.find('.taskTable').each(function() {
		labelWidths.push($(this).find("th").eq(0).width());
	});

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
	thisPane.removeClass("minimizedPane");
	thisPane.css({
		top: 5,
		left: 5,
		position: 'absolute'
	});
	thisPane.css("display", "block");
	thisPane.height(thisPane.parent().height() - 25);
	thisPane.width(thisPane.parent().width() - 10);
	console.log("REPORTING " + thisPane.find('.menuList').children('li').length);
	thisPane.find('.menuList').children('li').removeClass('activeTab');
	thisPane.find('.menuList').children('li').last().addClass('activeTab');
	//checkTerminalSizes(paneId);
	thisPane.resizable("disable");

	var statusJSON = {
			"commandSet": "client",
			"command": "paneMaximize",
			"paneMaximize" : {
				"paneId" :  paneId,
			},
			
	};
	wsSendMsg(JSON.stringify(statusJSON));
	thisPane.find('.preAceEdit').each(function() {
        		var editor = getAceEditorByName($(this).attr('srcpath'));
        		console.log("getAceEditorByName returned for " + $(this).attr('srcpath'));
        		console.log(editor);
        		editor[0].resize(true);
    });
    
	focusPane(paneId);
	checkTerminalSizes(paneId);
	setTimeout(function(){ 
		thisPane.find('.taskTable').each(function() { //fix task board widths
			$(this).find("th").eq(0).width(labelWidths.shift());
			fixTaskWidth($(this).attr("id"));
	    });
	}, 300);
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
	thisPane.removeClass("minimizedPane");
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
		thisPane.parent().css({position: 'relative'});
		var thisX = parseInt(thisPane.attr("oldx"));
		var thisY = parseInt(thisPane.attr("oldy"));
		thisPane.css({
			top: thisY,
			left: thisX,
			position: 'absolute'
		});

	}
	$(".windowPaneTab[pane='" + paneId + "']").find(".windowPaneTabFocus").css("visibility", "hidden");
	
	//checkTerminalSizes(paneId);
	var panePosition = thisPane.position();
	
	var statusJSON = {
			"commandSet": "client",
			"command": "paneRestore",
			"paneRestore" : {
				"paneId" :  paneId,
				"paneLeft" : panePosition.left,
				"paneTop" : panePosition.top,
				"paneWidth" : thisPane.width(),
				"paneHeight" : thisPane.height(),
				
			},
			
	};
	wsSendMsg(JSON.stringify(statusJSON));
	thisPane.find('.preAceEdit').each(function() {
        		var editor = getAceEditorByName($(this).attr('srcpath'));
        		console.log("getAceEditorByName returned for " + $(this).attr('srcpath'));
        		console.log(editor);
        		editor[0].resize(true);
    });
    
	focusPane(paneId);
	checkTerminalSizes(paneId);
	setTimeout(function(){ 
		thisPane.find('.taskTable').each(function() { //fix task board widths
			fixTaskWidth($(this).attr("id"));
	    });
	}, 300);
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
	thisPane.addClass("minimizedPane");
	thisPane.removeClass("activePane"); //take away active pane status
	
	//find the previously active pane and make it the new active pane (if all panes are minimzed: change nothing. We will have to restore this pane if it needs to be used as an active pane in that case)
	var prevActivePane;

	for (var i = 1; i <= activePanes.length; i = i+1) {
		prevActivePane = activePanes[activePanes.length - i];
		console.log("examining pane " + prevActivePane);

		if (!$('#' + prevActivePane).hasClass('minimizedPane')) { //this means we've found an acceptable pane to change to the active pane.


			var oldPaneLocation = $.inArray(paneId, activePanes); //this was the pane we just minimized array location
			activePanes.splice(oldPaneLocation, 1); //remove it from active panes array
			//these following lines are already taken care of in function focusPane
			// var thisPaneLocation = $.inArray(prevActivePane, activePanes); //this is the new replacement pane array location
			// activePanes.splice(thisPaneLocation, 1); //remove it from where it was in active pane array
			// activePanes.push(prevActivePane); //add it to the end of active pane array
			// $('#' + prevActivePane).addClass('activePane');
			focusPane(prevActivePane);
			break;
		}
		
	}
	
	var thisPaneLocation = $.inArray(paneId, activePanes); //find this pane in the active panes. if it exists remove it
	if (thisPaneLocation > -1) {
		activePanes.splice(thisPaneLocation, 1);
	}
	activePanes.push(paneId); //after having removed this pane from any prior instances in the array we push it to the end
	
	thisPane.css("display", "none");
	//now find the pane in the windowPaneTabs and show the restore button
	$(".windowPaneTab[pane='" + paneId + "']").find(".windowPaneTabFocus").css("visibility", "visible");
	console.log($(".windowPaneTab[pane='" + paneId + "']").find(".windowPaneTabFocus").length);
	
	//let the server know the pane was minimized in case someone is mirroring this layout
	var statusJSON = {
			"commandSet": "client",
			"command": "paneMinimize",
			"paneMinimize" : {
				"paneId" :  paneId,
			},
			
	};
	wsSendMsg(JSON.stringify(statusJSON));
	
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
	
	//Tell the server that we closed this pane.
	var statusJSON = {
			"commandSet": "client",
			"command": "paneClose",
			"paneClose" : {
				"paneId" :  paneId,
			},
			
	};
	wsSendMsg(JSON.stringify(statusJSON));
	

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
		console.log("REDUCING PANE " + thisNumber);
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
				var newName = "Pane " + s1;
				$(this).find(".paneTitle").html(newName);
				
				var statusJSON = {
						"commandSet": "client",
						"command": "paneRename",
						"paneRename" : {
							"paneId" :  $(this).attr("id"),
							"paneName" : newName,
						},
						
				};
				wsSendMsg(JSON.stringify(statusJSON));
			}



			var paneSearch = "Pane " + s2; //we search the window pane tabs, copy the icon box, and insert the new name where appropriate
			var foundPane = $("div .windowPaneTab[panetitle='" + paneSearch + "']");
			console.log(foundPane);
			console.log(foundPane.children(".windowPaneTabIcons"))
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
	var tabTypeU = tabType.charAt(0).toUpperCase() + tabType.slice(1);
	// if (filename == "Default Terminal") {
	// 	var numTerminals = $('li[type="terminal"]').length; //count the terminals
	// 	filename = "Terminal_" + (numTerminals + 1);
	// }
	var paneId = $("#" + tabBarId).closest(".windowPane").attr("id");
	var num_Tabs = $("#" + tabBarId + ' .menuList li').length;
	var tabName = "tab-" + tabBarId + "-" + filename;
	var tabSaved = $(".tabBar").tabs();
	tabName = tabName.replace(/\./g, '_');
	var tabNameNice = filename;
	console.log("tabName is set to " + tabName + " and num_Tabs is set to " + num_Tabs);
	//if ($("#" + tabName).length) {
	if (tabType == "file") {
		if ($("#" + tabBarId).find('[srcpath="' + srcPath + '"]').length) { //check for duplicate files
		
			console.log("We already have this tab open!");
			$("#" + paneId).find(".tabBar").tabs().tabs("refresh");
			var listItemIndex = $("#" + paneId).find('[srcpath="' + srcPath + '"]').index();
		
			$("#" + paneId).find(".tabBar").tabs().tabs("refresh").tabs("option", "active", listItemIndex).tabs("refresh");
			console.log("attempted to set active tab to " + listItemIndex + " because of ");
			console.log("#" + paneId);
			return;
		}
	}
	else if (tabType == "chat") { //a duplicate chat is considered to be any chat by this name active within any pane
		var foundFile = $('li[filename="' + filename + '"]');
		if (foundFile.length) {
			focusPane(foundFile.closest(".windowPane").attr("id")); //focus the location of the already existing chat
			foundFile.closest(".tabBar").tabs().tabs("refresh");
			foundFile.closest(".tabBar").tabs().tabs("option", "active", foundFile.index()).tabs("refresh");
			
			return;
		}
	}
	else if (tabType == "terminal") {//a duplicate terminal is considered to be any terminal by this name active within any pane
		var foundFile = $('li[filename="' + filename + '"]');
		if (foundFile.length) {
			focusPane(foundFile.closest(".windowPane").attr("id")); //focus the location of the already existing terminal
			foundFile.closest(".tabBar").tabs().tabs("refresh");
			foundFile.closest(".tabBar").tabs().tabs("option", "active", foundFile.index()).tabs("refresh");
			
			return;
		}
		
	}
	else if (tabType == "flowchart") { //a duplicate flowchart is considered to be any flowchart by this name active within any pane
		var foundFile = $('li[filename="' + filename + '"]');
		if (foundFile.length) {
			focusPane(foundFile.closest(".windowPane").attr("id")); //focus the location of the already existing flowchart
			foundFile.closest(".tabBar").tabs().tabs("refresh");
			foundFile.closest(".tabBar").tabs().tabs("option", "active", foundFile.index()).tabs("refresh");
			return;
		}
	}
	removeAddTabButton(tabBarId);
	
	
	//tabs.find(".ui-tabs-nav").append(li);
	//tabs.append( "<div id='" + id + "'><p>" + tabContentHtml + "</p></div>" );
	$("#" + tabBarId).tabs().find(".ui-tabs-nav").append(
		"<li type='" + tabType + "' srcpath='" + srcPath + "' filename='" + filename + "'><a href='#" + tabName + "'>" + tabNameNice + "</a><div class='tabIconBox'><span class='reloadButton ui-icon-arrowrefresh-1-s ui-icon'>Refresh Tab</span><span class='closeButton ui-icon ui-icon-close' role='presentation'>Remove Tab</span></div><div class='tabIconClear'></div></li>"
	);
	$("#" + tabBarId).tabs().append("<div class='AriaTab' id='" + tabName + "'></div>");
	var MyObject = {
	};
	console.log("AJAX POST got createContent with srcPath = " + srcPath);
	$.ajax({
		url: "/create_gui_content/createContent.json",
		type: 'post',
		data: {
			'tabName': tabName,
			'tabType': tabTypeU,
			'paneId': tabBarId,
			'originId': originId,
			'chatTarget': filename,
			'srcPath': srcPath,
		},
		datatype: 'json',
		success: function(data) {
		//ADD SERVER CALL HERE
			console.log(data);
			var result = JSON.parse(data);
			result = result.reply;
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
			else if (tabType == 'flowchart') {
				var statusJSON = {
					"commandSet": "flowchart",
					"flowchartCommand": "openFlowchart",
					"flowchartTarget": srcPath,
				};
				var rval = wsSendMsg(JSON.stringify(statusJSON));
				console.log("Informing server we are opening a flowchart !!! Return val from ws was: " + rval);
				console.log(statusJSON);
				console.log(ws);
				console.log("THE CONTAINER HEIGHT IS " + $("#" + tabName).find(".cContainer").height());
				//wait for flowchart box and then initialize menus and mouse events
				var loopCop = 0;
				 var interval_id = setInterval(function(){
				     if($("#" + tabName).find('.flowchart-space').length > 0){ //when we find the new flowchart box we break the interval
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
						 initializeFlowchartContextMenu();
		                 initializeFlowchartMouse();
				     }
				     loopCop ++;
				     if (loopCop > 1000) { //abandon waiting if we get locked up in an infinite loop
				     	clearInterval(interval_id);
				     }
				         
		 		}, 50);
			}
			else if (tabType == 'taskBoard') {
				var statusJSON = {
					"commandSet": "taskBoard",
					"taskBoardCommand": "openTaskBoard",
					"taskBoardTarget": srcPath,
				};
				var rval = wsSendMsg(JSON.stringify(statusJSON));
				console.log("Informing server we are opening a TaskBoard Board !!! Return val from ws was: " + rval);
				console.log(statusJSON);
				console.log(ws);
				console.log("THE CONTAINER HEIGHT IS " + $("#" + tabName).find(".cContainer").height());
			}
			var statusJSON = {
				"commandSet": "client",
				"command": "tabOpen",
				"tabOpen" : {
					"tabId" :  tabName,
					"tabType" : tabType,
					"srcPath" : srcPath,
					"paneId" : paneId,
					
				},
								
			};
			wsSendMsg(JSON.stringify(statusJSON));
			

		},
		error: function(data, error, xqhr) {
			$("#" + tabName + " .ui-icon-close").click();
		},
	});
	//tabs.tabs("refresh").tabs({ active:num_Tabs});
	
	
	//once this tab is created we will run some housekeeping functions
	
	var interval_id = setInterval(function(){ //wait for tab li creation then perform housekeeping tasks
						    
	     if ($('a[href="#' + tabName + '"]').closest("li").length > 0){
	         // "exit" the interval loop with clearInterval command
	         clearInterval(interval_id);
	         //checkTerminalSizes(paneId); //this gets checked already when the terminal is focused which it will be automatically
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
	      }
	}, 20);
	


	return (num_Tabs + 1);

}

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
	//Tell the server that we moved a tab from one pane to the other
	var statusJSON = {
		"commandSet": "client",
		"command": "tabMove",
		"tabMove" : {
			"oldTabId" :  panelId,
			"newTabId" :  newVal,
			"senderPane" : sentPaneId,
			"receiverPane" : paneId,
		},
						
	};
	wsSendMsg(JSON.stringify(statusJSON));
	

	$(".tabBar").tabs("refresh");
	$("#" + paneId).find(".tabBar").tabs("option", "active", -1);
	$("#" + sentPaneId).find(".tabBar").tabs("option", "active", -1);
	$(".tabBar").tabs("refresh");
	
	checkTerminalSizes(paneId);

}

function triggerPaneResizes() {
    $(".maximizedPane").each(function() {
			console.log("found a maximized pane to resize");
			maximizePane($(this).attr("id"));
	});
}
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


function prepareActivePane() { //make sure there is an active pane even if they are all minimized
	if ($('.activePane').length <= 0) { //no active panes found by class
		if (activePanes.length > 0) { //there are active panes in the array of previously active panes
			restorePane(activePanes[activePanes.length - 1]);
		}
		else { //if there were no active panes in the array something has gone wrong. We will just restore the first pane we find
			restorePane($(".windowPane").eq(0).attr("id"));
		}
	}
}

function goToEditorLine(editorSelector,lineNumber) {
	var editor;
	editorSelector = editorSelector.replace(/\#/, ''); //remove possible # from selector id
	var intervalCounter = 0;
	var interval_id = setInterval(function(){ //wait for the editor instance to exist because it may have not been created yet
		 intervalCounter = intervalCounter + 1;
		 if (intervalCounter > 400) {
		 	clearInterval(interval_id);
		 }
		 else {
		 	editor = ace.edit(editorSelector);
		     if (editor.getSession().getValue().length){ //wait for the ace content to exist before attempting to scroll to it
		        // "exit" the interval loop with clearInterval command
		        clearInterval(interval_id);
				editor.resize(true);
				editor.scrollToLine(lineNumber, true, true, function () {});
				editor.gotoLine(lineNumber, 0, true);
		      }
		 }
	}, 20);
	
}