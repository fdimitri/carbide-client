var messageQueue = {};
var msgQueueDefaultOptions = {
	'deleteAll': true,
	'getWholeHash': true,
};
var userDefaultOptions = {
	'showLines': true,
	'linesHour': 0,
	'linesDay': 0,
	'linesProj': 0,
};
var connectionStatus = false; //disconnected at start (to server)

var ws = false;
	




$(document).ready(function() {
 	ws = new WebSocket("ws://frank-d.info:8080/");
	ws.onmessage = function(evt) {
		console.log("onmessage fired: " + evt);
		var jObj = $.parseJSON(evt.data);
		console.log(jObj);
		if (jObj['hash']) {
			addMessageQueue(jObj['hash'], jObj, false);
		}
		if (!jObj.commandSet) {
			console.log("Missing commandSet  -- this will break file editing");
			return;
		}
		if (jObj.commandSet == "chat") {
			console.log("Received chat command: " + jObj.command);
			cliMsgProcChat(jObj);
		}
		else if (jObj.commandSet == "FileTree") {
			cliMsgProcFileTree(jObj);
		}
		else if (jObj.commandSet == "document") {
			cliMsgProcDocument(jObj);
		}
		else if (jObj.commandSet == "term") {
			cliMsgProcTerminal(jObj);
		}
		else {
			console.log("Received non-chat command: " + jObj.commandSet);
		}
	};

	ws.onerror = function(error) {
		console.log(error);
	};

	ws.onclose = function() {
		var connOpts = [];
		connOpts['speed'] = 0;
		updateConnectionStatus(connOpts); //update connection status to disconnected
		console.log("Websocket was closed..");
		console.log(ws);
	};
	ws.onopen = function() {
		var connOpts = [];
		connOpts['speed'] = 1;
		updateConnectionStatus(connOpts); //update connection status to show fully connected
		console.log("Websocket now open!");
		console.log(ws);
	};
	
});



////FUNCTION DEFINITIONS FOLLOW

function waitForSocketConnection(socket, callback) {
		setTimeout(function() {
			if (socket.readyState === 1) {
				if (callback != null) {
					callback();
				}
				return;

			}
			else {
				waitForSocketConnection(socket, callback);
			}

		}, 10); // wait 10ms for the connection...
}

function wsSendMsg(msg) {
	while (!ws) {
		setTimeout(function() {
			waitForWebSocket();
		}, 125);
	}
	waitForSocketConnection(ws, function() {
		var nopush = false;
		console.log("Sent msg to server over websocket: " + msg);
		try {
			var jmsg = $.parseJSON(msg);
		}
		catch (e) {
			console.log('Outgoing message is NOT JSON');
			nopush = true;
		}
		if (!nopush && jmsg['hash']) {
			addMessageQueue(jmsg['hash'], jmsg, true);
		}
		ws.send(msg);
	});
}

function waitForWebSocket() {
	while (!ws) {
		setTimeout(function() {
			while (true) {
				
			}
		}, 100);
	}
}

function getAceEditorByName(name) {
	var aceEditors = $('.ace_editor');
	console.log("getAceEditorByName(" + name + ")");
	var rval = [];
	aceEditors.each(function() {
		if ($(this).attr('srcpath') == name) {
			console.log("Found editor for " + name);
			rval.push(ace.edit(this));
		}
	});
	return (rval);
}

function getAceEditorTheme() {
	if (currentTheme) {
		return (currentTheme);
	}
	var aceEditors = $('.ace_editor');
	console.log(aceEditors);
	var theme;
	aceEditors.each(function() {
		var editor = ace.edit(this);
		theme = editor.getTheme();
		return (false);
	});
	return (theme);
}


function setAceEditorTheme(theme) {
	var aceEditors = $('.ace_editor');
	aceEditors.each(function() {
		var editor = ace.edit(this);
		editor.setTheme(theme);
	});
}


function getMsg(key) {
	return (true);
}

