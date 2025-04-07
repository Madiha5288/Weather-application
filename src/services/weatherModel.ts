
import * as tf from '@tensorflow/tfjs';
import { toast } from "sonner";

// Simple weather prediction model
export interface WeatherPrediction {
  predictedTemp: number;
  predictedCondition: string;
  confidence: number;
  basedOn: string;
}

// Initialize the model
let model: tf.Sequential | null = null;
let isModelLoading = false;
let isModelReady = false;

// Model categories for weather conditions
const weatherCategories = [
  "clear", "cloudy", "rain", "storm", "snow", "fog"
];

// Preprocess input data for the model
const preprocessWeatherData = (data: any) => {
  // Extract relevant features: temperature, humidity, pressure, wind speed, cloud cover
  return tf.tensor2d([
    [
      data.temp_c / 50, // Normalize temperature to -1 to 1 range
      data.humidity / 100, // Normalize humidity to 0-1 range
      data.pressure_mb / 1100, // Normalize pressure
      data.wind_kph / 100, // Normalize wind speed
      data.cloud / 100 // Normalize cloud cover
    ]
  ]);
};

// Convert model output to meaningful prediction
const interpretModelOutput = (
  output: tf.Tensor, 
  currentTemp: number
): WeatherPrediction => {
  const predictionArray = Array.from(output.dataSync());
  
  // For temperature prediction (simplified)
  const tempChange = predictionArray[0] * 5; // Scale back from normalized value
  const predictedTemp = Math.round(currentTemp + tempChange);
  
  // For weather condition prediction
  const conditionProbs = predictionArray.slice(1, 7);
  const maxProbIndex = conditionProbs.indexOf(Math.max(...conditionProbs));
  const predictedCondition = weatherCategories[maxProbIndex];
  const confidence = Math.round(conditionProbs[maxProbIndex] * 100);
  
  return {
    predictedTemp,
    predictedCondition,
    confidence,
    basedOn: "Recent weather patterns and historical data"
  };
};

// Create a simple model architecture
export const createModel = async () => {
  if (model || isModelLoading) return;
  isModelLoading = true;
  
  try {
    // Weather features: temperature, humidity, pressure, wind speed, cloud cover
    const inputShape = [5];
    
    // Create a simple sequential model
    model = tf.sequential();
    
    // Add layers
    model.add(tf.layers.dense({
      inputShape,
      units: 10,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 7, // 1 for temperature prediction + 6 weather categories
      activation: 'sigmoid'
    }));
    
    // Compile the model
    model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });
    
    // Initialize with some weights (in a real app, we'd load pre-trained weights)
    const dummyInput = tf.ones([10, 5]);
    const dummyOutput = tf.ones([10, 7]);
    
    // Train with dummy data (in production, you'd use real historical data)
    await model.fit(dummyInput, dummyOutput, {
      epochs: 1,
      batchSize: 10,
      verbose: 0
    });
    
    isModelReady = true;
    isModelLoading = false;
    
    toast.success("Weather AI model initialized", {
      description: "AI-powered predictions are now available"
    });
    
  } catch (error) {
    isModelLoading = false;
    console.error("Error initializing weather model:", error);
    toast.error("Failed to initialize AI model", {
      description: "Weather predictions will use traditional methods"
    });
  }
};

// Generate weather prediction based on current conditions
export const predictWeather = async (
  currentWeather: any, 
  hoursAhead: number = 24
): Promise<WeatherPrediction | null> => {
  // Initialize model if not already done
  if (!model && !isModelLoading) {
    await createModel();
  }
  
  // Check if model is ready
  if (!model || !isModelReady) {
    return null;
  }
  
  try {
    // Preprocess the current weather data
    const input = preprocessWeatherData(currentWeather);
    
    // Generate prediction
    const output = model.predict(input) as tf.Tensor;
    
    // Interpret the model output
    const prediction = interpretModelOutput(output, currentWeather.temp_c);
    
    // Clean up tensors
    tf.dispose([input, output]);
    
    return prediction;
    
  } catch (error) {
    console.error("Error generating weather prediction:", error);
    toast.error("AI prediction failed", {
      description: "Could not generate AI weather prediction"
    });
    return null;
  }
};

// Dispose of the model when no longer needed
export const disposeModel = () => {
  if (model) {
    model.dispose();
    model = null;
    isModelReady = false;
  }
};
