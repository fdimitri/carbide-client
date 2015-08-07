//= require contextMenu
//= require layoutGUI
//= require ./jstree/jstree
//= require userTree
$(document).ready(function() {

function getAllEvents(element) {
    var result = [];
    for (var key in element) {
        if (key.indexOf('on') === 0) {
            result.push(key.slice(2));
        }
    }
    return result.join(' ');
}
    var el = $('table tbody tr td');
    el.bind(getAllEvents(el[0]), function(e) {
        // if (e.type.match(/key/)) {
        //     if (e.toElement.tagName != "TBODY" && e.toElement.tagName != 'TR' && e.toElement.tagName != 'TD') {
        //         return(true);
        //     }
        // }
        // if (e.toElement && (e.type == "click" || e.type == "mouseup")) {
        //     if (e.toElement.tagName != "TBODY" && e.toElement.tagName != 'TR' && e.toElement.tagName != 'TD') {
        //         return(true);
        //     }
        //     console.log(e);
        //     console.log(e.toElement.tagName);
        // }
        // console.log(e);
        // return(true);
    });

    $(document).on("click", '.userLink', function(e) { 
        e.preventDefault();
        e.stopPropagation();
        $('#windows').hide();
        $('#windows').load($(this).attr('href'), function() {
            $('#windows').fadeIn( "slow" );
            $('#windows').trigger('resize');
            $('#windows').find().trigger('resize');
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