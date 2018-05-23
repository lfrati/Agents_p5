const linkedlist = require('./linkedlist');

test("Insert one element in an empty list", () => {
    let l = new linkedlist();
    l.insert(4);
    expect(l.length).toBe(1);
});

test("Insert two elements in an empty list", () => {
    let l = new linkedlist();
    l.insert(4);
    l.insert(5);
    expect(l.length).toBe(2);
});

test("Remove one element from a one element list", () => {
    let l = new linkedlist();
    let n = l.insert(4);
    l.remove(n);
    expect(l.length).toBe(0);
    expect(l.getAll().length).toBe(0);
});

test("Remove one element from a three element list", () => {
    let l = new linkedlist();
    let first = l.insert(1);
    let second = l.insert(2);
    let third = l.insert(3);
    l.remove(second);
    expect(l.length).toBe(2);
    expect(l.getAll()).toEqual([1, 3]);
});

test("Test getAll", () => {
    let l = new linkedlist();
    let first = l.insert(1);
    let second = l.insert(2);
    let third = l.insert(3);
    expect(l.getAll()).toEqual([1, 2, 3]);
});