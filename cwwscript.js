const x1=document.getElementById("myknownX1")
const y1=document.getElementById("myknownY1")
const x2=document.getElementById("myknownX2")
const y2=document.getElementById("myknownY2")
const bearingbutton = document.getElementById("bearing")
const bearingresult= document.getElementById("bearingresult")

const nAngle=document.getElementById("myinputnumber1")
const nresult=document.getElementById("nresult")
const submitbutton = document.getElementById("submitbutton1")
const inputboxAngles=document.getElementById("inputboxAngles")

function getBearing() {
    const x1Value = parseFloat(x1.value);
    const y1Value = parseFloat(y1.value);
    const x2Value = parseFloat(x2.value);
    const y2Value = parseFloat(y2.value);
    if (isNaN(x1Value) || isNaN(y1Value) || isNaN(x2Value) || isNaN(y2Value)) {
        bearingresult.textContent = "Please enter valid coordinates for both stations.";
        return;
    }
    const dx = x2Value - x1Value;
    const dy = y2Value - y1Value;
    let bearing = Math.atan2(dx, dy) * (180 / Math.PI);
    if (bearing < 0) {
        bearing += 360;
    }
    bearingresult.textContent = 'The bearing of line 12 is:' + bearing.toFixed(2)+'°';
}
bearingbutton.addEventListener('click', getBearing);

function getnAngles()
{
    const numberofAngles=parseInt(nAngle.value,10);
    nresult.textContent="Enter each Angles in decimal degrees (Angles in degree minute seconds cannot be proceed!!)";
    inputboxAngles.innerHTML="";


    if(isNaN(numberofAngles)|| numberofAngles<=0)
    {
        nresult.textContent="Please enter a valid number greater than 0."
        return;
    }
    else if(numberofAngles<3)
    {
        nresult.textContent="A minimum of three angles is required for a closed traverse."
        return;
    }

    for(let i=0; i<numberofAngles; i++)
    {
        const inputBox=document.createElement("input");
        inputBox.type="number";
        inputBox.placeholder="Enter Angle"+(i+1)+":";
        inputBox.className="angleInputBox"
        inputboxAngles.appendChild(inputBox);
    }

    if (!document.getElementById('calculateButton')) 
    {
        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'CalculateClosingError';
        calculateButton.id = 'calculateButton';
        inputboxAngles.appendChild(calculateButton);
        calculateButton.addEventListener('click', storeAngle); 
    }
}

function storeAngle() 
{

    const inputBoxes = document.querySelectorAll('.angleInputBox');
    var angles = [];

    for (let i = 0; i < inputBoxes.length; i++) {
        const inputBoxx = inputBoxes[i];
        const angleValue = parseFloat(inputBoxx.value);

        if (!isNaN(angleValue)) {
            angles.push(angleValue);
        } else {
            alert('Please enter a valid number for Angle ' + (i + 1) + ":");
            return;
        }
    }

    var observedAngle = 0
    for (let i = 0; i < angles.length; i++) {
        observedAngle += angles[i];
    }

    const actualAngle = (angles.length - 2) * 180;
    const Correction = actualAngle - observedAngle;
    var disCorrection = Correction / angles.length;

    inputboxAngles.innerHTML += "<br>";
    inputboxAngles.innerHTML += "<br>";
    inputboxAngles.innerHTML += "Total Observed Angle Sum: " + observedAngle.toFixed(2) + "°";
    inputboxAngles.innerHTML += "<br>";
    inputboxAngles.innerHTML += "Total Actual Angle Sum: " + actualAngle.toFixed(2) + "°";
    inputboxAngles.innerHTML += "<br>";
    inputboxAngles.innerHTML += "Error: " + Correction.toFixed(2) + "°";
    inputboxAngles.innerHTML += "<br>";
    inputboxAngles.innerHTML += "<br>";
    inputboxAngles.innerHTML += '<strong>Corrected Angles:</strong>';
    inputboxAngles.innerHTML += "<br>";

    for (let i = 0; i < angles.length; i++) {
        const correctedAngle = angles[i] + disCorrection;
        const correctedInputBox = document.createElement("input");
        correctedInputBox.type = "text"; 
        correctedInputBox.value = 'Angle' +(i + 1)+":"+ correctedAngle.toFixed(3)+"°"; 
        correctedInputBox.disabled = true; 
        correctedInputBox.className = "correctedAngleBox";
        inputboxAngles.appendChild(correctedInputBox);
        inputboxAngles.appendChild(document.createElement("br"));
    }

    // Button to Calculate Bearings
    const calculateBearingsButton = document.createElement('button');
    calculateBearingsButton.textContent = 'Calculate Bearings';
    calculateBearingsButton.id = 'calculateBearingsButton';
    inputboxAngles.appendChild(calculateBearingsButton);
    calculateBearingsButton.addEventListener('click', calculateBearings);

    
}


