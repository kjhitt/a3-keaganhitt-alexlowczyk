import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function drawNeedles(left, right) {
    drawNeedle(left);
    drawNeedle(right);
}

function drawNeedle(percentage) {
    percentage = 100 - percentage; //percentage of democrat chance not republican
    const width = 400;
    const height = 300;
    // Percentage = X (0-100), converted to decimals, then subtract 50% since needle starts at 50%
    // so angles less than 50% will move needle to the left & >50% will move needle to the right
    // then multiply by radians! conversion rate = pi radians/100%
    const angle = ((percentage / 100) - 0.5) * Math.PI; //also negative because angles move left

    //using min to define points so that when it's rotated it doesn't go out of bounds
    //also unless width/20 is somehow larger than height, don't need to min for x
    var point0 = {x: width/2, y: Math.min(height/10, width/8)};
    var point1 = {x: width/2 + width/40, y: Math.min(height/10 + 2 * height/3, width/2)};
    var needleCenter = {x: width/2, y: Math.min(height/10 + 2 * height/3, width/2)};

    //did some cool linear algebra to figure out how to rotate the needle
    //first scaling these points to the needle center as the origin
    point0.x = (point0.x - needleCenter.x)
    point0.y = (needleCenter.y - point0.y) //subtract since y scale is negative
    point1.x = (point1.x - needleCenter.x)
    point1.y = (needleCenter.y - point1.y)

    //now rotation!
    var new0x = point0.x * Math.cos(angle) + point0.y * Math.sin(angle);
    var new0y = -point0.x * Math.sin(angle) + point0.y * Math.cos(angle);
    var new1x = point1.x * Math.cos(angle) + point1.y * Math.sin(angle);
    var new1y = -point1.x * Math.sin(angle) + point1.y * Math.cos(angle);
    point0.x = new0x
    point0.y = new0y
    point1.x = new1x
    point1.y = new1y
    var needleCenterAngle = Math.atan2(point1.y, point1.x) //angle to start drawing the circle at the center

    //scale back!
    point0.x = point0.x + needleCenter.x
    point0.y = needleCenter.y - point0.y
    point1.x = point1.x + needleCenter.x
    point1.y = needleCenter.y - point1.y

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "chart");

    const needle = d3.path();
    needle.moveTo(point0.x, point0.y);
    needle.lineTo(point1.x, point1.y);
    needle.arc(needleCenter.x, needleCenter.y, width/40, -needleCenterAngle, -needleCenterAngle + Math.PI, false);
    needle.lineTo(point0.x, point0.y);
    needle.closePath();

    //start drawing the gauge behind the needle through seven arcs
    svg.append("path")
        .attr("transform", `translate(${needleCenter.x},${needleCenter.y})`)
        .attr("fill", "#627df5")
        .attr("d", d3.arc()({
        innerRadius: width/10,
        outerRadius: Math.min(height/10 + 2 * height/3, width/2),
        startAngle: -Math.PI/2,
        endAngle: -Math.PI/2 * 0.8,
    }));
    svg.append("path")
        .attr("transform", `translate(${needleCenter.x},${needleCenter.y})`)
        .attr("fill", "#93a5f5")
        .attr("d", d3.arc()({
        innerRadius: width/10,
        outerRadius: Math.min(height/10 + 2 * height/3, width/2),
        startAngle: -Math.PI/2 * 0.8,
        endAngle: -Math.PI/2 * 0.48,
    }));
    svg.append("path")
        .attr("transform", `translate(${needleCenter.x},${needleCenter.y})`)
        .attr("fill", "#c4cdf5")
        .attr("d", d3.arc()({
        innerRadius: width/10,
        outerRadius: Math.min(height/10 + 2 * height/3, width/2),
        startAngle: -Math.PI/2 * 0.48,
        endAngle: -Math.PI/2 * 0.16,
    }));
    svg.append("path")
        .attr("transform", `translate(${needleCenter.x},${needleCenter.y})`)
        .attr("fill", "#f5f5f5")
        .attr("d", d3.arc()({
        innerRadius: width/10,
        outerRadius: Math.min(height/10 + 2 * height/3, width/2),
        startAngle: -Math.PI/2 * 0.16,
        endAngle: Math.PI/2 * 0.16,
    }));
    svg.append("path")
        .attr("transform", `translate(${needleCenter.x},${needleCenter.y})`)
        .attr("fill", "#f5c4c4")
        .attr("d", d3.arc()({
        innerRadius: width/10,
        outerRadius: Math.min(height/10 + 2 * height/3, width/2),
        startAngle: Math.PI/2 * 0.16,
        endAngle: Math.PI/2 * 0.48,
    }));
    svg.append("path")
        .attr("transform", `translate(${needleCenter.x},${needleCenter.y})`)
        .attr("fill", "#f59393")
        .attr("d", d3.arc()({
        innerRadius: width/10,
        outerRadius: Math.min(height/10 + 2 * height/3, width/2),
        startAngle: Math.PI/2 * 0.48,
        endAngle: Math.PI/2 * 0.8,
    }));
    svg.append("path")
        .attr("transform", `translate(${needleCenter.x},${needleCenter.y})`)
        .attr("fill", "#f56262")
        .attr("d", d3.arc()({
        innerRadius: width/10,
        outerRadius: Math.min(height/10 + 2 * height/3, width/2),
        startAngle: Math.PI/2 * 0.8,
        endAngle: Math.PI/2,
    }));
    
    //append the needle
    svg.append("path")
        .attr("d", needle.toString())
        .attr("stroke", "black")
        .attr("fill", "dark-gray");

    // Append the SVG element.
    scriptcontainer.append(svg.node());
}