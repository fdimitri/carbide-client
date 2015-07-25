
var terminalArray = [];

function addTerminal (terminalName,divName,columns,rows){
    console.log("We were told " + divName);
    console.log($("#" + divName).find('.terminalWindow'));
    divName = $("#" + divName).find('.terminalWindow').attr('id');
    console.log("But we're changing it to " + divName)
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

function removeTerminal (term) {
    terminalName = term.name;
    for (var i = 0; i < terminalArray.length; i++) {
        if (terminalArray[i].name == term.name) {
            console.log("DELETING TERMINAL " + term.name + " index " + i);
            terminalArray.splice(i,1);
            return true;
        }
    }
    return false;
}

function getTerminalByDiv(divName) {
    for (var i = 0; i < terminalArray.length; i++) {
    	if (terminalArray[i].div == divName) {
    	    return(terminalArray[i]);
    	}
	}
	return(false); //terminal not found
}
function getTerminalByName(terminalName) {
    for (var i = 0; i < terminalArray.length; i++)  {
    	if (terminalArray[i].name == terminalName) {
    	    return(terminalArray[i]);
    	}
	}
	return(false); //terminal not found
}




function resizeTerminalById(terminalId) {
    console.log("Entered resizeTerminalById with: " + terminalId);
    
    var res = getTerminalByDiv(terminalId);
    console.log("Result from get TerminalByDiv:");
    console.log(res);
    
    var terminalObj = $("#" + res.div);
    resizeTerminalByObj(terminalObj);
}

function resizeTerminalByName(terminalName) {
    console.log("Entering resizeTerminalByName with: " + terminalName);
    var res = getTerminalByName(terminalName);
    console.log("Result from getTerminalByName:");
    console.log(res);
    var terminalObj = $("#" + res.div);
    console.log("Calling resizeTerminalByObj");
    resizeTerminalByObj(terminalObj);
    console.log("Exiting resizeTerminalByName with: " + terminalName);
}


function resizeTerminalByObj(terminalObj) {
    /*
        From: createContentTerminal.js, how we get "term id" from "tab id" 
    	var terminalId = $("#%terminalId%").find(".terminalWindow").attr('id');
	    var terminalObj = $("#" + terminalId);
	 */
     var term = getTerminalByDiv(terminalObj.attr('id'));
     console.log("getTerminalByDiv returned:");
     console.log(term);

//      term.terminal.resize(1,1);
//      console.log("Entered resizeTerminalByObj");
// 	 console.log(terminalObj);
// 	 console.log(terminalObj.children('.terminal').first().width());
// 	 console.log(terminalObj.children('.terminal').first().height());
	 
//      var height = terminalObj.children('.terminal').first().height();
//      var width = terminalObj.children('.terminal').first().width();
     
     var width = term.terminal.getNormalizedWidth();
     var height = term.terminal.getNormalizedHeight();
	      
     
     
     console.log(terminalObj.height());
     console.log(terminalObj.width());
     
     console.log(terminalObj.parent().attr("id"));
     console.log(terminalObj.attr("id"));
     
     
     
     var newRows = parseInt(terminalObj.height() / height);
     var newCols = parseInt(terminalObj.width() / width);
     console.log("Terminal width/height:" + width + "x" + height)
     console.log("Parent width/height:" + terminalObj.width() + "x" + terminalObj.height());
     console.log("Terminal should in actuality be " + newCols + "x" + newRows + " in size and not 80x24");
    // Setresize(newCols, newRows); new rows, cols attribute here
    // We must also inform the shell, not sure if term.js does that
    console.log("Resizing terminal to " + newRows + " rows and " + newCols + " cols.");
    term.terminal.resize(newCols,newRows);
    var eMsg = {
		"commandSet": "term",
		"command": "resizeTerminal",
		"termTarget": term.name,
		"resizeTerminal": {
			"termSize": {
			    'cols' : newCols,
			    'rows' : newRows,
			}
		},
	 }
     wsSendMsg(JSON.stringify(eMsg));

}

function resizeTerminalByNameWithSize(terminalName, newCols, newRows) {
    /*
        From: createContentTerminal.js, how we get "term id" from "tab id" 
    	var terminalId = $("#%terminalId%").find(".terminalWindow").attr('id');
	    var terminalObj = $("#" + terminalId);
	 */
     var term = getTerminalByName(terminalName);
     console.log("getTerminalByName returned:");
     console.log(term);
     var terminalObj = $("#" + term.div);
	 console.log("Entered resizeTerminalByObj");
	 console.log(terminalObj);
	 console.log("Resizing terminal to " + newRows + " rows and " + newCols + " cols.");
	 term.terminal.resize(newCols,newRows);
     var eMsg = {
		"commandSet": "term",
		"command": "resizeTerminal",
		"termTarget": terminalName,
		"resizeTerminal": {
			"termSize": {
			    'cols' : newCols,
			    'rows' : newRows,
			}
		},
	 }
     wsSendMsg(JSON.stringify(eMsg));
}

function registerTerminalClose(term) {
    
        termName = term.name;
        var eMsg = {
			"commandSet": "term",
			"command": "leaveTerminal",
			"termTarget": termName,
			"leaveTerminal": {
								"status": true,
			},
			
		};
        wsSendMsg(JSON.stringify(eMsg));
}

function checkTerminalSizes (paneId) {
    console.log(arguments.callee.caller.toString());


    setTimeout(function() {
        var thisPane = $('#' + paneId);
        var thisActiveTab = thisPane.find(".activeTab");
    	if ($("#" + (thisActiveTab).attr("aria-controls")).find('.terminalWindow').length) {
    		var activeTerminalName = $("#" + (thisActiveTab).attr("aria-controls")).find('.terminalWindow').attr("terminalId");
    		var activeTerminal = getTerminalByName(activeTerminalName);
    		resizeTerminalByName(activeTerminalName);
    		var rows = activeTerminal.terminal.getRows();
    		var cols = activeTerminal.terminal.getCols();
    		thisPane.find(".terminalWindow").each(function() {
    		    resizeTerminalByNameWithSize($(this).attr("terminalId"), cols - 1, rows);
    		});
    	}
    }, 100); 
}
