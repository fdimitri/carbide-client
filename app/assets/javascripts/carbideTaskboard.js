/* 
global wsRegisterCallbackForHash
global wsSendMsg
global hex_md5
global newTab
*/
var timeOutWait = 1000;
var taskColumnCount = 2;
var taskCount = 0; //use for numbering ids of task items
var taskCellCount = 2; //use for number ids of task cells (tds)
var taskRowCount = 0;
var taskTableInfo = {};
var defaultTimeZone = "America/New_York";
var taskLastColor = '#FFFFFF';
var cellLastColor = '#000000';
var oldPosition = '';

$(document).ready(function() {

$('.taskEditButton').tooltip();
$('.taskNoteButton').tooltip();

//test functions
  var xdc = 0;
    $(document).on('keydown', function(e) {
	
	
		if (e.altKey && (String.fromCharCode(e.which) === 'w' || String.fromCharCode(e.which) === 'W')) { //ALT keypress
			console.log("keydown acknowledged");
			if (xdc == 0) {
			    moveTaskColumn($(document).find('.taskTable').eq(0).attr("id"),'TaskBoard_new_TaskSpaceCol_0',2);
			    moveTaskRow($(document).find('.taskTable').eq(0).attr("id"),'TaskBoard_new_TaskSpaceRow_0',1);
			}
			if (xdc ==1) {
			    moveTaskColumn($(document).find('.taskTable').eq(0).attr("id"),'TaskBoard_new_TaskSpaceCol_0',3);
			    moveTaskRow($(document).find('.taskTable').eq(0).attr("id"),'TaskBoard_new_TaskSpaceRow_0',3);
			}
			if (xdc ==2) {
			    moveTaskColumn($(document).find('.taskTable').eq(0).attr("id"),'TaskBoard_new_TaskSpaceCol_0',1);
			    moveTaskRow($(document).find('.taskTable').eq(0).attr("id"),'TaskBoard_new_TaskSpaceRow_0',1);
			}
			xdc ++;
		}
		
		if (e.altKey && (String.fromCharCode(e.which) === 'e' || String.fromCharCode(e.which) === 'E')) { //ALT keypress
		    sendTaskRequest('createTaskColumn', {"tableId":"table01", "insert":"target01"}, createTaskColumn);
		}
    });

///////////////////////////////////////*END OF TEST FUNCTIONS*///////////////////////////////////





    initializeTaskContextMenu();



    $(document).on('click', '.taskEditButton', function() {
        editTask(clickedElementId, clickedElement);
    });
    $(document).on('click', '.taskNewButton', function() {
        sendTaskRequest('createTask',{"tableId": clickedElementId, "cellId": clickedTarget, "taskContent":"<p>New Task</p>"},createTask);
        //createTask(clickedElementId, clickedTarget, "<p>New Task</p>");
    });
    $(document).on('click', '.taskAddRowButton', function() {
        sendTaskRequest('createTaskRow',{"tableId": clickedElementId, "insert": false},createTaskRow);
        //createTaskRow(clickedElementId, false);
    });
    $(document).on('click', '.taskAddColumnButton', function() {
        sendTaskRequest('createTaskColumn',{"tableId": clickedElementId, "insert": false},createTaskColumn);
        //createTaskColumn(clickedElementId,false);
    });
    $(document).on('click', '.taskNoteButton', function() {
        var thisTask = $(this).closest('.taskItem');
        if (thisTask.find('.taskNoteItem').length == 0) { //there are no task notes. Add one!
            //var newNoteIndex = addTaskNote($(this).closest('.taskTable').attr("id"),$(this).closest('.taskItem').attr("id"));
            
            var newNoteIndex = thisTask.find('.taskNoteItem').length;
            sendTaskRequest('addTaskNote',{"tableId": $(this).closest('.taskTable').attr("id"), "taskId": thisTask.attr("id")},addTaskNote);
           
            console.log("looking for " + newNoteIndex)
            var loopCop = 0;
            var interval_id = setInterval(function(){ 
                if (thisTask.find('.taskNoteItem').length > newNoteIndex){
				         // "exit" the interval loop with clearInterval command
				         clearInterval(interval_id);
				         editTaskNote(thisTask.closest('.taskTable').attr("id"),thisTask.attr("id"),newNoteIndex);
                }
                loopCop ++;
                if (loopCop > timeOutWait) { //error out
                    clearInterval(interval_id);
                }
			}, 100);
            // editTaskNote($(this).closest('.taskTable').attr("id"),$(this).closest('.taskItem').attr("id"),newNoteIndex);
        }
        else if ($(this).hasClass("addTaskNoteButton")) { //this is a special button to add a new task note
            var newNoteIndex = addTaskNote(thisTask.closest('.taskTable').attr("id"),thisTask.attr("id"));
            editTaskNote(thisTask.closest('.taskTable').attr("id"),thisTask.attr("id"),newNoteIndex);
        }
        else if (thisTask.find('.taskNotes').is(":visible")) { //if it's visible hide it
            hideTaskNotes(thisTask.closest('.taskTable').attr("id"),thisTask.attr("id"));
        }
        else { //if it's hidden show it
            expandTaskNotes(thisTask.closest('.taskTable').attr("id"),thisTask.attr("id"));
            
        }
    });
    

    $(document).on("focusout",".taskHeader form",function(e){

        $(e.target).submit();

    });
    $(document).on("focusout",".taskRowLabel form",function(e){

        $(e.target).submit();

    });
   
    //$('.taskHeader').editable('http://www.bogusurlthatdoesntreallyexist/save.php');

    //open the edit task dialog off the side of the screen and let it load the WYSIWYG editor, so it doesn't have to load when someone is trying to use it
    // editTask(1, 1);
    // $('.ui-dialog[aria-describedby="wysiwyg"]').css("position", "absolute");
    // $('.ui-dialog[aria-describedby="wysiwyg"]').css("z-index", "-1");
    // $('.ui-dialog[aria-describedby="wysiwyg"]').css("left", "-1000");

    // setTimeout(function() {
    //     $('#wysiwyg').dialog("close");
    //     $('.ui-dialog[aria-describedby="wysiwyg"]').css("z-index", "700");
    //     $('.ui-dialog[aria-describedby="wysiwyg"]').css("left", "50");
    // }, 6000);
    ///the dialog should now be loaded properly and no one is the wiser///////////////////////////////////////////////////////////////////////////////////


    $('.taskItemContainer').click(function() {

    });
    initializeEditable();
    refreshSortable();


});

