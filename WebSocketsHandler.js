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


function getAceEditorByName(name) {
    var aceEditors = $('.ace_editor');
    console.log("getAceEditorByName(" + name + ")");
    var rval = false;
    aceEditors.each(function() {
       if ($(this).attr('srcpath') == name) {
           console.log("Found editor for " + name);
           rval = ace.edit(this);
           return(false);
       }
    });
    return(rval);
}

function cliMsgProcDocument(jObj) {
    var editor = getAceEditorByName(jObj.targetDocument);
    if (editor == false) {
    	console.log("Unable to find editor, ignoring message");
    	return(false);
    }
    console.log("cliMsgProcDocument finding editor:");
    console.log(editor);
    $(editor).attr('ignore', 'TRUE')
	if (jObj.command == 'insertDataSingleLine') {
		jObj = jObj.insertDataSingleLine;
        var Range = require("ace/range").Range;		
		var inputData = jObj.data;
		var lineData = jObj.line;
		var chData = jObj.char;
		var targetDocument = jObj.document;
		var r;
		r = new Range(lineData, chData, lineData, chData + inputData.length);
		editor.getSession().replace(r, inputData);
	}
	else if (jObj.command == 'deleteDataSingleLine') {
		console.log("Enter deleteDataSingleLine")
		jObj = jObj.deleteDataSingleLine;
		var inputData = jObj.data;
		var lineData = jObj.line;
		var chData = jObj.char;
		var delLength = jObj.length;
		var targetDocument = jObj.document;
		var Range = require("ace/range").Range;	
		r = new Range(lineData, chData, lineData, chData + inputData.length - 1);
		console.log("Calling getSession.remove range");
		editor.getSession().remove(r);
	}

	if (jObj.command == 'insertDataMultiLine') {
	    jObj = jObj.insertDataMultiLine;
	    console.log(jObj);
		var targetDocument = jObj.document;
		var r, curLine, prevLine, p;
		var Range = require("ace/range").Range;	
		curLine = jObj.startLine;
		jObj.data.forEach(function(entry) {
		    console.log("jobj.data.each inserting at " + curLine);
            r = new Range(curLine, 0, curLine, entry.length + 1);
		    editor.getSession().replace(r, entry + '\n');
		    curLine += 1;
		});
	}
	if (jObj.command == 'deleteDataMultiLine') {
		jObj = jObj.deleteDataSingleLine;
		var targetDocument = jObj.document;
	}
	if (jObj.command == 'documentSetContents') {
	    var dsc = jObj.documentSetContents;
	    editor.setValue(dsc.data, -1);
	}
    $(editor).attr('ignore', 'FALSE');
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
		$(Channel).animate({ scrollTop: $(Channel)[0].scrollHeight}, 333);
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
