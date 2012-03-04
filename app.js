var config = {
  origin: 2000,
  running: false
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
  
  var milestones = [ config['origin'], 
					 config['impl-year'], 
					 config['conv-year'], 
					 config['target-year']
				   ];

  var emissions_per_usd = 0.233;
  var gdp_per_capita = 35000;

  var rates_gdp = [ 0.037, 
					config['conv-gdp-rate'], 
					config['cont-gdp-rate'] 
				  ];
  var rates_emissions = [ -0.028, 
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
  // selector, min, max, step, config_var, default
  [ "impl-year", 2000, 2100, 1, 2016 ],
  [ "conv-gdp-rate", -0.05, 0.05, 0.001, 0.02 ],
  [ "conv-emissions-rate", -0.05, 0.05, 0.001, -0.02 ],
  [ "conv-year", 2000, 2100, 1, 2030 ],
  [ "cont-gdp-rate", -0.05, 0.05, 0.001, 0.02 ],
  [ "cont-emissions-rate", -0.05, 0.05, 0.001, -0.02 ],
  [ "target-year", 2000, 2100, 1, 2050 ],
  [ "target-amount", 0, 10, 1, 1 ]
];


// Initialise UI objects
$(function() {
  for(var s in sliders) {
	var slider = sliders[s];
	var name = slider[0];
	var selector = "#" + name;
	var min = slider[1];
	var max = slider[2];
	var default_value = slider[4];

	if(max < min) {
	  alert("internal error: max value for slider < min value");
	  continue;
	}

	$(selector).slider({
	  max: max,
	  min: min,
	  step: slider[3],
	  change: function(event, ui) { update_controls(event, ui, name); },
	  slide: function(event, ui) { $('#label-' + event.target.id).text(ui.value); }
	});
	set_slider_value(name, name, default_value);
  };
  
  config['running'] = true;
  render();
});

