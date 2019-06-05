function play_violin(allData,place){

    var separator = 0.015,
        div = 1;

    var buffer = 25;

    var margin = {
        top: 20, 
        right: 20, 
        bottom: 5, 
        left: 15.5
    },

        width = 31, 
        height = 230,
        full_width = 800 - margin.right - margin.left, 
        full_height = 250 - margin.top - margin.bottom;


    var yScale = d3.scaleBand()
            .domain((allData[0]).map(function(d){return d.bin;}))
            .rangeRound([0, height])
            .paddingInner(separator),

        xScaleLeft = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([width/2,0]);
        
        xScaleRight = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, width/2]);

    var svg = d3.select(place)
                .append("svg")
                .attr("width",full_width + margin.right + margin.left)
                .attr("height",full_height + margin.top + margin.bottom)
                .attr("class", "main-svg")
                .append("g")
                    .attr("transform","translate(" + (margin.left) + ',' + margin.top +')');


    var xShift = 0,
        yShift = 0;

    // --  --

    for (ind=0 ; ind < allData.length; ind++) {
        data = allData[ind]


        // -- Drawing left side -- 
        svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","den_bars")
        .attr('y',function(d) {return yScale(d.bin);})
        .attr('x',function(d) {return xScaleLeft(d.left);})
        .attr("height",yScale.bandwidth())
        .attr("width",function(d) {return xScaleLeft(0)-xScaleLeft(d.left);})
        .style("opacity",0.5)
        .style("fill","#7570b3");

        // // -- Drawing left side line -- 
        // svg.append("line")
        //     .attr("class","middle_line")
        //     .attr("x1",0)
        //     .attr('y1',-buffer/4)
        //     .attr("y2",height+buffer/4)
        //     .attr("x2",0)
        //     .style("stroke","black")
        //     .style("opacity",0.2)
        //     .style("stroke-width",2);  


         // -- Centre the image -- 
        svg = svg.append("g")
                .attr("transform","translate(" + (xScaleRight(1)) + ',0)'); 

        // -- Drawing right side -- 
        svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","den_bars")
        .attr('y',function(d) {return yScale(d.bin);})
        .attr('x',0)
        .attr("height",yScale.bandwidth())
        .attr("width",function(d) {return xScaleRight(d.right);})
        .style("opacity",1)
        .style("fill","#7570b3");

        // // -- Drawing ride side line -- 
        // svg.append("line")
        //     .attr("class","middle_line")
        //     .attr("x1",xScaleRight(1))
        //     .attr('y1',-buffer/4)
        //     .attr("y2",height+buffer/4)
        //     .attr("x2",xScaleRight(1))
        //     .style("stroke","black")
        //     .style("opacity",0.2)
        //     .style("stroke-width",2);  




        // // -- Drawing dividing middle line -- 
        // svg.append("line")
        //     .attr("class","middle_line")
        //     .attr("x1",0)
        //     .attr('y1',-buffer/4)
        //     .attr("y2",height+buffer/4)
        //     .attr("x2",0)
        //     .style("stroke","black")
        //     .style("opacity",0.2)
        //     .style("stroke-width",2);  




        function draw_density_boxed(testData,data) {
            // console.log("Getting Called");
            var overlap = yScale(0.1)-yScale(0.2);

            for (ind=0 ; ind < data.length; ind++) {
                var cur_obj = data[ind];
                var array_len = Object.keys(cur_obj).length;

                for (n=0 ; n < array_len; ++n){
                    var key = Object.keys(cur_obj)[n];
                    var value = cur_obj[key];
                    
                    svg.append("g")
                    .append("rect")
                    .attr('x',function() {return xScale(testData[ind].name)})
                    .attr('y',function() {
                            return yScale(+key)-overlap;})
                    .attr("height",2*overlap)
                    .attr("width",xScale.bandwidth())
                    .style("stroke","black")
                    .style("stroke-width",0.15)
                    .style("opacity",function(){return value/9800})
                    .style("fill","#7570b3");
                }
                    
            }
        }

        // -- Centre the image -- 
        svg = svg.append("g")
                .attr("transform","translate(" + (xScaleRight(1)+div) + ',0)');

        xShift += 2*xScaleRight(1)
        // console.log(xShift)
        if (xShift+width > full_width){
            yShift += height+buffer;
            // console.log("IM HEREE")
            svg = svg.append("g")
                .attr("transform","translate("+ (-xShift)+ "," + yShift +')');
            xShift = 0
        }






    }


}

// play_violin(allData, 'body')