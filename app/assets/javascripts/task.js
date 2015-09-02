var taskColumnCount = 2;
var taskCount = 0; //use for numbering ids of task items
var taskCellCount = 2; //use for number ids of task cells (tds)
var taskRowCount = 0;
var taskTableInfo = {};
var defaultTimeZone = "America/New_York";

$(document).ready(function() {

$('.taskEditButton').tooltip();
$('.taskNoteButton').tooltip();

//test functions
  var xdc = 0;
    $(document).on('keydown', function(e) {
	
	
		if (e.altKey && (String.fromCharCode(e.which) === 'w' || String.fromCharCode(e.which) === 'W')) { //ALT keypress
			console.log("keydown acknowledged");
			if (xdc == 0) {
			    moveTaskColumn($(document).find('.taskTable').eq(0).attr("id"),'Scrum_new_TaskSpaceCol_0',2);
			    moveTaskRow($(document).find('.taskTable').eq(0).attr("id"),'Scrum_new_TaskSpaceRow_0',1);
			}
			if (xdc ==1) {
			    moveTaskColumn($(document).find('.taskTable').eq(0).attr("id"),'Scrum_new_TaskSpaceCol_0',3);
			    moveTaskRow($(document).find('.taskTable').eq(0).attr("id"),'Scrum_new_TaskSpaceRow_0',3);
			}
			if (xdc ==2) {
			    moveTaskColumn($(document).find('.taskTable').eq(0).attr("id"),'Scrum_new_TaskSpaceCol_0',1);
			    moveTaskRow($(document).find('.taskTable').eq(0).attr("id"),'Scrum_new_TaskSpaceRow_0',1);
			}
			xdc ++;
		}
		
    });

///////////////////////////////////////*END OF TEST FUNCTIONS*///////////////////////////////////





    initializeTaskContextMenu();



    $(document).on('click', '.taskEditButton', function() {
        editTask(clickedElementId, clickedElement);
    });
    $(document).on('click', '.taskNoteButton', function() {
        if ($(this).closest('.taskItem').find('.taskNoteItem').length == 0) { //there are no task notes. Add one!
            addTaskNote($(this).closest('.taskTable').attr("id"),$(this).closest('.taskItem').attr("id"));
        }
        else if ($(this).hasClass("addTaskNoteButton")) { //this is a special button to add a new task note
            addTaskNote($(this).closest('.taskTable').attr("id"),$(this).closest('.taskItem').attr("id"));
        }
        else if ($(this).closest('.taskItem').find('.taskNotes').is(":visible")) { //if it's visible hide it
            hideTaskNotes($(this).closest('.taskTable').attr("id"),$(this).closest('.taskItem').attr("id"));
        }
        else { //if it's hidden show it
            expandTaskNotes($(this).closest('.taskTable').attr("id"),$(this).closest('.taskItem').attr("id"));
            
        }
    });
    


    //$('.taskHeader').editable('http://www.bogusurlthatdoesntreallyexist/save.php');

    //open the edit task dialog off the side of the screen and let it load the WYSIWYG editor, so it doesn't have to load when someone is trying to use it
    editTask(1, 1);
    $('.ui-dialog[aria-describedby="wysiwyg"]').css("position", "absolute");
    $('.ui-dialog[aria-describedby="wysiwyg"]').css("z-index", "-1");
    $('.ui-dialog[aria-describedby="wysiwyg"]').css("left", "-1000");

    setTimeout(function() {
        $('#wysiwyg').dialog("close");
        $('.ui-dialog[aria-describedby="wysiwyg"]').css("z-index", "700");
        $('.ui-dialog[aria-describedby="wysiwyg"]').css("left", "50");
    }, 6000);
    ///the dialog should now be loaded properly and no one is the wiser///////////////////////////////////////////////////////////////////////////////////


    $('.taskItemContainer').click(function() {

    });
    initializeEditable();
    refreshSortable();


});

