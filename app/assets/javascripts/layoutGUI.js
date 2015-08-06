//This file will include everything for the basic layout so many files in many places can use the look of carbide.

$(document).ready(function() {
	
	
	$("#toolBarSide").resizable({
		resize: function() {
			//THIS IS WHERE WE SHOULD RESIZE #rightWindow
		},
		handles: 'e'
	});


	$("#toolBarSide").tabs({
		activate: function(event, ui) {
			var active = $('#tabs').tabs('option', 'active');
		}
	});
	
	resetSizes();
});