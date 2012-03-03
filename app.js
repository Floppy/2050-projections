$(function () {
    var d1 = [];
    for (var i = 0; i < 14; i += 0.5)
        d1.push([i, Math.sin(i)]);

    var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

    // a null signifies separate line segments
    var d3 = [[0, 12], [7, 12], null, [7, 2.5], [12, 2.5]];
    
    $.plot($("#placeholder"), [ d1, d2, d3 ]);
});


// Initialise UI objects
$(function() {
	$( "#impl-year" ).slider({ 
		max: 2100,
		min: 2000,
		value: 2015,
    	change: function(event, ui) { /* render(); */ },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	$( "#conv-year" ).slider({ 
		max: 2100,
		min: 2000,
		value: 2030,
    	change: function(event, ui) { /* render(); */ },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	$( "#target-year" ).slider({ 
		max: 2100,
		min: 2000,
		value: 2050,
    	change: function(event, ui) { /* render(); */ },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	$( "#target-amount" ).slider({ 
		max: 10,
		min: 0,
		value: 1,
    	change: function(event, ui) { /* render(); */ },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
});