function createtaskColumn(tableId) {
    fixTaskWidth(tableId);
    $('#' + tableId).find('tr').each(function() {
        $(this).find('td').eq(-1).after('<td><div class="taskCell taskCellBlack" id="cell' + taskTableInfo[tableId].taskCellCount + '"></div></td>');
        $(this).find('th').eq(-1).after('<th id="'+ tableId +'Col_' + taskTableInfo[tableId].taskColumnCount + '"><div class="taskHeaderContainer"><div class="taskHeader">Task Header ' + (taskTableInfo[tableId].taskColumnCount + 1) + '</div></div></th>');
        taskTableInfo[tableId].taskCellCount ++;
    });
    taskTableInfo[tableId].taskColumnCount ++;


    refreshSortable();
    initializeEditable();
    initializeTaskContextMenu();
    fixTaskWidth(tableId);

}

function createtaskRow(tableId) {

    var numColumns = $('#' + tableId).find('th').length;
    var toAppend = '';
    for (var i = 0; i < numColumns; i++) {
        if (i == 0) { //the first column is just a column title
            var rows = $('#' + tableId).find('tr').length;
            toAppend = '<td class="taskRowLabel"><div class="taskRowHeader">Row ' + rows + ' Label</div></td>';
        }
        else {
            toAppend = toAppend + '<td><div class="taskCell taskCellBlack" id="cell' + taskTableInfo[tableId].taskCellCount + '"></div></td>';
            taskTableInfo[tableId].taskCellCount ++;
        }
    }
    $('#' + tableId).find('tbody').append('<tr id="' + tableId + 'Row_' + taskTableInfo[tableId].taskRowCount + '">' + toAppend + '</tr>');
    taskTableInfo[tableId].taskRowCount ++;
    refreshSortable();
    initializeEditable();
    initializeTaskContextMenu();
}

function createTask(tableId, cellId, taskContent) {
    var taskId = "task" + taskTableInfo[tableId].taskCount;
    var task = '<div class="taskItem taskNone" id="' + taskId + '"><div class="taskEditButton" title="Edit this task"></div><div class="taskItemContainer"><div class="taskItemTitle"></div><div class="taskItemContent">' + taskContent + '</div><div class="taskNoteButton firstTaskNoteButton"><div class="taskNoteNumber" title="Add a note to this task"></div></div></div><div class="taskNotes"></div></div>';
    $('#' + tableId).find('#' + cellId).append(task);
    var loopCop = 0;
    var interval_id = setInterval(function() { //wait for creation of the new task

        if ($('#' + taskId).length != 0) {
            // "exit" the interval loop with clearInterval command
            clearInterval(interval_id);
            editTask(tableId, taskId);
            initializeEditable();
        }
        loopCop++;
        if (loopCop > 1000) { //to prevent an infinite loop we bail after 20,000 milliseconds
            clearInterval(interval_id);
        }
    }, 20);
    taskTableInfo[tableId].taskCount ++;

}

