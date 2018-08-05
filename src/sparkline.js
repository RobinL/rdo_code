import d3 from "d3"
import _ from "lodash";

export function sparkline(values, time_index, DOM, width = 64, height = 17) {

    const x = d3.scaleLinear().domain([0, values.length - 1]).range([0.5, width - 1.5]);
    const y = d3.scaleLinear().domain([0, _.maxBy(values, d => d[1])[1]]).range([height - 0.5, 0.5]);
    const context = DOM.context2d(width, height);
    const line = d3.line().x((d, i) => x(i)).y(d => y(d[1])).context(context);

    context.beginPath(), line(values), context.stroke();


    const area = d3.area()
      .x(function(d) {return x(d[2]); })
      .y0(height)
      .y1(function(d) { return y(d[1]); })
      .context(context);

    context.fillStyle = "#DDE"

    values = _.map(values, (d,i) => _.concat(d, [i]))

    let year_groups = _.groupBy(values, d => d[0].slice(0,4))

     year_groups = _.mapValues(year_groups, function(v,k) {
       let key = `${k}Q1`
       let start_index = _.findIndex(time_index, d => d == key)
       let quarters = _.slice(time_index, start_index, start_index+5)

       return _.filter(values, d => _.includes(quarters, d[0]))
     })


    _.each(year_groups, function(c,i) {

      if (i % 2 == 0) {
        context.fillStyle = "#DDE"
      } else {
        context.fillStyle = "#EEF"
      }
      context.beginPath(), area(c), context.fill();

      // Add year label
      context.fillStyle = "#444"
      context.textAlign = "middle";
      context.textBaseline = "bottom";
      context.font = "6px sans-serif";
      let first_in_chunk = c[0]
      let year = "'" + first_in_chunk[0].slice(2,4)

      context.fillText(year, x(c[0][2]+1), height*0.8);


    })
    return context.canvas;
  }