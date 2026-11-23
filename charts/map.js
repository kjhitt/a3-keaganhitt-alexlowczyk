import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";

console.log(d3);
async function loadStateData(){
    const stateData = await d3.csv("State_IDs_with_votes_updated.csv", (d)=>{
        return {
            state: d["state"],
            name: d["name"],
        }
    })
    return stateData;
}
async function loadMap(){
    const map = await fetch(`https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json`).then(data => data.json());
    return map;
}   
export default async function drawMap(percentOne, percentTwo){
    const [stateData, mapData] = await Promise.all([loadStateData(), loadMap()]);
    buildMap(mapData, stateData, percentOne, percentTwo);
}
function buildMap(mapData, stateData, percentOne, percentTwo){
    const svg = d3.create("svg").attr("width", 1500).attr("height", 700).attr("viewBox", [0, 0, 1500, 700]).attr("class", "chart");
    const random_blue_one = Math.round((percentOne * .01) * 51);
    const random_blue_two = Math.round((percentTwo * 0.01) * 51);
    const votes_one = d3.shuffle(Array(random_blue_one).fill(1).concat(Array(50-random_blue_one).fill(0)));
    const votes_two = d3.shuffle(Array(random_blue_two).fill(1).concat(Array(50-random_blue_two).fill(0)));
    const colorMap = d3.scaleOrdinal().domain([1, 0]).range(["blue", "red"]);
    const actual_states = topojson.feature(mapData, mapData.objects.states).features.filter(d => d.id != "11");
    const coordinates = actual_states.map(
        d => {
            return {
                x: d3.geoPath().centroid(d)[0], y: d3.geoPath().centroid(d)[1], id: stateData.find(s => s.name === d.properties.name).state
            };
        }
    );
    svg.append("g").selectAll("path").data(actual_states).enter().append("path").attr("d", d3.geoPath()).attr("fill", d => { return colorMap(votes_one[stateData.findIndex(s => s.name === d.properties.name)]); }).attr("stroke", "black").attr("transform", "scale(.75)");
    svg.append("g").selectAll("text").data(coordinates).enter().append("text").text(d => d.id).attr("x", d => d.x).attr("y", d => d.y).attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "black").attr("transform", "scale(.75)").attr("font-weight", "bold");
    svg.append("g").selectAll("path").data(actual_states).enter().append("path").attr("d", d3.geoPath()).attr("fill", d => { return colorMap(votes_two[stateData.findIndex(s => s.name === d.properties.name)]); }).attr("stroke", "black").attr("transform", "scale(.75) translate(1000,50)");
    svg.append("g").selectAll("text").data(coordinates).enter().append("text").text(d => d.id).attr("x", d => d.x).attr("y", d => d.y).attr("text-anchor", "middle").attr("font-size", "10px").attr("fill", "black").attr("transform", "scale(.75) translate(1000,50)").attr("font-weight", "bold");
    container.append(svg.node());
}