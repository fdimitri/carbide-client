	var statusJSON = {
		"commandSet": "FileTree",
		"command": "renameFile",
		"key" : randomKey,
		"renameFile" : {
			"oldName" : oldName,
			"newName" : newName,
		},
	};
	wsSendMsg(JSON.stringify(statusJSON));

	while (!getMsg(key)) {
		setTimeout(function() { console.log('Waiting for reply')}, 100); // wait 10ms for the connection...
    }	
	var result = getMsg(key);
	if (result['status'] == TRUE) {
		// Successful, put a "file renamed!" in the modal, let the user close it
	}
	else {
		// Failed, tell the fail reason
		// Append result['failReason'] to a div in the modal (same place you put file renamed!"
		// Let the user put in a new file name and try again
	}