function calculateBearings() {
    const correctedAngles = document.querySelectorAll('.correctedAngleBox');
    const initialBearing = parseFloat(bearingresult.textContent.split(":")[1]);
    let currentBearing = initialBearing;

    

    const bearingsContainer = document.createElement('div');
    bearingsContainer.id = 'bearingsContainer';
    inputboxAngles.appendChild(bearingsContainer);

    bearingsContainer.innerHTML += '<strong>Calculated Bearings:</strong><br>';

    const initialBearingBox = document.createElement("input");
    initialBearingBox.type = "text";
    initialBearingBox.value = 'Bearing 1:'+ currentBearing.toFixed(2)+"°";
    initialBearingBox.disabled = true;
    initialBearingBox.className = "bearingBox";
    bearingsContainer.appendChild(initialBearingBox);
    bearingsContainer.appendChild(document.createElement("br"));

    for (let i = 0; i < correctedAngles.length; i++) {
        const angleValue = parseFloat(correctedAngles[i].value.split(":")[1]);
        currentBearing = calculateNewBearing(currentBearing, angleValue);

        const bearingInputBox = document.createElement("input");
        bearingInputBox.type = "text";
        bearingInputBox.value = "Bearing" +(i+2)+ ":"+ currentBearing.toFixed(2)+"°";
        bearingInputBox.disabled = true;
        bearingInputBox.className = "bearingBox";
        bearingsContainer.appendChild(bearingInputBox);
        bearingsContainer.appendChild(document.createElement("br"));
    }

    // Button to Enter Distance
    const enterdistanceButton = document.createElement('button');
    enterdistanceButton.textContent = 'Enter Distance';
    enterdistanceButton.id = 'enterdistanceButton';
    inputboxAngles.appendChild(enterdistanceButton);
    enterdistanceButton.addEventListener('click', enterDistance);
}

function calculateNewBearing(previousBearing, includedAngle) {

    if(previousBearing<180)
    {
        let newBearing = previousBearing + 180+includedAngle;
        if (newBearing >= 360) {
        newBearing -=360;}
        else if (newBearing < 0) {
        newBearing+= 360;}
        return newBearing;
    }

    else
    {
        let newBearing = previousBearing - 180+ includedAngle;
        if (newBearing >= 360) {
        newBearing -= 360;}
        else if (newBearing < 0) {
        newBearing += 360;}
        return newBearing;
    }
}

function enterDistance() 
{
    const bearingBoxes = document.querySelectorAll('.bearingBox');
    
    
    const oldDistancesContainer = document.getElementById('distancesContainer');
    if (oldDistancesContainer) {
        oldDistancesContainer.remove();
    }

    const distancesContainer = document.createElement('div');
    distancesContainer.id = 'distancesContainer';
    inputboxAngles.appendChild(distancesContainer);

    distancesContainer.innerHTML += '<strong>Enter Distances:</strong><br>';

    for (let i = 1; i < bearingBoxes.length; i++) {  
        const distanceInputBox = document.createElement("input");
        distanceInputBox.type = "number";
        distanceInputBox.placeholder = "Distance"+ i;
        distanceInputBox.className = "distanceInputBox";
        distancesContainer.appendChild(distanceInputBox);
        distancesContainer.appendChild(document.createElement("br"));
    }

    // Button to Calculate Latitude and Departure
    const calculateLatDepButton = document.createElement('button');
    calculateLatDepButton.textContent = 'Calculate Latitude and Departure';
    calculateLatDepButton.id = 'calculateLatDepButton';
    distancesContainer.appendChild(calculateLatDepButton);
    calculateLatDepButton.addEventListener('click', calculateLatitudeDeparture);
}

