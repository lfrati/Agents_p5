//const tf = require('@tensorflow/tfjs');
class Brain {
    constructor(inputSize, hiddenSize, outputSize) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.model = tf.tidy(() => {
            // Define input, which has a size of 5 (not including batch dimension).
            const input = tf.input({ shape: [inputSize] });
            // First dense layer uses relu activation.
            const denseLayer1 = tf.layers.dense({ units: hiddenSize, activation: 'relu' });
            // Second dense layer uses linear activation.
            const denseLayer2 = tf.layers.dense({ units: outputSize, activation: 'linear' });
            // Obtain the output symbolic tensor by applying the layers on the input.
            const output = denseLayer2.apply(denseLayer1.apply(input));
            return tf.model({ inputs: input, outputs: output });
        });
        // Create the model based on the inputs.
    }

    think(input) {
        return tf.tidy(() => {
            const data = tf.tensor2d(input, [1, this.inputSize]);
            let activation = this.model.predict(data);
            return Array.from(activation.dataSync());
        });
    }

    mix(brain1, brain2) {
        if (Math.random() < 0.5) {
            this.mutate(brain1);
        } else {
            this.mutate(brain2);
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    mutate(parent) {
        const mutated = parent.model.getWeights().reduce((mutations, layer) => {
            const buffer = layer.buffer();
            if (layer.shape.length === 2) {
                const [row, col] = layer.shape;
                const mutRow = this.getRandomInt(0, row);
                const mutCol = this.getRandomInt(0, col);
                const oldVal = buffer.get(mutRow, mutCol);
                buffer.set(mutRow, mutCol, oldVal + Math.random() * 2 - 1);
            } else {
                const [row] = layer.shape;
                const mutRow = this.getRandomInt(0, row);
                const oldVal = buffer.get(mutRow);
                buffer.set(mutRow, oldVal + Math.random() * 2 - 1);
            }
            mutations.push(buffer.toTensor());
            return mutations;
        }, []);
        this.model.setWeights(mutated);
        mutated.forEach(element => {
            element.dispose();
        });
    }

    die() {
        this.model.getWeights().forEach(element => element.dispose());
        //this.bias.dispose();
    }

    toJSON() {
        let weights = Array.from(this.weights.dataSync());
        let wShape = this.weights.shape;
        let bias = Array.from(this.bias.dataSync());
        let bShape = this.bias.shape;
        return { weights: { data: weights, shape: wShape }, bias: { data: bias, shape: bShape } };
    }

    fromJSON(JSON) {
        const old_w = this.weights;
        const old_b = this.bias;
        tf.tidy(() => {
            this.weights = tf.keep(tf.tensor(JSON.weights.data, JSON.weights.shape));
            this.bias = tf.keep(tf.tensor(JSON.bias.data, JSON.bias.shape));
        });
        old_w.dispose();
        old_b.dispose();
    }

    display() {
        this.weights.print();
        this.bias.print();
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Brain
    };
}
