import drawNeedles from './charts/needle.js';
import drawHouses from './charts/houseOfRepresentatives.js';
import drawBarbell from './charts/barbell.js';
import drawMap from './charts/map.js';

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log(d3); //check d3 version loaded correctly

const button = document.getElementById("button"); //button on webpage (turns into submit later)
const slider = document.getElementById("percentInput"); //slider input for %
const sliderText = document.getElementById("percentText"); //text input for %
var pictureCount = [0, 0, 0, 0]; //number of pictures clicked through in each visualization
var currentVis = 0; //to keep track of which visualization we're on
var firstClick = true; //first click should do different things than each other click
let current_percent_diff = null;

function drawVisualization() {
    document.querySelectorAll(".chart").forEach(chart => chart.remove()); //remove chart if it exists
    var percent1 = Math.random() * 100;
    var percent2 = Math.random() * 100;
    console.log(percent1, percent2); //log the random percentages for debugging

    //draws different visualizations depending on which it's on
    if (currentVis === 1) {
        drawNeedles(percent1, percent2);
    }
    else if (currentVis === 2) {
        drawBarbell(percent1, percent2);
    }
    else if (currentVis === 3) {
        drawHouses(percent1, percent2);
    }
    else if (currentVis === 4) {
        drawMap(percent1, percent2);
    }
    else if (currentVis >= 5) {
        button.remove();
        document.getElementById("header").textContent = "Congratulations!";
        document.getElementById("description").textContent = "All questions are complete and we have your results.";
        document.getElementById("slider").classList.remove("visibleSlider");
        document.getElementById("question").hidden = true;
    }
    return {percent1, percent2};
}

//function for when the button is clicked, moves on to the next step
async function onClick() {
    let current_trial = Math.sumPrecise(pictureCount);
    let recorded_type = currentVis;
  
    //unhide/hide different things on first click
    if (firstClick) {
        document.getElementById("slider").classList.add("visibleSlider");
        document.getElementById("question").hidden = false;
        document.getElementById("nameInput").hidden = true;
        button.textContent = "Submit";
        firstClick = false;
    }
    //iterate pictures unless all 20 have been viewed, in which case move on
    if (Math.sumPrecise(pictureCount) >= 80) {
        currentVis = 5;
    }
    else {
        //index to random integer from the visualizations available
        var index = Math.trunc(Math.random() * pictureCount.length);
        while (pictureCount[index] >= 20) {
            var index = Math.trunc(Math.random() * pictureCount.length); //reroll if reached above 20
            //kinda inefficient, but not that much in the scale of things - only 4 elements in the array
        }
        pictureCount[index]++;
        currentVis = index + 1; //sets current vis to whichever was just incremented
    }
    console.log(pictureCount);

    if (currentVis === 1) {
        document.getElementById("header").textContent = "The Needle";
        document.getElementById("description").textContent = "This chart is based on the NYTimes Needle, which shows the estimated chance of each party of winning. In this example, you will be measuring how far to the left the needle is on two charts - all the way to the left means 100% probability, middle = 50%, right = 0%.";
        document.getElementById("question").textContent = "What percentage is the smaller estimate of Democrat victory of the larger estimate?";
    }
    if (currentVis === 2) {
        document.getElementById("header").textContent = "Barbell Graph";
        document.getElementById("description").textContent = "This chart is a barbell graph, which is generally useful for comparing two groups. Here, the chart shows what percentage of Oklahoma and Massachusetts voted Democrat, along with a bubble for the average between the two weighted by population.";
        document.getElementById("question").textContent = "What percentage is the smaller proportion of Democrat votes of the larger proprotion?"
    }
    if (currentVis === 3) {
        document.getElementById("header").textContent = "House of Representatives";
        document.getElementById("description").textContent = "This visualization shows which party won each seat in the House of Representatives, with the Democrat seats represented in blue and Republican seats represented in red.";
        document.getElementById("question").textContent = "What percentage is the smaller number of Democrat house seats of the larger number?"
    }
    if (currentVis === 4) {
        document.getElementById("header").textContent = "Senate Map";
        document.getElementById("description").textContent = "This visualization shows states voting majority Democrat colored in blue and states voting majority Republican colored in red, such as in a map of senate elections. However, in a real senate election not all states participate.";
        document.getElementById("question").textContent = "What percentage is the smaller number of states voting Democrat of the larger number of states voting Democrat?"
    }

    const {percent1, percent2} = drawVisualization();
    if (button.textContent === "Submit") {
      const res = await fetch("/submit", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              name: document.getElementById("nameInput").value,
              visualization_type: recorded_type,
              trial_number: current_trial,
              actual_percent_diff: current_percent_diff?? percent1 < percent2 ? (percent1/percent2) * 100: (percent2/percent1) * 100,
              reported_percent_diff: slider.value

          })
      });
    }
    current_percent_diff = percent1 < percent2 ? (percent1/percent2) * 100 : (percent2/percent1) * 100;
    slider.value = 50; //resets the slider
    sliderText.value = 50;
}

//event listeners
button.addEventListener("click", onClick);
slider.addEventListener('input', () => {
    sliderText.value = slider.value;
    console.log("slider: ", slider.value, "sliderText: ", sliderText.value);
});
//once text is updated need a lot more checks to determine correct input
function boundVal(val) {
    if (Number.isNaN(val)) {
        val = 50; //default if NaN
    }
    else if (val > 100) {
        val = 100; //capped at 100
    }
    else if (val < 0) {
        val = 0; //min is 0
    }

    return val;
}
sliderText.addEventListener('input', () => {
    let val = Number(sliderText.value) //convert to num
    val = boundVal(val)

    sliderText.value = Math.round(val); //just in case float stuff is weird
    slider.value = sliderText.value; //update slider
    console.log("slider: ", slider.value, "sliderText: ", sliderText.value);
});
//need separate listener for change so that it does rounding after value typed in
sliderText.addEventListener('change', () => {
    let val = Number(sliderText.value) //convert to num
    val = boundVal(val)

    if (val % 5 != 0) {
        //need to round to nearest 5
        if (val % 5 < 2.5) {
            val = val - (val % 5);
        }
        else {
            val = val + 5 - (val % 5);
        }
        console.log(val);
    }

    sliderText.value = Math.round(val); //just in case float stuff is weird
    slider.value = sliderText.value; //update slider
    console.log("slider: ", slider.value, "sliderText: ", sliderText.value);
})