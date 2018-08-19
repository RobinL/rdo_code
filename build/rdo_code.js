(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('papaparse'), require('d3-format'), require('@observablehq/notebook-stdlib'), require('d3'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'papaparse', 'd3-format', '@observablehq/notebook-stdlib', 'd3', 'lodash'], factory) :
  (factory((global['open-data'] = {}),null,null,null,null,global._));
}(this, (function (exports,Papa,d3,notebookStdlib,d3$1,_) { 'use strict';

  Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
  d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;
  d3$1 = d3$1 && d3$1.hasOwnProperty('default') ? d3$1['default'] : d3$1;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  function get_csv_and_parse(url) {
    return fetch(url).then(d => d.text()).then(d => Papa.parse(d, {header:true, dynamicTyping:true, skipEmptyLines:true})).then(d => d.data)
  }

  let per_fmt = d3.format(",.1%");
  let int_fmt = d3.format(",.0f");


   function increase_decrease(values_comparison, value_key) {

    let base = values_comparison['base'][value_key];
    let comp = values_comparison['comparator'][value_key];

    if (base > comp) {
     return 'an increase of'
    } else if (base < comp) {
      return 'a decrease of'
    } else {
      return 'a change of'
    }
  }

  let lib = new notebookStdlib.Library();

  function select_box_within_html(elem){
      let a = lib.Generators.observe(change => {
        let selectbox =  elem.getElementsByTagName('select')[0];
        // An event listener to yield the element’s new value.
        const inputted = () => change(selectbox.value);

        // Attach the event listener.
        selectbox.addEventListener("input", inputted);

        // Yield the element’s initial value.
        change(selectbox.value);

        // Detach the event listener when the generator is disposed.
        return () => selectbox.removeEventListener("input", inputted);
      });
    return a
  }

  function sparkline(time_series, value_col, date_col, width = 64, height = 17) {
    let values = time_series.get_column(value_col);
    let index = time_series.index;
    let index_col = time_series.index_column;

    let values_year_group = _.groupBy(time_series.data, d => d[date_col].getFullYear());

    // For each group add the final value of the next group

    let keys = _.keys(values_year_group);

    let keysmap = _.map(keys, function(d,i) {
      return [d, keys[i+1]]
    });
    keysmap = _.fromPairs(keysmap);

    _.each(values_year_group, function(values,key) {
      let nextkey = keysmap[key];
      if (typeof(nextkey) != 'undefined') {
        let nextgroup = values_year_group[nextkey];
        values_year_group[key].push(nextgroup[0]);
       }
    });


    const x = d3$1.scaleBand().domain(index).range([0.5, width - 1.5]);
    const y = d3$1.scaleLinear().domain([0, _.max(values)]).range([height - 0.5, 0.5]);

    let lib = new notebookStdlib.Library();
    const context = lib.DOM.context2d(width, height);

    const line = d3$1.line()
                   .x(d => x(d[index_col]))
                   .y(d => y(d[value_col]))
                   .context(context);

    context.beginPath(), line(time_series.data), context.stroke();

    const area = d3$1.area()
      .x(function(d) {return  x(d[index_col])})
      .y0(height)
      .y1(function(d) { return y(d[value_col]); })
      .context(context);

    context.fillStyle = "#DDE";

    _.each(values_year_group, function(c,i) {

      if (i % 2 == 0) {
        context.fillStyle = "#DDE";
      } else {
        context.fillStyle = "#EEF";
      }
      context.beginPath(), area(c), context.fill();

      // Add year label
      context.fillStyle = "#444";
      context.textAlign = "middle";
      context.textBaseline = "bottom";
      context.font = "6px sans-serif";
      let first_in_chunk = c[0];
      let last_in_chunk = c.slice(-1)[0];

      let width_of_chunk = x(last_in_chunk[index_col]) - x(first_in_chunk[index_col]);

      let year = "'" + (first_in_chunk[date_col].getFullYear() + "").slice(2,4);

      context.fillText(year, x(first_in_chunk[index_col]) + width_of_chunk/2 - 5, height*0.8);

    });
    return context.canvas;
  }

  function latest_yearquarter(dt) {
      return dt.sql('select yearquarter from df order by yearquarter desc limit 1')[0]['yearquarter']
  }


  function total_by_quarter(dt) {
      let data = dt.sql(`select yearquarter, yearquarter_end_date, yearquarter_mid_date,
    sum(receipts) as sum_receipts,
    sum(disposals) as sum_disposals,
    sum(outstanding) as sum_outstanding
    from df
    group by yearquarter, yearquarter_end_date, yearquarter_mid_date`);

      data = _.map(data, function(d) {
          d.receipts_less_disposals = d.sum_receipts - d.sum_disposals;
          if (d.receipts_less_disposals > 0) {
              d.chart_text = `${d.yearquarter} :Receipts exceeded disposals by ${int_fmt(d.receipts_less_disposals)}`;
              d.chart_text_y = d.sum_receipts;
              d.legend_value = 'Receipts';
          } else if (d.disposals_less_receipts > 0) {
              d.chart_text = `${d.yearquarter} :Disposals exceeded receipts by ${int_fmt(d.disposals_less_receipts)}`;
              d.chart_text_y = d.sum_disposals;
              d.legend_value = 'Disposals';
          } else {
              d.chart_text = `Receipts equalled disposals`;
              d.chart_text_y = d.sum_receipts;
              d.legend_value = 'Receipts';
          }

          d.receipts_label = '';
          d.disposals_label = '';

          return d
      });

      let last_value = data[data.length - 1];
      last_value.receipts_label = 'Receipts';
      last_value.disposals_label = 'Disposals';

      return data
  }

  function get_keystats_dict(totals_ts, value_col, date_col, dt_lib) {

      let return_dict = {};
      let latest = totals_ts.get_latest_row();

      return_dict["latest_total"] = int_fmt(latest[value_col]);

      return_dict["spark"]  = sparkline(totals_ts, value_col, date_col);

      let row_comp = totals_ts.get_row_comparison("latest", 1);

      return_dict["inc_dec_text_qt"] = dt_lib.increase_decrease_text(row_comp, value_col);
      return_dict["inc_dec_sym_qt"] = dt_lib.increase_decrease_symbol(row_comp, value_col);
      return_dict["absolute_change_qt"] = dt_lib.absolute_change(row_comp, value_col);
      return_dict["percentage_change_qt"] = dt_lib.percentage_change(row_comp, value_col);


      row_comp = totals_ts.get_row_comparison("latest", 4);

      return_dict["inc_dec_text_yr"] = dt_lib.increase_decrease_text(row_comp, value_col);
      return_dict["inc_dec_sym_yr"] = dt_lib.increase_decrease_symbol(row_comp, value_col);
      return_dict["absolute_change_yr"] = dt_lib.absolute_change(row_comp, value_col);
      return_dict["percentage_change_yr"] = dt_lib.percentage_change(row_comp, value_col);

      return return_dict

  }

  function get_keystats_dicts(totals_ts, date_col, dt_lib) {
      let txt = {};
      txt.r =  get_keystats_dict(totals_ts, "sum_receipts", date_col, dt_lib);
      txt.d =  get_keystats_dict(totals_ts, "sum_disposals", date_col,dt_lib);
      txt.o =  get_keystats_dict(totals_ts, "sum_outstanding", date_col,dt_lib);
      return txt
  }

  exports.get_csv_and_parse = get_csv_and_parse;
  exports.increase_decrease = increase_decrease;
  exports.per_fmt = per_fmt;
  exports.int_fmt = int_fmt;
  exports.select_box_within_html = select_box_within_html;
  exports.sparkline = sparkline;
  exports.latest_yearquarter = latest_yearquarter;
  exports.total_by_quarter = total_by_quarter;
  exports.get_keystats_dicts = get_keystats_dicts;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
