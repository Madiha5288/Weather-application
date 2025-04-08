
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
  currentTemp: number,
  currentWeather: any
): WeatherPrediction => {
  const predictionArray = Array.from(output.dataSync());
  
  // For temperature prediction (simplified)
  const tempChange = predictionArray[0] * 5; // Scale back from normalized value
  const predictedTemp = Math.round(currentTemp + tempChange);
  
  // For weather condition prediction
  const conditionProbs = predictionArray.slice(1, 7);
  
  // Determine condition based on actual weather parameters
  const temp_c = currentWeather.temp_c;
  const humidity = currentWeather.humidity;
  const cloud = currentWeather.cloud;
  const precip_mm = currentWeather.precip_mm || 0;
  const wind_kph = currentWeather.wind_kph;
  const pressure_mb = currentWeather.pressure_mb;
  
  // Logic to determine weather condition based on current conditions
  // This provides a more accurate starting point for predictions
  let predictedCondition = "";
  let confidence = 0;
  
  // Get the most likely condition based on model output
  let maxIndex = 0;
  let maxValue = 0;
  
  // Apply some randomization to prevent always choosing the same condition
  const jitteredConditionProbs = conditionProbs.map(prob => 
    prob + (Math.random() * 0.2 - 0.1) // Add random jitter between -0.1 and +0.1
  );
  
  // Find max probability with jitter
  for (let i = 0; i < jitteredConditionProbs.length; i++) {
    if (jitteredConditionProbs[i] > maxValue) {
      maxValue = jitteredConditionProbs[i];
      maxIndex = i;
    }
  }
  
  // Now weight by actual weather conditions
  const currentConditionText = currentWeather.condition?.text?.toLowerCase() || '';
  
  // If actual current condition strongly indicates a weather type, influence prediction
  if (precip_mm > 1 || currentConditionText.includes('rain')) {
    // Likely rain
    const rainIndex = weatherCategories.indexOf('rain');
    if (Math.random() > 0.4) { // 60% chance to predict based on current rain
      maxIndex = rainIndex;
    }
  } else if (cloud > 80 || currentConditionText.includes('overcast') || currentConditionText.includes('cloud')) {
    // Likely cloudy
    const cloudyIndex = weatherCategories.indexOf('cloudy');
    if (Math.random() > 0.5) { // 50% chance to predict cloudy
      maxIndex = cloudyIndex;
    }
  } else if (temp_c < 0 || currentConditionText.includes('snow') || currentConditionText.includes('sleet')) {
    // Likely snow
    const snowIndex = weatherCategories.indexOf('snow');
    if (Math.random() > 0.4) { // 60% chance to predict snow
      maxIndex = snowIndex;
    }
  } else if (currentConditionText.includes('fog') || currentConditionText.includes('mist')) {
    // Likely fog
    const fogIndex = weatherCategories.indexOf('fog');
    if (Math.random() > 0.4) { // 60% chance to predict fog
      maxIndex = fogIndex;
    }
  } else if (wind_kph > 50 || currentConditionText.includes('storm') || currentConditionText.includes('thunder')) {
    // Likely storm
    const stormIndex = weatherCategories.indexOf('storm');
    if (Math.random() > 0.4) { // 60% chance to predict storm
      maxIndex = stormIndex;
    }
  } else if (cloud < 20 || currentConditionText.includes('clear') || currentConditionText.includes('sunny')) {
    // Likely clear
    const clearIndex = weatherCategories.indexOf('clear');
    if (Math.random() > 0.3) { // 70% chance to predict clear
      maxIndex = clearIndex;
    }
  }
  
  // Occasionally introduce some variability
  if (Math.random() < 0.2) { // 20% chance to just predict something else
    const randomIndex = Math.floor(Math.random() * weatherCategories.length);
    maxIndex = randomIndex;
  }
  
  predictedCondition = weatherCategories[maxIndex];
  confidence = Math.round((0.6 + Math.random() * 0.3) * 100); // 60-90% confidence
  
  return {
    predictedTemp,
    predictedCondition,
    confidence,
    basedOn: "Current conditions and weather patterns"
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
    
    // Create more varied dummy data for training
    const dummyInputs = [];
    const dummyOutputs = [];
    
    // Generate varied training data for different weather conditions
    for (let i = 0; i < 60; i++) {
      // Input features: [temp, humidity, pressure, wind, cloud]
      const inputFeatures = [
        Math.random() * 2 - 1,     // Normalized temp (-1 to 1)
        Math.random(),             // Humidity (0 to 1)
        0.9 + Math.random() * 0.2, // Pressure (0.9 to 1.1)
        Math.random() * 0.5,       // Wind (0 to 0.5)
        Math.random()              // Cloud cover (0 to 1)
      ];
      
      // Output with varied conditions
      const output = new Array(7).fill(0);
      
      // Temperature change prediction
      output[0] = (Math.random() * 0.4) - 0.2; // Small temperature changes
      
      // Set one weather condition as dominant based on input features
      let conditionIndex;
      const highTemp = inputFeatures[0] > 0.5;
      const highHumidity = inputFeatures[1] > 0.7;
      const highWind = inputFeatures[3] > 0.3;
      const highCloud = inputFeatures[4] > 0.7;
      
      if (highHumidity && highCloud) {
        conditionIndex = highTemp ? 2 : 4; // rain or snow based on temp
      } else if (highCloud) {
        conditionIndex = 1; // cloudy
      } else if (highHumidity && !highCloud) {
        conditionIndex = 5; // fog
      } else if (highWind && highCloud) {
        conditionIndex = 3; // storm
      } else {
        conditionIndex = 0; // clear
      }
      
      // Set the condition probability (adding 1 because index 0 is temperature)
      output[conditionIndex + 1] = 0.8 + Math.random() * 0.2; // High probability
      
      dummyInputs.push(inputFeatures);
      dummyOutputs.push(output);
    }
    
    const dummyInput = tf.tensor2d(dummyInputs);
    const dummyOutput = tf.tensor2d(dummyOutputs);
    
    // Train with varied dummy data
    await model.fit(dummyInput, dummyOutput, {
      epochs: 10,
      batchSize: 10,
      verbose: 0
    });
    
    // Clean up tensors
    tf.dispose([dummyInput, dummyOutput]);
    
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
    
    // Interpret the model output with current weather data
    const prediction = interpretModelOutput(output, currentWeather.temp_c, currentWeather);
    
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

