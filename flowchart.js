    //globals     
    var defaultObjectColor = "rgba(255,255,255,1)"; //default color for an object is white
    var arrowColor = "#61B7CF";
    var activeContainerId = ''; 
    var activeContainerShape = '';
    var numElements = 0;
    var numDbElements = 0;
    var resizing = 0;
    var dragInProgress = 0;
    var lastColor = '#FFFFFF';
    var currentMousePos = {};
    var activeConnection = '';
    var connectionMap = {};
    var defaultConnection = { direction: 1, location: 1, labels: 0, label1: '', label2: '', foldback: 0.4, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"},};
    var savedElements = [];
    var savedConnections = [];
    
    var connectorPaintStyle = {
                lineWidth: 4,
                strokeStyle: "#61B7CF",
                joinstyle: "round",
                outlineColor: "white",
                outlineWidth: 2
         },
        // .. and this is the hover style.
        connectorHoverStyle = {
                lineWidth: 4,
                strokeStyle: "#216477",
                outlineWidth: 2,
                outlineColor: "white"
         },
        endpointHoverStyle = {
                fillStyle: "#216477",
                strokeStyle: "#216477"
        },
        // the definition of source endpoints (the small blue ones)
        sourceEndpoint = {
                endpoint: "Dot",
                paintStyle: {
                    strokeStyle: "#7AB02C",
                    fillStyle: "transparent",
                    radius: 7,
                    lineWidth: 3
                },
                isSource: true,
                isTarget: true,
                maxConnections: 1,
                connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
                connectorStyle: connectorPaintStyle,
                hoverPaintStyle: endpointHoverStyle,
                connectorHoverStyle: connectorHoverStyle,
                dragOptions: {},

       },
        // the definition of target endpoints (will appear when the user drags a connection)
        targetEndpoint = {
                endpoint: "Rectangle",
                paintStyle: { fillStyle: "transparent", radius: 11 },
                hoverPaintStyle: endpointHoverStyle,
                maxConnections: 1,
                dropOptions: { hoverClass: "hover", activeClass: "active" },
                isTarget: true,
                // overlays: [
                //     [ "Label", { location: [0.5, -0.5], label: "", cssClass: "endpointTargetLabel" } ]
                // ]
        };    
        var basicType = {
            connector: "StateMachine",
            paintStyle: { strokeStyle: "red", lineWidth: 4 },
            hoverPaintStyle: { strokeStyle: "blue" },
            overlays: [
                "Arrow"
            ]
        };
    
    var instance;
    
    

    // Prevent jQuery UI dialog from blocking focusin for tinyMCE editor
    $(function() {
        $(document).on('focusin', function(e) {
            if ($(e.target).closest(".mce-window, .moxman-window").length) {
        		e.stopImmediatePropagation();
        	}
        });   
        
        
     


    });
    
    
    jsPlumb.ready( function() {
      instance = jsPlumb.getInstance({
            // default drag options
            DragOptions: { cursor: 'pointer', zIndex: 2000 },
            // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
            // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
            ConnectionOverlays: [
                [ "Arrow", { location: 1, id: "arrow", direction: 1, foldback: 0.4, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"}} ],
                // [ "Label", {
                //     location: 0.1,
                //     id: "label",
                //     cssClass: "aLabel"
                // }]
            ],
            Container: "flowchart-demo"
        }); 
        
        
        instance.bind("connectionDrag", function(info) { //connection drag tells the system that an endpoint is being moved
           dragInProgress = 1;
           showAllConnections();
        });
        instance.bind("connectionDragStop", function(info) {
          dragInProgress = 0;
          hideAllConnections();
 
        });
        
    });
    function updateDraggable () {
        console.log("update draggable")
        instance.draggable(jsPlumb.getSelector(".flowchartBox"), { 

            grid: [20, 20],
            containment:"parent",
            drag: function( event, ui ) {
               console.log("x " + event.pos[0] + " y " + event.pos[1]);
               
               
            },
           start: function( event, ui ) {
               console.log("Placing lock on file");
               
                
            },
            stop: function( event, ui ) {
                console.log("removing file lock");
                
            }
            
        });    
        
        $(".form-outer-box").resizable({
              resize:function(e, ui) {
                instance.repaintEverything();
              },
             start:function(e, ui) {
                
                jsPlumb.setDraggable($(this).attr("id"), false);
              },
              stop:function(e, ui) {
                jsPlumb.setDraggable($(this).attr("id"), true);
              },
              handles: "all"
              
            });
            
            $( ".form-outer-box" )
              .mouseover(function() {
                if (dragInProgress == 0) { //we only change borders if there is no endpoint drag going on
                    $(this).css({'border-color':'rgba(0,0,0,1.0)'});
                    $('.ui-icon-gripsmall-diagonal-se').show();
                }
              })
              .mouseout(function() {
                if (dragInProgress == 0) { //we only change borders if there is no endpoint drag going on

                    $(this).css({'border-color':'rgba(0,0,0,0.0)'});
                    $('.ui-icon-gripsmall-diagonal-se').hide();
                }

              });
              
         jQuery('img.svg').each(function(){
            if ($(this).hasClass("replaced-svg")) {
                //this svg was already replaced. hence the class replaced-svg. for now we'll do nothing in this case.
            }
            else { //this svg has not been replaced yet
                var $img = jQuery(this);
                var imgID = $img.attr('id');
                var imgClass = $img.attr('class');
                var imgURL = $img.attr('src');
    
                jQuery.get(imgURL, function(data) {
                    // Get the SVG tag, ignore the rest
                    var $svg = jQuery(data).find('svg');
    
                    // Add replaced image's ID to the new SVG
                    if(typeof imgID !== 'undefined') {
                        $svg = $svg.attr('id', imgID);
                    }
                    // Add replaced image's classes to the new SVG
                    if(typeof imgClass !== 'undefined') {
                        $svg = $svg.attr('class', imgClass+' replaced-svg');
                    }
    
                    // Remove any invalid XML tags as per http://validator.w3.org
                    $svg = $svg.removeAttr('xmlns:a');
    
                    // Replace image with new SVG
                    $img.replaceWith($svg);
    
                }, 'xml');
            }

        });
        
        
    }
    
    function addNewEndpoints (toId, sourceAnchors) {
        
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
            console.log("end point added to element " + "flowchart" + toId)
        }
        // for (var j = 0; j < targetAnchors.length; j++) {
        //     var targetUUID = toId + targetAnchors[j];
        //     instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
        // }
    }    
    
    function dbMenuReset() {
        	$(".form-outer-box").off();
        	$(".form-outer-box").on("contextmenu", function(event) {
        		
        		
        		$(".dbTableMenu").show();
        		$(".dbTableMenu").position({
        			collision: "none",
        			my: "left top",
        			of: event
        		});
        		
        	
        		console.log($(event.target).attr("class"));
        		
        		
        
        		return false;
        	});
        
        //I don't know where the following code came from
        
        //     $(".dbTableMenu").off();
        // 	$(".dbTableMenu").on("contextmenu", function(event) {
        // 	    console.log("test");
        // 		return false;
        // 	});
    }
    
    function requestNewElement(shape,boxId,x,y, thisId) { //thisId is an optional argument to specify the ID of the new element
        if (typeof thisId === 'undefined') { 
            thisId = ''; 
            
        }
        
            if (shape == "circle") {
                console.log("drawing a circle.");
                createNewElement("circle",boxId,x,y,thisId); //draw a new circle
                
            }
            else if (shape == "note") {
                console.log("drawing a note.");
                createNewElement("note",boxId,x,y,thisId); //draw a new note
            }
            else if (shape == "folder") {
                console.log("drawing a folder.");
                createNewElement("folder",boxId,x,y,thisId); //draw a new note
            }
            else if (shape == "document") {
                console.log("drawing a document.");
                createNewElement("document",boxId,x,y,thisId); //draw a new document
            }
            else if (shape == "decision") {
                console.log("drawing a decision.");
                createNewElement("decision",boxId,x,y,thisId); //draw a new decision
            }
    //         else { //old stuff follows
    //         	var thisDialog = "dialog-dbEditor";
    // 			changeDialogTitle(thisDialog,"Enter Table Name");
    		
    // 			addDialogInfo(thisDialog," ");
    // 			addDialogQuestion (thisDialog, 'Table name:', 'tableName', 'name', 'newTableSubmit'); //add text field to get table name
    // 					$("#" + thisDialog).dialog({
    // 						resizable: false,
    // 						height: 210,
    // 						width: 395,
    // 						modal: true,
    // 						buttons: {
    // 							"Add Table": function() {
    // 							    var tableName = $('#tableName').val();
    // 							    createNewTable(boxId,x,y,tableName);
    // 								$(this).dialog("close");
    // 								removeDialogInfo(thisDialog);
    // 				            	removeDialogQuestion(thisDialog);
    							
    // 							},
    // 							Cancel: function() {
    // 								$(this).dialog("close");
    // 								removeDialogInfo(thisDialog);
    // 				            	removeDialogQuestion(thisDialog);
    				
    // 							}
    // 						}
    // 					});
    //         }
    }
    
    function createNewElement(shape, boxId, x,y, thisId) { //thisId is an optional argument that specifies the new element ID
        if ((typeof thisId === 'undefined') || (thisId == '')) { thisId = ''; }
        else {
             thisId.replace(/\D/g,'');
             thisId = parseInt(thisId);
        }
        numElements = numElements + 1;
        var elementNum = '';
        if (thisId == '') {
            elementNum = numElements;
        }
        else {
            elementNum = thisId;
        }
        if (shape == "circle") { 
            console.log("creating new " + shape + " at " + x + ", " + y + " in box " + boxId);
            
            var newDivs = '<div id="flowchartElement' + numElements + '" class="flowchartBox form-outer-box form-container-circle">' + 
			    '<img src="uml/circle.svg" class="form-circle svg" id="shape' + numElements + '"/>' + 
			    '<div class="form-circle-inner">' + 
			    '<div class="form-circle-boxholder">' + 
			    '<div class="form-circle-innerbox">' + 
			    '<div class="form-text-area"></div></div></div></div></div>';
			    
			$('#' + boxId).append(newDivs); //append the new circle to the parent box
            $("#flowchartElement" + numElements).eq(0).css({top: y, left: x, position:'absolute'});
            
            console.log("attempting to add new end points to element " + 'Element' + numElements );
            addNewEndpoints('Element' + numElements, ["RightMiddle", "LeftMiddle", "Top", "Bottom"]);
        }
        else if (shape == "note") {
            console.log("creating new " + shape + " at " + x + ", " + y + " in box " + boxId);
            
            var newDivs = '<div id="flowchartElement' + numElements + '" class="flowchartBox form-outer-box form-container-note">' + 
			    '<img src="uml/note.svg" class="form-note svg" id="shape' + numElements + '"/>' + 
			    '<div class="form-note-innerbox">' + 
			    '<div class="form-text-area"></div></div></div>';
			    
			$('#' + boxId).append(newDivs); //append the new note to the parent box

            $("#flowchartElement" + numElements).eq(0).css({top: y, left: x, position:'absolute'});
            
            addNewEndpoints('Element' + numElements, ["RightMiddle", "LeftMiddle", "Top", "Bottom"]);
        }
        else if (shape == "folder") {
            console.log("creating new " + shape + " at " + x + ", " + y + " in box " + boxId);
            
            var newDivs = '<div id="flowchartElement' + numElements + '" class="flowchartBox form-outer-box form-container-folder">' + 
			    '<img src="uml/folder.svg" class="form-folder svg" id="shape' + numElements + '"/>' + 
			    '<div class="form-folder-innerbox">' + 
			    '<div class="form-text-area"></div></div></div>';
			    
			$('#' + boxId).append(newDivs); //append the new folder to the parent box

            $("#flowchartElement" + numElements).eq(0).css({top: y, left: x, position:'absolute'});
            
            addNewEndpoints('Element' + numElements, ["RightMiddle", "LeftMiddle", "BottomLeft", "BottomRight", "Bottom"]);
        }
        else if (shape == "document") {
            console.log("creating new " + shape + " at " + x + ", " + y + " in box " + boxId);
            
            var newDivs = '<div id="flowchartElement' + numElements + '" class="flowchartBox form-outer-box form-container-document">' + 
			    '<img src="uml/document.svg" class="form-document svg" id="shape' + numElements + '"/>' + 
			    '<div class="form-document-innerbox">' + 
			    '<div class="form-text-area"></div></div></div>';
			    
			$('#' + boxId).append(newDivs); //append the new document to the parent box

            $("#flowchartElement" + numElements).eq(0).css({top: y, left: x, position:'absolute'});
            
            addNewEndpoints('Element' + numElements, ["RightMiddle", "LeftMiddle", "BottomLeft", "TopRight", "TopLeft", "Top"]);
        }
        else if (shape == "decision") {
            console.log("creating new " + shape + " at " + x + ", " + y + " in box " + boxId);
            
            var newDivs = '<div id="flowchartElement' + numElements + '" class="flowchartBox form-outer-box form-container-decision">' + 
			    '<img src="uml/decision.svg" class="form-decision svg" id="shape' + numElements + '"/>' + 
			    '<div class="form-decision-boxholder"><div class="form-decision-innerbox">' + 
			    '<div class="form-text-area"></div></div></div></div>';
			    
			$('#' + boxId).append(newDivs); //append the new document to the parent box

            $("#flowchartElement" + numElements).eq(0).css({top: y, left: x, position:'absolute'});
            
            addNewEndpoints('Element' + numElements, ["RightMiddle", "LeftMiddle", "Top", "Bottom"]);
        }
        
         updateDraggable();
         
         //set default color for new objects
         if (thisId == '') {
             changeColorDefault('flowchartElement' + numElements);
         }
         $('.ui-icon-gripsmall-diagonal-se').hide();
    }
    
    
    function createNewTable(boxId, x,y,tableName) { //create a new table for the database tool placed at x,y inside of element boxId
         numElements = numElements + 1;
         
        var newDiv = '<div class="dbChartContainer" id="dbContainer' + numElements + '"><div class="dbContainerTitle" id="dbTitle' + numElements + '">' + tableName + '</div></div>';
       
        $('#' + boxId).append(newDiv);
    	var cssObj = {
				top: y,
				left: x
		};
        $('#dbContainer' + numElements).css(cssObj);
        dbMenuReset(); //reset the context menus for the database tools
        $(".dbTableMenu").menu( "refresh" );
        
        console.log("new table created." + boxId + " " + x + " " + y);
        updateDraggable();
    }
    
    function createNewTableEntry(boxId) { //create a new entry for the database tool inside of element boxId
    
        console.log("New Table Entry created in Box " + boxId);
        numDbElements = numDbElements + 1;
        newElement = '<div class="dbChartTable" id="flowchartElement' + numDbElements + '"><strong>test1</strong></div>';
        // $('#' + boxId).append(newElement);
        

        var parent = $('#' + boxId).closest('.form-outer-box');
        console.log(parent)
        
        var oldHeight = parent.height();
        
        
        
            
            var newAddition = parent.append(newElement);
            var newAddHeight = parent.find('.dbChartTable').height();
            var newHeight = parent.height() + newAddHeight;
            parent.height(oldHeight).animate({height: newHeight});
            
            newAddition.fadeIn(2000);
            
            addNewEndpoints('Element' + numDbElements, ["RightMiddle"], ["LeftMiddle"]);
            
       

    }
    
    
  $(function() {

        $( '.flowchart-boundbox' ).mousemove( function( event ) {

            $(".form-outer-box").each(function() {
                var thisId = '#' + $(this).attr("id");
                if( isNear( $( thisId ), 40, event ) ) { //if the mouse is near an element, show the jsPlumb anchors
                    if (dragInProgress == "0") {  //only show elements if there isn't currently an endpoint being dragged
                        instance.selectEndpoints( {element:$(this)} ).setVisible(true,true);
                        
                    }
                
                
                
                } else {
                    if (dragInProgress == "0") { //only hide elements if there isn't currently an endpoint being dragged
                        
                        instance.selectEndpoints( {element:$(this)} ).setVisible(false,true);
                       
                    }

                    //not near do nothing
                                   
                };
            });
        
        } );           
        
        
        


    $(".flowchart-boundbox").mousedown(function(e){ 
        
        //track the mouse position for the popup context menu
        currentMousePos = {
                my: "left top",
                at: "left bottom",
                of: e,
                collision: "fit"
              }
              
              
        if( e.which == 3 ) {  //right click



          console.log("MOUSE DOWN DETECTED IN ");
          if (e.target.id != "flowchart-demo") {
              activeContainerId = $(e.target).closest(".form-outer-box").attr("id");
          }
          else {
             activeContainerId = e.target.id;
          }
          console.log(activeContainerId);
          if ($(e.target).closest(".form-container-circle").length) { //check if they activated a circle menu
              activeContainerShape = "circle";
          }
          else if ($(e.target).closest(".form-container-note").length) { //check if they activated a note menu
              activeContainerShape = "note";
          }
           else if ($(e.target).closest(".form-container-document").length) { //check if they activated a document menu
              activeContainerShape = "document";
          }
          else if ($(e.target).closest(".form-container-folder").length) { //check if they activated a folder menu
              activeContainerShape = "folder";
          }
          else if ($(e.target).closest(".form-container-decision").length) { //check if they activated a decision menu
              activeContainerShape = "decision";
          }
          else if ($(e.target).closest("._jsPlumb_overlay").length) { //this is a label
              activeContainerShape = "activeLabel";
          }
          else if ($(e.target).closest("._jsPlumb_connector").length) { //this is a connection between 2 elements
              activeContainerShape = "activeConnector";
          }
          else { //they didn't activate a shape menu.
              activeContainerShape = "";
          }
          
          return true; 
        }
        else if( e.which == 1 )  { //left button
            
            if ($(e.target).closest("._jsPlumb_overlay").length) { //this is a label
                activeContainerShape = "activeLabel";
                activeContainerId = $(e.target).closest("._jsPlumb_overlay").attr("id");
                setTimeout(function() {
                 $(".flowchart-boundbox").contextmenu("open", $(".flowchart-demo"));
              }, 50); // open on delay to avoid triggering close
            }
            else if ($(e.target).closest("._jsPlumb_connector").length) { //this is a connection between 2 elements
              activeContainerShape = "activeConnector";
              setTimeout(function() {
                 $(".flowchart-boundbox").contextmenu("open", $(".flowchart-demo"));
              }, 50); // open on delay to avoid triggering close
            }
            
            
               
              
            
        }
    });
   

  
 

     $(".flowchart-boundbox").contextmenu({

            position: function(event, ui){
                return(currentMousePos);
            },
            delegate: ".flowchart-demo",
            menu: [
                 //this will be replaced below
                ],
            select: function(event, ui) {
                if (ui.cmd == "createCircle") {
                    var parentOffset = $(this).parent().offset(); 
    		        var xLocation = (event.pageX - parentOffset.left);
    		        var yLocation = (event.pageY - parentOffset.top);
    		        
    		        requestNewElement("circle",activeContainerId,xLocation,yLocation); //create dialogs to start process of creating a new circle
                }
                else if (ui.cmd == "createNote") {
                    var parentOffset = $(this).parent().offset(); 
    		        var xLocation = (event.pageX - parentOffset.left);
    		        var yLocation = (event.pageY - parentOffset.top);
    		        
    		        requestNewElement("note",activeContainerId,xLocation,yLocation); //create dialogs to start process of creating a new note
                }
                else if (ui.cmd == "createFolder") {
                    var parentOffset = $(this).parent().offset(); 
    		        var xLocation = (event.pageX - parentOffset.left);
    		        var yLocation = (event.pageY - parentOffset.top);
    		        
    		        requestNewElement("folder",activeContainerId,xLocation,yLocation); //create dialogs to start process of creating a new folder
                }
                else if (ui.cmd == "createDocument") {
                    var parentOffset = $(this).parent().offset(); 
    		        var xLocation = (event.pageX - parentOffset.left);
    		        var yLocation = (event.pageY - parentOffset.top);
    		        
    		        requestNewElement("document",activeContainerId,xLocation,yLocation); //create dialogs to start process of creating a new document
                }
                else if (ui.cmd == "createDecision") {
                    var parentOffset = $(this).parent().offset(); 
    		        var xLocation = (event.pageX - parentOffset.left);
    		        var yLocation = (event.pageY - parentOffset.top);
    		        
    		        requestNewElement("decision",activeContainerId,xLocation,yLocation); //create dialogs to start process of creating a new decision
                }
                else if (ui.cmd == "changeColor") {
                    var thisDialog = "dialog-dbEditor";
    		    	changeDialogTitle(thisDialog,"Choose a Color");
    		
        			addDialogInfo(thisDialog," ");
        			addDialogColorPicker(thisDialog, 'Color:', 'tableColor', 'color', lastColor);
    					$("#" + thisDialog).dialog({
    						resizable: false,
    						height: 210,
    						width: 395,
    						modal: true,
    						buttons: {
    							"Change Color": function() {
    							    var tableColor = $('#tableColor').val();
    							    lastColor = tableColor;
    							    changeObjectColor(activeContainerId,tableColor);
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
            
                }
                else if (ui.cmd == "editText") {  
                    console.log("changing text");
                    var thisDialog = "wysiwyg";
                    $("#" + thisDialog).dialog({
    						height: 410,
    						width: 495,
    						modal: false,
    						open: function() {
    						    flowchartLoadText(activeContainerId);
    						},
    			
    						buttons: {
    							"Add Text": function() {
    							    console.log($('#wysiwygText').val());
    							    flowchartAddText(activeContainerId,$('#wysiwygText').val());
    								$(this).dialog("close");
    							
    							
    							},
    							Cancel: function() {
    								$(this).dialog("close");
    								
    				
    							}
    						}
    			    });
                 	$('#wysiwygText').tinymce({
                 		plugins:  [
                            "code",
                            "link",
                            "textcolor",
                        ],
                 		menubar:false,
                 		toolbar:"undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link | forecolor backcolor | code",
                 	});
    	
    	
                }
                else if (ui.cmd == "addLabel") {
                    console.log("adding label");
                    if (!connectionMap[activeConnection.id]) {
                        connectionMap[activeConnection.id] = defaultConnection; //apply the default values to an unmapped connection
                    }
                    var thisDialog = "dialog-dbEditor";
        			changeDialogTitle(thisDialog,"Enter Label");
        		
        			addDialogInfo(thisDialog," ");
        			addDialogQuestion (thisDialog, 'Label:', 'newLabel', 'label'); //add text field to get table name
    				$("#" + thisDialog).dialog({
    					resizable: false,
    					height: 210,
    					width: 395,
    					modal: true,
    					buttons: {
    						"Add Label": function() {
    						    var theLabel = $('#newLabel').val();
    						    theLabel = '<strong>' + theLabel + '</strong>'; //bolden the labels for readability
    						    if (connectionMap[activeConnection.id].labels == 0) { //there are no labels yet
                                    activeConnection.addOverlay([ "Label", {label:theLabel, id:"label1", location:.2}]); 
                                    var newElement = activeConnection.getOverlay("label1").getElement(); //get the element of the new label
                                    $(newElement).attr("connector", activeConnection.id); //set some attributes on this element for use in identifying it
                                    $(newElement).attr("label", "1");
                                    connectionMap[activeConnection.id] = { direction: connectionMap[activeConnection.id].direction, location: connectionMap[activeConnection.id].location, labels:1, label1:theLabel, label2:connectionMap[activeConnection.id].label2, foldback:connectionMap[activeConnection.id].foldback, paintStyle:connectionMap[activeConnection.id].paintStyle, };
            
                                }
                                else if (connectionMap[activeConnection.id].labels == 1) { //there is 1 label so this is label 2
                                console.log("ACTIVE CONNECTION ID: " + activeConnection.id);
                                    activeConnection.addOverlay([ "Label", {label:theLabel, id:"label2", location:.8}]); 
                                    var newElement = activeConnection.getOverlay("label2").getElement(); //get the element of the new label
                                    $(newElement).attr("connector", activeConnection.id);//set some attributes on this element for use in identifying it
                                    $(newElement).attr("label", "2");
                                    connectionMap[activeConnection.id] = { direction: connectionMap[activeConnection.id].direction, location: connectionMap[activeConnection.id].location, labels:2, label1:connectionMap[activeConnection.id].label1, label2:theLabel, foldback:connectionMap[activeConnection.id].foldback, paintStyle:connectionMap[activeConnection.id].paintStyle, };
            
                                }
    							$(this).dialog("close");
    							removeDialogInfo(thisDialog);
    			            	removeDialogQuestion(thisDialog);
    						
    						},
    						Cancel: function() {
    							$(this).dialog("close");
    							removeDialogInfo(thisDialog);
    			            	removeDialogQuestion(thisDialog);
    			
    						}
    					}
    				});
        					
    					
                    
                    
                    
                    //these are test outputs
                    // var thisLabel = activeConnection.getOverlay("label1");
                    // console.log("Label is currently " + thisLabel.getLabel());



                }
                else if (ui.cmd == "reverseDirection") {
                    var thisArrow = activeConnection.getOverlay("arrow");
                    activeConnection.removeOverlay("arrow");
                    if (!connectionMap[activeConnection.id]) {
                        connectionMap[activeConnection.id] = defaultConnection; //apply the default values to an unmapped connection
                    }
                    if (connectionMap[activeConnection.id].direction == -1) {
                        activeConnection.addOverlay([ "Arrow", {direction:1, id:"arrow", location: 1, foldback:connectionMap[activeConnection.id].foldback, paintStyle:connectionMap[activeConnection.id].paintStyle}]); 
                        connectionMap[activeConnection.id] = { direction: 1, location: 1, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:connectionMap[activeConnection.id].foldback, paintStyle:connectionMap[activeConnection.id].paintStyle, };
                    }
                    else {
                        activeConnection.addOverlay([ "Arrow", {direction:-1, id:"arrow", location: 0, foldback:connectionMap[activeConnection.id].foldback, paintStyle:connectionMap[activeConnection.id].paintStyle, }]); 
                        connectionMap[activeConnection.id] = { direction:-1, location: 0, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:connectionMap[activeConnection.id].foldback, paintStyle:connectionMap[activeConnection.id].paintStyle, };
                    }
                    
                    
                }
                else if (ui.cmd == "changeArrow") {
                    var thisArrow = activeConnection.getOverlay("arrow");
                    activeConnection.removeOverlay("arrow");
                    if (!connectionMap[activeConnection.id]) {
                        connectionMap[activeConnection.id] = defaultConnection; //apply the default values to an unmapped connection
                    }
                   
                    if (ui.item.data().style == "standard") {
                        if (ui.item.data().fill == true) {
                            activeConnection.addOverlay([ "Arrow", {direction:connectionMap[activeConnection.id].direction, id:"arrow", location:connectionMap[activeConnection.id].location, foldback:0.4, paintStyle:{stokeStyle: arrowColor, fillStyle: arrowColor},}]); 
                            connectionMap[activeConnection.id] = {direction:connectionMap[activeConnection.id].direction, location:connectionMap[activeConnection.id].location, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:0.4, paintStyle:{stokeStyle: arrowColor, fillStyle: arrowColor}};
                        }
                        else {
                            activeConnection.addOverlay([ "Arrow", {direction:connectionMap[activeConnection.id].direction, id:"arrow", location:connectionMap[activeConnection.id].location, foldback:0.4, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"}}]); 
                            connectionMap[activeConnection.id] = {direction:connectionMap[activeConnection.id].direction, location:connectionMap[activeConnection.id].location, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:0.4, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"}};

                        }
                    }
                    else if (ui.item.data().style == "closed") {
                        if (ui.item.data().fill == true) {
                            activeConnection.addOverlay([ "Arrow", {direction:connectionMap[activeConnection.id].direction, id:"arrow", location:connectionMap[activeConnection.id].location, foldback:1, paintStyle:{stokeStyle: arrowColor, fillStyle: arrowColor},}]); 
                            connectionMap[activeConnection.id] = {direction:connectionMap[activeConnection.id].direction, location:connectionMap[activeConnection.id].location, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:1, paintStyle:{stokeStyle: arrowColor, fillStyle: arrowColor},};
                        }
                        else {
                            activeConnection.addOverlay([ "Arrow", {direction:connectionMap[activeConnection.id].direction, id:"arrow", location:connectionMap[activeConnection.id].location, foldback:1, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"},}]); 
                            connectionMap[activeConnection.id] = {direction:connectionMap[activeConnection.id].direction, location:connectionMap[activeConnection.id].location, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:1, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"},};

                        }
                    }
                    else if (ui.item.data().style == "diamond") {
                        if (ui.item.data().fill == true) {

                            activeConnection.addOverlay([ "Arrow", {direction:connectionMap[activeConnection.id].direction, id:"arrow", location:connectionMap[activeConnection.id].location, foldback:2, paintStyle:{stokeStyle: arrowColor, fillStyle: arrowColor},}]); 
                            connectionMap[activeConnection.id] = {direction:connectionMap[activeConnection.id].direction, location:connectionMap[activeConnection.id].location, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:2, paintStyle:{stokeStyle: arrowColor, fillStyle: arrowColor},};
                        }
                        else {
                            activeConnection.addOverlay([ "Arrow", {direction:connectionMap[activeConnection.id].direction, id:"arrow", location:connectionMap[activeConnection.id].location, foldback:2, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"},}]); 
                            connectionMap[activeConnection.id] = {direction:connectionMap[activeConnection.id].direction, location:connectionMap[activeConnection.id].location, labels:connectionMap[activeConnection.id].labels, label1:connectionMap[activeConnection.id].label1, label2:connectionMap[activeConnection.id].label2, foldback:2, paintStyle:{stokeStyle: arrowColor, fillStyle: "white"},};
  
                        }
                    }
                   
                    
                    
                }
                else if (ui.cmd == "changeLabel") {
                    //first we have to determine if this is label 1 or 2
                    console.log("active label id: " + activeContainerId);
                    var thisElement = $('#' + activeContainerId);
                    var connectorId = thisElement.attr("connector");
                    var labelNumber = thisElement.attr("label");
                    
                    // console.log(thisElement.attr("label"));
                    // console.log(thisElement.attr("connector"));
                    
                    

                    //this is how we get the ID of each connection
                    // instance.select().each(function(connection) {
                        
                    //     console.log(connection.id)
                               
                    //  });

                    
                    
                    var thisDialog = "dialog-dbEditor";
        			changeDialogTitle(thisDialog,"Enter New Label");
        		
        			addDialogInfo(thisDialog," ");
        			addDialogQuestion (thisDialog, 'Label:', 'newLabel', 'label'); //add text field to get table name
        			$('#newLabel').val($('#' + activeContainerId).text());
    				$("#" + thisDialog).dialog({
    					resizable: false,
    					height: 210,
    					width: 395,
    					modal: true,
    					buttons: {
    						"Change Label": function() {
    						    var theLabel = $('#newLabel').val();
    						    theLabel = '<strong>' + theLabel + '</strong>'; //bolden the labels for readability
                                $('#' + activeContainerId).html(theLabel);
                                //add data to connection map
                                if (labelNumber == 1) { 
                                    connectionMap[connectorId] = {direction:connectionMap[connectorId].direction, location:connectionMap[connectorId].location, labels:connectionMap[connectorId].labels, label1:theLabel, label2:connectionMap[connectorId].label2, foldback:connectionMap[connectorId].foldback, paintStyle:connectionMap[connectorId].paintStyle,};
                                }
                                else if (labelNumber == 2) {
                                    connectionMap[connectorId] = {direction:connectionMap[connectorId].direction, location:connectionMap[connectorId].location, labels:connectionMap[connectorId].labels, label1:connectionMap[connectorId].label1, label2:theLabel, foldback:connectionMap[connectorId].foldback, paintStyle:connectionMap[connectorId].paintStyle,};
                                }
    							$(this).dialog("close");
    							removeDialogInfo(thisDialog);
    			            	removeDialogQuestion(thisDialog);
    						
    						},
    						Cancel: function() {
    							$(this).dialog("close");
    							removeDialogInfo(thisDialog);
    			            	removeDialogQuestion(thisDialog);
    			
    						}
    					}
    				});
        					
    					
                    
                }
                else if (ui.cmd == "removeLabel") {
                    //first we have to determine if this is label 1 or 2
                    console.log("active label id: " + activeContainerId);
                    var thisElement = $('#' + activeContainerId);
                    var connectorId = thisElement.attr("connector");
                    var labelNumber = thisElement.attr("label");
                    instance.select().each(function(connection) {
                      if (connection.id === connectorId) {
                          activeConnection = connection;
                      }
                    });


                    
                    console.log(activeConnection);
                    console.log(activeConnection.id);
                    
                    if (labelNumber == 2) { //if this is label 2 we know there were 2 labels so we just remove it and set the number of labels to 1
                    activeConnection.removeOverlay("label2");
                    connectionMap[connectorId] = {direction:connectionMap[connectorId].direction, location:connectionMap[connectorId].location, labels:1, label1:connectionMap[connectorId].label1, label2:'', foldback:connectionMap[connectorId].foldback, paintStyle:connectionMap[connectorId].paintStyle,};

                    }
                     else if (labelNumber == 1) { //if this was label 1, there could have been a 2nd label and if so we need to move it to the 1st position
                        if (connectionMap[connectorId].labels == 2) { //there were 2 labels so delete label 1 and move label 2 to label 1
                            var label2Contents = connectionMap[connectorId].label2;
                            activeConnection.removeOverlay("label2");
                            $('#' + activeContainerId).html(label2Contents); //set label 1 to what label 2 used to be
                            connectionMap[connectorId] = {direction:connectionMap[connectorId].direction, location:connectionMap[connectorId].location, labels:1, label1:label2Contents, label2:'', foldback:connectionMap[connectorId].foldback, paintStyle:connectionMap[connectorId].paintStyle,};

                            
                        }
                        else if (connectionMap[connectorId].labels == 1) { //there was 1 label so just delete it
                            activeConnection.removeOverlay("label1");
                            connectionMap[connectorId] = {direction:connectionMap[connectorId].direction, location:connectionMap[connectorId].location, labels:0, label1:'', label2:'', foldback:connectionMap[connectorId].foldback, paintStyle:connectionMap[connectorId].paintStyle,};
                        }
                     }
                }
            },
            beforeOpen: function(event, ui) {

                if ((activeContainerShape == "circle") || (activeContainerShape == "note") || (activeContainerShape == "document") || (activeContainerShape == "folder") || (activeContainerShape == "decision")) { //they activated a circle, note, document, folder, decision menu
                    $(".flowchart-boundbox").contextmenu("replaceMenu", [
                        {title: '<span class="contextMenuItem">Edit Text</span>', cmd: "editText"},
                        {title: '<span class="contextMenuItem">Change Color</span>', cmd: "changeColor"},
                    
                    ]);
                }
                else if (activeContainerShape == "activeConnector") { //the mouse is over a connector
                    $(".flowchart-boundbox").contextmenu("replaceMenu", [
                        {title: '<span class="contextMenuItem">Add Label</span>', cmd: "addLabel"},
                        // {title: '<span class="contextMenuItem">Edit Label</span>', cmd: "changeLabel"},
                        {title: '<span class="contextMenuItem">Change Arrow Style</span>', children: [
                            {title: '<span class="contextMenuItem">Standard Arrow</span>', cmd: "changeArrow", data: {style: "standard", fill:false}},
                            {title: '<span class="contextMenuItem">Standard Arrow (filled)</span>', cmd: "changeArrow", data: {style: "standard", fill:true}},
                            {title: '<span class="contextMenuItem">Closed Arrow</span>', cmd: "changeArrow", data: {style: "closed", fill:false}},
                            {title: '<span class="contextMenuItem">Closed Arrow (filled)</span>', cmd: "changeArrow", data: {style: "closed", fill:true}},
                            {title: '<span class="contextMenuItem">Diamond</span>', cmd: "changeArrow", data: {style: "diamond", fill:false}},
                            {title: '<span class="contextMenuItem">Diamond (filled)</span>', cmd: "changeArrow", data: {style: "diamond", fill:true}},
                        ]},
                        {title: '<span class="contextMenuItem">Reverse Arrow Direction</span>', cmd: "reverseDirection"},
                        
                    ]);
                    if (!connectionMap[activeConnection.id] || connectionMap[activeConnection.id].labels == 0) { //there are no labels they can add one
                        //$(".flowchart-boundbox").contextmenu("showEntry", "changeLabel", false);
                        $(".flowchart-boundbox").contextmenu("showEntry", "addLabel", true);
                    }
                    else if (connectionMap[activeConnection.id] && connectionMap[activeConnection.id].labels < 2) { //if there is 1 label they can add one
                        $(".flowchart-boundbox").contextmenu("showEntry", "addLabel", true);
                        //$(".flowchart-boundbox").contextmenu("showEntry", "changeLabel", true);
                    }
                    else { //if there are 2 labels they can't add a label
                        //$(".flowchart-boundbox").contextmenu("showEntry", "changeLabel", true);
                        $(".flowchart-boundbox").contextmenu("showEntry", "addLabel", false);
                    }
                    
                }
                else if (activeContainerShape == "activeLabel") { //the mouse is over a label
                    $(".flowchart-boundbox").contextmenu("replaceMenu", [
                        
                         {title: '<span class="contextMenuItem">Edit Label</span>', cmd: "changeLabel"},
                         {title: '<span class="contextMenuItem">Delete Label</span>', cmd: "removeLabel"},

                        
                    ]);
                }
                else { //this is the regular menu. 
                     $(".flowchart-boundbox").contextmenu("replaceMenu", [
                        {title: '<span class="contextMenuItem">Create New...</span>', children: [
                            {title: '<span class="contextMenuItem">Circle</span>', cmd: "createCircle"},
                            {title: '<span class="contextMenuItem">Note</span>', cmd: "createNote"},
                            {title: '<span class="contextMenuItem">Folder</span>', cmd: "createFolder"},
                            {title: '<span class="contextMenuItem">Document</span>', cmd: "createDocument"},
                            {title: '<span class="contextMenuItem">Decision</span>', cmd: "createDecision"},
                        ]}
                    ]);
                }
            }
        
    });
    

         
//     $(".dbTableMenu").menu({
// 		select: function(event, ui) {
// 		    if ($(ui.item).attr("id") == "db-NewEntry") {
// 		        console.log("Create New Table Entry requested")
		        
// 		       createNewTableEntry(activeContainerId);
		 
		     

// 		    }
// 			$(".dbTableMenu").hide();

			
			
// 		}
// 	});

// 	dbMenuReset(); //reset the context menus for the database tools


	
});                      
            
            
            
            
            
            
            
jsPlumb.ready(function () {

 

    
    instance.registerConnectionType("basic", basicType);

    // this is the paint style for the connecting lines..
    
       var init = function (connection) {
            //connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
        };

    var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
        for (var i = 0; i < sourceAnchors.length; i++) {
            var sourceUUID = toId + sourceAnchors[i];
            instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
                anchor: sourceAnchors[i], uuid: sourceUUID
            });
        }
        // for (var j = 0; j < targetAnchors.length; j++) {
        //     var targetUUID = toId + targetAnchors[j];
        //     instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
        // }
    };

    // suspend drawing and initialise.
    instance.batch(function () {


       
        // listen for new connections; initialise them the same way we initialise the connections at startup.
        instance.bind("connection", function (connInfo, originalEvent) {
            init(connInfo.connection);
        });

        // make all the window divs draggable
        
        
         updateDraggable();
        

       /* instance.draggable($(".flowchart-demo .window"), {
            grid: [20, 20],
          containment:"parent"
        });*/

        // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
        // method, or document.querySelectorAll:
        //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });


        //
        // listen for clicks on connections
        //
        instance.bind("click", function (conn, originalEvent) {
          // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
             //   instance.detach(conn);
            //conn.toggleType("basic");
        });
        instance.bind("mousedown", function (conn, originalEvent) {
          activeConnection = conn;
          console.log(activeConnection.id)
        });

        instance.bind("connectionDrag", function (connection) {
            console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
            console.log(connection.sourceId)
        });

        instance.bind("connectionDragStop", function (connection) {
            console.log("connection " + connection.id + " was dragged");
        });

        instance.bind("connectionMoved", function (params) {
            console.log("connection " + params.connection.id + " was moved");
            console.log(params.newSourceId);
            console.log(params.originalSourceId);
            console.log(params.newTargetId);
            console.log(params.originalTargetId);
            console.log(params.originalTargetEndpoint);
            
        });
    });

    //jsPlumb.fire("jsPlumbDemoLoaded", instance);


    // $(document).ready(function() {
    //     $('#flowchart-demo').dblclick(function(e) {
    //         /*jsPlumb.repaintEverything();
    //         console.log("DBL");
    //         $("#flowchartWindow1").parent().css({position: 'relative'});
    //         $("#flowchartWindow1").css({top: 200, left: 200, position:'absolute'});
    //         instance.repaintEverything();*/
    //         var newState = $('<div>').attr('id', 'state').addClass('item');
		
    // 		var title = $('<div>').addClass('title').text('State ');
    // 		var connect = $('<div>').addClass('connect');
    		
    // 		newState.css({
    // 		  'top': e.pageY,
    // 		  'left': e.pageX
    // 		});
    		
    // 		newState.append(title);
    // 		newState.append(connect);
    		
    // 		$('#container').append(newState);
    		
    // 		jsPlumb.makeTarget(newState, {
    // 		  anchor: 'Continuous'
    // 		});
    		
    // 		jsPlumb.makeSource(connect, {
    // 		  parent: newState,
    // 		  anchor: 'Continuous'
    // 		});		
    		
    // 		jsPlumb.draggable(newState, {
    // 		  containment: 'parent'
    // 		});
    // 		newState.dblclick(function(e) {
    // 		  jsPlumb.detachAllConnections($(this));
    // 		  $(this).remove();
    // 		  e.stopPropagation();
    // 		});		
    //     });
    
    
    
    // });
    
    
    
    
    
});




function isNear( $element, distance, event ) {
   if ($element.length < 1) { 
       //do nothing 
    }
   else {
        var left = $element.offset().left - distance,
            top = $element.offset().top - distance,
            right = left + $element.width() + ( 2 * distance ),
            bottom = top + $element.height() + ( 2 * distance ),
            x = event.pageX,
            y = event.pageY;
            
        return ( x > left && x < right && y > top && y < bottom );
    }
    
};
function showAllConnections() {
    $(".form-outer-box").each(function() {
           instance.selectEndpoints( {element:$(this)} ).setVisible(true,true);
    });
                    
}
function hideAllConnections() {
    $(".form-outer-box").each(function() {
           instance.selectEndpoints( {element:$(this)} ).setVisible(false,true);
    });
                    
}



function flowchartLoadText(activeContainerId) {
    var insideHtml = $('#' + activeContainerId).find('.form-text-area').html();
    $('#wysiwygText').val(insideHtml);
}
function flowchartAddText(activeContainerId,addText) {
    $('#' + activeContainerId).find('.form-text-area').html(addText);
}


//key binding for test purposes
$(document).on('keydown', function(e) {


	if (e.altKey && (String.fromCharCode(e.which) === 'r' || String.fromCharCode(e.which) === 'R')) { //ALT-R keypress

	 	console.log("keydown acknowledged");
	 	console.log("ELEMENTS:");
	 	$('.flowchartBox').each(function() {
	 	    
	 	    var thisId = $(this).attr("id");
	 	    var thisType = $.grep(this.className.split(" "), function(v, i){
               return v.indexOf('form-container') === 0;
            }).join();
            var thisX = $(this).position().left;
            var thisY = $(this).position().top;
            var thisWidth = $(this).width();
            var thisHeight = $(this).height();
            var thisColor = $(this).find(".svg").css("fill");
            var thisText = $(this).find('.form-text-area').html();
            
            console.log(thisId + " " + thisType + " " + thisX + " " +thisY + " " + thisWidth + " " + thisHeight + " " + thisColor + " " + thisText);
            savedElements.push({id: thisId, type: thisType, x: thisX, y: thisY, width: thisWidth, height: thisHeight, color: thisColor, text: thisText});
	 	    
	 	    console.log('---')
	 	});
	 	console.log("CONNECTIONS:");
	 	instance.select().each(function(connection) {
	 	    
	 	    // //this was all nonsense.
	 	 //   console.log(connection.endpoints[0]._jsPlumb.uuid)
             var thisId = connection.id;
             var thisSource = connection.source.id;
             var thisTarget = connection.target.id;
    //         console.log(thisId + " " + thisSource + " " + thisTarget + " ");
            var thisAnchors = $.map(connection.endpoints, function(endpoint) {

                return ([[endpoint.anchor.x, 
                endpoint.anchor.y, 
                endpoint.anchor.orientation[0], 
                endpoint.anchor.orientation[1],
                endpoint.anchor.offsets[0],
                endpoint.anchor.offsets[1]]]);
        
            });
    //         savedConnections.push({id: thisId, source: thisSource, target: thisTarget, anchors: thisAnchors});
             savedConnections.push({id: thisId, source: thisSource, target: thisTarget, uuids:[connection.endpoints[0]._jsPlumb.uuid,connection.endpoints[1]._jsPlumb.uuid],  anchors: thisAnchors}); //we only really need to save uuids
        });
	 }
	 
	 
	 if (e.altKey && (String.fromCharCode(e.which) === 'k' || String.fromCharCode(e.which) === 'K')) { //ALT-K keypress
	    console.log("deleting everything");
	    $('.flowchartBox').each(function() {
	 	    
	 	    var thisId = $(this).attr("id");
	        instance.remove(thisId);
    	});
    	numElements = 0;
    	//connectionMap = '';
	}
if (e.altKey && (String.fromCharCode(e.which) === 'g' || String.fromCharCode(e.which) === 'G')) { //ALT-G keypress	
    console.log("ALT G TEST FUNCTION");
    var testObject = $(".flowchartBox").eq(0);
    moveObject(testObject.attr("id"),testObject.position().left-10,testObject.position().top-10);
}
if (e.altKey && (String.fromCharCode(e.which) === 'h' || String.fromCharCode(e.which) === 'H')) { //ALT-H keypress	
    console.log("ALT H TEST FUNCTION");
}
	
	if (e.altKey && (String.fromCharCode(e.which) === 'j' || String.fromCharCode(e.which) === 'J')) { //ALT-J keypress
	    var currentObj = {};
	    for (var i = 0; i < savedElements.length; i++) {
	        currentObj = savedElements[i];
	        addObject("flowchart-demo",currentObj.id,currentObj.type,currentObj.x,currentObj.y,currentObj.width,currentObj.height,currentObj.color,currentObj.text);
	    }
        
	    for (i = 0; i < savedConnections.length; i++) {
	        currentObj = savedConnections[i];
	        var thisNewConnection = instance.connect({
	            source:savedConnections[i].source,
	            target:savedConnections[i].target,
	            //anchors: savedConnections[i].anchors,
	            uuids:savedConnections[i].uuids,
	            paintStyle: connectorPaintStyle,
	            connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
	        });
	        var newId = savedConnections[i].id;
	        thisNewConnection.id = newId;
	        if (connectionMap[newId]) {
	            //first add the old arrow
                updateConnectionArrow(newId);
                console.log("updating arrow of " + newId);
                //then add the old labels
                if (connectionMap[newId].labels == 1) { //there was 1 label
                console.log("updating label of " + newId);
                    addConnectionLabel(newId, connectionMap[newId].label1, 1);
                }
                else if (connectionMap[newId].labels == 2) { //there were 2 labels
                    addConnectionLabel(newId, connectionMap[newId].label1, 1);
                    addConnectionLabel(newId, connectionMap[newId].label2, 2);
                }
	        }
	    }
	   // connectionMap.forEach(function(entry) {
    //         console.log(entry);
    //         activeConnection.removeOverlay("label2");
    //         activeConnection.addOverlay([ "Label", {label:theLabel, id:"label1", location:.2}]); 
    //         var newElement = activeConnection.getOverlay("label1").getElement(); //get the element of the new label
    //         $(newElement).attr("connector", activeConnection.id); //set some attributes on this element for use in identifying it
    //         $(newElement).attr("label", "1");
            
    //         activeConnection.removeOverlay("arrow");
    //         activeConnection.addOverlay([ "Arrow", {direction:1, id:"arrow", location: 1, foldback:connectionMap[activeConnection.id].foldback, paintStyle:connectionMap[activeConnection.id].paintStyle}]); 


    //     });
	    
	}
	
});


//Functions for the API


function getConnectionFromId(connectionId) { //takes a connection ID and returns a connection or returns false if no connection is found
    var theConnection = '';
    instance.select().each(function(connection) {
        if (connection.id === connectionId) {
          theConnection = connection;
        }
    });
    if (theConnection) {
        return(theConnection);
    }
    else {
        return(false);
    }

}



function addConnectionLabel(connectionId, theLabel, labelNumber) { //takes a connection, a label (html) a labelNumber (1 or 2)
    var connection = getConnectionFromId(connectionId);
    var labelId = "label" + labelNumber;
    var labelLocation = .2;
    if (labelNumber == 2) {
        labelLocation = .8;
    }
    connection.removeOverlay(labelId); //remove the old label if it exists
    connection.addOverlay([ "Label", {label:theLabel, id:labelId, location:labelLocation}]); 
    var newElement = connection.getOverlay(labelId).getElement(); //get the element of the new label
    $(newElement).attr("connector", connection.id); //set some attributes on this element for use in identifying it
    $(newElement).attr("label", labelNumber);
    //update connection map
    if (labelNumber == 1) {
        var numLabels = 1;
        if (connectionMap[connection.id].labels == 2) { //if there were 2 labels then we're just replacing label 1 so there are still 2 labels
            numLabels = 2;
        }
        connectionMap[connection.id] = { direction: connectionMap[connection.id].direction, location: connectionMap[connection.id].location, labels:numLabels, label1:theLabel, label2:connectionMap[connection.id].label2, foldback:connectionMap[connection.id].foldback, paintStyle:connectionMap[connection.id].paintStyle, };
    }
    else if (labelNumber == 2) {
        connectionMap[connection.id] = { direction: connectionMap[connection.id].direction, location: connectionMap[connection.id].location, labels:2, label1:connectionMap[connection.id].label1, label2:theLabel, foldback:connectionMap[connection.id].foldback, paintStyle:connectionMap[connection.id].paintStyle, };
    }
}

function removeConnectionLabel(connectionId, labelNumber) { //takes a connection and a label number, if the label number is 1 and there are 2 labels, moves label 2 to label 1
    var connection = getConnectionFromId(connectionId);
    if (labelNumber == 2) { //if this is label 2 we know there were 2 labels so we just remove it and set the number of labels to 1
        connection.removeOverlay("label2");
        connectionMap[connection.id] = {direction:connectionMap[connection.id].direction, location:connectionMap[connection.id].location, labels:1, label1:connectionMap[connection.id].label1, label2:'', foldback:connectionMap[connection.id].foldback, paintStyle:connectionMap[connection.id].paintStyle,};

        }
        else if (labelNumber == 1) { //if this was label 1, there could have been a 2nd label and if so we need to move it to the 1st position
            if (connectionMap[connection.id].labels == 2) { //there were 2 labels so delete label 1 and move label 2 to label 1
                var label2Contents = connectionMap[connection.id].label2;
                activeConnection.removeOverlay("label2");
                $('#' + activeContainerId).html(label2Contents); //set label 1 to what label 2 used to be
                connectionMap[connection.id] = {direction:connectionMap[connection.id].direction, location:connectionMap[connection.id].location, labels:1, label1:label2Contents, label2:'', foldback:connectionMap[connection.id].foldback, paintStyle:connectionMap[connection.id].paintStyle,};

                
            }
            else if (connectionMap[connection.id].labels == 1) { //there was 1 label so just delete it
                activeConnection.removeOverlay("label1");
                connectionMap[connection.id] = {direction:connectionMap[connection.id].direction, location:connectionMap[connection.id].location, labels:0, label1:'', label2:'', foldback:connectionMap[connection.id].foldback, paintStyle:connectionMap[connection.id].paintStyle,};
            }
        }
}

function updateConnectionArrow(connectionId) { //updates the connection arrow from the connection map (to get it out of default position)
    var connection = getConnectionFromId(connectionId);
    console.log('direction: ' + connectionMap[connectionId].direction + ' id: ' + "arrow" + ' location: ' + connectionMap[connectionId].location + ' foldback: ' + connectionMap[connectionId].foldback + ' paintStyle: ' +connectionMap[connectionId].paintStyle); 

    connection.removeOverlay("arrow");
	connection.addOverlay([ "Arrow", {direction:connectionMap[connectionId].direction, id:"arrow", location: connectionMap[connectionId].location, foldback:connectionMap[connectionId].foldback, paintStyle:connectionMap[connectionId].paintStyle}]); 

}

function addObject(boxId,objectId,typeClass,x,y,width,height,color,text) {
    
	        var thisShape = typeClass.substring(15); //cut off form-container-
	        console.log("creating new: " + thisShape + " " + objectId + " " + x + " " + y + " " + width + " " + height);
	        requestNewElement(thisShape,boxId,x,y,objectId);
	        
	        //wait for element creation, then change color, text, size
	        var interval_id = setInterval(function(){ //wait for terminal creation then check the sizes
						    
			     if ($("#" + objectId).find(".svg").length > 0){
			         // "exit" the interval loop with clearInterval command
			         clearInterval(interval_id);
			         changeObjectColor(objectId,color);
            	     changeObjectText(objectId,text);
            	     resizeObject(objectId,x,y,width,height);
			      }
			}, 200);
							
	        
}
function changeColorDefault(objectId) {
    var interval_id = setInterval(function(){ //wait for object creation to color object
         if ($("#" + objectId).find(".svg").length > 0){
	         // "exit" the interval loop with clearInterval command
	         clearInterval(interval_id);
	         changeObjectColor(objectId,defaultObjectColor);
	      }
	}, 200);
}
function changeObjectColor(objectId, newColor) {
        elementId = $('#' + objectId).find(".svg").attr("id");
       console.log(elementId + " " + newColor);
        //clear prior fills
        $('#' + elementId).find("path").removeAttr('fill');
        $('#' + elementId).removeAttr('fill');
        $('#' + elementId).find("circle").removeAttr('fill');
        $('#' + elementId).css('fill', newColor);
}
function changeObjectText(objectId, text) {
    $('#' + objectId).find('.form-text-area').html(text);
}
function resizeObject(objectId, x, y, width, height) { //resize an object to width, height, with a top position of y and a left position of x
    $('#' + objectId).width(width);
    $('#' + objectId).height(height);
    $('#' + objectId).css({top: y, x, position:'absolute'});
    instance.repaintEverything(); //all connections must be repainted
}
function addConnection(sourceId,targetId,anchorsList,paintStyle) {
    var thisNewConnection = instance.connect({
        source:sourceId,
        target:targetId,
        anchors: anchorsList,
        paintStyle: paintStyle,
        connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
        
    });
}
function moveObject(objectId,newX,newY) {
    $('#'+objectId).css({top: newY, left: newX, position:'absolute'});
    instance.repaintEverything(); //all connections must be repainted
    
}