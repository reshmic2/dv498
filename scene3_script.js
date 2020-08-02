async function showDataByCountry(data) {
	const data1 = await d3.csv("https://raw.githubusercontent.com/reshmic2/dv498/master/sex-year-age-country-avg-suicide.csv");
	var dataByCountry = data1.filter(function (d) {
		return (d.year === data.year && d.sex === data.sex && d.age == data.age);
	});

	var margin = {
			top: 30,
			right: 30,
			bottom: 70,
			left: 60
		},
		width = 800 - margin.left - margin.right,
		height = 800 - margin.top - margin.bottom;

	var svgScene3 = d3.select("#scene3")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(100, 0)");

	var y = d3.scaleBand()
		.range([0, height])
		.domain(dataByCountry.map(function (d) {
			return d.country;
		}))
		.padding(0.2);

	svgScene3.append("g")
		.call(d3.axisLeft(y))

	var x = d3.scaleLinear()
		.range([0, width])
		.domain([0, d3.max(dataByCountry, function (d) {
			return parseInt(d.SUM_suicides_per100k_pop)
		})]);

	svgScene3.append("g")
		.attr("transform", "translate(0," + (height) + ")")
		.call(d3.axisBottom(x));

	var tooltip = d3.select("#tooltip");

	svgScene3.selectAll("rect")
		.data(dataByCountry)
		.enter()
		.append("rect")
		.attr("x", 0)
		.attr("y", function (d) {
			return y(d.country);
		})
		.attr("height", y.bandwidth())
		.on('mouseover', function (d, i) {
			d3.select(this).style("fill", "red");
			tooltip.style("opacity", 1)
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY) + "px")
				.html("Sex:" + d.sex + "<br/> Age group: " + d.age + "<br/> Suicide cases per 100k population: " + d.SUM_suicides_per100k_pop + "M <br/> Total suicide cases:" + d.SUM_suicides_no);
		})
		.on("mouseout", function () {
			tooltip.style("opacity", 0)
			d3.select(this).style("fill", "green");
		})
		.transition()
		.duration(1000)
		.attr("width", function (d) {
			return x(d.SUM_suicides_per100k_pop);
		})
		.attr("fill", "green")


	svgScene3.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width / 2)
		.attr("y", height + 40)
		.text("Total suicide per 100k population");
}