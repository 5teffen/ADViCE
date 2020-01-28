
data_sum = {
    no_p: 500,
    tot_p: 1000,
    tp: 20,
    fp: 30,
    fn: 15,
    tn: 50
}

/*

Filter Legend:
0 - Model Accuracy Range
1 - Prediction Label
2 - Feature Range
*/

filter_data = [[1,{low: 10, high:50}], [2,{tp:1, fp:1 ,fn:0 ,tn:0}]];
// filter_data = [];


function draw_summary(data, filData, place) {

    // --- Colour parameters --- 
    var good_col = "#d95f02",
        bad_col = "#1b9e77",
        den_colour = "#7570b3",
        den_colour2 = "rgb(180, 177, 213)";

    var separator = 0.015;


    var stroke = "white",
        opp = 0.7,
        font_size = '12px';

    var box_w = 32,
        box_h = 25
        circ = 6,
        separation = 3,
        roundness = 3;


    // --- Filter register parameters --- 

    var sec_h = 25,
        sec_s = 3,
        filt_no = filData.length;



    
    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 5, 
            right: 5, 
            bottom: 5, 
            left: 5
        },

        width = 130 - margin.right - margin.left,
        height = 150 - margin.top - margin.bottom + (filt_no*(sec_s+sec_h));


    // --- Scales for Entire SVG --- 
    var yScale = d3.scaleLinear()
            .domain([height,0])
            .rangeRound([height, 0]);

    var xScale = d3.scaleLinear()
            .domain([0, width])
            .rangeRound([0, width]);

    var svg = d3.select(place)
            .append("svg")
            .attr("width",width + margin.right + margin.left)
            .attr("height",height + margin.top + margin.bottom)
            .attr("class", "main-svg")
            .append("g")
                 .attr("transform","translate(" + margin.left + ',' + margin.top +')');


    centre = width/2;             
    

    // --- Surrounding box ---
    svg.append("g")
        .append("rect")
        .attr("class","bg")
        .attr('x',0)
        .attr('y',0)
        .attr("height",height)
        .attr("width",width)
        .attr("fill",'none')
        .attr("stroke-width",2)
        .attr("stroke",den_colour2);


    svg.append('g').append("text")
        .text("Filter Summary")
        .attr("x",centre)
        .attr("y",20)
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '12px')
        .attr("font-weight", 800)
        .attr("fill","gray");



    // ==== Point Count ====
    svg = svg.append("g").attr("transform","translate(" + 0 + ','+ 15+')'); 


    svg.append('g').append("text")
        .text("Selected:\n " + data.no_p.toString() + '/'+ data.tot_p.toString())
        .attr("x",centre)
        .attr("y",30)
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '10px')
        .attr("font-weight", 800)
        .attr("fill","gray");

    
    // ==== Confusion Matrix ==== 
    svg = svg.append("g").attr("transform","translate(" + (centre-box_w-separation/2) + ','+ 50+')'); 
    

    svg.append('defs')
        .append('pattern')
        .attr('id', 'diagonalHatch')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 8)
        .attr('height', 8)
        .append('path')
        .attr('d', 'M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4')
        .attr('stroke', '#000000')
        .attr('stroke-width', 1.5);
    
    // ==== Positive Boxes ====  
    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no1")
        .attr("x", 0)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",good_col);
    
    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no2")
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",good_col);

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no2")
        .attr("x", box_w+separation)
        .attr("y", yScale(0))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("opacity", opp)
        .attr("fill", 'url(#diagonalHatch)');
    
    // ==== Negative Boxes ====  
    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no3")
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",bad_col);
    
    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no4")
        .attr("x", box_w+separation)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",stroke)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .style("fill",bad_col);

    svg.append('g').append("rect")
        .attr("class", "boxes")
        .attr("id","no3")
        .attr("x", 0)
        .attr("y", yScale(box_h+separation))
        .attr("width", box_w)
        .attr("height", box_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("opacity", opp)
        .attr("fill", 'url(#diagonalHatch)');

    // ==== Text ====  
    svg.append('g').append("text")
        .text(data.tp)
        .attr("x",box_w/2)
        .attr("y",yScale(box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", font_size)
        .attr("font-weight", 800)
        .attr("fill","white");
     
    svg.append('g').append("text")
        .text(data.fp)
        .attr("x",box_w + separation + box_w/2)
        .attr("y",yScale(box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", font_size)
        .attr("font-weight", 800)
        .attr("fill","white");

    svg.append('g').append("text")
        .text(data.fn)
        .attr("x",box_w/2)
        .attr("y",yScale(box_h+separation+box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", font_size)
        .attr("font-weight", 800)
        .attr("fill","white");
     
    svg.append('g').append("text")
        .text(data.tn)
        .attr("x",box_w + separation + box_w/2)
        .attr("y",yScale(box_h+separation+box_h-8))
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", font_size)
        .attr("font-weight", 800)
        .attr("fill","white");



    // === Filter register === 

    svg = svg.append("g").attr("transform","translate(" + -(centre-box_w-separation/2) + ','+ (box_h*2+separation*2 + 10)+')');

    for (i=0 ; i < filt_no; i++) {
        filter = filData[i];
        filter_type = filter[0];
        filter_object = filter[1];

        svg.append('g').append("rect")
        .attr("class", "tbd")
        .attr("id","tbd1")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", sec_h)
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("stroke",den_colour2)
        .attr("stroke-width","1")
        .attr("opacity", opp)
        .attr("fill","none");

        // === Dealing with each filter type ==


        if (filter_type == 1) { // Model Range 

            svg.append('g').append("text")
                .text("Range:\n " + filter_object.low.toString() + ' - '+ filter_object.high.toString())
                .attr("x",5)
                .attr("y",sec_h-8)
                .attr("text-anchor","right")
                .attr("font-family",'"Open Sans", sans-serif')
                .attr("font-size", '10px')
                .attr("font-weight", 800)
                .attr("fill","gray");
        }

        // tp:1, fp:1 ,fn:0 ,tn:0

        else if (filter_type == 2) { // Prediction Labels  
            svg.append('g').append("text")
                    .text(function(){
                        var full_s = "Labels: | ";
                        if (filter_object.tp == 1) full_s += "TP | "
                        if (filter_object.fp == 1) full_s += "FP | "
                        if (filter_object.fn == 1) full_s += "FN | "
                        if (filter_object.tn == 1) full_s += "TN | "
                        return full_s;
                    })
                    .attr("x",5)
                    .attr("y",sec_h-8)
                    .attr("text-anchor","right")
                    .attr("font-family",'"Open Sans", sans-serif')
                    .attr("font-size", '10px')
                    .attr("font-weight", 800)
                    .attr("fill","gray");
        }

        else if (filter_type = 3) { // Feature Range

        }



        // === Removal Button === 

        svg.append('g').append("circle")
        .attr("id","exit"+i.toString())
        .attr("r", circ)
        .attr("cx", width-circ-5)
        .attr("cy", sec_h/2)
        .attr("stroke","red")
        .attr("stroke-width","2")
        .attr("opacity", 0.5)
        .attr("fill","pink")
        .on('click', function(d) {
            var id = d3.select(this).attr("id"); 
            id = parseInt((id.substring(id.length - 1, id.length)),10);


            // --->>> THIS IS THE INDEX OF THE FILTER THAT NEED TO BE REMOVED <<<--- 
            console.log(id);



        });


        svg = svg.append("g").attr("transform","translate(0,"+ (sec_h)+')');




    }





}

draw_summary(data_sum, filter_data, "body")