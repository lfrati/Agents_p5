class Sensor {
    constructor(angle, sector, minDist, maxDist) {
        // Sensor range
        this.minDist = minDist;
        this.maxDist = maxDist;
        this.range = maxDist - minDist;
        // Angle in which the sensor is pointing
        this.angle = angle;
        // Angle the sensor is covering
        this.sector = sector;
        // The vector describes the sensor's direction
        this.dir = p5.Vector.fromAngle(angle);
        // This is the sensor's reading
        this.val = 0;
    }
    sees(vec) {
        let delta = this.dir.angleBetween(vec);
        return delta < this.sector / 2;
    }
}

class Eyes {
    constructor(totalSensors, sensorLength) {
        // How many sensors does each vehicle have?
        this.totalSensors = totalSensors;
        // How far can each vehicle see?
        this.sensorLength = sensorLength;
        // What's the angle in between sensors
        this.sensorAngle = TWO_PI / totalSensors;

        // Create an array of sensors
        this.sensors = [];
        for (
            let angle = this.sensorAngle / 2;
            angle < TWO_PI;
            angle += this.sensorAngle
        ) {
            this.sensors.push(
                new Sensor(angle, this.sensorAngle, 0, sensorLength)
            );
        }
        // Add long 4 range sensors
        for (let angle = QUARTER_PI; angle < TWO_PI; angle += HALF_PI) {
            this.sensors.push(
                new Sensor(angle, HALF_PI, sensorLength, sensorLength * 2)
            );
        }
    }

    // Function to calculate all sensor readings
    sense(agentPos) {
        // Reset sensors readings to zero
        this.sensors.forEach(sensor => (sensor.val = 0));

        // Search for food within the sensor distance
        let foods = world.searchFood(agentPos, this.sensorLength * 2);

        for (let food of foods) {
            // Get the food vector from the point object
            let otherPosition = food.data.val;
            // Vector pointing to food
            let toFood = p5.Vector.sub(otherPosition, agentPos);
            let dist = toFood.mag();

            // Check all the sensors
            for (let sensor of this.sensors) {
                // Skip if it's too close or too far away from the current sensor
                if (dist > sensor.maxDist || dist < sensor.minDist) {
                    continue;
                }

                let closeness = (sensor.maxDist - dist) / sensor.maxDist;
                // If the relative angle of the food is in between the range
                if (sensor.sees(toFood)) {
                    // Increase the activation of the sensor based on how much food it senses
                    sensor.val += closeness;
                }
            }
        }
        // Normalize readings
        let totReading = this.sensors.reduce(
            (sum, sensor) => sum + sensor.val,
            0
        );

        let sensorReadings = this.sensors.reduce((acc, sensor) => {
            if (totReading > 0) sensor.val /= totReading;
            acc.push(sensor.val);
            return acc;
        }, []);

        return sensorReadings;
    }

    display() {
        noFill();
        stroke(255);

        this.sensors.forEach(sensor => {
            let radius = sensor.maxDist * 2;
            let currAngle = sensor.angle;
            let from = currAngle - sensor.sector / 2;
            let to = currAngle + sensor.sector / 2;
            let val = map(sensor.val, 0, 1, 0, sensor.range);
            let col = map(sensor.val, 0, 1, 0, 255);

            stroke(50);

            arc(0, 0, radius, radius, from, to, PIE);

            if (val > 0) {
                if (sensor.minDist === 0) {
                    stroke('#fae');
                } else {
                    stroke('rgb(0,255,0)');
                }
                line(0, 0, sensor.dir.x * val, sensor.dir.y * val);
            }
        });
    }
}
