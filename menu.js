
$(document).ready(function() {
    
    
    
    
    
    
	$(".arrangePane").click(function() {
	        var paneType =  $(this).attr('panes');
	        var neededPanes = paneType.match(/\d/);
	        var totalPanes = numWindowPanes();
	    if (totalPanes < neededPanes) {
	        var createPanes = neededPanes - totalPanes;
	        while (createPanes--) {
	            createNewPane();
	        }
	    }
	    if (totalPanes > neededPanes) {
	         //Destroy extra panes here
	         var loopForPanes = parseInt(neededPanes) + 1;
	         for (var i = loopForPanes; i<=totalPanes; i++) {
	         	//var tabs = $('.windowPane').eq(0).children(".tabBar").tabs();
	         	console.log($('.windowPane').eq(i-1).find(".addTab").length)
	         	removeAddTabButton($('.windowPane').eq(i-1).attr("id"));
	         	console.log("i is " + i);
	         	console.log($('.windowPane').eq(i-1).children(".tabBar").children(".menuList").children("li").length);
	         	var numTabsToDelete = $('.windowPane').eq(i-1).children(".tabBar").children(".menuList").children("li").length;
	         	for (var j = 0; j<numTabsToDelete; j++) {
	     
	         		var tabToMove = $('.windowPane').eq(i-1).children(".tabBar").find("li").eq(0);
	         		var senderTabBar = tabToMove.closest(".tabBar");
					tabToMove.appendTo($('.windowPane').eq(0).find("ul"));
	         		moveTab($('.windowPane').eq(0).find(".tabBar"),senderTabBar,tabToMove);
	         	}
	         	
	         	
	         }
	         for (i = loopForPanes; i<=totalPanes; i++) { //now we close the empty panes
	         	closePane($('.windowPane').eq(loopForPanes-1).attr("id"));
	         }
	    }
	    waitForWindowPane(neededPanes, arrangePanes, paneType);

	});


   
    $("#window_newPane").click(function() {
        createNewPane();
    });

});


function numWindowPanes() {
    return ($('.windowPane').length);
}

function resizePanes(layout) {
    if (layout == '3pane1') {
        // blah blah
    }
}

function waitForWindowPane(conditions, callback, callBackVar) {
    setTimeout(function() {
        if (numWindowPanes() >= conditions) {
            if (callback != null) {
                callback(callBackVar);
            }
            return;
        }
        else {
            console.log("WAITING: " + numWindowPanes() + " UNTIL " + conditions)
            waitForWindowPane(conditions, callback, callBackVar);
        }
    }, 50); // wait 10ms for the connection...
}


