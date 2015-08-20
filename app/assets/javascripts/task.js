var numtaskBoards = 0;
cellId = 0;
taskId = 0;

$(document).ready(function() {
    
    
    $(document).on('keydown', function(e) {   
        if (e.altKey && (String.fromCharCode(e.which) === 'w' || String.fromCharCode(e.which) === 'W')) { //ALT w keypress
    			console.log("keydown acknowledged");
    			createtaskColumn('taskSpace');
    		}
    });
    $(document).on('keydown', function(e) {   
        if (e.altKey && (String.fromCharCode(e.which) === 'q' || String.fromCharCode(e.which) === 'Q')) { //ALT q keypress
    			console.log("keydown acknowledged");
    			createtaskRow('taskSpace');
    		}
    });
    $(document).on('keydown', function(e) {   
        if (e.altKey && (String.fromCharCode(e.which) === 'a' || String.fromCharCode(e.which) === 'A')) { //ALT q keypress
    			console.log("keydown acknowledged");
    			console.log("length " + $('#taskSpace th').length);
    			for (var i=0; i < $('#taskSpace th').length; i++) {
    			    console.log($('#taskSpace th').eq(i).html());
    			}
    		}
    });
	$(document).on('keydown', function(e) {   
        if (e.altKey && (String.fromCharCode(e.which) === 't' || String.fromCharCode(e.which) === 'T')) { //ALT t keypress
    			console.log("keydown acknowledged");
    			moveTask("task5", "cell1", 0);
    		}
    });	
    $(document).on('keydown', function(e) {   
        if (e.altKey && (String.fromCharCode(e.which) === 'y' || String.fromCharCode(e.which) === 'Y')) { //ALT y keypress
    			console.log("keydown acknowledged");
    			moveTask("task6", "cell2", 1);
    		}
    });	
    $(document).on('keydown', function(e) {   
        if (e.altKey && (String.fromCharCode(e.which) === 'h' || String.fromCharCode(e.which) === 'H')) { //ALT h keypress
    			console.log("keydown acknowledged");
    			moveColumn("taskSpace",3,1);
    		}
    });	
    
    
// 	$( ".taskBoard" ).sortable({
    refreshSortable();
    
    
});

function createtaskColumn(tableId) {
    numtaskBoards = numtaskBoards + 1;
   $('#' + tableId).find('tr').each(function(){
        $(this).find('td').eq(-1).after('<td><div class="taskCell taskGreen" id="cell' + cellId + '"><div class="taskItem" id="task' + taskId +'">task ' + taskId + '</div></div></td>');
        $(this).find('th').eq(-1).after('<th>HEADER ' + numtaskBoards + '</th>'); 
        cellId ++;
        taskId ++;
   });
   
 
    refreshSortable();
    
}
function createtaskRow(tableId) {
    var numColumns = $('#' + tableId).find('th').length;
    var toAppend = '';
    for (var i=0; i<numColumns; i++) {
        if (i==0) { //the first column is just a column title
            var rows = $('#' + tableId).find('tr').length;
            toAppend = '<td class="taskRowLabel">' + rows + '</td>';
        }
        else {
            toAppend = toAppend + '<td><div class="taskCell taskGreen" id="cell'+cellId+'"></div></td>';
            cellId ++;
        }
    }
    $('#' + tableId).find('tbody').append('<tr>' + toAppend + '</tr>');
    refreshSortable();
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
                for (var i=0; i < $('#' + event.target.id).find('.taskItem').length; i++) {
    			    if ($('#' + event.target.id).find('.taskItem').eq(i).attr("id") == ui.item.attr("id")) {
    			        itemPosition = i;
    			    }
    			    
    			}
                console.log(itemPosition + " in cell id " + event.target.id);
            }
           //event.preventDefault();
          
        },
        stop: function(event, ui) {
            if (event.target.id == ui.item.context.parentNode.id) {
                console.log("you have moved something within cell " + event.target.id);
                console.log("New position of item " + ui.item.attr("id") + ":");
                var itemPosition = '';
                for (var i=0; i < $('#' + event.target.id).find('.taskItem').length; i++) {
    			    if ($('#' + event.target.id).find('.taskItem').eq(i).attr("id") == ui.item.attr("id")) {
    			        itemPosition = i;
    			    }
    			    
    			}
                console.log(itemPosition + " in cell id " + event.target.id);
                
            }
           
        },
     });
}

function moveTask(taskId,cellId, cellPosition) {
    console.log($('#' + cellId).find('.taskItem').eq(cellPosition-1).attr("id"))
    if (cellPosition == 0) { //moving it to the top of a list is a special case 
        $('#' + taskId).insertBefore($('#' + cellId).find('.taskItem').eq(0));
    }
    else {
        $('#' + taskId).insertAfter($('#' + cellId).find('.taskItem').eq(cellPosition-1));
    }
}


function moveColumn(tableId, columnFrom, columnTo) {
        $('#' + tableId).find('tr').each(function() {
            console.log("tr found")
            $(this).children(":eq(" + (columnTo - 1) + ")").after($(this).children(":eq(" + columnFrom + ")"));
        });

}