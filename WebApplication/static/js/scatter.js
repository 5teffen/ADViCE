// var testData = [
// {   
//     id: 0,
//     x_val: 1,
//     y_val: 1
// },
// {
//     id: 1,
//     x_val: 3,
//     y_val: 2
// },
// {
//     id: 2,
//     x_val: 7,
//     y_val: 2
// },
// {
//     id: 3,
//     x_val: 4,
//     y_val: 9
// },
// {
//     id: 4,
//     x_val: 5,
//     y_val: 2
// },
// {
//     id: 5,
//     x_val: 8,
//     y_val: 9
// },
// {
//     id: 6,
//     x_val: 10,
//     y_val: 5
// },
// {
//     id: 7,
//     x_val: 2,
//     y_val: 3
// },
// {
//     id: 8,
//     x_val: 4,
//     y_val: 6
// },
// {
//     id: 9,
//     x_val: 9,
//     y_val: 4
// },
// {
//     id: 10,
//     x_val: 1,
//     y_val: 3
// },
// {
//     id: 11,
//     x_val: 3,
//     y_val: 1
// },
// {
//     id: 12,
//     x_val: 2,
//     y_val: 2
// },
// {
//     id: 13,
//     x_val: 4,
//     y_val: 8
// },
// {
//     id: 14,
//     x_val: 7,
//     y_val: 7
// }];


// var mask = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];





/* 
--- INPUT --- 
Dataset - Array of Objects with variables id (0 indexed), x_val, y_val
Optional: Mask - Array of 0/1s equal to number of points


--- OUTPUT ---
Mask - The array of 0/1s based on current selection

*/




function draw_scatter(data, place, mask = null) {

    if (mask == null){
        mask = new Array(data.length).fill(0);
    }

    console.log(mask.length);

    // makeViolinRequest(mask);
    // makeTableRequest(mask);


    var good_col = "#1b9e77",
        bad_col = "#d95f02";

    var the_colour = "";
    var opp_colour = "";
    
    var separator = 0.015;

    var radius = 3.5
    var s_radius = 5
    // -- Establishing margins and canvas bounds -- 
    var margin = {
            top: 20, 
            right: 20, 
            bottom: 20, 
            left: 20
        },
        width = 390 - margin.right - margin.left,
        height = 390 - margin.top - margin.bottom;

    var padding_top = 0.1,
        padding_bottom = 0.1;

    // -- Adding scales based on canvas -- 
    var xScale = d3.scaleLinear()
            .domain([0.0, 1.0])
            .rangeRound([0, width]),
        yScale = d3.scaleLinear()
            .domain([0.0, 1.0])
            .rangeRound([height, 0]);


    var svg = d3.select(place)
                .append("svg")
                .attr("width",width + margin.right + margin.left)
                .attr("height",height + margin.top + margin.bottom)
                .attr("class", "main-svg");
                // .append("g")
                //      .attr("transform","translate(" + margin.left + ',' + margin.top +')');


    var circles = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx",function(d){return xScale(d.x_val);})
        .attr("cy",function(d){return yScale(d.y_val);})
        .attr("fill",function(d){
            if (d.perc > 0.5) return good_col;
            else return bad_col;
            })
        .attr("stroke", function(d){
            if (d.category[0] == 'F') return "black";
            else return "white";
            })
        .attr("r",radius);

    var empty = true;
    // Lasso functions
        var lasso_start = function() {
            lasso.items()
                .attr("r",radius) // reset size
                .classed("not_possible",true)
                .classed("selected",false);
            
            mask = new Array(mask.length).fill(0);
            empty = true;
            console.log("Start");
        };

        var lasso_draw = function() {
        
            // Style the possible dots
            lasso.possibleItems()
                .classed("not_possible",false)
                .classed("possible",true);

            // Style the not possible dot
            lasso.notPossibleItems()
                .classed("not_possible",true)
                .classed("possible",false);
        };

        var lasso_end = function() {
            // Reset the color of all dots
            lasso.items()
                .classed("not_possible",false)
                .classed("possible",false);

            // Style the selected dots
            lasso.selectedItems()
                .classed("selected",function(d,i){
                    empty = false;
                    mask[d.id] = 1;
                    return true;})
                .attr("r",s_radius);

            // Reset the style of the not selected dots
            lasso.notSelectedItems()
                .attr("r",function(){
                    if(!empty){
                        // empty = true;
                        return 0;
                    }
                    else{
                        return radius;
                    }
                })

            // Send request for aggregation (violin) panel
            makeViolinRequest(mask);
            makeTableRequest(mask);

        };
        
        var lasso = d3.lasso()
            .closePathSelect(true)
            .closePathDistance(100)
            .items(circles)
            .targetArea(svg)
            .on("start",lasso_start)
            .on("draw",lasso_draw)
            .on("end",lasso_end);
        
    svg.call(lasso);
}


// draw_scatter(testData, 'body')