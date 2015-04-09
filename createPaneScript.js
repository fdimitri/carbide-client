$(function() {
	initializeSortable();
	function initializeSortable() {
		var tabs = $( "%tabBar%" ).tabs();
        
        tabs.find( ".ui-tabs-nav" ).sortable({
            connectWith: '.ui-tabs-nav',
            helper: function(){
            	var retVal = '<div class="sortHelper">' + $(this).find("a").html() + '</div>';
            	return(retVal);
            },
            appendTo: "body",
            receive: function (event, ui) {
                var receiver = $(this).parent(),
                    sender = $(ui.sender[0]).parent(),
                    tab = ui.item[0],
                    tab$ = $(ui.item[0]),
                // Find the id of the associated panel
                     panelId = tab$.attr( "aria-controls" );
                
                
                tab$ = $(tab$.removeAttr($.makeArray(tab.attributes).
                              map(function(item){ return item.name;}).
                              join(' ')).remove());
                tab$.find('a').removeAttr('id tabindex role class');

                $(this).append(tab$);

                $($( "#" + panelId ).remove()).appendTo(receiver);
                //var newIndex = $(this).data("ui-sortable").currentItem.index();
               	var newIndex = ui.item.index();
               	tabs.tabs("refresh");
                tabs.tabs({ active:newIndex});
                
                
                
            }
        });

	}
	var tabs = $( "%tabBar%" ).tabs();

/*	$("a").draggable({

		//connectToSortable: ".tabBar",
		drag: function() {
            console.log("<p>dragging...</p>");
        },
        stop: function() {
            console.log("<p>stopping drag...</p>");
            //$("#sortable").sortable("enable");
        }
	});*/
	
	tabs.delegate("span.ui-icon-close", "click", function() {
			var panelId = $(this).closest("li").remove().attr("aria-controls");
			$("#" + panelId).remove();
			tabs.tabs("refresh");
	});
	tabs.bind("keyup", function(event) {
		if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
			var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
			$("#" + panelId).remove();
			tabs.tabs("refresh");
		}
	});	
	
});



$(function() {
	$("%pane%").click(function() {
		$(".windowPane").addClass("lowZ");
		$(".windowPane").removeClass("highZ");
		$("%pane%").removeClass("lowZ");
		$("%pane%").addClass("highZ");
	});
});

/*$(function() {
	$("#editorContextWindow01").menu({
		select: function(event, ui) {
			$("#editorContextWindow01").hide();
			alert("Menu element clicked!");
		}
	});

	$("%pane%").on("contextmenu", function(event) {
		$("#editorContextWindow01").show();
		$("#editorContextWindow01").position({
			collision: "none",
			my: "left top",
			of: event
		});
		console.log(event);

		return false;
	});

	$(document).click(function(event) {
		$("#editorContextWindow01").hide();
	});

	$("#editorContextWindow01").on("contextmenu", function(event) {
		return false;
	});
	$("#editorContextWindow01").hide();
	$(".windowPane").addClass("lowZ");
	$(".windowPane").removeClass("highZ");
	$("%pane%").removeClass("lowZ");
	$("%pane%").addClass("highZ");

});
*/

