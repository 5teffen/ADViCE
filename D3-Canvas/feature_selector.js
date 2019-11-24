

var density = [
 7.22194656e-06, 7.92410476e-06, 8.69119458e-06, 9.52888511e-06,
 1.04433080e-05, 1.14410924e-05, 1.25294017e-05, 1.37159733e-05,
 1.50091612e-05, 1.64179803e-05, 1.79521549e-05, 1.96221691e-05,
 2.14393219e-05, 2.34157843e-05, 2.55646608e-05, 2.79000543e-05,
 3.04371360e-05, 3.31922176e-05, 3.61828302e-05, 3.94278058e-05,
 4.29473651e-05, 4.67632096e-05, 5.08986192e-05, 5.53785557e-05,
 6.02297712e-05, 6.54809241e-05, 7.11626997e-05, 7.73079386e-05,
 8.39517715e-05, 9.11317613e-05, 9.88880524e-05, 1.07263528e-04,
 1.16303975e-04, 1.26058258e-04, 1.36578500e-04, 1.47920276e-04,
 1.60142810e-04, 1.73309185e-04, 1.87486565e-04, 2.02746421e-04,
 2.19164773e-04, 2.36822438e-04, 2.55805293e-04, 2.76204548e-04,
 2.98117025e-04, 3.21645462e-04, 3.46898810e-04, 3.73992560e-04,
 4.03049071e-04, 4.34197918e-04, 4.67576243e-04, 5.03329131e-04,
 7.45191908e-03, 7.89545995e-03, 8.36226448e-03, 8.85334915e-03,
 9.36976248e-03, 9.91258536e-03, 1.04829313e-02, 1.10819465e-02,
 1.17108104e-02, 1.23707353e-02, 1.30629666e-02, 1.37887829e-02,
 1.45494961e-02, 1.53464506e-02, 1.61810240e-02, 1.70546260e-02,
 1.79686987e-02, 1.89247159e-02, 1.99241826e-02, 2.09686346e-02,
 2.20596376e-02, 2.31987869e-02, 2.43877059e-02, 2.56280459e-02,
 2.69214845e-02, 2.82697251e-02, 2.96744950e-02, 3.11375447e-02,
 3.26606463e-02, 3.42455918e-02, 3.58941918e-02, 3.76082737e-02,
 3.93896797e-02, 4.12402652e-02, 4.31618965e-02, 4.51564488e-02,
 4.72258041e-02, 4.93718486e-02, 5.15964705e-02, 5.39015571e-02,
 5.62889927e-02, 5.87606555e-02, 6.13184146e-02, 6.39641278e-02,
 6.66996375e-02, 6.95267687e-02, 7.24473249e-02, 7.54630855e-02,
 7.85758022e-02, 8.17871954e-02, 8.50989510e-02, 8.85127168e-02,
 9.20300989e-02, 9.56526580e-02, 9.93819058e-02, 1.03219301e-01,
 1.07166247e-01, 1.11224086e-01, 1.15394096e-01, 1.19677488e-01,
 1.24075402e-01, 1.28588901e-01, 1.33218972e-01, 1.37966517e-01,
 1.42832352e-01, 1.47817206e-01, 1.52921711e-01, 1.58146406e-01,
 1.63491728e-01, 1.68958011e-01, 1.74545483e-01, 1.80254264e-01,
 1.86084359e-01, 1.92035661e-01, 1.98107944e-01, 2.04300861e-01,
 2.10613947e-01, 2.17046607e-01, 2.23598124e-01, 2.30267653e-01,
 2.37054216e-01, 2.43956709e-01, 2.50973894e-01, 2.58104399e-01,
 2.65346722e-01, 2.72699225e-01, 2.80160137e-01, 2.87727555e-01,
 2.95399442e-01, 3.03173627e-01, 3.11047810e-01, 3.19019560e-01,
 3.27086317e-01, 3.35245394e-01, 3.43493979e-01, 3.51829137e-01,
 3.60247814e-01, 3.68746839e-01, 3.77322925e-01, 3.85972675e-01,
 3.94692586e-01, 4.03479051e-01, 4.12328363e-01, 4.21236721e-01,
 4.30200235e-01, 4.39214928e-01, 4.48276743e-01, 4.57381548e-01,
 4.66525142e-01, 4.75703259e-01, 4.84911575e-01, 4.94145715e-01,
 5.03401256e-01, 5.12673735e-01, 5.21958656e-01, 5.31251494e-01,
 5.40547705e-01, 5.49842729e-01, 5.59131998e-01, 5.68410944e-01,
 5.77675001e-01, 5.86919618e-01, 5.96140261e-01, 6.05332419e-01,
 6.14491613e-01, 6.23613403e-01, 6.32693389e-01, 6.41727223e-01,
 6.50710611e-01, 6.59639321e-01, 6.68509186e-01, 6.77316114e-01,
 6.86056087e-01, 6.94725169e-01, 7.03319514e-01, 7.11835364e-01,
 7.20269056e-01, 7.28617028e-01, 7.36875819e-01, 7.45042074e-01,
 7.53112548e-01, 7.61084105e-01, 7.68953724e-01, 7.76718499e-01,
 7.84375640e-01, 7.91922477e-01, 7.99356458e-01, 8.06675150e-01,
 8.13876239e-01, 8.20957532e-01, 8.27916955e-01, 8.34752549e-01,
 7.75851917e-01, 7.67605575e-01, 7.59251997e-01, 7.50795584e-01,
 7.42240879e-01, 7.33592562e-01, 7.24855450e-01, 7.16034486e-01,
 7.07134738e-01, 6.98161391e-01, 6.89119743e-01, 6.80015193e-01,
 6.70853244e-01, 6.61639487e-01, 6.52379598e-01, 6.43079334e-01,
 6.33744517e-01, 6.24381035e-01, 6.14994831e-01, 6.05591893e-01,
 5.96178250e-01, 5.86759962e-01, 5.77343111e-01, 5.67933795e-01,
 5.58538120e-01, 5.49162191e-01, 5.39812102e-01, 5.30493932e-01,
 5.21213735e-01, 5.11977531e-01, 5.02791301e-01, 4.93660977e-01,
 4.84592436e-01, 4.75591491e-01, 4.66663885e-01, 4.57815284e-01,
 4.49051271e-01, 4.40377335e-01, 4.31798870e-01, 4.23321167e-01,
 4.14949404e-01, 4.06688646e-01, 3.98543838e-01, 3.90519794e-01,
 3.82621201e-01, 3.74852607e-01, 3.67218418e-01, 3.59722899e-01,
 3.52370159e-01, 3.45164159e-01, 3.38108701e-01, 3.31207425e-01,
 3.24463809e-01, 3.17881167e-01, 3.11462640e-01, 3.05211200e-01,
 2.99129646e-01, 2.93220601e-01, 2.87486512e-01, 2.81929648e-01,
 2.76552098e-01, 2.71355772e-01, 2.66342398e-01, 2.61513522e-01,
 2.56870512e-01, 2.52414549e-01, 2.48146636e-01, 2.44067594e-01,
 2.40178061e-01, 2.36478497e-01, 2.32969181e-01, 2.29650212e-01,
 2.26521515e-01, 2.23582835e-01, 2.20833742e-01, 2.18273635e-01,
 2.15901738e-01, 2.13717107e-01, 2.11718628e-01, 2.09905020e-01,
 2.08274840e-01, 2.06826479e-01, 2.05558171e-01, 2.04467992e-01,
 2.03553860e-01, 2.02813545e-01, 2.02244663e-01, 2.01844684e-01,0]

