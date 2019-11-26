function confusion_matrix(elem) {

    var good_col = "#1b9e77",
        bad_col = "#d95f02";


    var stroke = "white",
        opp = 0.7;


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
        .attr("id","no1")
        .attr("x", 0)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",good_col);
    

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no2")
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",good_col);

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no2")
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("opacity", opp)
        .attr("fill", 'url(#diagonalHatch)');
    
    // ==== Negative Boxes ====  
    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no3")
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",bad_col);
    

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no4")
        .attr("x", box_w+separation)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",bad_col);

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no3")
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
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




    // ===== Button Logic =====

    svg.append('g').append("rect")
        .attr("class", "button")
        .attr("x", 0)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")        
        .on('click', function(d) {
            var cur_class = d3.select("#no"+"1").attr('class');
            d3.select("#no"+"1")
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        console.log("TP is 0");
                        return "boxes";
                    }
                    console.log("TP is 1");
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });
    

    svg.append('g').append("rect")
        .attr("class", "button")
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")
        .on('click', function(d) {
            var cur_class = d3.select("#no"+"2").attr('class');
            d3.select("#no"+"2")
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        console.log("FP is 0");
                        return "boxes";
                    }
                    console.log("FP is 1");
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });


    svg.append('g').append("rect")
        .attr("class", "button")
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")        
        .on('click', function(d) {
            var cur_class = d3.select("#no"+"3").attr('class');
            d3.select("#no"+"3")
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        console.log("FN is 0");
                        return "boxes";
                    }
                    console.log("FN is 1");
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });
    

    svg.append('g').append("rect")
        .attr("class", "button")
        .attr("x", box_w+separation)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")
        .on('click', function(d) {
            var cur_class = d3.select("#no"+"4").attr('class');
            d3.select("#no"+"4")
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        console.log("TN is 0");
                        return "boxes";
                    }
                    console.log("TN is 1");
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });
    
    
    
}



confusion_matrix("body");