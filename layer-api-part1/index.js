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
