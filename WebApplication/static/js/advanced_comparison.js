


// function draw_comparison(leftData,rightData,leftDen,rightDen,leftMed,rightMed,place, median_toggle, density_toggle, point_toggle, cf_toggle) {

    // -- Initial conversion -- 
    // set1 = {data: leftData, den: leftDen, median: leftMed};
    // set2 = {data: rightData, den: rightDen, median: rightMed};
    // set3 = {data: leftData, den: leftDen, median: leftMed};

    // complete_data = [set1];
    // complete_data = [set1,set2];
    // complete_data = [set1,set2,set1];
    // complete_data = [set1,set2,set1,set2,set1];


function draw_comparison(complete_data, place, median_toggle, density_toggle, point_toggle, cf_toggle, detail_toggle) {

    // -- Details on/off -- 
    // detail_toggle = true;


    function stagger_val(x,y,radius){

            dx = radius*Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
            dy = radius*Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
            angle = 2*Math.PI*Math.random();
            x_out = x + dx;
            y_out = y + dy;

            return [x_out, y_out]
    }

    function draw_triangle(data,tri_w) {
        var full_string = "";

        for(n=0 ; n < data.length; n++){

            var d = data[n];

            // if ((d.scl_val != d.scl_change) || (!button3 && !density_toggle)){
            if (d.scl_val != d.scl_change) {
                x1 = xScale(d.name) - tri_w/2
                x2 = xScale(d.name) + tri_w/2
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


    function draw_triangle2(data,tri_w,shift,binh) {
        var full_string = "";

        for(n=0 ; n < data.length; n++){

            var d = data[n];

            // if ((d.scl_val != d.scl_change) || (!button3 && !density_toggle)){
            if (d.scl_val != d.scl_change) {
                x1 = xScale(d.name) - tri_w/2
                x2 = xScale(d.name) + tri_w/2
                x3 = xScale(d.name) 
                y1 = yScale(d.scl_val)
                y2 = yScale(d.scl_change)

                y1_dec = Math.floor(d.scl_val*10);
                y2_dec = Math.floor(d.scl_change*10);

                res1 = height - shift_lst[n][y1_dec]+binh/2;
                res2 = height - shift_lst[n][y2_dec]+binh/2;

                // if (isNaN(res1) == true){ // Non-permanent fix // Remove later
                //     console.log("fixing");
                //     y_dec = shift_lst[n].length-1
                //     res1 = height - shift_lst[n][y_dec]+binh/2;
                //     console.log(shift_lst[n][y_dec]);

                // }

                one_tri = "M"+x1+","+res1+"L"+x2+","+res1+"L"+x3+","+res2
                    +"L"+x1+","+res1;

                full_string += one_tri;
            }

        }
        return full_string
    }
    
    // --- Establish metadata ---
    var metadata = complete_data[0].meta

    var no_features = metadata.length, // Assumes they all match
        no_bins = complete_data[0].den[0].length,  // Assumes they all match
        no_samples_lst = [],
        pt_opp_lst = [];


    // --- Identify the number of sets to visualize --- 
    var no_sets = complete_data.length;

    var max_ft_name_len = 15;


    for (i=0; i<no_sets; i++){
        no_samp = complete_data[0].data.length;
        no_samples_lst.push(no_samp);  // Different for each set
        pt_opp_lst.push((1/no_samp)*50);
    }


    // --- Point related variables --- 
    var points_col = "#67a9cf",
        point_size = 2,
        stagger_r = 3;

    // --- Track current bin --- 
    var current_bin = ""

    // --- Color related variables ---
    var good_col = "#d95f02",
        bad_col = "#1b9e77";
       
    var single_data_point = complete_data[0].data[0];


    // --- Establshing Dimensions ---
    var max_width = 1100
        one_width = (max_width/no_features)/no_sets;
    
    if (one_width > 50){one_width = 50;} // Ensures width is not too big

    var col_width = one_width*no_sets,
        half_col = one_width, // TO REMOVE
        separator = 0.3,
        padding = 10;


    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 30, 
            right: 20, 
            bottom: 55, 
            left: 65
        },
        width = col_width*no_features - margin.right - margin.left,
        height = 300 - margin.top - margin.bottom;



    // --- Creating Scales based on canvas --- 
    var xScale = d3.scaleBand()
            .domain(metadata.map(function(d){return d.name;}))
            .rangeRound([0, width])
            .paddingInner(separator),
        
        yScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([height, 0]);

    var bandwidth = xScale.bandwidth(),
        // triangle_w = 0.6*bandwidth/no_sets;
        triangle_w = (one_width/2)*0.6;  // Single CF Triangle Width


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
                .attr("style", "float: center;")
                .attr("class", "main-svg")
                .append("g")
                     .attr("transform","translate(" + margin.left + ',' + margin.top +')');

  
    // -- Drawing and styling the AXIS
    var xAxis = d3.axisBottom().scale(xScale);


    // --- Make space for Details --- 
    if (detail_toggle) {
        axis_svg = svg.append("g")
                .attr("transform","translate(0,"+ (10) + ')'); 
    }
    else {
        axis_svg = svg;
    }
        
    axis_svg.append("g")
        .attr("class", "axis")
        .attr("y", -50)
        .attr("transform", "translate(0," + (height+padding) + ")")
        .call(xAxis)
        .selectAll("text")  
            .style("fill","black")
            .style("text-anchor", "end")
            .attr("dy", "-0.5em")
            .attr("dx", "-0.5em")
            .attr("transform","rotate(-25)")
            .attr("class", "feature-name");


    // ====== Creating a shift vector ======
    var shift_lst = [];
    
    for (n=0 ; n < no_features; n++){
        oneMeta = metadata[n];
        
        if (oneMeta.cat == 1){
            ft_bins = oneMeta.bins.length;
            section_h = height/ft_bins;
            hist_h = height/no_bins;

            // console.log(oneMeta.bins);

            // // shift_map = new Map();
            var one_shift = [];
            for (g=0 ; g < ft_bins; g++){
                bin_val = oneMeta.bins[g][0];
                bin_shift = (section_h/2) + (section_h*g) + (hist_h/2);
                one_shift.push(bin_shift);
            }
            shift_lst.push(one_shift);
        }

        else{
            shift_lst.push(0);
        }    
    }

    // ======= Density Distribution ======= 
    var single_bw = bandwidth/no_sets,
    start_point = single_bw/2,

    histo_bin_h = (height/no_bins);

    var point_shift = histo_bin_h/2;

    // -- Max/Min range details --
    if (detail_toggle) {
        svg.append('g').selectAll("text")
            .data(complete_data[0].meta)
            .enter()
            .append("text")
            .text(function(d){return "Min: "+ d.min.toString();})
            .attr("x",function(d){
                return xScale(d.name)+bandwidth/2;})
            .attr("y",yScale(0)+14)
            .attr("text-anchor","middle")
            .attr("font-family",'"Open Sans", sans-serif')
            .attr("font-size", '9px')
            .attr("font-weight", 400)
            .attr("fill","black");

        svg.append('g').selectAll("text")
            .data(complete_data[0].meta)
            .enter()
            .append("text")
            .text(function(d){return "Max: "+ d.max.toString();})
            .attr("x",function(d){
                return xScale(d.name)+bandwidth/2;})
            .attr("y",yScale(1)-14)
            .attr("text-anchor","middle")
            .attr("font-family",'"Open Sans", sans-serif')
            .attr("font-size", '9px')
            .attr("font-weight", 400)
            .attr("fill","black");
    }


    for (s=0 ; s < no_sets; s++) {

        // -- Data variables for the specific set -- 
        this_set = complete_data[s];
        this_data = this_set.data;
        this_den = this_set.den;
        this_med = this_set.median;
        this_meta = this_set.meta;

        // console.log("----Set"+s.toString());
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
            for (n=0 ; n < this_meta[ind].bins.length; n++){
                var inBin = xDenScale(this_den[ind][n]);
                // console.log(this_den[ind][n]);
                
                if (this_den[ind][n] > 0 && inBin < 3) { // Look into this
                    inBin = 3;}
               
                svg.append("g")
                    .append("rect")
                    .attr("id", "den-"+s.toString()+'-'+ind.toString()+'-'+n.toString())
                    .attr('x',centre-inBin/2)
                    .attr('y',function(){
                        if (this_meta[ind].cat == 1 && inBin != 0){
                            res = height - shift_lst[ind][n];

                            // res = yDenScale(histo_bin_h*n+histo_bin_h);
                            return res;
                        }

                        return yDenScale(histo_bin_h*n+histo_bin_h);
                    })
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


                // --- Bin Details --- 
                // if (detail_toggle && s == 0) {
                if (s == 0) {   
                    svg.append('g')
                        .append("text")
                        .text(function(){
                            if (this_meta[ind].cat) {
                                return this_meta[ind].bins[n];
                            }
                            else{
                                low = this_meta[ind].bins[n][0];
                                high = this_meta[ind].bins[n][1];
                            }
                            return low + "-" + high;})
                        .attr("id", function(){
                            return s.toString() +'-'+ind.toString()+'-'+n.toString()})
                        .attr("x",function(){
                            return xScale(this_meta[ind].name)+bandwidth/2;})
                        .attr('y',function(){
                            if (this_meta[ind].cat == 1){
                                res = height - shift_lst[ind][n]+histo_bin_h/2+3;
                                // res = yDenScale(histo_bin_h*n+histo_bin_h);
                                return res;
                            }

                            return yDenScale(histo_bin_h*n+histo_bin_h - histo_bin_h/2-5);
                            })

                        // .attr("y",yDenScale(histo_bin_h*n+histo_bin_h - histo_bin_h/2-5))
                        .attr("text-anchor","middle")
                        .attr("font-family",'"Open Sans", sans-serif')
                        .attr("font-size", '10px')
                        .attr("font-weight", 400)
                        .attr("fill","none");
                }
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
                        if (this_meta[ind].cat ==1 ) {return yScale(this_med[ind])-point_shift}
                        else {return yScale(this_med[ind]);}})
                    .attr('y2',function(){
                        if (this_meta[ind].cat == 1) {return yScale(this_med[ind])-point_shift}
                        else {return yScale(this_med[ind]);}})
                    .attr("x2",centre + tick_size/2)
                    .style("stroke",den_colour)
                    .style("stroke-opacity",function(){
                        if (this_meta[ind].cat == 1) {return 0}
                        else {return 1;}})
                    .style("stroke-width",tick_width);
            }

        }


        shift_svg = svg.append("g")
            .attr("transform","translate(" + (start_point+(s*single_bw)) + ',0)'); 
        

        // === Individual Points === 
        if (point_toggle) {
            for(n=0 ; n < this_data.length; n++){
                var oneData = this_data[n];
                line_str = "M";
                for(i=0; i < oneData.length; i++){
                    d = oneData[i];
                    x = xScale(d.name);
                    y = yScale(d.scl_val);

                    x = stagger_val(x,y,stagger_r)[0];

                    // Add shift 
                    if (this_meta[i].cat == 1){
                        y_dec = Math.floor(d.scl_val*10);
                        y = height - shift_lst[i][y_dec]+histo_bin_h/2;

                        if (isNaN(y) == true){ // Non-permanent fix // Remove later
                            y_dec = shift_lst[i].length-1
                            y = height - shift_lst[i][y_dec]+histo_bin_h/2;

                        }

                    }

                    // y_shift = yScale(d.scl_val)-point_shift;
                    // xy = stagger_val(x,y_shift,stagger_r);

                    // Identify discrete features to jagger
                    // if (this_meta[i].cat == 1){
                    //     y = xy[1];
                    //     // x = xy[0];
                    // }
                    // x = xy[0]; // Jaggers all point in x-plane

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

            }
        }


        function draw_lines(data, set, ft, bin, clear) {
            // Deselect all previous selections
            d3.selectAll(".line-selected").attr("class","line-empty")
                .attr("stroke-opacity",0);

            if (clear == false){
                for(n=0 ; n < data.length; n++){
                    var oneData = data[n];
                    
                    if (oneData[ft].bin_id == bin){
                        id_code = set.toString() + '-' + n.toString();
                        d3.select('#line-'+id_code.toString())
                        .attr("stroke-opacity",1)
                        .attr("class","line-selected");

                    } 
                }
            }
        }



        // --- Click Boxes  --- 
        for (ind=0 ; ind < no_features; ind++) {
            ft_name = this_data[0][ind].name;
            centre = xScale(ft_name) + start_point+(s*single_bw);
            box_size = (xDenScale(1)+5)
            for (no=0 ; no < this_meta[ind].bins.length; no++){
                svg.append("g")
                    .append("rect")
                    .attr("data-bin", no)
                    .attr("data-set", s)
                    .attr("data-ft", ind)
                    .attr('x',centre-box_size/2)
                    .attr('y',function(){
                        if (this_meta[ind].cat == 1){
                            res = height - shift_lst[ind][no];
                            // res = yDenScale(histo_bin_h*n+histo_bin_h);
                            return res;
                        }
                        return yDenScale(histo_bin_h*no+histo_bin_h);
                    })
                    .attr("height",histo_bin_h)
                    .attr("width",box_size)
                    .attr("fill","red")
                    .attr('opacity',0)
                    .on('click', function(){
                        // console.log("clicked");
                        var selection = d3.select(this);
                        set_id = selection.attr("data-set");
                        bin_id = selection.attr("data-bin");
                        ft_id = selection.attr("data-ft");

                        bin_str = set_id.toString() +'-'+ ft_id.toString() +'-'+ bin_id.toString();
                        if (bin_str == current_bin) {clear = true; current_bin = "";} 
                        else {clear = false; current_bin = bin_str;}
                        draw_lines(this_data,set_id,ft_id,bin_id,clear);
                    })                
                    .on('mouseover',function(){
                        if(detail_toggle){
                            var selection = d3.select(this);
                            set_id = selection.attr("data-set");
                            bin_id = selection.attr("data-bin");
                            ft_id = selection.attr("data-ft");
                            bin_str = set_id.toString() +'-'+ ft_id.toString() +'-'+ bin_id.toString();
                            document.getElementById(bin_str);
                            var det_selection = document.getElementById(bin_str);
                            det_selection.style.fill = "black";
                        }
                    })
                    .on('mouseout',function(){
                        if(detail_toggle){
                            var selection = d3.select(this);
                            set_id = selection.attr("data-set");
                            bin_id = selection.attr("data-bin");
                            ft_id = selection.attr("data-ft");
                            bin_str = set_id.toString() +'-'+ ft_id.toString() +'-'+ bin_id.toString();
                            document.getElementById(bin_str);
                            var det_selection = document.getElementById(bin_str);
                            det_selection.style.fill = "none";
                        }
                    });
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
                    // return draw_triangle(d, triangle_w);})
                    return draw_triangle2(d, triangle_w, shift_lst, histo_bin_h);})
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




    }

    for (var j=0; j<no_features; j++){
        var ft_name = document.getElementsByClassName("feature-name")[j].innerHTML;
        var short_ft_name = ft_name;
        if (ft_name.length > max_ft_name_len){
            short_ft_name = ft_name.substring(0,max_ft_name_len) + "...";
        }
        document.getElementsByClassName("feature-name")[j].innerHTML = short_ft_name;
    }

}


                    // .attr('y',yDenScale(histo_bin_h*no+histo_bin_h))




        // if (point_toggle) {
        //     for(n=0 ; n < this_data.length; n++){
        //         var oneData = this_data[n];

        //         line_str = "M";

        //         for(i=0; i < oneData.length; i++){
        //             d = oneData[i];
        //             x = xScale(d.name);
        //             y = yScale(d.scl_val);
        //             y_shift = yScale(d.scl_val)-point_shift;
        //             xy = stagger_val(x,y_shift,stagger_r);

        //             // Identify discrete features to jagger
        //             if (this_meta[i].cat == 1){
        //                 y = xy[1];
        //                 // x = xy[0];
        //             }
        //             x = xy[0]; // Jaggers all point in x-plane

        //             shift_svg.append("g")
        //                 .append("circle")
        //                 .attr("class",s.toString()+'-'+n.toString())
        //                 .attr("id", i.toString())
        //                 .attr("r", point_size)
        //                 .attr("cx",x)
        //                 .attr("cy",y)
        //                 .style("fill", function(){
        //                     if (d.dec == 0) {
        //                         return good_col;}
        //                     else {
        //                         return bad_col;}})
        //                 .style("opacity", pt_opp_lst[s])
        //                 .on("mouseover",function(){
        //                     id_code = d3.select(this).attr("class");
        //                     d3.select('#line-'+id_code.toString()).attr("stroke-opacity",1);
        //                 })
        //                 .on('mouseout',function(){
        //                     id_code = d3.select(this).attr("class");
        //                     d3.select('#line-'+id_code.toString()).attr("stroke-opacity",0);
        //                 });

        

        //             // Add to line path
        //             line_str = line_str + x.toString() + ',' + y.toString();
        //             if (i != oneData.length-1){line_str += ",L";}
        //         }
                
        //         // ==== Draw line connecting points ==== 
        //         shift_svg.append('g')
        //             .append("path")
        //             .attr('d',line_str)
        //             .attr('id',"line-"+s.toString()+'-'+n.toString())
        //             .attr('fill',"None")
        //             .attr("stroke-width", 0.5)
        //             .attr("stroke","gray")
        //             .attr("stroke-opacity",0);

        //     }
        // }






// draw_aggregation_graph(leftData,leftDen,rightDen,leftMed, rightMed,'body')