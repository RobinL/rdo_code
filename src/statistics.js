export function latest_yearquarter(dt) {
    return dt.sql('select yearquarter from df order by yearquarter desc limit 1')[0]['yearquarter']
}


export function total_by_quarter(dt) {
    return dt.sql(`select yearquarter, yearquarter_end_date, yearquarter_mid_date,
    sum(receipts) as sum_receipts,
    sum(disposals) as sum_disposals,
    sum(outstanding) as sum_outstanding
    from df
    group by yearquarter, yearquarter_end_date, yearquarter_mid_date`)
}