var testData1 = [
{
    name: "Feature 1",
    sample: 1,
    anch: 1,
    dec: 1,
    scl_val: 0.5,    
    scl_change: 0.2
},
{
    name: "Feature 2",
    sample: 1,
    anch: 1,
    dec: 1,
    scl_val: 0.1,
    scl_change: 0.4
},
{
    name: "Feature 3",
    sample: 1,
    anch: 0,
    dec: 1,
    scl_val: 0.7,
    scl_change: 0.8
},
{
    name: "Feature 4",
    sample: 1,
    anch: 1,
    dec: 1,
    scl_val: 0.6,
    scl_change: 0.3
},
{
    name: "Feature 5",
    sample: 1,
    anch: 0,
    dec: 1,
    scl_val: 0.4,
    scl_change: 0.6
},
{
    name: "Feature 6",
    sample: 1,
    anch: 0,
    dec: 1,
    scl_val: 0,
    scl_change: 0.1
}];


var testData2 = [
{
    name: "Feature 1",
    sample: 2,
    anch: 1,
    dec: 1,
    scl_val: 0.4,    
    scl_change: 0.6
},
{
    name: "Feature 2",
    sample: 2,
    anch: 1,
    dec: 1,
    scl_val: 0.4,
    scl_change: 0.2
},
{
    name: "Feature 3",
    sample: 2,
    anch: 0,
    dec: 1,
    scl_val: 0.5,
    scl_change: 0.7
},
{
    name: "Feature 4",
    sample: 2,
    anch: 1,
    dec: 1,
    scl_val: 0.4,
    scl_change: 0.7
},
{
    name: "Feature 5",
    sample: 2,
    anch: 0,
    dec: 1,
    scl_val: 0.5,
    scl_change: 0.6
},
{
    name: "Feature 6",
    sample: 2,
    anch: 0,
    dec: 1,
    scl_val: 0.1,
    scl_change: 0
}];


var testData3 = [
{
    name: "Feature 1",
    sample: 3,
    anch: 1,
    dec: 0,
    scl_val: 0.3,    
    scl_change: 0.1
},
{
    name: "Feature 2",
    sample: 3,
    anch: 1,
    dec: 0,
    scl_val: 0.5,
    scl_change: 0.6
},
{
    name: "Feature 3",
    sample: 3,
    anch: 0,
    dec: 0,
    scl_val: 0.3,
    scl_change: 0.4
},
{
    name: "Feature 4",
    sample: 3,
    anch: 1,
    dec: 0,
    scl_val: 0.7,
    scl_change: 0.8
},
{
    name: "Feature 5",
    sample: 3,
    anch: 0,
    dec: 0,
    scl_val: 0.5,
    scl_change: 0.6
},
{
    name: "Feature 6",
    sample: 3,
    anch: 0,
    dec: 0,
    scl_val: 0.8,
    scl_change: 0.9
}];


var testData4 = [
{
    name: "Feature 1",
    sample: 4,
    anch: 1,
    dec: 0,
    scl_val: 0.2,    
    scl_change: 0.5
},
{
    name: "Feature 2",
    sample: 4,
    anch: 1,
    dec: 0,
    scl_val: 0.7,
    scl_change: 0.6
},
{
    name: "Feature 3",
    sample: 4,
    anch: 0,
    dec: 0,
    scl_val: 0.5,
    scl_change: 0.9
},
{
    name: "Feature 4",
    sample: 4,
    anch: 1,
    dec: 0,
    scl_val: 0.4,
    scl_change: 0.6
},
{
    name: "Feature 5",
    sample: 4,
    anch: 0,
    dec: 0,
    scl_val: 0.5,
    scl_change: 0.2
},
{
    name: "Feature 6",
    sample: 4,
    anch: 0,
    dec: 0,
    scl_val: 0.4,
    scl_change: 0.7
}];


var allData = [testData3,testData1,testData2,testData3,testData4]