function refreshSortable() {

    $('.taskTable').sorttable({
        placeholder: 'placeholder',
        helperCells: null,
        items: '>:not(.nosort)',
        start: function(event, ui) {
            $(event.target).closest('.taskTable').find('.taskEditButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.addTaskNoteButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.firstTaskNoteButton').css("visibility", "hidden");

        },
        update: function(event, ui) {

            var itemId = ui.item.attr("id");
            var newPosition = $(event.target).closest('.taskTable').find('#' + ui.item.attr("id")).index()

        },
    });

    $(".taskTable").children('tbody').sortable({
        items: "tr",
        cursor: 'move',
        opacity: 0.6,
        start: function(event, ui) {
            $(event.target).closest('.taskTable').find('.taskEditButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.addTaskNoteButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.firstTaskNoteButton').css("visibility", "hidden");


        },
        update: function(event, ui) {
            console.log("update success");
            console.log(event);
            console.log(ui);
            // var order = $(".taskTable").children('tbody').sortable("serialize");
            // console.log(order)
            var itemId = ui.item.attr("id");
            var newPosition = $(event.target).closest('.taskTable').find('#' + itemId).index();
            console.log("We have moved item " + itemId + " to position " + newPosition );
            
            //testing
            // event.preventDefault();
            // setTimeout(function(){ 
            //     moveTaskRow($(event.target).closest('.taskTable').attr("id"),itemId,newPosition);
            // }, 2000);
            
        }
    });
    
    $('.taskCell').sortable({
        connectWith: ".taskCell",
        start: function(event, ui) {
            $(event.target).closest('.taskTable').find('.taskEditButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.addTaskNoteButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.firstTaskNoteButton').css("visibility", "hidden");

            taskTableInfo[$(event.target).closest('.taskTable').attr("id")].taskMoveInProgress = true;

        },
        receive: function(event, ui) {
            // console.log(event);
            // console.log(ui);
            // console.log(ui.item);
            //  console.log(ui.sender);
            taskTableInfo[$(event.target).closest('.taskTable').attr("id")].taskMoveInProgress = false;
            if (ui.sender) {
                console.log("you have moved " + ui.item.attr("id") + " from cell " + ui.sender.eq(0).attr("id") + " to cell " + event.target.id);
                console.log("New position of item " + ui.item.attr("id") + ":");
                var itemPosition = '';
                for (var i = 0; i < $('#' + event.target.id).find('.taskItem').length; i++) {
                    if ($('#' + event.target.id).find('.taskItem').eq(i).attr("id") == ui.item.attr("id")) {
                        itemPosition = i;
                    }

                }
                console.log(itemPosition + " in cell id " + event.target.id);
                refreshSortable();
            }
            //event.preventDefault();

        },
        stop: function(event, ui) {
            taskTableInfo[$(event.target).closest('.taskTable').attr("id")].taskMoveInProgress = false;
            if (event.target.id == ui.item.context.parentNode.id) {
                console.log("you have moved something within cell " + event.target.id);
                console.log("New position of item " + ui.item.attr("id") + ":");
                var itemPosition = '';
                for (var i = 0; i < $('#' + event.target.id).find('.taskItem').length; i++) {
                    if ($('#' + event.target.id).find('.taskItem').eq(i).attr("id") == ui.item.attr("id")) {
                        itemPosition = i;
                    }

                }
                console.log(itemPosition + " in cell id " + event.target.id);

            }
            refreshSortable();
            fixTaskWidth($('#' + event.target.id).closest('.taskTable').attr('id'));
        },
    });
    ///update task cell hover graphic for edit
    $(".taskCell")
        .mouseover(function() {
            if (taskTableInfo[$(this).closest('.taskTable').attr("id")].taskMoveInProgress == false) { //only show edit button if a task isn't being moved
                $(this).find('.taskEditButton').css("visibility", "visible");
                $(this).find('.addTaskNoteButton').css("visibility", "visible");
                $(this).find('.firstTaskNoteButton').css("visibility", "visible");

            }
        })
        .mouseout(function() {
            $(this).find('.taskEditButton').css("visibility", "hidden");
            $(this).find('.addTaskNoteButton').css("visibility", "hidden");
            $(this).find('.firstTaskNoteButton').css("visibility", "hidden");
        });
        
}

function moveTask(taskId, cellId, cellPosition) {
    console.log($('#' + cellId).find('.taskItem').eq(cellPosition - 1).attr("id"))
    if (cellPosition == 0) { //moving it to the top of a list is a special case 
        $('#' + taskId).insertBefore($('#' + cellId).find('.taskItem').eq(0));
    }
    else {
        $('#' + taskId).insertAfter($('#' + cellId).find('.taskItem').eq(cellPosition - 1));
    }
}


