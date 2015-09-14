function sendChatRequest(requestCommand, serverData, callBack) {
    var hashKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + requestCommand); 
    var eMsg = {
		"commandSet": "chat",
		"chatCommand": requestCommand,
		"hash": hashKey,
	    requestCommand : serverData,
	};
	if (requestCommand == "createChatRoom") {
		eMsg.commandSet = "base";
	}
	wsSendMsg(JSON.stringify(eMsg));
	wsRegisterCallbackForHash(hashKey, callBack)
}
function createChatRoom(hashKey, msg, event) { //once the server has created a chatroom we will process it in the file tree and open it if requested
        if (event == 'send') {
            return;
        }
        var createChatRoom = msg['createChatRoom'];
        var chatRoomName = createChatRoom['chatRoomName'];
        var windowPane = createChatRoom['windowPane'];
       
        if ((windowPane) && (typeof windowPane !== 'undefined'))   { //there is a window pane request
            
            var tabBarId =  $('#' + windowPane).find(".tabBar").attr("id");
            
            var fileName = chatRoomName;
            var tabBarId = tabBarId;
            var originId = 'unknown';
            var srcPath = chatRoomName;
			newTab(fileName, tabBarId, originId, 'chat', srcPath);
            
        }
        
        
         //open the chat branch of the jstree
			var nodeRef = $('#jsTreeChat').jstree(true);
			nodeRef.deselect_all(true); //deselect nodes
			var thisNode = nodeRef.get_node('chatroot');

			nodeRef.open_node(thisNode);
		//select the new node
			var interval_id = setInterval(function(){
			     // $("li#"+id).length will be zero until the node is loaded
			     if($("li#"+chatRoomName).length != 0){
			         // "exit" the interval loop with clearInterval command
			         clearInterval(interval_id);
			         var thisNode = nodeRef.get_node(chatRoomName);
					nodeRef.select_node(thisNode);
					var thisElement = document.getElementById(chatRoomName);
					$('#tabs-2').scrollTop( thisElement.offsetTop - 20 );
			      }
			}, 10);
}