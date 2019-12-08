
data_sum = {
    no_p: 500,
    tot_p: 1000,
	tp: 20,
    fp: 30,
    fn: 15,
    tn: 50
}


function draw_summary(data, place) {

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
        box_h = 25,
        separation = 3,
        roundness = 3;

    
    // --- Establishing margins and canvas bounds --- 
    var margin = {
            top: 5, 
            right: 5, 
            bottom: 5, 
            left: 5
        },

        width = 120 - margin.right - margin.left,
        height = 180 - margin.top - margin.bottom;


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
        .attr("y",30)
        .attr("text-anchor","middle")
        .attr("font-family",'"Open Sans", sans-serif')
        .attr("font-size", '12px')
        .attr("font-weight", 800)
        .attr("fill","gray");



    // ==== Point Count ====
    svg = svg.append("g").attr("transform","translate(" + 0 + ','+ 30+')'); 


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





}

draw_summary(data_sum,"body")