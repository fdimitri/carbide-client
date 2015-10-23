var clickedElement = "";
var clickedElementId = "";
var clickedUser = "";
var clickedTarget = "";
var clickedSubElement = "";

$(document).ready(function() {
    
    
    
    $(document).on('click', '.userFileLink', function() { 
    		var fileName = $(event.target).text();
    		var srcPath = $(event.target).attr("srcpath");
    		var fileType = $(event.target).attr("srctype");
    		var lineNumber = $(event.target).attr("linenumber");
    		var userId = $(event.target).closest('.projectUserBox').attr("uid"); //we will use the userid as the originid in this case
    		if ($(".windowPane").length == 0) {
				createNewPane();
				waitForNewWindow(1, newTab, fileName, userId, fileType, srcPath);
				

			}
			else {
				prepareActivePane(); //make sure we have an active pane that isn't minimized
				newTab(fileName, $(".activePane .tabBar").attr('id'), userId, fileType, srcPath);
			}
			if (fileType == 'file') { //if this is a file we should jump to the line they're on
				
				var intervalCounter = 0;
				var interval_id = setInterval(function(){ //we must wait for an active pane before we find the tab bar id (in case a new window was created)
					intervalCounter = intervalCounter + 1;
					 if (intervalCounter > 400) {
					 	clearInterval(interval_id);
					 }
					 else {
					     if ($('.activePane').length){ //wait for an active pane to exist
					        // "exit" the interval loop with clearInterval command
					        clearInterval(interval_id);
							var editorSelector = "file_tab-" + $(".activePane .tabBar").attr('id') + "-" + fileName; //this should be the ID of the pre inside the new tab
							editorSelector = editorSelector.replace(/\./g, '_');
							goToEditorLine(editorSelector,lineNumber);
					      }
					 }
				}, 100);
			}
			
    });
    
    
	
	$('body').mousedown(function(event) { //keep track of when the mouse goes down on buttons so dragging can be disabled
			if ($(event.target).is('.paneMaximize') || $(event.target).is('.paneRestore') || $(event.target).is('.paneMinimize') || $(event.target).is('.paneClose')) {
				clickedElement = "paneButton";
			}
			else if ($(event.target).is('.paneHeader')) {
				clickedElement = "paneHeader";
			}			else if ($(event.target).is('.windowPaneTabClose')) {
				clickedElement = "paneTabButton";
			}
			///////////////////////JSTREE CLICKS////////////////////////////////
			else if ($(event.target).is("#ftroot0_anchor")) {
				clickedElement = "jsTreeFileRoot";
			}
			else if ($(event.target).is("#chatroot_anchor")) {
				clickedElement = "jsTreeChatRoot";
			}
			else if ($(event.target).is("#terminalroot_anchor")) {
				clickedElement = "jsTreeTerminalRoot";
			}
			else if ($(event.target).is("#taskboardroot_anchor")) {
				clickedElement = "jsTreeTaskBoardRoot";
			}
			else if ($(event.target).is("#flowchartroot_anchor")) {
				clickedElement = "jsTreeFlowchartRoot";
			}
			else if ($(event.target).is(".jstree-anchor")) {
				if ($(event.target).closest(".jsTreeTerminal").length) {
					clickedElement = "jsTreeTerminal";
				}
				else if ($(event.target).closest(".jsTreeChat").length) {
					clickedElement = "jsTreeChat";
				}
				else if ($(event.target).closest(".jsTreeTaskBoard").length) {
					clickedElement = "jsTreeTaskBoard";
				}
				else if ($(event.target).closest(".jsTreeFlowchart").length) {
					clickedElement = "jsTreeFlowchart";
				}
				else if ($(event.target).closest(".jsTreeFile").length) {
					clickedElement = "jsTreeFile";
				}
				else if ($(event.target).closest(".jsTreeFolder").length) {
					clickedElement = "jsTreeFolder";
				}
			}
			else if ($(event.target).is("#tabs-1")) {

				clickedElement = "tree1";
			}
			else if ($(event.target).is("#tabs-2")) {
				clickedElement = "tree2";
			}
			else if ($(event.target).is("#tabs-3")) {
				clickedElement = "tree3";
			}
			////////////////////////USER CLICKS/////////////////////////
			else if ($(event.target).closest("#rightBar").length) {
				if ($(event.target).closest(".projectUserBox").length) {
					clickedElement = "projectUserBox";
					clickedUser = $(event.target).closest(".projectUserBox").attr("uid");
				}
				else {
					clickedElement = "rightBar";
				}

			}
			///////////////////////TASK BOARD CLICKS////////////////////////////
	        else if ($(event.target).closest(".taskRowLabel").length) { //task row label
	            clickedElement = "taskRowLabel";
	            clickedElementId = $(event.target).closest(".taskTable").attr("id");
	            clickedTarget = $(event.target).closest('.taskTable').find('.taskRowLabel').index();
	            var theseLabels = $(event.target).closest(".taskTable").find('.taskRowLabel');
	            var thisLabel = $(event.target).closest(".taskRowLabel");
	            clickedTarget = theseLabels.index(thisLabel);
	        }
	        else if ($(event.target).closest("th").find('.taskHeader').length) { //task column header
	            clickedElement = "taskHeader";
	            clickedElementId = $(event.target).closest(".taskTable").attr("id");
	            
	            var theseHeaders = $(event.target).closest(".taskTable").find('.taskHeader');
	            var thisHeader = $(event.target).closest("th").find('.taskHeader');
	            clickedTarget = theseHeaders.index(thisHeader);
	        }
	        else if ($(event.target).closest('.taskNoSort').length) { //top left of task table
	           
	            clickedElementId = $(event.target).closest(".taskTable").attr("id");
	           
	        }
	        else if ($(event.target).closest("td").find('.taskCell').length) { //task Cell
	            clickedElement = "taskCell";
	            clickedElementId = $(event.target).closest(".taskTable").attr("id");
	            clickedTarget = $(event.target).closest('td').find('.taskCell').attr("id");
	            if ($(event.target).closest('.taskItem').length) { //this is a particular task item
	                clickedElement = $(event.target).closest('.taskItem').attr("id");
					
					if ($(event.target).closest('.taskNotes').length) { //this is a task note on a particular task item
						clickedSubElement = $(event.target).closest('.taskNotes').index();
					}
	            }
	        }
	        
	        
			else {
				if ($(event.target).closest("#tabs-1").length) { //see if we're somewhere inside tree 1 (files)

					clickedElement = "tree1";
				}
				else if ($(event.target).closest("#tabs-2").length) { //see if we're somewhere inside tree 2 (collab)

					clickedElement = "tree2";
				}
				else if ($(event.target).closest("#tabs-3").length) { //see if we're somewhere inside tree 3 (options)

					clickedElement = "tree3";
				}
				else { //not inside any trees
					//clickedElement = "";
					
				}
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
					
					//we no longer have to focus the pane from here since we do it from both maximize pane and restore pane
					//focusPane($(event.target).closest(".windowPaneTab").attr("pane")); //and we'll also focus it.
				}
			}
			// else if ($(event.target).is('.tabBar a')) {
			// 	$(".menuList").children("li").removeClass("activeTab"); //remove all active tabs and set a new one
			// 	$(event.target).closest("li").addClass("activeTab");


			// 	var activeTabId = $(event.target).closest("li").attr('aria-controls'); //add this tab to the activeTabs array and remove prior instances
			// 	var thisTabLocation = $.inArray(activeTabId, activeTabs);
			// 	if (thisTabLocation > -1) {
			// 		activeTabs.splice(thisTabLocation, 1);
			// 	}
				
			
				
			// 	//inform the server that we've focused this tab in case someone is tracking our movements
			// 	activeTabs.push(activeTabId);
			// 	console.log(activeTabs);
			// 	var statusJSON = {
			// 			"commandSet": "client",
			// 			"command": "tabFocus",
			// 			"tabFocus" : {
			// 				"tabId" :  activeTabId,
			// 				"paneId" : $(event.target).closest(".windowPane").attr("id"),
							
			// 			},
										
			// 		};
			// 	wsSendMsg(JSON.stringify(statusJSON));
			// }
			else if ($(event.target).closest('.addNewTab').length) { //the add new tab button is there to allow the user to open content in a new window pane
				var thisDialog = "dialog-info";
				changeDialogTitle(thisDialog,"Choose Content to Open");
				addDialogIcon (thisDialog, "ui-icon-folder-open");
				addDialogInfo (thisDialog, "Please choose something to open in this window pane.");
				addDialogFileTree(thisDialog);
				$("#" + thisDialog).dialog({
			      modal: true,
			      width: 475,
			      height: 510,
			      open: function() {
				      $(this).parents('.ui-dialog-buttonpane button:eq(0)').focus(); 
				      console.log("FOCUS!!!");
				  },
			      buttons: {
			        Ok: function() {
			        	var node = $('#miniFileTree').jstree(true).get_selected(true); //currently selected node in the file tree
						for (var i=0; i < node.length; i = i+1) {
							var thisNode = node[i]; //only duplicate one file
							var fileName = thisNode.text;
							var srcPath = thisNode.li_attr.srcPath;
							console.log(fileName);
							
							newTab(thisNode.text, $(".activePane .tabBar").attr('id'), thisNode.id, thisNode.type, thisNode.li_attr.srcPath);
							
						}
			          $(this).dialog( "close" );
			        },
			        Cancel: function() {
						$(this).dialog("close");
		
					}
			      }
			    });
			}
			if ($(event.target).closest('#dialog-info').length > 0) { //if there is a dialog open, focus on the ok button whenever they click on the dialog
				//unless they are clicking on an input field
				if (($(event.target).closest('input').length == 0) && ($(event.target).closest('textarea').length == 0) && ($(event.target).closest('select').length == 0)) {
					$(event.target).closest('.ui-dialog').find('.ui-dialog-buttonpane button:eq(0)').focus(); 
				}
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
				if ((!$(event.target).is('.paneClose')) && (!$(event.target).is('.paneMinimize'))) { //don't trigger when we are closing a pane or Minimizing
					focusPane($(event.target).closest(".windowPane").attr('id'));
				}
			}
		});
		
		
		
    
});