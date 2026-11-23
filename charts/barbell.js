import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
export default function drawBarbell(percentOne, percentTwo){
    const width = 800
    const height = 300
    const svg = d3.create("svg").attr("width",width).attr("height", height).attr("class", "chart");
    const xScale = d3.scaleLinear().domain([0,1]).range([0,width - 100])
    svg.append("g").attr("transform", `translate(50, ${height - 25})`).style("font-family", "Arial").call(d3.axisBottom(xScale).tickFormat(d3.format(".0%")));
    const random_first_state = percentOne * 0.01;
    const random_second_state = percentTwo * 0.01;
    const total = ((7154084 * random_second_state) + (4123288 * random_first_state)) /11277372;
    //console.log(total, random_first_state, random_second_state);


    let line_start, line_end;

    if (random_first_state > random_second_state && random_first_state - random_second_state > 0.06) {
        line_start = xScale(random_first_state + .03);
        line_end = xScale(random_second_state + .09);
    }
    else if (random_second_state > random_first_state && random_second_state - random_first_state > 0.06) {
        line_start = xScale(random_second_state + .03);
        line_end = xScale(random_first_state + .09);
    }

    svg.append("circle").attr("cx", xScale(random_first_state + .06)).attr("cy", 200).attr("r", 20).attr("fill", "#002df5").attr("stroke", "black");
    svg.append("circle").attr("cx", xScale(random_second_state + .06)).attr("cy", 200).attr("r", 20).attr("fill", "#002df5").attr("stroke", "black");
    svg.append("circle").attr("cx", xScale(total + .06)).attr("cy", 200).attr("r", 5).attr("fill", "lightgray").attr("stroke", "black");
    svg.append("line").attr("x1", line_start).attr("y1", 200).attr("x2",line_end).attr("y2", 200).attr("stroke", "black");
    svg.append("text").attr("x", xScale(random_first_state + .06)).attr("y", 200).attr("text-anchor", "middle").attr("dominant-baseline", "central").text("OK").attr("fill", "#f5f5f5").attr("font-family", "Arial");
    svg.append("text").attr("x", xScale(random_second_state + .06)).attr("y", 200).attr("text-anchor", "middle").attr("dominant-baseline", "central").text("MA").attr("fill", "#f5f5f5").attr("font-family", "Arial");
    scriptcontainer.append(svg.node());
}