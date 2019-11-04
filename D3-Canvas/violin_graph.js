

var oneGraph = [
{
    bin: "1",
    left: 0.5,
    right: 0.1,
    up: 1,
    down: 0
},
{
    bin: "2",
    left: 0.3,
    right: 0.3,
    up: 1,
    down: 0
},
{
    bin: "3",
    left: 0.1,
    right: 0.5,
    up: 1,
    down: 0
},
{
    bin: "4",
    left: 0.7,
    right: 0.7,
    up: 1,
    down: 0
},
{
    bin: "5",
    left: 0.8,
    right: 0.9,
    up: 1,
    down: 0
},
{
    bin: "6",
    left: 0.5,
    right: 0.1,
    up: 1,
    down: 0
},
{
    bin: "7",
    left: 0.3,
    right: 0.3,
    up: 1,
    down: 0
},
{
    bin: "8",
    left: 0.1,
    right: 0.5,
    up: 1,
    down: 0
},
{
    bin: "9",
    left: 0.7,
    right: 0.7,
    up: 1,
    down: 0
},
{
    bin: "10",
    left: 0.8,
    right: 0.9,
    up: 1,
    down: 0
},
{
    bin: "11",
    left: 0.5,
    right: 0.1,
    up: 1,
    down: 0
},
{
    bin: "12",
    left: 0.3,
    right: 0.3,
    up: 1,
    down: 0
},
{
    bin: "13",
    left: 0.1,
    right: 0.5,
    up: 1,
    down: 0
},
{
    bin: "14",
    left: 0.7,
    right: 0.7,
    up: 1,
    down: 0
},
{
    bin: "15",
    left: 0.8,
    right: 0.9,
    up: 1,
    down: 0
},
{
    bin: "16",
    left: 0.6,
    right: 0.2,
    up: 1,
    down: 0
}];

// var allData = [oneGraph, oneGraph, oneGraph,
//         oneGraph, oneGraph, oneGraph, oneGraph, oneGraph, oneGraph, 
//         oneGraph, oneGraph, oneGraph, oneGraph, oneGraph, oneGraph]
var allData = [oneGraph, oneGraph, oneGraph,
        oneGraph, oneGraph, oneGraph, oneGraph, oneGraph]


