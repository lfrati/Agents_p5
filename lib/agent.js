class Agent {
    constructor() {
        // All the physics stuff
        this.acceleration = createVector();
        this.velocity = createVector();
        this.position = createVector(random(width), random(height));
        this.r = 10;
        this.maxforce = 0.1;
        this.maxspeed = 5;
        this.minspeed = 0.25;
        this.starthealth = 1;
        this.maxhealth = 5;

        this.green = color(0, 255, 255, 255);
        this.red = color(255, 0, 100, 100);
        this.health = this.starthealth;
        this.age = 0;

        this.numSensors = 8;
        this.sensingRange = 100;
        this.eyes = new Eyes(this.numSensors, this.sensingRange);
        this.brain = new Brain(this.numSensors, 2);

        this.mutationMean = 0;
        this.mutationStd = 0.1;
        this.metabolicRate = 0.01;
    }

    // Add force to acceleration
    applyForce(force) {
        this.acceleration.add(force);
    }

    mod(n, m) {
        return (n % m + m) % m;
    }

    // Called each time step
    move() {
        // Update velocity
        this.velocity.add(this.acceleration);
        // Limit speed to max
        this.velocity.limit(this.maxspeed);
        // Keep speed at a minimum
        if (this.velocity.mag() < this.minspeed) {
            this.velocity.setMag(this.minspeed);
        }
        // Update position
        this.position.add(this.velocity);
        // Make world a torus
        this.position.x = this.mod(this.position.x, width);
        this.position.y = this.mod(this.position.y, height);
        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
        // Decrease health
        this.health = constrain(this.health, 0, this.maxhealth);
        this.health -= this.metabolicRate * this.velocity.mag() / this.maxspeed;
        // Increase score
        this.age += 1;
    }

    act(immortal) {
        let info = this.eyes.sense(this.position);
        let [x, y] = this.brain.think(info);

        let force = createVector(x, y);
        this.applyForce(force);
        this.eat();
        this.move();

        if (immortal) {
            return { alive: [this], dead: [] };
        } else {
            return this.reproduce();
        }
    }

    reproduce() {
        let next = { alive: [], dead: [] };

        if (this.health > this.starthealth * 2) {
            const child = new Agent();

            // Search for possible partners, contains the agent itself
            let range = new Circle(this.position.x, this.position.y, this.r * 2);
            let partners = world.agentsQuadtree.query(range);

            if (partners.length > 1) {
                let oldest = partners.reduce(
                    (best, candidate) => {
                        if (candidate.data.age > best.age) {
                            best.specimen = candidate.data;
                            best.age = candidate.data.age;
                        }
                        return best;
                    },
                    {
                        specimen: null,
                        age: this.age
                    }
                );
                if (oldest.age > this.age) {
                    child.brain.mix(this.brain, oldest.specimen.brain);
                } else {
                    child.brain.mutate(this.brain);
                }
            }
            this.health -= child.starthealth;
            next.alive.push(child);
        }

        if (this.health > 0) {
            next.alive.push(this);
        } else {
            next.dead.push(this);
        }
        return next;
    }

    // Check against array of food
    eat() {
        let foods = world.searchFood(this.position, this.r);
        for (let food of foods) {
            world.consumeFood(food);
            // Add health when it eats food
            this.health++;
        }
    }

    toJSON() {
        let json = {};
        json.brain = this.brain.toJSON();
        json.age = this.age;
        return json;
    }

    display() {
        // Color based on health
        let col = lerpColor(this.red, this.green, this.health);
        // Rotate in the direction of velocity
        let theta = this.velocity.heading() + PI / 2;
        // Translate to current location and draw a triangle
        push();
        translate(this.position.x, this.position.y);

        if (debug.checked()) {
            this.eyes.display();
            let v = this.velocity
                .copy()
                .div(this.maxspeed)
                .mult(this.eyes.sensorLength / 2);
            stroke(200, 200, 0);
            strokeWeight(2);
            line(0, 0, v.x, v.y);
        }

        rotate(theta);
        fill(col);
        strokeWeight(1);
        stroke(col);
        beginShape();
        vertex(0, -this.r);
        vertex(-this.r / 2, this.r);
        vertex(this.r / 2, this.r);
        endShape(CLOSE);

        pop();

        noFill();
        stroke(255);
    }
}
