/*const fs = require('fs');
const sharp = require('sharp');
const tf = require("@tensorflow/tfjs-node");
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
*/

/*
const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { createCanvas, loadImage } = require('canvas');

// تحميل نموذج MobileNet المدرب مسبقًا
const modelJson = require('../../deepModels/feet/model.json');
const model = tf.modelFromJSON(modelJson);

// تحميل أوزان النموذج
const modelWeights = fs.readFileSync('../../deepModels/feet/model_weights.h5');
model.loadWeights(modelWeights);

// تحميل تصنيفات الفئات
const classLabels = require('../../deepModels/feet/class_labels.json');

async function preprocessImage(imagePath) {
    // تغيير حجم الصورة ليتناسب مع حجم النموذج المدخل
    const img = await loadImage(imagePath);
    const canvas = createCanvas(150, 150);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 150, 150);
    const buffer = canvas.toBuffer('image/jpeg');
    return tf.node.decodeJpeg(buffer);
}

async function classifyImage(imagePath) {
    try {
        // معالجة الصورة
        const imgTensor = await preprocessImage(imagePath);
        const imgArray = imgTensor.arraySync();

        // توسيع الأبعاد وتطبيع القيم
        const inputTensor = tf.tensor4d(imgArray).div(tf.scalar(255.0));

        // التنبؤ باستخدام النموذج
        const predictions = model.predict(inputTensor);
        const predictedClassIndex = predictions.argMax(1).dataSync()[0];
        const predictedClassLabel = classLabels[predictedClassIndex];

        // إرجاع النتيجة ككائن JSON
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

module.exports = classifyImage;*/