function cliMsgProcDocument(jObjo) {
	var jObj = jObjo;
	var editors = getAceEditorByName(jObj.targetDocument);
	if (!editors.length) {
		console.log("Unable to find editor, ignoring message");
		return (false);
	}
	console.log("cliMsgProcDocument(): Found editors!");
	console.log(editors);
	var editor;
	for (var i = 0; i < editors.length; i++) {
		editor = editors[i];
		console.log("cliMsgProcDocument processing editor " + i);
		console.log($(editor));
		console.log(editor);
		$(editor).attr('ignore', 'TRUE')
		if (jObjo.command == 'insertDataSingleLine') {
			jObj = jObjo.insertDataSingleLine;
			var Range = require("ace/range").Range;
			var inputData = jObj.data;
			var lineData = jObj.line;
			var chData = jObj.char;
			var targetDocument = jObj.document;
			var r;
			var session = editor.getSession();
			var doc = session.getDocument();
			// r = new Range(lineData, chData, lineData, chData + inputData.length);
			// editor.getSession().replace(r, inputData);
			session.insert({
				row: lineData,
				column: chData
			}, inputData);
		}
		else if (jObjo.command == 'deleteDataSingleLine') {
			// Will not delete an actual line, we need to fix this
			console.log("Enter deleteDataSingleLine")
			jObj = jObjo.deleteDataSingleLine;
			var inputData = jObj.data;
			var lineData = jObj.line;
			var chData = jObj.char;
			var delLength = jObj.length;
			var targetDocument = jObj.document;
			var Range = require("ace/range").Range;
			// MAJOR HACK, ask for document contents if we're deleting a newline character since Ace is ass..
			if (1 && inputData == "\n") {
				var statusJSON = {
					"commandSet": "document",
					"command": "getContents",
					"documentTarget": $(editor).attr('srcPath'),
					"getContents": {
						"document": $(editor).attr('srcPath'),
					},
				};
				var rval = wsSendMsg(JSON.stringify(statusJSON));

			}
			else {
				r = new Range(lineData, chData, lineData, chData + inputData.length);
				console.log("Calling getSession.remove range");
				console.log(r);
				console.log(jObj);
				editor.getSession().remove(r);
			}
		}

		if (jObjo.command == 'insertDataMultiLine') {
			jObj = jObjo.insertDataMultiLine;
			console.log(jObj);
			var targetDocument = jObj.document;
			var r, curLine, prevLine, p;
			var Range = require("ace/range").Range;
			curLine = jObj.startLine;
			jObj.data.forEach(function(entry) {
				console.log("jobj.data.each inserting at " + curLine);
				//      r = new Range(curLine, 0, curLine, entry.length + 1);
				// editor.getSession().replace(r, entry + '\n');
				r = {
					row: curLine,
					column: 0
				};
				editor.getSession().getDocument().insert(r, entry + "\n")
				curLine += 1;
			});
		}
		if (jObjo.command == 'deleteDataMultiLine') {
			console.log("Recvd msg for deleteDataMultiLine")
			jObj = jObjo.deleteDataMultiLine;
			var targetDocument = jObj.document;
			var doc = editor.getSession().getDocument();
			console.log("Called getSession().getDocument(), calling removeLines()")
			doc.removeLines(jObj.startLine, jObj.endLine - 1);
		}
		if (jObjo.command == 'documentSetContents') {
			var dsc = jObj.documentSetContents;
			editor.setValue(dsc.data, -1);
		}
		console.log("Removing ignore attribute from editor " + i);
		$(editor).attr('ignore', 'FALSE');
	}
}


function cliMsgProcFileTree(jObj) {
	console.log("MsgProcFileTree:");
	console.log(jObj);
	if (jObj.command == "setFileTreeJSON") {
		var myData = jObj.setFileTreeJSON;
		console.log(myData.fileTree);
		initFileTree($.parseJSON(myData.fileTree));
	}
	else if (jObj.command == "setFileTreeModalJSON") {
		var myData = jObj.setFileTreeModalJSON;
		console.log(myData.fileTree);
		initFileTree($.parseJSON(myData.fileTree), "#miniFileTree");
	}

	else if (jObj.command == "deleteFile") {
		//the server says to delete a file
	}
	else {
		console.log(jObj.command)
	}
}



