(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('papaparse'), require('d3-format'), require('@observablehq/notebook-stdlib')) :
  typeof define === 'function' && define.amd ? define(['exports', 'papaparse', 'd3-format', '@observablehq/notebook-stdlib'], factory) :
  (factory((global['open-data'] = {}),null,null,null));
}(this, (function (exports,Papa,d3,notebookStdlib) { 'use strict';

  Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
  d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;

  function get_csv_and_parse(url) {
    return fetch(url).then(d => d.text()).then(d => Papa.parse(d, {header:true, dynamicTyping:true, skipEmptyLines:true})).then(d => d.data)
  }

  let per_fmt = d3.format(",.1%");
  let int_fmt = d3.format(",.0f");

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

  exports.get_csv_and_parse = get_csv_and_parse;
  exports.per_fmt = per_fmt;
  exports.int_fmt = int_fmt;
  exports.select_box_within_html = select_box_within_html;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
