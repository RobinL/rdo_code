import {Library} from "@observablehq/notebook-stdlib";


let lib = new Library()

export function select_box_within_html(id){
    let a = lib.Generators.observe(change => {
      let selectbox =  document.getElementById(id)
      // An event listener to yield the element’s new value.
      const inputted = () => change(selectbox.value);

      // Attach the event listener.
      selectbox.addEventListener("input", inputted);

      // Yield the element’s initial value.
      change(selectbox.value);

      // Detach the event listener when the generator is disposed.
      return () => selectbox.removeEventListener("input", inputted);
    })
  return a
}


export function observe_chart_signal(chart, signal_name){
  // See https://github.com/observablehq/notebook-stdlib#Generators_observe
  // See https://beta.observablehq.com/@mbostock/observing-vega-signals
  // See https://talk.observablehq.com/t/retrieving-value-of-selector-in-vega-lite-live/1109
  return lib.Generators.observe(function(notify) {

    // change is a function; calling change triggers the resolution of the current promise with the passed value.

    // Yield the element’s initial value.

    const signaled = (name, value) => notify(value);
    chart.addSignalListener(signal_name, signaled);
    notify(chart.signal(signal_name));
    return () => chart.removeSignalListener(signal_name, signaled);

  })

}

export default function html_table(data,fontSize="small", numrows=5){
  let dataslice = data.slice(0,numrows+1)
  const table = document.createElement("table");
    const trHeader = document.createElement("tr");
    document.createElement("tr");
    const thHeaderData = Object.keys(dataslice[0]);
    const thRowData = dataslice;
    thHeaderData.map(dataslice => {
      const tempTh = document.createElement("th")
      tempTh.appendChild(document.createTextNode(dataslice))
      trHeader.appendChild(tempTh)
    })
    table.appendChild(trHeader)
    thRowData.map((dataslice,index) => {
      if (index) {
        const tdKeys = Object.keys(dataslice);
        const tempTr = document.createElement("tr")
        tdKeys.map((data2) => {
          const tempTd = document.createElement("td")
          tempTd.appendChild(document.createTextNode(dataslice[data2]))
          tempTr.appendChild(tempTd).style.fontSize = fontSize
        })
        table.appendChild(tempTr)
      }

    })
    return table;
  }