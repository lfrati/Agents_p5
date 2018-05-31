describe('A test suite', function() {
    it('A test', function() {
        var tensor = new Brain(2, 2);
        var numTensors = tf.memory().numTensors;
        expect(numTensors).to.equal(2);
    });
});
