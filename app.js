var config = {
  origin: 2000,
  running: false
};

var render = function () {
  if(!config.running) {
	return;
  }
  
  var origin = config.origin;
  var implementation = config['impl-year'];
  var convergence = config['conv-year'];
  var target_year = config['target-year'];

  var milestones = [ origin, 
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

  var plots = [ [], [], [] ];

  for(var phase = 0; phase <= 2; phase++) {
	if(milestones[phase] > milestones[phase+1]) {
	  alert("Milestone #" + phase.toString() + " (" + 
			milestones[phase].toString() + ") after milestone #" +
			(phase+1).toString() + " (" + 
			milestones[phase+1].toString() + ")");
	}
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
	  change: function(event, ui) { 
		update_controls(event, ui, name);
	  },
	  slide: function(event, ui)  { 
		$('#label-' + event.target.id).text(ui.value); 
	  }
	});
	set_slider_value(name, name, default_value);
  };
  
  config['running'] = true;
  render();
});

