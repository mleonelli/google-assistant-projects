'use strict';

// Import the Dialogflow module and response creation dependencies
// from the Actions on Google client library.
const {
  dialogflow,
  BasicCard,
  Permission,
  Suggestions,
  Carousel,
  Image,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Define value band associations
const valueBandIT = {
  'nero': 0, 'marrone': 1,'rosso': 2	,'arancio': 3, 'arancione': 3,'giallo': 4	,'verde': 5	,'blu': 6, 'viola': 7, 'grigio': 8, 'bianco': 9
};

// Define multiplier band associations
const mulitplierBandIT = {
  'nero': 0, 'marrone': 1,'rosso': 2	,'arancio': 3, 'Arancione': 3,'giallo': 4	,'verde': 5	,'blu': 6, "viola": 7, 'oro': -1, 'argento': -2
};

// Define temperature band associations
const temperatureBandIT = {
  'nero': '200', 'marrone': '100', 'rosso': '50'	,'arancio': '25', 'arancione': '25','giallo': '15'	, 'viola': '5', 'grigio': '1'
};

// Define tolerance band association
const toleranceBand4IT = {
  'oro': 5, 'argento': 10
};

app.intent('resistor value', (conv, {band1, band2, band3, band4, band5, band6}) => {
    const audioSound = 'https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg';
    if(band6 === null || band6 === ''){
       if(band5 === null || band5 === ''){
            conv.close(`<speak>` + calc4bands(band1, band2, band3, band4) + 
             `Grazie per aver usato il servizio.</speak>`);
        } 
        else{
            conv.close(`<speak>` + calc5bands(band1, band2, band3, band4, band5) + 
             `Grazie per aver usato il servizio.</speak>`);
        }
    }
    else{
        conv.close(`<speak>` + calc4bands(band1, band2, band3, band4, band5, band6) + 
             `Grazie per aver usato il servizio.</speak>`);
    }
  
  //conv.ask(new Suggestions('Yes', 'No'));
});


function calc4bands(band1, band2, band3, band4){
  let ohm = (convertToValue(band1) * 10) + convertToValue(band2);
  console.log(ohm);
  console.log(convertToValue(band1));
  ohm = addMultiplier(ohm, band3);
  return "Il valore è " + ohm + " con una tolleranza di piú o meno " +  convertTolerance(band4, 4) + "%."; 
}

function calc5bands(band1, band2, band3, band4, band5){
  let ohm = (convertToValue(band1) * 100) + (convertToValue(band2) * 10)  + convertToValue(band3);
  ohm = addMultiplier(ohm, band4);
  return "Il valore è " + ohm + " con una tolleranza di piú o meno " +  convertTolerance(band5, 5) + "%."; 
}

function calc6bands(band1, band2, band3, band4, band5, band6){
  let ohm = (convertToValue(band1) * 100) + (convertToValue(band2) * 10)  + convertToValue(band3);
  ohm = addMultiplier(ohm, band4);
  return "Il valore è " + ohm + " con una tolleranza di piú o meno " +  convertTolerance(band5, 6) + "% e un coefficiente di temperatura di " + convertToTemperature(band6) + " ."; 
}

function convertToValue(band){
  return valueBandIT[band];
}

function convertTolerance(band, n){
  return toleranceBand4IT[band] + " <sub alias='parti per milione per grado Kelvin'>ppm/°K</sub>";
}

function addMultiplier(ohm, multiplier){
    console.log(ohm);
    console.log(multiplier);
  return format(eval("" + ohm + "e" + mulitplierBandIT[multiplier]));
}

function convertToTemperature(band){
  return temperatureBandIT[band];
}

function format(ohmage) {
	if (ohmage >= 10e5) {
		ohmage /= 10e5;
		return "" + ohmage + " <sub alias='mega om'>MΩ</sub>";
	} else {
		if (ohmage >= 10e2) {
			ohmage /= 10e2;
			return "" + ohmage + " <sub alias='chilo om'>KΩ</sub>";
		} else {
			return "" + ohmage + " <sub alias='om'>Ω</sub>";
		}
	}
}


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
