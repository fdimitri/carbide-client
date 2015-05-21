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
	}
	else if ($(node).attr("type") == "chat") {
		var items = {
	
			openItem: { //open with...
				label: "Open in...",
				action: false,
				submenu: menuPanes,
	
			}
			
	
		};
	}
	else if ($(node).attr("type") == "terminal") {
		var items = {
	
			openItem: { //open with...
				label: "Open in...",
				action: false,
				submenu: menuPanes,
	
			}
			
	
		};
	}
	else if ($(node).attr("type") == "folder") {
	    
		var items = {
		};
	}
	else if ($(node).attr("type") == "root") {
	    if ($(node).attr("id") == "chatroot") {
	       	var items = {
    		    newChat: { // create a new chat room
    				label: "Create New Chat Room",
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
        
        var terminalName = $("#newTerminalName").val();
       
        if (terminalName === '') {
            alert("Please enter a name for the terminal.");
             e.preventDefault();
        } else {
            //actions to take before form is submitted.
            console.log("form submitted with terminal name " + terminalName);
            e.preventDefault();
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
        
        var chatName = $("#newChatName").val();
       
        if (chatName === '') {
            alert("Please enter a name for the chat room.");
             e.preventDefault();
        } else {
            //actions to take before form is submitted.
            console.log("form submitted with chat name " + chatName);
            e.preventDefault();
            if($('#newChatOpen').is(":checked"))   {
                console.log("They have requested to open the chat in window pane:");
                console.log($("#newChatTarget").val());
                
            }
            $("#dialog-newchat").dialog("close");
        }
    });
    
});
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