function cliMsgProcChat(jObj) {
	if (jObj.command == "sendMessage") {
		jObj = jObj.sendMessage;
		var User = jObj.user;
		var Text = jObj.msg;
		var Channel = '#' + jObj.chat + '_ChatBox';
		var msgDiv = "<div class='cMsg'><span class='cMsgUser'>" + User + "</span><span class='cMsgMsg'>" + Text + "</span></div>";
		var msgDiv = "<table class='cMsgT'><tr><td>" + User + "</td><td><p>" + Text + "</p></td></table>";
		$(Channel).append(msgDiv);
		if ($(Channel).prop('scrollHeight')) {
			$(Channel).animate({
				scrollTop: $(Channel)[0].scrollHeight
			}, 333);
		}
		console.log("Append to " + Channel);
	}
	else if (jObj.command == "userJoin") {
		jObj = jObj.userJoin;
		var User = jObj.user;
		var Channel = '#' + jObj.chat + '_UserBox';
		var msgDiv = "<div class='cUser' chatUser='" + User + "'>" + User + "</div>";
		$(Channel + " .cUser").each(function() {
			if ($(this).attr('chatUser') == User) return;
		});
		$(Channel).append(msgDiv);
	}
	else if (jObj.command == "userLeave") {
		console.log("Received userLeave command");

		jObj = jObj.userLeave;
		var User = jObj.user;
		var Channel = '#' + jObj.chat + '_UserBox';

		//var msgDiv = "<div class='cUser' chatUser='" + User + "'>" + User + "</div>";
		$(Channel).children(".cUser").each(function() {
			if ($(this).attr('chatUser') == User) {
				console.log("Found matching user.. calling remove")
				console.log(this);
				console.log($(this));
				$(this).remove();
			}

		});
	}
	else if (jObj.command == "setChatTreeJSON") {
		var myData = jObj.setChatTreeJSON;
		console.log(myData.chatTree);
		initChatTree($.parseJSON(myData.chatTree));
	}

	else if (jObj.command == "userList") {
		jObj = jObj.userList;
		var userList = jObj.list;
		var Channel = '#' + jObj.chat + '_UserBox';
		for (val of userList) {
			var User = val;
			var msgDiv = "<div class='cUser' chatUser='" + User + "'>" + User + "</div>";
			var userExists = false;
			$(Channel + " div").each(function() {
				if ($(this).attr('chatUser') == User) {
					console.log("User already exists in userBox");
					userExists = true;
					return false;
				}
			});
			if (!userExists) $(Channel).append(msgDiv);
		}

	}

	else if (jObj.command == 'addChat') {
		var addChat = jObj.addChat;
		var node = addChat.node;
		$("#jsTreeChat").jstree('create_node', 'chatroot', node, 'last');
	}

}

