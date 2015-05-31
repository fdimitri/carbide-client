currentlyRenaming = 0; //shows whether someone is renaming a file, for use with keydown handlers
typedRename = "";

$(document).ready(function() { 
    $("#jsTreeChat").click(function(e) { //deselect terminal nodes if chat node is clicked
    	var ref = $('#jsTreeTerminal').jstree(true);
    	ref.deselect_all(true);
    	
    });
    $("#jsTreeTerminal").click(function(e) { //deselect chat nodes if terminal node is clicked
    	var ref = $('#jsTreeChat').jstree(true);
    	ref.deselect_all(true);
    	
    });
    
    
/* commented out because there is no need for character-by-character filename verification
$('#jsTreeFile').keydown(function(e) {
		if (currentlyRenaming == 1) { //a rename is active so we check the validity of the key press
			if (e.keyCode == 27) { 
  				currentlyRenaming = 0; //cancel the renaming logic
  			}
  			else { //escape wasn't pushed so validate
  				console.log(e.which);
  				var ref = $('#jsTreeFile').jstree(true),
				sel = ref.get_selected();
				if(sel.length) { 
					sel = sel[0];
					console.log(sel);
					var selectedNodes = ref.get_selected();

					var path = ref.get_path(selectedNodes,"/");
					path = path.substr(0, path.lastIndexOf("/")) + '/';
					typedRename = typedRename + String.fromCharCode(e.keyCode);
					console.log(path + typedRename);
					
	  				
	  				randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + e.which); 
	  				var statusJSON = {
					"commandSet": "base",
					"command": "checkFileName",
					"key" : randomKey,
					"filename" : e.keyCode,
					
					};
					wsSendMsg(JSON.stringify(statusJSON));
				
					while (!getMsg(key)) {
						setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
				    }	
					var result = getMsg(key);
					if (result['status'] == TRUE) {
						//this was an acceptable keystoke
					}
					else {
						// unacceptable keystroke
		  			}
				}
  			}
  	
		 }
  
	});   */
    
 $('#jsTreeFile').on('rename_node.jstree', function (node,obj) {


        var newName = obj.node.text;
        var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + newName); 
       
        var oldName = obj.node.original.text;
        
        /*
        var etrigger = 0;
        var iChars = "!@#$%^&*()+=[]\\\';,/{}|\":<>?";
        for (var i = 0; i < newName.length; i++) 
        {
            if (iChars.indexOf(newName.charAt(i)) != -1) 
            {
                etrigger = etrigger + 1;
            }
        }
        console.log(etrigger)
        if (etrigger > 0) {
        	$(".renameFailedReason").append('<span class="errorMsg">Special characters are not allowed.</span>');
        *
        	$("#dialog-rename").dialog({
		      modal: true,
		      buttons: {
		        Ok: function() {
		          $( this ).dialog( "close" );
		          $(".renameFailedReason").find(".errorMsg").remove();
		        }
		      }
		    });
	        
	        renameFile(obj.node.original.text); //rename the file back to the original name
        }
        */
        
    	var statusJSON = {
			"commandSet": "base",
			"command": "renameFile",
			"key" : randomKey,
			"renameFile" : {
				"oldName" : oldName,
				"newName" : newName,
			},
		};
		wsSendMsg(JSON.stringify(statusJSON));
	
		while (!getMsg(randomKey)) {
			setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
	    }	
		var result = getMsg(randomKey);
		if (result['status'] == true) {
			// Successful file rename. No need to do anything.
		}
		else {
			// Failed, tell the fail reason
			$(".renameFailedReason").append('<span class="errorMsg">[INSERT FAIL REASON HERE]</span>');
        	$("#dialog-rename").dialog({
		      modal: true,
		      buttons: {
		        Ok: function() {
		          $( this ).dialog( "close" );
		          $(".renameFailedReason").find(".errorMsg").remove();
		        }
		      }
		    });
		    renameFile(obj.node.original.text); //rename the file back to the original name
		}
        
    
 });


	
	
	$('.drag').on('mousedown', function(e) {
		
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
					if (dragItem.hasClass("jsTreeFile") || dragItem.hasClass("jsTreeChat") || dragItem.hasClass("jsTreeTerminal")) {
						data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok'); //give them a checkbox above the tab-bar of a pane
					}
					else {
						data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er'); //give them an X if they're not in a valid file-drop element
					}
				}
				else {
					data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er'); //give them an X if they're not in a valid file-drop element
				}
			}
			else { //give them a check box if they're above the file tree
				if ($(data.data.obj[0]).hasClass("jsTreeChat") || $(data.data.obj[0]).hasClass("jsTreeTerminal")) {
					//This is a chat or terminal. don't give them the checkbox because they can't move it to another folder.
					data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
				}
				else {
					data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
				}
				
				
			}
		})
		.on('dnd_stop.vakata', function(e, data) {
			
			
			
			console.log("VAKATA " + e + " " + data);
			var t = $(data.event.target);
			if (!t.closest('.jstree').length) {
				if (t.closest('.menuList').length) {


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
					else if (draggedItem.hasClass("jsTreeTerminal")) {
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
							var tabCounter = newTab(data.element.text, t.closest('div').attr('id'), data.data.obj[0].id, 'terminal', '');
							var tabItem = $("#tabs-" + tabCounter);
							var itemParent = tabItem.closest('div').attr('id');
						}
					}
				}
			}
			else {
				if ($(data.data.obj[0]).hasClass("jsTreeChat") || $(data.data.obj[0]).hasClass("jsTreeTerminal")) {
					
					//We do nothing if they try to move a Chat or Terminal
				}
				else {
					var theFileTree = $("#jsTreeFile").jstree(true);
					console.log(data.data.obj[0].id);
					console.log(data.data);
					console.log(t.closest('.jstree-node'));
					var thisRef = t.closest('.jstree-node').get(0);
				
					var movedFileDestination = theFileTree.get_path(thisRef,"/");
	
					if ($(thisRef).hasClass("jsTreeRoot") || $(thisRef).hasClass("jsTreeFolder") ) { //if they are dragged it to a folder or the root, add a trailing /
						//movedFileDestination = movedFileDestination.substr(0, movedFileDestination.lastIndexOf("/")) + '/';
						movedFileDestination = movedFileDestination + '/';
					}
					else { //if they are dragging it to a file, remove the filename because we want the directory
						movedFileDestination = movedFileDestination.substring(0, movedFileDestination.lastIndexOf('/'));
						movedFileDestination = movedFileDestination + '/';
					}
								
								
					var movedFileName = data.data.obj[0].textContent;
				
	                var movedFilePath = theFileTree.get_path(data.data.nodes[0],"/");
					movedFilePath = movedFilePath.substr(0, movedFilePath.lastIndexOf("/")) + '/';
					console.log("moved: " + movedFileName + " in " + movedFilePath + " to " + movedFileDestination);
				}
			}
		});
		
});
$(function() {
	$("#jsTreeFile-ContextMenu").menu({
		select: function(event, ui) {
		    if ($(ui.item).attr("id") == "cm-NewFile") {
		        console.log("new file requested")
		    }
			$("#jsTreeFile-ContextMenu").hide();
			
			
			
		}
	});

	$("#tabs-1").on("contextmenu", function(event) {
		
		if ($(event.target).hasClass("jstree-anchor") || $(event.target).hasClass("jstree-icon")) {
			$("#jsTreeFile-ContextMenu").hide();
			return false;
		}
		else {
			$("#jsTreeFile-ContextMenu").show();
			$("#jsTreeFile-ContextMenu").position({
				collision: "none",
				my: "left top",
				of: event
			});
		}
	
		console.log($(event.target).attr("class"));
		
		

		return false;
	});

	$(document).click(function(event) {
		$("#jsTreeFile-ContextMenu").hide();
	});

	$("#jsTreeFile-ContextMenu").on("contextmenu", function(event) {
	    
		return false;
	});
});

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
	console.log($('#jsTreeFile'));
	$('#jsTreeFile').jstree({
		"core": {
			// so that create works
			'check_callback': function(operation, node, node_parent, node_position, more) {
                        if (operation == 'move_node') {
                        	
       // this following functionality was moved so it only calls once on the final drop
       						/*
                        	var movedFileName = node.text;
                            var movedFilePath = this.get_path(node,"/");
							movedFilePath = movedFilePath.substr(0, movedFilePath.lastIndexOf("/")) + '/';
							var movedFileDestination = this.get_path(more.ref,"/");
							if (more.ref.type == "root" || more.ref.type == "folder" ) { //if they are dragged it to a folder or the root, add a trailing /
								//movedFileDestination = movedFileDestination.substr(0, movedFileDestination.lastIndexOf("/")) + '/';
								movedFileDestination = movedFileDestination + '/';
							}
							else { //if they are dragging it to a file, remove the filename because we want the directory
								movedFileDestination = movedFileDestination.substring(0, movedFileDestination.lastIndexOf('/'));
								movedFileDestination = movedFileDestination + '/';
							}
							
                            console.log("Moving " + movedFileName + " in dir " + movedFilePath + " to " + movedFileDestination);
                            console.log("!!!" + operation);
                           */
       
                            return false; //prevent the default action of moving the node
                        }
			},
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
			items: fileTreeMenu
		}


	});
	// $('#jsTreeFile').jstree({

	// 	"core": {
	// 		// so that create works
	// 		check_callback: true,
	// 		'data': [{
	// 			"id": "chatroot",
	// 			"parent": "#",
	// 			"text": "Chat Rooms",
	// 			"type": "root",
	// 			"li_attr": {
	// 				"class": "jsRoot"
	// 			}
	// 		}, {
	// 			"id": "chat1",
	// 			"parent": "chatroot",
	// 			"text": "StdDev",
	// 			"type": "chat",
	// 			"li_attr": {
	// 				"class": "jsTreeChat"
	// 			}
	// 		}, {
	// 			"id": "chat2",
	// 			"parent": "chatroot",
	// 			"text": "Java",
	// 			"type": "chat",
	// 			"li_attr": {
	// 				"class": "jsTreeChat"
	// 			}
	// 		}, {
	// 			"id": "chat3",
	// 			"parent": "chatroot",
	// 			"text": "Coffee",
	// 			"type": "chat",
	// 			"li_attr": {
	// 				"class": "jsTreeChat"
	// 			}
	// 		}, {
	// 			"id": "chat4",
	// 			"parent": "chatroot",
	// 			"text": "3rd_shift_rulez",
	// 			"type": "chat",
	// 			"li_attr": {
	// 				"class": "jsTreeChat"
	// 			}
	// 		},
	// 		{
	// 			"id": "terminalroot",
	// 			"parent": "#",
	// 			"text": "Terminals",
	// 			"type": "root",
	// 			"li_attr": {
	// 				"class": "jsRoot"
	// 			}
	// 		},
	// 		{
	// 			"id": "terminaldefault",
	// 			"parent": "terminalroot",
	// 			"text": "Default Terminal",
	// 			"type": "terminal",
	// 			"li_attr": {
	// 				"class": "jsTreeTerminal"
	// 			}
				
	// 		}],


	// 	},
	// 	"dnd": {
	// 		is_draggable: function(node) {

	// 			return true;
	// 		}
	// 	},

	// 	"types": {

	// 		"chat": {
	// 			"icon": "jstree-chat",
	// 			"valid_children": []
	// 		},
	// 		"root": {
	// 			"icon": "jstree-folder",
	// 			"valid_children": ["chat"]
	// 		},
	// 		"terminal": {
	// 			"icon": "jstree-file",
	// 			"valid_children": []
	// 		}


	// 	},
	// 	/*THIS NEEDS TO BE FIXED TO RESTORE CONTEXT MENU*/
	// 	"plugins": [ "contextmenu",  "dnd", "crrm", "types"] ,
	// 		contextmenu: {
	// 			items: fileTreeMenu
	// 		}
	// });
	$('.jstree').on('dblclick', '.jstree-anchor', function(e) {
		var instance = $.jstree.reference(this),
			node = instance.get_node(this);

		if (node.type == "file" || node.type == "chat" || node.type == "terminal") {


			//we've been asked to open a tab in the active pane. first, make sure theres at least 1 pane, or open 1
			if ($(".windowPane").length == 0) {
				createNewPane();
				 waitForNewWindow(1, newTab, node.text, node.id, node.type, node.li_attr.srcPath);
				

			}
			else {
				console.log($(".windowPane").attr("id") + " " + $(".windowPane").attr("class"));
				newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
				//	   	console.log(node);
			}
		}
	});

}

