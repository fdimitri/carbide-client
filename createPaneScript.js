

$(function() {
	initializeSortable();
	function initializeSortable() {
		var tabs = $( "%tabBar%" ).tabs();
        
        tabs.find( ".ui-tabs-nav" ).sortable({
            connectWith: '.ui-tabs-nav',
            helper: function(event, ui){
            	var retVal = '<div class="sortHelper">' + $(ui).find("a").html() + '</div>';

            	return(retVal);
            },
            appendTo: "body",
            receive: function (event, ui) {

			var tabs2 = $(ui.sender[0]).parent().find(".tabBar").tabs();
			moveTab(tabs,tabs2,$(this).parent(),$(ui.sender[0]).parent(),$(ui.item[0]));
			/*
                var receiver = $(this).parent(),
                    sender = $(ui.sender[0]).parent(),
                    tab = ui.item[0],
                    tab$ = $(ui.item[0]),
                // Find the id of the associated panel
                     panelId = tab$.attr( "aria-controls" );
               	var newIndex = ui.item.index();
                
                
                console.log("A List of things used in Move Tab:");
                console.log("tab:");
                console.log(tab);
                console.log("tab$:");
                console.log(tab$);
                console.log("newIndex:");
                console.log(newIndex);
 				console.log("This:")
 				console.log($(this));
                
                
                tab$ = $(tab$.removeAttr($.makeArray(tab.attributes).
                              map(function(item){ return item.name;}).
                              join(' ')).remove());
                tab$.find('a').removeAttr('id tabindex role class');

                $(this).append(tab$);

                $($( "#" + panelId ).remove()).appendTo(receiver);
                //var newIndex = $(this).data("ui-sortable").currentItem.index();
               	tabs.tabs("refresh");
                tabs.tabs({ active:newIndex});
                */
                
                
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
			var $paneId = $("#" + panelId);
			$paneId.remove();
			console.log("This:");
			console.log($(this));
			console.log("This.parent(li):");
			console.log($(this).parents('li'));
			if ($(this).parents('li').attr('type') == 'chat') {
				var chatName = $(this).parents('li').attr('filename');
				var statusJSON = {
					"commandSet": "chat",
					"chatCommand": "leaveChannel",
					"chatTarget": chatName,
					"leaveChannel": {
						"status" : true,
					},
				};
				console.log(statusJSON);
				wsSendMsg(JSON.stringify(statusJSON));
			}
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



/*$(function() {
	$("%pane%").click(function() {
		$(".windowPane").addClass("lowZ");
		$(".windowPane").removeClass("highZ");
		$("%pane%").removeClass("lowZ");
		$("%pane%").addClass("highZ");
	});
});*/

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
				ui.element.removeClass("activePane");

			});
			focusPane(ui.element.attr("id"));

		}

	});
	$("%pane%").draggable({
		containment: "parent",
		handle: ".paneHeader",
		cancel: ".maximizedPane",
		start: function(event, ui) {
			$(".windowPane").removeClass("activePane");
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

			focusPane($(this).attr("id"));
		}

	});
	

        

});

var newPaneTab = '<div class="windowPaneTab noSelect" pane="%paneX%" panetitle="%paneTitle%"><span class="windowPaneTabText">%paneTitle%</span><div class="windowPaneTabIcons"><span class="windowPaneTabIcon windowPaneTabFocus ui-icon ui-icon-extlink" style="visibility:hidden"></span><span class="windowPaneTabIcon windowPaneTabClose ui-icon ui-icon-close"></span></div></div>';
$("#toolBarTop").append(newPaneTab);

   