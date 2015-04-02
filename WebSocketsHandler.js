var ws = new WebSocket("ws://172.17.0.42:8080/");
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
function getCodeMirror(target) {
	var cm;
	$('.CodeMirror').each(function() {
		if (this.CodeMirror.getOption('srcPath') == target) {
			console.log("Found codemirror match")
			cm = this.CodeMirror;
		}
		else {
			console.log("Comparison failed: " + this.CodeMirror.getOption('srcPath') + " != " + target)
		}
	});
	if (!cm) {
		console.log("getCodeMirror unable to find instance related to " + target);
		return;
	}
	console.log("Returning CodeMirror instance")
	return(cm);
}
function cliMsgProcDocument(jObj) {
	if (jObj.command == 'insertDataSingleLine') {
		jObj = jObj.insertDataSingleLine;
		var inputData = jObj.data;
		var lineData = jObj.line;
		var chData = jObj.char;
		var targetDocument = jObj.document;
		var cm = getCodeMirror(targetDocument);
		if (!cm) {
			console.log("Unable to find codeMirror instance incliMsgProcDocument");
			return false;
		}
		if (lineData > cm.lineCount()) {
			console.log("We need more lines!");
			var x = cm.lineCount;
			while (x <= lineData) {
				cm.replaceRange('\n', {
					line: x,
					ch: cm.getLine(x).length
				});
				x++;
			}
		}
		cm.replaceRange(inputData, {
			line: lineData,
			ch: chData
		});
	}
	if (jObj.command == 'deleteDataSingleLine') {
		jObj = jObj.deleteDataSingleLine;
		var inputData = jObj.data;
		var lineData = jObj.line;
		var chData = jObj.char;
		var delLength = jObj.length;
		var targetDocument = jObj.document;
		var cm = getCodeMirror(targetDocument);
		if (!cm) {
			console.log("Unable to find codeMirror instance in cliMsgProcDocument");
			return false;
		}
		
		console.log("Calling replaceRange with ");
		cm.replaceRange('', {
			line: lineData,
			ch: chData
		}, {	
			line: lineData,
			ch: (chData + delLength)
		});
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
		console.log("Attempting to update div with ID via append: " + Channel);
		console.log("Whether or not jQuery found the div? You tell me. " + $(Channel));
		$(Channel).append(msgDiv);
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

$(document).delegate(".cInputBox", "keypress", function(ev) {
	var keycode = (ev.keyCode ? ev.keyCode : ev.which);
	if (keycode == '13') {
		var statusJSON = {
			"commandSet": "chat",
			"chatCommand": "sendMessage",
			"chatTarget": $(this).attr("chatRoom"),
			"sendMessage": {
				"msg": $(this).val(),
			},
		};
		wsSendMsg(JSON.stringify(statusJSON));
		console.log("Sending message to " + $(this).attr("chatRoom"));
		$(this).val('');
	}
});
