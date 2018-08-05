export function latest_yearquarter(dt) {
    return dt.sql('select yearquarter from df order by yearquarter desc limit 1')[0]['yearquarter']
}