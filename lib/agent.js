class Agent {
    constructor() {
        // All the physics stuff
        this.acceleration = createVector();
        this.velocity = createVector();
        this.position = createVector(random(width), random(height));
        this.r = 4;
        this.maxforce = 0.1;
        this.maxspeed = 4;
        this.minspeed = 0.25;
        this.maxhealth = 3;

        this.green = color(0, 255, 255, 255);
        this.red = color(255, 0, 100, 100);
        this.health = 1;
        this.eyes = new Eyes()
    }

    // Called each time step
    update() {
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
        this.position.x %= width
        this.position.y %= height
        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
        // Decrease health
        this.health = constrain(this.health, 0, this.maxhealth);
        this.health -= 0.005;
        // Increase score
        this.score += 1;
    }

    think() {
        this.eyes.sense(this.position);
        this.eat();
    }

    // Check against array of food
    eat() {
        let foods = world.search(this.position, this.r);
        for (let food of foods) {
            world.consume(food.val);
            // Add health when it eats food
            this.health++;
        }
    }

    display() {
        // Color based on health
        let col = lerpColor(this.red, this.green, this.health)
        // Rotate in the direction of velocity
        let theta = this.velocity.heading() + PI / 2;
        // Translate to current location and draw a triangle
        push();
        translate(this.position.x, this.position.y);
        rotate(theta);
        fill(col);
        strokeWeight(1);
        stroke(col);
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        if (debug.checked())
            this.eyes.display(this.position)
        pop();

    }
}