$(document).ready(function() {
    
    
	
	
	
	
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
		});
		
});
$(function() {
	$("#jsTree1-ContextMenu").menu({
		select: function(event, ui) {
			$("#jsTree1-ContextMenu").hide();
			
			
			
		}
	});

	$("#tabs-1").on("contextmenu", function(event) {
		
		if ($(event.target).hasClass("jstree-anchor") || $(event.target).hasClass("jstree-icon")) {
			$("#jsTree1-ContextMenu").hide();
			return false;
		}
		else {
			$("#jsTree1-ContextMenu").show();
			$("#jsTree1-ContextMenu").position({
				collision: "none",
				my: "left top",
				of: event
			});
		}
	
		console.log($(event.target).attr("class"));
		
		

		return false;
	});

	$(document).click(function(event) {
		$("#jsTree1-ContextMenu").hide();
	});

	$("#jsTree1-ContextMenu").on("contextmenu", function(event) {
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
			items: fileTreeMenu
		}


	});
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
			},
			{
				"id": "terminalroot",
				"parent": "#",
				"text": "Shared Terminal",
				"type": "terminal",
				"li_attr": {
					"class": "jsTreeTerminal"
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
			},
			"terminal": {
				"icon": "jstree-file",
				"valid_children": []
			}


		},
		/*THIS NEEDS TO BE FIXED TO RESTORE CONTEXT MENU*/
		"plugins": [ "contextmenu",  "dnd", "crrm", "types"] ,
			contextmenu: {
				items: fileTreeMenu
			}
	});
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

function initChatTree(data) {

}
