//This file will include everything for the basic layout so many files in many places can use the look of carbide.
var rightBarOpen = 0; //the right bar is open by default (user box area) 0 = closed, 2 = expand arrow only
var lastPaneFormat = 0;

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
	
	$(window).trigger('resize'); //trigger resize event
	
	$(window).resize(function() { //on resize event reset all sizes
	    if ($('.windowPane').length > 0) { //don't arrange panes if there are no window panes
    		resetSizes();
	    }
	    else {
	        resetSizes(1);
	    }
	});
	resetSizes(1);
	
});

function resetSizes(suppressArrangePanes) {
	var pos = $("#windows").offset();
	console.log("Windows position:");
	console.log(pos);
	$("#editorContainer").height(
		$(window).height() -
		$("#topBar").height());
	$("#editorContainer").width($(window).width());


	$("#toolBarSide").height($(window).height() - 10);
	var te = $("#toolBarSide ul");
	var rw = $("#rightWindow");
	var wd = $("#windows");
	var rwWidth = $("#toolBarSide").outerWidth() + 21;
	te.width($("#toolBarSide").height() - 2);
	console.log("Resize event setting #rightWindow left to " + rwWidth)
	rw.css("left", rwWidth);
	//rw.css("left", 0);
	if (rightBarOpen == 0) { //no right bar at all
		rw.css("width", $(window).width() - rwWidth - 20);
	}
	else if (rightBarOpen == 1) { //full right bar
		rw.css("width", $(window).width() - rwWidth - 155); //extra room for the right bar
	}
	else if (rightBarOpen == 2) { //mini right bar: expand arrow only
		rw.css("width", $(window).width() - rwWidth - 40); //20 px allocated for the arrow
	}
	rw.css("height", $(window).height() - rw.position()['top']);

	wd.css("width", rw.width());
	wd.css("height", rw.height());
	if (suppressArrangePanes != 1) {
		arrangePanes(lastPaneFormat);
	}
	$("body").css({
		maxHeight: $(window).height()
	});
	$("body").css("overflow", "hidden");

	$(".maximizedPane").height($(".maximizedPane").parent().height() - 10);
	$(".maximizedPane").width($(".maximizedPane").parent().width() - 10);
	if ($('.windowPane').length > 0) { //don't arrange panes if there are no window panes
	    triggerPaneResizes();
	}
	$(".windowPane").each(function() { //check each window pane to see if has become too big for the window.
		if (!$(this).hasClass("maximizedPane")) { //don't adjust maximized panes
			var maxWidth = $(this).parent("#windows").width();
			var maxHeight = $(this).parent("#windows").height();
			//if this pane has become bigger than the maximum width/height due to window resizing, shrink it
			console.log("MAX " + maxWidth + " " + maxHeight)
			if ($(this).width() > maxWidth) {

				$(this).width(maxWidth - 10);
				$(this).css({left: 0, position:'absolute'});
			}
			if ($(this).height() > maxHeight) {

				$(this).height(maxHeight - 10);
				$(this).css({top: 0, position:'absolute'});
			}
		}
	});


}