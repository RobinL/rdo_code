import d3 from "d3"
import _ from "lodash";
import Library from "@observablehq/notebook-stdlib";

export function sparkline(time_series, value_col, date_col, width = 64, height = 17) {
  let values = time_series.get_column(value_col)
  let index = time_series.index
  let index_col = time_series.index_column

  let values_year_group = _.groupBy(time_series.data, d => d[date_col].getFullYear())

  // For each group add the final value of the next group

  let keys = _.keys(values_year_group)

  let keysmap = _.map(keys, function(d,i) {
    return [d, keys[i+1]]
  })
  keysmap = _.fromPairs(keysmap)

  _.each(values_year_group, function(values,key) {
    let nextkey = keysmap[key]
    if (typeof(nextkey) != 'undefined') {
      let nextgroup = values_year_group[nextkey]
      values_year_group[key].push(nextgroup[0])
     }
  })


  const x = d3.scaleBand().domain(index).range([0.5, width - 1.5]);
  const y = d3.scaleLinear().domain([0, _.max(values)]).range([height - 0.5, 0.5]);

  let lib = new Library()
  const context = lib.DOM.context2d(width, height);

  const line = d3.line()
                 .x(d => x(d[index_col]))
                 .y(d => y(d[value_col]))
                 .context(context);

  context.beginPath(), line(time_series.data), context.stroke();

  const area = d3.area()
    .x(function(d) {return  x(d[index_col])})
    .y0(height)
    .y1(function(d) { return y(d[value_col]); })
    .context(context);

  context.fillStyle = "#DDE"

  _.each(values_year_group, function(c,i) {

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
    let last_in_chunk = c.slice(-1)[0]

    let width_of_chunk = x(last_in_chunk[index_col]) - x(first_in_chunk[index_col])

    let year = "'" + (first_in_chunk[date_col].getFullYear() + "").slice(2,4)

    context.fillText(year, x(first_in_chunk[index_col]) + width_of_chunk/2 - 5, height*0.8);

  })
  return context.canvas;
}