function moveTaskColumn(tableId, columnFrom, columnTo) {
    if (columnFrom !== parseInt(columnFrom, 10)) { //column from needs to be converted to an index number if it's a header ID
        columnFrom = $('#' + tableId).find('#' + columnFrom).index();
    }
    console.log("Moving position " + columnFrom + " to position  " + columnTo)
    $('#' + tableId).find('tr').each(function() {
        console.log("tr found")
        console.log("there are " + $(this).children().length + " children on this row")
        console.log("first child type is " + $(this).children().eq(0).prop("tagName"))
        console.log("the item we are moving is " + $(this).children(":eq(" + columnFrom + ")").attr("id"))
        console.log("inner html " + $(this).children(":eq(" + columnFrom + ")").html())
        if (columnFrom < columnTo) { //if we're moving to the right we move to columnTo
            $(this).children('th, td').eq(columnFrom).insertAfter($(this).children('th, td').eq(columnTo));
        }
        else { //otherwise we move to columnTo-1
            $(this).children('th, td').eq(columnFrom).insertAfter($(this).children('th, td').eq(columnTo-1));
        }
        //$(this).children(":eq(" + (columnTo - 1) + ")").after($(this).children(":eq(" + columnFrom + ")"));

    });
    refreshSortable();

}
function moveTaskRow(tableId, rowFrom, rowTo) {
    var positionFrom = $('#' + tableId).children('tbody').find('#' + rowFrom).index();
    if (rowTo == 0) {
        $('#' + tableId).children('tbody').find('#' + rowFrom).insertBefore($('#' + tableId).children('tbody').find('tr').eq(0));
    }
    else if (positionFrom > rowTo) { //if it's moving left we move it after 1 before the destination
        $('#' + tableId).children('tbody').find('#' + rowFrom).insertAfter($('#' + tableId).children('tbody').find('tr').eq(rowTo - 1));
    }
    else { //if it's moving right we move it to the spot after the destination
        $('#' + tableId).children('tbody').find('#' + rowFrom).insertAfter($('#' + tableId).children('tbody').find('tr').eq(rowTo));
    }
    refreshSortable();
}

