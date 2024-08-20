const model = tf.sequential();

const configHidden = {
    inputShape: [2],
    activation: 'sigmoid',
    units: 4
    };

model.add(tf.layers.dense(configHidden));
console.log('hidden layer added', model);

const configOutput = {
    units: 3,
    activation:'sigmoid',
};

model.add(tf.layers.dense(configOutput));
console.log('output layer added', model);

const sgdOpt = tf.train.sgd(0.1);
model.compile({
    optimizer: sgdOpt,
    loss: 'meanSquaredError'
});
console.log('model compiled', model);

const xs = tf.tensor2d([
    [0,0],
    [0,1],
    [1,0],
]);

const ys = tf.tensor2d([
    [0,0,0],
    [0,1,0],
    [0,0,1],
]);

train().then(() => {
    console.log('training complete');
    let outputs = model.predict(xs);
    outputs.print();
});

async function train() {
    for (let i = 0; i < 1000; i++) {
        const response = await model.fit(xs, ys, {
            epochs: 100,
            shuffle: true
        });
        console.log(response.history.loss[0]);
    }
}
