////<reference path="../p5.d/p5.global-mode.d.ts"/>

// Checkbox to show additional info
let debug;
let show;
let stop;
let stats;

// Slider to speed up simulation
let speedSlider;
let speedSpan;

// World dimensions
let width = 640;
let height = 480;
let world;

let agents;
let numAgents = 3

let foodAmount = 20;
let foodBuffer = 50;
let foodSize = 8;

let plottingRate = 10;

let epoch = 0;

function setup() {
	// Setup buttons, sliders and canvas -------------------------------------
	let canvas = createCanvas(width, height);
	canvas.parent('canvascontainer');
	debug = select('#debug');
	show = select('#show');
	stop = select('#stop');
	stats = select('#stats');
	speedSlider = select('#speedSlider');
	speedSpan = select('#speed');

	// Setup simulation elements ---------------------------------------------
	agents = [];
	for (let i = 0; i < numAgents; i++) {
		let agent = new Agent();
		let randomVelocity = p5.Vector.random2D();
		randomVelocity.setMag(agent.maxspeed);
		agent.acceleration = randomVelocity;
		agents.push(agent);
	}

	world = new World(height, width, foodAmount, foodBuffer, foodSize);

	// Setup plotting --------------------------------------------------------
	var trace1 = {
		y: [],
		mode: 'lines',
		name: 'food'
	};
	var trace2 = {
		y: [],
		mode: 'lines',
		name: 'agents'
	};
	var data = [trace1, trace2];

	var layout = {
		//title: 'Title of the Graph',
		xaxis: {
			title: 'Epochs'
		},
		yaxis: {
			//range: [0, 100]
			rangemode: "tozero"
		},
		autosize: false,
		width: 500,
		height: 200,
		margin: {
			l: 50,
			r: 50,
			b: 70,
			t: 30,
			pad: 10
		},
		dragmode: 'pan'
	};

	var options = {
		modeBarButtonsToRemove: [
			'sendDataToCloud',
			'autoScale2d',
			'hoverClosestCartesian',
			'hoverCompareCartesian',
			'lasso2d',
			'select2d',
			'toggleSpikelines',
			'zoomIn2d',
			'zoomOut2d'
		],
		displaylogo: false,
		displayModeBar: true
	};

	Plotly.plot('chart', data, layout, options);

}

function updatePlots() {
	let foodLeft = world.countFood();
	let agentsHealth = agents.reduce((healthSum, agent) => healthSum + agent.health, 0); // fake changes in agent pop
	Plotly.extendTraces('chart', {
		y: [
			[foodLeft]
		]
	}, [0]);

	Plotly.extendTraces('chart', {
		y: [
			[agentsHealth * 10]
		]
	}, [1]);
}

function checkMousePressed() {
	return mouseIsPressed && 0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height;
}

function draw() {
	// GRAPHICS PART -----------------------------------------------------------------
	// How fast should we speed up
	let cycles = speedSlider.value();
	speedSpan.html(cycles);

	background(0);

	if (show.checked()) { // Put here what should be hidden while not rendering
		world.displayFood();
		agents.forEach(agent => agent.display());
	}

	// Draw FPS (rounded to 1 decimal places) at the bottom left of the screen
	var fps = frameRate();
	fill(255);
	stroke(0);
	text("FPS: " + fps.toFixed(1) + "\nEpoch: " + epoch, 10, height - 20);

	if (stats.checked() && epoch % plottingRate === 0) {
		updatePlots();
	}



	// LOGIC PART ------------------------------------------------------------------
	if (!stop.checked()) { // Put here what should be skipped while not running
		// 
		// Run the simulation "cycles" amount of time
		for (let n = 0; n < cycles; n++) {
			epoch += 1;

			agents.forEach(agent => {
				agent.think();
				agent.update();
			});
		}
	}
	if (checkMousePressed()) {
		// let newFood = createVector(mouseX, mouseY);
		// world.storeFood(newFood);
		agents[0].position = createVector(mouseX, mouseY);
	}

}