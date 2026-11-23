import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function drawHouses(left, right) {
    drawHouse(left);
    drawHouse(right);
}

function drawHouse(percentage) {
    const width = 400;
    const height = 300;
    const houseSeats = 435;
    const seatDistribution = [22,24,27,31,35,39,43,47,51,56,60] //# of seats in each arc
    var maxRadius = Math.min(width/2, height - width/50); //can't have it go past svg bounds
    maxRadius = maxRadius * 0.95; //just to leave some white space at the edge
    var minRadius = maxRadius * 0.4;

    var demSeats = Math.trunc(houseSeats * percentage * 1/100); //technically slightly lower using trunc, but 1/(435 * 2) at max isn't much
    var demSeatDistribution = []
    //distribute seats in each arc by percentage
    for (let i = 0; i < seatDistribution.length; i++) {
        demSeatDistribution.push(Math.trunc(seatDistribution[i] * percentage * 1/100));
    }
    
    //some seats will be missing because of truncation - need to add them
    var missingSeats = demSeats - Math.sumPrecise(demSeatDistribution)
    for (let i = 0; i < missingSeats; i++) {
        demSeatDistribution[demSeatDistribution.length - 1 - i] += 1;
    }

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart");

    //function to draw an arc of seats at a specific radius
    function drawArc(seats, demSeatsArc, radius) {
        for (let i = 0; i < seats; i++) {
            var angle = -i/(seats - 1) * Math.PI + Math.PI
            svg.append('circle')
                .attr('cx', width/2 + radius * Math.cos(angle))
                .attr('cy', height/6 + radius * Math.sin(angle))
                .attr('r', width/100)
                .attr('stroke', 'black')
                .attr('stroke-width', '0.5px')
                .attr('fill', i < demSeatsArc ? "#002df5" : "#f50000");
        }
    }

    //now draw each arc
    for (let i = 0; i < demSeatDistribution.length; i++) {
        var radius = minRadius + (maxRadius - minRadius) * i/(demSeatDistribution.length - 1);
        drawArc(seatDistribution[i], demSeatDistribution[i], radius);
    }

    // Append the SVG element.
    scriptcontainer.append(svg.node());
}