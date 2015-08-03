var oldTheme = '';

$(document).ready(function() {

    
    var themelist = require("ace/ext/themelist");
	var aceThemes = themelist.themesByName; //object hash of theme objects by name
	var lightMenu = $('#lightSubMenu');
	var darkMenu = $('#darkSubMenu');
	for (var key in aceThemes) {
	  if (aceThemes.hasOwnProperty(key)) {
	    var thisHtml = '<li class="themeEntry" theme="' + aceThemes[key].theme +'"><a href="#"><span>' + aceThemes[key].caption;
		thisHtml = thisHtml + '</span></a></li>';
	    if (aceThemes[key].isDark == false) {
	    	lightMenu.append(thisHtml);
	    }
	    else {
	    	darkMenu.append(thisHtml);
	    }
	    
	  }
	}
	
	
	$('.themeEntry').mouseover(function() {
		//SAVE OLD THEME HERE
		oldTheme = getAceEditorTheme();
		var selectedTheme = $(this).attr("theme");
		setAceEditorTheme(selectedTheme);
	});
	$('.themeEntry').mouseout(function() {
		setAceEditorTheme(oldTheme);
		console.log("RESTORED TO " + oldTheme);
	});
	$('.themeEntry').click(function(event) {	
		var selectedTheme = $(this).attr("theme");
		setAceEditorTheme(selectedTheme);
		currentTheme = selectedTheme;
		oldTheme = currentTheme;
		//$('#themesMenu').hide();

	});
	
});