var config = {
  origin: 2000,
  running: false,
  "bau-gdp-rate": 0.037,
  "bau-emissions-rate": -0.028
};

var alert_bad_inputs = function(phase, milestones) {
  alert("Milestone #" + phase.toString() + " (" + 
		milestones[phase].toString() + ") after milestone #" +
		(phase+1).toString() + " (" + 
		milestones[phase+1].toString() + ")");
}

var render = function () {
  if(!config.running) {
	return;
  }

  var phase_names = [ 'bau', 'conv', 'cont' ];
  
  var milestones = [ config['origin'], 
					 config['impl-year'], 
					 config['conv-year'], 
					 config['target-year']
				   ];

  var emissions_per_usd = 0.233;
  var gdp_per_capita = 35000;

  var rates_gdp = [ config['bau-gdp-rate'], 
					config['conv-gdp-rate'], 
					config['cont-gdp-rate'] 
				  ];
  var rates_emissions = [ config['bau-emissions-rate'], 
						  config['conv-emissions-rate'], 
						  config['cont-emissions-rate'] 
						];

  var plots = [ [] ];
  var plot = 0;

  // e_d_ == emissions density
  var emissions = function(t, e_d_base, e_d_change, gdp_base, gdp_growth) {
	return (
	  e_d_base * Math.pow(1 + e_d_change, t) * 
	  gdp_base * Math.pow(1 + gdp_growth, t)
	);
  };

  for(var phase = 0; phase <= 2; phase++) {
	if(milestones[phase] > milestones[phase+1]) {
	  alert_bad_inputs(phase, milestones);
	  return;
	}

	for(var year = milestones[phase]; year <= milestones[phase+1]; year++) {
	  var years_elapsed = year - milestones[phase];
	  var emitted = emissions(years_elapsed,
							  emissions_per_usd,
							  rates_emissions[phase],
							  gdp_per_capita,
							  rates_gdp[phase]
							 );
	  plots[plot].push([year, emitted]);
	}
	years = milestones[phase+1] - milestones[phase];
	emissions_per_usd *= Math.pow(1 + rates_emissions[phase], years);
	gdp_per_capita    *= Math.pow(1 + rates_gdp[phase],       years);
  }

  $.plot($("#placeholder"), plots);

};

var update_controls = function(event, ui, config_var) {
  var data = $( "#label-" + event.target.id).text();
  config[event.target.id] = parseFloat(data);
  render();
}

var set_slider_value = function (name, config_var, value) {
	$( "#"+name ).slider( "option", "value", value );	
	$( "#label-"+name ).text(value);
	config[config_var] = value;
}


var sliders = [
  {
    "default_value": 2016, 
    "max": 2100, 
    "step": 1, 
    "name": "impl-year", 
    "min": 2000
  }, 
  {
    "default_value": 0.02, 
    "max": 0.05, 
    "step": 0.001, 
    "name": "conv-gdp-rate", 
    "min": -0.05
  }, 
  {
    "default_value": -0.02, 
    "max": 0.05, 
    "step": 0.001, 
    "name": "conv-emissions-rate", 
    "min": -0.05
  }, 
  {
    "default_value": 2030, 
    "max": 2100, 
    "step": 1, 
    "name": "conv-year", 
    "min": 2000
  }, 
  {
    "default_value": 0.02, 
    "max": 0.05, 
    "step": 0.001, 
    "name": "cont-gdp-rate", 
    "min": -0.05
  }, 
  {
    "default_value": -0.02, 
    "max": 0.05, 
    "step": 0.001, 
    "name": "cont-emissions-rate", 
    "min": -0.05
  }, 
  {
    "default_value": 2050, 
    "max": 2100, 
    "step": 1, 
    "name": "target-year", 
    "min": 2000
  }, 
  {
    "default_value": 1, 
    "max": 10, 
    "step": 1, 
    "name": "target-amount", 
    "min": 0
  }
];

// Initialise UI objects
$(function() {
  for(var s in sliders) {
	var slider = sliders[s];
	var name = slider.name;
	var selector = "#" + name;
	var min = slider.min;
	var max = slider.max;
	var step = slider.step;
	var default_value = slider.default_value;

	if(max < min) {
	  alert("internal error: max value for slider < min value");
	  continue;
	}

	$(selector).slider({
	  max: max,
	  min: min,
	  step: step,
	  change: function(event, ui) { update_controls(event, ui, name); },
	  slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value(name, name, default_value);
  };
  
  config['running'] = true;
  render();
});