function getCreateTaskButton () {
    return('<div class="taskNewButton" title="Create a New Task"><div class="taskNewButtonText">+ New Task</div><div class="taskNewButtonIcon"><img src="/assets/clipboard30.gif"/></div><div class="clearAll"></div></div>');
}
function createTaskColumn(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var createTaskColumn = msg['createTaskColumn'];
    var tableId = createTaskColumn['tableId'];
    var insert = createTaskColumn['insert'];
    var eqSpot = '';
    if (insert == false) { //insert at the end if there is no specified Header ID for the location
        eqSpot = -1;
    }
    else {
        var headers = $('#' + tableId).find('th');
        var thisHeader = $('#' + tableId).find('#' + insert);
        eqSpot = parseInt(headers.index(thisHeader), 10);
    }
    fixTaskWidth(tableId);
    var createTaskButton = getCreateTaskButton();
    $('#' + tableId).find('tr').each(function() {
        if (eqSpot == -1) { //add to the end if theres no insert value
            $(this).find('td').eq(-1).after('<td><div class="taskCell" id="cell' + taskTableInfo[tableId].taskCellCount + '">' + createTaskButton + '</div></td>');
            $(this).find('th').eq(-1).after('<th id="'+ tableId +'Col_' + taskTableInfo[tableId].taskColumnCount + '"><div class="taskHeaderContainer"><div class="taskHeader">Task Header ' + (taskTableInfo[tableId].taskColumnCount + 1) + '</div></div></th>');
        }
        else { //insert before if there's an insert value
            $(this).find('td').eq(eqSpot).before('<td><div class="taskCell" id="cell' + taskTableInfo[tableId].taskCellCount + '">' + createTaskButton + '</div></td>');
            $(this).find('th').eq(eqSpot).before('<th id="'+ tableId +'Col_' + taskTableInfo[tableId].taskColumnCount + '"><div class="taskHeaderContainer"><div class="taskHeader">Task Header ' + (taskTableInfo[tableId].taskColumnCount + 1) + '</div></div></th>');
            
        }
        taskTableInfo[tableId].taskCellCount ++;
    });
    taskTableInfo[tableId].taskColumnCount ++;


    refreshSortable();
    initializeEditable();
    initializeTaskContextMenu();
    fixTaskWidth(tableId);

}

function createTaskRow(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var createTaskRow = msg['createTaskRow'];
    var tableId = createTaskRow['tableId'];
    var insert = createTaskRow['insert'];
    

    var createTaskButton = getCreateTaskButton();
    var numColumns = $('#' + tableId).find('th').length;
    var toAppend = '';
    for (var i = 0; i < numColumns; i++) {
        if (i == 0) { //the first column is just a column title
            var rows = $('#' + tableId).find('tr').length;
            toAppend = '<td class="taskRowLabel"><div class="taskRowHeader">Row ' + rows + ' Label</div></td>';
        }
        else {
            toAppend = toAppend + '<td><div class="taskCell" id="cell' + taskTableInfo[tableId].taskCellCount + '">' + createTaskButton + '</div></td>';
            taskTableInfo[tableId].taskCellCount ++;
        }
    }
    if (insert == false) { //if they aren't inserting we just append to the end
        $('#' + tableId).find('tbody').append('<tr id="' + tableId + 'Row_' + taskTableInfo[tableId].taskRowCount + '">' + toAppend + '</tr>');
    }
    else { //otherwise insert before the specified tr ID
        $('#' + tableId).find('#' + insert).before('<tr id="' + tableId + 'Row_' + taskTableInfo[tableId].taskRowCount + '">' + toAppend + '</tr>');
    }
    taskTableInfo[tableId].taskRowCount ++;
    refreshSortable();
    initializeEditable();
    initializeTaskContextMenu();
}


