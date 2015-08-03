

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

function numTabBar() {
    return ($('.tabBar').length);
}

function resizePanes(layout) {
    if (layout == '3pane1') {
        // blah blah
    }
}

function waitForWindowPane(conditions, callback, callBackVar) {
    setTimeout(function() {
        if ((numWindowPanes() == conditions) && (numTabBar() == conditions)) {
            if (callback != null) {
            	setTimeout(function() {
                	callback(callBackVar);
            	}, 200);
            }
            return;
        }
        else {
            console.log("WAITING: " + numWindowPanes() + " UNTIL " + conditions)
            waitForWindowPane(conditions, callback, callBackVar);
        }
    }, 100); // wait 10ms for the connection...
}


function arrangePanes(paneFormat) {

	var currentTab = "";
	var mainPane = "";
	var paneCount = 0;
	var iPC = 0;
	var currentWindow = "";
    var theWindowPane = $(".windowPane");
    lastPaneFormat = paneFormat; //save the pane format in case we resize the window
    resetSizes(1);

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

		//setTimeout(function(){
			theWindowPane.css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
		    currentWindow.height(theWindowPane.parent("div").height() - 10);
			currentWindow.width(theWindowPane.parent("div").width()/2 - 3);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
			currentWindow = theWindowPane.eq(1);
		    currentWindow.css({top: 0, left: theWindowPane.parent("div").width()/2 + 2, position:'absolute'});
			currentWindow.height(theWindowPane.parent("div").height() - 10);
			currentWindow.width(theWindowPane.parent("div").width()/2 - 3);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
		//}, 100);
	}
	else if (paneFormat == "2b") { //2 Panes top and bottom

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width() - 7);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
			
			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width() - 7);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
			

	//	}, 100);

	}
	else if (paneFormat == "3a") { //3 Panes big pane on the left

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height() - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
			
			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
			
			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
			
		//}, 100);

	}
	else if (paneFormat == "3b") { //3 Panes big pane on the right

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height() - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

		//}, 100);

	}	
	else if (paneFormat == "3c") { //3 Panes big pane on the bottom

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height(($(".windowPane").parent("div").height() * 2)/3 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height(($(".windowPane").parent("div").height()*2)/3 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: ($(".windowPane").parent("div").height()*2)/3, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/3 - 5);
			currentWindow.width($(".windowPane").parent("div").width() - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

	//	}, 100);
	}
	else if (paneFormat == "3d") { //3 Panes big pane on the top

		//setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/3 - 5);
			currentWindow.width($(".windowPane").parent("div").width() - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: ($(".windowPane").parent("div").height())/3, left: 0, position:'absolute'});
			currentWindow.height(($(".windowPane").parent("div").height()*2)/3 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: ($(".windowPane").parent("div").height())/3, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height(($(".windowPane").parent("div").height()*2)/3 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

	//	}, 100);

	}	
	else if (paneFormat == "4") { //4 Panes equal size

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());
			
			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(3);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

	//	}, 100);

	}	
	else if (paneFormat == "5a") { //5 panes, tall one on right

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()*.4, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(3);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: $(".windowPane").parent("div").width()*.4, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(4);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()*.8, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height() - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());


	//	}, 100);

	}	
	else if (paneFormat == "5b") { //5 panes, tall one on left

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height() - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()*.2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()*.6, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(3);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: $(".windowPane").parent("div").width()*.2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(4);
			currentWindow.css({top: $(".windowPane").parent("div").height()/2, left: $(".windowPane").parent("div").width()*.6, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()/2 - 5);
			currentWindow.width($(".windowPane").parent("div").width()*.4 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());


	//	}, 100);

	}	
	else if (paneFormat == "5c") { //5 panes wide on bottom

	//	setTimeout(function(){ 
			$(".windowPane").css("display", "block");
			currentWindow = theWindowPane.eq(0);
			currentWindow.css({top: 0, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()*.4 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(1);
			currentWindow.css({top: 0, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()*.4 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(2);
			currentWindow.css({top: $(".windowPane").parent("div").height()*.4, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()*.4 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(3);
			currentWindow.css({top: $(".windowPane").parent("div").height()*.4, left: $(".windowPane").parent("div").width()/2, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()*.4 - 5);
			currentWindow.width($(".windowPane").parent("div").width()/2 - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

			currentWindow = theWindowPane.eq(4);
			currentWindow.css({top: $(".windowPane").parent("div").height()*.8, left: 0, position:'absolute'});
			currentWindow.height($(".windowPane").parent("div").height()*.2 - 5);
			currentWindow.width($(".windowPane").parent("div").width() - 5);
			currentWindow.resizable("enable");
			checkTerminalSizes(currentWindow.attr("id"));
			reportPanePosition (currentWindow.attr("id"), currentWindow.position().left, currentWindow.position().top, currentWindow.width(), currentWindow.height());

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
    

function reportPanePosition (paneId, left, top, width, height) {
	
	var statusJSON = {
			"commandSet": "client",
			"command": "paneRestore",
			"paneRestore" : {
				"paneId" :  paneId,
				"paneLeft" : left,
				"paneTop" : top,
				"paneWidth" : width,
				"paneHeight" : height,
				
			},
			
	};
	wsSendMsg(JSON.stringify(statusJSON));
	
}
    