function calculateLatitudeDeparture() {
    const bearingBoxes = document.querySelectorAll('.bearingBox');
    const distanceInputs = document.querySelectorAll('.distanceInputBox');
    
    const oldResultsContainer = document.getElementById('resultsContainer');
    if (oldResultsContainer) {
        oldResultsContainer.remove();
    }

    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'resultsContainer';
    inputboxAngles.appendChild(resultsContainer);

    let totalLatitude = 0;
    let totalDeparture = 0;
    let perimeter = 0;
    window.lines = []; 

    resultsContainer.innerHTML += '<strong>Calculated Latitude and Departure:</strong><br>';

    for (let i = 0; i < distanceInputs.length; i++) {
        const bearing = parseFloat(bearingBoxes[i + 1].value.split(":")[1]);
        const distance = parseFloat(distanceInputs[i].value);

        if (isNaN(distance) || isNaN(bearing)) {
            alert("Please enter a valid distance and bearing for line"+ (i + 1));
            return;
        }

        const latitude = distance * Math.cos(bearing * Math.PI / 180);
        const departure = distance * Math.sin(bearing * Math.PI / 180);

        totalLatitude += latitude;
        totalDeparture += departure;
        perimeter += distance;

        window.lines.push({distance, latitude, departure});

        const resultBox = document.createElement("input");
        resultBox.type = "text";
        resultBox.value = "Line" +(i + 1)+":" +"Lat="+latitude.toFixed(4)+","+ "Dep=" +departure.toFixed(4);
        resultBox.disabled = true;
        resultBox.className = "latDepBox";
        resultsContainer.appendChild(resultBox);
        resultsContainer.appendChild(document.createElement("br"));
    }

    const totalBox = document.createElement("input");
    totalBox.type = "text";
    totalBox.value = "Total:" +"Lat=" +totalLatitude.toFixed(4)+","+ "Dep=" +totalDeparture.toFixed(4);
    totalBox.disabled = true;
    totalBox.className = "latDepBox";
    resultsContainer.appendChild(totalBox);
    resultsContainer.appendChild(document.createElement("br"));

    // Adding button for Bowditch correction
    const correctButton = document.createElement('button');
    correctButton.textContent = 'Apply Bowditch Correction';
    correctButton.id = 'correctLatDepButton';
    resultsContainer.appendChild(correctButton);
    correctButton.addEventListener('click', applyBowditchCorrection);
}

function applyBowditchCorrection() {
    const resultsContainer = document.getElementById('resultsContainer');
    const existingContent = resultsContainer.innerHTML;

    // Calculate totals again
    let totalLatitude = 0;
    let totalDeparture = 0;
    let perimeter = 0;
    for (const line of window.lines) {
        totalLatitude += line.latitude;
        totalDeparture += line.departure;
        perimeter += line.distance;
    }

    resultsContainer.insertAdjacentHTML('beforeend', '<br><strong>Corrected Latitude and Departure:</strong><br>');

    let correctedTotalLat = 0;
    let correctedTotalDep = 0;

    for (let i = 0; i < window.lines.length; i++) {
        const line = window.lines[i];
        const latCorrection = (totalLatitude * line.distance) / perimeter;
        const depCorrection = (totalDeparture * line.distance) / perimeter;

        const correctedLat = line.latitude - latCorrection;
        const correctedDep = line.departure - depCorrection;

        correctedTotalLat += correctedLat;
        correctedTotalDep += correctedDep;

        const correctedBox = document.createElement("input");
        correctedBox.type = "text";
        correctedBox.value = "Line" +(i + 1)+":" +"Lat=" +correctedLat.toFixed(4)+","+ "Dep=" +correctedDep.toFixed(4);
        correctedBox.disabled = true;
        correctedBox.className = "correctedLatDepBox";
        resultsContainer.appendChild(correctedBox);
        resultsContainer.appendChild(document.createElement("br"));

        // Sotring corrected values in the lines array
        window.lines[i].correctedLatitude = correctedLat;
        window.lines[i].correctedDeparture = correctedDep;
       
    }
    const correctedTotalBox = document.createElement("input");
    correctedTotalBox.type = "text";
    correctedTotalBox.value = `Corrected Totals: Lat ${correctedTotalLat.toFixed(4)}, Dep ${correctedTotalDep.toFixed(4)}`;
    correctedTotalBox.disabled = true;
    correctedTotalBox.className = "correctedLatDepBox";
    resultsContainer.appendChild(correctedTotalBox);
    resultsContainer.appendChild(document.createElement("br"));

    if (!document.getElementById('calculateCoordinatesButton')){

        // Adding  button to calculate coordinates
        const calculateCoordinatesButton = document.createElement('button');
        calculateCoordinatesButton.textContent = 'Calculate Coordinates';
        calculateCoordinatesButton.id = 'calculateCoordinatesButton';
        resultsContainer.appendChild(calculateCoordinatesButton);
        calculateCoordinatesButton.addEventListener('click', calculateCoordinates);}
}
 
