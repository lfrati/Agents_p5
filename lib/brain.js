if (typeof module !== 'undefined' && module.exports) {
    const tf = require('@tensorflow/tfjs');
}
class Brain {
    constructor(inputSize, outputSize) {
        this.input = inputSize;
        this.output = outputSize;
        this.xavier = Math.sqrt(2 / (inputSize + outputSize));
        this.xavier = 0.1;
        this.weights = tf.randomNormal([inputSize, outputSize], 0, this.xavier);
        this.bias = tf.randomNormal([inputSize, 1], 0, this.xavier);
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

    mix(brain1, brain2) {
        // Save previous values to dispose them after update
        const old_w = this.weights;
        const old_b = this.bias;
        // tf.tidy(() => {
        //     const n = tf.scalar(3);
        //     this.weights = tf.keep(
        //         this.weights
        //             .add(brain1.weights)
        //             .add(brain2.weights)
        //             .div(n)
        //     );
        //     this.bias = tf.keep(
        //         this.bias
        //             .add(brain1.bias)
        //             .add(brain2.bias)
        //             .div(n)
        //     );
        // });
        tf.tidy(() => {
            this.weights = tf.keep(this.weights.add(brain1.weights));
            this.bias = tf.keep(this.bias.add(brain1.bias));
        });
        old_w.dispose();
        old_b.dispose();
    }

    die() {
        this.weights.dispose();
        this.bias.dispose();
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
