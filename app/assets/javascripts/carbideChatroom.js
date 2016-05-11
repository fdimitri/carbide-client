/* 
global wsRegisterCallbackForHash
global wsSendMsg
global hex_md5
global newTab
*/
/*

*/

var testObj135908 = {
	"commandSet":"base",
	"chatCommand":"createChatRoom",
	"hash":"2e5d956aaf8cb6b5aaa22b665bc0e6ad",
	"requestCommand": {
		"chatRoomName":"test1"
		
	},
	"command":"createChatRoom"
}
function sendChatRequest(requestCommand, serverData, callBack) {
    var hashKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + requestCommand); 
    var eMsg = {
		"commandSet": "chat",
		"chatCommand": requestCommand,
		"hash": hashKey,
	};
	eMsg[requestCommand] = serverData;
	if (requestCommand == "createChatRoom") {
		eMsg.commandSet = "base";
		eMsg.command = requestCommand;
	}
	wsSendMsg(JSON.stringify(eMsg));
	wsRegisterCallbackForHash(hashKey, callBack)
}

function createChatRoom(hashKey, event, msg) { //once the server has created a chatroom we will process it in the file tree and open it if requested
        if (event == 'send') {
            return;
        }
        if (msg['status'] == false) {
        	console.log(msg['errorReasons']);
        	return(false);
        }
        var createChatRoom = msg['createChatRoom'];
        console.log(msg)
        console.log("CREATE CHAT ROOM?");
        console.log(createChatRoom)
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
			}, 100);
}