function initializeTaskContextMenu() {
    $(".taskTable th:not(.nosort)").contextmenu({
        //delegate: ".ui-tabs-panel",
        menu: [

        ],

        select: function(event, ui) {
            if (ui.cmd == "editTaskHeader") {
                $('#' + clickedElementId).find('.taskHeader').eq(clickedTarget).trigger("click");
            }
            else if (ui.cmd == "createTaskColumn") {
                createtaskColumn(clickedElementId);
            }
            else if (ui.cmd == "createTaskRow") {
                createtaskRow(clickedElementId);
            }
            else if (ui.cmd == "deleteTaskColumn") {
                deleteTaskColumn(clickedElementId, clickedTarget);
            }
        },
        beforeOpen: function(event, ui) {

            $(".taskTable th:not(.nosort)").contextmenu("replaceMenu", [{
                    title: '<span class="contextMenuItem">Edit Column Header</span>',
                    uiIcon: "ui-icon-pencil",
                    cmd: "editTaskHeader",

                }, {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Delete Column</span>',
                    uiIcon: "ui-icon-arrowthickstop-1-w",
                    cmd: "deleteTaskColumn",

                }, {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Create New Row</span>',
                    uiIcon: "ui-icon-carat-2-e-w",
                    cmd: "createTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Create New Column</span>',
                    uiIcon: "ui-icon-carat-2-n-s",
                    cmd: "createTaskColumn",

                },

            ]);



        },
    });
    $(".taskRowHeader").closest('td').contextmenu({
        //delegate: ".ui-tabs-panel",
        menu: [

        ],

        select: function(event, ui) {
            if (ui.cmd == "editTaskRowLabel") {
                $('#' + clickedElementId).find('.taskRowHeader').eq(clickedTarget).trigger("click");
            }
            else if (ui.cmd == "createTaskColumn") {
                createtaskColumn(clickedElementId);
            }
            else if (ui.cmd == "createTaskRow") {
                createtaskRow(clickedElementId);
            }
            else if (ui.cmd == "deleteTaskRow") {
                deleteTaskRow(clickedElementId, clickedTarget);
            }

        },
        beforeOpen: function(event, ui) {

            $(".taskRowHeader").closest('td').contextmenu("replaceMenu", [{
                    title: '<span class="contextMenuItem">Edit Row Label</span>',
                    uiIcon: "ui-icon-pencil",
                    cmd: "editTaskRowLabel",

                }, {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Delete Row</span>',
                    uiIcon: "ui-icon-arrowthickstop-1-n",
                    cmd: "deleteTaskRow",

                }, {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Create New Row</span>',
                    uiIcon: "ui-icon-carat-2-e-w",
                    cmd: "createTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Create New Column</span>',
                    uiIcon: "ui-icon-carat-2-n-s",
                    cmd: "createTaskColumn",

                },

            ]);



        },
    });
    $(".taskCell").closest('td').contextmenu({
        //delegate: ".ui-tabs-panel",
        menu: [

        ],

        select: function(event, ui) {
            if (ui.cmd == "createTaskItem") {
                createTask(clickedElementId, clickedTarget, "New Task");
            }
            else if (ui.cmd == "createTaskColumn") {
                createtaskColumn(clickedElementId);
            }
            else if (ui.cmd == "createTaskRow") {
                createtaskRow(clickedElementId);
            }
            else if (ui.cmd == "changeTaskBG") {
                changeTaskBG(clickedElementId, clickedElement, ui.item.data().color);
            }
            else if (ui.cmd == "changeCellColor") {
                changeCellColor(clickedElementId, clickedTarget, ui.item.data().color);
            }
            else if (ui.cmd == "editTaskItem") {
                editTask(clickedElementId, clickedElement);
            }
            else if (ui.cmd == "deleteTaskRow") {
                deleteTaskRow(clickedElementId, clickedTarget);
            }
            else if (ui.cmd == "deleteTaskColumn") {
                deleteTaskColumn(clickedElementId, clickedTarget);
            }
            else if (ui.cmd == "addTaskNote") {
                addTaskNote(clickedElementId, clickedElement);
            }
        },
        beforeOpen: function(event, ui) {

            $(".taskCell").closest('td').contextmenu("replaceMenu", [
                {
                    title: '<span class="contextMenuItem">Edit Task</span>',
                    uiIcon: "ui-icon-pencil",
                    cmd: "editTaskItem",

                },
                {
                    title: '<span class="contextMenuItem">Add Note to Task</span>',
                    uiIcon: "ui-icon-clipboard",
                    cmd: "addTaskNote",

                },
                {
                    title: '<span class="contextMenuItem">Create New Task</span>',
                    uiIcon: "ui-icon-document",
                    cmd: "createTaskItem",

                }, {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Change Task Color...</span>',
                    uiIcon: "ui-icon-script",
                    cmd: "noCmd",
                    children: [{
                        title: '<span class="contextMenuItem">None</span>',
                        cmd: "changeTaskBG",
                        data: {
                            color: "none"
                        },
                    }, {
                        title: '---'
                    }, {
                        title: '<span class="contextMenuItem">Red</span>',
                        cmd: "changeTaskBG",
                        data: {
                            color: "red"
                        },
                    }, {
                        title: '<span class="contextMenuItem">Yellow</span>',
                        cmd: "changeTaskBG",
                        data: {
                            color: "yellow"
                        },
                    }, {
                        title: '<span class="contextMenuItem">Green</span>',
                        cmd: "changeTaskBG",
                        data: {
                            color: "green"
                        },
                    }]
                }, {
                    title: '<span class="contextMenuItem">Change Cell Border Color...</span>',
                    uiIcon: "ui-icon-script",
                    children: [{
                        title: '<span class="contextMenuItem">Black</span>',
                        cmd: "changeCellColor",
                        data: {
                            color: "black"
                        },
                    }, {
                        title: '---'
                    }, {
                        title: '<span class="contextMenuItem">Red</span>',
                        cmd: "changeCellColor",
                        data: {
                            color: "red"
                        },
                    }, {
                        title: '<span class="contextMenuItem">Yellow</span>',
                        cmd: "changeCellColor",
                        data: {
                            color: "yellow"
                        },
                    }, {
                        title: '<span class="contextMenuItem">Green</span>',
                        cmd: "changeCellColor",
                        data: {
                            color: "green"
                        },
                    }]
                },

                {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Delete Row</span>',
                    uiIcon: "ui-icon-arrowthickstop-1-n",
                    cmd: "deleteTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Delete Column</span>',
                    uiIcon: "ui-icon-arrowthickstop-1-w",
                    cmd: "deleteTaskColumn",

                }, {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Create New Row</span>',
                    uiIcon: "ui-icon-carat-2-e-w",
                    cmd: "createTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Create New Column</span>',
                    uiIcon: "ui-icon-carat-2-n-s",
                    cmd: "createTaskColumn",

                },

            ]);
            $(".taskCell").closest('td').contextmenu("showEntry", "editTaskItem", false);
            $(".taskCell").closest('td').contextmenu("showEntry", "noCmd", false);
            $(".taskCell").closest('td').contextmenu("showEntry", "changeTaskBG", false);
            $(".taskCell").closest('td').contextmenu("showEntry", "addTaskNote", false);
            if (clickedElement != "taskCell") { //this means there's a specific task selected
                $(".taskCell").closest('td').contextmenu("showEntry", "editTaskItem", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "noCmd", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "changeTaskBG", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "addTaskNote", true);
            }



        },
    });
}

