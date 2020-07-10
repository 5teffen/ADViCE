

// var aFeature = {
// 	name: "Risk Estimate",
// 	range:[0,10],
// 	den: density,
// 	current: [3,9] // init specific values
// }


// var aFeature = [oneFeature, oneFeature,oneFeature, oneFeature]

function feature_selector(place, aFeature, idx, slider_idx) {

	var section_h = 30,
		section_w = 150,
		section_sep = 10;

    console.log(aFeature.den[0]);


    // aFeature.den = [0.2,0.3,0.4]

	var fineness = aFeature.den.length;

    var good_col = "#d95f02",
        bad_col = "#1b9e77";

    var separator = 0.015;


    // --- Histogram Parameters --- 
    var histo_h = 25,
        histo_col = "#7570b3",
        no_bins = aFeature.den.length,
        histo_bin_w = section_w/no_bins;

    // --- Slider Parameters --- 
    var slide_w = 7,
    	slide_h = 20,
    	slide_curv = 1,
    	slide_col = "lightgrey",
    	fill_col = "#7570b3"
    	fill_light = "#dcdef2";


    // --- Label Parameters --- 
    var lab_w = 22,
    	lab_h = 17,
    	lab_col = "white",
    	lab_border = "black";

    // --- Bar Parameters --- 
    var bar_w = 150,
        bar_h = 7,
        select_col = "#7570b3",
        base_col = "#cac7eb";

    
    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 15, 
            right: 10, 
            bottom: 10, 
            left: 10
        },

        width = 190 - margin.right - margin.left,
        height = 70 - margin.top - margin.bottom;


    // --- Scales for Entire SVG --- 
    var xScale = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, section_w]);


    var yScale = d3.scaleLinear()
            .domain([0, height])
            .rangeRound([height, 0]);


    // --- Scales for Section SVG --- 
    var yHisto = d3.scaleLinear()
        .domain([0, 1])
        .rangeRound([0, histo_h]);

	// var xDenScale = d3.scaleLinear()
	//     .domain([0, fineness-1])
	//     .rangeRound([0,section_w]);

	// var yDenScale = d3.scaleLinear()
	//     .domain([0, 1])
	//     .rangeRound([section_h/3,0]);


    var svg = d3.select(place)
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .attr("class", "main-svg")
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.top +')');


    // -- Drawing background rectangle -- 
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


	var start = aFeature.range[0],
	 	end = aFeature.range[1],
	 	full_range = end-start,
	 	init_start = aFeature.current[0],
	 	init_end = aFeature.current[1],
	 	m1 = Math.round(100*(init_start-start)/full_range),   // Percentages for density
	 	m2 = Math.round(100*(init_end-start)/full_range),
	 	out_min = init_start,
	 	out_max = init_end;


    var xRangeScale = d3.scaleLinear()
        .domain([0, full_range])
        .rangeRound([0, section_w]);


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
    svg = svg.append("g").attr("transform","translate(" + 5 + ',' + (section_h/2+5) +')');

    // // -- Drawing Density -- 
    
    for (n=0 ; n < no_bins; n++){
        var inBin = aFeature.den[n];

         svg.append("g")
            .append("rect")
            // .attr("id","bar_selected")
            .attr('x',(n)*histo_bin_w)
            .attr('y',-yHisto(inBin)-1)
            .attr("height",yHisto(inBin))
            .attr("width",histo_bin_w)
            .attr("fill",histo_col)
            .attr("opacity",0.4)
            .attr("stroke-width",1)
            .attr("stroke","white");

    }


	// -- Define Drag Functionality -- 
	x_div = 6,
	slider_col = '#b3c1d6'
	min_x = 0,    // RISKY
	max_x = section_w;

    slide_shift = slide_w/2;

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
	        
	    	var id = selection.attr("id");


	    	if (id == "slide1-"+idx.toString() + "-" + slider_idx.toString()){
	    		var percentage = x/section_w;
	    		// m1 = Math.round(percentage*fineness);
	    		m1 = Math.round(percentage*100);
	    		// density_curve(m1,m2);

                var avg_x = xRangeScale(Math.round(percentage*full_range));

	    		out_min = start + Math.round(percentage*full_range); // OSCAR: min val output

                cur_l = avg_x;
	    	  
	    		d3.select("#llab"+idx.toString() + "-" + slider_idx.toString()).attr('x',avg_x-lab_shift);

	    		d3.select("#lt-label"+idx.toString() + "-" + slider_idx.toString())
	    			.text(out_min.toString())
	    			.attr('x',avg_x+text_shift)


                d3.select("#ft_bar_selected"+idx.toString() + "-" + slider_idx.toString())
                    .attr("width", cur_r-cur_l)
                    .attr("x", cur_l+slide_shift);


                selection.attr('x',avg_x);


	    	}

	    	else if (id == "slide2-"+idx.toString() + "-" + slider_idx.toString()){
	    		var percentage = x/section_w;
	    		// m2 = Math.round(percentage*fineness);
	    		m2 = Math.round(percentage*100);
	    		// density_curve(m1,m2);

                var avg_x = xRangeScale(Math.round(percentage*full_range));

                cur_r = avg_x;

	    		out_max = start + Math.round(percentage*full_range); // OSCAR: max val output
	    	

	    		d3.select("#rlab"+idx.toString() + "-" + slider_idx.toString()).attr('x',avg_x-lab_shift);

	    		d3.select("#rt-label"+idx.toString() + "-" + slider_idx.toString())
		    		.text(out_max.toString())
		    		.attr('x',avg_x+text_shift);

                d3.select("#ft_bar_selected"+idx.toString() + "-" + slider_idx.toString())
                    .attr("width", cur_r-cur_l)

                selection.attr('x',avg_x);

	    	} 

            // selection.attr('x',x);


	    	// console.log(out_min, out_max);
	    	// selection.attr("fill", "blue")
	    })

	    .on("end", function(){
			out_high = out_max;
			out_low = out_min;
			console.log("Low: " + out_low.toString() + " | High: " + out_high.toString());
            console.log(this);
            filter_set_idx = this.dataset.filteridx;
			ft_curr_range[filter_set_idx][aFeature.id] = [out_low,out_high];
            console.log("idx:", filter_set_idx, "ft", aFeature.id, ": ", ft_curr_range[filter_set_idx][aFeature.id]);
    		makeMainBackendRequest();
    		


		});

    // svg_orig =svg;
    svg = svg.append("g").attr("transform","translate(" + 0 + ',' + (-10) +')');

    svg = svg.append("g").attr("transform","translate(" + (-slide_shift) + ',' + 0 +')');
	

    // -- Start/End coordinates --
	var lstart = xScale(Math.round((init_start-start)/full_range));
    var rstart = xScale(Math.round((init_end-start)/full_range));

    var cur_l = lstart;
    var cur_r = rstart;



    // === Bar Base === 
    svg.append("g")
        .append("rect")
        .attr("class","bg")
        .attr('x',slide_shift)
        .attr('y',slide_h-bar_h-3)
        .attr("height",bar_h)
        .attr("width",bar_w)
        .attr("fill",base_col)
        .attr("stroke-width",0)
        .attr("stroke","black");

    svg.append("g")
        .append("rect")
        .attr("id","ft_bar_selected"+idx.toString() + "-" + slider_idx.toString())
        .attr('x',lstart+slide_shift)
        .attr('y',slide_h-bar_h-3)
        .attr("height",bar_h)
        .attr("width",rstart-lstart)
        .attr("fill",select_col)
        .attr("stroke-width",0)
        .attr("stroke","black");


    // === Slider ===
    svg.append("g")
        .append("rect")
        .attr("class","slider")
        .attr("id", "slide1-"+idx.toString() + "-" + slider_idx.toString())
        .attr("data-filteridx", idx.toString())
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
        .attr("id", "slide2-"+idx.toString() + "-" + slider_idx.toString())
        .attr("data-filteridx", idx.toString())
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
	    .attr("id", "llab"+idx.toString() + "-" + slider_idx.toString())
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
	    .attr("id", "rlab"+idx.toString() + "-" + slider_idx.toString())
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
		.attr("id", "lt-label"+idx.toString() + "-" + slider_idx.toString())
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
		.attr("id", "rt-label"+idx.toString() + "-" + slider_idx.toString())
		.attr('x',rstart + text_shift)
		.attr('y',-10)
		.attr("font-family",'"Open Sans", sans-serif')
		.attr("font-size", '11px')
		.attr("font-weight", 'bold')
		.attr("fill",'black')
		.attr("text-anchor",'middle');


    // === Removal Button === 
    var cross_line = 4,
        circ = 6,
        sec_h = 25,
        sec_s = 3,
        cross_op = 0.3
        mov_right = 10;

    svg.append('g').append("line")
    .attr("x1", width-circ-5-cross_line+mov_right)
    .attr("y1", sec_h/2-cross_line)
    .attr("x2", width-circ-5+cross_line+mov_right)
    .attr("y2", sec_h/2+cross_line)
    .attr("stroke","red")
    .attr("stroke-width","2")
    .attr("stroke-opacity", cross_op);

    svg.append('g').append("line")
    .attr("x1", width-circ-5+cross_line+mov_right)
    .attr("y1", sec_h/2-cross_line)
    .attr("x2", width-circ-5-cross_line+mov_right)
    .attr("y2", sec_h/2+cross_line)
    .attr("stroke","red")
    .attr("stroke-width","2")
    .attr("stroke-opacity", cross_op);  

    svg.append('g').append("circle")
    .attr("id","exit-"+idx.toString() + "-" + slider_idx.toString())
    .attr("data-filteridx", idx)
    .attr("data-slideridx", slider_idx)
    .attr("data-featureidx", aFeature.id)
    .attr("r", circ)
    .attr("cx", width-circ-5+mov_right)
    .attr("cy", sec_h/2)
    .attr("stroke","red")
    .attr("stroke-width","2")
    .attr("stroke-opacity", cross_op)
    .attr("fill-opacity", 0.1)
    .attr("fill","pink")
    .on('click', function(d) {
        // OSCAR: This is the index that needs to be removed from filter list
        var filter_idx_to_rm =  d3.select(this).attr("data-filteridx");
        var slider_idx_to_rm =  d3.select(this).attr("data-slideridx");
        var feature_idx_to_rm =  d3.select(this).attr("data-featureidx");
        console.log("TO REMOVE", filter_idx_to_rm, slider_idx_to_rm, feature_idx_to_rm);
        remove_filter_range(filter_idx_to_rm, slider_idx_to_rm, feature_idx_to_rm);

    });

    
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

	   	var sel = d3.select("#curve");
	   	sel.attr('fill',"url(#grad)");

	}



}


// feature_selector(aFeature, "body")