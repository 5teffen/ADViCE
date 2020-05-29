


// function draw_comparison(leftData,rightData,leftDen,rightDen,leftMed,rightMed,place, median_toggle, density_toggle, point_toggle, cf_toggle) {

    // -- Initial conversion -- 
    // set1 = {data: leftData, den: leftDen, median: leftMed};
    // set2 = {data: rightData, den: rightDen, median: rightMed};
    // set3 = {data: leftData, den: leftDen, median: leftMed};

    // complete_data = [set1];
    // complete_data = [set1,set2];
    // complete_data = [set1,set2,set1];
    // complete_data = [set1,set2,set1,set2,set1];


function draw_comparison(complete_data, place, median_toggle, density_toggle, point_toggle, cf_toggle) {

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

    function stagger_val2(x,y,radius){
        // output = Math.sqrt(-2*log(Math.random()))*cos(2*Math.PI*Math.random())
        // radius = 2;
        angle = 2*Math.PI*Math.random();
        r = radius*Math.sqrt(Math.random());
        x_out = r * Math.cos(angle) + x;
        y_out = r * Math.sin(angle) + y;

        return [x_out, y_out]
    }   

    function stagger_val(x,y,radius){

            dx = radius*Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
            dy = radius*Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
            angle = 2*Math.PI*Math.random();
            x_out = x + dx;
            y_out = y + dy;

            return [x_out, y_out]
    }

    function draw_triangle(data) {
        var full_string = "";

        for(n=0 ; n < data.length; n++){

            var d = data[n];

            // if ((d.scl_val != d.scl_change) || (!button3 && !density_toggle)){
            if (d.scl_val != d.scl_change) {
                x1 = xScale(d.name) - triangle_w/2
                x2 = xScale(d.name) + triangle_w/2
                x3 = xScale(d.name) 
                y1 = yScale(d.scl_val)
                y2 = yScale(d.scl_change)


                one_tri = "M"+x1+","+y1+"L"+x2+","+y1+"L"+x3+","+y2
                    +"L"+x1+","+y1;

                full_string += one_tri;
            }

        }
        return full_string
    }


    // --- Mask the discrete features --- 
    var discrete_mask = determine_discrete(complete_data[0].data,10);


    // --- Identify the number of sets to visualize --- 
    var no_sets = complete_data.length;

    // --- Metadata about the sets --- 
    var no_features = complete_data[0].data[0].length, // Assumes they all match
        no_bins = complete_data[0].den[0].length,  // Assumes they all match
        no_samples_lst = [],
        pt_opp_lst = [];


    for (i=0; i<no_sets;i++){
        no_samp = complete_data[0].data.length;
        no_samples_lst.push(no_samp);
        pt_opp_lst.push((1/no_samp)*50);
    }


    // --- Point related variables --- 
    var points_col = "#67a9cf",
        point_size = 2,
        stagger_r = 3;


    // --- Color related variables ---
    var good_col = "#d95f02",
        bad_col = "#1b9e77";
       
    var single_data_point = complete_data[0].data[0];

    if (single_data_point[0].dec == 0) {
        opp_colour = good_col;
        the_colour = bad_col;}
    else {
        opp_colour = bad_col
        the_colour = good_col;}


    // --- Establshing Dimensions ---
    var max_width = 830
        one_width = (830/no_features)/no_sets;
    
    if (one_width > 50){one_width = 50;} // Ensures width is not too big

    var col_width = one_width*no_sets,
        half_col = one_width, // TO REMOVE
        separator = 0.3,
        padding = 10;


    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 20, 
            right: 20, 
            bottom: 170, 
            left: 20
        },
        width = col_width*no_features - margin.right - margin.left,
        height = 420 - margin.top - margin.bottom;



    // --- Creating Scales based on canvas --- 
    var xScale = d3.scaleBand()
            .domain(single_data_point.map(function(d){return d.name;}))
            .rangeRound([0, width])
            .paddingInner(separator),
        
        yScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([height, 0]);

    var bandwidth = xScale.bandwidth(),
        triangle_w = (bandwidth/2)*0.6;  // Single CF Triangle Width



    // --- Density Variables and Scales --
    var den_colour = "#7570b3";

    var yDenScale = d3.scaleLinear()
            .domain([0, height])
            .rangeRound([height,0]);

        xDenScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0,bandwidth/no_sets - 5]);


    // --- Creating base SVG --- 
    var svg = d3.select(place)
                .append("svg")
                .attr("width",width + margin.right + margin.left)
                .attr("height",height + margin.top + margin.bottom)
                .attr("class", "main-svg")
                .append("g")
                     .attr("transform","translate(" + margin.left + ',' + margin.top +')');



    // -- Drawing background rectangles -- 
    // svg.selectAll("rect")
    //     .data(testData)
    //     .enter()
    //     .append("rect")
    //     .attr("class","bg_bar")
    //     .attr('x',function(d) {return xScale(d.name);})
    //     .attr('y',-padding)
    //     .attr("height",function(d){return yScale(0)+2*padding})
    //     .attr("width",bandwidth)
    //     .attr("fill", "None")
    //     .attr("stroke", "None")
    //     .style("opacity",0.5);
        

  
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



    // ======= Density Distribution ======= 
    var single_bw = bandwidth/no_sets,
    start_point = single_bw/2,

    histo_bin_h = (height/no_bins);

    var point_shift = histo_bin_h/2;

    for (s=0 ; s < no_sets; s++) {

        // -- Data variables for the specific set -- 
        this_set = complete_data[s];
        this_data = this_set.data;
        this_den = this_set.den;
        this_med = this_set.median;

        // === Density & Median === 
        for (ind=0 ; ind < no_features; ind++) {
            ft_name = this_data[0][ind].name;
            centre = xScale(ft_name) + start_point+(s*single_bw);

            // --- Centre Line --- 
            svg.append("g")
                .append("line")
                .attr('x1',centre)
                .attr('x2',centre)
                .attr('y1',yDenScale(0))
                .attr("y2",yDenScale(height))
                .attr("width",3)
                .attr('opacity',0.2)
                .attr("stroke-width",0.5)
                .attr("stroke",den_colour);

            // --- Drawing the Density --- 
            for (n=0 ; n < no_bins; n++){
                var inBin = xDenScale(this_den[ind][n]);
                svg.append("g")
                    .append("rect")
                    .attr('x',centre-inBin/2)
                    .attr('y',yDenScale(histo_bin_h*n+histo_bin_h))
                    .attr("height",histo_bin_h)
                    .attr("width",inBin)
                    .attr("fill",den_colour)
                    .attr('opacity',function(d){
                        if (density_toggle){
                            return 0.4;
                        }
                        else{return 0;}})
                    .attr("stroke-width",1)
                    .attr("stroke","white");

            }

            // --- Median Line --- 
            if (median_toggle) {   
                var tick_size = 10,
                    tick_width = 3;
               
                svg.append("g")
                    .append("line")
                    .attr("class","split_lines")
                    .attr("x1",centre - tick_size/2)
                    .attr('y1',function(){
                        if (discrete_mask[ind]==1) {return yScale(this_med[ind])-point_shift}
                        else {return yScale(this_med[ind]);}})
                    .attr('y2',function(){
                        if (discrete_mask[ind]==1) {return yScale(this_med[ind])-point_shift}
                        else {return yScale(this_med[ind]);}})
                    .attr("x2",centre + tick_size/2)
                    .style("stroke",den_colour)
                    .style("stroke-opacity",1)
                    .style("stroke-width",tick_width);
            }
        }


        shift_svg = svg.append("g")
            .attr("transform","translate(" + (start_point+(s*single_bw)) + ',0)'); 
        
        // === Counter Factuals === 
        if (cf_toggle){

            shift_svg.append('g').selectAll("path")
                .data(this_data)
                .enter()
                .append("path")
                .on('mouseover',function(){
                    d3.selectAll(".arrows").attr("fill-opacity",0);
                    d3.select(this).attr("stroke-opacity",1).attr("fill-opacity",0.7)
                })

                .on('mouseout',function(){
                    d3.selectAll(".arrows").attr("fill-opacity",0.7);
                    d3.select(this).attr("stroke-opacity",0)
                })
                .on('click',function(d){
                    var reloc = window.location.origin + "/individual?sample=" + d[0].sample;
                    window.location.href = reloc;
                })
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
        }

        // === Individual Points === 
        if (point_toggle) {
            for(n=0 ; n < this_data.length; n++){
                var oneData = this_data[n]

                line_str = "M"

                for(i=0; i < oneData.length; i++){
                    d = oneData[i];
                    x = xScale(d.name);
                    y = yScale(d.scl_val);
                    y_shift = yScale(d.scl_val)-point_shift;
                    xy = stagger_val(x,y_shift,stagger_r);

                    // Identify discrete features to jagger
                    if (discrete_mask[i]==1){
                        y = xy[1];
                        // x = xy[0];
                    }
                    x = xy[0]; // Jaggers all point in x-plane

                    shift_svg.append("g")
                        .append("circle")
                        .attr("class",s.toString()+'-'+n.toString())
                        .attr("r", point_size)
                        .attr("cx",x)
                        .attr("cy",y)
                        .style("fill", function(){
                            if (d.dec == 0) {
                                return good_col;}
                            else {
                                return bad_col;}})
                        .style("opacity", pt_opp_lst[s])
                        .on("mouseover",function(){
                            id_code = d3.select(this).attr("class");
                            d3.select('#line-'+id_code.toString()).attr("stroke-opacity",1);
                        })
                        .on('mouseout',function(){
                            id_code = d3.select(this).attr("class");
                            d3.select('#line-'+id_code.toString()).attr("stroke-opacity",0);
                        });

        

                    // Add to line path
                    line_str = line_str + x.toString() + ',' + y.toString();
                    if (i != oneData.length-1){line_str += ",L";}
                }
                
                // ==== Draw line connecting points ==== 
                shift_svg.append('g')
                    .append("path")
                    .attr('d',line_str)
                    .attr('id',"line-"+s.toString()+'-'+n.toString())
                    .attr('fill',"None")
                    .attr("stroke-width", 0.5)
                    .attr("stroke","gray")
                    .attr("stroke-opacity",0);
                    // .on('mouseover',function(){
                    //     d3.select(this).attr("stroke-opacity",1);
                    // })
                    // .on('mouseout',function(){
                    //     d3.select(this).attr("stroke-opacity",0);
                    // });


                        // .on('mouseover',function(){
                        //     d3.selectAll(".arrows").attr("fill-opacity",0);
                        //     d3.select(this).attr("stroke-opacity",1).attr("fill-opacity",0.7)
                        // })

                        // .on('mouseout',function(){
                        //     d3.selectAll(".arrows").attr("fill-opacity",0.7);
                        //     d3.select(this).attr("stroke-opacity",0)
                        // })
                        // .on('click',function(d){
                        //     var reloc = window.location.origin + "/individual?sample=" + d[0].sample;
                        //     window.location.href = reloc;
                        // })
                        // .attr('d',line_str)
                        // .attr("class","arrows")
                        // .attr("fill-opacity",0.7)
                        // .attr("fill",function(d){
                        //     if (d[0].dec == 0) {
                        //         return bad_col;}
                        //     else {
                        //         return good_col;}
                        // })
                        // .attr("stroke-width", 2)
                        // .attr("stroke",function(d){
                        //     if (d[0].dec == 0) {
                        //         return bad_col;}
                        //     else {
                        //         return good_col;}
                        // })
                        // .attr("stroke-opacity",0)


            }
        }


    }


}


// draw_aggregation_graph(leftData,leftDen,rightDen,leftMed, rightMed,'body')