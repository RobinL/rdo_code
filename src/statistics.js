import { receipts_vs_disposals_text, int_fmt } from "./comparisons";
import _ from "lodash";


export function latest_yearquarter(dt) {
    return dt.sql('select yearquarter from df order by yearquarter desc limit 1')[0]['yearquarter']
}


export function total_by_quarter(dt) {
    let data = dt.sql(`select yearquarter, yearquarter_end_date, yearquarter_mid_date,
    sum(receipts) as sum_receipts,
    sum(disposals) as sum_disposals,
    sum(outstanding) as sum_outstanding
    from df
    group by yearquarter, yearquarter_end_date, yearquarter_mid_date`)

    data = _.map(data, receipts_vs_disposals_text)

    data = _.map(data, function(d) {
        if (d.receipts_less_disposals > 0) {
            d.chart_text = `${d.yearquarter} :Receipts exceeded disposals by ${int_fmt(d.receipts_less_disposals)}`
            d.chart_text_y = d.sum_receipts
            d.legend_value = 'Receipts'
        } else if (d.disposals_less_receipts > 0) {
            d.chart_text = `${d.yearquarter} :Disposals exceeded receipts by ${int_fmt(d.disposals_less_receipts)}`
            d.chart_text_y = d.sum_disposals
            d.legend_value = 'Disposals'
        } else {
            d.chart_text = `Receipts equalled disposals`
            d.chart_text_y = d.sum_receipts
            d.legend_value = 'Receipts'
        }

        d.receipts_label = ''
        d.disposals_label = ''

        return d
    })

    let last_value = data[data.length - 1]
    last_value.receipts_label = 'Receipts'
    last_value.disposals_label = 'Disposals'

    return data
}


