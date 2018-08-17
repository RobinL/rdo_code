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
    } else if (base < base) {
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

  function sparkline(values, time_index, DOM, width = 64, height = 17) {

      const x = d3$1.scaleLinear().domain([0, values.length - 1]).range([0.5, width - 1.5]);
      const y = d3$1.scaleLinear().domain([0, _.maxBy(values, d => d[1])[1]]).range([height - 0.5, 0.5]);
      const context = DOM.context2d(width, height);
      const line = d3$1.line().x((d, i) => x(i)).y(d => y(d[1])).context(context);

      context.beginPath(), line(values), context.stroke();


      const area = d3$1.area()
        .x(function(d) {return x(d[2]); })
        .y0(height)
        .y1(function(d) { return y(d[1]); })
        .context(context);

      context.fillStyle = "#DDE";

      values = _.map(values, (d,i) => _.concat(d, [i]));

      let year_groups = _.groupBy(values, d => d[0].slice(0,4));

       year_groups = _.mapValues(year_groups, function(v,k) {
         let key = `${k}Q1`;
         let start_index = _.findIndex(time_index, d => d == key);
         let quarters = _.slice(time_index, start_index, start_index+5);

         return _.filter(values, d => _.includes(quarters, d[0]))
       });


      _.each(year_groups, function(c,i) {

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
        let year = "'" + first_in_chunk[0].slice(2,4);

        context.fillText(year, x(c[0][2]+1), height*0.8);


      });
      return context.canvas;
    }

  function latest_yearquarter(dt) {
      return dt.sql('select yearquarter from df order by yearquarter desc limit 1')[0]['yearquarter']
  }


  function total_by_quarter(dt) {
      return dt.sql(`select yearquarter, yearquarter_end_date, yearquarter_mid_date,
    sum(receipts) as sum_receipts,
    sum(disposals) as sum_disposals,
    sum(outstanding) as sum_outstanding
    from df
    group by yearquarter, yearquarter_end_date, yearquarter_mid_date`)
  }

  exports.get_csv_and_parse = get_csv_and_parse;
  exports.increase_decrease = increase_decrease;
  exports.per_fmt = per_fmt;
  exports.int_fmt = int_fmt;
  exports.select_box_within_html = select_box_within_html;
  exports.sparkline = sparkline;
  exports.latest_yearquarter = latest_yearquarter;
  exports.total_by_quarter = total_by_quarter;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