function calculateCoordinates(){
    const resultsContainer = document.getElementById('resultsContainer');
    const x1Value = parseFloat(document.getElementById("myknownX1").value);
    const y1Value = parseFloat(document.getElementById("myknownY1").value);

    if (isNaN(x1Value) || isNaN(y1Value)) {
        alert("Please enter valid coordinates for the first known station.");
        return;
    }

    resultsContainer.insertAdjacentHTML('beforeend', '<br><strong>Calculated Coordinates:</strong><br>');


    let currentX = x1Value;
    let currentY = y1Value;

    const coordinateBox = document.createElement("input");
    coordinateBox.type = "text";
    coordinateBox.value = `Station 1: X ${currentX.toFixed(4)}, Y ${currentY.toFixed(4)}`;
    coordinateBox.disabled = true;
    coordinateBox.className = "coordinateBox";
    resultsContainer.appendChild(coordinateBox);
    resultsContainer.appendChild(document.createElement("br"));

    for (let i = 0; i < window.lines.length; i++) {
        const line = window.lines[i];
        currentX += line.correctedDeparture;
        currentY += line.correctedLatitude;

        const coordinateBox = document.createElement("input");
        coordinateBox.type = "text";
        coordinateBox.value = `Station ${i + 2}: X ${currentX.toFixed(4)}, Y ${currentY.toFixed(4)}`;
        coordinateBox.disabled = true;
        coordinateBox.className = "coordinateBox";
        resultsContainer.appendChild(coordinateBox);
        resultsContainer.appendChild(document.createElement("br"));
    }
    if (!document.getElementById('calculateMisclosureButton')) {
        const misclosureButton = document.createElement('button');
        misclosureButton.textContent = 'Show Misclosure and Linear Accuracy';
        misclosureButton.id = 'calculateMisclosureButton';
        resultsContainer.appendChild(misclosureButton);
        misclosureButton.addEventListener('click', calculateMisclosureAndAccuracy);}
}
function calculateMisclosureAndAccuracy() {
    const resultsContainer = document.getElementById('resultsContainer');

    
    let uncorrectedTotalLat = 0;
    let uncorrectedTotalDep = 0;
    let perimeter = 0;

    for (const line of window.lines) {
        uncorrectedTotalLat += line.latitude;      
        uncorrectedTotalDep += line.departure;     
        perimeter += line.distance;
    }
    const misclosure = Math.sqrt(Math.pow(uncorrectedTotalLat, 2) + Math.pow(uncorrectedTotalDep, 2));
    const linearAccuracy = perimeter / misclosure;

    resultsContainer.insertAdjacentHTML('beforeend', `<br><strong>Misclosure: </strong>${misclosure.toFixed(4)} units<br>`);
    resultsContainer.insertAdjacentHTML('beforeend', `<strong>Linear Accuracy: </strong>${linearAccuracy.toFixed(4)} (Perimeter / Misclosure)<br>`);
}





submitbutton.addEventListener('click', getnAngles);