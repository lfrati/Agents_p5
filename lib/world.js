class World {
    constructor(height, width, foodAmount, foodBuffer, foodRadius) {
        this.height = height;
        this.width = width;
        // How big is the food?
        this.foodRadius = foodRadius;
        // How much food should there?
        this.foodAmount = foodAmount;
        // Don't put food near the edge
        this.foodBuffer = foodBuffer;
        this.foods = [];

        let boundary = new Rectangle(this.width / 2, this.height / 2, this.width / 2, this.height / 2);
        this.quad = new QuadTree(boundary, 5);
    }

    growFood() {
        // Always keep a minimum amount of food
        while (this.foods.length < this.foodAmount) {
            let x = random(this.foodBuffer, this.width - this.foodBuffer);
            let y = random(this.foodBuffer, this.height - this.foodBuffer);
            let newFood = createVector(x, y);
            console.log(newFood);
            this.quad.insert(new Point(x, y, newFood));
            this.foods.push(newFood);
        }
    }

    search(agentPos, range) {
        return this.quad.query(new Circle(agentPos.x, agentPos.y, range))
    }

    consume(target) {
        this.quad.remove(new Point(target.x, target.y))
    }

    display() {
        // Draw all the food
        // for (let food of this.foods) {
        //     fill(100, 255, 100);
        //     stroke(100, 255, 100);
        //     ellipse(food.x, food.y, this.foodRadius * 2);
        // }
        this.quad.display();
    }
}