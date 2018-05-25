class Brain {
    constructor(inputSize, outputSize) {
        this.input = inputSize;
        this.output = outputSize;
        let xavier = sqrt(2 / (inputSize + outputSize));
        this.weights = tf.randomNormal([inputSize, outputSize], 0, xavier);
        this.bias = tf.randomNormal([inputSize, 1], 0, xavier);
    }

    think(input) {
        return tf.tidy(() => {
            const data = tf.tensor2d(input, [this.input, 1]);
            const activation = data
                .mul(this.weights)
                .add(this.bias)
                .sum(0);
            return Array.from(activation.dataSync());
        });
    }

    copy() {
        let newBrain = new Brain(this.input, this.output);
        newBrain.weights = newBrain.weights.add(this.weights);
        newBrain.bias = newBrain.bias.add(this.bias);
        return newBrain;
    }

    die() {
        this.weights.dispose();
        this.bias.dispose();
    }
}