function initializeEditable() {
    $('.taskHeader').editable(function(value, settings) {

        return (value);
    }, {
        //  type    : 'textarea',
        submit: 'OK',
        tooltip: 'Click to edit...',
    });
    $('.taskRowHeader').editable(function(value, settings) {

        return (value);
    }, {
        //  type    : 'textarea',
        submit: 'OK',
        tooltip: 'Click to edit...',
    });
    //  $('.taskItemContent').editable(function(value, settings) {

    //      return(value);
    //   }, {
    //      type    : 'textarea',
    //      submit  : 'OK',
    //      tooltip   : 'Click to edit...',
    //  });
}

function fixTaskWidth(tableId) { //we have to manually set the width of the table cells because sorttable breaks the width of new cells
    var cells = $('#' + tableId).find('th');
    var numCells = cells.length;
    numCells = numCells - 1; //account for the label column
    var labelColumnWidth = cells.eq(0).width();
    var bordersWidth = parseInt(cells.css("border-left-width"), 10) + parseInt(cells.css("border-right-width"), 10);
    var tableWidth = $('#' + tableId).width() - labelColumnWidth;
    var cellWidth = Math.floor(tableWidth / numCells);
    cellWidth = cellWidth - bordersWidth; //subtract border size from each cell if they have borders
    $('#' + tableId).find('th:not(.nosort)').each(function() {
        var cell = $(this);
        cell.width(cellWidth);
    });
}

function changeTaskBG(tableId, taskId, color) {
    //first remove all classes
    console.log("called with " + tableId + " " + taskId + " " + color)
    var thisTask = $('#' + tableId).find('#' + taskId);
    thisTask.removeClass('taskNone');
    thisTask.removeClass('taskGreen');
    thisTask.removeClass('taskYellow');
    thisTask.removeClass('taskRed');
    //add the correct class
    if (color == "none") {
        thisTask.addClass('taskNone');
    }
    else if (color == "red") {
        thisTask.addClass('taskRed');
    }
    else if (color == "yellow") {
        thisTask.addClass('taskYellow');
    }
    else if (color == "green") {
        thisTask.addClass('taskGreen');
    }
}

function changeCellColor(tableId, cellId, color) {
    //first remove all classes
    var thisCell = $('#' + tableId).find('#' + cellId);
    thisCell.removeClass('taskCellBlack');
    thisCell.removeClass('taskCellGreen');
    thisCell.removeClass('taskCellYellow');
    thisCell.removeClass('taskCellRed');
    //add the correct class
    if (color == "black") {
        thisCell.addClass('taskCellBlack');
    }
    else if (color == "red") {
        thisCell.addClass('taskCellRed');
    }
    else if (color == "yellow") {
        thisCell.addClass('taskCellYellow');
    }
    else if (color == "green") {
        thisCell.addClass('taskCellGreen');
    }
}

