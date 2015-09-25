/* 
global wsRegisterCallbackForHash
global wsSendMsg
global hex_md5
global newTab
*/
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

    checkTerminalSizes($("#" + divName).closest(".windowPane").attr("id"));
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
    //  console.log("getTerminalByDiv returned:");
    //  console.log(term);

//      term.terminal.resize(1,1);
//      console.log("Entered resizeTerminalByObj");
// 	 console.log(terminalObj);
// 	 console.log(terminalObj.children('.terminal').first().width());
// 	 console.log(terminalObj.children('.terminal').first().height());
	 
//      var height = terminalObj.children('.terminal').first().height();
//      var width = terminalObj.children('.terminal').first().width();
     
     var width = term.terminal.getNormalizedWidth();
     var height = Math.floor(term.terminal.getNormalizedHeight());
	      
     
     
    //  console.log(terminalObj.height());
    //  console.log(terminalObj.width());
     
    //  console.log(terminalObj.parent().attr("id"));
    //  console.log(terminalObj.attr("id"));
     
     
     
     var newRows = parseInt(terminalObj.height() / height);
     var newCols = parseInt(terminalObj.width() / width) - 2;
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

    //setTimeout(function() {
        var thisPane = $('#' + paneId);
        var thisActiveTab = thisPane.find(".activeTab");
        console.log(thisActiveTab);
        console.log(thisActiveTab.attr("aria-controls"));
        console.log($("#" + (thisActiveTab).attr("aria-controls")));
        console.log($("#" + (thisActiveTab).attr("aria-controls")).find('.terminal'));
    	if ($("#" + (thisActiveTab).attr("aria-controls")).find('.terminalWindow').length) {
    		var activeTerminalName = $("#" + (thisActiveTab).attr("aria-controls")).find('.terminalWindow').attr("terminalId");
    		var activeTerminal = getTerminalByName(activeTerminalName);

    		resizeTerminalByName(activeTerminalName);
    // 		var rows = activeTerminal.terminal.getRows();
    // 		var cols = activeTerminal.terminal.getCols();
    // 		thisPane.find(".terminalWindow").each(function() {
    // 		    resizeTerminalByNameWithSize($(this).attr("terminalId"), cols - 1, rows);
    // 		});
    	}
    //}, 100); 
}


// function sendTerminalRequest(requestCommand, serverData, callBack) {
//     var hashKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + requestCommand); 
//     var eMsg = {
// 	"commandSet": "term",
// 	"termCommand": requestCommand,
// 	"hash": hashKey,
//         requestCommand : serverData,
//     };
//     wsSendMsg(JSON.stringify(eMsg));
//     wsRegisterCallbackForHash(hashKey, callBack);
// }

// function createTerminal(hashKey, event, msg) { //once the server has created a terminal we will process it in the file tree and open it if requested
//     if (event == 'send') {
//         return;
//     }
//     var createTerminal = msg['createTerminal'];
//     var terminalName = createTerminal['terminalName'];
//     var windowPane = createTerminal['windowPane'];
   
//     if ((windowPane) && (typeof windowPane !== 'undefined'))   { //there is a window pane request
        
//         var tabBarId =  $('#' + windowPane).find(".tabBar").attr("id");
        
//         var fileName = terminalName;
//         var tabBarId = tabBarId;
//         var originId = 'unknown';
//         var srcPath = terminalName;
// 		newTab(fileName, tabBarId, originId, 'term', srcPath);
        
//     }
    
    
//      //open the chat branch of the jstree
// 		var nodeRef = $('#jsTreeTerminal').jstree(true);
// 		nodeRef.deselect_all(true); //deselect nodes
// 		var thisNode = nodeRef.get_node('terminalroot');

// 		nodeRef.open_node(thisNode);
// 	//select the new node
// 		var interval_id = setInterval(function(){
// 		     // $("li#"+id).length will be zero until the node is loaded
// 		     if($("li#"+terminalName).length != 0){
// 		         // "exit" the interval loop with clearInterval command
// 		         clearInterval(interval_id);
// 		         var thisNode = nodeRef.get_node(terminalName);
// 				nodeRef.select_node(thisNode);
// 				var thisElement = document.getElementById(terminalName);
// 				$('#tabs-2').scrollTop( thisElement.offsetTop - 20 );
// 		      }
// 		}, 10);
// }
function sendTerminalRequest(requestCommand, serverData, callBack) {
    var hashKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + requestCommand); 
    var eMsg = {
		"commandSet": "term",
		"termCommand": requestCommand,
		"hash": hashKey,
	};
	if (requestCommand == "createTerminal") {
		eMsg.commandSet = "base";
		eMsg.command = requestCommand;
	}
	eMsg[requestCommand] = serverData;
	wsSendMsg(JSON.stringify(eMsg));
	wsRegisterCallbackForHash(hashKey, callBack)
}
function createTerminal(hashKey, event, msg) { //once the server has created a terminal we will process it in the file tree and open it if requested
        if (event == 'send') {
            return;
        }
        if (msg['status'] == false) {
        	console.log(msg['errorReasons']);
        	return(false);
        }
        var createTerminal = msg['createTerminal'];
        var terminalName = createTerminal['terminalName'];
        var windowPane = createTerminal['windowPane'];
       
        if ((windowPane) && (typeof windowPane !== 'undefined'))   { //there is a window pane request
            
            var tabBarId =  $('#' + windowPane).find(".tabBar").attr("id");
            
            var fileName = terminalName;
            var tabBarId = tabBarId;
            var originId = 'unknown';
            var srcPath = terminalName;
			newTab(fileName, tabBarId, originId, 'term', srcPath);
            
        }
        
        
         //open the terminal branch of the jstree
			var nodeRef = $('#jsTreeTerminal').jstree(true);
			nodeRef.deselect_all(true); //deselect nodes
			var thisNode = nodeRef.get_node('terminalroot');

			nodeRef.open_node(thisNode);
		//select the new node
			var interval_id = setInterval(function(){
			     // $("li#"+id).length will be zero until the node is loaded
			     if($("li#"+terminalName).length != 0){
			         // "exit" the interval loop with clearInterval command
			         clearInterval(interval_id);
			         var thisNode = nodeRef.get_node(terminalName);
					nodeRef.select_node(thisNode);
					var thisElement = document.getElementById(terminalName);
					$('#tabs-2').scrollTop( thisElement.offsetTop - 20 );
			      }
			}, 10);
}