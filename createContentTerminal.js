$(document).ready(function() {
	 var term = addTerminal ("%terminalName%","%terminalId%",1,1);
	var terminalId = $("#%terminalId%").find(".terminalWindow").attr('id');
    var terminalObj = $("#" + terminalId);
	 console.log("Terminal ID:" + terminalId + " Name: %terminalName%")
	 var terminalId = $("#%terminalId%").find(".terminalWindow").attr('id');
	 var terminalObj = $("#" + terminalId);
	 //resizeTerminalByObj(terminalObj);
});


    // Set new rows, cols attribute here
    // We must also inform the shell, not sure if term.js does that
