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

        let boundary = new Rectangle(this.width / 2, this.height / 2, this.width / 2, this.height / 2);
        this.foodQuadtree = new QuadTree(boundary, 5);
        this.foodLinkedList = new LinkedList();
    }

    growFood() {
        // Always keep a minimum amount of food
        if (this.foodLinkedList.length < this.foodAmount) {
            let x = random(this.foodBuffer, this.width - this.foodBuffer);
            let y = random(this.foodBuffer, this.height - this.foodBuffer);
            let newFood = createVector(x, y);
            this.storeFood(newFood);
        }
    }

    storeFood(vect) {
        // Use linkedlist for sequential access
        let node = this.foodLinkedList.insert(vect);
        // Store the node at coordinates (x,y) using the quadtree
        let point = new Point(vect.x, vect.y, node);
        this.foodQuadtree.insert(point);
    }

    consumeFood(point) {
        this.foodQuadtree.remove(point);
        this.foodLinkedList.remove(point.data);
    }

    searchFood(agentPos, radius) {
        let range = new Circle(agentPos.x, agentPos.y, radius);
        return this.foodQuadtree.query(range);
    }

    countFood() {
        return this.foodLinkedList.length;
    }

    displayFood() {
        let points = this.foodLinkedList.getAll();
        for (let point of points) {
            stroke(255, 0, 255);
            fill(255);
            ellipse(point.x, point.y, 10);
        }
    }
}