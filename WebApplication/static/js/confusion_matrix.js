// Order: [TP, FP, FN, TN]

// var test_input = [1,1,0,0];

function confusion_matrix(elem, state, data, idx) {

    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var opp1 = 0.5,
        opp2 = 0.5,
        opp3 = 0.5,
        opp4 = 0.5;
    
    if (state[0] == 1) {opp1 = 1;}

    if (state[1] == 1) {opp2 = 1;}

    if (state[2] == 1) {opp3 = 1;}

    if (state[3] == 1) {opp4 = 1;}



    var stroke = "black",
        opp = 1;


    var box_w = 45,
        box_h = 30,
        separation = 3,
        roundness = 3;


    var margin = {
            top: 0, 
            right: 0, 
            bottom: 0, 
            left: 0
        },
        width = 150 - margin.right - margin.left,
        height = 70 - margin.top - margin.bottom;


    var svg = d3.select(elem)
        .append("svg")
        .attr("width",width)// + margin.right + margin.left)
        .attr("height",height + margin.top + margin.bottom)
        .attr("class", "confusionMat")
        .attr("id", "confusionMat-"+idx.toString())
        .append("g")
             .attr("transform","translate(" + margin.left + ',' + margin.top +')')
             .attr("id", "confMatG");


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
        .attr("class", function(d){
            if (opp1 == 1){return "selected";}
            else {return "boxes";}})
        .attr("id","no1-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", 0)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp1)
        .style("fill",good_col);
    

    svg.append('g').append("rect")
        .attr("class", function(d){
            if (opp2 == 1){return "selected";}
            else {return "boxes";}})
        .attr("id","no2-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp2)
        .style("fill",good_col);

    svg.append('g').append("rect")
        .attr("class", function(d){
            if (opp2 == 1){return "selected";}
            else {return "boxes";}})
        .attr("id","no2-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("opacity", opp2)
        .attr("fill", 'url(#diagonalHatch)');
    
    // ==== Negative Boxes ====  
    svg.append('g').append("rect")
        .attr("class", function(d){
            if (opp3 == 1){return "selected";}
            else {return "boxes";}})
        .attr("id","no3-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp3)
        .style("fill",bad_col);
    
    svg.append('g').append("rect")
        .attr("class", function(d){
            if (opp4 == 1){return "selected";}
            else {return "boxes";}})
        .attr("id","no3-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("opacity", opp4)
        .attr("fill", 'url(#diagonalHatch)');

    svg.append('g').append("rect")
        .attr("class", function(d){
            if (opp4 == 1){return "selected";}
            else {return "boxes";}})
        .attr("id","no4-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", box_w+separation)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp4)
        .style("fill",bad_col);

    



    svg.append('g').append("text")
        .attr("id", "TP-text-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        // .text(data.tp)
        .text("TP")
        .attr("x",box_w/2)
        .attr("y",yScale(box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 800)
        .attr("fill","white");
    
        
    svg.append('g').append("text")
        .attr("id", "FP-text-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        // .text(data.fp)
        .text("FP")
        .attr("x",box_w + separation + box_w/2)
        .attr("y",yScale(box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 800)
        .attr("fill","white");

    
    
    svg.append('g').append("text")
        .attr("id", "FN-text-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        // .text(data.fn)
        .text("FN")
        .attr("x",box_w/2)
        .attr("y",yScale(box_h+separation+box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '16px')
        .attr("font-weight", 800)
        .attr("fill","white");
    
        
    svg.append('g').append("text")
        .attr("id", "TN-text-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        // .text(data.tn)
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
        .attr("id", "TP-button-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", 0)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")        
        .on('click', function(d) {
            // if (confusion_restart() == true){
            //     //console.log("restart");
            //     d3.select("#no"+"1").attr("class", "boxes");
            //     matrixTrigger(true, "TP");
            //     return;
            // }
            var cur_class = d3.select("#no1-"+idx.toString()).attr('class');
            d3.select("#no1-"+idx.toString())
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        //console.log("TP is 0");
                        matrixTrigger(false, "TP", this);
                        return "boxes";
                    }
                    //console.log("TP is 1");
                    matrixTrigger(true, "TP", this);
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });
    

    svg.append('g').append("rect")
        .attr("class", "button")
        .attr("id", "FP-button-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")
        .on('click', function(d) {
            // if (confusion_restart() == true){
            //     //console.log("restart");
            //     d3.select("#no"+"2").attr("class", "boxes");
            //     matrixTrigger(true, "FP");
            //     return;
            // }
            var cur_class = d3.select("#no2-"+idx.toString()).attr('class');
            d3.select("#no2-"+idx.toString())
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        //console.log("FP is 0");
                        matrixTrigger(false, "FP", this);
                        return "boxes";
                    }
                    //console.log("FP is 1");
                    matrixTrigger(true, "FP", this);
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });


    svg.append('g').append("rect")
        .attr("class", "button")
        .attr("id", "FN-button-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")        
        .on('click', function(d) {
            // if (confusion_restart() == true){
            //     //console.log("restart");
            //     d3.select("#no"+"3").attr("class", "boxes");
            //     matrixTrigger(true, "FN");
            //     return;
            // }
            //console.log("no restart");
            var cur_class = d3.select("#no3-"+idx.toString()).attr('class');
            d3.select("#no3-"+idx.toString())
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        //console.log("FN is 0");
                        matrixTrigger(false, "FN", this);
                        return "boxes";
                    }
                    //console.log("FN is 1");
                    matrixTrigger(true, "FN", this);
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });
    

    svg.append('g').append("rect")
        .attr("class", "button")
        .attr("id", "TN-button-"+idx.toString())
        .attr("data-filteridx", idx.toString())
        .attr("x", box_w+separation)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("opacity", 0)
        .style("fill","black")
        .on('click', function(d) {
            // if (confusion_restart() == true){
            //     //console.log("restart");
            //     d3.select("#no"+"4").attr("class", "boxes");
            //     matrixTrigger(true, "TN");
            //     return;
            // }
            var cur_class = d3.select("#no4-"+idx.toString()).attr('class');
            d3.select("#no4-"+idx.toString())
                .attr("class",function(d){
                    if (cur_class == "selected"){
                        //console.log("TN is 0");
                        matrixTrigger(false, "TN", this);
                        return "boxes";
                    }
                    //console.log("TN is 1");
                    matrixTrigger(true, "TN", this);
                    return "selected";})
                .attr("opacity", 1)
                .attr("stroke","black");

            d3.selectAll("rect.boxes")
                .attr("opacity", 0.5)
                .attr("stroke","none");
        });
    
    document.getElementById("confusionMat-"+idx.toString()).setAttribute("width", document.getElementById('confMatG').getBoundingClientRect().width.toString() + 'px');
    console.log( "CONF MATT", document.getElementById('confMatG').getBoundingClientRect().width );
    console.log( "CONF MATT",  document.getElementById("confusionMat-"+idx.toString()).width );
}



// confusion_matrix(test_input,"body");