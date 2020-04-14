d3.csv("NBData.csv", function(error, data) {
	if (error) throw error;
  
	// format the data
	data.forEach(function(d) {
		d["3P"] = +d["3P"];
		d["3PA"] = +d["3PA"];
	})

	made = data[0]["3P"];
	attempts = data[0]["3PA"];
	console.log(data[0]["3P"]);
	// roundMax = d3.round(max) rounding doesn't work in d3 v4;




	function gridData() {
		var data = new Array();
		var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
		var ypos = 1;
		var width = 20;
		var height = 20;
		var click = 0;
		
		// iterate for rows	
		for (var row = 0; row < made; row++) {
			data.push( new Array() );
			
			// iterate for cells/columns inside rows
			for (var column = 0; column < attempts; column++) {
				data[row].push({
					x: xpos,
					y: ypos,
					width: width,
					height: height,
					click: click
				})
				// increment the x position. I.e. move it over by 50 (width variable)
				xpos += width;
			}
			// reset the x position after a row is complete
			xpos = 1;
			// increment the y position for the next row. Move it down 50 (height variable)
			ypos += height;	
		}
		return data;
	}
	
	var gridData = gridData();	
	// I like to log the data to the console for quick debugging
	console.log(gridData);
	
	var grid = d3.select("#grid")
		.append("svg")
		.attr("width","1000px")
		.attr("height","1000px");
		
	var row = grid.selectAll(".row")
		.data(gridData)
		.enter().append("g")
		.attr("class", "row");
		
	var column = row.selectAll(".square")
		.data(function(d) { return d; })
		.enter().append("rect")
		.attr("class","square")
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("width", function(d) { return d.width; })
		.attr("height", function(d) { return d.height; })
		.style("fill", "#fff")
		.style("stroke", "#222")
		.on('click', function(d) {
		   d.click ++;
		   if ((d.click)%4 == 0 ) { d3.select(this).style("fill","#fff"); }
		   if ((d.click)%4 == 1 ) { d3.select(this).style("fill","#2C93E8"); }
		   if ((d.click)%4 == 2 ) { d3.select(this).style("fill","#F56C4E"); }
		   if ((d.click)%4 == 3 ) { d3.select(this).style("fill","#838690"); }
		});







});


