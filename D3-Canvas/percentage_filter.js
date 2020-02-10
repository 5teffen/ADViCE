
var input = [0, 100]

function precentage_bar(data, place) {

	//  --- Main Variables --- 

	var start = data[0],
		end = data[1],

		out_low = data[0],     // OSCAR: these two are the outputs. Current bar points
		out_high = data[1];


    
    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 10, 
            right: 10, 
            bottom: 10, 
            left: 10
        },

        width = 220 - margin.right - margin.left,
        height = 100 - margin.top - margin.bottom;



    // --- Bar Parameters --- 
    var bar_w = 150,
    	bar_h = 15,
    	select_col = "teal",
    	base_col = "lightgray";



 	// --- Slider Parameters --- 
    var slide_w = 20,
    	slide_h = 20,
    	slide_curv = 1,
    	slide_col = "lightgray",
    	fill_col = "lightgray",
    	fill_light = "#dcdef2";





	// var section_h = 50,
	// 	section_w = 150,
	// 	section_sep = 10;


 //    var good_col = "#d95f02",
 //        bad_col = "#1b9e77";

 //    var separator = 0.015;

 //    // --- Slider Parameters --- 

 //    var slide_w = 5,
 //    	slide_h = 20,
 //    	slide_curv = 1,
 //    	slide_col = "#666666",
 //    	fill_col = "#7570b3"
 //    	fill_light = "#dcdef2";




    // --- Scale Declaration --- 
    var yScale = d3.scaleLinear()
            .domain([0, height])
            .rangeRound([height, 0]);

	var xScale = d3.scaleLinear()
	    .domain([0, 100])
	    .rangeRound([0, bar_w]);


    var svg = d3.select(place)
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .attr("class", "main-svg")
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
        .attr("fill",'none')
        .attr("stroke-width",2)
        .attr("stroke","red");

	    

