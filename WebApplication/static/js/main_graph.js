function draw_graph(testData, densityData, result, place, max_width=800){

    var features = testData.length;

    var good_col = "#1b9e77", //'#38e8eb', //"#1b9e77",
        bad_col = "#d95f02", //'#0698d1', //"#d95f02",
        den_colour = "#7570b3"; //'#86ab7b'; //"#7570b3";

    var the_colour = "";
    var opp_colour = "";
    
    var separator = 0.015,
        col_width = 42;
    
    if (result) {
        opp_colour = good_col;
        the_colour = bad_col;}
    else {
        opp_colour = bad_col;
        the_colour = good_col;}
    
    // -- Establishing margins and canvas bounds -- 
    var margin = {
            top: 0, 
            right: 10, 
            bottom: 140, 
            left: 30
        },
        width = Math.min(features*col_width - margin.right - margin.left, max_width),
        height = 360 - margin.top - margin.bottom;

    var padding_top = 0.2,
        padding_bottom = 0.1;

    var outlier = 1 + padding_top/2;

    
    // -- Density parameters --
    if (densityData != "no"){
        var fineness = densityData[0].data.length,
            line_width = features*col_width/fineness
            color_modifier = 0.7;
    }
        
    // -- Adding scales based on canvas -- 
    var xScale = d3.scaleBand()
            .domain(testData.map(function(d){return d.name;}))
            .rangeRound([0, width])
            .paddingInner(separator),
        
        yScale = d3.scaleLinear()
            .domain([0-padding_bottom, 1+padding_top])
            .rangeRound([height, 0]),

        yScaleDen = d3.scaleLinear()
            .domain([0-padding_bottom, fineness+padding_top])
            .rangeRound([height, 0]);

    var svg = d3.select(place)
                .append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "main-svg")
                .attr("viewBox", "0 0 " + (width + margin.right + margin.left).toString() + " " + (height + margin.top + margin.bottom).toString())
                .append("g")
                    .attr("transform","translate(" + margin.left + ',' + margin.top +')' );


    // -- Drawing density --

    if (densityData != "no"){

        svg.append("defs")

        for (ind=0 ; ind < features; ind++) {
            
            var featureData = densityData[ind].data,
                featureName = densityData[ind].name;
            var tot_len = featureData.length;

            svg.selectAll("defs")
                .append("linearGradient")
                .attr("id", "grad-" + ind.toString())
                .attr("x1", "0%")
                .attr("y1", "100%")
                .attr("x2", "0%")
                .attr("y2", "0%")
                .selectAll("stop")
                .data(featureData)
                .enter()
                .append("stop")
                .attr("offset", function(d,i){
                        return (Math.round((i/(tot_len)*100)).toString() + "%"); })
                .attr("style", function(d){
                        return ("stop-color: "+ den_colour + "; " + "stop-opacity: " + d*(color_modifier).toString());})
                    



            // svg.append("g").selectAll("line")
            //     .data(featureData)
            //     .enter()
            //     .append("line")
            //     .attr('x1',xScale(featureName))
            //     .attr('x2',xScale(featureName)+xScale.bandwidth())
            //     .attr('y1',function(d,i){
            //         return yScaleDen(i);})
            //     .attr('y2',function(d,i){
            //         return yScaleDen(i);})
            //     .attr("stroke-width",1) //line_width)
            //     .attr("stroke", "black")
            //     .style("opacity",function(d){return 0.4;});

        }   
    };


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
        .style("opacity",1)
        .style("fill",function(d,i){
            return "url(#grad-" + i.toString() + ")"
        });
    
    // -- Drawing feature locks
    svg.selectAll("g")
        .data(testData)
        .enter()
        .append("g")
        .attr("class", "lock-wrap")
        .attr("onclick", function(d) {return 'flip_lock(' + d.orig_ft_pos.toString() + ')'; })
        .append("text")
        .attr("id", function(d) {return 'ft-lock-' + d.orig_ft_pos.toString(); })
        .attr("data-orig-ft-pos", function(d) {return d.orig_ft_pos; })
        .attr("data-locked",  function(d) {return d.locked; })
        .attr('class', 'fas')
        .attr('x',function(d) {return xScale(d.name) + width/(2*features);})
        .attr('y',18)
        .attr("font-family","FontAwesome")
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .text(function(d) { return (d.locked==1 ? '\uf023' : '\uf13e') })


            

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
    var overall_size = xScale(testData[features-1].name) + xScale.bandwidth() - xScale(testData[0].name)
    
    svg.append("rect")
        .attr("class","border")
        .attr('x',xScale(testData[0].name))
        .attr('y',0)
        .attr("height",function(d){return yScale(0-padding_bottom)})
        .attr("width",overall_size)
        .attr("fill","None")
        .attr("stroke","#A9A9A9")
        .attr("stroke-width",1);



    
    
    
    function draw_polygons(data) {
        var full_string = "";
        var mod = 2 // To fix the sizes for some cases
        
        var bar_len = 0.085
        var separation = 0.015

        for(n=0 ; n < data.length; n++){
            var d = data[n];
            if (d.scl_val > 1) {new_val = 1;}
            else {new_val = d.scl_val;}

            if (d.scl_val > d.scl_change){

                var start_x = (xScale(d.name) + xScale.bandwidth()*0.35).toString();
                var mid_x = (xScale(d.name) + xScale.bandwidth()*0.5).toString();
                var end_x = (xScale(d.name) + xScale.bandwidth()*0.65).toString();

                var start_y = (yScale(new_val)).toString();
                var bottom_mid = (yScale(new_val)+5).toString();
                var end_mid = (yScale(new_val-bar_len)+5).toString();
                var end_y = (yScale(new_val-bar_len)).toString();

                full_string += "M"+start_x+","+start_y+"L"+end_x+","+start_y+"L"+end_x+","+end_y
                +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y;
                var shift = bar_len+separation;

                for(i=1 ; i < d.incr; i++){
                            start_y = (yScale(new_val-shift)).toString(); 
                            bottom_mid = (yScale(new_val-shift)+5).toString();
                            end_mid = (yScale(new_val-bar_len-shift)+5).toString();
                            end_y = (yScale(new_val-bar_len-shift)).toString();

                        var next_pol = "M"+start_x+","+start_y+"L"+mid_x+","+bottom_mid+"L"+end_x+","+start_y+"L"+end_x+","+end_y
                            +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y; 


                        full_string += next_pol;
                        shift += bar_len+separation;
                    }
                }

            else if (d.scl_val < d.scl_change){

                var start_x = (xScale(d.name) + xScale.bandwidth()*0.35).toString();
                var mid_x = (xScale(d.name) + xScale.bandwidth()*0.5).toString();
                var end_x = (xScale(d.name) + xScale.bandwidth()*0.65).toString();

                var start_y = (yScale(new_val)).toString();
                var bottom_mid = (yScale(new_val)-5).toString();
                var end_mid = (yScale(new_val+bar_len)-5).toString();
                var end_y = (yScale(new_val+bar_len)).toString();
        

                full_string += "M"+start_x+","+start_y+"L"+end_x+","+start_y+"L"+end_x+","+end_y
                +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y;

                var shift = bar_len+separation;

                for(i=1 ; i < d.incr; i++){
                            start_y = (yScale(new_val+shift)).toString();
                            bottom_mid = (yScale(new_val+shift)-5).toString();
                            end_mid = (yScale(new_val+bar_len+shift)-5).toString();
                            end_y = (yScale(new_val+bar_len+shift)).toString();

                        var next_pol = "M"+start_x+","+start_y+"L"+mid_x+","+bottom_mid+"L"+end_x+","+start_y+"L"+end_x+","+end_y
                            +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y; 


                        full_string += next_pol;
                        shift += bar_len+separation;

                    }
                }
            }




            return full_string;
    }

    svg.append("path")
        .attr('d',draw_polygons(testData))
        .attr("fill",the_colour)
        .attr("stroke",the_colour)
        .attr("stroke-linecap","round")
        .attr("stroke-width",0);


    svg.append("g")
        .selectAll('text')
        .data(testData)
        .enter()
        .append('text')
        .text(function(d){return d.change;})
        .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
        .attr("y", function(d){
            if (d.scl_change > d.scl_val){
                return yScale(d.scl_val+d.incr*0.10)-5;
            }
            else {
                if (d.scl_val > 1){return yScale(1-d.incr*0.10)+12;}
                else {return yScale(d.scl_val-d.incr*0.10)+12;}
            }
        })
        .attr("font-family", 'sans-serif')
        .attr("font-size", '12px')
        .attr("font-weight", 'bold')
        .attr("fill", function(d) {
            if ((d.change != d.val)) {return "black";}
            else {return "None"}})
        .attr("text-anchor",'middle');



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
    svg.append("g")
        .selectAll("line")
        .data(testData)
        .enter()
        .append("line")
        .attr("class","line_lvl")
        .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.20})
        .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.80})
        .attr("y1",function(d){
            if (d.scl_val > 1){
                return yScale(outlier)-1}
            else{
                return yScale(d.scl_val)
            }})
        .attr("y2",function(d){
            if (d.scl_val > 1){
                return yScale(outlier)-1}
            else{
                return yScale(d.scl_val)
            }})
        .attr("stroke", "black")
        .attr("stroke-width", 2.2)
//        .attr("stroke-linecap","round")
        .attr("fill", "none");



    // -- The text for initial level (blue) --
    svg.append("g")
        .selectAll('text')
        .data(testData)
        .enter()
        .append('text')
        .text(function(d){return d.val;})
        .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
        .attr("y", function(d){
            if (d.scl_val > 1){
                return yScale(outlier)-4;
            }

            if (d.scl_change >= d.scl_val){
                return yScale(d.scl_val)+12;
            }

            else {
                return yScale(d.scl_val)-3;
            }
        })
        .attr("font-family", 'sans-serif')
        .attr("font-size", '12px')
        .attr("font-weight", 'bold')
        .attr("fill",'black')
        .attr("text-anchor",'middle');


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