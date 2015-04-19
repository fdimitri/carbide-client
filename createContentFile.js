$("#%paneId%").on('resize', function() {
    console.log("Pane has been resized");
    $(this).find('pre').each(function() {
        console.log("AceEditor pre container resize triggered");
        var editor = getAceEditorByName($(this).attr('srcpath'));
        editor.resize(true);
    });
});

// $("#file_%tabName%").on('keydown', function ( e ) {
//     console.log("Our paneId is %paneId%");
    
//     if ( e.altKey && ( String.fromCharCode(e.which) === 'r' || String.fromCharCode(e.which) === 'R' ) ) { //ALT-R keypress
//         var te = $(this);
// 		var statusJSON = {
// 			"commandSet" : "document",
// 			"command" : "getContents",
// 			"documentTarget" : te.attr('srcPath'),
// 			"getContents" : {
// 				"document" : te.attr('srcPath'),
// 			},
// 		};
// 		var rval = wsSendMsg(JSON.stringify(statusJSON));
//     }
// });


$(".tabBar").find(".reloadButton").on('click', function ( e ) {
    console.log("Our paneId is " + $(this).closest(".windowPane").attr("id"));
    console.log("reload acknowledged.");
    
        var te = $(this).closest("li");
		var statusJSON = {
			"commandSet" : "document",
			"command" : "getContents",
			"documentTarget" : te.attr('srcPath'),
			"getContents" : {
				"document" : te.attr('srcPath'),
			},
		};
		var rval = wsSendMsg(JSON.stringify(statusJSON));
    
});