function cliMsgProcTerminal(jObj) {
	console.log("Entered cliMsgProcTerminal");
	console.log(jObj);
	var term = getTerminalByName(jObj.terminal).terminal;
	if (term == false) {
		console.log("getTerminalByName(" + jObj.terminal + ") returned false");
		return false;
	}
	if (jObj.command == 'putChar') {
		jObj = jObj.putChar;
		console.log("We found a terminal");
		console.log(term);
		term.write(jObj.data);
		//		term.write(jObj.data);
		//	We need the terminal instance from the div referred to by "term"

	}

	if (jObj.command == 'clientInput') {
		var clientInput = jObj.clientInput;
		var userName = clientInput.userName;
		var userBox = '#' + jObj.terminal + '_UserBox';
		$(userBox).children().each(function() {
			var self = $(this);
			if (self.attr('termUser') == userName) {
				var isGlowing = self.hasClass('glowingUser');
				if (!isGlowing) {
					self.addClass('glowingUser');
				}
				if (this.timer) {
					console.log("this.timer is set");
					clearTimeout(this.timer);
					this.timer = false;
				}
				this.timer = setTimeout(function() {
					self.removeClass("glowingUser");
				}, 500);
				console.log("Self.timer:-------------------\n\n\n\n\n\n\n");
				console.log(this.timer);
				console.log("\n\n\n\n\n\n-------------------");
			}
		});
	}

	if (jObj.command == "userJoin") {
		console.log("Recieved userJoin command for terminal");
		var jObjUserJoin = jObj.userJoin;
		var User = jObjUserJoin.user;
		var Terminal = '#' + jObj.terminal + '_UserBox';
		console.log($(Terminal));
		var msgDiv = "<div class='cUser' termUser='" + User + "'>" + User + "</div>";
		$(Terminal + " .cUser").each(function() {
			if ($(this).attr('termUser') == User) return;
		});
		$(Terminal).append(msgDiv);
	}

	else if (jObj.command == "userLeave") {
		console.log("Received userLeave command");
		jObj = jObj.userLeave;
		var User = jObj.user;
		var Terminal = '#' + jObj.term + '_UserBox';
		//var msgDiv = "<div class='cUser' termUser='" + User + "'>" + User + "</div>";
		$(Terminal).children(".cUser").each(function() {
			if ($(this).attr('termUser') == User) {
				console.log("Found matching user.. calling remove");
				console.log(this);
				console.log($(this));
				$(this).remove();
			}
		});
	}

	else if (jObj.command == "userList") {
		console.log("Recieved userList command for terminal");
		jObj = jObj.userList;
		var userList = jObj.list;
		var Terminal = '#' + jObj.term + '_UserBox';
		for (val of userList) {
			var User = val;
			var msgDiv = "<div class='cUser' termUser='" + User + "'>" + User + "</div>";
			var userExists = false;
			$(Terminal + " div").each(function() {
				if ($(this).attr('termUser') == User) {
					console.log("User already exists in userBox");
					userExists = true;
					return false;
				}
			});
			if (!userExists) $(Terminal).append(msgDiv);
		}

	}
	else if (jObj.command == 'addTerm') {
		var addTerm = jObj.addTerm;
		var node = addTerm.node;
		console.log("Attempting to create_node with new terminal");
		console.log(node);
		console.log($("#jsTreeTerminal").jstree('create_node', 'terminalroot', node, 'last'));
	}

	else if (jObj.command == "setTermTreeJSON") {
		console.log("Entered command processor for setTermTreeJSON");
		var myData = jObj.setTermTreeJSON;
		console.log(myData.termTree);
		//initTermTree($.parseJSON(myData.termTree));
		console.log("Mydata.termTree:");
		console.log(myData.termTree);
		// console.log("Mydata.termTree after JSON Decode:");
		// console.log($.parseJSON(myData.termTree));
		initTermTree((myData.termTree));
	}

}




// $(document).delegate(".cInputBox", "keypress", function(ev) {
// 	var keycode = (ev.keyCode ? ev.keyCode : ev.which);
// 	if (keycode == '13') {
// 		var statusJSON = {
// 			"commandSet": "chat",
// 			"chatCommand": "sendMessage",
// 			"chatTarget": $(this).attr("chatRoom"),
// 			"sendMessage": {
// 				"msg": $(this).val(),
// 			},
// 		};
// 		wsSendMsg(JSON.stringify(statusJSON));
// 		console.log("Sending message to " + $(this).attr("chatRoom"));
// 		$(this).val('');
// 	}
// });

function findTerm(termName) {
	var foundTerminal = false;
	$(".terminalWindow").each(function() {
		if ($(this).attr('terminalId') == termName) {
			foundTerminal = this;
		}
	});
	if (foundTerminal) {
		return (this);
	}
	return false;
}

// function addMessageQueue (hash, newData) {
// 	var tmpData = {};
// 	var d = new Date();
// 	var timeStamp = d.getTime();
// 	if (messageQueue[hash]) {
// 		tmpData = messageQueue[hash].data;
// 	}
// 	else {
// 		messageQueue[hash] = {data: tmpData};
// 		tmpData = messageQueue[hash].data;
// 	}
// 	tmpData[timeStamp] = newData;
// 	messageQueue[hash] = {data: tmpData};
// }
function addMessageQueue(hash, newData, sendData) {
	var d = new Date();
	var timeStamp = d.getTime();

	key = 'recv';
	if (sendData) {
		key = 'send';
	}
	if (!messageQueue[hash]) {
		messageQueue[hash] = {
			'send': {},
			'recv': {}
		};
	}
	if (messageQueue[hash][key][timeStamp]) {
		// alert('This is really bad! Your computer is too fast for our software');
		return (false);
	}

	messageQueue[hash][key][timeStamp] = newData;
}

