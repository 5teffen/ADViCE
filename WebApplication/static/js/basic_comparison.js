


function draw_comparison(leftData,rightData,leftDen,rightDen,leftMed,rightMed,place, median_toggle, density_toggle, point_toggle) {
    // leftDen = [[0.2, 0.2833333333333333, 0.45, 0.3333333333333333, 0.31666666666666665, 0.55, 0.5833333333333334, 0.8333333333333334, 0.5, 1.0], [0.463768115942029, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.0, 0.34965034965034963, 0.6083916083916084, 0.16083916083916083, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.14285714285714285, 0.47619047619047616, 0.2222222222222222, 0.873015873015873, 1.0, 0.5555555555555556, 0.6666666666666666, 0.4126984126984127, 0.047619047619047616, 0.4126984126984127], [0.13725490196078433, 0.35294117647058826, 0.5686274509803921, 0.9607843137254902, 1.0, 0.9019607843137255, 0.7450980392156863, 0.47058823529411764, 0.43137254901960786, 0.37254901960784315], [1.0, 0.1744186046511628, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.9671052631578947, 1.0, 0.02631578947368421, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.42592592592592593, 0.2777777777777778, 0.46296296296296297, 0.4074074074074074, 0.8333333333333334, 0.8148148148148148, 1.0, 0.8148148148148148, 0.3888888888888889, 0.18518518518518517], [1.0, 0.4852941176470588, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.0, 0.46987951807228917, 0.20481927710843373, 0.15060240963855423, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.14788732394366197, 0.9859154929577465, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.0, 0.37142857142857144, 0.21714285714285714, 0.14285714285714285, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.12048192771084337, 1.0, 0.7048192771084337, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]]
    // rightDen = [[0.2, 0.2833333333333333, 0.45, 0.3333333333333333, 0.31666666666666665, 0.55, 0.5833333333333334, 0.8333333333333334, 0.5, 1.0], [0.463768115942029, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.0, 0.34965034965034963, 0.6083916083916084, 0.16083916083916083, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.14285714285714285, 0.47619047619047616, 0.2222222222222222, 0.873015873015873, 1.0, 0.5555555555555556, 0.6666666666666666, 0.4126984126984127, 0.047619047619047616, 0.4126984126984127], [0.13725490196078433, 0.35294117647058826, 0.5686274509803921, 0.9607843137254902, 1.0, 0.9019607843137255, 0.7450980392156863, 0.47058823529411764, 0.43137254901960786, 0.37254901960784315], [1.0, 0.1744186046511628, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.9671052631578947, 1.0, 0.02631578947368421, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.42592592592592593, 0.2777777777777778, 0.46296296296296297, 0.4074074074074074, 0.8333333333333334, 0.8148148148148148, 1.0, 0.8148148148148148, 0.3888888888888889, 0.18518518518518517], [1.0, 0.4852941176470588, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.0, 0.46987951807228917, 0.20481927710843373, 0.15060240963855423, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.14788732394366197, 0.9859154929577465, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [1.0, 0.37142857142857144, 0.21714285714285714, 0.14285714285714285, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], [0.12048192771084337, 1.0, 0.7048192771084337, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]]


    function determine_discrete(data,no_bins){
        no_ft = data[0].length
        no_samp = data.length
        mask = []

        for (col = 0; col < no_ft; col++){

            unique = [];
            for (i=0 ; i < no_samp; i++) {
                val = data[i][col].scl_val;
                if (unique.includes(val) == false){
                    unique.push(val);
                }
            }

            if (unique.length < no_bins) {mask.push(1);}
            else {mask.push(0);}
        }

        return mask;
    }

    function stagger_val(x,y,radius){
        // output = Math.sqrt(-2*log(Math.random()))*cos(2*Math.PI*Math.random())
        // radius = 2;
        angle = 2*Math.PI*Math.random();
        r = radius*Math.sqrt(Math.random());
        x_out = r * Math.cos(angle) + x;
        y_out = r * Math.sin(angle) + y;

        return [x_out, y_out]
    }   


    var discrete_mask = determine_discrete(leftData,10);

    var stagger_r = 5;

    var features = leftData[0].length,  // Assumes left/right match
        no_bins = rightDen[0].length,
        no_samp_r = rightData.length,   
        no_samp_l = leftData.length;   

    var add_density = true;


    point_opp_l = (1/no_samp_l)*30;
    point_opp_r = (1/no_samp_r)*30;


    testData = leftData[0]

    var points_col = "#67a9cf",
        point_size = 2,
        point_size_disc =1;


    var good_col = "#d95f02",
        bad_col = "#1b9e77";

    var the_colour = "";
    var opp_colour = "";
    
    var separator = 0.4,
        half_col = 32,   // Single section of comparison
        col_width = half_col*2;
    
    
    if (testData[0].dec == 0) {
        opp_colour = good_col;
        the_colour = bad_col;}
    else {
        opp_colour = bad_col
        the_colour = good_col;}
    

    // -- Establishing margins and canvas bounds -- 
    var margin = {
            top: 20, 
            right: 20, 
            bottom: 170, 
            left: 20
        },
        width = col_width*features - margin.right - margin.left,
        // width = 800 - margin.right - margin.left,
        height = 350 - margin.top - margin.bottom;

    var padding = 10;
    
    // -- Adding scales based on canvas -- 
    var xScale = d3.scaleBand()
            .domain(testData.map(function(d){return d.name;}))
            .rangeRound([0, width])
            .paddingInner(separator),
        
        yScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([height, 0]);


    var bandwidth = xScale.bandwidth();
    // var bandwidth = 49;

    // console.log("bandwidth: ", bandwidth);


    var triangle_w = (bandwidth/2)*0.6; // Single Triangle Width


    var svg = d3.select(place)
                .append("svg")
                .attr("width",width + margin.right + margin.left)
                .attr("height",height + margin.top + margin.bottom)
                .attr("class", "main-svg")
                .append("g")
                     .attr("transform","translate(" + margin.left + ',' + margin.top +')');


    // -- Density scales --
    var buffer = 2,
        denWidth = (bandwidth),
        den_colour = "#7570b3";

    var yDenScale = d3.scaleLinear()
            .domain([0, height])
            .rangeRound([height,0]);

        xDenScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0,bandwidth/2 - 5]);
    



    // -- Drawing background rectangles -- 
    svg.selectAll("rect")
        .data(testData)
        .enter()
        .append("rect")
        .attr("class","bg_bar")
        .attr('x',function(d) {return xScale(d.name);})
        .attr('y',-padding)
        .attr("height",function(d){return yScale(0)+2*padding})
        .attr("width",bandwidth)
        .attr("fill", "None")
        .attr("stroke", "None")
        .style("opacity",0.5);
    
    
    // -- Drawing dividing lines -- 
    svg.append("g").selectAll("line")
        .data(testData)
        .enter()
        .append("line")
        .attr("class","split_lines")
        .attr("x1",function(d) {return xScale(d.name)+bandwidth*0.5;})
        .attr('y1',-padding)
        .attr("y2",function(d){return yScale(0)+padding})
        .attr("x2",function(d) {return xScale(d.name)+bandwidth*0.5;})
        .style("stroke",den_colour)
        .style("stroke-width",1)
        .style("opacity",0);
    
    // -- Drawing surrounding box -- 
        
    // svg.append("rect")
    //     .attr("class","border")
    //     .attr('x',xScale(testData[0].name))
    //     .attr('y',0)
    //     .attr("height",function(d){return yScale(0-padding_bottom)})
    //     .attr("width",(xScale.bandwidth()+separator)*testData.length)
    //     .attr("fill","None")
    //     .attr("stroke","#A9A9A9")
    //     .attr("stroke-width",1);

  

    // -- Drawing and styling the AXIS
    
    var xAxis = d3.axisBottom().scale(xScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height+padding) + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("fill","black")
            .style("text-anchor", "end")
            .attr("dy", "-0.5em")
            .attr("dx", "-0.5em")
            .attr("transform","rotate(-70)")
            .attr("class", "feature-name");


    // var den_svg = svg.append("g")
    //             .attr("transform","translate(" + (9) + ',0)');


    // ======= Density Distribution ======= 
    histo_bin_h = height/no_bins;

    for (ind=0 ; ind < features; ind++) {
        ft_name = leftData[0][ind].name;

        centre_l = xScale(ft_name) + bandwidth/4;
        centre_r = xScale(ft_name) + bandwidth*3/4;

        for (n=0 ; n < no_bins; n++){
            var inLeftBin = xDenScale(leftDen[ind][n])/2;
            var inRightBin = xDenScale(rightDen[ind][n])/2;


            // Right density 1
            svg.append("g")
                .append("rect")
                .attr('x',centre_r)
                .attr('y',yDenScale(histo_bin_h*n+histo_bin_h))
                .attr("height",histo_bin_h)
                .attr("width",inRightBin)
                .attr("fill",den_colour)
                .attr('opacity',function(d){
                    if (density_toggle){
                        return 0.4;
                    }
                    else{return 0;}})
                .attr("stroke-width",1)
                .attr("stroke","white");

            svg.append("g")
                .append("rect")
                .attr('x',centre_r-inRightBin)
                .attr('y',yDenScale(histo_bin_h*n+histo_bin_h))
                .attr("height",histo_bin_h)
                .attr("width",inRightBin)
                .attr("fill",den_colour)
                .attr('opacity',function(d){
                    if (density_toggle){
                        return 0.4;
                    }
                    else{return 0;}})
                .attr("stroke-width",1)
                .attr("stroke","white");



            // Left bin
            svg.append("g")
                .append("rect")
                .attr('x',centre_l)
                .attr('y',yDenScale(histo_bin_h*n+histo_bin_h))
                .attr("height",histo_bin_h)
                .attr("width",inLeftBin)
                .attr("fill",den_colour)
                .attr('opacity',function(){
                    if (density_toggle){
                        return 0.2;
                    }
                    else{return 0;}})
                .attr("stroke-width",1)
                .attr("stroke","white");


            svg.append("g")
                .append("rect")
                .attr('x',centre_l-inLeftBin)
                .attr('y',yDenScale(histo_bin_h*n+histo_bin_h))
                .attr("height",histo_bin_h)
                .attr("width",inLeftBin)
                .attr("fill",den_colour)
                .attr('opacity',function(d){
                    if (density_toggle){
                        return 0.2;
                    }
                    else{return 0;}})
                .attr("stroke-width",1)
                .attr("stroke","white");

        }
        // --- Centre Lines --- 
        svg.append("g")
            .append("line")
            .attr('x1',centre_l)
            .attr('x2',centre_l)
            .attr('y1',yDenScale(0))
            .attr("y2",yDenScale(height))
            .attr("width",inRightBin)
            .attr('opacity',function(d){
                if (density_toggle){
                    return 0.2;
                }
                else{return 0;}})
            .attr("stroke-width",0.5)
            .attr("stroke",den_colour);

        svg.append("g")
            .append("line")
            .attr('x1',centre_r)
            .attr('x2',centre_r)
            .attr('y1',yDenScale(0))
            .attr("y2",yDenScale(height))
            .attr("width",inRightBin)
            .attr('opacity',function(){
                if (density_toggle){
                    return 0.2;
                }
                else{return 0;}})
            .attr("stroke-width",0.5)
            .attr("stroke",den_colour);




        // --- Median Lines --- 
        if (median_toggle) {
            var med_right = rightMed[ind],
            med_left = leftMed[ind];
        
            var tick_size = 10,
                tick_width = 2,
                tick_sep = 0;
           
            svg.append("g")
                .append("line")
                .attr("class","split_lines")
                .attr("x1",centre_r - tick_size/2)
                .attr('y1',function(d){return yScale(med_right);})
                .attr("y2",function(d){return yScale(med_right);})
                .attr("x2",centre_r + tick_size/2)
                .style("stroke",den_colour)
                .style("stroke-opacity",1)
                .style("stroke-width",tick_width);

            svg.append("g")
                .append("line")
                .attr("class","split_lines")
                .attr("x1",centre_l - tick_size/2)
                .attr('y1',function(d){return yScale(med_left);})
                .attr("y2",function(d){return yScale(med_left);})
                .attr("x2",centre_l + tick_size/2)
                .style("stroke",den_colour)
                .style("stroke-width",tick_width)
                .style("stroke-opacity",1);
        }

    }

    //     var den_svg = svg.append("g");




    //     // -- Allign SVG canvas -- 
    //     den_svg = den_svg.append("g")
    //             .attr("transform","translate(" + (xScale(right_name)) + ',0)'); 


    //     // -- Drawing left density distribution --
    //     den_svg.append('g').append('path').datum(left)
    //     .attr('d',left_line)
    //     .attr('stroke',den_colour)
    //     .attr('fill',den_colour)
    //     .attr('opacity',function(d){
    //         if (density_toggle){
    //             return 0.15;
    //         }
    //         else{
    //             return 0;
    //         }});


    //      // -- Centre the image -- 
    //     den_svg = den_svg.append("g")
    //             .attr("transform","translate(" + (xDenScale(1)) + ',0)'); 

    //     // ==== Drawing median lines ====

    //     if (median_toggle) {
    //         var med_right = rightMed[ind],
    //         med_left = leftMed[ind];
        
    //         var tick_size = xDenScaleRight(1),
    //             tick_width = 2,
    //             tick_sep = 4;
           
    //         den_svg.append("g")
    //             .append("line")
    //             .attr("class","split_lines")
    //             .attr("x1",tick_sep)
    //             .attr('y1',function(d){return yScale(med_right);})
    //             .attr("y2",function(d){return yScale(med_right);})
    //             .attr("x2",(tick_size-tick_sep))
    //             .style("stroke",den_colour)
    //             .style("stroke-opacity",1)
    //             .style("stroke-width",tick_width);

    //         den_svg.append("g")
    //             .append("line")
    //             .attr("class","split_lines")
    //             .attr("x1",-tick_sep)
    //             .attr('y1',function(d){return yScale(med_left);})
    //             .attr("y2",function(d){return yScale(med_left);})
    //             .attr("x2",-(tick_size-tick_sep))
    //             .style("stroke",den_colour)
    //             .style("stroke-width",tick_width)
    //             .style("stroke-opacity",1);
    //     }


    // // -- Drawing right density distribution --
    // den_svg.append('path').datum(right)
    //     .attr('d',right_line)
    //     .attr('stroke', den_colour)
    //     .attr('fill',den_colour)
    //     .attr('opacity',function(d){
    //         if (density_toggle){
    //             return 0.3;
    //         }
    //         else{
    //             return 0;
    //         }});
    // }



    function draw_triangle(data) {
        var full_string = "";

        for(n=0 ; n < data.length; n++){

            var d = data[n];

            // if ((d.scl_val != d.scl_change) || (!button3 && !density_toggle)){
            if (d.scl_val != d.scl_change) {
                x1 = xScale(d.name) + bandwidth*0.5 - triangle_w/2
                x2 = xScale(d.name) + bandwidth*0.5 + triangle_w/2
                x3 = xScale(d.name) + bandwidth*0.5
                y1 = yScale(d.scl_val)
                y2 = yScale(d.scl_change)


                one_tri = "M"+x1+","+y1+"L"+x2+","+y1+"L"+x3+","+y2
                    +"L"+x1+","+y1;

                full_string += one_tri;
            }

        }
        return full_string
    }




    // Deselect other triangles when clicking instead of border. 
    // Remove levels when hovering over 
    // Parallel coordinates test
    // Add data sheet in the bottom.
    // Highlight concurrently 

    // OSCAR: remember that linking now needs to account for which of the two is shown


    // -- Centre the image (LEFT) -- 
    svg = svg.append("g")
        .attr("transform","translate(" + (-xDenScaleRight(1)/2) + ',0)'); 

    svg.append('g').selectAll("path")
    .data(leftData)
    .enter()
    .append("path")
    .on('mouseover',function(){
        d3.selectAll(".arrows").attr("fill-opacity",0);
        // d3.select(".arrows").attr("fill","black");
        d3.select(this).attr("stroke-opacity",1).attr("fill-opacity",0.7)
    })
    .on('mouseout',function(){
        d3.selectAll(".arrows").attr("fill-opacity",0.7);
        d3.select(this).attr("stroke-opacity",0)
    })
    .on('click',function(d){
        // console.log(d[0].sample);
        var reloc = window.location.origin + "/individual?sample=" + d[0].sample;
        window.location.href = reloc;
    })
    // .attr("data-id", function(d) {return d.orig_ft_pos; })
    .attr('d',function(d){
        return draw_triangle(d);})
    .attr("class","arrows")
    .attr("fill-opacity",0.7)
    .attr("fill",function(d){
        if (d[0].dec == 0) {
            return bad_col;}
        else {
            return good_col;}
    })
    .attr("stroke-width", 2)
    .attr("stroke",function(d){
        if (d[0].dec == 0) {
            return bad_col;}
        else {
            return good_col;}
    })
    .attr("stroke-opacity",0);



    // === Drawing left points ====

    if (point_toggle) {
        for(n=0 ; n < leftData.length; n++){
            var oneData = leftData[n]

            for(i=0; i < oneData.length; i++){
                d = oneData[i];
                x = xScale(d.name) + bandwidth*0.5;
                y = yScale(d.scl_val);
                xy = stagger_val(x,y,stagger_r);

                svg.append("g")
                .append("circle")
                .attr("r", point_size)
                .attr("cx", function(){
                    if (discrete_mask[i]==1){return xy[0];}
                    else{return x;}})
                .attr("cy", function(){
                    if (discrete_mask[i]==1){return xy[1];}
                    else{return y;}})
                .style("fill", points_col)
                .style("opacity", point_opp_l);
            }
        }
    }



    // -- Centre the image (RIGHT) -- 
    svg = svg.append("g")
        .attr("transform","translate(" + (xDenScaleRight(1)) + ',0)'); 



    svg.append('g').selectAll("path")
    .data(rightData)
    .enter()
    .append("path")
    .on('mouseover',function(){
        d3.selectAll(".arrows").attr("fill-opacity",0);
        // d3.select(".arrows").attr("fill","black");
        d3.select(this).attr("stroke-opacity",1).attr("fill-opacity",0.7)
    })
    .on('mouseout',function(){
        d3.selectAll(".arrows").attr("fill-opacity",0.7);
        d3.select(this).attr("stroke-opacity",0)
    })
    .on('click',function(d){
        // console.log(d[0].sample);
        var reloc = window.location.origin + "/individual?sample=" + d[0].sample;
        window.location.href = reloc;
    })
    // .attr("data-id", function(d) {return d.orig_ft_pos; })
    .attr('d',function(d){
        return draw_triangle(d);})
    .attr("class","arrows")
    .attr("fill-opacity",0.7)
    .attr("fill",function(d){
        if (d[0].dec == 0) {
            return bad_col;}
        else {
            return good_col;}
    })
    .attr("stroke-width", 2)
    .attr("stroke",function(d){
        if (d[0].dec == 0) {
            return bad_col;}
        else {
            return good_col;}
    })
    .attr("stroke-opacity",0);


    // === Drawing right points ====
    if (point_toggle) {
        for(n=0 ; n < rightData.length; n++){
            var oneData = rightData[n]

            for(i=0; i < oneData.length; i++){
                d = oneData[i];
                x = xScale(d.name) + bandwidth*0.5;
                y = yScale(d.scl_val);
                xy = stagger_val(x,y,stagger_r);

                svg.append("g")
                .append("circle")
                .attr("r", point_size)
                .attr("cx", function(){
                    if (discrete_mask[i]==1){return xy[0];}
                    else{return x;}})
                .attr("cy", function(){
                    if (discrete_mask[i]==1){return xy[1];}
                    else{return y;}})
                .style("fill", points_col)
                .style("opacity", point_opp_r);
            }

        }
    }

}


// draw_aggregation_graph(leftData,leftDen,rightDen,leftMed, rightMed,'body')