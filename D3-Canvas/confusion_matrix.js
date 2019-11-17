function draw_summary(elem) {

    var good_col = "#1b9e77",
        bad_col = "#d95f02";


    var stroke = "white",
        opp = 0.8;


    var box_w = 45,
        box_h = 30,
        separation = 3,
        roundness = 3;


    var margin = {
            top: 10, 
            right: 10, 
            bottom: 10, 
            left: 10
        },
        width = 150 - margin.right - margin.left,
        height = 150 - margin.top - margin.bottom;


    var svg = d3.select(elem)
        .append("svg")
        .attr("width",width + margin.right + margin.left)
        .attr("height",height + margin.top + margin.bottom)
        .attr("class", "confusionMat")
        .append("g")
             .attr("transform","translate(" + margin.left + ',' + margin.top +')');


    yScale = d3.scaleLinear()
            .domain([height,0])
            .rangeRound([height, 0]);

    const centre = width/2
    
    svg.append('defs')
      .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('path')
        .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1.5);
    
    // ==== Positive Boxes ==== 
    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("x", 0)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", 30)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",good_col)        
        .on('click', function(d) {
            d3.select(this)
                .attr("class","selected")
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5);
        });
    

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", 30)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",good_col)
        .on('click', function(d) {
            d3.select(this)
                .attr("class","selected")
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5);
        });

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", 30)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("opacity", opp)
        .attr("fill", 'url(#diagonalHatch)')
        .on('click', function(d) {
            d3.select(this)
                .attr("class","selected")
                .attr("opacity", 1);
        });
    
    // ==== Negative Boxes ====  
    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", 30)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",bad_col);
    

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("x", box_w+separation)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", 30)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",bad_col);

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", 30)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("opacity", opp)
        .attr("fill", 'url(#diagonalHatch)');



    svg.append('g').append("text")
        .text("TP")
        .attr("x",box_w/2)
        .attr("y",yScale(box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 800)
        .attr("fill","white");
    
        
    svg.append('g').append("text")
        .text("FP")
        .attr("x",box_w + separation + box_w/2)
        .attr("y",yScale(box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 800)
        .attr("fill","white");

    
    
    svg.append('g').append("text")
        .text("FN")
        .attr("x",box_w/2)
        .attr("y",yScale(box_h+separation+box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 800)
        .attr("fill","white");
    
        
    svg.append('g').append("text")
        .text("TN")
        .attr("x",box_w + separation + box_w/2)
        .attr("y",yScale(box_h+separation+box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 800)
        .attr("fill","white");
    
    
    
}



draw_summary("body")