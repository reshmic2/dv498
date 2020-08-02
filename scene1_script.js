async function init() {
	triggerButtonClick('male');
}

/*
 Handle the button click trigger opearation: 'male'/'female'
*/
async function triggerButtonClick(sex){
    document.getElementById("scene1").innerHTML = "";
    document.getElementById("scene2").innerHTML = "";
    document.getElementById("scene3").innerHTML = "";
    const sexYearAvgSuicideRaw = await d3.csv("https://raw.githubusercontent.com/reshmic2/dv498/master/sex-year-avg-suicide.csv");
    console.log(sex);
    var sexYearAvgSuicide = sexYearAvgSuicideRaw.filter(function(d){
        return (d.sex ===sex)
    })
    console.log(sexYearAvgSuicide);

    var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 800 - margin.left - margin.right,
    height =600 - margin.top - margin.bottom;

    var svg = d3.select("#scene1")
                    .append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                         .attr("transform","translate(" + margin.left + "," + margin.top + ")");


 // lets draw X axis of bar-chart
var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(sexYearAvgSuicide.map(function(d) { return d.year; }))
            .padding(0.2);
svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

// lets draw Add Y axis
var y = d3.scaleLinear()
            .domain([40000, 210000])
            .range([ height, 0]);

svg.append("g")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(y));

var tooltip = d3.select("#tooltip");

svg.selectAll("rect")
    .data(sexYearAvgSuicide)
    .enter()
    .append("rect") // Add a new rect for each new elements
    .attr("x", function(d) { return x(d.year); })
    .attr("width", x.bandwidth())
    .attr("y",height)
    .attr("height",0)
    .attr("fill", "lightblue")
    .on("click", function(d,i){
        console.log("click");
        document.getElementById("scene2").innerHTML = "";
        showDataByAge(d); 
        document.getElementById("scene3").innerHTML = "";
        })
    .on('mouseover', function(d,i) {
    	d3.select(this).style("fill", "lightgreen");
        tooltip.style("opacity", 1)
                .style("top",(d3.event.pageY)+"px")
                .style("left",(d3.event.pageX)+"px")
                .html(d.SUM_suicides_no + " no. of " + d.sex+ " committed suicide in year " + d.year);})
    .on("mouseout", function() { 
    	tooltip.style("opacity", 0)
    	d3.select(this).style("fill", "lightblue");
 
    	})
    .transition()
    .duration(500)
    .attr("y", function(d) { return y(d.SUM_suicides_no); })
    .attr("height", function(d) { return height - y(d.SUM_suicides_no); })

    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width/2)
    .attr("y", height + 40)
    .text("Year");

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -52)
    .attr("x", -150)
    .attr("dy", ".25em")
    .attr("transform", "rotate(-90)")
    .text("Total no. of suicide");

    const annotations = [
        {
            note: {
                title: "Suicide data for " + sex + " population.",
                label: "Click on a year to drill-down!",
                wrap: 200
              },
              x: 250,
              y: 5,
              color: "black"
            }]

    const makeAnnotations = d3.annotation()
      .type(d3.annotationLabel)
      .annotations(annotations)

    svg
      .append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations)
}