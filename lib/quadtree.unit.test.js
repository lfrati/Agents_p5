const { Point, Rectangle, Circle, QuadTree } = require('./quadtree.js');

function putPoint(x, y, quad) {
    let pt = new Point(x, y);
    quad.insert(pt);
}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

test('Test query on empty quad', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);

    let range = new Circle(100, 100, 100);
    let res = qt.query(range);

    expect(res.length).toBe(0);
});

test('Test query on quadtree containing 10000 points', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);
    let numPoints = 10000;

    for (let i = 0; i < numPoints; i++) {
        let x = Math.random() * 200;
        let y = Math.random() * 200;
        putPoint(x, y, qt);
    }

    let range = new Circle(100, 100, 200);
    let res = qt.query(range);

    expect(res.length).toBe(numPoints);
});

test('Test remove all points on quadtree containing 1000 points', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);
    let numPoints = 1000;

    for (let i = 0; i < numPoints; i++) {
        let x = round(Math.random() * 200, 2);
        let y = round(Math.random() * 200, 2);
        putPoint(x, y, qt);
    }

    let range = new Circle(100, 100, 200);
    let res = qt.query(range);

    for (let p of res) {
        qt.remove(p);
    }
    let empty = qt.query(range);

    expect(empty.length).toBe(0);
});

test('Test recursive merging', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);
    let numPoints = 1000;

    putPoint(10, 10, qt);
    putPoint(10, 10, qt);
    putPoint(10, 10, qt);

    // Splitting will stop when with or height are < 1

    qt.remove(new Point(10, 10));

    expect(qt.divided).toBe(false);
});

test('Test capacity on full quad', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);

    putPoint(20, 20, qt);
    putPoint(10, 10, qt);
    putPoint(30, 30, qt);

    expect(qt.divided).toBe(true);
});

test('Test capacity on underfull quad', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);
    let pt = new Point(10, 10);
    qt.insert(pt);
    qt.insert(pt);

    expect(qt.divided).toBe(false);
});

test('Test insertion on quad boundaries', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);
    let pt = new Point(10, 10);
    qt.insert(pt);
    qt.insert(pt);

    expect(qt.divided).toBe(false);
});

test('Test clear on quad', () => {
    let boundary = new Rectangle(100, 100, 100, 100);
    let capacity = 2;
    let qt = new QuadTree(boundary, capacity);

    putPoint(20, 20, qt);
    putPoint(10, 10, qt);
    putPoint(30, 30, qt);

    qt.clear();

    let range = new Circle(100, 100, 200);
    let res = qt.query(range);

    expect(res.length).toBe(0);
});
