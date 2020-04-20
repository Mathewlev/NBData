function onYearChanged() {
    var select = d3.select('#scaleSelect').node();
    // Get current value of select element, save to global currentYear
    currentYear = select.options[select.selectedIndex].value
    // Update chart
    updateChart();
}

function updateChart(){
    console.log(dataset[currentYear]["Season"]);
    
    //data[0] is 2019-2020 season. data[40] is that last (1979-1980).

    //3s made
    made = dataset[currentYear]["3P"];

    //3s taken. 
    threeAttempts = dataset[currentYear]["3PA"];

    //total shots taken
    totalShots = dataset[currentYear]["FGA"];

    //total twos taken. 
    totalTwosTaken = totalShots - threeAttempts;

    // Ratio:  3s made / total shots taken
    threeToShotRatio = made / totalShots;

    //how many blocks should be made for threes made.
    ThreeMadeBlocks = Math.round(threeToShotRatio * 600) // 600 = total amount of blocks.

    //how many threes were attempted  to  how many total shots taken
    threeAttemptsToShotAttemptsRatio = threeAttempts / totalShots;

    //how many blocks should represent threes attempted. Here it doesn't account for overlap of threes made and three
    //take. Check line 103 to 110 for that logic
    threeAttemptsBlocks = Math.round(threeAttemptsToShotAttemptsRatio * 600);

    //How many left over that need to be colored (total twos attempted). This isn;t neccesary to calculate,
    //because in lines 103-110ish, we could just color what ever is left over grey, but this helps prove our
    //scale system works, becayse the total of all blocks equals 600.  
    totalFGBlocks = Math.round(totalTwosTaken / totalShots * 600);

    updateGraph();
}

function updateGraph(first) {
    if (!first) {
        d3.select("#grid").select("svg").remove();
    }
    var gridDat = gridData();

    var grid = d3.select("#grid")
        .append("svg")
        .attr("width", "620px")
        .attr("height", "1500px");

    var row = grid.selectAll(".row")
        .data(gridDat)
        .enter().append("g")
        .attr("class", "row");

    var circles = row.selectAll(".circle")
        .data(function(d) { return d; })
        .enter().append("circle")
        .attr("class", "square")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return 7; })
        //this is where the coloring gets done. threes made, then threes attempted, accounting for overlap,
        //then total shots taken
        .style("fill", function(d) {
            if (ThreeMadeBlocks > 0) {
                ThreeMadeBlocks--;
                threeAttemptsBlocks--;
                return "#44b32e";
            } else if (ThreeMadeBlocks == 0 && threeAttemptsBlocks > 0) {
                threeAttemptsBlocks--;
                return "#e3372b";
            } else if (ThreeMadeBlocks == 0 && threeAttemptsBlocks == 0 && totalFGBlocks > 0) {
                totalFGBlocks--;
                return "#575a5e"
            } else {
                return "fff";
            }
        })
        .style("stroke", "#000000");
}

function gridData() {
    console.log("test");
    var data = new Array();
    var xpos = 8; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 581;
    var width = 17; //size of cells
    var height = 20; //size of cells

    // iterate for rows	
    for (var column = 0; column < 30; column++) {
        data.push(new Array());

        // iterate for cells/columns inside rows
        for (var row = 0; row < 20; row++) {
            data[column].push({
                    x: xpos,
                    y: ypos,
                    width: width,
                    height: height,
                })
                // increment the x position. I.e. move it over by 50 (width variable)
            ypos -= height;
        }
        // reset the x position after a row is complete
        ypos = 581;
        // increment the y position for the next row. Move it down 50 (height variable)
        xpos += height;
    }
    return data;
}

d3.csv("NBData.csv", function(error, data) {
    if (error) throw error;

    //Creating global instance of the dataset for functions outside this
    dataset = data;

    // format the data
    data.forEach(function(d) {
        d["3P"] = +d["3P"];
        d["3PA"] = +d["3PA"];
    })
    //Global variable for the current year
    currentYear = 0

    updateChart(true);
    updateGraph();
});