function renameFile (newName) {

		currentlyRenaming = 1;
		var ref = $('#jsTreeFile').jstree(true),
			sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		
		
		
		
		ref.edit(sel, newName);
						
}

function createFile(fileDirectory) {
	var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + fileDirectory); 
	var statusJSON = {
			"commandSet": "base",
			"command": "createFile",
			"key" : randomKey,
			"directory" : fileDirectory,
		};
		wsSendMsg(JSON.stringify(statusJSON));
	
		while (!getMsg(randomKey)) {
			setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
	    }	
		var result = getMsg(randomKey);
		if (result['status'] == true) {
			// Successful file creation
			// Add the new file
		}
		else {
			//file creation denied. Display dialog with error message.
		}
}
function deleteFile(fileName) {
	var ref = $('#jsTreeFile').jstree(true),
	sel = ref.get_selected();
	if(!sel.length) { return false; }
	sel = sel[0];
	var selectedNodes = ref.get_selected();
	var fileAndPath = ref.get_path(selectedNodes,"/");
	console.log("request to delete " + fileAndPath);
	
	
	var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + selectedNodes); 
	var statusJSON = {
			"commandSet": "base",
			"command": "deleteFile",
			"key" : randomKey,
			"filename" : fileAndPath,
		};
		wsSendMsg(JSON.stringify(statusJSON));
	
		while (!getMsg(randomKey)) {
			setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
	    }	
		var result = getMsg(randomKey);
		if (result['status'] == true) {
			// Successful file delete
			// Remove the node from the File Tree
			//ref.delete_node(sel);
		}
		else {
			//file deletion denied. Display dialog with error message.
			var thisDialog = "dialog-info";
			changeDialogTitle(thisDialog,"Error Deleting File");
			addDialogIcon (thisDialog, "ui-icon-alert");
			addDialogInfo (thisDialog, "The file was unable to be deleted.");
			$("#" + thisDialog).dialog({
		      modal: true,
		      width: 375,
		      height: 210,
		      buttons: {
		        Ok: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });
		}
}
function deleteChat(fileName) {
		var ref = $('#jsTreeChat').jstree(true),
		sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		var selectedNodes = ref.get_selected();
		var fileName = ref.get_selected(true)[0].text;
		
		
		var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + selectedNodes); 
		var statusJSON = {
			"commandSet": "base",
			"command": "deleteChat",
			"key" : randomKey,
			"chatname" : fileName,
		};
		wsSendMsg(JSON.stringify(statusJSON));
	
		while (!getMsg(randomKey)) {
			setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
	    }	
		var result = getMsg(randomKey);
		if (result['status'] == true) {
			// Successful chat delete

		}
		else {
			//chat deletion denied. Display dialog with error message.
			var thisDialog = "dialog-info";
			changeDialogTitle(thisDialog,"Error Deleting Chat Room");
			addDialogIcon (thisDialog, "ui-icon-alert");
			addDialogInfo (thisDialog, "The Chat Room was unable to be deleted.");
			$("#" + thisDialog).dialog({
		      modal: true,
		      width: 375,
		      height: 240,
		      buttons: {
		        Ok: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });
		}
}
function deleteTerminal(fileName) {
		var ref = $('#jsTreeTerminal').jstree(true),
		sel = ref.get_selected();
		if(!sel.length) { return false; }
		sel = sel[0];
		var selectedNodes = ref.get_selected();
		var fileName = ref.get_selected(true)[0].text;
		
		
		var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + selectedNodes); 
		var statusJSON = {
			"commandSet": "base",
			"command": "deleteTerm",
			"key" : randomKey,
			"termname" : fileName,
		};
		wsSendMsg(JSON.stringify(statusJSON));
	
		while (!getMsg(randomKey)) {
			setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
	    }	
		var result = getMsg(randomKey);
		if (result['status'] == true) {
			// Successful terminal delete

		}
		else {
			//terminal deletion denied. Display dialog with error message.
			var thisDialog = "dialog-info";
			changeDialogTitle(thisDialog,"Error Deleting Terminal");
			addDialogIcon (thisDialog, "ui-icon-alert");
			addDialogInfo (thisDialog, "The terminal was unable to be deleted.");
			$("#" + thisDialog).dialog({
		      modal: true,
		      width: 375,
		      height: 240,
		      buttons: {
		        Ok: function() {
		          $( this ).dialog( "close" );
		        }
		      }
		    });
		}
}
function initChatTree(data) {
	if (!data) {
		console.log("Asked to init with no data, using built-ins")
		data = [{
			"id": "chatroot",
			"parent": "#",
			"text": "Chat Rooms",
			"type": "root",
			"li_attr": {
				"class": "jsTreeRoot"
			}
		}, ]
	}
	console.log("Calling jstree() on");
	console.log($('#jsTreeChat'));
	$('#jsTreeChat').jstree({
		"core": {
			// so that create works
			'check_callback': function(operation, node, node_parent, node_position, more) {
                        if (operation == 'move_node') {
                        	return(false); //no moving chats
                        }
			},
			'data': data,
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
			},
			"terminal": {
				"icon": "jstree-file",
				"valid_children": []
			}
		},
		"plugins": ["contextmenu", "dnd", "crrm", "types"],
		 contextmenu: {
		 	items: fileTreeMenu,
		 },


	});	

}

function initTermTree(data) {
	if (!data) {
		console.log("Asked to init with no data, using built-ins")
		data = [{
			"id": "terminalroot",
			"parent": "#",
			"text": "Terminals",
			"type": "root",
			"li_attr": {
				"class": "jsTreeRoot"
			}
		}, ]
	}
	console.log("Calling jstree() on");
	console.log($('#jsTreeTerminal'));
	$('#jsTreeTerminal').jstree({
		"core": {
			// so that create works
			'check_callback': function(operation, node, node_parent, node_position, more) {
                        if (operation == 'move_node') {
                        	return(false); //no moving terminals
                        }
			},
			'data': data,
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
				"valid_children": ["terminal"]
			},
			"terminal": {
				"icon": "jstree-file",
				"valid_children": []
			}
		},
		"plugins": ["contextmenu", "dnd", "crrm", "types"],
		 contextmenu: {
		 	items: fileTreeMenu,
		 },


	});	

}