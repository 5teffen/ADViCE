var testData = [
{   
    id: 0,
    pred: 1,
    label: "TP",
    x_val: 1,
    y_val: 1
},
{
    id: 1,
    pred: 1,
    label: "TP",
    x_val: 3,
    y_val: 2
},
{
    id: 2,
    pred: 0,
    label: "TN",
    x_val: 7,
    y_val: 2
},
{
    id: 3,
    pred: 0,
    label: "TN",
    x_val: 4,
    y_val: 9
},
{
    id: 4,
    pred: 0,
    label: "TN",
    x_val: 5,
    y_val: 2
},
{
    id: 5,
    pred: 1,
    label: "FP",
    x_val: 8,
    y_val: 9
},
{
    id: 6,
    pred: 1,
    label: "FP",
    x_val: 10,
    y_val: 5
},
{
    id: 7,
    pred: 0,
    label: "FN",
    x_val: 2,
    y_val: 3
},
{
    id: 8,
    pred: 0,
    label: "FN",
    x_val: 4,
    y_val: 6
},
{
    id: 9,
    pred: 1,
    label: "TP",
    x_val: 9,
    y_val: 4
},
{
    id: 10,
    pred: 0,
    label: "TN",
    x_val: 1,
    y_val: 3
},
{
    id: 11,
    pred: 1,
    label: "FP",
    x_val: 3,
    y_val: 1
},
{
    id: 12,
    pred: 0,
    label: "FN",
    x_val: 2,
    y_val: 2
},
{
    id: 13,
    pred: 0,
    label: "FN",
    x_val: 4,
    y_val: 8
},
{
    id: 14,
    pred: 1,
    label: "FP",
    x_val: 7,
    y_val: 7
}];


var mask = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];





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

    var good_col = "#d95f02",
        bad_col = "#1b9e77";

    var the_colour = "";
    var opp_colour = "";
    
    var separator = 0.015;

    
    // -- Establishing margins and canvas bounds -- 
    var margin = {
            top: 20, 
            right: 20, 
            bottom: 20, 
            left: 20
        },
        width = 350 - margin.right - margin.left,
        height = 350 - margin.top - margin.bottom;

    var padding_top = 0.1,
        padding_bottom = 0.1;

    
    // -- Adding scales based on canvas -- 
    var xScale = d3.scaleLinear()
            .domain([0, 10])
            .rangeRound([0, width]),
        yScale = d3.scaleLinear()
            .domain([0, 10])
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
        .attr("cy",function(d){return yScale(d.y_val);})\
        .attr("fill",function(d){return "white"})
        .attr("stroke","red")
        .attr("r",10);

    var empty = true;
    // Lasso functions
        var lasso_start = function() {
            lasso.items()
                .attr("r",3.5) // reset size
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
                .attr("r",7);

            // Reset the style of the not selected dots
            lasso.notSelectedItems()
                .attr("r",function(){
                    if(!empty){
                        // empty = true;
                        return 0;
                    }
                    else{
                        return 3.5;
                    }
                })

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


draw_scatter(testData, 'body')