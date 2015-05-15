
var terminalArray = [];

function addTerminal (terminalName,divName,columns,rows){
    var term = new Terminal({
      cols: columns,
      rows: rows,
      screenKeys: true,
      useStyle: true,
    });
    terminalArray.push({div:divName,name:terminalName,terminal:term});	
    
    term.on('title', function(title) {
        //   document.title = title;
        // Set the tab title here instead of document.title
    });

		var eMsg = {
			"commandSet": "base",
			"command": "openTerminal",
			"openTerminal": {
				"termName": terminalName,
			},
		};
        wsSendMsg(JSON.stringify(eMsg));

    term.on('data', function(data) {
		var eMsg = {
			"commandSet": "term",
			"command": "inputChar",
			"termTarget": terminalName,
			"inputChar": {
				"term": terminalName,
				"data" : data,
			},
		};
        wsSendMsg(JSON.stringify(eMsg));
        // We should encode this data for JSON to send to the server, for now we'll log it
        console.log("Term.on(data) fired!");
        console.log(data);
    });
    
    term.open($("#" + divName).get(0));

    term.write('\x1b[31mTerminal Initialized!\x1b[m\r\n');
    return(term);

}    

function getTerminalByDiv(divName) {
    for (var i=0;i<terminalArray.length;i++)
    {
    	if (terminalArray[i].div == divName) {
    	    return(terminalArray[i].terminal)
    	}
	}
	return(-1); //terminal not found
}
function getTerminalByName(terminalName) {
    for (var i=0;i<terminalArray.length;i++)
    {
    	if (terminalArray[i].name == terminalName) {
    	    return(terminalArray[i].terminal)
    	}
	}
	return(-1); //terminal not found
}