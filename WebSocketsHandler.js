var ws = new WebSocket("ws://frank-d.info:8080/");
ws.onmessage = function(evt) {
	console.log("onmessage fired: " + evt);
	console.log($.parseJSON(evt.data));
	var jObj = $.parseJSON(evt.data);
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

function wsSendMsg(msg) {
	waitForSocketConnection(ws, function() {
		console.log("Sent msg to server over websocket: " + msg)
		ws.send(msg);
	});
}

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

function cliMsgProcTerminal(jObjo) {
	var term = getTerminalByName(jObjo.terminal);
	if (jObjo.command == 'putChar') {
		var jObj = jObjo.putChar;
		console.log("We found a terminal");
		console.log(term);
		term.write(jObj.data);
//		term.write(jObj.data);
//	We need the terminal instance from the div referred to by "term"

	}

}

function getMsg(key) {
	return(TRUE);
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
		if ($(Channel)[0].scrollHeight) {
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

}
ws.onclose = function() {
	console.log("Websocket was closed..");
	console.log(ws);
};
ws.onopen = function() {
	console.log("Websocket now open!");
	console.log(ws);
};

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
		return(this);
	}
}


