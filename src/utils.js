
import Papa from "papaparse"

export function get_csv_and_parse(url) {
  return fetch(url).then(d => d.text()).then(d => Papa.parse(d, {header:true, dynamicTyping:true, skipEmptyLines:true})).then(d => d.data)
}