function editTask(tableId, taskId) {

    var thisDialog = "wysiwyg";
    $("#" + thisDialog).dialog({
        height: 470,
        width: 495,
        modal: false,
        open: function() {
            changeDialogTitle(thisDialog, "Create/Edit Task");
            addDialogQuestion(thisDialog, "<br/>Task Title (Optional):", "taskTitle", "taskTitle");
            addDialogInfo(thisDialog, "<p>Task Content:</p> ");
            $('#taskTitle').focus();
            taskLoadText(tableId, taskId);
        },
        beforeClose: function(event, ui) {
            removeDialogQuestion(thisDialog);
            removeDialogInfo(thisDialog);
        },

        buttons: {
            "Submit Task": function() {
                if ($('#wysiwyg').find('#taskTitle').val()) {
                    taskAddTitle(tableId, taskId, $('#wysiwyg').find('#taskTitle').val());
                }
                else {

                    taskRemoveTitle(tableId, taskId);
                }
                taskAddText(tableId, taskId, $('#wysiwygText').val());
                $(this).dialog("close");


            },
            Cancel: function() {
                $(this).dialog("close");
                removeDialogQuestion(thisDialog);
                removeDialogInfo(thisDialog);


            },

        }
    });
    $('#wysiwygText').tinymce({
        plugins: [
            "code",
            "link",
            "textcolor",
        ],
        menubar: false,
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | forecolor backcolor | code",
    });
}

function taskLoadText(tableId, taskId) {
    var insideHtml = $('#' + tableId).find('#' + taskId).find('.taskItemContent').html();
    $('#wysiwygText').val(insideHtml);
    var insideText = $('#' + tableId).find('#' + taskId).find('.taskItemTitle').text();
    console.log("attempting to add " + insideText + " to an element:");
    console.log($('#wysiwyg').find('#taskTitle'))
    $('#wysiwyg').find('#taskTitle').val(insideText);
}

function taskAddText(tableId, taskId, addText) {
    $('#' + tableId).find('#' + taskId).find('.taskItemContent').html(addText);
}

function taskAddTitle(tableId, taskId, addTitle) {
    var thisTitle = "<strong>" + addTitle + "</strong><hr/>";
    $('#' + tableId).find('#' + taskId).find('.taskItemTitle').html(thisTitle);
}

function taskRemoveTitle(tableId, taskId) {
    $('#' + tableId).find('#' + taskId).find('.taskItemTitle').empty();
}

function deleteTaskRow(tableId, cellId) {
    if (cellId === parseInt(cellId, 10)) { //if cell is an integer it is the index of the row (skipping the header row)
        $('#' + tableId).find('tr').eq(cellId + 1).remove();
    }
    else {
        $('#' + tableId).find('#' + cellId).closest("tr").remove();
    }
    refreshSortable();

}

function deleteTaskColumn(tableId, cellId) {
    console.log("deleting column in table " + tableId + " from id " + cellId);
    var theseCells = $('#' + tableId).find('#' + cellId).closest("tr").find("td"); //all the tds in the current row
    var thisCell = $('#' + tableId).find('#' + cellId).closest("td"); //this td
    var colNum = parseInt(theseCells.index(thisCell), 10); //the index of this td in the current row.
    console.log("it is column number " + colNum)

    //get the width of the row label column so it can be reset after the delete:
    var labelWidth = $('#' + tableId).find("th").eq(0).width();

    $('#' + tableId).find("th").eq(colNum).remove();
    $('#' + tableId).find("tr").each(function() {
        $(this).find("td").eq(colNum).remove();
    });
    refreshSortable();
    $('#' + tableId).find("th").eq(0).width(labelWidth); //restore the original label width
    fixTaskWidth(tableId);
    $('#' + tableId).find("th").eq(0).removeAttr('width');
    $('#' + tableId).find("th").eq(0).width("auto");
}

