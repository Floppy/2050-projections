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

  var rates_gdp = [ 0.037,        config.conv_gdp_rate,       config.cont_gdp_rate ];
  var rates_emissions = [ -0.028, config.conv_emissions_rate, config.cont_emissions_rate ];

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

	for(var i = milestones[phase]; i <= milestones[phase+1]; i++) {

	 plots[phase].push([i, 
						emissions(i - milestones[phase],
								  emissions_per_usd,
								  rates_emissions[phase],
								  rates_gdp[phase],
								  gdp_per_capita
								 )
					   ]);
	}
	years = milestones[phase+1] - milestones[phase];
	emissions_per_usd *= Math.pow(1 + rates_emissions[phase], years);
	gdp_per_capita *= Math.pow(1 + rates_gdp[phase], years);
  }

  $.plot($("#placeholder"), plots);




};

var update_controls = function(event, ui, config_var) {
  config[config_var] = parseFloat($( "#label-" + event.target.id).text());
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
	set_slider_value("impl-year", 'implementation', 2015);

	$( "#conv-gdp-rate" ).slider({
		max: 0.05,
		min: -0.05,
		step: 0.001,
    	change: function(event, ui) { update_controls(event, ui, 'conv_gdp_rate'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("conv-gdp-rate", 'conv_gdp_rate', 0.02);

	$( "#conv-emissions-rate" ).slider({
		max: 0.05,
		min: -0.05,
		step: 0.001,
    	change: function(event, ui) { update_controls(event, ui, 'conv_emissions_rate'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("conv-emissions-rate", 'conv_emissions_rate', -0.02);

	$( "#conv-year" ).slider({
		max: 2100,
		min: 2000,
    	change: function(event, ui) { update_controls(event, ui, 'convergence'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("conv-year", 'convergence', 2030);

	$( "#cont-gdp-rate" ).slider({
		max: 0.05,
		min: -0.05,
		step: 0.001,
    	change: function(event, ui) { update_controls(event, ui, 'cont_gdp_rate'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("cont-gdp-rate", 'cont_gdp_rate', 0.02);

	$( "#cont-emissions-rate" ).slider({
		max: 0.05,
		min: -0.05,
		step: 0.001,
    	change: function(event, ui) { update_controls(event, ui, 'cont_emissions_rate'); },
 		slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value("cont-emissions-rate", 'cont_emissions_rate', -0.02);
	
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

