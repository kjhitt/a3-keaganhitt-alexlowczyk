import drawNeedles from './charts/needle.js';
import drawHouses from './charts/houseOfRepresentatives.js';
import drawBarbell from './charts/barbell.js';
import drawMap from './charts/map.js';

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log(d3); //check d3 version loaded correctly

const button = document.getElementById("button"); //button on webpage (turns into submit later)
const slider = document.getElementById("percentInput");
var pictureCount = 19; //number of pictures clicked through in each visualization
var currentVis = 0; //to keep track of which visualization we're on
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
    //TODO: submit values to the server here
    document.getElementById("nameInput").hidden = true;
    //iterate pictures unless all 20 have been viewed, in which case move on    
    let current_trial = pictureCount;
    let recorded_type = currentVis;
     pictureCount++;
    if (pictureCount >= 20) {
        pictureCount = 0;
        currentVis += 1;
        //change the text only once for each visualization change
        if (currentVis === 1) {
            document.getElementById("header").textContent = "Visualization 1: The Needle";
            document.getElementById("description").textContent = "This chart is based on the NYTimes Needle, which shows the estimated chance of each party of winning. In this example, you will be measuring how far to the left the needle is on two charts - all the way to the left means 100% probability, middle = 50%, right = 0%.";
            document.getElementById("slider").classList.add("visibleSlider");
            document.getElementById("question").hidden = false;
        }
        if (currentVis === 2) {
            document.getElementById("header").textContent = "Visualization 2: Barbell Graph";
            document.getElementById("description").textContent = "This chart is a barbell graph, which is generally useful for comparing two groups. Here, the chart shows what percentage of Oklahoma and Massachusetts voted Democrat, along with a bubble for the average between the two weighted by population.";
            document.getElementById("question").textContent = "What percentage is the smaller proportion of Democrat votes of the larger proprotion?"
        }
        if (currentVis === 3) {
            document.getElementById("header").textContent = "Visualization 3: House of Representatives";
            document.getElementById("description").textContent = "This visualization shows which party won each seat in the House of Representatives, with the Democrat seats represented in blue and Republican seats represented in red.";
            document.getElementById("question").textContent = "What percentage is the smaller number of Democrat house seats of the larger number?"
        }
        if (currentVis === 4) {
            document.getElementById("header").textContent = "Visualization 4: Senate Map";
            document.getElementById("description").textContent = "This visualization is similar to the House of Representatives visualization, where states voting majority Democrat are colored in blue and states voting majority Republican are colored in red.";
            document.getElementById("question").textContent = "What percentage is the smaller number of states voting Democrat of the larger number of states voting Democrat?"
        }
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
            actual_percent_diff: current_percent_diff?current_percent_diff: percent1 < percent2 ? Math.round(((percent1/percent2) * 100)/5) * 5 : Math.round(((percent2/percent1) * 100)/5) * 5,
            reported_percent_diff: slider.value

        })
    });
}
current_percent_diff = percent1 < percent2 ? Math.round(((percent1/percent2) * 100)/5) * 5 : Math.round(((percent2/percent1) * 100)/5) * 5;
 button.textContent = "Submit";
 slider.value = 50; //resets the slider
document.getElementById("percentLabel").textContent = slider.value + "%";
}


button.addEventListener("click", onClick);
slider.addEventListener('input', () => {
    document.getElementById("percentLabel").textContent = slider.value + "%";
});