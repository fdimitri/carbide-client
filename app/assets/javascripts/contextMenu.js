

$(document).ready(function() { //ADD a BINDING FOR EACH DIALOG THAT CLEANS IT UP
	$('.dialog-window').bind('dialogclose', function(event) {
		 dialogId = $(this).attr('id');
		 removeDialogIcon(dialogId);
		 removeDialogInfo(dialogId);
		 changeDialogTitle(dialogId,"Information Dialog");
		 removeDialogColorPicker (dialogId);
		 removeDialogFileTree (dialogId);
 	});
});

$(function() {
	

	$("#selectFile").change(function(){
    	console.log('They have chosen to upload file: ' + $("#selectFile").val());
	});
  
	$("#toolBarSide").contextmenu({
            delegate: ".ui-tabs-panel",
            menu: [
                  
                ],
            
            select: function(event, ui) {
            	
                if (ui.cmd == "openInPane") {
                	var node;
                	
                	if (ui.item.data().type == "file") {
						node = $('#jsTreeFile').jstree(true).get_selected(true);
                	}
                	else if (ui.item.data().type == "chat") {
                		node = $('#jsTreeChat').jstree(true).get_selected(true);
                	}
                	else if (ui.item.data().type == "terminal") {
                		node = $('#jsTreeTerminal').jstree(true).get_selected(true);
                	}
                	else if (ui.item.data().type == "taskBoard") {
                		node = $('#jsTreeTaskBoard').jstree(true).get_selected(true);
                	}
                	else if (ui.item.data().type == "flowchart") {
                		node = $('#jsTreeFlowchart').jstree(true).get_selected(true);
                	}
					var nodeLength = node.length;
					console.log("node length is " + nodeLength)
					console.log(node)
					for (var i = 0; i < nodeLength; i++) {
						if (node[i].type == "taskBoard") { //taskboard has no srcpath
							newTab(node[i].text, ui.item.data().tabbarid, node[i].id, node[i].type, node[i].text);
						}
						else {
					    	newTab(node[i].text, ui.item.data().tabbarid, node[i].id, node[i].type, node[i].li_attr.srcPath);
						}
					    //Do something
					}
					
					
                    //newTab(ui.item.data().filename, ui.item.data().tabbarid, ui.item.data().originid, ui.item.data().type, ui.item.data().srcpath);
                }
                else if (ui.cmd == "deleteFile") {
                	var thisDialog = "dialog-info";
					changeDialogTitle(thisDialog,"Delete File?");
					addDialogIcon (thisDialog, "ui-icon-alert");
					var ref = $('#jsTreeFile').jstree(true);
					var selectedNodes = ref.get_selected();
					var fileAndPath = ref.get_path(selectedNodes,"/");
					var fileName = fileAndPath.substring(fileAndPath.lastIndexOf("/") + 1, fileAndPath.length);
					addDialogInfo (thisDialog, "You are about to delete file <strong>" + fileName + "</strong>. You won't be able to recover it. Are you sure?");
					$("#" + thisDialog).dialog({
						resizable: false,
						height: 270,
						width: 375,
						modal: true,
						buttons: {
							"Delete File": function() {
								$(this).dialog("close");
								deleteFile();
							},
							Cancel: function() {
								removeDialogInfo(thisDialog);
								$(this).dialog("close");
				
							}
						}
					});
					
                }
                else if (ui.cmd == "renameFile") {
                	renameFile();
                }
                else if (ui.cmd == "duplicateFile") {
                	duplicateFile();
                }
                else if (ui.cmd == "downloadFile") {
                	var ref = $('#jsTreeFile').jstree(true);
                	
                	var selectedNodes = ref.get_selected();
                	var fileAndPath = ref.get_path(selectedNodes,"/");
					var fileName = fileAndPath.substring(fileAndPath.lastIndexOf("/") + 1, fileAndPath.length);
					var hashKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + fileName); 
                	var eMsg = {
						"commandSet": "base",
						"command": 'downloadDocument',
						"hash": hashKey,
						"downloadDocument": {
							"srcPath": fileName,
						},
					};

					console.log("downloadDocument is " + fileName);
					console.log("and selectedNodes is " + $(selectedNodes));
					wsSendMsg(JSON.stringify(eMsg));
					
					
			
                }
                 else if (ui.cmd == "createFile") {
                 	var ref = $('#jsTreeFile').jstree(true);
                 	var selectedNodes = ref.get_selected();
                 	if (selectedNodes.length > 1) { //WE CAN ONLY HAVE 1 NODE SELECTED AS THE LOCATION FOR THE NEW FILE SO GO WITH THE FIRST SELECTED NODE
                 		selectedNodes = selectedNodes[0];
                 	}
                 	else if(selectedNodes.length == 0) { //IF NO NODE IS SELECTED WE WILL SELECT THE ROOT
                 		$("#jsTreeFile").jstree('select_node', "ftroot0");
                 		ref = $('#jsTreeFile').jstree(true);
                 		selectedNodes = ref.get_selected();
                 	}
                 	//IF THERE IS NO SELECTED NODE WE WILL USE THE ROOT DIRECTORY
					var fileAndPath = ref.get_path(selectedNodes,"/");
					//var path = fileAndPath.substring(0,fileAndPath.lastIndexOf("/"));
					var realPath = '/';
					if (fileAndPath.indexOf("/") > -1) { //if there is a slash then it isn't the root
						realPath = fileAndPath.substring(fileAndPath.indexOf("/"),fileAndPath.length);
					}
					var nodeType = ref.get_type(selectedNodes);
					if (nodeType == "file") {
						realPath = realPath.substring(0,realPath.lastIndexOf("/"));
					}
					if (realPath == '') { //if the file was in the root add a preceding slash
						realPath = '/';
					}
                	createFile(realPath);
                }
                else if (ui.cmd == "createChat") {
        //         	$('#newChatOpen').attr('checked', false);
				    // $("#newChatTarget").remove();
				    // $("#dialog-newchat").dialog("open");
				    initializeDialogCreateChatRoom();
                }
                else if (ui.cmd == "createTerminal") {
                	
				    $('#newTerminalOpen').attr('checked', false);
				    $("#newTerminalTarget").remove();
				    $("#dialog-newterminal").dialog("open");
                	
                }
                else if (ui.cmd == "createFlowchart") {
        //         	$('#newChatOpen').attr('checked', false);
				    // $("#newChatTarget").remove();
				    // $("#dialog-newchat").dialog("open");
				    newTab("TestFlow", $(".activePane .tabBar").attr('id'), "", "flowchart", "Flowchart_new");
                }
        		else if (ui.cmd == "createTaskBoard") {
					  
					initializeDialogCreateTaskBoard();   			
        			//newTab("TestTaskBoard", $(".activePane .tabBar").attr('id'), "", "taskBoard", "TaskBoard_new");
        		}
        		else if (ui.cmd == "createFolder") {
        			var ref = $('#jsTreeFile').jstree(true);
                 	var selectedNodes = ref.get_selected();
                 	if (selectedNodes.length > 1) { //WE CAN ONLY HAVE 1 NODE SELECTED AS THE LOCATION FOR THE NEW FILE SO GO WITH THE FIRST SELECTED NODE
                 		selectedNodes = selectedNodes[0];
                 	}
                 	else if(selectedNodes.length == 0) { //IF NO NODE IS SELECTED WE WILL SELECT THE ROOT
                 		$("#jsTreeFile").jstree('select_node', "ftroot0");
                 		ref = $('#jsTreeFile').jstree(true);
                 		selectedNodes = ref.get_selected();
                 	}
                 	//IF THERE IS NO SELECTED NODE WE WILL USE THE ROOT DIRECTORY
					var fileAndPath = ref.get_path(selectedNodes,"/");
					//var path = fileAndPath.substring(0,fileAndPath.lastIndexOf("/"));
					var realPath = '/';
					if (fileAndPath.indexOf("/") > -1) { //if there is a slash then it isn't the root
						realPath = fileAndPath.substring(fileAndPath.indexOf("/"),fileAndPath.length);
					}
					var nodeType = ref.get_type(selectedNodes);
					if (nodeType == "file") {
						realPath = realPath.substring(0,realPath.lastIndexOf("/"));
					}
					if (realPath == '') { //if the file was in the root add a preceding slash
						realPath = '/';
					}
                	createFolder(realPath);
        		}
                else if (ui.cmd == "deleteChat") {
                	var thisDialog = "dialog-info";
					changeDialogTitle(thisDialog,"Delete Chatroom?");
					addDialogIcon (thisDialog, "ui-icon-alert");
					var ref = $('#jsTreeChat').jstree(true);
					var selectedNodes = ref.get_selected();
					//var fileAndPath = ref.get_path(selectedNodes,"/");
					//var fileName = fileAndPath.substring(fileAndPath.lastIndexOf("/") + 1, fileAndPath.length);
					var fileName = ref.get_selected(true)[0].text;
					addDialogInfo (thisDialog, "You are about to delete Chat Room <strong>" + fileName + "</strong>. All saved chat data will be lost. Are you sure?");
					$("#" + thisDialog).dialog({
						resizable: false,
						height: 270,
						width: 375,
						modal: true,
						buttons: {
							"Delete Chat": function() {
								$(this).dialog("close");
								deleteChat();
							},
							Cancel: function() {
								removeDialogInfo(thisDialog);
								$(this).dialog("close");
				
							}
						}
					});
                }
                else if (ui.cmd == "deleteTerminal") {
                	var thisDialog = "dialog-info";
					changeDialogTitle(thisDialog,"Delete Terminal?");
					addDialogIcon (thisDialog, "ui-icon-alert");
					var ref = $('#jsTreeTerminal').jstree(true);
					var selectedNodes = ref.get_selected();
					var fileName = ref.get_selected(true)[0].text;

					addDialogInfo (thisDialog, "You are about to delete Terminal <strong>" + fileName + "</strong>. All stored terminal data will be lost. Are you sure?");
					$("#" + thisDialog).dialog({
						resizable: false,
						height: 270,
						width:375,
						modal: true,
						buttons: {
							"Delete Terminal": function() {
								$(this).dialog("close");
								deleteTerminal();
							},
							Cancel: function() {
								removeDialogInfo(thisDialog);
								$(this).dialog("close");
				
							}
						}
					});
                }
                else if ((ui.cmd == "uploadFile") || (ui.cmd == "uploadTarball")){ //upload
        			console.log("UPLOAD FILE!! LINE 177 OF CONTEXTMENU.JS!!!!!");
        			var ref = $('#jsTreeFile').jstree(true);
                 	var selectedNodes = ref.get_selected();
                 	if (selectedNodes.length > 1) { //WE CAN ONLY HAVE 1 NODE SELECTED AS THE LOCATION FOR THE NEW FILE SO GO WITH THE FIRST SELECTED NODE
                 		selectedNodes = selectedNodes[0];
                 	}
                 	else if(selectedNodes.length == 0) { //IF NO NODE IS SELECTED WE WILL SELECT THE ROOT
                 		$("#jsTreeFile").jstree('select_node', "ftroot0");
                 		ref = $('#jsTreeFile').jstree(true);
                 		selectedNodes = ref.get_selected();
                 	}
                 	//IF THERE IS NO SELECTED NODE WE WILL USE THE ROOT DIRECTORY
					var fileAndPath = ref.get_path(selectedNodes,"/");
					//var path = fileAndPath.substring(0,fileAndPath.lastIndexOf("/"));
					var realPath = '/';
					if (fileAndPath.indexOf("/") > -1) { //if there is a slash then it isn't the root
						realPath = fileAndPath.substring(fileAndPath.indexOf("/"),fileAndPath.length);
					}
					var nodeType = ref.get_type(selectedNodes);
					if (nodeType == "file") {
						realPath = realPath.substring(0,realPath.lastIndexOf("/"));
					}
					if (realPath == '') { //if the file was in the root add a preceding slash
						realPath = '/';
					}
                	console.log("THE UPLOAD WILL GO TO PATH: " + realPath + " which is varname 'realPath' (Line 202 CONTEXTMENU.JS)");
                	if (ui.cmd == "uploadFile") {
                		console.log("THE UPLOAD IS A FILE (Line 204 CONTEXTMENU.JS)");
                		$("#selectFile").removeAttr("accept");
                		$("#selectFile").trigger("click");
                	}
                	else if (ui.cmd == "uploadTarball") {
                		console.log("THE UPLOAD IS A Tarball (Line 207 CONTEXTMENU.JS)");
                		$("#selectFile").attr("accept", ".tar,.tar.gz,.tgz,.gz");
                		$("#selectFile").trigger("click");
                	}
                }
                
                  
            },
            beforeOpen: function(event, ui) {
				if (clickedElement == "jsTreeAnchor") {  //don't show the context menu if they are on a jstree node
					return false;
				}
				else if (clickedElement == "jsTreeFileRoot") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                		{title: '---'},
                		{title: '<span class="contextMenuItem">Upload File</span>', uiIcon: "ui-icon-document", cmd: "uploadFile"},
                		{title: '<span class="contextMenuItem">Upload Tarball</span>', uiIcon: "ui-icon-suitcase", cmd: "uploadTarball"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeFolder") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "	ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                		{title: '---'},
						{title: '<span class="contextMenuItem">Download Directory</span>', uiIcon: "ui-icon-arrowthick-1-se", cmd: "downloadFile"},
						{title: '---'},
                		{title: '<span class="contextMenuItem">Upload File</span>', uiIcon: "ui-icon-document", cmd: "uploadFile"},
                		{title: '<span class="contextMenuItem">Upload Tarball</span>', uiIcon: "ui-icon-suitcase", cmd: "uploadTarball"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeFile") {

					var menuPanes = [];
					var node = $('#jsTreeFile').jstree(true).get_selected(true);
					node = node[0];
					if ($(".windowPane").length) { //if a window pane is open, loop through all the window panes and add them as choices to the context menu
						$(".windowPane").each(function() {
							var paneNumber = $(this).find(".paneTitle").text().match(/\d+/);
	
					
							var windowPane = this;
								 
								 //var nodeData = {filename: node.text, tabbarid: $(windowPane).find(".tabBar").attr('id'), originid: node.id, type: node.type, srcpath: node.li_attr.srcPath};
								var nodeData = {tabbarid: $(windowPane).find(".tabBar").attr('id'), type: node.type}; //this is the window pane they selected to open it in and the type
					
							var tempPane = {title: '<span class="contextMenuItem">Open in Pane ' + paneNumber + '</span>', cmd:'openInPane',data: nodeData	}
							menuPanes.push(tempPane);
						});
					}
					else { //no window pane is open, give them the choice to open the file in a new window pane
						menuPanes[0] = {title: '<span class="contextMenuItem">Open in New Window Pane</span>', cmd:'openInPane', uiIcon: "ui-icon-plus", data: {tabbarid: "new"}	}
					}

					$("#toolBarSide").contextmenu("replaceMenu", [
							{title: '<span class="contextMenuItem">Open in...</span>', uiIcon: "ui-icon-arrowthick-1-e", children: 
								menuPanes
							},
                		{title: '<span class="contextMenuItem">Rename</span>', uiIcon: "ui-icon-script", cmd: "renameFile"},
                		{title: '<span class="contextMenuItem">Duplicate</span>', uiIcon: "ui-icon-carat-2-e-w", cmd: "duplicateFile"},
						{title: '<span class="contextMenuItem">Delete</span><span class="contextMenuShortcut">Del</span>', uiIcon: "ui-icon-closethick", cmd: "deleteFile"},
						{title: '---'},
						{title: '<span class="contextMenuItem">Download File</span>', uiIcon: "ui-icon-arrowthick-1-se", cmd: "downloadFile"},
						{title: '---'},
						{title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                		{title: '---'},
                		{title: '<span class="contextMenuItem">Upload File</span>', uiIcon: "ui-icon-document", cmd: "uploadFile"},
                		{title: '<span class="contextMenuItem">Upload Tarball</span>', uiIcon: "ui-icon-suitcase", cmd: "uploadTarball"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeChatRoot") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New Chat Room</span>', uiIcon: "ui-icon-comment", cmd: "createChat"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeTerminalRoot") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New Terminal</span>', uiIcon: "ui-icon-calculator", cmd: "createTerminal"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeTaskBoardRoot") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New Task Board</span>', uiIcon: "ui-icon-calendar", cmd: "createTaskBoard"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeFlowchartRoot") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New Flowchart</span>', uiIcon: "	ui-icon-clipboard", cmd: "createFlowchart"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeChat") {
					var node = $('#jsTreeChat').jstree(true).get_selected(true);
					node = node[0];
					var menuPanes = [];
					if ($(".windowPane").length) { //if a window pane is open, loop through all the window panes and add them as choices to the context menu
						$(".windowPane").each(function() {
							var paneNumber = $(this).find(".paneTitle").text().match(/\d+/);
	
					
							var windowPane = this;
								 
								 //var nodeData = {filename: node.text, tabbarid: $(windowPane).find(".tabBar").attr('id'), originid: node.id, type: node.type, srcpath: node.li_attr.srcPath};
								var nodeData = {tabbarid: $(windowPane).find(".tabBar").attr('id'), type: node.type}; //this is the window pane they selected to open it in and the type
					
							var tempPane = {title: '<span class="contextMenuItem">Open in Pane ' + paneNumber + '</span>', cmd:'openInPane',data: nodeData	}
							menuPanes.push(tempPane);
						});
					}
					else { //no window pane is open, give them the choice to open the file in a new window pane
						menuPanes[0] = {title: '<span class="contextMenuItem">Open in New Window Pane</span>', cmd:'openInPane', uiIcon: "ui-icon-plus", data: {tabbarid: "new"}	}
					}

					$("#toolBarSide").contextmenu("replaceMenu", [
							{title: '<span class="contextMenuItem">Open in...</span>', uiIcon: "ui-icon-arrowthick-1-e", children: 
								menuPanes
							},
						{title: '<span class="contextMenuItem">Delete</span><span class="contextMenuShortcut">Del</span>', uiIcon: "ui-icon-closethick", cmd: "deleteChat"},
						{title: '---'},
						{title: '<span class="contextMenuItem">Create New Chat Room</span>', uiIcon: "ui-icon-comment", cmd: "createChat"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeTerminal") {
					var node = $('#jsTreeTerminal').jstree(true).get_selected(true);
					node = node[0];
					var menuPanes = [];
					if ($(".windowPane").length) { //if a window pane is open, loop through all the window panes and add them as choices to the context menu
						$(".windowPane").each(function() {
							var paneNumber = $(this).find(".paneTitle").text().match(/\d+/);
	
					
							var windowPane = this;
								 
								 //var nodeData = {filename: node.text, tabbarid: $(windowPane).find(".tabBar").attr('id'), originid: node.id, type: node.type, srcpath: node.li_attr.srcPath};
								var nodeData = {tabbarid: $(windowPane).find(".tabBar").attr('id'), type: node.type}; //this is the window pane they selected to open it in and the type
					
							var tempPane = {title: '<span class="contextMenuItem">Open in Pane ' + paneNumber + '</span>', cmd:'openInPane',data: nodeData	}
							menuPanes.push(tempPane);
						});
					}
					else { //no window pane is open, give them the choice to open the file in a new window pane
						menuPanes[0] = {title: '<span class="contextMenuItem">Open in New Window Pane</span>', cmd:'openInPane', uiIcon: "ui-icon-plus", data: {tabbarid: "new"}	}
					}

					$("#toolBarSide").contextmenu("replaceMenu", [
							{title: '<span class="contextMenuItem">Open in...</span>', uiIcon: "ui-icon-arrowthick-1-e", children: 
								menuPanes
							},
						{title: '<span class="contextMenuItem">Delete</span><span class="contextMenuShortcut">Del</span>', uiIcon: "ui-icon-closethick", cmd: "deleteTerminal"},
						{title: '---'},
						{title: '<span class="contextMenuItem">Create New Terminal</span>', uiIcon: "ui-icon-calculator", cmd: "createTerminal"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeTaskBoard") {
					var node = $('#jsTreeTaskBoard').jstree(true).get_selected(true);
					node = node[0];
					var menuPanes = [];
					if ($(".windowPane").length) { //if a window pane is open, loop through all the window panes and add them as choices to the context menu
						$(".windowPane").each(function() {
							var paneNumber = $(this).find(".paneTitle").text().match(/\d+/);
	
					
							var windowPane = this;
								 
								var nodeData = {tabbarid: $(windowPane).find(".tabBar").attr('id'), type: node.type}; //this is the window pane they selected to open it in and the type
					
							var tempPane = {title: '<span class="contextMenuItem">Open in Pane ' + paneNumber + '</span>', cmd:'openInPane',data: nodeData	}
							menuPanes.push(tempPane);
						});
					}
					else { //no window pane is open, give them the choice to open the file in a new window pane
						menuPanes[0] = {title: '<span class="contextMenuItem">Open in New Window Pane</span>', cmd:'openInPane', uiIcon: "ui-icon-plus", data: {tabbarid: "new"}	}
					}

					$("#toolBarSide").contextmenu("replaceMenu", [
							{title: '<span class="contextMenuItem">Open in...</span>', uiIcon: "ui-icon-arrowthick-1-e", children: 
								menuPanes
							},
						{title: '<span class="contextMenuItem">Delete</span><span class="contextMenuShortcut">Del</span>', uiIcon: "ui-icon-closethick", cmd: "deleteChat"},
						{title: '---'},
						{title: '<span class="contextMenuItem">Create New Task Board</span>', uiIcon: "ui-icon-comment", cmd: "createTaskBoard"},
                    
                    ]);
				}
				else if (clickedElement == "tree1") {
					 $("#toolBarSide").contextmenu("replaceMenu", [
                        {title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                		{title: '---'},
                		{title: '<span class="contextMenuItem">Upload File</span>', uiIcon: "ui-icon-document", cmd: "uploadFile"},
                		{title: '<span class="contextMenuItem">Upload Tarball</span>', uiIcon: "ui-icon-suitcase", cmd: "uploadTarball"},
                    
                    ]);
				}
				else if (clickedElement == "tree2") {
					 $("#toolBarSide").contextmenu("replaceMenu", [
                        {title: '<span class="contextMenuItem">Create New Chat Room</span>', uiIcon: "ui-icon-comment", cmd: "createChat"},
                		{title: '<span class="contextMenuItem">Create New Terminal</span>', uiIcon: "ui-icon-calculator", cmd: "createTerminal"},
                    
                    ]);
				}
				else if (clickedElement == "tree3") {
					 $("#toolBarSide").contextmenu("replaceMenu", [
                        {title: "Menu Item 5", cmd: "editText"},
                		{title: "Menu Item 6", cmd: "changeColor"},
                    
                    ]);
				}
				else { //don't show a context menu if there is no appropriate menu
					return(false);
				}
		
		
                
            }
        
    });
	$("#rightBar").contextmenu({
            //delegate: ".ui-tabs-panel",
            menu: [
                  
                ],
            
            select: function(event, ui) {
            	if (ui.cmd == "trackInPane") {
            		var userId = ui.item.data().user;
            		var userName = $('.projectUserBox[uid=' + userId + ']').find('.projectUserName').text();
            		var tabbarId = ui.item.data().tabbarid;
			
            		console.log("tracking user ID: " + userId + " name: " + userName + " in tabbar " + tabbarId);
            		if ($('#' + tabbarId).closest(".windowPane").find("[role='tab']").length > 1) { //if there are tabs in this pane we must warn them that they'll be closed
            			console.log("TABS FOUND IN PANE! ISSUING WARNING!");
            			
            		}
            		else if ($('#' + tabbarId).closest(".windowPane").find("[role='tab']").length == 1) { //if there is 1 tab we need to check if it's the add tab button
            			if ($('#' + tabbarId).closest(".windowPane").find('.addNewTab').length > 0) { //the only tab is an addnewtab button
            				console.log("NO TABS FOUND IN THE SELECTED PANE! WE'RE ALL GOOD!");
            			}
            			else { //it's a real tab, we have to warn them that it will be lost
            				console.log("TABS FOUND IN PANE! ISSUING WARNING!");
            			}
            		}
            		else { //it is an empty window so we can proceed
            			console.log("NO TABS FOUND IN THE SELECTED PANE! WE'RE ALL GOOD!");
            		}
            	}
            },
            beforeOpen: function(event, ui) {
            	if (clickedElement == "rightBar") { //this is the empty right bar, away from any user box.
            		return(false);
            	}
				else if (clickedElement == "projectUserBox") { //project user box context menu
					var userId = clickedUser;
					var menuPanes = [];
					menuPanes[0] = {title: '<span class="contextMenuItem">in New Window Pane</span>', cmd:'trackInPane', uiIcon: "ui-icon-plus", data: {tabbarid: "new", user: userId}	}
					if ($(".windowPane").length) { //if a window pane is open, loop through all the window panes and add them as choices to the context menu
						$(".windowPane").each(function() {
							var paneNumber = $(this).find(".paneTitle").text().match(/\d+/);
							var windowPane = this;
							var userData = {tabbarid: $(windowPane).find(".tabBar").attr('id'), user: userId}; //this is the window pane they selected to open it in and the username
							var tempPane = {title: '<span class="contextMenuItem">in Pane ' + paneNumber + '</span>', cmd:'trackInPane',data: userData	}
							menuPanes.push(tempPane);
						});
					}
					else { //no window pane is open, but we already added the option for a new window pane so do nothing for now
					}

					$("#rightBar").contextmenu("replaceMenu", [
							{title: '<span class="contextMenuItem">Track User...</span>', uiIcon: "ui-icon-person", children: 
								menuPanes
							},
						
                    ]);
			
				}

            },
	});
});




function fileTreeMenu(node) {
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
					console.log($(windowPane).attr('id'));
					console.log(node.text);

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



   if ($(node).attr("type") == "root") {
	    

	    if ($(node).attr("id") == "fileroot") {
	    	var items = {
    		    newFile: { // create a new file
    				label: "Create New File",
    				action: function() {
    				    console.log("create new file here.");
    				    $('#newFileOpen').attr('checked', false);
    				    $("#newFileTarget").remove();
    				    
    				    
    				    $("#dialog-newfile").dialog("open");
    				}
			    }
    		};
	    }

	}



	return items;

}

$(document).ready(function() {
    
    

    $("#dialog-newterminal").dialog({
        autoOpen: false
    });
    $("#newTerminalSubmit").click(function(e) {
        e.preventDefault();
        var termName = $("#newTerminalName").val();
        var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + termName); 
        if (termName === '') {
            alert("Please enter a name for the terminal.");
             e.preventDefault();
        } else {
			var statusJSON = {
				"commandSet": "base",
				"command": "createTerm",
				"createTerm": {
					"termName": termName,
					"key": randomKey,
				},
			};
			var rval = wsSendMsg(JSON.stringify(statusJSON));
			while (!getMsg(randomKey)) {
				setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
        	}	
			var result = getMsg(randomKey);
			if (result['status'] == true) {
				// Room create successful
			
			}
			else {
				// Room create failed
				// Put msg in modal dialog
			}

            //actions to take before form is submitted.
            console.log("form submitted with terminal name " + termName);

            if($('#newTerminalOpen').is(":checked"))   {
                console.log("They have requested to open the terminal in window pane:");
                console.log($("#newTerminalTarget").val());
                var tabBarId =  $('#' + $("#newTerminalTarget").val()).find(".tabBar").attr("id");
                var fileName = termName;
                var tabBarId = tabBarId;
                var originId = 'unknown';
                var srcPath = '';
				newTab(fileName, tabBarId, originId, 'terminal', srcPath);

            }
            $("#dialog-newterminal").dialog("close");
           
            //open the terminal branch of the jstree
				var nodeRef = $('#jsTreeTerminal').jstree(true);
				 
				var thisNode = nodeRef.get_node('terminalroot');
				nodeRef.deselect_all(true); //deselect nodes

				nodeRef.open_node(thisNode);
			
			//select the new node
				var interval_id = setInterval(function(){
				     // $("li#"+id).length will be zero until the node is loaded
				     if($("li#"+termName).length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         var thisNode = nodeRef.get_node(termName);
				        
						nodeRef.select_node(thisNode);
						var thisElement = document.getElementById(termName);
						$('#tabs-2').scrollTop( thisElement.offsetTop - 20 );
				      }
				}, 10);
			   
				
					
			
				
				
        }
    });
    
    $("#dialog-newchat").dialog({
        autoOpen: false
    });
    $("#newChatSubmit").click(function(e) {
        e.preventDefault();
        var chatName = $("#newChatName").val();
        var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + chatName); 
        if (chatName === '') {
            alert("Please enter a name for the chat room.");
             e.preventDefault();
        } else {
            //actions to take before form is submitted.
			var statusJSON = {
				"commandSet": "base",
				"command": "createChat",
				"createChat": {
					"roomName": chatName,
					"key": randomKey,
				},
			};
			var rval = wsSendMsg(JSON.stringify(statusJSON));
			while (!getMsg(randomKey)) {
				setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
        	}	
			var result = getMsg(randomKey);
			if (result['status'] == true) {
				// Room create successful
			
			}
			else {
				// Room create failed
				// Put msg in modal dialog
			}

            console.log("form submitted with chat name " + chatName);
           
            if($('#newChatOpen').is(":checked"))   {
                console.log("They have requested to open the chat in window pane:");
                console.log($("#newChatTarget").val());
                var tabBarId =  $('#' + $("#newChatTarget").val()).find(".tabBar").attr("id");
                
                var fileName = chatName;
                var tabBarId = tabBarId;
                var originId = 'unknown';
                var srcPath = '';
				newTab(fileName, tabBarId, originId, 'chat', srcPath);
                
            }
            $("#dialog-newchat").dialog("close");
            
             //open the chat branch of the jstree
				var nodeRef = $('#jsTreeChat').jstree(true);
				nodeRef.deselect_all(true); //deselect nodes
				var thisNode = nodeRef.get_node('chatroot');

				nodeRef.open_node(thisNode);
			//select the new node
				var interval_id = setInterval(function(){
				     // $("li#"+id).length will be zero until the node is loaded
				     if($("li#"+chatName).length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         var thisNode = nodeRef.get_node(chatName);
						nodeRef.select_node(thisNode);
						var thisElement = document.getElementById(chatName);
						$('#tabs-2').scrollTop( thisElement.offsetTop - 20 );
				      }
				}, 10);
				
        }
    });
	$("#dialog-newfile").dialog({
        autoOpen: false
    });
    $("#newFileSubmit").click(function(e) {
        e.preventDefault();
        var fileName = $("#newFileName").val();
        var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + fileName); 
        if (fileName === '') {
            alert("Please enter a filename.");
             e.preventDefault();
        } else {
            //actions to take before form is submitted.
            var ref = $('#jsTreeFile').jstree(true);
			var selectedNodes = ref.get_selected();
			var filePath = ref.get_path(selectedNodes,"/");

			var statusJSON = {
				"commandSet": "base",
				"command": "createFile",
				"createFile": {
					"fileName": fileName,
					"key": randomKey,
				},
			};
			var rval = wsSendMsg(JSON.stringify(statusJSON));
			while (!getMsg(randomKey)) {
				setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
        	}	
			var result = getMsg(randomKey);
			if (result['status'] == true) {
				// file create successful
			
			}
			else {
				// File create failed
				// Put msg in modal dialog
			}


           //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
           //I NEED TO FIND OUT THE FORMAT FOR SOME OF THESE INPUTS. I THINK SRCPATH CAN BE DERIVED FROM VARIABLES filePath + fileName
           //BUT IM NOT SURE WHAT TO DO WITH ORIGINID OR TABBARID. IS TABBARID THE TAB THE FILE OPENS IN? WHY IS IT UNKNOWN?
           
            if($('#newFileOpen').is(":checked"))   {
                console.log("They have requested to open the file in window pane:");
                console.log($("#newFileTarget").val());
               
                
                var tabBarId =  $('#' + $("#newFileTarget").val()).find(".tabBar").attr("id");
                var originId = 'unknown';
                var srcPath = filePath.substring(filePath.indexOf("/"), filePath.length) + '/' + fileName;

				newTab(fileName, tabBarId, originId, 'file', srcPath)
                
            }
            $("#dialog-newfile").dialog("close");
        }
    });    
});
function fileCheckBoxChanged() {
    
    if($('#newFileOpen').is(":checked"))   {
        var selectOutput = '<select name="fileselect" id="newFileTarget">';
        $(".windowPane").each(function() {
    		var paneNumber = $(this).attr('id').match(/\d+/);
    		var paneName = $(this).attr('id');
    
    		selectOutput = selectOutput + '<option value="' + paneName + '">Pane ' + paneNumber + '</option>';
    	});
    	selectOutput = selectOutput + '</select>';
    	$("#newFileDropDownBox").append(selectOutput);
    }
    else {
       $("#newFileTarget").remove();
    }
        
}
function chatCheckBoxChanged() {
    
    if($('#newChatOpen').is(":checked"))   {
        var selectOutput = '<select name="chatselect" id="newChatTarget">';
        $(".windowPane").each(function() {
    		var paneNumber = $(this).attr('id').match(/\d+/);
    		var paneName = $(this).attr('id');
    
    		selectOutput = selectOutput + '<option value="' + paneName + '">Pane ' + paneNumber + '</option>';
    	});
    	selectOutput = selectOutput + '</select>';
    	$("#newChatDropDownBox").append(selectOutput);
    }
    else {
       $("#newChatTarget").remove();
    }
        
}
function terminalCheckBoxChanged() {
    
    if($('#newTerminalOpen').is(":checked"))   {
        var selectOutput = '<select name="terminalselect" id="newTerminalTarget">';
        $(".windowPane").each(function() {
    		var paneNumber = $(this).attr('id').match(/\d+/);
    		var paneName = $(this).attr('id');
    
    		selectOutput = selectOutput + '<option value="' + paneName + '">Pane ' + paneNumber + '</option>';
    	});
    	selectOutput = selectOutput + '</select>';
    	$("#newTerminalDropDownBox").append(selectOutput);
    }
    else {
       $("#newTerminalTarget").remove();
    }
        
}

function addDialogIcon (dialogId, dialogIcon) {
	
	//choices for dialogIcon: ui-icon-alert ui-icon-question ui-icon-info ui-icon-folder-collapsed
	
	var dialogInfo = '<span class="dialogIcon ui-icon ' + dialogIcon + '" style="float:left; margin:0 7px 20px 0;"></span>';
	$("#" + dialogId).find(".dialog-info-space").prepend(dialogInfo);
}
function removeDialogIcon (dialogId) {
	$("#" + dialogId).find(".dialogIcon").remove();	
}
function addDialogInfo (dialogId, dialogMsg) {
	var dialogInfo = '<div class="dialogInfo">' + dialogMsg + '</div><div class="dialogClear" style="clear:both;"></div>';
	$("#" + dialogId).find(".dialog-info-space").append(dialogInfo);
}
function removeDialogInfo (dialogId) {
	$("#" + dialogId).find(".dialogInfo").remove();	
	$("#" + dialogId).find(".dialogClear").remove();	
}
function changeDialogTitle (dialogId, dialogTitle) {
	$("#" + dialogId).closest('.ui-dialog').find('.ui-dialog-title').html(dialogTitle);
	$("#" + dialogId).prop('title', dialogTitle);
}
function addDialogQuestion (dialogId, textLabel, textId, textName) { //add a text box to get info from the user
	var dialogInfo = '<div class="dialogQuestion"><label>' + textLabel + ' </label><input id="' + textId + '" name="' + textName + '" type="text"/></div>';
	$("#" + dialogId).find(".dialog-info-space").append(dialogInfo);
	
}
function removeDialogQuestion (dialogId) {
	$("#" + dialogId).find(".dialogQuestion").remove();	
}
function addDialogCheckBox (dialogId, textLabel, checkBoxId, checkBoxName, changeFunction) {
	var dialogInfo = '<div class="dialogCheckBox"><p>' + textLabel + ' <input type="checkbox" id="' + checkBoxId + '" name="' + checkBoxName + '"/></p>';
	
	dialogInfo = dialogInfo + '<div id="dialogCheckBoxDropDownBox"></div></div>';
	$("#" + dialogId).find(".dialog-info-space").append(dialogInfo);
	$('#' + checkBoxId).change(function() {
		changeFunction(checkBoxId);
	});
}
function dialogCheckBoxChanged(checkBoxId) {
    
    if($('#' + checkBoxId).is(":checked"))   {
        var selectOutput = '<select name="dialogselect" id="newDialogTarget">';
        $(".windowPane").each(function() {
    		//var paneNumber = $(this).attr('id').match(/\d+/);
    		var paneId = $(this).attr('id');
    		var paneName = $(this).find('.paneTitle').text();
    
    		selectOutput = selectOutput + '<option value="' + paneId + '">' + paneName + '</option>';
    	});
    	selectOutput = selectOutput + '</select>';
    	$("#dialogCheckBoxDropDownBox").append(selectOutput);
    }
    else {
       $("#newDialogTarget").remove();
    }
        
}
function removeDialogCheckBox (dialogId) {
	$("#" + dialogId).find(".dialogCheckBox").remove();	
}
function addDialogError(dialogId,errorMsg) {
	var dialogInfo = '<div class="dialogError"><p>' + errorMsg + '</p></div>'
	$("#" + dialogId).find(".dialog-info-space").prepend(dialogInfo);
}
function removeDialogError(dialogId) {
	$("#" + dialogId).find(".dialogError").remove();	
}
function addDialogColorPicker (dialogId, textLabel, colorId, colorName, defaultColor) {
	var dialogInfo = '<div class="dialogColorPicker"><label>' + textLabel + ' </label><input type="color" name="' + colorName + '" id="' + colorId + '" value="' + defaultColor + '" class="colorPickerBox"></input></div>';
	$("#" + dialogId).find(".dialog-info-space").append(dialogInfo);
}
function removeDialogColorPicker (dialogId) {
	$("#" + dialogId).find(".dialogColorPicker").remove();	
}
function addDialogFileTree (dialogId) {
	var dialogInfo = '<div class="dialogFileTree">';
	dialogInfo = dialogInfo + '</div>';
	$("#" + dialogId).find(".dialog-info-space").append(dialogInfo);
	// $('#jsTreeFile').clone().prop('id', 'miniFileTree' ).appendTo('.dialogFileTree');
	// var thisProp;
	// $('#miniFileTree').find('li').each(function() {
	// 	thisProp = $(this).prop('id');
	// 	$(this).prop('id', thisProp + '_mini');
	// 	$(this).attr('aria-labelledby', thisProp + '_mini_anchor');
	// 	$(this).find('a').prop('id', thisProp + '_mini_anchor');
	
	// });
	var toAppend = '<div id="miniFileTree"></div>';
	$(toAppend).appendTo('.dialogFileTree');
	//get data and start file trees
	console.log(":")
	var statusJSON = {
		"commandSet": "FileTree",
		"command": "getFileTreeModalJSON",
	};
	wsSendMsg(JSON.stringify(statusJSON));
}
function removeDialogFileTree (dialogId) {
	$("#" + dialogId).find(".dialogFileTree").remove();	
}

function displayServerError(failedProcess,errorReason) {
	console.log("This function should open a dialog. but for now it just displays to the console");
	console.log("error executing command " + failedProcess + ": " + errorReason);
}

function initializeDialogCreateTaskBoard() {
	var thisDialog = "dialog-info";
	changeDialogTitle(thisDialog,"Create New Task Board");
	//addDialogIcon (thisDialog, "ui-icon-clipboard");
	var ref = $('#jsTreeTaskBoard').jstree(true);
	var selectedNodes = ref.get_selected();
	var fileName = ref.get_selected(true)[0].text;
	addDialogError(thisDialog,'&nbsp;');
	//addDialogInfo (thisDialog, "Please name your task board.");
	addDialogQuestion (thisDialog, 'New Task Board Name:', 'newTaskBoardName', 'Name');
	addDialogCheckBox(thisDialog,'Open in Window Pane:', 'taskCheckBox', 'Open',dialogCheckBoxChanged);
	$("#" + thisDialog).dialog({
						resizable: false,
						height: 320,
						width: 375,
						modal: true,
						buttons: {
							"Create Task Board": function(e) {
								if (!$('#newTaskBoardName').val()) {
									removeDialogError(thisDialog);
									addDialogError(thisDialog,"* Enter a Task Board Name to Continue!");
									e.preventDefault();
								}
								else {
									//createNewTaskBoard($('#newTaskBoardName').val(), $("#newDialogTarget").val());
									sendTaskRequest('createTaskBoard', {'taskBoardName': $('#newTaskBoardName').val(), 'windowPane': $("#newDialogTarget").val()}, createTaskBoard);
									removeDialogInfo(thisDialog);
									removeDialogQuestion(thisDialog);
									removeDialogCheckBox(thisDialog);
									removeDialogError(thisDialog);
									$(this).dialog("close");
								}

							},
							Cancel: function() {
								removeDialogInfo(thisDialog);
								removeDialogQuestion(thisDialog);
								removeDialogCheckBox(thisDialog);
								removeDialogError(thisDialog);
								$(this).dialog("close");
				
							}
						}
					});

}
function initializeDialogCreateChatRoom() {
	var thisDialog = "dialog-info";
	changeDialogTitle(thisDialog,"Create New Chat Room");
	var ref = $('#jsTreeChat').jstree(true);
	var selectedNodes = ref.get_selected();
	var fileName = ref.get_selected(true)[0].text;
	addDialogError(thisDialog,'&nbsp;');
	addDialogQuestion (thisDialog, 'New Chat Room Name:', 'newChatRoomName', 'Name');
	addDialogCheckBox(thisDialog,'Open in Window Pane:', 'chatCheckBox', 'Open',dialogCheckBoxChanged);
	$("#" + thisDialog).dialog({
						resizable: false,
						height: 320,
						width: 375,
						modal: true,
						buttons: {
							"Create Chat Room": function(e) {
								if (!$('#newChatRoomName').val()) {
									removeDialogError(thisDialog);
									addDialogError(thisDialog,"* Enter a Chat Room Name to Continue!");
									e.preventDefault();
								}
								else {
									//createNewChatRoom($('#newChatRoomName').val(), $("#newDialogTarget").val());
									sendChatRequest('createChatRoom', {'chatRoomName': $('#newChatRoomName').val(), 'windowPane': $("#newDialogTarget").val()}, createChatRoom);
									/* FrankD:
									Probably just ignore this for now.. not really sure on where we should put the windowPane logic yet.
									
									sendWindowRequest('newTab', {'newTabName' : 'blah', 'windowName' : 'blah', 'srcType' : 'chat', 'srcPath' : '$CHATS/' + $('#newChatRoomName')});
									*/
									
									removeDialogQuestion(thisDialog);
									removeDialogCheckBox(thisDialog);
									removeDialogError(thisDialog);
									$(this).dialog("close");
								}

							},
							Cancel: function() {
								removeDialogQuestion(thisDialog);
								removeDialogCheckBox(thisDialog);
								removeDialogError(thisDialog);
								$(this).dialog("close");
				
							}
						}
					});
}
function initializeDialogCreateTerminal() {
	var thisDialog = "dialog-info";
	changeDialogTitle(thisDialog,"Create New Terminal");
	var ref = $('#jsTreeTerminal').jstree(true);
	var selectedNodes = ref.get_selected();
	var fileName = ref.get_selected(true)[0].text;
	addDialogError(thisDialog,'&nbsp;');
	addDialogQuestion (thisDialog, 'New Terminal Name:', 'newTerminalName', 'Name');
	addDialogCheckBox(thisDialog,'Open in Window Pane:', 'terminalCheckBox', 'Open',dialogCheckBoxChanged);
	$("#" + thisDialog).dialog({
						resizable: false,
						height: 320,
						width: 375,
						modal: true,
						buttons: {
							"Create Terminal": function(e) {
								if (!$('#newTerminalName').val()) {
									removeDialogError(thisDialog);
									addDialogError(thisDialog,"* Enter a Terminal Name to Continue!");
									e.preventDefault();
								}
								else {
									sendTerminalRequest('createTerminal', {'terminalName': $('#newTerminalName').val(), 'windowPane': $("#newDialogTarget").val()}, createTerminal);
									removeDialogQuestion(thisDialog);
									removeDialogCheckBox(thisDialog);
									removeDialogError(thisDialog);
									$(this).dialog("close");
								}

							},
							Cancel: function() {
								removeDialogQuestion(thisDialog);
								removeDialogCheckBox(thisDialog);
								removeDialogError(thisDialog);
								$(this).dialog("close");
				
							}
						}
					});
}
function initializeDialogCreateFlowchart() {
	var thisDialog = "dialog-info";
	changeDialogTitle(thisDialog,"Create New Flowchart");
	var ref = $('#jsTreeFlowchart').jstree(true);
	var selectedNodes = ref.get_selected();
	var fileName = ref.get_selected(true)[0].text;
	addDialogError(thisDialog,'&nbsp;');
	addDialogQuestion (thisDialog, 'New Flowchart Name:', 'newFlowchartName', 'Name');
	addDialogCheckBox(thisDialog,'Open in Window Pane:', 'flowchartCheckBox', 'Open', dialogCheckBoxChanged);
	$("#" + thisDialog).dialog({
						resizable: false,
						height: 320,
						width: 375,
						modal: true,
						buttons: {
							"Create Flowchart": function(e) {
								if (!$('#newFlowchartName').val()) {
									removeDialogError(thisDialog);
									addDialogError(thisDialog,"* Enter a Flowchart Name to Continue!");
									e.preventDefault();
								}
								else {
									sendTerminalRequest('createFlowchart', {'flowchartName': $('#newFlowchartName').val(), 'windowPane': $("#newDialogTarget").val()}, createFlowchart);
									removeDialogQuestion(thisDialog);
									removeDialogCheckBox(thisDialog);
									removeDialogError(thisDialog);
									$(this).dialog("close");
								}

							},
							Cancel: function() {
								removeDialogQuestion(thisDialog);
								removeDialogCheckBox(thisDialog);
								removeDialogError(thisDialog);
								$(this).dialog("close");
				
							}
						}
					});
}