function editTaskNote(tableId, taskId, noteIndex) {
    var thisDialog = "wysiwyg";
    $("#" + thisDialog).dialog({
        height: 470,
        width: 495,
        modal: false,
        open: function() {
            changeDialogTitle(thisDialog, "New Task Note");
            addDialogInfo(thisDialog, "<p>Task Note:</p> ");
            taskLoadNote(tableId, taskId, noteIndex);
            setTimeout(function(){  //bring focus to the text editor
                tinyMCE.activeEditor.focus();
            }, 300);
        },
        beforeClose: function(event, ui) {
            removeDialogInfo(thisDialog);
        },

        buttons: {
            "Submit Note": function() {
               
                taskNoteUpdate(tableId, taskId, noteIndex, $('#wysiwygText').val());
                $(this).dialog("close");


            },
            Cancel: function() {
                $(this).dialog("close");
                removeDialogInfo(thisDialog);
                deleteTaskNote(tableId,taskId,noteIndex);


            },

        }
    });
    $('#wysiwygText').tinymce({
        plugins: [
            "code",
            "link",
            "textcolor",
        ],
        menubar: false,
        toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | forecolor backcolor | code",
    });
}
function taskLoadNote(tableId, taskId, noteIndex) {
    var insideHtml = $('#' + tableId).find('#' + taskId).find('.taskNoteItem').eq(noteIndex).find('.taskNoteText').html();
    $('#wysiwygText').val(insideHtml);
}
function taskNoteUpdate(tableId, taskId, noteIndex, noteContent) {
    console.log("updating note index " + noteIndex + " with " + noteContent)
    $('#' + tableId).find('#' + taskId).find('.taskNoteItem').eq(noteIndex).find('.taskNoteText').html(noteContent);
    
    //if this is the first task note we will also insert an add task button
    if ($('#' + tableId).find('#' + taskId).find('.taskNoteItem').length == 1) {
        var taskAddButton = '<div class="taskNoteButton addTaskNoteButton"><div class="taskNoteNumber" title="Add a new note to this task"></div></div>';
         $('#' + tableId).find('#' + taskId).find('.taskNotes').append(taskAddButton);
    }
}
function addTaskNote(tableId,taskId) {
    var thisDate = new Date();
    var dateOptions = {
        timeZone: defaultTimeZone, weekday: "long", year: "numeric", month: "short",
        day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    var formatDate = thisDate.toLocaleTimeString("en-us", dateOptions);
    var userName = "George W. Bush";
    $('#' + tableId).find('#' + taskId).find('.taskNotes').append('<div class="taskNoteItem"><div class="taskNoteHeader"><div class="taskNoteDate">' + formatDate + '</div><div class="taskNoteUser">' + userName + '</div></div><div class="taskNoteBody"><div class="taskNoteText"></div></div></div>');
    var noteCount = $('#' + tableId).find('#' + taskId).find('.taskNoteItem').length;
    $('#' + tableId).find('#' + taskId).find('.taskNoteNumber').eq(0).text(noteCount);
    $('#' + tableId).find('#' + taskId).find('.taskNoteButton').eq(0).removeClass("firstTaskNoteButton");
    editTaskNote(tableId,taskId,noteCount - 1);
    expandTaskNotes(tableId,taskId);
}
function deleteTaskNote(tableId,taskId,noteIndex){
    $('#' + tableId).find('#' + taskId).find('.taskNoteItem').eq(noteIndex).remove();
}
function expandTaskNotes(tableId,taskId) {
    console.log("expansion");
    $('#' + tableId).find('#' + taskId).find('.taskNotes').css('display', 'block');
    $('#' + tableId).find('#' + taskId).find('.taskNoteNumber').eq(0).attr('title', 'Hide this task\'s notes');
    $('#' + tableId).find('#' + taskId).find('.taskNoteNumber').eq(0).text('-');
    $('#' + tableId).find('#' + taskId).find('.taskNoteButton').eq(0).css("visibility", "visible");

}
function hideTaskNotes(tableId,taskId) {
    console.log("subtraction")
    $('#' + tableId).find('#' + taskId).find('.taskNotes').css('display', 'none');
    $('#' + tableId).find('#' + taskId).find('.taskNoteNumber').eq(0).attr('title', 'Show this task\'s notes');
    var noteCount = $('#' + tableId).find('#' + taskId).find('.taskNoteItem').length;
    $('#' + tableId).find('#' + taskId).find('.taskNoteNumber').eq(0).text(noteCount);
    $('#' + tableId).find('#' + taskId).find('.taskNoteButton').eq(0).css("visibility", "visible");

}