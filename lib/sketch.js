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
//let quad;
let agents;
let epoch = 0;

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

	world = new World(height, width, 20, 50, 8);
	world.growFood();

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