var oneFeature = {
	name: "Age",
	range:[0,10],
	den: density
}


var allFeatures = [oneFeature, oneFeature,oneFeature, oneFeature]

function feature_selector(allFeatures, place) {

	var section_h = 100,
		section_w = 200,
		section_sep = 20;

	var no_features = allFeatures.length,
		fineness = allFeatures[0].den.length;

    var good_col = "#d95f02",
        bad_col = "#1b9e77";

    var separator = 0.015;

    
    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 10, 
            right: 10, 
            bottom: 10, 
            left: 10
        },

        width = 500 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;


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
	    .rangeRound([section_h/4,0]);


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
        .attr("stroke","red");



    var x_shift = 0,
    	y_shift = section_h+section_sep;



   	for (ind=0 ; ind < no_features; ind++) {
	    // -- Section Boundary -- 
	    svg.append("g")
	        .append("rect")
	        .attr("class","bg")
	        .attr('x',0)
	        .attr('y',0)
	        .attr("height",section_h)
	        .attr("width",section_w)
	        .attr("fill",'none')
	        .attr("stroke-width",2)
	        .attr("stroke","red");

	    // -- Drawing Density -- 
	    svg.append('g').append('path').datum(allFeatures[ind].den)
	        .attr('d',line)
	        .attr('stroke',"blue")
	        .attr('fill',"black")
	        .attr('opacity',0.2);

	    svg = svg.append("g").attr("transform","translate(" + x_shift + ',' + y_shift +')');
    }

 
    
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


feature_selector(allFeatures, "body")