$(function() {
	var containerHeight = 0;
	var containerWidth = 0;
	var newHeight = 0;
	$("%pane%").resizable({
		containment: "parent",
		cancel: ".maximizedPane",
		resize: function( event, ui ) {

			containerHeight = ui.size.height;
			containerWidth = ui.size.width;
			// This should resize Ace Editor, we need to trigger it to resize when the pre size changes
			$(this).find('pre').each(function() {
        	var editor = getAceEditorByName($(this).attr('srcpath'));
        		editor.resize(true);
    		});
			if( $(ui.element).find(".cContainer").length) {
	
				

				newHeight = $(ui.element).find(".cContainer").height() - $(ui.element).find(".cInputBoxContainer").height();
			//	$(ui.element).find(".cOutputs").css("height", newHeight);

			}
			//else { console.log("there is no chat window."); }
			

			
		},
		start: function(event, ui) {
			$(".windowPane").addClass("lowZ");
			$(".windowPane").removeClass("highZ");
			//ui.element.addClass("activeWindow");
			$(".windowPane").each(function() {
				var cssObj = {
					top: $(this).position().top,
					left: $(this).position().left
				};
				$(this).css(cssObj);
			});
			$(".windowPane").each(function() {
				$(this).css("position", "absolute");

			});
			ui.element.addClass("highZ");

		}

	});
	$("%pane%").draggable({
		containment: "parent",
		handle: ".paneHeader",
		cancel: ".maximizedPane",
		start: function(event, ui) {
			$(".windowPane").addClass("lowZ");
			$(".windowPane").removeClass("highZ");
			$(".windowPane").each(function() {
				var cssObj = {
					top: $(this).position().top,
					left: $(this).position().left
				};
				$(this).css(cssObj);
			});
			$(".windowPane").each(function() {
				$(this).css("position", "absolute");

			});
			//$( this ).addClass("activeWindow");

			$(this).addClass("highZ");
		}

	});
	
	/*
	var tabs = $("#tabBar01").tabs();
	$("#tabBar01 ul").sortable({
		connectWith: ".tabBar ul",
		helper: "clone",
		appendTo: "body",
		items: "> li",
		stop: function( event, ui ) {
			console.log(" Sorting has Stopped!");
			//$("a", ui.item).click();
			
		},
		receive: function(event, ui ) {
			var ariaName = $(ui.item).closest("li").attr("aria-controls");
			var appendLocation = $(event.target).parent();
			
			console.log($(event.target).prop("tagName"));
			console.log($(event.target).parent().attr("id")); 
			console.log("DEBUG THE SENDER: " + $(ui.sender).prop("tagName") + " and " + $(ui.sender).parent().attr("id"));

			var clonedDiv = $("#" + ariaName).detach();
		//	var clonedDiv = $("#" + ariaName).clone();
		//	$("#" + ariaName).remove();
		
			
			clonedDiv.appendTo(appendLocation);
			
			//var stringToReplace = "/" + $(ui.sender).parent().attr("id") + "/g"; //this is the ID of the first tabbar, ie tabBar01
			var stringToReplace = new RegExp($(ui.sender).parent().attr("id"),'g'); //this is the ID of the first tabbar, ie tabBar01
			var stringReplacement = $(event.target).parent().attr("id"); //this is the ID of the new tabbar we just dropped in, ie tabBar02
			var hayStack = $(event.target).parent().html(); //get the html of the new panes tabbar
			var updatedHayStack = "";
			
			
			
			updatedHayStack = hayStack.replace(stringToReplace,stringReplacement); //substitute all instances of tabBar01 with tabBar02
			$(event.target).parent().html(updatedHayStack);			
			
			console.log("We are attempting to replace all instances of " + stringToReplace + " with " + stringReplacement);
			console.log("In the following html: " + hayStack);
			console.log("To the following html: " + updatedHayStack);
			
			//$(".tabBar").each().tabs("refresh");
			
			tabs.tabs("refresh").tabs({ active:0});
			
			//NOTES FOR MYSELF: aria-controls needs to be updated with the new tab bar name. so does the A target and the div ID
			//so lets just change every instance of the old ID (tabBar01) with the new ID (tabBar02 in this case)
			//the position of the tab after it's sorted into a new box can be found with .index() and used to select that new tab.
			
			
			//$("#" + ariaName).click();
			

			//HERE ARE THE FACTS: (and just the facts)
			// $(event.target) = where it was dragged to
			// $(ui.sender) = where it came from
			// $(ui.item) = the thing that was dragged
			// var ariaName = an attribute on the original item that was dragged that shows the ID of its corresponding aria controls
			// we need to clone the aria tab from ui.sender and add it to the new pane, then delete the old one...
			
			///$(event.target)
//			$(event.target).("#" + ariaName).tabs().append("<div class='AriaTab' id='" + ariaName + "'></div>");
			
		//	console.log($(ui.sender).parent().find("#" + ariaName).prop("tagName"));
		//	$(ui.sender).parent().find("#" + ariaName).remove();
			
			console.log($(event.target).parent().find(".aria-tab"));
			
		}
	});
*/

        

});

var newPaneTab = '<div class="windowPaneTab" pane="%paneX%">%paneTitle%<div class="windowPaneTabClose">X</div></div>';
$("#toolBarTop").append(newPaneTab);

   