function createTask(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var tableId, cellId, taskContent;
    var createTask = msg['createTask'];
    tableId = createTask['tableId'];
    cellId = createTask['cellId'];
    taskContent = createTask['taskContent'];
    var taskId = "task" + taskTableInfo[tableId].taskCount;
    var task = '<div class="taskItem" id="' + taskId + '"><div class="taskEditButton" title="Edit this task"></div><div class="taskItemContainer"><div class="taskItemTitle"></div><div class="taskItemContent">' + taskContent + '</div><div class="taskNoteButton firstTaskNoteButton"><div class="taskNoteNumber" title="Add a note to this task"></div></div></div><div class="taskNotes"></div></div>';
    $('#' + tableId).find('#' + cellId).append(task);
    var loopCop = 0;
    var interval_id = setInterval(function() { //wait for creation of the new task

        if ($('#' + taskId).length != 0) {
            // "exit" the interval loop with clearInterval command
            clearInterval(interval_id);
            clearNewButton(tableId);
            editTask(tableId, taskId);
            initializeEditable();
        }
        loopCop++;
        if (loopCop > 1000) { //to prevent an infinite loop we bail after 20,000 milliseconds
            clearInterval(interval_id);
        }
    }, 100);
    taskTableInfo[tableId].taskCount ++;

}
function clearNewButton(tableId) {
    $('#' + tableId).find('.taskCell').each(function() {
        if ($(this).find('.taskItem').length > 0) { //if there are tasks in a cell there shouldn't be new task buttons
            $(this).find('.taskNewButton').css("display", "none");
        }
        else {
            $(this).find('.taskNewButton').css("display", "block"); //there are no tasks here. show the button!
        }
    });
    
}
function refreshSortable() {

    $('.taskTable').sorttable({
        placeholder: 'placeholder',
        helperCells: null,
        items: '>:not(.taskNoSort)',
        start: function(event, ui) {
            $(event.target).closest('.taskTable').find('.taskEditButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.addTaskNoteButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.firstTaskNoteButton').css("visibility", "hidden");
            oldPosition = $(event.target).closest('.taskTable').find('#' + ui.item.attr("id")).index();

        },
        update: function(event, ui) {

            var itemId = ui.item.attr("id");
            var newPosition = $(event.target).closest('.taskTable').find('#' + ui.item.attr("id")).index();
            console.log("DRAGGED " + itemId + " to " + newPosition);
            console.log("table id " + $(event.target).closest('.taskTable').attr("id"))
            console.log("old position was " + oldPosition)
            
            sendTaskRequest('moveTaskColumn',{'tableId': $(event.target).closest('.taskTable').attr("id"), 'columnFromId': itemId, 'columnFromX': oldPosition, 'columnToX': newPosition}, undoMoveTaskColumn);
            

        },
    });

    $(".taskTable").children('tbody').sortable({
        items: "tr",
        handle: '.taskRowLabel',
        cursor: 'move',
        opacity: 0.6,
        start: function(event, ui) {
            var itemId = ui.item.attr("id");
            $(event.target).closest('.taskTable').find('.taskEditButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.addTaskNoteButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.firstTaskNoteButton').css("visibility", "hidden");
            oldPosition = $(event.target).closest('.taskTable').find('#' + itemId).index();

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
            
            sendTaskRequest('moveTaskRow',{'tableId': $(event.target).closest('.taskTable').attr("id"), 'rowFromId': itemId, 'rowFromY': oldPosition, 'rowToY': newPosition}, undoMoveTaskRow);

            
        }
    });
    
    $('.taskCell').sortable({
        connectWith: ".taskCell",
        items: '> :not(.taskNewButton)',
        start: function(event, ui) {
            $(event.target).closest('.taskTable').find('.taskEditButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.addTaskNoteButton').css("visibility", "hidden");
            $(event.target).closest('.taskTable').find('.firstTaskNoteButton').css("visibility", "hidden");

            taskTableInfo[$(event.target).closest('.taskTable').attr("id")].taskMoveInProgress = true;
            for (var i = 0; i < $('#' + event.target.id).find('.taskItem').length; i++) {
                if ($('#' + event.target.id).find('.taskItem').eq(i).attr("id") == ui.item.attr("id")) {
                    oldPosition = i;
                }

            }

        },
        receive: function(event, ui) {
            // console.log(event);
            // console.log(ui);
            // console.log(ui.item);
            //  console.log(ui.sender);
            var thisTable = $(event.target).closest('.taskTable');
            taskTableInfo[thisTable.attr("id")].taskMoveInProgress = false;
            if (ui.sender) {
                var oldCell = ui.sender.eq(0).attr("id");
                var newCell = event.target.id;
                console.log("you have moved " + ui.item.attr("id") + " from cell " + ui.sender.eq(0).attr("id") + " to cell " + event.target.id);
                console.log("New position of item " + ui.item.attr("id") + ":");
                var itemPosition = '';
                for (var i = 0; i < $('#' + event.target.id).find('.taskItem').length; i++) {
                    if ($('#' + event.target.id).find('.taskItem').eq(i).attr("id") == ui.item.attr("id")) {
                        itemPosition = i;
                    }

                }
                console.log(itemPosition + " in cell id " + event.target.id);
                console.log("old position is " + oldPosition + " in cell id " + ui.sender.eq(0).attr("id"));
                clearNewButton(thisTable.attr("id"));

                thisTable.find('.taskNewButton').css("visibility", "hidden");
                refreshSortable();
                //sendTaskRequest('moveTask', {'tableId': $(event.target).closest('.taskTable').attr("id"), 'rowFromId': itemId, 'rowFromY': oldPosition, 'rowToY': newPosition}, undoMoveTaskRow);
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
                //show the create task button as well
                $(this).find('.taskNewButton').css("visibility", "visible");
              

            }
            else {
                console.log(taskTableInfo[$(this).closest('.taskTable').attr("id")]);
                console.log(taskTableInfo[$(this).closest('.taskTable').attr("id")].taskMoveInProgress);
            }
        })
        .mouseout(function() {
            $(this).find('.taskEditButton').css("visibility", "hidden");
            $(this).find('.addTaskNoteButton').css("visibility", "hidden");
            $(this).find('.firstTaskNoteButton').css("visibility", "hidden");
            $(this).find('.taskNewButton').css("visibility", "hidden");
        });
        
}

function moveTask(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var moveTask = msg['moveTask'];
    var tableId = moveTask['tableId'];
    var taskId = moveTask['taskId'];
    var cellId = moveTask['cellId'];
    var cellPosition = moveTask['cellPosition'];
    
    console.log($('#' + tableId).find('#' + cellId).find('.taskItem').eq(cellPosition - 1).attr("id"))
    if (cellPosition == 0) { //moving it to the top of a list is a special case 
        $('#' + tableId).find('#' + taskId).insertBefore($('#' + tableId).find('#' + cellId).find('.taskItem').eq(0));
    }
    else {
        $('#' + tableId).find('#' + taskId).insertAfter($('#' + tableId).find('#' + cellId).find('.taskItem').eq(cellPosition - 1));
    }
}


function moveTaskColumn(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var moveTaskColumn = msg['moveTaskColumn'];
    var tableId = moveTaskColumn['tableId'];
    var columnFromId = moveTaskColumn['columnFromId'];
    var columnFromX = moveTaskColumn['columnFromX'];
    var columnToX = moveTaskColumn['columnToX'];
    
    // if (columnFrom !== parseInt(columnFrom, 10)) { //column from needs to be converted to an index number if it's a header ID
    //     columnFrom = $('#' + tableId).find('#' + columnFrom).index();
    // }
    console.log("Moving position " + columnFromX + " to position  " + columnToX)
    $('#' + tableId).find('tr').each(function() {
        
        if (columnFromX < columnToX) { //if we're moving to the right we move to columnTo
            $(this).children('th, td').eq(columnFromX).insertAfter($(this).children('th, td').eq(columnToX));
        }
        else { //otherwise we move to columnTo-1
            $(this).children('th, td').eq(columnFromX).insertAfter($(this).children('th, td').eq(columnToX-1));
        }

    });
    refreshSortable();

}
function undoMoveTaskColumn(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    if (msg['status'] == true) { //don't execute if the status was approved
        return(false);
    }
    var moveTaskColumn = msg['moveTaskColumn'];
    var tableId = moveTaskColumn['tableId'];
    var columnFromId = moveTaskColumn['columnFromId'];
    var columnFromX = moveTaskColumn['columnFromX'];
    var columnToX = moveTaskColumn['columnToX'];
    $('#' + tableId).find('tr').each(function() {
        
        if (columnToX < columnFromX) { //if we're moving to the right we move to columnTo
            $(this).children('th, td').eq(columnToX).insertAfter($(this).children('th, td').eq(columnFromX));
        }
        else { //otherwise we move to columnTo-1
            $(this).children('th, td').eq(columnToX).insertAfter($(this).children('th, td').eq(columnFromX-1));
        }

    });
    refreshSortable();

}
function moveTaskRow(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var moveTaskRow = msg['moveTaskRow'];
    var tableId = moveTaskRow['tableId'];
    var rowFromId = moveTaskRow['rowFromId'];
    var rowFromY = moveTaskRow['rowFromY'];
    var rowToY = moveTaskRow['rowToY'];
    
    //var positionFrom = $('#' + tableId).children('tbody').find('#' + rowFrom).index();
    if (rowToY == 0) {
        $('#' + tableId).children('tbody').find('#' + rowFromId).insertBefore($('#' + tableId).children('tbody').find('tr').eq(0));
    }
    else if (rowFromY > rowToY) { //if it's moving left we move it after 1 before the destination
        $('#' + tableId).children('tbody').find('#' + rowFromId).insertAfter($('#' + tableId).children('tbody').find('tr').eq(rowToY - 1));
    }
    else { //if it's moving right we move it to the spot after the destination
        $('#' + tableId).children('tbody').find('#' + rowFromId).insertAfter($('#' + tableId).children('tbody').find('tr').eq(rowToY));
    }
    refreshSortable();
}
function undoMoveTaskRow(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    if (msg['status'] == true) { //don't execute if the status was approved
        return(false);
    }
    var moveTaskRow = msg['moveTaskRow'];
    var tableId = moveTaskRow['tableId'];
    var rowFromId = moveTaskRow['rowFromId'];
    var rowFromY = moveTaskRow['rowFromY'];
    var rowToY = moveTaskRow['rowToY'];
    
    if (rowFromY == 0) {
        $('#' + tableId).children('tbody').find('tr').eq(rowToY).insertBefore($('#' + tableId).children('tbody').find('tr').eq(0));
    }
    else if (rowToY > rowFromY) { //if it's moving left we move it after 1 before the destination
        $('#' + tableId).children('tbody').find('tr').eq(rowToY).insertAfter($('#' + tableId).children('tbody').find('tr').eq(rowFromY - 1));
    }
    else { //if it's moving right we move it to the spot after the destination
        $('#' + tableId).children('tbody').find('tr').eq(rowToY).insertAfter($('#' + tableId).children('tbody').find('tr').eq(rowFromY));
    }
    refreshSortable();
    
}
function initializeTaskContextMenu() {
    $(".taskTable th:not(.taskNoSort)").contextmenu({
        //delegate: ".ui-tabs-panel",
        menu: [

        ],

        select: function(event, ui) {
            if (ui.cmd == "editTaskHeader") {
                $('#' + clickedElementId).find('.taskHeader').eq(clickedTarget).trigger("click");
            }
            else if (ui.cmd == "insertTaskColumn") {
                var thisCol = $('#' + clickedElementId).find('.taskHeader').closest('th').eq(clickedTarget).attr('id');
                sendTaskRequest('createTaskColumn', {"tableId": clickedElementId, "insert": thisCol}, createTaskColumn);
                //createTaskColumn(clickedElementId,thisCol);
            }
            else if (ui.cmd == "createTaskColumn") {
                sendTaskRequest('createTaskColumn', {"tableId": clickedElementId, "insert": false}, createTaskColumn);
                //createTaskColumn(clickedElementId,false);
            }
            else if (ui.cmd == "createTaskRow") {
                sendTaskRequest('createTaskRow', {"tableId": clickedElementId, "insert": false}, createTaskRow);
                //createTaskRow(clickedElementId,false);
            }
            else if (ui.cmd == "deleteTaskColumn") {
                sendTaskRequest('deleteTaskColumn', {"tableId": clickedElementId, "cellId": clickedTarget}, deleteTaskColumn);
                //deleteTaskColumn(clickedElementId, clickedTarget);
            }
        },
        beforeOpen: function(event, ui) {

            $(".taskTable th:not(.taskNoSort)").contextmenu("replaceMenu", [{
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
                },
                {
                    title: '<span class="contextMenuItem">Insert New Column Here</span>',
                    uiIcon: "ui-icon-carat-1-w",
                    cmd: "insertTaskColumn",

                },
                {
                    title: '---'
                },{
                    title: '<span class="contextMenuItem">Add New Row</span>',
                    uiIcon: "ui-icon-carat-2-n-s",
                    cmd: "createTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Add New Column</span>',
                    uiIcon: "ui-icon-carat-2-e-w",
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
                sendTaskRequest('createTaskColumn', {"tableId": clickedElementId, "insert": false}, createTaskColumn);
                //createTaskColumn(clickedElementId,false);
            }
            else if (ui.cmd == "createTaskRow") {
                sendTaskRequest('createTaskRow', {"tableId": clickedElementId, "insert": false}, createTaskRow);
                //createTaskRow(clickedElementId,false);
            }
            else if (ui.cmd == "insertTaskRow") {
                var thisRow = $('#' + clickedElementId).find('.taskRowLabel').eq(clickedTarget).closest('tr').attr('id');
                sendTaskRequest('createTaskRow', {"tableId": clickedElementId, "insert": thisRow}, createTaskRow);
                //createTaskRow(clickedElementId,thisRow);
            }
            else if (ui.cmd == "deleteTaskRow") {
                sendTaskRequest('deleteTaskRow', {"tableId": clickedElementId, "cellId": clickedTarget}, deleteTaskRow);
                //deleteTaskRow(clickedElementId, clickedTarget);
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
                }, 
                {
                    title: '<span class="contextMenuItem">Insert New Row Here</span>',
                    uiIcon: "ui-icon-carat-1-n",
                    cmd: "insertTaskRow",

                },
                {
                    title: '---'
                }, 
                {
                    title: '<span class="contextMenuItem">Add New Row</span>',
                    uiIcon: "ui-icon-carat-2-n-s",
                    cmd: "createTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Add New Column</span>',
                    uiIcon: "ui-icon-carat-2-e-w",
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
                sendTaskRequest('createTask', { 'tableId' : clickedElementId, 'cellId' : clickedTarget, 'taskContent' : "New Task" }, createTask);
                //createTask(clickedElementId, clickedTarget, "New Task");
            }
            else if (ui.cmd == "insertTaskColumn") {
                var theseCells = $('#' + clickedElementId).find('#' + clickedTarget).closest("tr").find("td"); //all the tds in the current row
                var thisCell = $('#' + clickedElementId).find('#' + clickedTarget).closest("td"); //this td
                var colNum = parseInt(theseCells.index(thisCell), 10); //the index of this td in the current row.
                sendTaskRequest('createTaskColumn', {"tableId": clickedElementId, "insert": $('#' + clickedElementId).find('th').eq(colNum).attr("id")},createTaskColumn);
                //createTaskColumn(clickedElementId,$('#' + clickedElementId).find('th').eq(colNum).attr("id"));
            }
            else if (ui.cmd == "insertTaskRow") {
                sendTaskRequest('createTaskRow', {"tableId": clickedElementId, "insert": $('#' + clickedElementId).find('#' + clickedTarget).closest('tr').attr("id")},createTaskRow);
                //createTaskRow(clickedElementId,$('#' + clickedElementId).find('#' + clickedTarget).closest('tr').attr("id"));
            }
            else if (ui.cmd == "createTaskColumn") {
                sendTaskRequest('createTaskColumn', {"tableId": clickedElementId, "insert": false},createTaskColumn);
                //createTaskColumn(clickedElementId,false);
            }
            else if (ui.cmd == "createTaskRow") {
                sendTaskRequest('createTaskRow', {"tableId": clickedElementId, "insert": false},createTaskRow);
                //createTaskRow(clickedElementId,false);
            }
            else if (ui.cmd == "changeTaskBG") {
                requestColorPicker(clickedElementId, clickedElement, "changeTaskBG", changeTaskBG);
            }
            else if (ui.cmd == "changeCellColor") {
                requestColorPicker(clickedElementId, clickedTarget, "changeCellColor", changeCellColor);
            }
            else if (ui.cmd == "editTaskItem") {
                editTask(clickedElementId, clickedElement);
            }
            else if (ui.cmd == "deleteTaskRow") {
                sendTaskRequest('deleteTaskRow', {"tableId": clickedElementId, "cellId": clickedTarget},deleteTaskRow);
                //deleteTaskRow(clickedElementId, clickedTarget);
            }
            else if (ui.cmd == "deleteTaskColumn") {
                sendTaskRequest('deleteTaskColumn', {"tableId": clickedElementId, "cellId": clickedTarget},deleteTaskColumn);
                //deleteTaskColumn(clickedElementId, clickedTarget);
            }
            else if (ui.cmd == "deleteTaskItem") { 
                sendTaskRequest('deleteTask', {"tableId": clickedElementId, "taskId": clickedElement},deleteTask);
                //deleteTask(clickedElementId, clickedElement);
            }
            else if (ui.cmd == "addTaskNote") {
                sendTaskRequest('addTaskNote', {"tableId": clickedElementId, "taskId": clickedElement},addTaskNote);
                //addTaskNote(clickedElementId, clickedElement);
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
                    title: '---'
                },
                {
                    title: '<span class="contextMenuItem">Delete Task</span>',
                    uiIcon: "ui-icon-trash",
                    cmd: "deleteTaskItem",

                },
                {
                    title: '---'
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
                    title: '<span class="contextMenuItem">Change Task Color</span>',
                    uiIcon: "ui-icon-script",
                    cmd: "changeTaskBG",
                    // children: [{
                    //     title: '<span class="contextMenuItem">None</span>',
                    //     cmd: "changeTaskBG",
                    //     data: {
                    //         color: "none"
                    //     },
                    // }, {
                    //     title: '---'
                    // }, {
                    //     title: '<span class="contextMenuItem">Red</span>',
                    //     cmd: "changeTaskBG",
                    //     data: {
                    //         color: "red"
                    //     },
                    // }, {
                    //     title: '<span class="contextMenuItem">Yellow</span>',
                    //     cmd: "changeTaskBG",
                    //     data: {
                    //         color: "yellow"
                    //     },
                    // }, {
                    //     title: '<span class="contextMenuItem">Green</span>',
                    //     cmd: "changeTaskBG",
                    //     data: {
                    //         color: "green"
                    //     },
                    // }]
                }, {
                    title: '<span class="contextMenuItem">Change Cell Border Color</span>',
                    uiIcon: "ui-icon-script",
                    cmd: "changeCellColor",
                    // children: [{
                    //     title: '<span class="contextMenuItem">Black</span>',
                    //     cmd: "changeCellColor",
                    //     data: {
                    //         color: "black"
                    //     },
                    // }, {
                    //     title: '---'
                    // }, {
                    //     title: '<span class="contextMenuItem">Red</span>',
                    //     cmd: "changeCellColor",
                    //     data: {
                    //         color: "red"
                    //     },
                    // }, {
                    //     title: '<span class="contextMenuItem">Yellow</span>',
                    //     cmd: "changeCellColor",
                    //     data: {
                    //         color: "yellow"
                    //     },
                    // }, {
                    //     title: '<span class="contextMenuItem">Green</span>',
                    //     cmd: "changeCellColor",
                    //     data: {
                    //         color: "green"
                    //     },
                    // }]
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

                }, 
                {
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Insert New Row Here</span>',
                    uiIcon: "ui-icon-carat-1-n",
                    cmd: "insertTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Insert New Column Here</span>',
                    uiIcon: "ui-icon-carat-1-w",
                    cmd: "insertTaskColumn",

                },{
                    title: '---'
                }, {
                    title: '<span class="contextMenuItem">Add New Row</span>',
                    uiIcon: "ui-icon-carat-2-n-s",
                    cmd: "createTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Add New Column</span>',
                    uiIcon: "ui-icon-carat-2-e-w",
                    cmd: "createTaskColumn",

                },

            ]);
            $(".taskCell").closest('td').contextmenu("showEntry", "editTaskItem", false);
            $(".taskCell").closest('td').contextmenu("showEntry", "noCmd", false);
            $(".taskCell").closest('td').contextmenu("showEntry", "changeTaskBG", false);
            $(".taskCell").closest('td').contextmenu("showEntry", "addTaskNote", false);
            $(".taskCell").closest('td').contextmenu("showEntry", "deleteTaskItem", false);
            if (clickedElement != "taskCell") { //this means there's a specific task selected
                $(".taskCell").closest('td').contextmenu("showEntry", "editTaskItem", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "noCmd", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "changeTaskBG", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "addTaskNote", true);
                $(".taskCell").closest('td').contextmenu("showEntry", "deleteTaskItem", true);
            }



        },
    });
    $(".taskNoSort").contextmenu({
        //delegate: ".ui-tabs-panel",
        menu: [

        ],

        select: function(event, ui) {
            if (ui.cmd == "createTaskColumn") {
                sendTaskRequest('createTaskColumn', {"tableId": clickedElementId, "insert": false}, createTaskColumn);
                //createTaskColumn(clickedElementId, false);
            }
            else if (ui.cmd == "createTaskRow") {
                sendTaskRequest('createTaskRow', {"tableId": clickedElementId, "insert": false}, createTaskRow);
                //createTaskRow(clickedElementId,false);
            }
         
        },
        beforeOpen: function(event, ui) {

            $(".taskNoSort").contextmenu("replaceMenu", [{
                    title: '<span class="contextMenuItem">Add New Row</span>',
                    uiIcon: "ui-icon-carat-2-n-s",
                    cmd: "createTaskRow",

                }, {
                    title: '<span class="contextMenuItem">Add New Column</span>',
                    uiIcon: "ui-icon-carat-2-e-w",
                    cmd: "createTaskColumn",

                },

            ]);



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
    $('#' + tableId).find('th:not(.taskNoSort)').each(function() {
        var cell = $(this);
        cell.width(cellWidth);
    });
}

function requestColorPicker(tableId, targetId, type, callback) { //the callback function is one of the color changing functions
    var thisDialog = "dialog-dbEditor";
    changeDialogTitle(thisDialog, "Choose a Color");

    addDialogInfo(thisDialog, " ");
    if (type == "changeTaskBG") {
        addDialogColorPicker(thisDialog, 'Color:', 'tableColor', 'color', taskLastColor);
    }
    else {
        addDialogColorPicker(thisDialog, 'Color:', 'tableColor', 'color', cellLastColor);
    }
    $("#" + thisDialog).dialog({
        resizable: false,
        height: 210,
        width: 395,
        modal: true,
        buttons: {
            "Change Color": function() {
                var tableColor = $('#tableColor').val();
                if (type == "changeTaskBG") {
                    taskLastColor = tableColor;
                }
                else {
                    cellLastColor = tableColor;
                }
                
                sendTaskRequest(type,{"tableId": tableId, "taskId": targetId, "color": tableColor},callback);
                ///callback(tableId, targetId, tableColor);
                
                $(this).dialog("close");
                removeDialogInfo(thisDialog);
                removeDialogColorPicker(thisDialog);

            },
            Cancel: function() {
                $(this).dialog("close");
                removeDialogInfo(thisDialog);
                removeDialogQuestion(thisDialog);

            }
        }
    });
    $( ".colorPickerBox").change(function() {
	  
	  var theButton = $(this);
	  setTimeout(function(){

	    theButton.closest('.ui-dialog').find('.ui-button').eq(1).click();
	  }, 100);
	});

}
function changeTaskBG(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var changeTaskBG = msg['changeTaskBG'];
    var tableId = changeTaskBG['tableId'];
    var taskId = changeTaskBG['taskId'];
    var color = changeTaskBG['color'];
    
    
    var thisTask = $('#' + tableId).find('#' + taskId);

    
    thisTask.css("background-color", color);

}

function changeCellColor(tableId, cellId, color) {
    if (event == 'send') {
        return;
    }
    var changeCellColor = msg['changeCellColor'];
    var tableId = changeCellColor['tableId'];
    var taskId = changeCellColor['taskId'];
    var color = changeCellColor['color'];
    
    var thisCell = $('#' + tableId).find('#' + cellId);

    thisCell.css('border-color', color);

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
                    
                    sendTaskRequest('addTaskTitle', {"tableId": tableId, "taskId": taskId, "content": $('#wysiwyg').find('#taskTitle').val()}, addTaskTitle);
                    //addTaskTitle(tableId, taskId, $('#wysiwyg').find('#taskTitle').val());
                }
                else {
                    sendTaskRequest('removeTaskTitle', {"tableId": tableId, "taskId": taskId}, removeTaskTitle);
                    //removeTaskTitle(tableId, taskId);
                }
                if ($('#wysiwygText').val()) {
                    sendTaskRequest('addTaskText', {"tableId": tableId, "taskId": taskId, "content": $('#wysiwygText').val()}, addTaskText);
                    //addTaskText(tableId, taskId, $('#wysiwygText').val());
                }
                else {
                    sendTaskRequest('addTaskText', {"tableId": tableId, "taskId": taskId, "content": '<p>&nbsp;</p>'}, addTaskText);
                    //addTaskText(tableId, taskId, '<p>&nbsp;</p>');
                }
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

function addTaskText(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var addTaskText = msg['addTaskText'];
    var tableId = addTaskText['tableId'];
    var taskId = addTaskText['taskId'];
    var addText = addTaskText['content'];
    
    $('#' + tableId).find('#' + taskId).find('.taskItemContent').html(addText);
}

function addTaskTitle(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var addTaskTitle = msg['addTaskTitle'];
    var tableId = addTaskTitle['tableId'];
    var taskId = addTaskTitle['taskId'];
    var addTitle = addTaskTitle['content'];
    
    var thisTitle = "<strong>" + addTitle + "</strong><hr/>";
    $('#' + tableId).find('#' + taskId).find('.taskItemTitle').html(thisTitle);
}

function removeTaskTitle(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var removeTaskTitle = msg['removeTaskTitle'];
    var tableId = removeTaskTitle['tableId'];
    var taskId = removeTaskTitle['taskId'];
    
    $('#' + tableId).find('#' + taskId).find('.taskItemTitle').empty();
}

function deleteTaskRow(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var deleteTaskRow = msg['deleteTaskRow'];
    var tableId = deleteTaskRow['tableId'];
    var cellId = deleteTaskRow['cellId'];
   
    
    
    if (cellId === parseInt(cellId, 10)) { //if cell is an integer it is the index of the row (skipping the header row)
        $('#' + tableId).find('tr').eq(cellId + 1).remove();
    }
    else {
        $('#' + tableId).find('#' + cellId).closest("tr").remove();
    }
    refreshSortable();

}

function deleteTaskColumn(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var deleteTaskColumn = msg['deleteTaskColumn'];
    var tableId = deleteTaskColumn['tableId'];
    var cellId = deleteTaskColumn['cellId'];
    
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
        height: 440,
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
               
                //updateTaskNote(tableId, taskId, noteIndex, $('#wysiwygText').val());
                sendTaskRequest('updateTaskNote', {"tableId": tableId, "taskId": taskId, "noteIndex": noteIndex, "noteContent": $('#wysiwygText').val()}, updateTaskNote);
                
                $(this).dialog("close");


            },
            Cancel: function() {
                $(this).dialog("close");
                removeDialogInfo(thisDialog);
                //deleteTaskNote(tableId,taskId,noteIndex);
                sendTaskRequest('deleteTaskNote', {"tableId": tableId, "taskId": taskId, "noteIndex": noteIndex},deleteTaskNote);



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
function updateTaskNote(hashKey, event, msg) {
    console.log("attempting task note update!!!!")
    if (event == 'send') {
        return;
    }
    var updateTaskNote = msg['updateTaskNote'];
    var tableId = updateTaskNote['tableId'];
    var taskId = updateTaskNote['taskId'];
    var noteIndex = updateTaskNote['noteIndex'];
    var noteContent = updateTaskNote['noteContent'];
    console.log($('#' + tableId).find('#' + taskId).find('.taskNoteItem').eq(noteIndex))
    console.log("updating note index " + noteIndex + " with " + noteContent)
    $('#' + tableId).find('#' + taskId).find('.taskNoteItem').eq(noteIndex).find('.taskNoteText').html(noteContent);
    
    //if this is the first task note we will also insert an add task button
    if ($('#' + tableId).find('#' + taskId).find('.taskNoteItem').length == 1) {
        var taskAddButton = '<div class="taskNoteButton addTaskNoteButton"><div class="taskNoteNumber" title="Add a new note to this task"></div></div>';
         $('#' + tableId).find('#' + taskId).find('.taskNotes').append(taskAddButton);
    }
}
function addTaskNote(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var addTaskNote = msg['addTaskNote'];
    var tableId = addTaskNote['tableId'];
    var taskId = addTaskNote['taskId'];

    
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
    expandTaskNotes(tableId,taskId);
    return(noteCount - 1);
}
function deleteTaskNote(hashKey, event, msg){
    if (event == 'send') {
        return;
    }
    var deleteTaskNote = msg['deleteTaskNote'];
    var tableId = deleteTaskNote['tableId'];
    var taskId = deleteTaskNote['taskId'];
    var noteIndex = deleteTaskNote['noteIndex'];
    
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

function deleteTask(hashKey, event, msg) {
    if (event == 'send') {
        return;
    }
    var deleteTask = msg['deleteTask'];
    var tableId = deleteTask['tableId'];
    var taskId = deleteTask['taskId'];

    
    $('#' + tableId).find('#' + taskId).remove();
    clearNewButton(tableId);
}



// function sendTaskRequest(requestCommand, callbackParams, callback) {
//     var hashKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + requestCommand); 
//     var eMsg = {
// 		"commandSet": "task",
// 		"taskCommand": requestCommand,
// 		"hash": hashKey,
// 	    "taskParams": callbackParams,
// 	};

// 	wsSendMsg(JSON.stringify(eMsg));
// 	var loopCop = 0;
// 	var interval_id = setInterval(function(){
	     
// 	     if ((getMsg(hashKey)) || (loopCop > timeOutWait)){
// 	         // "exit" the interval loop with clearInterval command
// 	         clearInterval(interval_id);
// 			 //Execute callback or issue error report
// 			 if (loopCop > timeOutWait) {
// 			     displayServerError(requestCommand,"Unable to contact server.");
// 			 }
// 			 else {
//     			 var result = getMsg(hashKey);
//         		 if (result['status'] == true) {
//         			//success from the server. run the callback
//         			callback.apply(null, callbackParams);
//         		 }
//         		 else {
//         		     displayServerError(requestCommand,result['errorMsg']);
//         		     console.log("error result follows");
//         		     console.log(result)
//         		 }
// 			 }
			 
// 	     }
// 	     loopCop ++;
	     
// 	}, 10);
				         
// }

function createTaskBoard(hashKey, event, msg) { //once the server has created a task board we will process it in the file tree and open it if requested
        if (event == 'send') {
            return;
        }
        if (msg['status'] == false) {
        	console.log(msg['errorReasons']);
        	return(false);
        }
        var createTaskBoard = msg['createTaskBoard'];
        var taskBoardName = createTaskBoard['taskBoardName'];
        var windowPane = createTaskBoard['windowPane'];
       
        if ((windowPane) && (typeof windowPane !== 'undefined'))   { //there is a window pane request
            console.log("opening in pane " + windowPane)
            var tabBarId =  $('#' + windowPane).find(".tabBar").attr("id");
            console.log("opening in tabbar " + tabBarId)
            var fileName = taskBoardName;
            var originId = 'unknown';
            var srcPath = taskBoardName;
			newTab(fileName, tabBarId, originId, 'taskBoard', srcPath);
            
        }
        
        
         //open the task branch of the jstree
			var nodeRef = $('#jsTreeTaskBoard').jstree(true);
			nodeRef.deselect_all(true); //deselect nodes
			var thisNode = nodeRef.get_node('taskboardroot');

			nodeRef.open_node(thisNode);
		//select the new node
			var interval_id = setInterval(function(){
			     // $("li#"+id).length will be zero until the node is loaded
			     if($("li#"+taskBoardName).length != 0){
			         // "exit" the interval loop with clearInterval command
			         clearInterval(interval_id);
			         var thisNode = nodeRef.get_node(taskBoardName);
					nodeRef.select_node(thisNode);
					var thisElement = document.getElementById(taskBoardName);
					$('#tabs-2').scrollTop( thisElement.offsetTop - 20 );
			      }
			}, 100);
}

function sendTaskRequest(requestCommand, serverData, callBack) {
    var hashKey = hex_md5(Math.floor((Math.random() * 1000) + 10) + requestCommand); 
    var taskName = serverData.tableId;
    taskName = $('#' + taskName).attr("taskname");
    var eMsg = {
		"commandSet": "task",
		"taskCommand": requestCommand,
		"hash": hashKey,
		"taskTarget":taskName,
		"srcPath":taskName,
	};
	if (requestCommand == "createTaskBoard") {
		eMsg.commandSet = "base";
		eMsg.command = requestCommand;
	}
	eMsg[requestCommand] = serverData;
	wsSendMsg(JSON.stringify(eMsg));
	wsRegisterCallbackForHash(hashKey, callBack)
}