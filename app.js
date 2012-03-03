var config = {
  origin: 2012,
  implementation: 2016,
  convergence: 2035,
  target_year: 2050
};

var render = function () {
  var origin = config.origin;
  var implementation = config.implementation;
  var convergence = config.convergence;
  var target_year = config.target_year;

  var milestones = [ origin, implementation, convergence, target_year ];

  var emissions_per_usd = 0.233;
  var gdp_per_capita = 35000;

  var g_y = 0.02;
  var g_x = - 0.01;

  var g_dash = -0.0126; // -0.042
  var g_dash_y = 0.02;

  var d1 = [];
  var d2 = [];
  var d3 = [];

  var plots = [ [], [], [] ];

  if(origin > implementation) {
	alert("origin > implementation");
  }
  if(implementation > convergence) {
	alert("wrong: implementation > convergence");
  }
  if(convergence > target_year) {
	alert("wrong");
  }

  var emissions = function(t, emissions_density_at_p0, emissions_density_change, growth, gdp_at_p0) {
	return emissions_density_at_p0 * Math.pow(1 + emissions_density_change, t) * gdp_at_p0 * Math.pow(1 + growth, t);
  };


  for(var phase = 0; phase <= 2; phase++) {
    // emissions_per_usd =
	// gdp_per_capita

	for(var i = milestones[phase]; i <= milestones[phase+1]; i++) {

	 plots[phase].push([i, 
						emissions(i - milestones[phase],
								  emissions_per_usd,
								  g_x,
								  g_y,
								  gdp_per_capita
								 )
					   ]);
	}
	years = milestones[phase+1] - milestones[phase];
	emissions_per_usd *= Math.pow(1 + g_x, years);
	gdp_per_capita *= Math.pow(1 + g_y, years);
  }

  for (var i = origin; i <= implementation; i += 1) {
    d1.push([i, emissions(i - origin, emissions_per_usd, g_x, g_y, gdp_per_capita)]);
  }


  years = implementation - origin;

  var x1 = emissions_per_usd * Math.pow(1 + g_x, years);
  var gdp_per_capita = gdp_per_capita * Math.pow(1 + g_y, years);

  for (var i = implementation; i <= convergence; i += 1) {
    d2.push([i, emissions(i - implementation, x1, g_dash, g_dash_y, gdp_per_capita )]);
  }




  var years = convergence - implementation;

  var x2 = x1 * Math.pow(1 + g_x, years);
  var gdp_per_capita = gdp_per_capita * Math.pow(1 + g_y, years);

  for (var i = convergence; i <= target_year; i += 1) {
    d3.push([i, emissions(i - convergence, x2, g_dash, g_dash_y, gdp_per_capita )]);
  }
  
//  $.plot($("#placeholder"), [ d1, d2, d3 ]);
  $.plot($("#placeholder"), plots);




};

var update_controls = function(event, ui, config_var) {
  config[config_var] = parseInt($( "#label-" + event.target.id).text());
  render();
}

var set_slider_value = function (name, config_var, value) {
	$( "#"+name ).slider( "option", "value", value );	
	$( "#label-"+name ).text(value);
	config[config_var] = value;
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
    	change: function(event, ui) { update_controls(event, ui, 'target_year'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("target-year", 2050);

	$( "#target-amount" ).slider({ 
		max: 10,
		min: 0,
        change: function(event, ui) { update_controls(event, ui, 'target_amount'); },
 	    slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("target-amount", 'target-amount', 1);

  render();
});

