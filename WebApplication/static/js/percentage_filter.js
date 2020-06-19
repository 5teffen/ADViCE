
// var input = [30, 100]





function percentage_bar(elem, state, allHistoData, idx) {

	// var histoData = [0.2,0.3,0.5,0.6,0.9,0.9,0.8,0.3,0.2,0.2,0.5,0.5,0.6,0.1,0.3,0.7]

	histoData = allHistoData[0];
	posHisto = allHistoData[1];
	negHisto = allHistoData[2];

	//  --- Main Variables --- 
	var start = state[0],
		end = state[1],

		cur_low = state[0],    
		cur_high = state[1],


		out_low = state[0],		// OSCAR: these two are the outputs. Current bar points
		out_high = state[1];

    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 10, 
            right: 10, 
            bottom: 10, 
            left: 10
        },

        width = 230 - margin.right - margin.left,
        height = 70 - margin.top - margin.bottom;



    // --- Color variables ---
    var bad_col = "#d95f02",
        good_col = "#1b9e77";


    // --- Bar Parameters --- 
    var bar_w = 150,
    	bar_h = 15,
    	select_col = "#7570b3",
    	base_col = "#cac7eb";


 	// --- Slider Parameters --- 
    var slide_w = 20,
    	slide_h = 20,
    	slide_curv = 2,
    	slide_col = "lightgray",
    	fill_col = "lightgray",
    	fill_light = "#dcdef2";


    // --- Label Parameters --- 
    var lab_w = 30,
    	lab_h = 20,
    	lab_col = "white",
    	lab_border = "black";


    // --- Histogram Parameters --- 
    var histo_h = 40,
    	histo_col = "#7570b3",
    	no_bins = histoData.length,
    	histo_bin_w = bar_w/no_bins;


    // --- Scale Declaration --- 
    var yScale = d3.scaleLinear()
            .domain([0, height])
            .rangeRound([height, 0]);

	var xScale = d3.scaleLinear()
	    .domain([0, 100])
	    .rangeRound([0, bar_w]);

	var xScaleInv = d3.scaleLinear() // Reverse conversion
	    .domain([0, bar_w])
	    .rangeRound([0, 100]);

	var yHisto = d3.scaleLinear()
            .domain([0, 1])
            .rangeRound([0, histo_h]);


    var svg = d3.select(elem)
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .attr("class", "percentageBar")
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.top +')');

    // -- Drawing background rectangles -- 
    svg.append("g")
        .append("rect")
        .attr("class","bg")
        .attr('x',0)
        .attr('y',0)
        .attr("height",height)
        .attr("width",width)
        .attr("fill",'none');
        // .attr("stroke-width",2)
        // .attr("stroke","red");

	    