function draw_aggregation_graph(allData,place){

	testData = allData[0]

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var the_colour = "";
    var opp_colour = "";
    
    var separator = 0.015;
    
    if (testData[0].dec == 0) {
        opp_colour = good_col;
        the_colour = bad_col;}
    else {
        opp_colour = bad_col
        the_colour = good_col;}
    
    // -- Establishing margins and canvas bounds -- 
    var margin = {
            top: 10, 
            right: 60, 
            bottom: 140, 
            left: 70
        },
        width = 350 - margin.right - margin.left,
        height = 350 - margin.top - margin.bottom;

    var padding_top = 0.2,
        padding_bottom = 0.1;

    var outlier = 1 + padding_top/2;
    
    // -- Adding scales based on canvas -- 
    var xScale = d3.scaleBand()
            .domain(testData.map(function(d){return d.name;}))
            .rangeRound([0, width])
            .paddingInner(separator),
        yScale = d3.scaleLinear()
            .domain([0-padding_bottom, 1+padding_top])
            .rangeRound([height, 0]);

    var svg = d3.select(place)
                .append("svg")
                .attr("width",width + margin.right + margin.left)
                .attr("height",height + margin.top + margin.bottom)
                .attr("class", "main-svg")
                .append("g")
                     .attr("transform","translate(" + margin.left + ',' + margin.top +')');

    // -- Drawing background rectangles -- 
    svg.selectAll("rect")
        .data(testData)
        .enter()
        .append("rect")
        .attr("class","bg_bar")
        .attr('x',function(d) {return xScale(d.name);})
        .attr('y',0)
        .attr("height",function(d){return yScale(0-padding_bottom)})
        .attr("width",xScale.bandwidth())
        .style("opacity",function(d){
            if(d.anch == 666){
                return 0.2;
            }
            else {return 1;}
        })
        .style("fill",function(d){
            if(d.anch == 666){
                return opp_colour;
            }
            else {return "white";}
        });
    
    
    // -- Drawing dividing lines -- 
    svg.selectAll("line")
        .data(testData)
        .enter()
        .append("line")
        .attr("class","split_lines")
        .attr("x1",function(d) {return xScale(d.name)+xScale.bandwidth();})
        .attr('y',0)
        .attr("y2",function(d){return yScale(0-padding_bottom)})
        .attr("x2",function(d) {return xScale(d.name)+xScale.bandwidth();})
        .style("stroke",function(d,i){
            if (i == testData.length-1) {return "None";}
            else {return "#A9A9A9";}})
        .style("stroke-width",0.7);
    
    // -- Drawing surrounding box -- 
        svg.append("rect")
        .attr("class","border")
        .attr('x',xScale(testData[0].name))
        .attr('y',0)
        .attr("height",function(d){return yScale(0-padding_bottom)})
        .attr("width",(xScale.bandwidth()+1)*testData.length)
        .attr("fill","None")
        .attr("stroke","#A9A9A9")
        .attr("stroke-width",1);

  

    // -- Drawing and styling the AXIS
    
    var xAxis = d3.axisBottom().scale(xScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("fill","black")
            .style("text-anchor", "end")
            .attr("dy", "0.5em")
            .attr("dx", "-0.5em")
            .attr("transform","rotate(-40)");

    // -- Drawing the initial level (blue) --
//     svg.append("g")
//         .selectAll("line")
//         .data(testData)
//         .enter()
//         .append("line")
//         .attr("class","line_lvl")
//         .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.20})
//         .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.80})
//         .attr("y1",function(d){
//             if (d.scl_val > 1){
//                 return yScale(outlier)-1}
//             else{
//                 return yScale(d.scl_val)
//             }})
//         .attr("y2",function(d){
//             if (d.scl_val > 1){
//                 return yScale(outlier)-1}
//             else{
//                 return yScale(d.scl_val)
//             }})
//         .attr("stroke", "black")
//         .attr("stroke-width", 2.2)
// //        .attr("stroke-linecap","round")
//         .attr("fill", "none");


    function draw_triangle(data) {
        var full_string = "";

        for(n=0 ; n < data.length; n++){
            var d = data[n];

            x1 = xScale(d.name) + xScale.bandwidth()*0.30
            x2 = xScale(d.name) + xScale.bandwidth()*0.70
            x3 = xScale(d.name) + xScale.bandwidth()*0.5
            y1 = yScale(d.scl_val)
            y2 = yScale(d.scl_change)


            one_tri = "M"+x1+","+y1+"L"+x2+","+y1+"L"+x3+","+y2
                +"L"+x1+","+y1;


            full_string += one_tri
        }
   		return full_string
   	}




   	svg.append('g').selectAll("path")
   	.data(allData)
    .enter()
    .append("path")
    .on('mouseover',function(){
        d3.select(this)
        .attr('stroke',function(d){
        if (d[0].dec == 0) {
            return bad_col;}
        else {
            return good_col;}})
    })
    .on('mouseout',function(){
        d3.select(this)
        .attr("stroke",'none')
    })
    .attr('d',function(d){return draw_triangle(d);})
    .attr("fill-opacity",0.5)
    .attr("fill",function(d){
    	if (d[0].dec == 0) {
	        return bad_col;}
   		else {
	        return good_col;}
    })
    .attr("stroke-width", 1.5);

	// svg.append("g").append('path')
	// 	.data(testData)
	// 	.attr('d', function(d) { 
	// 		var x = xScale(d.name) + xScale.bandwidth()*0.20, y = yScale(0);
	// 		return 'M ' + x +' '+ y + ' l ' + x+0 + ' ' + yScale(1) + ' l ' + x-100 + ' ' + yScale(0.5) + ' z';
	// 	})
	// 	.style('stroke', 'blue')
	// 	.style('fill','blue');

    // // -- The text for initial level (blue) --
    // svg.append("g")
    //     .selectAll('text')
    //     .data(testData)
    //     .enter()
    //     .append('text')
    //     .text(function(d){return d.val;})
    //     .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
    //     .attr("y", function(d){
    //         if (d.scl_val > 1){
    //             return yScale(outlier)-4;
    //         }

    //         if (d.scl_change >= d.scl_val){
    //             return yScale(d.scl_val)+12;
    //         }

    //         else {
    //             return yScale(d.scl_val)-3;
    //         }
    //     })
    //     .attr("font-family", 'sans-serif')
    //     .attr("font-size", '12px')
    //     .attr("font-weight", 'bold')
    //     .attr("fill",'black')
    //     .attr("text-anchor",'middle');


    function wrap(text, width) {
      text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
    }
}


draw_aggregation_graph(allData,'body')
