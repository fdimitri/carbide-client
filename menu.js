$(document).ready(function() {
    $(".arrangePane").click(function() {
        arrangePanes($(this).attr('panes'));
    });
    
    $("#window_newPane").click(function() {
        createNewPane();
    });
    // $("#window_singlePane").click(function() {
    //     arrangePanes("1");
    // });
    // $("#window_twoPaneHorizontal").click(function() {
    //     arrangePanes("2a");
    // });
    // $("#window_twoPaneVertical").click(function() {
    //     arrangePanes("2b");
    // });
    // $("#window_threePane").click(function() {
    //     arrangePanes("3");
    // });
    // $("#window_threePaneBigLeft").click(function() {
    //     arrangePanes("3a");
    // });
    // $("#window_threePaneBigRight").click(function() {
    //     arrangePanes("3b");
    // });
    // $("#window_fourPane").click(function() {
    //     arrangePanes("4");
    // });
    // $("#window_fivePane").click(function() {
    //     arrangePanes("5");
    // });
});
