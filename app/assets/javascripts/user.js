//= require contextMenu
//= require layoutGUI
//= require ./jstree/jstree
//= require userTree

$(document).ready(function() {
    $(document).on("click", '.userLink', function(e) { 
        e.preventDefault();
        e.stopPropagation();
        $('#windows').load($(this).attr('href'), function() {
            $('#windows').children().fadeIn();
        });
    });
    $.ajax({
        url: "/create_gui_content/createUserSidebarContent.json",
        type: 'post',
        data: {
            'tabType': 'ProjectTree',
        },
        datatype: 'json',
        success: function(data) {
            var result = $.parseJSON(data);
            result = result.reply;
            if (result.success === false) {
                console.log(result['failReasons']);
                return false;
            }
            if (result.html) {
                // We don't return any HTML for this one
            }
            if (result.script) {
                eval(result.script);
            }
            if (result.jsonData) {
                var jsonData = result.jsonData;
                initProjectTree(jsonData.treeData);
            }
        },
        error: function(data, error, xqhr) {
            console.log("Error getting ProjectTree Data: ");
            console.log(data);
            console.log(error);
            console.log(xqhr);
            console.log("End: Error getting ProjectTree Data");
            return false;
        },
    });

});