function removeMessageQueue(hash, options) {
	if (!options) {
		var options = msgQueueDefaultOptions;
	}

	if (options['deleteAll']) {
		delete messageQueue[hash];
		return (true);
	}

	if (options['deleteSent']) {
		messageQueue[hash].send = {};
	}
	if (options['deleteSentAged']) {

	}
	if (options['deleteRecvd']) {
		messageQueue[hash].recv = {};
	}
	if (options['deleteRecvdAged']) {

	}

}

function getMessageQueue(hash, options) {
	var cptr;
	if (!options) {
		var options = msgQueueDefaultOptions;
	}
	console.log(options);
	if (options['getWholeHash']) {
		return (getMessagesByHash(hash, options));
	}
	if (options['getWithinRange']) {
		return (getMessagesFromHashByTime(hash, options));
	}
}

function getMessagesByHash(hash, options) {
	for (var key in messageQueue) {
		if (messageQueue.hasOwnProperty(key)) {
			if (key == hash) {
				return (messageQueue[key]);
			}
		}
	}
	return (false);


}

function getMessagesFromHashByTime(hash, options) {
	var returnObject = {
		'send': {},
		'recv': {}
	};
	var cptr = getMessagesByHash(hash, options);
	var date = new Date();
	var varType = {};
	for (varType in cptr) {
		for (var timeStamp in cptr[varType]) {
			if (cptr[varType].hasOwnProperty(timeStamp)) {
				if (options['getWithinRange'] && ((date - timeStamp <= options['getWithinRange']))) {
					returnObject[varType][timeStamp] = cptr[varType][timeStamp];
				}
			}
		}
	}
	if ((Object.keys(returnObject.send).length < 1) && (Object.keys(returnObject.recv).length < 1)) { //return false if there are no send or receive messages
		return (false);
	}
	return (returnObject);
}

function updateConnectionStatus(options) { //options['speed'] is between 0 and 1. 0 = disconnect, < .6 = bad latency,  > .6 = good latency
	//options['reconnect'] is the number of seconds until next reconnect attempt (0 seconds will display reconnecting msg)
	var connectionSpeed;
	$('#connectionBox').removeClass();
	if (typeof options === 'undefined') { //default to good speed with no options
		connectionSpeed = 1;
	}
	else {

		connectionSpeed = options['speed'];

	}
	if (connectionSpeed == 0) {
		connectionStatus = false; //tell the global variable we're disconnected
		var connectionMsg = 'Disconnected. ';
		if (typeof options['reconnect'] !== 'undefined') {
			connectionMsg = connectionMsg + '<div class="reconnect">Attempting to Reconnect';
			if (options['reconnect'] == 0) {
				connectionMsg = connectionMsg + '...';
			}
 			else if (options['reconnect'] == 1) {
				connectionMsg = connectionMsg + ' in ' + options['reconnect'];
				connectionMsg = connectionMsg + ' Second.</div>';
			}
			else {
				connectionMsg = connectionMsg + ' in ' + options['reconnect'];
				connectionMsg = connectionMsg + ' Seconds.</div>';
			}
		}
		$('#connectionBox').addClass('connectionNone');
		$('#connectionBox').html(connectionMsg);
	}
	else if (connectionSpeed < .6) {
		connectionStatus = true;
		$('#connectionBox').addClass('connectionMed');
		$('#connectionBox').html('Connected...');
	}
	else {
		connectionStatus = true;
		$('#connectionBox').addClass('connectionFast');
		$('#connectionBox').html('Connected.');
	}
}

