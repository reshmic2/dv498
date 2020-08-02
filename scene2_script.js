async function showDataByAge(data) {
	console.log("Data");
	console.log(data);

	const sexYearAgeAvgSuicide = await d3.csv("https://raw.githubusercontent.com/reshmic2/dv498/master/sex-year-age-avg-suicide.csv");

	var margin = {
			top: 50,
			right: 50,
			bottom: 70,
			left: 60
		},
		width = 800 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	var sexYearAgeAvgSuicideFiltered = sexYearAgeAvgSuicide.filter(function (d) {
		return (d.year === data.year && d.sex === data.sex);
	});

	var svgScene2 = d3.select("#scene2")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(60, 60)");


	var x = d3.scaleBand()
		.range([0, width])
		.domain(sexYearAgeAvgSuicide.map(function (d) {
			return d.age;
		}))
		.padding(0.2);
	svgScene2.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x))

	var y = d3.scaleLinear()
		.domain([d3.min(sexYearAgeAvgSuicideFiltered, function (d) {
			return d.SUM_suicides_no
		}) - 0.1, d3.max(sexYearAgeAvgSuicideFiltered, function (d) {
			return d.SUM_suicides_no
		})])
		.range([height, 0]);

	svgScene2.append("g")
		.call(d3.axisLeft(y));

	console.log(sexYearAgeAvgSuicideFiltered);

	var tooltip = d3.select("#tooltip");

	console.log("height=" + height);

	svgScene2.selectAll("rect")
		.data(sexYearAgeAvgSuicideFiltered)
		.enter()
		.append("rect") // Add a new rect for each new elements
		.attr("x", function (d) {
			return x(d.age);
		})
		.attr("width", x.bandwidth())
		.attr("y", height)
		.attr("height", 0)
		.attr("fill", "brown")
		.on("click", function (d, i) {
			console.log("click");
			document.getElementById("scene3").innerHTML = "";
			showDataByCountry(d);
		})
		.on('mouseover', function (d, i) {
			d3.select(this).style("fill", "lightgreen");
			tooltip.style("opacity", 1)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px")
				.html("Sex:" + d.sex + "<br/> Age group: " + d.age + "<br/> Suicide cases: " + d.SUM_suicides_no);
		})
		.on("mouseout", function () {
			d3.select(this).style("fill", "brown");
			tooltip.style("opacity", 0)
		})
		.transition()
		.duration(1000)
		.attr("y", function (d) {
			return y(d.SUM_suicides_no);
		})
		.attr("height", function (d) {
			return height - y(d.SUM_suicides_no);
		})


	svgScene2.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width / 2)
		.attr("y", height + 40)
		.text("Age group");

	svgScene2.append("text")
		.attr("class", "y label")
		.attr("text-anchor", "end")
		.attr("y", -50)
		.attr("x", 0)
		.attr("dy", ".25em")
		.attr("transform", "rotate(-90)")
		.text("Total no. of suicide");

	const annotations = [{
		note: {
			title: "Suicide cases for year: " + data.year + " and gender: " + data.sex,
			label: "Shows the suicide cases per age group. Click on any age group to show country wise distribution.",
			wrap: 200
		},
		x: 150,
		y: 50,
		color: "black"
	}]

        const makeAnnotations = d3.annotation()
          .type(d3.annotationLabel)
          .annotations(annotations)

        svgScene2
          .append("g")
          .attr("class", "annotation-group")
          .call(makeAnnotations)

	
}

