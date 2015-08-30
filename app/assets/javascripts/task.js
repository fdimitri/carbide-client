var numtaskBoards = 2;
var taskCount = 0; //use for numbering ids of task items
var taskCellCount = 2; //use for number ids of task cells (tds)

$(document).ready(function() {

    initializeTaskContextMenu();



    $(document).on('click', '.taskEditButton', function() {
        editTask(clickedElementId, clickedElement);
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
    numtaskBoards = numtaskBoards + 1;
    $('#' + tableId).find('tr').each(function() {
        $(this).find('td').eq(-1).after('<td><div class="taskCell taskCellBlack" id="cell' + taskCellCount + '"></div></td>');
        $(this).find('th').eq(-1).after('<th><div class="taskHeaderContainer"><div class="taskHeader">Task Header ' + numtaskBoards + '</div></div></th>');
        taskCellCount++;
    });


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
            toAppend = toAppend + '<td><div class="taskCell taskCellBlack" id="cell' + taskCellCount + '"></div></td>';
            taskCellCount++;
        }
    }
    $('#' + tableId).find('tbody').append('<tr>' + toAppend + '</tr>');
    refreshSortable();
    initializeEditable();
    initializeTaskContextMenu();
}

function createTask(tableId, cellId, taskContent) {
    taskCount++;
    var taskId = "task" + taskCount;
    var task = '<div class="taskItem" id="' + taskId + '"><div class="taskItemContainer"><div class="taskEditButton"></div><div class="taskItemTitle"></div><div class="taskItemContent">' + taskContent + '</div></div></div>';
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

}

function refreshSortable() {
    //  $('#taskSpace').sortable({ 
    //      axis: 'x',
    //     cancel: ".task",

    //  });
    $('.taskTable').sorttable({
        placeholder: 'placeholder',
        helperCells: null,
        items: '>:not(.nosort)',
        update: function(event, ui) {
            console.log(event);
            console.log(ui);
            console.log(ui.item);
            console.log(ui.sender);
        },
    });


    $('.taskCell').sortable({
        connectWith: ".taskCell",
        receive: function(event, ui) {
            // console.log(event);
            // console.log(ui);
            // console.log(ui.item);
            //  console.log(ui.sender);
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


function moveColumn(tableId, columnFrom, columnTo) {
    $('#' + tableId).find('tr').each(function() {
        console.log("tr found")
        $(this).children(":eq(" + (columnTo - 1) + ")").after($(this).children(":eq(" + columnFrom + ")"));
    });

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
        },
        beforeOpen: function(event, ui) {

            $(".taskCell").closest('td').contextmenu("replaceMenu", [{
                    title: '<span class="contextMenuItem">Edit Task</span>',
                    uiIcon: "ui-icon-pencil",
                    cmd: "editTaskItem",

                }, {
                    title: '<span class="contextMenuItem">Create New Task</span>',
                    uiIcon: "ui-icon-clipboard",
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
            if (clickedElement != "taskCell") { //this means there's a specific task selected
                $(".taskCell").closest('td').contextmenu("showEntry", "editTaskItem", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "noCmd", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "changeTaskBG", true);
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
            changeDialogTitle(thisDialog, "Please Enter Your Task Information");
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