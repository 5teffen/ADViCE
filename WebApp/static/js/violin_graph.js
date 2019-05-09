// var oneGraph = [
// {
//     bin: "1",
//     left: 0.5,
//     right: 0.1
// },
// {
//     bin: "2",
//     left: 0.3,
//     right: 0.3
// },
// {
//     bin: "3",
//     left: 0.1,
//     right: 0.5
// },
// {
//     bin: "4",
//     left: 0.7,
//     right: 0.7
// },
// {
//     bin: "5",
//     left: 0.8,
//     right: 0.9
// },
// {
//     bin: "6",
//     left: 0.5,
//     right: 0.1
// },
// {
//     bin: "7",
//     left: 0.3,
//     right: 0.3
// },
// {
//     bin: "8",
//     left: 0.1,
//     right: 0.5
// },
// {
//     bin: "9",
//     left: 0.7,
//     right: 0.7
// },
// {
//     bin: "10",
//     left: 0.8,
//     right: 0.9
// },
// {
//     bin: "11",
//     left: 0.5,
//     right: 0.1
// },
// {
//     bin: "12",
//     left: 0.3,
//     right: 0.3
// },
// {
//     bin: "13",
//     left: 0.1,
//     right: 0.5
// },
// {
//     bin: "14",
//     left: 0.7,
//     right: 0.7
// },
// {
//     bin: "15",
//     left: 0.8,
//     right: 0.9
// },
// {
//     bin: "16",
//     left: 0.6,
//     right: 0.2
// }];


// var leftie = [
// {
//     bin: "1",
//     count: 0.1
// },
// {
//     bin: "2",
//     count: 0.3
// },
// {
//     bin: "3",
//     count: 0.5
// },
// {
//     bin: "4",
//     count: 0.7
// },
// {
//     bin: "5",
//     count: 0.9
// },
// {
//     bin: "6",
//     count: 0.1
// },
// {
//     bin: "7",
//     count: 0.3
// },
// {
//     bin: "8",
//     count: 0.5
// },
// {
//     bin: "9",
//     count: 0.7
// },
// {
//     bin: "10",
//     count: 0.9
// },
// {
//     bin: "11",
//     count: 0.1
// },
// {
//     bin: "12",
//     count: 0.3
// },
// {
//     bin: "13",
//     count: 0.5
// },
// {
//     bin: "4",
//     count: 0.7
// },
// {
//     bin: "15",
//     count: 0.9
// },
// {
//     bin: "16",
//     count: 0.2
// }];


// // var pair1 = [leftie, rightie]
// // var pair2 = [leftie, rightie]
// var allData = [oneGraph, oneGraph, oneGraph,
//         oneGraph, oneGraph, oneGraph, oneGraph, oneGraph, oneGraph, 
//         oneGraph, oneGraph, oneGraph, oneGraph, oneGraph, oneGraph]


function play_violin(allData,place){

    var separator = 0.015;

    var buffer = 25;

    var margin = {
        top: 10, 
        right: 20, 
        bottom: 20, 
        left: 20
    },

        width = 50, 
        height = 100,
        full_width = 850 - margin.right - margin.left, 
        full_height = 320 - margin.top - margin.bottom;


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

    // --  --

    for (ind=0 ; ind < allData.length; ind++) {
        data = allData[ind]


        // -- Drawing left side -- 
        svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","den_bars")
        .attr('y',function(d) {return yScale(d.bin);})
        .attr('x',function(d) {return xScaleLeft(d.left);})
        .attr("height",yScale.bandwidth())
        .attr("width",function(d) {return xScaleLeft(0)-xScaleLeft(d.left);})
        .style("opacity",0.5)
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
            // console.log("Getting Called");
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

        // -- Centre the image -- 
        svg = svg.append("g")
                .attr("transform","translate(" + (xScaleRight(1)) + ',0)');

        xShift += 2*xScaleRight(1)
        // console.log(xShift)
        if (xShift+width > full_width){
            yShift += height+buffer;
            // console.log("IM HEREE")
            svg = svg.append("g")
                .attr("transform","translate("+ (-xShift)+ "," + yShift +')');
            xShift = 0
        }






    }


}

// play_violin(allData, 'body')