function arrangePanes(paneFormat) {

	var currentTab = "";
	var mainPane = "";
	var paneCount = 0;
	var iPC = 0;
	var currentWindow = "";
    var theWindowPane = $(".windowPane");
    lastPaneFormat = paneFormat; //save the pane format in case we resize the window
    

	if (paneFormat == "1") {
		mainPane = $(".windowPane").eq(0); //store the first pane, which will become our only pane

        /*the following is how to cycle through every pane except the first, which we will need some day for condensing the tabs
		$(".windowPane:not(:first)").each(function() { //cycle through all panes except the 1st
		});
        */		
		
		/*  //REPLACED BY function maximizePane(paneId)
		$(mainPane).parent().css({position: 'relative'});
		$(mainPane).css({top: 5, left: 5, position:'absolute'});
		$(mainPane).addClass("paneMaximized");
		
		$(mainPane).height($(mainPane).parent("div").height()-10);
		$(mainPane).width($(mainPane).parent("div").width()-10);
		*/

		maximizePane($(".windowPane").eq(0).attr("id"));
		
	}
	else if (paneFormat == "2a") { //2 Panes side by side

		//setTimeout(function(){  //this is how REAL optimization is done! Take notes!
			theWindowPane.css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 5, left: 5, position:'absolute'});
		    currentWindow.height(theWindowPane.parent("div").height() - 10);
			currentWindow.width(theWindowPane.parent("div").width()/2 - 15);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			currentWindow = theWindowPane.eq(1);
		    currentWindow.css({top: 5, left: theWindowPane.parent("div").width()/2 + 10, position:'absolute'});
			currentWindow.height(theWindowPane.parent("div").height() - 10);
			currentWindow.width(theWindowPane.parent("div").width()/2 - 15);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
		//}, 100);
	}
	else if (paneFormat == "2b") { //2 Panes top and bottom

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width() - 10);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: $(".windowPane").parent("div").height()/2 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width() - 10);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));

	//	}, 100);

	}
	else if (paneFormat == "3a") { //3 Panes big pane on the left

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height() - 12);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: 5, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 10);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: $(".windowPane").parent("div").height()/2 + 5, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height()/2 - 10);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
		//}, 100);

	}
	else if (paneFormat == "3b") { //3 Panes big pane on the right

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height()/2 - 10);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: $(".windowPane").parent("div").height()/2 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 10);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: 5, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height() - 12);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
		//}, 100);

	}	
	else if (paneFormat == "3c") { //3 Panes big pane on the bottom

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: 5, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: $(".windowPane").parent("div").height()/2 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width() - 15);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
	//	}, 100);
	}
	else if (paneFormat == "3d") { //3 Panes big pane on the top

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width() - 10);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: $(".windowPane").parent("div").height()/2 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: $(".windowPane").parent("div").height()/2 + 10, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
	//	}, 100);

	}	
	else if (paneFormat == "4") { //4 Panes equal size

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: 5, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: $(".windowPane").parent("div").height()/2 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
			$(".windowPane").eq(3).css({top: $(".windowPane").parent("div").height()/2 + 10, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(3).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(3).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(3).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(3).attr("id"));
	//	}, 100);

	}	
	else if (paneFormat == "5a") { //5 panes, tall one on right

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: 5, left: $(".windowPane").parent("div").width()*.4 + 10, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: $(".windowPane").parent("div").height()/2 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
			$(".windowPane").eq(3).css({top: $(".windowPane").parent("div").height()/2 + 10, left: $(".windowPane").parent("div").width()*.4 + 10, position:'absolute'});
			$(".windowPane").eq(3).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(3).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(3).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(3).attr("id"));
			$(".windowPane").eq(4).css({top: 5, left: $(".windowPane").parent("div").width()*.8 + 10, position:'absolute'});
			$(".windowPane").eq(4).height($(".windowPane").parent("div").height() - 15);
			$(".windowPane").eq(4).width($(".windowPane").parent("div").width()*.2 - 20);
			$(".windowPane").eq(4).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(4).attr("id"));

	//	}, 100);

	}	
	else if (paneFormat == "5b") { //5 panes, tall one on left

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height() - 12);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width()*.2 - 20);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: 5, left: $(".windowPane").parent("div").width()*.2 + 10, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: 5, left: $(".windowPane").parent("div").width()*.6 + 10, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
			$(".windowPane").eq(3).css({top: $(".windowPane").parent("div").height()/2 + 10, left: $(".windowPane").parent("div").width()*.2 + 10, position:'absolute'});
			$(".windowPane").eq(3).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(3).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(3).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(3).attr("id"));
			$(".windowPane").eq(4).css({top: $(".windowPane").parent("div").height()/2 + 10, left: $(".windowPane").parent("div").width()*.6 + 10, position:'absolute'});
			$(".windowPane").eq(4).height($(".windowPane").parent("div").height()/2 - 15);
			$(".windowPane").eq(4).width($(".windowPane").parent("div").width()*.4 - 20);
			$(".windowPane").eq(4).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(4).attr("id"));

	//	}, 100);

	}	
	else if (paneFormat == "5c") { //5 panes wide on bottom

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			$(".windowPane").eq(0).css({top: 5, left: 5, position:'absolute'});
			$(".windowPane").eq(0).height($(".windowPane").parent("div").height()*.4 - 20);
			$(".windowPane").eq(0).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(0).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(0).attr("id"));
			$(".windowPane").eq(1).css({top: 5, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(1).height($(".windowPane").parent("div").height()*.4 - 20);
			$(".windowPane").eq(1).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(1).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(1).attr("id"));
			$(".windowPane").eq(2).css({top: $(".windowPane").parent("div").height()*.4 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(2).height($(".windowPane").parent("div").height()*.4 - 20);
			$(".windowPane").eq(2).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(2).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(2).attr("id"));
			$(".windowPane").eq(3).css({top: $(".windowPane").parent("div").height()*.4 + 10, left: $(".windowPane").parent("div").width()/2 + 10, position:'absolute'});
			$(".windowPane").eq(3).height($(".windowPane").parent("div").height()*.4 - 20);
			$(".windowPane").eq(3).width($(".windowPane").parent("div").width()/2 - 15);
			$(".windowPane").eq(3).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(3).attr("id"));
			$(".windowPane").eq(4).css({top: $(".windowPane").parent("div").height()*.8 + 10, left: 5, position:'absolute'});
			$(".windowPane").eq(4).height($(".windowPane").parent("div").height()*.2 - 10);
			$(".windowPane").eq(4).width($(".windowPane").parent("div").width() - 12);
			$(".windowPane").eq(4).resizable("enable");
			checkTerminalSizes($(".windowPane").eq(4).attr("id"));

	//	}, 100);

	}	
	
	
	if (paneFormat != "1" && paneFormat != "0") { //if there is more than 1 pane none of them should be maximized
		$(".windowPane").removeClass("maximizedPane");
	}
	
	//now set the attributes for restoration of panes
	$(".windowPane").each(function() {
			$(this).attr("oldx", $(this).position().left); //these attributes are used if a pane is restored
			$(this).attr("oldy", $(this).position().top);
			$(this).attr("oldheight", $(this).height());
			$(this).attr("oldwidth", $(this).width());
	});
}
    
    