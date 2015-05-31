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

	if ($(node).attr("type") == "file") {
		var items = {
	
			openItem: { //open with...
				label: "Open in...",
				action: false,
				submenu: menuPanes,
	
			},
			renameItem: { // The "rename" menu item
				label: "Rename",
				action: function() {
					renameFile();
				}
			},
			deleteItem: { // The "delete" menu item
				label: "Delete",
				action: function() {
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
								$(this).dialog("close");
				
							}
						}
					});
					
				}
			}
	
		};
	}
	else if ($(node).attr("type") == "chat") {
		var items = {
	
			openItem: { //open with...
				label: "Open in...",
				action: false,
				submenu: menuPanes,
	
			},
			deleteItem: { // The "delete" menu item for chat
				label: "Delete",
				action: function() {
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
								$(this).dialog("close");
				
							}
						}
					});
					
				}
			}
	
		};
	}
	else if ($(node).attr("type") == "terminal") {
		var items = {
	
			openItem: { //open with...
				label: "Open in...",
				action: false,
				submenu: menuPanes,
	
			},
			deleteItem: { // The "delete" menu item for terminals
				label: "Delete",
				action: function() {
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
								$(this).dialog("close");
				
							}
						}
					});
					
				}
			}
			
	
		};
	}
	else if ($(node).attr("type") == "folder") {
	    
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
	else if ($(node).attr("type") == "root") {
	    if ($(node).attr("id") == "chatroot") {
	       	var items = {
    		    newChat: { // create a new chat room
    				label: "Create New Chat",
    				action: function() {
    				    console.log("create new chatroom here.");
    				    $('#newChatOpen').attr('checked', false);
    				    $("#newChatTarget").remove();
    				    
    				    
    				    $("#dialog-newchat").dialog("open");
    				}
			    }
    		};
	    
	    }
	    else if ($(node).attr("id") == "terminalroot") {
    		var items = {
    		    newTerminal: { // create a new terminal
    				label: "Create New Terminal",
    				action: function() {
    				    console.log("create new terminal here.");
    				    $('#newTerminalOpen').attr('checked', false);
    				    $("#newTerminalTarget").remove();
    				    $("#dialog-newterminal").dialog("open");
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
                
            }
            $("#dialog-newterminal").dialog("close");
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
                var fileName = $("#newChatTarget").val();
                var tabBarId = 'unknown';
                var originId = 'unknown';
                var srcPath = 'unknown';
				newTab(fileName, tabBarId, originId, 'chat', srcPath)
                
            }
            $("#dialog-newchat").dialog("close");
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
                var fileName = $("#newFileTarget").val();
                var tabBarId = 'unknown';
                var originId = 'unknown';
                var srcPath = 'unknown';
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
	
	dialogInfo = '<span class="dialogIcon ui-icon ' + dialogIcon + '" style="float:left; margin:0 7px 20px 0;"></span>';
	$("#" + dialogId).find(".dialog-info-space").prepend(dialogInfo);
}
function removeDialogIcon (dialogId) {
	$("#" + dialogId).find(".dialogIcon").remove();	
}
function addDialogInfo (dialogId, dialogMsg) {
	dialogInfo = '<p class="dialogInfo">' + dialogMsg + '</p><div class="dialogClear" style="clear:both;"></div>';
	$("#" + dialogId).find(".dialog-info-space").append(dialogInfo);
}
function removeDialogInfo (dialogId) {
	$("#" + dialogId).find(".dialogInfo").remove();	
	$("#" + dialogId).find(".dialogClear").remove();	
}
function changeDialogTitle (dialogId, dialogTitle) {
	$("#" + dialogId).prop('title', dialogTitle);
}

$(document).ready(function() { //ADD a BINDING FOR EACH DIALOG THAT CLEANS IT UP
	$('.dialog-window').bind('dialogclose', function(event) {
		 dialogId = $(this).attr('id');
		 removeDialogIcon(dialogId);
		 removeDialogInfo(dialogId);
		 changeDialogTitle(dialogId,"Information Dialog");
 	});
});