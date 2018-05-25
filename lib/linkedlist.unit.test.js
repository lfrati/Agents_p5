const linkedlist = require('./linkedlist');

test('Test length of an empty list', () => {
    let l = new linkedlist();
    expect(l.length).toBe(0);
});

test('Test length of a one element list', () => {
    let l = new linkedlist();
    l.insert(4);
    expect(l.length).toBe(1);
});

test('Test length after removing one element from a one element list', () => {
    let l = new linkedlist();
    let n = l.insert(4);
    l.remove(n);
    expect(l.length).toBe(0);
});

test('Test length after removing first element from a three element list', () => {
    let l = new linkedlist();
    let first = l.insert(1);
    let second = l.insert(2);
    let last = l.insert(3);
    l.remove(first);
    expect(l.length).toBe(2);
});

test('Test length after removing middle element from a three element list', () => {
    let l = new linkedlist();
    let first = l.insert(1);
    let second = l.insert(2);
    let last = l.insert(3);
    l.remove(second);
    expect(l.length).toBe(2);
});

test('Test length after removing last element from a three element list', () => {
    let l = new linkedlist();
    let first = l.insert(1);
    let second = l.insert(2);
    let last = l.insert(3);
    l.remove(last);
    expect(l.length).toBe(2);
});

test('Test getAll() on empty list', () => {
    let l = new linkedlist();
    expect(l.getAll()).toEqual([]);
});

test('Test getAll() on one element list', () => {
    let l = new linkedlist();
    let first = l.insert(1);
    expect(l.getAll()).toEqual([1]);
});

test('Test getAll() on three element list', () => {
    let l = new linkedlist();
    let first = l.insert(1);
    let second = l.insert(2);
    let third = l.insert(3);
    expect(l.getAll()).toEqual([1, 2, 3]);
});
