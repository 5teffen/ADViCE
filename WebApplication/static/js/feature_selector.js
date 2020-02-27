

// var aFeature = {
// 	name: "Risk Estimate",
// 	range:[0,10],
// 	den: density,
// 	current: [3,9] // init specific values
// }


// var aFeature = [oneFeature, oneFeature,oneFeature, oneFeature]

function feature_selector(place, aFeature) {

	var section_h = 50,
		section_w = 150,
		section_sep = 10;

	var fineness = aFeature.den.length;

    var good_col = "#d95f02",
        bad_col = "#1b9e77";

    var separator = 0.015;

    // --- Slider Parameters --- 

    var slide_w = 8,
    	slide_h = 20,
    	slide_curv = 1,
    	slide_col = "lightgrey",
    	fill_col = "#7570b3"
    	fill_light = "#dcdef2";


    	// slide_col = "#666666",


    // --- Label Parameters --- 
    var lab_w = 22,
    	lab_h = 17,
    	lab_col = "white",
    	lab_border = "black";

    
    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 15, 
            right: 10, 
            bottom: 10, 
            left: 10
        },

        width = 190 - margin.right - margin.left,
        height = 80 - margin.top - margin.bottom;


    // --- Scales for Entire SVG --- 
    var yScale = d3.scaleLinear()
            .domain([0, height])
            .rangeRound([height, 0]);


    // --- Scales for Section SVG --- 
	var xDenScale = d3.scaleLinear()
	    .domain([0, fineness-1])
	    .rangeRound([0,section_w]);

	var yDenScale = d3.scaleLinear()
	    .domain([0, 1])
	    .rangeRound([section_h/3,0]);


    var svg = d3.select(place)
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .attr("class", "main-svg")
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.top +')');


    // -- Density Line Functions -- 
    var line = d3.line()
            .y(function(d) {return yDenScale(d);})
            .x(function(d,i) {return xDenScale(i);});


    // -- Drawing background rectangles -- 
    svg.append("g")
        .append("rect")
        .attr("class","bg")
        .attr('x',0)
        .attr('y',0)
        .attr("height",height)
        .attr("width",width)
        .attr("fill",'none')
        .attr("stroke-width",2)
        .attr("stroke","None");

	    

