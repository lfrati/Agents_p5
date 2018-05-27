////<reference path="../p5.d/p5.global-mode.d.ts"/>

// Checkbox to show additional info
let debug;
let show;
let stop;
let stats;
let immortal;

// Slider to speed up simulation
let speedSlider;
let speedSpan;

// World dimensions
let width = 640;
let height = 480;
let world;

let agents;
let numAgents = 10;

let foodAmount = 100;
let foodBuffer = 50;
let foodSize = 8;

let plottingRate = 10;
let foodGrowthRate = 1;
let metabolicRate;

let epoch = 0;

let oldestAgent;

function setup() {
    // Setup buttons, sliders and canvas -------------------------------------
    let canvas = createCanvas(width, height);
    canvas.parent('canvascontainer');
    debug = select('#debug');
    show = select('#show');
    stop = select('#stop');
    circle = select('#circle');
    immortal = select('#immortal');
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
    oldestAgent = agents[0];
    // Horrible hack
    metabolicRate = agents[0].metabolicRate;
    world = new World(height, width, foodAmount, foodBuffer, foodSize);

    // Setup plotting --------------------------------------------------------
    var trace1 = {
        y: [],
        mode: 'lines',
        name: 'food available'
    };
    var trace2 = {
        y: [],
        mode: 'lines',
        name: 'agents consumption'
    };
    var trace3 = {
        y: [],
        mode: 'lines',
        name: 'agents resources'
    };
    var data = [trace1, trace2, trace3];

    var layout = {
        //title: 'Title of the Graph',
        xaxis: {
            title: 'Epochs'
        },
        yaxis: {
            //range: [0, 100]
            rangemode: 'tozero'
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

var cnt = 0;

function updatePlots() {
    cnt++;

    let foodAvailable = world.countFood();

    let agentsHealth = agents.reduce((healthSum, agent) => {
        if (agent.age > oldestAgent.age) {
            oldestAgent = agent.copy();
        }
        return healthSum + agent.health;
    }, 0);

    let agentsConsumption = agents.length * metabolicRate;

    Plotly.extendTraces(
        'chart',
        {
            y: [[foodAvailable]]
        },
        [0]
    );

    Plotly.extendTraces(
        'chart',
        {
            y: [[agentsConsumption]]
        },
        [1]
    );

    Plotly.extendTraces(
        'chart',
        {
            y: [[agentsHealth]]
        },
        [2]
    );

    if (cnt > 500) {
        Plotly.relayout('chart', {
            xaxis: {
                range: [cnt - 500, cnt]
            }
        });
    }
}

function checkMousePressed() {
    return (
        mouseIsPressed &&
        0 < mouseX &&
        mouseX < width &&
        0 < mouseY &&
        mouseY < height
    );
}

function draw() {
    // How fast should we speed up
    let cycles = speedSlider.value();
    speedSpan.html(cycles);

    if (!stop.checked()) {
        background(0);
        if (show.checked()) {
            world.displayFood();
            //world.foodQuadtree.displayQuads();
            agents.forEach(agent => agent.display());
        }

        if (epoch % plottingRate === 0) {
            updatePlots();
        }

        // Run the simulation "cycles" amount of time
        for (let n = 0; n < cycles; n++) {
            epoch += 1;

            agents = agents.reduce((pop, agent) => {
                //let next = agent.act(immortal.checked());
                let next = agent.act(immortal.checked());
                return pop.concat(next);
            }, []);

            if (circle.checked()) {
                let theta = (epoch % 100) * TWO_PI / 100;
                let r = 200;
                let tmp = createVector(
                    width / 2 + r * cos(theta),
                    height / 2 + r * sin(theta)
                );
                world.storeFood(tmp);
            } else {
                for (let i = 0; i < foodGrowthRate; i++) world.growFood();
            }
        }
    }

    // Draw FPS (rounded to 1 decimal places) at the bottom left of the screen
    var fps = frameRate();
    fill(255);
    stroke(0);
    text('FPS: ' + fps.toFixed(1) + '\nEpoch: ' + epoch, 10, height - 20);

    if (checkMousePressed()) {
        //let newFood = createVector(mouseX, mouseY);
        //world.storeFood(newFood);
        agents[0].position = createVector(mouseX, mouseY);
    }
}
