var numtaskBoards = 0;

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
		
// 	$( ".taskBoard" ).sortable({
    refreshSortable();
    
    
});

function createtaskColumn(tableId) {
    numtaskBoards = numtaskBoards + 1;
   $('#' + tableId).find('tr').each(function(){
        $(this).find('td').eq(-1).after('<td><div class="taskCell taskGreen"><div class="task">task ' + Math.floor((Math.random() * 100) + 1) + '</div><div class="task">task ' + Math.floor((Math.random() * 100) + 1) + '</div><div class="task">task ' + Math.floor((Math.random() * 100) + 1) + '</div></div></td>');
        $(this).find('th').eq(-1).after('<th>HEADER ' + numtaskBoards + '</th>'); 
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
            toAppend = toAppend + '<td><div class="taskCell taskGreen"></div></td>';
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
});


     $('.taskCell').sortable({ 
         connectWith: ".taskCell",
         
     });
}

