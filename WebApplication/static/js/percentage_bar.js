
function draw_percent_bar(result) {
    
    var bar_width = 250,
        bar_height = 20;
    
    var x_buffer = 40,
        y_buffer = 15;

    var bg_h = 30,
        bg_w = 30;

    
    var xScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, bar_width]);

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var svg = d3.select("#model-display").append("svg")
                .attr("width",400)
                .attr("height",60)
                .append("g")
                     .attr("transform","translate(" + x_buffer + ',' + y_buffer +')');


    // svg.append("rect")
    //     .attr("height",bar_height + bg_h)
    //     .attr("width",bar_width + bg_w)
    //     .attr("rx",4)
    //     .attr("ry",4)
    //     .style("stroke","Black")
    //     .style("stroke-width",1.3)
    //     .style("fill","None");
                    


    // svg = svg.append("g")
    //                  .attr("transform","translate(" + bg_w/2 + ',' + bg_h/2 +')');
    
    var defs = svg.append("defs");

    // Setting the colour gradient
    var linearGradient = defs.append("linearGradient")
       .attr("id", "lin_gradient")
       .attr("x1", "15%")
       .attr("x2", "85%")
       .attr("y1", "0%")
       .attr("y2", "0%");
    
    var colorScale = d3.scaleLinear()
        .range([bad_col, "white", good_col]);

    linearGradient.selectAll("stop")
        .data(colorScale.range() )
        .enter().append("stop")
        .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
        .attr("stop-color", function(d) { return d; });

    // Drawing the rectangle with curved edges
    svg.append("rect")
        .attr("class","bg_bar")
        .attr("height",bar_height)
        .attr("width",bar_width)
        .attr("rx",4)
        .attr("ry",4)
        .style("stroke","#A9A9A9")
        .style("stroke-width",1.3)
        .style("fill","url(#lin_gradient)");
    
    // Drawing middle marker 
    
    // svg.append('g').append("line")
    //     .attr("class","mid_marker")
    //     .attr("x1",bar_width/2)
    //     .attr("y1",-3)
    //     .attr("x2",bar_width/2)
    //     .attr("y2",bar_height+3)
    //     .style("stroke","black")
    //     .style("stroke-linecap","round")
    //     .style("stroke-width",2);
    
    // Drawing the percentage marker
    
    svg.append('g').append("line")
        .attr("class","per_marker")
        .attr("x1",function(){return xScale(result);})
        .attr("y1",bar_height+1.3)
        .attr("x2",function(){return xScale(result);})
        .attr("y2",bar_height+5)
        .attr("stroke", function(d) {
            if (result > 0.5) {return good_col;}
            else {return bad_col}})
        .style("stroke-linecap","round")
        .style("stroke-width",2);
    
    
    svg.append('g').append("text")
        .attr("class","per_marker")
        .text(function(){return Math.round(result*100).toString() + "%"})
        .attr("x",function(){return xScale(result)+5;})
        .attr("y",bar_height+20)
        .attr("font-family", 'sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 'bold')
        .attr("fill", function(d) {
            if (result > 0.5) {return good_col;}
            else {return bad_col}})
        .attr("text-anchor",'middle');
}
