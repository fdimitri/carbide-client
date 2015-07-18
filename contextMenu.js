
$(function() {


	$("#toolBarSide").contextmenu({
            delegate: ".ui-tabs-panel",
            menu: [
                  
                ],
            
            select: function(event, ui) {
            	
                if (ui.cmd == "openInPane") {
                	if (ui.item.data().type == "file") {
						var node = $('#jsTreeFile').jstree(true).get_selected(true);
                	}
                	else if (ui.item.data().type == "chat") {
                		var node = $('#jsTreeChat').jstree(true).get_selected(true);
                	}
                	else if (ui.item.data().type == "terminal") {
                		var node = $('#jsTreeTerminal').jstree(true).get_selected(true);
                	}
					var nodeLength = node.length;
					for (var i = 0; i < nodeLength; i++) {
					    newTab(node[i].text, ui.item.data().tabbarid, node[i].id, node[i].type, node[i].li_attr.srcPath);
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
                else if (ui.cmd == "createChat") {
                	$('#newChatOpen').attr('checked', false);
				    $("#newChatTarget").remove();
				    $("#dialog-newchat").dialog("open");
                }
                else if (ui.cmd == "createTerminal") {
                	
				    $('#newTerminalOpen').attr('checked', false);
				    $("#newTerminalTarget").remove();
				    $("#dialog-newterminal").dialog("open");
                	
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
                
                  
            },
            beforeOpen: function(event, ui) {
				if (clickedElement == "jsTreeAnchor") {  //don't show the context menu if they are on a jstree node
					return false;
				}
				else if (clickedElement == "jsTreeFileRoot") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                    
                    ]);
				}
				else if (clickedElement == "jsTreeFolder") {

					 $("#toolBarSide").contextmenu("replaceMenu", [
                		{title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "	ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                    
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
						{title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                    
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
				else if (clickedElement == "tree1") {
					 $("#toolBarSide").contextmenu("replaceMenu", [
                        {title: '<span class="contextMenuItem">Create New File</span>', uiIcon: "ui-icon-document", cmd: "createFile"},
                		{title: '<span class="contextMenuItem">Create New Folder</span>', uiIcon: "ui-icon-folder-collapsed", cmd: "createFolder"},
                    
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
	    	console.log("HELLO")
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
	var dialogInfo = '<p class="dialogInfo">' + dialogMsg + '</p><div class="dialogClear" style="clear:both;"></div>';
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
function addDialogColorPicker (dialogId, textLabel, colorId, colorName, defaultColor) {
	var dialogInfo = '<div class="dialogColorPicker"><label>' + textLabel + ' </label><input type="color" name="' + colorName + '" id="' + colorId + '" value="' + defaultColor + '"></input></div>';
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