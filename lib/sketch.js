////<reference path="../p5.d/p5.global-mode.d.ts"/>

// Checkbox to show additional info
let debug;
let show;
let stop;

// Slider to speed up simulation
let speedSlider;
let speedSpan;

// World dimensions
let width = 640;
let height = 480;
let world;

let agents;
let epoch = 0;

let foodAmount = 100;
let foodBuffer = 50;
let foodSize = 8;

function repeat(what, times) {
	for (let i = 0; i < times; i++)
		what();
}

function setup() {
	let canvas = createCanvas(width, height);
	canvas.parent('canvascontainer');

	debug = select('#debug');
	show = select('#show');
	stop = select('#stop');
	speedSlider = select('#speedSlider');
	speedSpan = select('#speed');

	agents = [];
	for (let i = 0; i < 3; i++) {
		let agent = new Agent();
		agent.acceleration = createVector(random(0, agent.maxspeed), random(0, agent.maxspeed));
		agents.push(agent);
	}

	world = new World(height, width, foodAmount, foodBuffer, foodSize);
	world.growFood();


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
			range: [0, foodAmount]
		},
		autosize: false,
		width: 500,
		height: 200,
		margin: {
			l: 50,
			r: 50,
			b: 50,
			t: 50,
			pad: 4
		}
	};

	Plotly.plot('chart', data, layout);

}

function getData() {
	return world.linkedlist.length;
}

function updateGraph() {
	let foodLeft = world.countFood();
	let agents = random(50); // fake changes in agent pop
	Plotly.extendTraces('chart', {
		y: [
			[foodLeft]
		]
	}, [0]);

	Plotly.extendTraces('chart', {
		y: [
			[agents]
		]
	}, [1]);
}

function mousePressed() {
	let pointsUnderMouse = world.quad.query(new Circle(mouseX, mouseY, 20));
	if (pointsUnderMouse.length === 1) {
		world.quad.remove(new Point(pointsUnderMouse[0].x, pointsUnderMouse[0].y));
	} else {
		let newFood = createVector(mouseX, mouseY);
		let p = new Point(mouseX, mouseY, newFood);
		world.quad.insert(p);
	}

}

function draw() {
	if (!stop.checked()) {
		background(0);
		updateGraph();

		// How fast should we speed up
		let cycles = speedSlider.value();
		speedSpan.html(cycles);

		// Run the simulation "cycles" amount of time
		for (let n = 0; n < cycles; n++) {
			epoch += 1;

			agents.forEach(agent => {
				agent.think();
				agent.update();
			});

			// world.growFood();

		}

		if (show.checked()) {
			world.displayFood();
			agents.forEach(agent => agent.display());
		}

		// Draw FPS (rounded to 1 decimal places) at the bottom left of the screen
		var fps = frameRate();
		fill(255);
		stroke(0);
		text("FPS: " + fps.toFixed(1) + "\nEpoch: " + epoch, 10, height - 20);
	}
}