function disableScreen() {
	var greyDiv = '<div class="disconnectBlock" style="width:100%; height:100%; position:absolute; background-color:rgba(200,200,200,0.7); z-index:9999;"><h1>Disconnected!</h1><h2>Please wait while the server is contacted.</h2></div>';
	$('#editorContainer').prepend(greyDiv);
	var editorSelector;
	$('.ace_editor').each(function() {
		editorSelector = $(this).attr("id");
		editor = ace.edit(editorSelector);
		editor.setOptions({
	    readOnly: true,
	    highlightActiveLine: false,
	    highlightGutterLine: false
		})
		editor.renderer.$cursorLayer.element.style.opacity=0;
	});
}
function enableScreen() {
	$('.disconnectBlock').remove();
	var editorSelector;
	$('.ace_editor').css('background:rgba(200,200,200,0.0)');
	$('.ace_editor').each (function() {
		editorSelector = $(this).attr("id");
		editor = ace.edit(editorSelector);
		editor.setOptions({
	    readOnly: false,
	    highlightActiveLine: true,
	    highlightGutterLine: true
		})
		editor.renderer.$cursorLayer.element.style.opacity=1;
	})
}

//these functions got CANCELLED
// function disableAllEditors() {
// 	var editorSelector;
// var greyDiv;
// 	$('.ace_editor').each(function() {
// 		editorSelector = $(this).attr("id");
// 		editor = ace.edit(editorSelector);
// 		editor.setOptions({
// 	    readOnly: true,
// 	    highlightActiveLine: false,
// 	    highlightGutterLine: false
// 		})
// 		editor.renderer.$cursorLayer.element.style.opacity=0;
// 		//append grey div above this div so no one can interact
// 		greyDiv = '<div class="filegreyblock" style="width:' + $(this).width() + 'px; height:' + $(this).height() + 'px; position:absolute; background-color:rgba(200,200,200,0.7); z-index:9999;"></div>';
// 		$(this).find('.ace_content').prepend(greyDiv);
// 	})
// }
// function enableAllEditors() {
// 	var editorSelector;
// 	$('.ace_editor').css('background:rgba(200,200,200,0.0)');
// 	$('.ace_editor').each (function() {
// 		editorSelector = $(this).attr("id");
// 		editor = ace.edit(editorSelector);
// 		editor.setOptions({
// 	    readOnly: false,
// 	    highlightActiveLine: true,
// 	    highlightGutterLine: true
// 		})
// 		editor.renderer.$cursorLayer.element.style.opacity=1;
// 		$('.filegreyblock').remove();
// 	})

// }

function addConnectedUser(userId, userName, fileName, fileSrcPath, fileType, currentLine, options) { //filetype is file, terminal, chat
																									//options["showLines"] (true|false), options["linesHour"], options["linesDay"], options["linesProj"]
	if (typeof options === 'undefined') {
		var options = userDefaultOptions;
	}
	if (!fileName) { 
		var fileName = 'None';
	}
	if (!fileSrcPath) {
		var fileSrcPath = '';
	}
	if (!fileType) {
		var fileType = '';
	}
	if (typeof currentLine === 'undefined') {
		var currentLine = '-1';
	}
	var userHtml = '<div class="projectUserBox" uid="' + userId + '"><div class="projectUserName"><strong>' + userName + '</strong></div>';
	userHtml = userHtml + '<div class="projectUserStats"><ul><li class="userFileLi"><strong>File:</strong> ';
	
	userHtml = userHtml + '<span class="userFileLink" srcpath="' + fileSrcPath + '" srctype="' + fileType + '" linenumber="' + currentLine + '">';
	
	userHtml = userHtml + fileName;

	userHtml = userHtml + '</span>';
	
	userHtml = userHtml + '</li>';
	if (currentLine >= 0) {
		userHtml = userHtml + '<li class="userCurrentLine"><strong>Line:</strong> ' + currentLine + '</li>';
	}
	if (options['showLines'] == true) { //show their active progress in the file
		userHtml = userHtml + '<li class="userProgressLines"><strong># Lines Added:</strong><ul><li><strong>Hour:</strong> ' + options['linesHour'] + '</li><li><strong>Day:</strong> ' + options['linesDay'] + '</li><li><strong>Project:</strong> ' + options['linesProj'] + '</li></ul></li>';
	}
	userHtml = userHtml + '</ul></div>';
	userHtml = userHtml + '</div>';
	$('#userBar').append(userHtml);
	if (rightBarOpen == 0) {
		rightBarOpen = 1; //open the user bar if there were no users
		resetSizes();
	}
}