/* =================================================
   ====================== Main =====================
   =================================================*/

	var x_shift = 1.5*slide_w ,
		y_shift = height/2 - bar_h/2 + 10;

	svg = svg.append("g").attr("transform","translate(" + x_shift + ',' + y_shift +')');

	// === Bar Base === 
	svg.append("g")
        .append("rect")
        .attr("class","bg")
        .attr('x',0)
        .attr('y',0)
        .attr("height",bar_h)
        .attr("width",bar_w)
        .attr("fill",base_col)
        .attr("stroke-width",0)
        .attr("stroke","black");

   	svg.append("g")
        .append("rect")
        .attr("id","bar_selected"+idx.toString())
        .attr('x',xScale(start))
        .attr('y',0)
        .attr("height",bar_h)
        .attr("width",xScale(end-start))
        .attr("fill",select_col)
        .attr("stroke-width",0)
        .attr("stroke","black");


    // === Histogram Base === 
    for (n=0 ; n < no_bins; n++){
    	var inBin = histoData[n];
    	var posBin = posHisto[n];
    	var negBin = negHisto[n];

    	svg.append("g")
	        .append("rect")
	        .attr('x',(n)*histo_bin_w)
	        .attr('y',-yHisto(inBin)-1)
	        .attr("height",yHisto(inBin))
	        .attr("width",histo_bin_w-1)
	        .attr("fill",bad_col)
	        .attr("opacity",1)
	        .attr("stroke-width",0)
	        .attr("stroke","white");

    	svg.append("g")
	        .append("rect")
	        .attr('x',(n)*histo_bin_w)
	        .attr('y',-yHisto(posBin)-1)
	        .attr("height",yHisto(posBin))
	        .attr("width",histo_bin_w-1)
	        .attr("fill",good_col)
	        .attr("opacity",1)
	        .attr("stroke-width",0)
	        .attr("stroke","white");
    }





    // -- Drag functionality -- 
	// var min_x = -slide_w/2,
	var min_x = 0,
	max_x = bar_w;

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

	        // console.log("CALLING DRAG:", this);
	        
	    	var id = selection.attr("id");
	    	// console.log(cur_high);

	    	if (id == "slide1-"+idx.toString()){



	    		cur_low = xScaleInv(x); 

	    		if 	(cur_low > cur_high){
	    			x = xScale(cur_high)
	    			cur_low = cur_high; 
	    		}   		

	    		d3.select("#bar_selected"+idx.toString())
	    			.attr("x", x)
	    			.attr("width", xScale(cur_high)-x);


	    		d3.select("#l-lab"+idx.toString()).attr('x',x-lab_shift);

	    		d3.select("#lt-lab"+idx.toString())
	    			.text(cur_low.toString())
	    			.attr('x',x+text_shift);

	    		selection.attr('x',x);
	    		
	    	}

	    	else if (id == "slide2-"+idx.toString()){
	    		cur_high = xScaleInv(x);

	    		if 	(cur_low > cur_high){
	    			x = xScale(cur_low)
	    			cur_high =	cur_low; 
	    		}   	
	    		
	    		d3.select("#bar_selected"+idx.toString())
	    			.attr("width", xScale(cur_high)-xScale(cur_low));


	    		d3.select("#r-lab"+idx.toString()).attr('x',x-lab_shift);

	    		d3.select("#rt-lab"+idx.toString())
		    		.text(cur_high.toString())
		    		.attr('x',x+text_shift);

		    	selection.attr('x',x);
	    	}

	    	// selection.attr("fill", "blue")
	    })
	    .on("end", function(){
			out_high = cur_high;
			out_low = cur_low;
			console.log("Low: " + out_low.toString() + " | High: " + out_high.toString());
			filter_set_idx = this.dataset.filteridx;
			pred_range[filter_set_idx]=[out_low,out_high];
    		makeMainBackendRequest();
    		console.log("LOW:",	out_low);
    		console.log("HIGH:", out_high);
    		// console.log(this);


		});




    // -- Slider section --
	svg.append("g")
	    .append("rect")
	    .attr("class","slider")
	    .attr("id", "slide1-"+idx.toString())
	    .attr("data-filteridx", idx.toString())
	    .attr('x',xScale(start))
	    .attr('y',-2.5)
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
	    .attr("id", "slide2-"+idx.toString())
	    .attr("data-filteridx", idx.toString())
	    .attr('x',xScale(end))
	    .attr('y',-2.5)
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
    var lab_shift = (lab_w - slide_h)/2
    var text_shift = (lab_w)/2 - lab_shift
	svg.append("g")
	    .append("rect")
	    // .attr("class","left-label")
	    .attr("id", "l-lab"+idx.toString())
	    .attr('x',xScale(start)-lab_shift)
	    .attr('y',-30)
	    .attr("height",lab_h)
	    .attr("width",lab_w)
	    .attr("fill",lab_col)
	    .attr("stroke-width",1)
	    .attr("stroke",lab_border)
	    .attr("stroke-opacity",0.8)
		.call(drag);


	svg.append("g")
	    .append("rect")
	    .attr("class","right-label")
	    .attr("id", "r-lab"+idx.toString())
	    .attr('x',xScale(end)-lab_shift)
	    .attr('y',-30)
	    .attr("height",lab_h)
	    .attr("width",lab_w)
	    .attr("fill",lab_col)
	    .attr("stroke-width",1)
	    .attr("stroke",lab_border)
	    .attr("stroke-opacity",0.8)
		.call(drag);


	svg.append("g")
		.append('text')
		.text(start.toString())
		.attr("id", "lt-lab"+idx.toString())
		.attr('x',xScale(start)+text_shift)
		.attr('y',-16)
		.attr("font-family",'"Open Sans", sans-serif')
		.attr("font-size", '11px')
		.attr("font-weight", 'bold')
		.attr("fill",'black')
		.attr("text-anchor",'middle');

	svg.append("g")
		.append('text')
		.text(end.toString())
		.attr("id", "rt-lab"+idx.toString())
		.attr('x',xScale(end)+text_shift)
		.attr('y',-16)
		.attr("font-family",'"Open Sans", sans-serif')
		.attr("font-size", '11px')
		.attr("font-weight", 'bold')
		.attr("fill",'black')
		.attr("text-anchor",'middle');

}


