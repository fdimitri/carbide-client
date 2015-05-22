$(document).ready(function() {
	 var term = addTerminal ("%terminalName%","%terminalId%",1,1);
	 console.log("Terminal ID: %terminalId%")
	 console.log($("#%terminalId%").children('.terminal').first().width());
	 console.log($("#%terminalId%").children('.terminal').first().height());
     var height = $("#%terminalId%").children('.terminal').first().height();
     var width = $("#%terminalId%").children('.terminal').first().width();
     var newRows = parseInt($("#%terminalId%").parent().parent().height() / height) - 1;
     var newCols = parseInt($("#%terminalId%").parent().parent().width() / width) - 1;
     console.log("Terminal width/height:" + width + "x" + height)
     console.log("Parent width/height:" + $("#%terminalId%").parent().parent().width() + "x" + $("#%terminalId%").parent().parent().height());
     console.log("Terminal should in actuality be " + newCols + "x" + newRows + " in size and not 80x24");
    // Setresize(newCols, newRows); new rows, cols attribute here
    // We must also inform the shell, not sure if term.js does that
     resizeTerminal("%terminalId", "%terminalName%", newRows, newCols)
});


    // Set new rows, cols attribute here
    // We must also inform the shell, not sure if term.js does that
