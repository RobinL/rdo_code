import d3 from "d3-format";

export let per_fmt = d3.format(",.1%")
export let int_fmt = d3.format(",.0f")


export function percentage_change(values_comparison, value_key) {

    let base = values_comparison['base'][value_key]
    let comp = values_comparison['comparator'][value_key]

    if (base > comp) {
      return  per_fmt((base)/comp)
    } else if (base < comp) {
      return per_fmt(1-base/comp)
    } else {
      return per_fmt(0)
    }

 }


 export function increase_decrease(values_comparison, value_key) {

  let base = values_comparison['base'][value_key]
  let comp = values_comparison['comparator'][value_key]

  if (base > comp) {
   return 'an increase of'
  } else if (base < comp) {
    return 'a decrease of'
  } else {
    return 'a change of'
  }
}

export function receipts_vs_disposals_text(row) {

  let r = row['sum_receipts']
  let d = row['sum_disposals']

  if (r > d) {
   row["receipts_less_disposals"] = 'Receipts exceeded disposals'
  } else if (r < d) {
    row["receipts_less_disposals"] = 'Disposals exceeded receipts'
  } else {
    row["receipts_less_disposals"] = 'Receipts equalled disposals'
  }

  return row
}
