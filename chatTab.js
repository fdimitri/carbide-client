$(".cContainer").on("resize", function() {
    
});


    function resizeChat(element) {
    			if( $(element).find(".cContainer").length) {

				

				newHeight = $(element).find(".cContainer").height() - $(element).find(".cInputBoxContainer").height();
				$(element).find(".cOutputs").css("height", newHeight);

			}
    }
    
