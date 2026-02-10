// Color maps you can use: https://colorbrewer2.org/

// Set the dimensions and margins of the graph. You don't need to change this.
const margin = {top: 60, right: 30, bottom: 70, left: 60},
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
        // TODO: make this depend on the dropdown option 
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
        .domain([minY - y_padding, maxY + y_padding])
        .range([height, 0]);

    // init gridlines
    let xGrid = svg_scatter.append("g")
        .attr("class", "xGrid");

    let yGrid = svg_scatter.append("g")
        .attr("class", "yGrid");

    xGrid
        .attr("transform", `translate(0, ${height})`)
        .call(make_x_gridlines(xScale_scatter_init));

    xGrid.selectAll(".tick line")
        .attr("stroke", "#c0c0c0")
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
        .domain(["versicolor", "virginica", "setosa"])
        .range(["rgb(116, 204, 223)", "rgb(143, 216, 114)", "rgb(39, 84, 143)"])

    var keys = ["Versicolor", "Virginica", "Setosa"]
    var legendSpacing = 10; // space between items
    var circleRadius = 7;
    var circleLabelGap = 5; // space between circle and its label

    var cumulativeX = margin.left;

    keys.forEach((key) => {
        svg_scatter.append("circle")
            .attr("cx", cumulativeX + circleRadius)
            .attr("cy", -30)
            .attr("r", circleRadius)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("fill", color(key));

        var label = svg_scatter.append("text")
            .attr("x", cumulativeX + circleRadius * 2 + circleLabelGap)
            .attr("y", -30)
            .attr("font-size", "12px")
            .text(key)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle");
    
        // Get the width of the label text
        var labelWidth = label.node().getBBox().width;
        
        // Update cumulative X for next item
        cumulativeX += circleRadius * 2 + circleLabelGap + labelWidth + legendSpacing;
    })

    let legendTitle = svg_scatter
        .append("text")
        .attr("class", "legendTitle")
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .attr("x", margin.left * 3)
        .attr("y", -50)
        .text(`Iris Varieties`);

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
        .style("fill", (d) => color(d["variety"]))

    // TODO: add tooltip here
    var tooltip = d3.select("#my_scatterplot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("position", "absolute")
        .style("padding", "10px")

    dots.on("mouseover", (event, d) => {
        tooltip.style("opacity", 1);
    });

    dots.on("mousemove", (event, d) => {
        tooltip
        .html(`
            ${currentX}: ${d[currentX]}
            <br>
            ${currentY}: ${d[currentY]}
            <br>
            variety: ${d['variety']}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px")
    });

    dots.on("mouseleave", (event, d) => {
        tooltip
            .transition()
            .style("opacity", 0)
    })

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

        // redraw the dots
        dots.transition().duration(1000).attr("cy", (d) => yScale_scatter(d[option]));

        // update axis title and current y attribute
        currentY = option;
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

        // redraw the dots
        dots.transition().duration(1000).attr("cx", (d) => xScale_scatter(d[option]));

        // update axis title
        currentX = option;
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

    let processedData = [];
    let params = ['sepal.length', 'sepal.width', 'petal.length', 'petal.width'];
    const ATTR_DEFAULT = 'AVG';
    const RECT_WIDTH = 60, RECT_HEIGHT = 20;

    // initialize the x-axis which is fixed 
    let xScaleBar = d3.scaleBand().domain(params).range([0, width]).padding(0.4);
    svg_bar
        .append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScaleBar));
    svg_bar.select(".xAxis")
        .selectAll(".tick")
        .append("line")
        .attr("class", "gridline-x")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", -height + 10)
        .attr("stroke", "#c0c0c0")
        .attr("stroke-dasharray", "2,2");
    svg_bar
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", margin.left + width / 2)
        .attr("y", height + 36)
        .text("Attribute");

    let yScaleBar;
    svg_bar
        .append("g")
        .attr("class", "yAxis");
    svg_bar
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("x", -margin.top)
        .attr("y", -margin.left + 20)
        .text(`${ATTR_DEFAULT} value`);
    svg_bar
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "bar-title")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .attr("x", margin.left + width / 2)
        .text(`${ATTR_DEFAULT} Values Per Attribute`);

    let barColor;

    // add a listener to the radio group
    d3.select('#barChartButton')
        .on('change', (event) => {
            const newAttr = event.target.value;
            computeValByAttr(newAttr);
        })

    // update the y-axis & the bars when a new attribute is selected
    function computeValByAttr(attr) {
        let processedData = updateData(attr);
        createScaleAndAxis(attr, processedData);
    }

    function updateData(attr) {
        // given an attribute, compute the corresponding values from dataset & set up the y-axis domain and range
        processedData = [];
        switch (attr) {
            case 'AVG':
                for (const param of params) {
                    processedData.push({[param]: d3.mean(data, (d) => d[param])});
                }
                return processedData;
            case 'MAX':
                for (const param of params) {
                    processedData.push({[param]: d3.max(data, (d) => d[param])});
                }
                return processedData;
            case 'MIN':
                for (const param of params) {
                    processedData.push({[param]: d3.min(data, (d) => d[param])});
                }
                return processedData;
            default:
                console.error('Invalid param');
                return processedData;
        }
    }

    function createScaleAndAxis(attr, processedData) {
        console.log('inside createScaleAndAxis, data =', processedData);

        // compute the new y-axis domain and range 
        let max = Object.values(processedData[0])[0];
        let min = Object.values(processedData[0])[0];
        processedData.forEach((elem) => {
            max = Math.max(max, Object.values(elem)[0]);
            min = Math.min(min, Object.values(elem)[0]);
        })

        barColor = d3.scaleLinear().domain([min, max]).range(['#fee5d9','#cb181d'])
        createLegend(barColor, min, max);

        // the x axis does not need to be changed
        yScaleBar = d3.scaleLinear().domain([0, max + 0.5]).range([height, 0]);
        const yAxis = d3.axisLeft(yScaleBar).ticks(10);

        svg_bar.select(".yAxis")
            .transition()
            .duration(1000)
            .call(yAxis)
            .on('end', () => {
                // remove the old gridlines first if there are any
                svg_bar.selectAll(".gridline").remove(); 

                svg_bar.select(".yAxis")
                    .selectAll(".tick")
                    .filter(d => d !== 0)
                    .append("line")
                    .attr("class", "gridline")
                    .attr("x1", 0)
                    .attr("y1", 0)
                    .attr("x2", width)
                    .attr("y2", 0)
                    .attr("stroke", "#c0c0c0")  
                    .attr("stroke-dasharray", "2,2");
            })

        const bars = svg_bar.selectAll(".bar").data(processedData);
        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .merge(bars)
            .transition()
            .duration(1000)
            // extract the average value for each attribute
            .attr("x", (d) => xScaleBar(Object.keys(d)[0]))
            .attr("y", (d) => yScaleBar(Object.values(d)[0]))
            .attr("width", xScaleBar.bandwidth())
            .attr("height", (d) => height - yScaleBar(Object.values(d)[0]))
            .attr("fill", (d) => barColor(Object.values(d)[0]))
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        bars.exit()
            .transition()
            .duration(1000)
            .attr("height", 0)
            .attr("y", height)
            .remove();

        svg_bar.select('.y-label').text(`${attr} Value`);
        svg_bar.select('.bar-title').text(`${attr} Values Per Attribute`);

        const bar_labels = svg_bar.selectAll(".bar-label")
            .data(processedData);
        
        bar_labels.enter()
            .append("text")
            .attr("class", "bar-label")
            .merge(bar_labels)
            .transition()
            .duration(1000)
            .attr("x", (d) => xScaleBar(Object.keys(d)[0]) + xScaleBar.bandwidth() / 2)
            .attr("y", (d) => yScaleBar(Object.values(d)[0]) - 5) 
            .attr("text-anchor", "middle")
            .text((d) => Number(Object.values(d)[0]).toFixed(1))
            .attr("fill", "black") 
            .style("font-size", "12px");
    }

    function createLegend(barColor, min, max) {
        svg_bar.selectAll(".bar-legend").remove();
        let legendVals = [min, min + (max-min)/3, min + 2*(max-min)/3, max];
        const legend = svg_bar.append("g")
                        .attr("class", "bar-legend")
                        .attr("transform", `translate(${margin.left * 2}, ${margin.top - 100})`)
        legend.selectAll("rect")
                .data(legendVals)
                .enter()
                .append("rect")
                .attr("x", (d, i) => i * RECT_WIDTH)
                .attr("y", 0)
                .attr("width", RECT_WIDTH)
                .attr("height", RECT_HEIGHT)
                .attr("fill", (d) => barColor(d));
        // left text
        legend.append("text")
                .attr("x", -40)
                .attr("y", RECT_HEIGHT - 5)
                .text(min.toFixed(1)); 
        // right text
        legend.append("text")
                .attr("x", 4 * RECT_WIDTH + 35)
                .attr("y", RECT_HEIGHT - 5)
                .attr("text-anchor", "end")
                .text(max.toFixed(1));
        legend.append("text")
                .attr("x", 2 * RECT_WIDTH)  // center it
                .attr("y", -5)
                .attr("text-anchor", "middle")
                .text("Range of Values");
    }

    computeValByAttr('AVG');

    // TODO: Append bars to the bar chart with the appropriately scaled height
    // Hint: the data being used for the bar chart is the computed average values! Not the entire dataset
    // TODO: Color the bars using the sequential color map
    // Hint: .attr("fill") should fill the bars using a function, and that function can be from the above bar_color function we created
    // TODO: Draw gridlines for both charts - done elsewhere
});