function removeConnectedUser(userId) {
	$('[uid="' + userId + '"]').remove();
	if ($('.projectUserBox').length <= 0) { //there are no more users left, minimize the user bar
		rightBarOpen = 0;
		resetSizes();
	}
}

function updateConnectedUser(userId, userName, fileName, fileSrcPath, fileType, currentLine, options) { //filetype is file, terminal, chat
																									//options["showLines"] (true|false), options["linesHour"], options["linesDay"], options["linesProj"]
	var thisUser = $('[uid="' + userId + '"]');
	var userHtml = '';
	if (!fileSrcPath) {
		var fileSrcPath = '';
	}
	if (typeof options === 'undefined') {
		var options = userDefaultOptions;
	}
	if (userName) {
		thisUser.find('.projectUserName').html('<strong>' + userName + '</strong>');
	}
	if (fileName && fileType) { //these must all be sent together
		userHtml = '<strong>File:</strong> ';
		if ((typeof currentLine === 'undefined') || (currentLine < 0)) { //there won't be a current line for terminals or chats
			userHtml = userHtml + '<span class="userFileLink" srcpath="' + fileSrcPath + '" srctype="' + fileType + '" linenumber="-1">';
		}
		else {
			userHtml = userHtml + '<span class="userFileLink" srcpath="' + fileSrcPath + '" srctype="' + fileType + '" linenumber="' + currentLine + '">';
		}
		userHtml = userHtml + fileName;
	
		userHtml = userHtml + '</span>';
		thisUser.find('.userFileLi').html(userHtml);
	}
	
	if (typeof currentLine !== 'undefined') {
		
		if (currentLine >= 0) {
			thisUser.find('.userCurrentLine').html('<strong>Line:</strong> ' + currentLine);
		}
		else {
			thisUser.find('.userCurrentLine').html('');
		}
	}
	if ((fileType == 'chat')) {
		thisUser.find('.userCurrentLine').html('(Chat Room)');
	}
	else if ((fileType == 'terminal')) {
		thisUser.find('.userCurrentLine').html('(Terminal)');
	}
	if (options['showLines'] == true) {
		userHtml = '<strong># Lines Added:</strong><ul><li><strong>Hour:</strong> ' + options['linesHour'] + '</li><li><strong>Day:</strong> ' + options['linesDay'] + '</li><li><strong>Project:</strong> ' + options['linesProj'] + '</li></ul>';
		thisUser.find('.userProgressLines').html(userHtml);
	}
}



///////TEST FUNCTIONS FOLLOW:

// function pausecomp(millis)
//  {
//   var date = new Date();
//   var curDate = null;
//   do { curDate = new Date(); }
//   while(curDate-date < millis);
// }


// $(function() {
// 	addMessageQueue("First", {test1: "hi", test2: "ayo"}, true);
// 	pausecomp(2);
// 	addMessageQueue("Second", {test1: "tssgfs", test2: "ggggg"});
// 	pausecomp(2);
// 	addMessageQueue("First", {test1: "4444", test2: "dfgdfhd"}, false);
// 	pausecomp(2);
// 	addMessageQueue("Second", {test1: "tssgfs", test2: "ggggg"}, true);
// 	pausecomp(2);
// 	addMessageQueue("First", {test1: "5555", test2: "666666"}, true);
// 	console.log(messageQueue);
// 	 var arrayTest = [];
// 	 arrayTest['getWithinRange'] = '99999';
// 	 //arrayTest['getWholeHash'] = '1';
// 	//getMessageQueue('', arrayTest);
// 	console.log(getMessageQueue('First', arrayTest));
// });