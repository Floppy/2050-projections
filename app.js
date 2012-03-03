var config = {
  origin: 2012,
  implementation: 2016,
  convergence: 2035
};

var render = function () {
  var origin = config.origin;
  var implementation = config.implementation;
  var convergence = config.convergence;
  
  var emissions_per_usd = 0.233;
  var gdp_per_capita = 35000;

  var g_y = 0.02;
  var g_x = - 0.01;

  var g_dash = -0.0126; // -0.042
  var g_dash_y = 0.02;

  var d1 = [];
  var d2 = [];

  var emissions = function(t) {
	return emissions_per_usd * Math.pow(1 + g_x, t) * gdp_per_capita * Math.pow(1 + g_y, t);
  };

  for (var i = origin; i <= implementation; i += 1) {
    d1.push([i, emissions(i - origin)]);
  }

  var x1 = emissions_per_usd * Math.pow(1 + g_x, (implementation - origin));
  var gdp_per_capita = gdp_per_capita * Math.pow(1 + g_y, (implementation - origin));

  var emissions = function(t) {
	return x1 * Math.pow(1 + g_dash, t) * gdp_per_capita * Math.pow(1 + g_dash_y, t);
  };

  for (var i = implementation; i <= convergence; i += 1) {
    d2.push([i, emissions(i - implementation)]);
  }
  
  $.plot($("#placeholder"), [ d1, d2 ]);
};

var update_controls = function(event, ui, config_var) {
  config[config_var] = parseInt($( "#label-" + event.target.id).text());
  render();
}

var set_slider_value = function (name, value) {
	$( "#"+name ).slider( "option", "value", value );	
	$( "#label-"+name ).text(value);
}

// Initialise UI objects
$(function() {
	$( "#impl-year" ).slider({ 
		max: 2100,
		min: 2000,
      change: function(event, ui) { update_controls(event, ui, 'implementation'); },
 	  slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("impl-year", 2015);
	$( "#conv-year" ).slider({ 
		max: 2100,
		min: 2000,
    	change: function(event, ui) { update_controls(event, ui, 'convergence'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("conv-year", 2030);
	$( "#target-year" ).slider({ 
		max: 2100,
		min: 2000,
    	change: function(event, ui) { update_controls(event, ui, 'target'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("target-year", 2050);
	$( "#target-amount" ).slider({ 
		max: 10,
		min: 0,
        change: function(event, ui) { update_controls(event, ui, 'target'); }
 	    slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("target-amount", 1);

  render();
});
