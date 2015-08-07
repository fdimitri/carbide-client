function initProjectTree(data) {
	if (!data) {
		console.log("Asked to init with no data, using built-ins")
		data = [{
			"id": "ownedprojectroot",
			"parent": "#",
			"text": "Projects You Own",
			"type": "root",
			"li_attr": {
				"class": "jsTreeRoot"
			},
			
		},
		]
	}
	$('#userProjects').jstree({
		"core": {
			// so that create works
			'check_callback': function(operation, node, node_parent, node_position, more) {
                        if (operation == 'move_node') {
                        	return(false); //no moving projects
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

			"projecttree": {
				"icon": "jstree-folder",
				"valid_children": ["projectowner", "projectmember"]
			},
			"projectowner": {
				"icon": "jstree-file",
				"valid_children": []
			},
			"projectmember": {
				"icon": "jstree-file",
				"valid_children": []
			}
		},
		"plugins": ["dnd", "crrm", "types", "sort"],
		


	});	
	$('.jstree').on('dblclick', '.jstree-anchor', function(e) { //double click for user tree
		var instance = $.jstree.reference(this),
			node = instance.get_node(this);

		if (node.type == "flowchart") {

			
				
			console.log(node);
			
		}
	});
}
