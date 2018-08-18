import {int_fmt} from "./comparisons"


export function get_keystats_dict(totals_ts, value_col, dt_lib) {

    let receipts_text = {}
    let latest = totals_ts.get_latest_row()

    receipts_text["latest_total"] = int_fmt(latest[value_col])

    let row_comp = totals_ts.get_row_comparison("latest", 1)

    receipts_text["inc_dec_text_qt"] = dt_lib.increase_decrease_text(row_comp, value_col)
    receipts_text["inc_dec_sym_qt"] = dt_lib.increase_decrease_symbol(row_comp, value_col)
    receipts_text["absolute_change_qt"] = dt_lib.absolute_change(row_comp, value_col)
    receipts_text["percentage_change_qt"] = dt_lib.percentage_change(row_comp, value_col)

    row_comp = totals_ts.get_row_comparison("latest", 4)

    receipts_text["inc_dec_text_yr"] = dt_lib.increase_decrease_text(row_comp, value_col)
    receipts_text["inc_dec_sym_yr"] = dt_lib.increase_decrease_symbol(row_comp, value_col)
    receipts_text["absolute_change_yr"] = dt_lib.absolute_change(row_comp, value_col)
    receipts_text["percentage_change_yr"] = dt_lib.percentage_change(row_comp, value_col)

    return receipts_text

}

export function get_keystats_dicts(totals_ts, dt_lib) {
    let txt = {}
    txt.r =  get_keystats_dict(totals_ts, "sum_receipts", dt_lib)
    txt.d =  get_keystats_dict(totals_ts, "sum_disposals", dt_lib)
    txt.o =  get_keystats_dict(totals_ts, "sum_outstanding", dt_lib)
    return txt
}