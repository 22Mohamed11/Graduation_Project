const fs = require('fs');
const sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');
const { createCanvas, loadImage } = require('canvas');

// Load model architecture from JSON file
const modelJson = require('../../deepModels/feet/model.json');
const model = tf.modelFromJSON(modelJson);


// Load model weights
const modelWeights = fs.readFileSync('../../deepModels/feet/model_weights.h5');
model.loadWeights(modelWeights);

// Load class labels
const classLabels = require('../../deepModels/feet/class_labels.json');

async function preprocessImage(imagePath) {
  // Resize image to match the model input size
  const img = await loadImage(imagePath);      // image path into Frontend
  const canvas = createCanvas(150, 150);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 150, 150);
  const buffer = canvas.toBuffer('image/jpeg');
  return tf.node.decodeJpeg(buffer);
}

async function classifyImage(imagePath) {
  try {
    // Preprocess the image
    const imgTensor = await preprocessImage(imagePath);
    const imgArray = imgTensor.arraySync();

    // Expand dimensions and normalize
    const inputTensor = tf.tensor4d(imgArray).div(tf.scalar(255.0));

    // Make predictions using the model
    const predictions = model.predict(inputTensor);
    const predictedClassIndex = predictions.argMax(1).dataSync()[0];
    const predictedClassLabel = classLabels[predictedClassIndex];

    // Return result as JSON
    const result = {
      predicted_class: predictedClassLabel,
      probabilities: predictions.arraySync()[0],
    };

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = classifyImage;