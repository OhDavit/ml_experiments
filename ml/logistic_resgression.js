"use strict";

var ml = require('machine_learning');
const TrainingEpochs = 1000, alpha = 0.01;

class LogisticRegression {
   
   constructor(learingData) {
    let data  = LogisticRegression.generateLearningArray(learingData);
    console.log(data);
     this.classifier =  new ml.LogisticRegression({
        'input' : data.learningArray,
        'label' : data.outputArray,
        'n_in' : 4,
        'n_out' : 2
      });
     this.classifier.set('log level', 1);
   }

   train() {
    this.classifier.train({
    'lr' : alpha,
    'epochs' : TrainingEpochs
    });
   }

   predict(testData) {
    let data  = LogisticRegression.generateLearningArray(testData);
    console.log(data.learningArray);
    return this.classifier.predict(data.learningArray);
   }

   // adapter function
 static generateLearningArray (data) {
    let learningArray = [];
    let outputArray = [];
    data.forEach((sample) => {
        let sampleLearningArray = [];
        sampleLearningArray.push(sample.duration);
        sampleLearningArray.push(sample.price);
        sampleLearningArray.push(sample.stops);
        sampleLearningArray.push(sample.freeBaggage);
        learningArray.push(sampleLearningArray);
        outputArray.push(sample.output);
    });

    return {
        learningArray : learningArray,
        outputArray: outputArray
    }
 }


}

class FlightLearningData {
  

  constructor(d, p, s, fb, o) {
    this.duration = d;
    this.price = p;
    this.stops = s;
    this.freeBaggage = fb;
    this.output = o;
 }
 


  static scale(data, maxMin) {
    
    let durationScalingData = -1;
    let newDataSet = [];
    data.forEach((sample) => {
        let newData = new FlightLearningData();
        newData.duration = (sample.duration - maxMin.durations.average)/(maxMin.durations.max - maxMin.durations.min);
        newData.price = (sample.price - maxMin.prices.average)/(maxMin.prices.max - maxMin.prices.min);
        newData.stops = (sample.stops - maxMin.stops.average)/(maxMin.stops.max - maxMin.stops.min);
        newData.freeBaggage = (sample.freeBaggage - maxMin.freeBaggages.average)/(maxMin.freeBaggages.max - maxMin.freeBaggages.min);
        newData.output = sample.output;
        newDataSet.push(newData);
    });

    return newDataSet;
  }
  static getFeaturesMaxMin(data) {
    let durations = [];
    let prices = [];
    let stops = [];
    let freeBaggages = [];
    
    data.forEach((sample) => {
        console.log(sample);
        durations.push(sample.duration);
        prices.push(sample.price);
        stops.push(sample.stops);
        freeBaggages.push(sample.freeBaggage);
    });

    return {
        durations: {
           max: Math.max.apply(null, durations),
           min: Math.min.apply(null, durations),
           average: FlightLearningData.calculateAverage(durations)
        } ,
        prices: {
           max: Math.max.apply(null, prices),
           min: Math.min.apply(null, prices),
           average: FlightLearningData.calculateAverage(prices) 
        } ,
        stops: {
           max: Math.max.apply(null, stops),
           min: Math.min.apply(null, stops),
           average: FlightLearningData.calculateAverage(stops) 
        } ,
        freeBaggages: {
           max: Math.max.apply(null, freeBaggages),
           min: Math.min.apply(null, freeBaggages),
           average: FlightLearningData.calculateAverage(freeBaggages)
        }
    }
  }

  static calculateAverage(numberArray) {
    let total = 0;
    numberArray.forEach(function (grade) {
        total += grade        
    });
    return total / numberArray.length;
  }
}

// Sample data for TXL-MUC. first is duration in minutes, second, price, thirds stops, 4th has baggage
let f1 = new FlightLearningData(60, 100, 0, 1, [1,0]);
let f2 = new FlightLearningData(90, 80, 0, 1, [1,0]);
let f3 = new FlightLearningData(48, 110, 0, 1, [1,0]);
let f4 = new FlightLearningData(180, 100, 1, 1, [0,1]);
let f5 = new FlightLearningData(150, 90, 0, 1, [0,1]);
let f6 = new FlightLearningData(90, 100, 0, 0, [0,1]);
let f7 = new FlightLearningData(78, 70, 0, 1, [1,0]);

let trainingData = [f1, f2, f3, f4, f5, f6, f7];
let maxMin = FlightLearningData.getFeaturesMaxMin(trainingData);
let scaledData = FlightLearningData.scale(trainingData, maxMin);


let lg = new LogisticRegression(scaledData);
lg.train();

let newD = new FlightLearningData(40, 70, 0, 1);
let newMaxMin = FlightLearningData.getFeaturesMaxMin([newD].concat(trainingData));

let testData = FlightLearningData.scale([newD], newMaxMin);

console.log(lg.predict(testData));