function play_violin(allData,leftList,rightList,leftMid,rightMid,place){

    var separator = 0.015;

    var buffer = 25;

    var margin = {
        top: 10, 
        right: 20, 
        bottom: 20, 
        left: 20
    },

        width = 50, 
        height = 200,
        full_width = 450 - margin.right - margin.left, 
        full_height = 800 - margin.top - margin.bottom;


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

    // -- Drawing density bars --

    var top_y = 0;


    for (ind=0 ; ind < allData.length; ind++) {
        data = allData[ind]

        var orig_svg = svg;

        // -- Drawing left side -- 
        svg.append('g').selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","den_bars")
        .attr('y',function(d) {return yScale(d.bin);})
        .attr('x',function(d) {return xScaleLeft(d.left);})
        .attr("height",yScale.bandwidth())
        .attr("width",function(d) {return xScaleLeft(0)-xScaleLeft(d.left);})
        .style("opacity",function(d){
            console.log(yScale(d.down))
            if (yScale(d.bin) >= 0 && yScale(d.bin) <= height){
                return 0.5;
            }
            else{
                return 0;
            }
        })
        .style("fill","#7570b3");

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


        // -- Drawing dividing middle line -- 
        svg.append("line")
            .attr("class","middle_line")
            .attr("x1",0)
            .attr('y1',-buffer/4)
            .attr("y2",height+buffer/4)
            .attr("x2",0)
            .style("stroke","black")
            .style("stroke-width",2);  


        function draw_density_boxed(testData,data) {
            console.log("Getting Called");
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


        // -- Sliders to modify density bars -- 
        const slider_height = 8,
        x_div = 6,
        slider_col = '#b3c1d6'
        top_y = 0,
        bot_y = height-slider_height;


        var drag = d3.drag()
            .on('drag', function() {
                var event, new_x, new_y;

                event = d3.event;  
                new_x = event.x + event.dx;  // D3 itself records the changes
                new_y = event.y + event.dy;

                if (new_y < 0){ y = 0; }
                else if (new_y > height-slider_height) {y = height-slider_height;}
                else {
                    var hold = Math.round(new_y / yScale.bandwidth());

                    new_y = hold * yScale.bandwidth();

                    y = new_y;}

                d3.select(this).attr('y',y);

                top_y = y;
            });
        
        top = orig_svg.append('g')
        .append("rect")
        .attr("class","bg_den_bars")
        .attr('y',0)
        .attr('x',width/x_div)
        .attr('rx',3)
        .attr("height",slider_height)
        .attr("width",width-(2*width/x_div))
        .attr("opacity",1)
        .attr("fill",slider_col)
        .attr("stroke",'black')
        .attr("stroke-width",1)
        .call(drag);


        bot = orig_svg.append('g')
        .append("rect")
        .on('click',function(){d3.select(this).attr('opacity',0)})
        .attr("class","bg_den_bars")
        .attr('y',bot_y)
        .attr('x',width/x_div)
        .attr('rx',3)
        .attr("height",slider_height)
        .attr("width",width-(2*width/x_div))
        .attr("fill",slider_col)
        .attr("stroke",'black')
        .attr("stroke-width",1)
        .call(drag);


        // -- Centre the image -- 
        svg = svg.append("g")
                .attr("transform","translate(" + (xScaleRight(1)) + ',0)');


        xShift += 2*xScaleRight(1)
        console.log(xShift)
        if (xShift+width > full_width){
            yShift += height+buffer;
            console.log("IM HEREE")
            svg = svg.append("g")
                .attr("transform","translate("+ (-xShift)+ "," + yShift +')');
            xShift = 0
        }

    }




}




play_violin(allData, 'body')




// function draw_graph(testData, densityData, result){

//     var good_col = "#1b9e77",
//         bad_col = "#d95f02";

//     var the_colour = "";
//     var opp_colour = "";
    
//     var separator = 0.015;
    
//     if (result) {
//         opp_colour = good_col;
//         the_colour = bad_col;}
//     else {
//         opp_colour = bad_col
//         the_colour = good_col;}
    
//     // -- Establishing margins and canvas bounds -- 
//     var margin = {
//             top: 10, 
//             right: 60, 
//             bottom: 140, 
//             left: 70
//         },
//         width = 1000 - margin.right - margin.left,
//         height = 360 - margin.top - margin.bottom;

//     var padding_top = 0.2,
//         padding_bottom = 0.1;

//     var outlier = 1 + padding_top/2;
    
//     // -- Adding scales based on canvas -- 
//     var xScale = d3.scaleBand()
//             .domain(testData.map(function(d){return d.name;}))
//             .rangeRound([0, width])
//             .paddingInner(separator),
//         yScale = d3.scaleLinear()
//             .domain([0-padding_bottom, 1+padding_top])
//             .rangeRound([height, 0]);

//     var svg = d3.select(".d3-space")
//                 .append("svg")
//                 .attr("width",width + margin.right + margin.left)
//                 .attr("height",height + margin.top + margin.bottom)
//                 .attr("class", "main-svg")
//                 .append("g")
//                      .attr("transform","translate(" + margin.left + ',' + margin.top +')');

//     // -- Drawing background rectangles -- 
//     svg.selectAll("rect")
//         .data(testData)
//         .enter()
//         .append("rect")
//         .attr("class","bg_bar")
//         .attr('x',function(d) {return xScale(d.name);})
//         .attr('y',0)
//         .attr("height",function(d){return yScale(0-padding_bottom)})
//         .attr("width",xScale.bandwidth())
//         .style("opacity",function(d){
//             if(d.anch == 1){
//                 return 0.2;
//             }
//             else {return 1;}
//         })
//         .style("fill",function(d){
//             if(d.anch == 1){
//                 return opp_colour;
//             }
//             else {return "white";}
//         });
    
    
//     // -- Drawing dividing lines -- 
//     svg.selectAll("line")
//         .data(testData)
//         .enter()
//         .append("line")
//         .attr("class","split_lines")
//         .attr("x1",function(d) {return xScale(d.name)+xScale.bandwidth();})
//         .attr('y',0)
//         .attr("y2",function(d){return yScale(0-padding_bottom)})
//         .attr("x2",function(d) {return xScale(d.name)+xScale.bandwidth();})
//         .style("stroke",function(d,i){
//             if (i == testData.length-1) {return "None";}
//             else {return "#A9A9A9";}})
//         .style("stroke-width",0.7);
    
//     // -- Drawing surrounding box -- 
//         svg.append("rect")
//         .attr("class","border")
//         .attr('x',xScale(testData[0].name))
//         .attr('y',0)
//         .attr("height",function(d){return yScale(0-padding_bottom)})
//         .attr("width",(xScale.bandwidth()+1)*testData.length)
//         .attr("fill","None")
//         .attr("stroke","#A9A9A9")
//         .attr("stroke-width",1);

//     function draw_density_boxed(testData,data) {
//         console.log("Getting Called");
//         var overlap = yScale(0.1)-yScale(0.2);

//         for (ind=0 ; ind < data.length; ind++) {
//             var cur_obj = data[ind];
//             var array_len = Object.keys(cur_obj).length;

//             for (n=0 ; n < array_len; ++n){
//                 var key = Object.keys(cur_obj)[n];
//                 var value = cur_obj[key];
                
//                 svg.append("g")
//                 .append("rect")
//                 .attr('x',function() {return xScale(testData[ind].name)})
//                 .attr('y',function() {
//                         return yScale(+key)-overlap;})
//                 .attr("height",2*overlap)
//                 .attr("width",xScale.bandwidth())
//                 .style("stroke","black")
//                 .style("stroke-width",0.15)
//                 .style("opacity",function(){return value/9800})
//                 .style("fill","#7570b3");
//             }
                
//         }
//     }
    
//     function draw_density_gradient(testData,data) {
//         var defs = svg.append("defs");
//         var linearGradient = defs.append("linearGradient")
//            .attr("id", "lin_fill")
//            .attr("x1", "0%")
//            .attr("x2", "0%")
//            .attr("y1", "0%")
//            .attr("y2", "100%");
    
//         var colorScale = d3.scaleLinear()
//             .range(["#dfdeed","#7570b3", "#dfdeed"]);

//         linearGradient.selectAll("stop")
//             .data(colorScale.range() )
//             .enter().append("stop")
//             .attr("offset", function(d,i) { return i/(colorScale.range().length-1); })
//             .attr("stop-color", function(d) { return d; });

        
//         var overlap = yScale(0.1)-yScale(0.2);

//         for (ind=0 ; ind < data.length; ind++) {
//             var cur_obj = data[ind];
//             var array_len = Object.keys(cur_obj).length;

//             for (n=0 ; n < array_len; ++n){
//                 var key = Object.keys(cur_obj)[n];
//                 var value = cur_obj[key];
                
//                 svg.append("g")
//                 .append("rect")
//                 .attr('x',function() {return xScale(testData[ind].name)})
//                 .attr('y',function() {
//                         return yScale(+key)-overlap;})
//                 .attr("height",2*overlap)
//                 .attr("width",xScale.bandwidth())
//                 .style("opacity",function(){return value/7000})
//                 .style("fill","url(#lin_fill)");
//             }
                
//         }
//     }
    
    
//     // if (densityData != "no"){ draw_density_boxed(testData, densityData);}
//    if (densityData != "no"){ draw_density_gradient(testData, densityData);}
    
    
    
//     function draw_polygons(data) {
//         var full_string = "";
//         var mod = 2 // To fix the sizes for some cases
        
//         var bar_len = 0.085
//         var separation = 0.015

//         for(n=0 ; n < data.length; n++){
//             var d = data[n];
//             if (d.scl_val > 1) {new_val = 1;}
//             else {new_val = d.scl_val;}

//             if (d.scl_val > d.scl_change){

//                 var start_x = (xScale(d.name) + xScale.bandwidth()*0.35).toString();
//                 var mid_x = (xScale(d.name) + xScale.bandwidth()*0.5).toString();
//                 var end_x = (xScale(d.name) + xScale.bandwidth()*0.65).toString();

//                 var start_y = (yScale(new_val)).toString();
//                 var bottom_mid = (yScale(new_val)+5).toString();
//                 var end_mid = (yScale(new_val-bar_len)+5).toString();
//                 var end_y = (yScale(new_val-bar_len)).toString();

//                 full_string += "M"+start_x+","+start_y+"L"+end_x+","+start_y+"L"+end_x+","+end_y
//                 +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y;
//                 var shift = bar_len+separation;

//                 for(i=1 ; i < d.incr; i++){
//                             start_y = (yScale(new_val-shift)).toString(); 
//                             bottom_mid = (yScale(new_val-shift)+5).toString();
//                             end_mid = (yScale(new_val-bar_len-shift)+5).toString();
//                             end_y = (yScale(new_val-bar_len-shift)).toString();

//                         var next_pol = "M"+start_x+","+start_y+"L"+mid_x+","+bottom_mid+"L"+end_x+","+start_y+"L"+end_x+","+end_y
//                             +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y; 


//                         full_string += next_pol;
//                         shift += bar_len+separation;
//                     }
//                 }

//             else if (d.scl_val < d.scl_change){

//                 var start_x = (xScale(d.name) + xScale.bandwidth()*0.35).toString();
//                 var mid_x = (xScale(d.name) + xScale.bandwidth()*0.5).toString();
//                 var end_x = (xScale(d.name) + xScale.bandwidth()*0.65).toString();

//                 var start_y = (yScale(new_val)).toString();
//                 var bottom_mid = (yScale(new_val)-5).toString();
//                 var end_mid = (yScale(new_val+bar_len)-5).toString();
//                 var end_y = (yScale(new_val+bar_len)).toString();
        

//                 full_string += "M"+start_x+","+start_y+"L"+end_x+","+start_y+"L"+end_x+","+end_y
//                 +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y;

//                 var shift = bar_len+separation;

//                 for(i=1 ; i < d.incr; i++){
//                             start_y = (yScale(new_val+shift)).toString();
//                             bottom_mid = (yScale(new_val+shift)-5).toString();
//                             end_mid = (yScale(new_val+bar_len+shift)-5).toString();
//                             end_y = (yScale(new_val+bar_len+shift)).toString();

//                         var next_pol = "M"+start_x+","+start_y+"L"+mid_x+","+bottom_mid+"L"+end_x+","+start_y+"L"+end_x+","+end_y
//                             +"L"+mid_x+","+end_mid+"L"+start_x+","+end_y+"L"+start_x+","+start_y; 


//                         full_string += next_pol;
//                         shift += bar_len+separation;

//                     }
//                 }
//             }




//             return full_string;
//     }

//     svg.append("path")
//         .attr('d',draw_polygons(testData))
//         .attr("fill",the_colour)
//         .attr("stroke",the_colour)
//         .attr("stroke-linecap","round")
//         .attr("stroke-width",0);


//     svg.append("g")
//         .selectAll('text')
//         .data(testData)
//         .enter()
//         .append('text')
//         .text(function(d){return d.change;})
//         .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
//         .attr("y", function(d){
//             if (d.scl_change > d.scl_val){
//                 return yScale(d.scl_val+d.incr*0.10)-5;
//             }
//             else {
//                 if (d.scl_val > 1){return yScale(1-d.incr*0.10)+12;}
//                 else {return yScale(d.scl_val-d.incr*0.10)+12;}
//             }
//         })
//         .attr("font-family", 'sans-serif')
//         .attr("font-size", '12px')
//         .attr("font-weight", 'bold')
//         .attr("fill", function(d) {
//             if ((d.change != d.val)) {return the_colour;}
//             else {return "None"}})
//         .attr("text-anchor",'middle');



//     // -- Drawing and styling the AXIS
    
//     var xAxis = d3.axisBottom().scale(xScale);

//     svg.append("g")
//         .attr("class", "axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//         .selectAll("text")  
//             .style("fill","black")
//             .style("text-anchor", "end")
//             .attr("dy", "0.5em")
//             .attr("dx", "-0.5em")
//             .attr("transform","rotate(-40)");

//     // -- Drawing the initial level (blue) --
//     svg.append("g")
//         .selectAll("line")
//         .data(testData)
//         .enter()
//         .append("line")
//         .attr("class","line_lvl")
//         .attr("x1",function(d){return xScale(d.name) + xScale.bandwidth()*0.20})
//         .attr("x2",function(d){return xScale(d.name) + xScale.bandwidth()*0.80})
//         .attr("y1",function(d){
//             if (d.scl_val > 1){
//                 return yScale(outlier)-1}
//             else{
//                 return yScale(d.scl_val)
//             }})
//         .attr("y2",function(d){
//             if (d.scl_val > 1){
//                 return yScale(outlier)-1}
//             else{
//                 return yScale(d.scl_val)
//             }})
//         .attr("stroke", "black")
//         .attr("stroke-width", 2.2)
// //        .attr("stroke-linecap","round")
//         .attr("fill", "none");



//     // -- The text for initial level (blue) --
//     svg.append("g")
//         .selectAll('text')
//         .data(testData)
//         .enter()
//         .append('text')
//         .text(function(d){return d.val;})
//         .attr("x", function(d){return xScale(d.name) + xScale.bandwidth()/2})
//         .attr("y", function(d){
//             if (d.scl_val > 1){
//                 return yScale(outlier)-4;
//             }

//             if (d.scl_change >= d.scl_val){
//                 return yScale(d.scl_val)+12;
//             }

//             else {
//                 return yScale(d.scl_val)-3;
//             }
//         })
//         .attr("font-family", 'sans-serif')
//         .attr("font-size", '12px')
//         .attr("font-weight", 'bold')
//         .attr("fill",'black')
//         .attr("text-anchor",'middle');


//     function wrap(text, width) {
//       text.each(function() {
//         var text = d3.select(this),
//             words = text.text().split(/\s+/).reverse(),
//             word,
//             line = [],
//             lineNumber = 0,
//             lineHeight = 1.1, // ems
//             y = text.attr("y"),
//             dy = parseFloat(text.attr("dy")),
//             tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
//         while (word = words.pop()) {
//           line.push(word);
//           tspan.text(line.join(" "));
//           if (tspan.node().getComputedTextLength() > width) {
//             line.pop();
//             tspan.text(line.join(" "));
//             line = [word];
//             tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
//           }
//         }
//       });
//     }
// }
