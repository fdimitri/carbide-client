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
		var items = {
		};
	}



	return items;

}

