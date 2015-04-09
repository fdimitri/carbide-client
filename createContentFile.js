$("#%paneId%").on('resize', function() {
    console.log("Pane has been resized");
    $(this).find('pre').each(function() {
        console.log("AceEditor pre container resize triggered");
        var editor = getAceEditorByName($(this).attr('srcpath'));
        editor.resize(true);
    });
});