/* =================================================
   ====================== Main =====================
   =================================================*/

    var x_shift = 0,
    	y_shift = section_h+section_sep;

    // var start = aFeature.range[0],
		 	// end = aFeature.range[1],
		 	// full_range = end-start,
		 	// m1 = 0,   // Ranges
		 	// m2 = 100,


	var start = aFeature.range[0],
	 	end = aFeature.range[1],
	 	full_range = end-start,
	 	init_start = aFeature.current[0],
	 	init_end = aFeature.current[1],
	 	m1 = Math.round(100*(init_start-start)/full_range),   // Percentages for density
	 	m2 = Math.round(100*(init_end-start)/full_range)
	 	out_min = init_start,
	 	out_max = init_end;


	var start_arr = aFeature.den.slice();

    // -- Section Boundary -- 
    svg.append("g")
        .append("rect")
        .attr("class","bg")
        .attr('x',0)
        .attr('y',0)
        .attr("height",section_h)
        .attr("width",section_w+20)
        .attr("fill",'none')
        .attr("stroke-width",2)
        .attr("stroke","None");

    // -- Center the Density -- 
    svg = svg.append("g").attr("transform","translate(" + 5 + ',' + (section_h/2-section_h/6) +')');

    // // -- Drawing Density -- 
    // var cur_arr = start_arr.splice(100,100)
    // cur_arr.push(0);
    
	svg.append('g').append('path').datum(start_arr)
	.attr('id',"curve")
    .attr('d',line)
    .attr('stroke',fill_col)
    .attr('fill',fill_col)
    .attr('opacity',1);


    // svg.append('g').append('path').datum(cur_arr)
    //     .attr('d',line)
    //     .attr('stroke',"blue")
    //     .attr('fill',"black")
    //     .attr('opacity',0.2);

    // -- Adding Ranges -- 
    // svg.append("g")
   	// 	.append('text')
    // 	.text(start)
    // 	.attr("x", -2)
   	//  	.attr("y", yDenScale(0)+15)
    // 	.attr("font-family",'"Open Sans", sans-serif')
    // 	.attr("font-size", '11px')
    // 	.attr("font-weight", 'bold')
    // 	.attr("fill",'black')
    // 	.attr("text-anchor",'left');

   	// svg.append("g")
   	// 	.append('text')
    // 	.text(end)
    // 	.attr("x", section_w-8)
   	//  	.attr("y", yDenScale(0)+15)
    // 	.attr("font-family",'"Open Sans", sans-serif')
    // 	.attr("font-size", '11px')
    // 	.attr("font-weight", 'bold')
    // 	.attr("fill",'black')
    // 	.attr("text-anchor",'left');



	// -- Define Drag Functionality -- 


	x_div = 6,
	slider_col = '#b3c1d6'
	min_x = 0,    // RISKY
	max_x = section_w;

	svg = svg.append("g").attr("transform","translate(" + (-slide_w/2) + ',' + 0 +')');

	var drag = d3.drag()
	    .on('drag', function() {
	        var event, new_x, new_y;

	        event = d3.event;  
	        new_x = event.x + event.dx;  // D3 itself records the changes
	        new_y = event.y + event.dy;

	        if (new_x > max_x){ x = max_x; }
	        else if (new_x < min_x) {x = min_x;}
	        else {x = new_x;}

	        var selection = d3.select(this)
	        selection.attr('x',x);
	        
	    	var id = selection.attr("id");


	    	if (id == "slide1"){
	    		var percentage = x/section_w;
	    		// m1 = Math.round(percentage*fineness);
	    		m1 = Math.round(percentage*100);
	    		density_curve(m1,m2);

	    		out_min = start + Math.round(percentage*full_range); // OSCAR: min val output
	    	
	    		d3.select("#llab").attr('x',x-lab_shift);

	    		d3.select("#lt-label")
	    			.text(out_min.toString())
	    			.attr('x',x+text_shift)

	    	}

	    	else if (id == "slide2"){
	    		var percentage = x/section_w;
	    		// m2 = Math.round(percentage*fineness);
	    		m2 = Math.round(percentage*100);
	    		density_curve(m1,m2);

	    		out_max = start + Math.round(percentage*full_range); // OSCAR: max val output
	    	

	    		d3.select("#rlab").attr('x',x-lab_shift);

	    		d3.select("#rt-label")
		    		.text(out_max.toString())
		    		.attr('x',x+text_shift);

	    	}

	    	// console.log(out_min, out_max);
	    	// selection.attr("fill", "blue")
	    })

	    .on("end", function(){
			out_high = out_max;
			out_low = out_min;
			console.log("Low: " + out_low.toString() + " | High: " + out_high.toString());
			ft_curr_range[filter_set_idx][aFeature.id] = [out_low,out_high];
    		makeScatterRequest();
    		console.log("idx:", filter_set_idx, "ft", aFeature.id, ": ", ft_curr_range[filter_set_idx][aFeature.id]);


		});



	// -- Slider section --
	var lstart = xDenScale(Math.round(fineness*(init_start-start)/full_range));
    var rstart = xDenScale(Math.round(fineness*(init_end-start)/full_range));

    svg.append("g")
        .append("rect")
        .attr("class","slider")
        .attr("id", "slide1")
        .attr('x',lstart)
        .attr('y',0)
        .attr("height",slide_h)
        .attr("width",slide_w)
        .attr("rx",slide_curv)
        .attr("ry",slide_curv)
        .attr("fill",slide_col)
        .attr("stroke-width",1)
        .attr("stroke","black")
        .attr("stroke-opacity",0.8)
		.call(drag);


    svg.append("g")
        .append("rect")
        .attr("class","slider")
        .attr("id", "slide2")
        .attr('x',rstart)
        .attr('y',0)
        .attr("height",slide_h)
        .attr("width",slide_w)
        .attr("rx",slide_curv)
        .attr("ry",slide_curv)
        .attr("fill",slide_col)
        .attr("stroke-width",1)
        .attr("stroke","black")
        .attr("stroke-opacity",0.8)
		.call(drag);



	// -- Labels --
    var lab_shift = (lab_w - slide_w)/2;
    var text_shift = (lab_w)/2 - lab_shift;

	svg.append("g")
	    .append("rect")
	    // .attr("class","left-label")
	    .attr("id", "llab")
        .attr('x',lstart - lab_shift)
	    .attr('y',-lab_h-5)
	    .attr("height",lab_h)
	    .attr("width",lab_w)
	    .attr("fill",lab_col)
	    .attr("stroke-width",1)
	    .attr("stroke",lab_border)
	    .attr("stroke-opacity",0.8);

	svg.append("g")
	    .append("rect")
	    // .attr("class","r-label")
	    .attr("id", "rlab")
        .attr('x',rstart - lab_shift)
	    .attr('y',-lab_h-5)
	    .attr("height",lab_h)
	    .attr("width",lab_w)
	    .attr("fill",lab_col)
	    .attr("stroke-width",1)
	    .attr("stroke",lab_border)
	    .attr("stroke-opacity",0.8);

	svg.append("g")
		.append('text')
		.text(start.toString())
		.attr("id", "lt-label")
        .attr('x',lstart  + text_shift)
		.attr('y',-10)
		.attr("font-family",'"Open Sans", sans-serif')
		.attr("font-size", '11px')
		.attr("font-weight", 'bold')
		.attr("fill",'black')
		.attr("text-anchor",'middle');

	svg.append("g")
		.append('text')
		.text(end.toString())
		.attr("id", "rt-label")
		.attr('x',rstart + text_shift)
		.attr('y',-10)
		.attr("font-family",'"Open Sans", sans-serif')
		.attr("font-size", '11px')
		.attr("font-weight", 'bold')
		.attr("fill",'black')
		.attr("text-anchor",'middle');








    // svg = svg.append("g").attr("transform","translate(" + x_shift + ',' + y_shift +')');
    
	var grad = svg.append("defs")
			.append("linearGradient")
			.attr("id", "grad");



	// -- Custom init -- 		
	density_curve(m1,m2);


    function density_curve(per1,per2) {

    	grad.remove();

		grad = svg.append("defs")
			.append("linearGradient")
			.attr("id", "grad");
		
		grad.append("stop").attr("offset", "0%").attr("stop-color", fill_light);
		grad.append("stop").attr("offset", (per1-1).toString()+"%").attr("stop-color", fill_light);
		grad.append("stop").attr("offset", (per1).toString()+"%").attr("stop-color", fill_col);
		grad.append("stop").attr("offset", (per2).toString()+"%").attr("stop-color", fill_col);
		grad.append("stop").attr("offset", (per2+1).toString()+"%").attr("stop-color", fill_light);
		grad.append("stop").attr("offset", "100%").attr("stop-color", fill_light);
	   

    	// svg.append('g').append('path').datum(start_arr)
    	// 	.attr('id',"curve")
	    //     .attr('d',line)
	    //     .attr('stroke',"blue")
	    //     .attr('fill',"url(#grad)")
	    //     .attr('opacity',1);


	   	var sel = d3.select("#curve");
	   	sel.attr('fill',"url(#grad)");


	}


	// -- Add the feature name --
    svg = svg.append("g").attr("transform","translate(" + 0 + ',' + 45 +')');

	svg.append("g")
		.append('text')
		.text("Feature: " + aFeature.name)
		.attr("x", 0)
		.attr("y", 0)
		.attr("font-family",'"Open Sans", sans-serif')
		.attr("font-size", '12px')
		.attr("fill",'black')
		.attr("text-anchor",'centre'); 




 
    
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

  

    // // -- Drawing and styling the AXIS
    
    // var xAxis = d3.axisBottom().scale(xScale);

    // svg.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(xAxis)
    //     .selectAll("text")  
    //         .style("fill","black")
    //         .style("text-anchor", "end")
    //         .attr("dy", "-0.5em")
    //         .attr("dx", "-0.5em")
    //         .attr("transform","rotate(-70)")
    //         .attr("class", "feature-name");


    // var den_svg = svg;
    // for (ind=0 ; ind < rightList.length; ind++) {
    //     right = rightList[ind]
    //     left = leftList[ind]

    //     med_right = rightMid[ind]
    //     med_left = leftMid[ind]


    //     // -- Drawing left density distribution --
    //     den_svg.append('g').append('path').datum(left)
    //     .attr('d',left_line)
    //     .attr('stroke',den_colour)
    //     .attr('fill',den_colour)
    //     .attr('opacity',0.2);


    //      // -- Centre the image -- 
    //     den_svg = den_svg.append("g")
    //             .attr("transform","translate(" + (xDenScaleRight(1)) + ',0)'); 



    //     // -- Drawing median lines -- 
    //     var tick_size = 4;
       
    //     den_svg.append("g")
    //         .append("line")
    //         .attr("class","split_lines")
    //         .attr("x1",0)
    //         .attr('y1',function(d){return yScale(med_right);})
    //         .attr("y2",function(d){return yScale(med_right);})
    //         .attr("x2",tick_size)
    //         .style("stroke",den_colour)
    //         .style("stroke-width",3);

    //     den_svg.append("g")
    //         .append("line")
    //         .attr("class","split_lines")
    //         .attr("x1",0)
    //         .attr('y1',function(d){return yScale(med_left);})
    //         .attr("y2",function(d){return yScale(med_left);})
    //         .attr("x2",-tick_size)
    //         .style("stroke",den_colour)
    //         .style("stroke-width",3);


    //     // -- Drawing right density distribution --
    //     den_svg.append('path').datum(right)
    //     .attr('d',right_line)
    //     .attr('stroke', den_colour)
    //     .attr('fill',den_colour)
    //     .attr('opacity',0.4);
  

    //     // -- Centre the image -- 
    //     den_svg = den_svg.append("g")
    //             .attr("transform","translate(" + (xDenScaleRight(1)) + ',0)');
    // }

    // function draw_triangle(data) {
    //     var full_string = "";

    //     for(n=0 ; n < data.length; n++){
    //         var d = data[n];

    //         x1 = xScale(d.name) + xScale.bandwidth()*0.30
    //         x2 = xScale(d.name) + xScale.bandwidth()*0.70
    //         x3 = xScale(d.name) + xScale.bandwidth()*0.5
    //         y1 = yScale(d.scl_val)
    //         y2 = yScale(d.scl_change)


    //         one_tri = "M"+x1+","+y1+"L"+x2+","+y1+"L"+x3+","+y2
    //             +"L"+x1+","+y1;


    //         full_string += one_tri
    //     }
    //     return full_string
    // }


    // svg.append('g').selectAll("path")
    // .data(allData)
    // .enter()
    // .append("path")
    // .on('mouseover',function(){
    //     d3.select(this)
    //     .attr('stroke','black')
    // })
    // .on('mouseout',function(){
    //     d3.select(this)
    //     .attr("stroke",'none')
    // })
    // .attr('d',function(d){return draw_triangle(d);})
    // .attr("fill-opacity",0.7)
    // .attr("fill",function(d){
    //     if (d[0].dec == 0) {
    //         return bad_col;}
    //     else {
    //         return good_col;}
    // })
    // .attr("stroke-width", 1.5);




    // // -- Drawing median -- 
    // svg.append("g").selectAll("line")
    //     .data(testData)
    //     .enter()
    //     .append("line")
    //     .attr("class","split_lines")
    //     .attr("x1",function(d) {return xScale(d.name)+xScale.bandwidth();})
    //     .attr('y',0)
    //     .attr("y2",function(d){return yScale(0-padding_bottom)})
    //     .attr("x2",function(d) {return xScale(d.name)+xScale.bandwidth();})
    //     .style("stroke",function(d,i){
    //         if (i == testData.length-1) {return "None";}
    //         else {return "#A9A9A9";}})
    //     .style("stroke-width",0.7);

}


// feature_selector(aFeature, "body")