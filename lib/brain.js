//const tf = require('@tensorflow/tfjs');
class Brain {
    constructor(inputSize, outputSize) {
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        this.xavier = Math.sqrt(2 / (inputSize + outputSize));
        this.weights = tf.randomNormal([inputSize, outputSize], 0, this.xavier);
        this.bias = tf.randomNormal([inputSize, 1], 0, this.xavier);
    }

    think(input) {
        return tf.tidy(() => {
            const data = tf.tensor2d(input, [this.inputSize, 1]);
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
        //     const positive_w = tf.randomUniform([this.inputSize, this.outputSize]).step(0);
        //     const negative_w = tf.onesLike(positive_w).sub(positive_w);
        //     const father_w = brain1.weights.mul(positive_w);
        //     const mother_w = brain2.weights.mul(negative_w);
        //     const recombinant_w = father_w.add(mother_w);
        //     const prob_w = -(this.inputSize * this.outputSize) + 10;
        //     const mutation_w = tf
        //         .randomUniform([this.inputSize, this.outputSize], prob_w)
        //         .step(0)
        //         .mul(this.weights);
        //     const mutated_recomb_w = recombinant_w.add(mutation_w);
        //     this.weights = tf.keep(mutated_recomb_w);

        //     const positive_b = tf.randomUniform([this.inputSize, 1]).step(0);
        //     const negative_b = tf.onesLike(positive_b).sub(positive_b);
        //     const father_b = brain1.bias.mul(positive_b);
        //     const mother_b = brain2.bias.mul(negative_b);
        //     const recombinant_b = father_b.add(mother_b);
        //     const prob_b = -this.inputSize + 10;
        //     const mutation_b = tf
        //         .randomUniform([this.inputSize, 1], prob_b)
        //         .step(0)
        //         .mul(this.bias);
        //     const mutated_recomb_b = recombinant_b.add(mutation_b);
        //     this.bias = tf.keep(mutated_recomb_b);
        // });
        tf.tidy(() => {
            const positive_w = tf.randomUniform([this.inputSize, this.outputSize]).step(0);
            const negative_w = tf.onesLike(positive_w).sub(positive_w);
            const father_w = brain1.weights.mul(positive_w);
            const mother_w = brain2.weights.mul(negative_w);
            const recombinant_w = father_w.add(mother_w);
            const mutated_recomb_w = recombinant_w.add(this.weights);
            this.weights = tf.keep(mutated_recomb_w);

            const positive_b = tf.randomUniform([this.inputSize, 1]).step(0);
            const negative_b = tf.onesLike(positive_b).sub(positive_b);
            const father_b = brain1.bias.mul(positive_b);
            const mother_b = brain2.bias.mul(negative_b);
            const recombinant_b = father_b.add(mother_b);
            const mutated_recomb_b = recombinant_b.add(this.bias);
            this.bias = tf.keep(mutated_recomb_b);
        });

        old_w.dispose();
        old_b.dispose();
    }

    mutate(parent) {
        const old_w = this.weights;
        const old_b = this.bias;
        // tf.tidy(() => {
        //     const prob_w = -(this.inputSize * this.outputSize) + 10;
        //     const mutation_w = tf
        //         .randomUniform([this.inputSize, this.outputSize], prob_w)
        //         .step(0)
        //         .mul(this.weights);
        //     const mutated_recomb_w = parent.weights.add(mutation_w);
        //     this.weights = tf.keep(mutated_recomb_w);

        //     const prob_b = -this.inputSize + 10;
        //     const mutation_b = tf
        //         .randomUniform([this.inputSize, 1], prob_b)
        //         .step(0)
        //         .mul(this.bias);
        //     const mutated_recomb_b = parent.bias.add(mutation_b);
        //     this.bias = tf.keep(mutated_recomb_b);
        // });
        tf.tidy(() => {
            this.weights = tf.keep(parent.weights.add(this.weights));
            this.bias = tf.keep(parent.bias.add(this.bias));
        });
        old_w.dispose();
        old_b.dispose();
    }

    die() {
        this.weights.dispose();
        this.bias.dispose();
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
