// This is a class for an individual sensor
// Each vehicle will have N sensors
class Sensor {
    constructor(angle) {
        // The vector describes the sensor's direction
        this.dir = p5.Vector.fromAngle(angle);
        // This is the sensor's reading
        this.val = 0;
    }
}

class Eyes {
    constructor(totalSensors = 8, sensorLength = 100) {
        // How many sensors does each vehicle have?
        this.totalSensors = totalSensors;
        // How far can each vehicle see?
        this.sensorLength = sensorLength;
        // What's the angle in between sensors
        this.sensorAngle = (Math.PI * 2) / totalSensors;

        // Create an array of sensors
        this.sensors = [];
        for (let angle = 0; angle < TWO_PI; angle += this.sensorAngle) {
            this.sensors.push(new Sensor(angle));
        }
    }

    // Function to calculate all sensor readings
    sense(agentPos) {
        let foods = world.searchFood(agentPos, this.sensorLength);
        for (let food of foods) {
            // Where is the food
            let otherPosition = food.data.val;
            // How far away?
            let dist = p5.Vector.dist(agentPos, otherPosition);

            // Vector pointing to food
            let toFood = p5.Vector.sub(otherPosition, agentPos);

            this.querySensors(dist, toFood);
        }
    }

    querySensors(dist, vectorToFood) {
        // Check all the sensors
        for (let sensor of this.sensors) {
            // All sensors start with maximum length
            sensor.val = this.sensorLength;

            // If the relative angle of the food is in between the range
            let delta = sensor.dir.angleBetween(vectorToFood);
            if (delta < this.sensorAngle / 2) {
                // Sensor value is the closest food
                sensor.val = min(sensor.val, dist);
            }
        }
    }

    display(position) {
        // Draw lines for all the activated sensors
        for (let sensor of this.sensors) {
            let val = sensor.val;
            if (val > 0) {
                //stroke(col);
                strokeWeight(map(val, 0, this.sensorLength, 4, 0));
                let position = sensor.dir;
                line(0, 0, position.x * val, position.y * val);
            }
        }
    }

}