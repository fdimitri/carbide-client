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

function cliMsgProcDocument(jObj) {
	if (jObj.command == 'insertDataSingleLine') {
		jObj = jObj.insertDataSingleLine;
		var inputData = jObj.data;
		var lineData = jObj.line;
		var chData = jObj.char;

		console.log("Calling replaceRange with ");
		$('.CodeMirror').each(function() {
			if (lineData > this.CodeMirror.lineCount()) {
				console.log("We need more lines!");
				var x = this.CodeMirror.lineCount;
				while (x <= lineData) {
					this.CodeMirror.replaceRange('\n', {
						line: x,
						ch: this.CodeMirror.getLine(x).length
					});
					x++;
				}
			}
			this.CodeMirror.replaceRange(inputData, {
				line: lineData,
				ch: chData
			});
		});
	}
	if (jObj.command == 'deleteDataSingleLine') {
		jObj = jObj.deleteDataSingleLine;
		var inputData = jObj.data;
		var lineData = jObj.line;
		var chData = jObj.char;
		var delLength = jObj.length;
		console.log("Calling replaceRange with ");
		$('.CodeMirror').each(function() {
			this.CodeMirror.replaceRange('', {
				line: lineData,
				ch: chData
			}, {
				line: lineData,
				ch: (chData + delLength)
			});
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
	console.log("Delegate keypress!");
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
		console.log(ws);
		console.log("Pressed enter, we should send something over the non-existent websocket for this");
		console.log("Origin was " + $(this).attr("chatRoom") + " I think");
		$(this).val('');
	}
});
