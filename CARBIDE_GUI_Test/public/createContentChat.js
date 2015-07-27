$("#%chatTarget%_InputBox").on("keypress", function(ev) {
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