/* =================================================
   ====================== Main =====================
   =================================================*/

	var x_shift = slide_w,
		y_shift = height/2 - bar_h/2;

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
        .attr("id","bar_selected")
        .attr('x',xScale(start))
        .attr('y',0)
        .attr("height",bar_h)
        .attr("width",xScale(end-start))
        .attr("fill",select_col)
        .attr("stroke-width",0)
        .attr("stroke","black");



    // -- Drag functionality -- 
	var min_x = -slide_w/2,
	max_x = bar_w-slide_w/2;

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


	    		d3.select("#bar_selected")
	    			.attr("x", x)
	    			.attr("width", xScale(out_high)-x);


	    		// var percentage = x/section_w;
	    		// m1 = Math.round(percentage*fineness);
	    		// m1 = Math.round(percentage*100);
	    		// density_curve(m1,m2);

	    		// out_min = start + Math.round(percentage*full_range); // OSCAR: min val output
	    	}

	    	else if (id == "slide2"){
	    		// var percentage = x/section_w;
	    		// // m2 = Math.round(percentage*fineness);
	    		// m2 = Math.round(percentage*100);
	    		// density_curve(m1,m2);

	    		// out_max = start + Math.round(percentage*full_range); // OSCAR: max val output
	    	}

	    	// selection.attr("fill", "blue")
	    });




    // -- Slider section --
	svg.append("g")
	    .append("rect")
	    .attr("class","slider")
	    .attr("id", "slide1")
	    .attr('x',xScale(start)-slide_w/2)
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
	    .attr("id", "slide2")
	    .attr('x',xScale(end)-slide_w/2)
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






	// // var start = aFeature.range[0],
	// 	 	// end = aFeature.range[1],
	// 	 	// full_range = end-start,
	// 	 	// m1 = 0,   // Ranges
	// 	 	// m2 = 100,


	// var start = aFeature.range[0],
	//  	end = aFeature.range[1],
	//  	full_range = end-start,
	//  	init_start = aFeature.current[0],
	//  	init_end = aFeature.current[1],
	//  	m1 = Math.round(100*init_start/full_range),   // Percentages for density
	//  	m2 = Math.round(100*init_end/full_range)
	//  	out_min = init_start,
	//  	out_max = init_end;


	// var start_arr = aFeature.den.slice();

	// // -- Section Boundary -- 
	// svg.append("g")
	//     .append("rect")
	//     .attr("class","bg")
	//     .attr('x',0)
	//     .attr('y',0)
	//     .attr("height",section_h)
	//     .attr("width",section_w+20)
	//     .attr("fill",'none')
	//     .attr("stroke-width",2)
	//     .attr("stroke","None");

	// // -- Center the Density -- 
	// svg = svg.append("g").attr("transform","translate(" + 5 + ',' + (section_h/2-section_h/6) +')');

	// // // -- Drawing Density -- 
	// // var cur_arr = start_arr.splice(100,100)
	// // cur_arr.push(0);

	// svg.append('g').append('path').datum(start_arr)
	// .attr('id',"curve")
	// .attr('d',line)
	// .attr('stroke',fill_col)
	// .attr('fill',fill_col)
	// .attr('opacity',1);


	// // svg.append('g').append('path').datum(cur_arr)
	// //     .attr('d',line)
	// //     .attr('stroke',"blue")
	// //     .attr('fill',"black")
	// //     .attr('opacity',0.2);

	// // -- Adding Ranges -- 
	// svg.append("g")
	// 		.append('text')
	// 	.text(start)
	// 	.attr("x", 0)
	// 	 	.attr("y", yDenScale(0)+12)
	// 	.attr("font-family",'"Open Sans", sans-serif')
	// 	.attr("font-size", '11px')
	// 	.attr("font-weight", 'bold')
	// 	.attr("fill",'black')
	// 	.attr("text-anchor",'left');

	// 	svg.append("g")
	// 		.append('text')
	// 	.text(end)
	// 	.attr("x", section_w-8)
	// 	 	.attr("y", yDenScale(0)+12)
	// 	.attr("font-family",'"Open Sans", sans-serif')
	// 	.attr("font-size", '11px')
	// 	.attr("font-weight", 'bold')
	// 	.attr("fill",'black')
	// 	.attr("text-anchor",'left');



	// // -- Define Drag Functionality -- 

	// x_div = 6,
	// slider_col = '#b3c1d6'
	// min_x = 0,
	// max_x = section_w - slide_w;


	// var drag = d3.drag()
	//     .on('drag', function() {
	//         var event, new_x, new_y;

	//         event = d3.event;  
	//         new_x = event.x + event.dx;  // D3 itself records the changes
	//         new_y = event.y + event.dy;

	//         if (new_x > max_x){ x = max_x; }
	//         else if (new_x < min_x) {x = min_x;}
	//         else {x = new_x;}

	//         var selection = d3.select(this)
	//         selection.attr('x',x);
	        
	//     	var id = selection.attr("id");


	//     	if (id == "slide1"){
	//     		var percentage = x/section_w;
	//     		// m1 = Math.round(percentage*fineness);
	//     		m1 = Math.round(percentage*100);
	//     		density_curve(m1,m2);

	//     		out_min = start + Math.round(percentage*full_range); // OSCAR: min val output
	//     	}

	//     	else if (id == "slide2"){
	//     		var percentage = x/section_w;
	//     		// m2 = Math.round(percentage*fineness);
	//     		m2 = Math.round(percentage*100);
	//     		density_curve(m1,m2);

	//     		out_max = start + Math.round(percentage*full_range); // OSCAR: max val output
	//     	}

	//     	// selection.attr("fill", "blue")
	    // });


	// // -- Slider section --
	// svg.append("g")
	//     .append("rect")
	//     .attr("class","slider")
	//     .attr("id", "slide1")
	//     .attr('x',xDenScale(Math.round(fineness*init_start/full_range)))
	//     .attr('y',0)
	//     .attr("height",slide_h)
	//     .attr("width",slide_w)
	//     .attr("rx",slide_curv)
	//     .attr("ry",slide_curv)
	//     .attr("fill",slide_col)
	//     .attr("stroke-width",1)
	//     .attr("stroke","black")
	//     .attr("stroke-opacity",0.8)
	// 	.call(drag);


	// svg.append("g")
	//     .append("rect")
	//     .attr("class","slider")
	//     .attr("id", "slide2")
	//     .attr('x',xDenScale(Math.round(fineness*init_end/full_range))-slide_w)
	//     .attr('y',0)
	//     .attr("height",slide_h)
	//     .attr("width",slide_w)
	//     .attr("rx",slide_curv)
	//     .attr("ry",slide_curv)
	//     .attr("fill",slide_col)
	//     .attr("stroke-width",1)
	//     .attr("stroke","black")
	//     .attr("stroke-opacity",0.8)
	// 	.call(drag);


	// // svg = svg.append("g").attr("transform","translate(" + x_shift + ',' + y_shift +')');

	// var grad = svg.append("defs")
	// 		.append("linearGradient")
	// 		.attr("id", "grad");



	// // -- Custom init -- 		
	// density_curve(m1,m2);


	// function density_curve(per1,per2) {

	// 	grad.remove();

	// 	grad = svg.append("defs")
	// 		.append("linearGradient")
	// 		.attr("id", "grad");
		
	// 	grad.append("stop").attr("offset", "0%").attr("stop-color", fill_light);
	// 	grad.append("stop").attr("offset", (per1-1).toString()+"%").attr("stop-color", fill_light);
	// 	grad.append("stop").attr("offset", (per1).toString()+"%").attr("stop-color", fill_col);
	// 	grad.append("stop").attr("offset", (per2).toString()+"%").attr("stop-color", fill_col);
	// 	grad.append("stop").attr("offset", (per2+1).toString()+"%").attr("stop-color", fill_light);
	// 	grad.append("stop").attr("offset", "100%").attr("stop-color", fill_light);
	   

	// 	// svg.append('g').append('path').datum(start_arr)
	// 	// 	.attr('id',"curve")
	//     //     .attr('d',line)
	//     //     .attr('stroke',"blue")
	//     //     .attr('fill',"url(#grad)")
	//     //     .attr('opacity',1);


	//    	var sel = d3.select("#curve");
	//    	sel.attr('fill',"url(#grad)");


	// }


	// // -- Add the feature name --
	// svg = svg.append("g").attr("transform","translate(" + 0 + ',' + 45 +')');

	// svg.append("g")
	// 	.append('text')
	// 	.text("Feature: " + aFeature.name)
	// 	.attr("x", 0)
	// 	.attr("y", 0)
	// 	.attr("font-family",'"Open Sans", sans-serif')
	// 	.attr("font-size", '12px')
	// 	.attr("fill",'black')
	// 	.attr("text-anchor",'left'); 




}


precentage_bar(input, "body")