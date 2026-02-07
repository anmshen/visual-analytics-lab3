// Color maps you can use: https://colorbrewer2.org/

// Set the dimensions and margins of the graph. You don't need to change this.
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

/* SVG_SCATTER WILL REPRESENT THE CANVAS THAT YOUR SCATTERPLOT WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_scatter = d3
    .select("#my_scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background", "#ffffff")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

/* SVG_BAR WILL REPRESENT THE CANVAS THAT YOUR BARCHART WILL BE DRAWN ON */
// Append the svg object to the body of the page. You don't need to change this.
const svg_bar = d3
    .select("#my_barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("background", "#ffffff")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Read the iris dataset
d3.csv("/iris.csv", d3.autoType).then(function (data) {
    /****************************************   
     TODO: Complete the scatter plot tasks
    *****************************************/
    //find all numeric columns in data
    let attrs = Object.keys(data[0]).filter(
        (a) => typeof data[0][a] === "number",
    );

    d3.select("#xAxisDropdown")
        .on('change', (event) => {
            let currOption = event.target.value;
            draw_x_scatter(currOption);
            updateTitle();
        })
        .selectAll("option")
        .data(attrs)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);
    
    d3.select("#yAxisDropdown")
        .on('change', (event) => {
            let currOption = event.target.value;
            draw_y_scatter(currOption);
            updateTitle();
        })
        .selectAll("option")
        .data(attrs)
        .join("option")
        .attr("value", (d) => d)
        .text((d) => d);

    // TODO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // TODO: Implement the x-scale domain and range for the x-axis

    let currentX = "sepal.length";
    let currentY = "petal.length";

    const x_padding = 0.5;
    const minX = d3.min(data, (d) => d["sepal.length"]);
    const maxX = d3.max(data, (d) => d["sepal.length"]);

    let xScale_scatter_init = d3
        .scaleLinear()
        //TODO [PART 2]: make this depend on the dropdown option 
        .domain([minX - x_padding, maxX + x_padding])
        .range([0, width]);

    // TODO: Create a scale for the y-axis that maps the y axis domain to the range of the canvas height
    // Hint: You can create variables to represent the min and max of the y-axis values

    const y_padding = 0.5;
    const minY = d3.min(data, (d) => d["petal.length"]);
    const maxY = d3.max(data, (d) => d["petal.length"]);
    
    let yScale_scatter_init = d3
        .scaleLinear()
        // TODO: Fill these out
        // .domain()
        .domain([minY - y_padding, maxY + y_padding])
        .range([height, 0]);

    let xGrid = svg_scatter.append("g")
        .attr("class", "xGrid");

    let yGrid = svg_scatter.append("g")
        .attr("class", "yGrid");

    xGrid
        .attr("transform", `translate(0, ${height})`)
        .call(make_x_gridlines(xScale_scatter_init));

    xGrid.selectAll(".tick line")
        .attr("stroke", "#c5c5c5")
        .attr("stroke-dasharray", "2");

    xGrid.select(".domain").remove();

    yGrid
        .call(make_y_gridlines(yScale_scatter_init));

    yGrid.selectAll(".tick line")
        .attr("stroke", "#c5c5c5")
        .attr("stroke-dasharray", "2");

    yGrid.select(".domain").remove();

    // TODO: Append the scaled x-axis tick marks to the svg
    svg_scatter
        .append("g")
        .attr("class", "xAxis")
        .style("font", "11px monaco")
        .attr("transform", `translate(0, ${height})`)
        // it creates a bottom axis with the scaled x-axis tick marks that we defined above
        .call(d3.axisBottom(xScale_scatter_init));

    // TODO: Append the scaled y-axis tick marks to the svg
    svg_scatter
        .append("g")
        .attr("class", "yAxis")
        .style("font", "11px monaco")
        .call(d3.axisLeft(yScale_scatter_init));

    var color = d3.scaleOrdinal()
        .domain(["setosa", "versicolor", "virginica" ])
        .range([ "rgb(39, 84, 143)", "rgb(116, 204, 223)", "rgb(143, 216, 114)"])

    // TODO: Draw scatter plot dots here. Finish the rest of this
    let dots = svg_scatter
        .append("g")
        .selectAll(".dot")
        .data(data)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", (d) => xScale_scatter_init(d["sepal.length"]))
        .attr("cy", (d) => yScale_scatter_init(d["petal.length"]))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", (d) => color(d["variety"]));

    // TODO: add tooltip here
    dots.on("mouseover", (event, d) => {
        console.log("Moused over a dot. \nEvent:", event, "D:", d)
    });

    function draw_y_scatter (option) {
        const y_padding = 0.5;
        const minY = d3.min(data, (d) => d[option]);
        const maxY = d3.max(data, (d) => d[option]);

        // update scale
        let yScale_scatter = d3
            .scaleLinear()
            .domain([minY - y_padding, maxY + y_padding])
            .range([height, 0]);
        
        // update the x axis
        d3.select('.yAxis')
            .transition()
            .duration(1000)
            // .call(d3.axisLeft(yScale_scatter).tickSize(-width).tickPadding(10))
            .call(d3.axisLeft(yScale_scatter));

        // update the gridlines
        yGrid
            .transition()
            .duration(1000)
            .call(make_y_gridlines(yScale_scatter));
        yGrid.select(".domain").remove();

        yGrid.selectAll(".tick line")
            .attr("stroke", "#c5c5c5")
            .attr("stroke-dasharray", "2");

        // redraw the dots???
        dots.transition().duration(1000).attr("cy", (d) => yScale_scatter(d[option]));

        // update axis title
        yLabel.text(option);
    }

    function draw_x_scatter (option) {
        const x_padding = 0.5;
        const minX = d3.min(data, (d) => d[option]);
        const maxX = d3.max(data, (d) => d[option]);

        // update scale
        let xScale_scatter = d3
            .scaleLinear()
            .domain([minX - x_padding, maxX + x_padding])
            .range([0, width]);
        
        // update the x axis
        d3.select('.xAxis')
            .transition()
            .duration(1000)
            // .call(d3.axisBottom(xScale_scatter).tickSize(-height))
            .call(d3.axisBottom(xScale_scatter))

        // update the gridlines
        xGrid
            .transition()
            .duration(1000)
            .attr("transform", `translate(0, ${height})`)
            .call(make_x_gridlines(xScale_scatter));
        xGrid.select(".domain").remove();

        xGrid.selectAll(".tick line")
            .attr("stroke", "#c5c5c5")
            .attr("stroke-dasharray", "2");

        // redraw the dots???
        dots.transition().duration(1000).attr("cx", (d) => xScale_scatter(d[option]));

        // update axis title
        xLabel.text(option);
    }

    function updateTitle() {
        scatterTitle.text(`${currentY} vs. ${currentX}`);
    }

    function make_x_gridlines(scale) {
        return d3.axisBottom(scale)
            .tickSize(-height)
            .tickFormat("");
    }

    function make_y_gridlines(scale) {
        return d3.axisLeft(scale)
            .tickSize(-width)
            .tickFormat("");
    }

    // TODO: X axis label
    let xLabel = svg_scatter
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left + width / 2 + 120)
        .attr("y", height + 36)
        // TODO: Finish this...
        .text(currentX);

    // TODO: Y axis label
    let yLabel = svg_scatter
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.top - 3)
        .text(currentY);

    // TODO: Chart title
    let scatterTitle = svg_scatter
        .append("text")
        .attr("class", "scatterTitle")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .attr("x", margin.left + width / 3)
        .text(`${currentY} vs. ${currentX}`);

    /********************************************************************** 
     TODO: Complete the bar chart tasks

     Note: We provide starter code to compute the average values for each 
     attribute. However, feel free to implement this any way you'd like.
    ***********************************************************************/

    // Create an array that will hold all computed average values
    let average_data = [];
    // Compute all average values for each attribute, except 'variety'
    average_data.push({
        "sepal.length": d3.mean(data, (d) => d["sepal.length"]),
    });
    // TODO (optional): Add the remaining values to your array
    average_data.push({
        "sepal.width": d3.mean(data, (d) => d["sepal.width"]),
    });
    average_data.push({
        "petal.length": d3.mean(data, (d) => d["petal.length"]),
    });
    average_data.push({
        "petal.width": d3.mean(data, (d) => d["petal.width"]),
    });

    // Compute the maximum and minimum values from the average values to use for later
    let max_average = Object.values(average_data[0])[0];
    let min_average = Object.values(average_data[0])[0];
    average_data.forEach((element) => {
        max_average = Math.max(max_average, Object.values(element)[0]);
        min_average = Math.min(min_average, Object.values(element)[0]);
    });

    // TODO: Create a scale for the x-axis that maps the x axis domain to the range of the canvas width
    // Hint: the domain for X should be the attributes of the dataset
    // xDomain = ['sepal.length', ...]
    // then you can use 'xDomain' as input to .domain()
    let xDomain = ['sepal.length', 'sepal.width', 'petal.length', 'petal.width'];
    let xScale_bar = d3
        .scaleBand()
        .domain(xDomain)
        .range([0, width])
        .padding(0.4);

    // TODO: Finish this
    svg_bar
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .style("font", "11px monaco")
        .call(d3.axisBottom(xScale_bar));
    // ....

    // TODO: Create a scale for the y-axis that maps the y axis domain to the range of the canvas height
    let yScale_bar = d3
        .scaleLinear()
        // TODO: Fix this!
        .domain([0, max_average + 0.5])
        .range([height, 0])
        // .padding(0.4);

    // TODO: Finish this
    svg_bar.append("g").attr("class", "yAxis").call(d3.axisLeft(yScale_bar));
    // ....

    // TODO: You can create a variable that will serve as a map function for your sequential color map
    // Hint: Look at d3.scaleLinear()
    // let bar_color = d3.scaleLinear()...
    // Hint: What would the domain and range be?
    let bar_color = d3.scaleLinear()
        .domain([min_average, max_average])
        .range(["rgb(255, 233, 233)", "rgb(205, 0, 0)"])
        // .domain(d3.extent(average_data, function(d) { return d.value; }))
        // .range('white', 'red');

    // TODO: Append bars to the bar chart with the appropriately scaled height
    // Hint: the data being used for the bar chart is the computed average values! Not the entire dataset
    // TODO: Color the bars using the sequential color map
    // Hint: .attr("fill") should fill the bars using a function, and that function can be from the above bar_color function we created
    svg_bar
        .selectAll(".bar")
        // TODO: Fix these
        .data(average_data)
        .join("rect")
        .attr("x", (d) => xScale_bar(Object.keys(d)[0]))
        .attr("y", (d) => yScale_bar(Object.values(d)[0]))
        .attr("width", 40)
        .attr("height", (d) => height - yScale_bar(Object.values(d)[0]))
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("fill", (d) => bar_color(Object.values(d)[0]));

    // TODO: Append x-axis label
    svg_bar
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("x", margin.left + width / 2 + 60)
        .attr("y", height + 36)
        .text("Attribute");
    // TODO: Append y-axis label
    svg_bar
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.top - 3)
        .text("Average");
    // TODO: Append bar chart title
    svg_bar
        .append("text")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .attr("x", margin.left + width / 3)
        .text("Average Values Per Attribute");
    
    // TODO: Draw gridlines for both charts

    // Fix these (and maybe you need more...)
    // d3.selectAll("g.yAxis g.tick")
    //     .append("line")
    //     .attr("class", "gridline")
    //     .attr("x1", 0)
    //     .attr("y1", 0)
    //     .attr("x2", width)
    //     .attr("y2", 0)
    //     .attr("stroke", "#c5c5c5")
    //     .attr("stroke-dasharray","2");

    // d3.selectAll("g.xAxis g.tick")
    //     .append("line")
    //     .attr("class", "gridline")
    //     .attr("x1", 0)
    //     .attr("y1", 0)
    //     .attr("x2", 0)
    //     .attr("y2", -height)
    //     .attr("stroke", "#c5c5c5")
    //     .attr("stroke-dasharray","2");
});
