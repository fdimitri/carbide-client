var currentlyRenaming = 0; //shows whether someone is renaming a file, for use with keydown handlers
var typedRename = "";

$(document).ready(function() { 
	//initFlowchartTree();

	
    $("#jsTreeChat").click(function(e) { //deselect terminal nodes, flowchart nodes, taskBoard nodes if chat node is clicked
    	var ref = $('#jsTreeTerminal').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeFlowchart').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeTaskBoard').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	
    });
    $("#jsTreeTerminal").click(function(e) { //deselect chat nodes, flowchart nodes, taskBoard nodes if terminal node is clicked
    	var ref = $('#jsTreeChat').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeFlowchart').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeTaskBoard').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	
    });
     $("#jsTreeFlowchart").click(function(e) { //deselect chat nodes, terminal nodes, taskBoard nodes if flowchart node is clicked
    	var ref = $('#jsTreeChat').jstree(true);
    	if (ref) {
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeTerminal').jstree(true);
    	if (ref) {
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeTaskBoard').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	
    });
    $("#jsTreeTaskBoard").click(function(e) { //deselect chat nodes, terminal nodes, flowchart nodes if taskBoard node is clicked
    	var ref = $('#jsTreeChat').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeTerminal').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	ref = $('#jsTreeFlowchart').jstree(true);
    	if (ref) { 
    		ref.deselect_all(true);
    	}
    	
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
					"hash" : randomKey,
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
 		currentlyRenaming = 1;
		
		
        var newName = obj.node.text;
        var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + newName); 
       
        var oldName = obj.node.original.text;

        var srcPath = obj.node.original.li_attr.srcPath;
        
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
			"commandSet": "FileTree",
			"command": "renameEntry",
			"hash" : randomKey,
			"renameEntry" : {
				"srcPath" : srcPath,
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
        currentlyRenaming = 0;
    
 });


	
	
	$('.drag').on('mousedown', function(e) {
		
			var jsTreeDiv = '<div id="jstree-dnd" class="jstree-default"><span class="jstree-icon jstree-er"></span>' + $(this).text() + '</div>';
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
				//if (t.closest('.menuList').length) {
				if (t.closest('.windowPane').length) {
					var dragItem = $("#" + data.data.obj[0].id);
					if (dragItem.hasClass("jsTreeFile") || dragItem.hasClass("jsTreeChat") || dragItem.hasClass("jsTreeTerminal") || dragItem.hasClass("jsTreeFlowchart") || dragItem.hasClass("jsTreeTaskBoard")) {	
					
						data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok'); //give them a checkbox above the tab-bar of a pane
						// data.helper.find('.jstree-icon').css("width", "500px");
						// data.helper.find('.jstree-icon').css("background-color", "#FF0000");
//						data.helper.find('.jstree-icon').css("background-position", "-4px -68px");

						
					}
					else {
						data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er'); //give them an X if they're not in a valid file-drop element
//						data.helper.find('.jstree-icon').css("background-position", "-36px -68px");
					}
				}
				else {
					data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er'); //give them an X if they're not in a valid file-drop element
//					data.helper.find('.jstree-icon').css("background-position", "-36px -68px");
				}
			}
			else { //give them a check box if they're above the file tree
				if ($(data.data.obj[0]).hasClass("jsTreeChat") || $(data.data.obj[0]).hasClass("jsTreeTerminal") || $(data.data.obj[0]).hasClass("jsTreeFlowchart") || $(data.data.obj[0]).hasClass("jsTreeTaskBoard")) {
					//This is a chat or terminal or flowchart or task board. don't give them the checkbox because they can't move it to another folder.
					data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
//					data.helper.find('.jstree-icon').css("background-position", "-36px -68px");
				}
				else {
					data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
//					data.helper.find('.jstree-icon').css("background-position", "-4px -68px");
				}
				
				
			}
		})
		.on('dnd_start.vakata', function(e, data) {
			var dragItem = $("#" + data.data.obj[0].id);
		
			dragItem.closest(".ui-tabs-panel").find(".jstree").css("width", "100%");
			dragItem.closest(".ui-tabs-panel").find(".jstree").css("overflow", "hidden");
			
		})
			
		.on('dnd_stop.vakata', function(e, data) {
			var dragItem = $("#" + data.data.obj[0].id);
		
			dragItem.closest(".ui-tabs-panel").scrollLeft(0);
			dragItem.closest(".ui-tabs-panel").find(".jstree").scrollLeft(0);
			
			
			console.log("VAKATA " + e + " " + data);
			var t = $(data.event.target);
			if (!t.closest('.jstree').length) {
				//if (t.closest('.menuList').length) {
				if (t.closest('.windowPane').length) {



					var draggedItem = $("#" + data.data.obj[0].id);

					console.log(draggedItem);
					if (draggedItem.hasClass("jsTreeFile")) {
						
						//var thisParent = $(data.event.target).closest('div').attr('id');
						var thisParent = $(data.event.target).closest('.windowPane').attr('id');
						if ($("#" + thisParent).find('li.' + data.data.obj[0].id).length) { //the tab already exists 
							var listItem = $("#" + thisParent).find('li.' + data.data.obj[0].id);
							$("#" + thisParent).tabs("option", "active", listItem.index()); //set the active tab to the file they dragged in
						}
						else {
							
							//console.log($("#" + data.data.obj[0].id).closest('li').attr('srcPath'));
							console.log("Dragged " + data.element.outerText + " to " + data.event.target);
							var tabBarId = t.closest('.windowPane').find('.tabBar').attr("id");
							console.log("TABBARID " + tabBarId);
							var tabCounter = newTab(data.element.text, tabBarId, data.data.obj[0].id, 'file', $("#" + data.data.obj[0].id).attr('srcpath'));
							var tabItem = $("#tabs-" + tabCounter);
							var itemParent = tabItem.closest('div').attr('id');
						}
					}
					else if (draggedItem.hasClass("jsTreeChat")) {
						console.log("Has class jsTreeChat");
						var thisParent = $(data.event.target).closest('.windowPane').attr('id');
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
							var tabBarId = t.closest('.windowPane').find('.tabBar').attr("id");
							var tabCounter = newTab(data.element.text, tabBarId, data.data.obj[0].id, 'chat', '');
							var tabItem = $("#tabs-" + tabCounter);
							var itemParent = tabItem.closest('div').attr('id');
						}
					}
					else if (draggedItem.hasClass("jsTreeTerminal")) {
						var thisParent = $(data.event.target).closest('.windowPane').attr('id');
						if ($("#" + thisParent).find('li.' + data.data.obj[0].id).length) { //the tab already exists 
							console.log("Tab already exists, not adding -- but setting active");
							var listItem = $("#" + thisParent).find('li.' + data.data.obj[0].id);
							$("#" + thisParent).tabs("option", "active", listItem.index()); //set the active tab to the file they dragged in
						}
						else {

							console.log("Dragged " + data.element.outerText + " to " + data.event.target);
							var tabBarId = t.closest('.windowPane').find('.tabBar').attr("id");
							var tabCounter = newTab(data.element.text, tabBarId, data.data.obj[0].id, 'terminal', '');
							var tabItem = $("#tabs-" + tabCounter);
							var itemParent = tabItem.closest('div').attr('id');
							
							var thisPane = $('#' + $('#' + tabBarId).closest('.windowPane').attr("id"));
						    var thisActiveTab = thisPane.find(".activeTab");
						    
						    //cancel this because the terminal gets focused and calls the resize!!!!!!!!!
					  //  	var interval_id = setInterval(function(){ //wait for terminal creation then check the sizes
						    
							//      if ($("#" + (thisActiveTab).attr("aria-controls")).find('.terminalWindow').length != 0){
							//          // "exit" the interval loop with clearInterval command
							//          clearInterval(interval_id);
							//          checkTerminalSizes($('#' + tabBarId).closest('.windowPane').attr("id"));
							//       }
							// }, 10);
						    
						}   
							
					}
					else if (draggedItem.hasClass("jsTreeFlowchart")) {
						console.log("Has class jsTreeFlowchart");
						var thisParent = $(data.event.target).closest('.windowPane').attr('id');
						if ($("#" + thisParent).find('li.' + data.data.obj[0].id).length) { //the tab already exists 
							console.log("Tab already exists, not adding -- but setting active");
							var listItem = $("#" + thisParent).find('li.' + data.data.obj[0].id);
							$("#" + thisParent).tabs("option", "active", listItem.index()); //set the active tab to the flowchart they dragged in
						}
						else {
							console.log(data);
							console.log($("#" + data.data.obj[0].id));
							console.log($("#" + data.data.obj[0].id).closest('li'));
							console.log("Dragged " + data.element.outerText + " to " + data.event.target);
							var tabBarId = t.closest('.windowPane').find('.tabBar').attr("id");
							var tabCounter = newTab(data.element.text, tabBarId, data.data.obj[0].id, 'flowchart', '');
							var tabItem = $("#tabs-" + tabCounter);
							var itemParent = tabItem.closest('div').attr('id');
						}
					}
					else if (draggedItem.hasClass("jsTreeTaskBoard")) {
						console.log("Has class jsTreeTaskBoard");
						var thisParent = $(data.event.target).closest('.windowPane').attr('id');
						if ($("#" + thisParent).find('li.' + data.data.obj[0].id).length) { //the tab already exists 
							console.log("Tab already exists, not adding -- but setting active");
							var listItem = $("#" + thisParent).find('li.' + data.data.obj[0].id);
							$("#" + thisParent).tabs("option", "active", listItem.index()); //set the active tab to the task board they dragged in
						}
						else {
							console.log(data);
							console.log($("#" + data.data.obj[0].id));
							console.log($("#" + data.data.obj[0].id).closest('li'));
							console.log("Dragged " + data.element.outerText + " to " + data.event.target);
							var tabBarId = t.closest('.windowPane').find('.tabBar').attr("id");
							var tabCounter = newTab(data.element.text, tabBarId, data.data.obj[0].id, 'taskBoard', data.element.text);
							var tabItem = $("#tabs-" + tabCounter);
							var itemParent = tabItem.closest('div').attr('id');
						}
					}
					
				}
			}
			else {
				if ($(data.data.obj[0]).hasClass("jsTreeChat") || $(data.data.obj[0]).hasClass("jsTreeTerminal") || $(data.data.obj[0]).hasClass("jsRoot") || $(data.data.obj[0]).hasClass("jsTreeFlowchart") || $(data.data.obj[0]).hasClass("jsTreeTaskBoard")) {
					
					//We do nothing if they try to move a Chat or Terminal or Root or flowchart or task board
				}
				else {
				
					var theFileTree = $("#jsTreeFile").jstree(true);
					console.log($(data.data.obj[0]).attr("class"));
					console.log(data.data);
					console.log(t.closest('.jstree-node'));
					var thisRef = t.closest('.jstree-node').get(0);
					var moveType = "";
				
					var movedFileDestination = theFileTree.get_path(thisRef,"/");
	
					if ($(thisRef).hasClass("jsTreeRoot") || $(thisRef).hasClass("jsTreeFolder") ) { //if they are dragged it to a folder or the root, add a trailing /
						//movedFileDestination = movedFileDestination.substr(0, movedFileDestination.lastIndexOf("/")) + '/';
						movedFileDestination = movedFileDestination + '/';
					}
					else { //if they are dragging it to a file, remove the filename because we want the directory
						movedFileDestination = movedFileDestination.substring(0, movedFileDestination.lastIndexOf('/'));
						movedFileDestination = movedFileDestination + '/';
					}
								
					if ($(data.data.obj[0]).hasClass("jsTreeFolder")) { //they are moving a folder of files
						
						var movedFileName =  $(data.data.obj[0]).find("a:first").text();
						console.log(movedFileName);
						var movedFilePath = theFileTree.get_path(data.data.nodes[0],"/");
						movedFilePath = movedFilePath.substr(0, movedFilePath.lastIndexOf("/")) + '/';
						moveType = "Dir";
						
					}
					else { //they are moving a single file
						var movedFileName = data.data.obj[0].textContent;
					
		                var movedFilePath = theFileTree.get_path(data.data.nodes[0],"/");
						movedFilePath = movedFilePath.substr(0, movedFilePath.lastIndexOf("/")) + '/';
						moveType = "File";
						
						
					}
					//info for server: movedFileName, moveType, movedFilePath, movedFileDestination
					console.log("moved: " + movedFileName + " (" + moveType + ")  in " + movedFilePath + " to " + movedFileDestination);
					
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

	// $("#tabs-1").on("contextmenu", function(event) {
		
	// 	if ($(event.target).hasClass("jstree-anchor") || $(event.target).hasClass("jstree-icon")) {
	// 		$("#jsTreeFile-ContextMenu").hide();
	// 		return false;
	// 	}
	// 	else {
	// 		console.log("SHOWING CONTEXT MENU")
			
	// 		$("#jsTreeFile-ContextMenu").show();
	// 		// $("#jsTreeFile-ContextMenu").removeClass("ui-menu");
	// 		// $("#jsTreeFile-ContextMenu").find("li").removeClass("ui-menu-item");
	// 		// $("#jsTreeFile-ContextMenu").find("li").removeClass("ui-state-active");
	// 		 $("#jsTreeFile-ContextMenu").find(".ui-menu-icon").remove();
		

	// 		$("#jsTreeFile-ContextMenu").position({
	// 			collision: "none",
	// 			my: "left top",
	// 			of: event
	// 		});
	// 	}
	
	// 	console.log($(event.target).attr("class"));
		
		

	// 	return false;
	// });

	$(document).click(function(event) {
		$("#jsTreeFile-ContextMenu").hide();
	});

	$("#jsTreeFile-ContextMenu").on("contextmenu", function(event) {
	    
		return false;
	});
});

function initFileTree(data, ftid) {
	if (ftid == undefined) {
		ftid = '#jsTreeFile';
	}
	if (!data) {
		console.log("Asked to init with no data, using built-ins")
		data = [{
			"id": "fileroot",
			"parent": "#",
			"text": "Mockup",
			"type": "root",
			"li_attr": {
				"class": "jsTreeRoot"
			}
		}, ]
	}
	console.log("Calling jstree() on");
	console.log($(ftid));
	$(ftid).jstree({
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
		"plugins": ["dnd", "crrm", "types", "sort"],
		"dnd": {
			is_draggable : function () { return true; },
			drop_check : function (data) { return true; },
			drag_check : function (data) { return true; },
            check_while_dragging: false,
		},
		"crrm" : {
			check_while_dragging: false,	
		},
	    'sort': function (a, b) {
	    	console.log("Sorting node");
    	    var tc2 = this.get_type(a).localeCompare(this.get_type(b));
    	    if (tc2 > 0) return -1;
    	    if (tc2 < 0) return 1;
    	    var tc1 = this.get_text(a).localeCompare(this.get_text(b));
    	    if (tc1 > 0) return 1;
    	    if (tc1 < 0) return -1;
    	    console.log("Return 0");
    	    return 0;
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
	// 	"dnd" : {
 //   drop_target     : ".someWrapperClassInSource",
 //   drop_check      : function (data) { return true; },
 //   drop_finish     : function (data) {
 //                           $.jstree._reference(this.get_container()).remove($(data.o));
 //                     },
 //   drag_target     : ".someClassInSource",
 //   drag_finish     : function (data) {;},
 //   drag_check      : function (data) { return { after : false, before : false, inside : true }; }
 //},
		
		


	});

	$('.jstree').on('dblclick', '.jstree-anchor', function(e) {
		var instance = $.jstree.reference(this),
			node = instance.get_node(this);

		if (node.type == "file") {


			//we've been asked to open a tab in the active pane. first, make sure theres at least 1 pane, or open 1
			if ($(".windowPane").length == 0) {
				createNewPane();
				 waitForNewWindow(1, newTab, node.text, node.id, node.type, node.li_attr.srcPath);
				

			}
			else {
				prepareActivePane();
			 	var interval_id = setInterval(function(){ //wait for active pane before calling new tab
					    
				     if ($(".activePane").length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
				      }
				}, 10);
				//newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
				//	   	console.log(node);
			}
		}
	});

}

function renameFile (newName) {
		

			if (currentlyRenaming == 0) { //there is no other rename going on, proceed
				var ref = $('#jsTreeFile').jstree(true),
					sel = ref.get_selected();
				if(!sel.length) { return false; }
				sel = sel[0];
				
				
				
				
				ref.edit(sel, newName);
			}
			else { //another rename is currently in progress. return false
				return(false);
			}

				
}

function cbCreateFile(hashKey, event, message) {
	// message.status = true || false
	
	// if (message.status == true) you have set:
	// message.createFile.srcPath -- fileName
	// message.createFile.fileTreeHash -- "ID" 
	// message.createFile.fileTreeOwnerHash -- "Owner ID"
	node = message.createFile.node;
	console.log("cbCreateFile() called with:");
	console.log(hashKey); console.log(event); console.log(message);
	console.log("cbCreateFile() end params");
	$("#jsTreeFile").jstree('create_node', node.parent, node, 'last');
	//create_node params = parentid,node,position
	
	//deselect all nodes
	$("#jsTreeFile").jstree("deselect_all");
	
	//open the folder that has the new node in it
	 console.log("WE ARE LOOKING FOR A PLACE IN THE DIRECTORY TREE WITH ID = " + node.parent );
	 var nodeRef = $('#jsTreeFile').jstree(true);
	 var thisNode = nodeRef.get_node(node.parent);
	 nodeRef.open_node(thisNode);
			 
			 
	var interval_id = setInterval(function(){
		if($("#"+node.id).length > 0){
			 // "exit" the interval loop with clearInterval command
			clearInterval(interval_id);
			console.log("selecting node " + node.id);
			 
			 
			
			 
			//select and scroll to the new node
			$("#jsTreeFile").jstree('select_node', node.id);
			setTimeout(function(){ 
				var thisElement = document.getElementById(node.id);
				
				$('#tabs-1').scrollTop( thisElement.offsetTop - 20 );

				renameFile();
			}, 400);
		}
	}, 10);
}

function cbCreateFolder(hashKey, event, message) {
	// message.status = true || false
	
	// if (message.status == true) you have set:
	// message.createFile.srcPath -- fileName
	// message.createFile.fileTreeHash -- "ID" 
	// message.createFile.fileTreeOwnerHash -- "Owner ID"
	var node = message.createDirectory.node;
	console.log("cbCreateFile() called with:");
	console.log(hashKey); console.log(event); console.log(message);
	console.log("cbCreateFile() end params");
	$("#jsTreeFile").jstree('create_node', node.parent, node, 'last');
	//create_node params = parentid,node,position
	
	//deselect all nodes
	$("#jsTreeFile").jstree("deselect_all");
	
	//open the folder that has the new node in it
	 var nodeRef = $('#jsTreeFile').jstree(true);
	 var thisNode = nodeRef.get_node(node.parent);
	 nodeRef.open_node(thisNode);
			 
			 
	var interval_id = setInterval(function(){
		if($("#"+node.id).length > 0){
			 // "exit" the interval loop with clearInterval command
			clearInterval(interval_id);
			console.log("selecting node " + node.id);
			 
			 
			
			 
			//select and scroll to the new node
			$("#jsTreeFile").jstree('select_node', node.id);
			setTimeout(function(){ 
				var thisElement = document.getElementById(node.id);
				
				$('#tabs-1').scrollTop( thisElement.offsetTop - 20 );

				renameFile();
			}, 400);
		}
	}, 10);
}

function createFile(fileDirectory) {
	var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + fileDirectory); 
	var statusJSON = {
		"commandSet": "FileTree",
		"command": "createFile",
		"hash" : randomKey,
		"createFile" : {
			"srcPath" : fileDirectory,
		},
	};
	wsSendMsg(JSON.stringify(statusJSON));
	wsRegisterCallbackForHash(randomKey, cbCreateFile);
	
}
function createFolder(fileDirectory) {
	var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + fileDirectory); 
	var statusJSON = {
		"commandSet": "FileTree",
		"command": "createDirectory",
		"hash" : randomKey,
		"createDirectory" : {
			"srcPath" : fileDirectory,
		},
	};
	wsSendMsg(JSON.stringify(statusJSON));
	wsRegisterCallbackForHash(randomKey, cbCreateFolder);
	
}

function deleteFile(fileName) {
	var ref = $('#jsTreeFile').jstree(true),
		sel = ref.get_selected();
	if (!sel.length) {
		return false;
	}
	sel = sel[0];
	var selectedNodes = ref.get_selected();

	var srcPath = $('#' + selectedNodes).attr("srcpath");

	var fileAndPath = ref.get_path(selectedNodes, "/");
	console.log("request to delete " + fileAndPath);


	var randomKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + selectedNodes);
	var statusJSON = {
		"commandSet": "FileTree",
		"command": "deleteEntry",
		"hash": randomKey,
		"deleteEntry": {
//			"srcPath": fileAndPath,
			"srcPath": srcPath,
		},
	};
	wsSendMsg(JSON.stringify(statusJSON));

	while (!getMsg(randomKey)) {
		setTimeout(function() {
			console.log('Waiting for reply')
		}, 100); // wait 10ms for the connection...
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
		changeDialogTitle(thisDialog, "Error Deleting File");
		addDialogIcon(thisDialog, "ui-icon-alert");
		addDialogInfo(thisDialog, "The file was unable to be deleted.");
		$("#" + thisDialog).dialog({
			modal: true,
			width: 375,
			height: 210,
			buttons: {
				Ok: function() {
					$(this).dialog("close");
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
			"hash" : randomKey,
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
			"hash" : randomKey,
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
		"plugins": ["dnd", "crrm", "types", "sort"],
		 


	});	
	$('.jstree').on('dblclick', '.jstree-anchor', function(e) { //double click for chat
		var instance = $.jstree.reference(this),
			node = instance.get_node(this);

		if (node.type == "chat") {


			//we've been asked to open a tab in the active pane. first, make sure theres at least 1 pane, or open 1
			if ($(".windowPane").length == 0) {
				createNewPane();
				 waitForNewWindow(1, newTab, node.text, node.id, node.type, node.li_attr.srcPath);
				

			}
			else {
				prepareActivePane();
			 	var interval_id = setInterval(function(){ //wait for active pane before calling new tab
					    
				     if ($(".activePane").length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
				      }
				}, 10);
				//	   	console.log(node);
			}
		}
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
		"plugins": ["dnd", "crrm", "types", "sort"],
		 


	});	
	$('.jstree').on('dblclick', '.jstree-anchor', function(e) { //double click for terminal
		var instance = $.jstree.reference(this),
			node = instance.get_node(this);

		if (node.type == "terminal") {


			//we've been asked to open a tab in the active pane. first, make sure theres at least 1 pane, or open 1
			if ($(".windowPane").length == 0) {
				createNewPane();
				 waitForNewWindow(1, newTab, node.text, node.id, node.type, node.li_attr.srcPath);
				

			}
			else {
				//if no panes have an active pane they must all be minimized. we will restore the most recent active pane from the array of active panes
				prepareActivePane();
			 	var interval_id = setInterval(function(){ //wait for active pane before calling new tab
					    
				     if ($(".activePane").length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
				      }
				}, 10);
				//	   	console.log(node);
			}
		}
	});
	
	var getCss = function(el) {
	    var style = window.getComputedStyle(el);
	    return Object.keys(style).reduce(function(acc, k) {
	        var name = style[k],
	            value = style.getPropertyValue(name);
	        if (value !== null) {
	            acc[name] = value;
	        }
	        return acc;
	    }, {});
	};

}
function initFlowchartTree(data) {
	if (!data) {
		console.log("Asked to init with no data, using built-ins")
		data = [{
			"id": "flowchartroot",
			"parent": "#",
			"text": "Flowcharts",
			"type": "root",
			"li_attr": {
				"class": "jsTreeRoot"
			}
		}, ]
	}
	console.log("Calling jstree() on");
	console.log($('#jsTreeFlowchart'));
	$('#jsTreeFlowchart').jstree({
		"core": {
			// so that create works
			'check_callback': function(operation, node, node_parent, node_position, more) {
                        if (operation == 'move_node') {
                        	return(false); //no moving flowcharts
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

			"root": {
				"icon": "jstree-folder",
				"valid_children": ["chat"]
			},
			"flowchart": {
				"icon": "jstree-file",
				"valid_children": []
			}
		},
		"plugins": ["dnd", "crrm", "types", "sort"],
		 


	});	
	$('.jstree').on('dblclick', '.jstree-anchor', function(e) { //double click for flowchart
		var instance = $.jstree.reference(this),
			node = instance.get_node(this);

		if (node.type == "flowchart") {


			//we've been asked to open a tab in the active pane. first, make sure theres at least 1 pane, or open 1
			if ($(".windowPane").length == 0) {
				createNewPane();
				 waitForNewWindow(1, newTab, node.text, node.id, node.type, node.li_attr.srcPath);
				

			}
			else {
				prepareActivePane();
			 	var interval_id = setInterval(function(){ //wait for active pane before calling new tab
					    
				     if ($(".activePane").length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
				      }
				}, 10);
				//	   	console.log(node);
			}
		}
	});
}

function initTaskBoardTree(data) {
	var defaults = [{
			"id": "taskboardroot",
			"parent": "#",
			"text": "Task Boards",
			"type": "root",
			"li_attr": {
				"class": "jsTreeRoot"
			}
		}, 
	];
	console.log("Defaults:");
	console.log(defaults);
	console.log("Data:");
	console.log(data);
	if (!data) {
		data = defaults;
		console.log("Asked to init with no data, using built-ins")
	}
	console.log("Calling jstree() on");
	console.log($('#jsTreeTaskBoard'));
	$('#jsTreeTaskBoard').jstree({
		"core": {
			// so that create works
			'check_callback': function(operation, node, node_parent, node_position, more) {
                        if (operation == 'move_node') {
                        	return(false); //no moving taskBoard boards
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
			"root": {
				"icon": "jstree-folder",
				"valid_children": ["taskBoard"]
			},
			"taskBoard": {
				"icon": "jstree-file",
				"valid_children": []
			}
		},
		"plugins": ["dnd", "crrm", "types", "sort"],
		 //contextmenu: {
		 //	items: fileTreeMenu,
		 //},


	});	
	$('.jstree').on('dblclick', '.jstree-anchor', function(e) { //double click for taskBoard
		var instance = $.jstree.reference(this),
		node = instance.get_node(this);
		
		if (node.type == "taskBoard") {

			//we've been asked to open a tab in the active pane. first, make sure theres at least 1 pane, or open 1
			if ($(".windowPane").length == 0) {
				createNewPane();
				 waitForNewWindow(1, newTab, node.text, node.id, node.type, node.li_attr.srcPath);
				

			}
			else {
				prepareActivePane();
			 	var interval_id = setInterval(function(){ //wait for active pane before calling new tab
					    
				     if ($(".activePane").length != 0){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         //newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.li_attr.srcPath);
				         console.log("opening up a task board from double click 1251");
				         newTab(node.text, $(".activePane .tabBar").attr('id'), node.id, node.type, node.text);
				      }
				}, 10);
				//	   	console.log(node);
			}
		}
	});
}

function duplicateFile() {
	
	var node = $('#jsTreeFile').jstree(true).get_selected(true); //currently selected node in the file tree
	node = node[0]; //only duplicate one file
	var fileName = node.text;
	var srcPath = node.li_attr.srcPath;
	console.log("duplicating " + fileName + " in " + srcPath);
}