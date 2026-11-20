import drawNeedles from './charts/needle.js';
import drawHouses from './charts/houseOfRepresentatives.js';
import drawBarbell from './charts/barbell.js';
import drawMap from './charts/map.js';

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

console.log(d3); //check d3 version loaded correctly

const button = document.getElementById("button"); //button on webpage (turns into submit later)
var pictureCount = 20; //number of pictures clicked through in each visualization
var currentVis = 0; //to keep track of which visualization we're on

function drawVisualization() {
    document.querySelectorAll(".chart").forEach(chart => chart.remove()); //remove chart if it exists
    var percent1 = Math.random() * 100;
    var percent2 = Math.random() * 100;
    if (currentVis === 1) {
        drawNeedles(Math.random() * 100, Math.random() * 100);
    }
    else if (currentVis === 2) {
        drawHouses(Math.random() * 100, Math.random() * 100);
    }
    else if (currentVis === 3) {
        drawBarbell();
    }
    else if (currentVis === 4) {
        drawMap();
    }
}

//function for when the button is clicked, moves on to the next step
function onClick() {
    //iterate pictures unless all 20 have been viewed, in which case move on
    if (pictureCount === 20) {
        pictureCount = 0;
        currentVis += 1;
    } else {
        pictureCount++;
    }
    drawVisualization();
}

button.addEventListener("click", onClick);
