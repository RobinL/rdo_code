import {int_fmt} from "./comparisons"
import {sparkline} from "./sparkline"

export function get_keystats_dict(totals_ts, value_col, date_col, dt_lib) {

    let return_dict = {}
    let latest = totals_ts.get_latest_row()

    return_dict["latest_total"] = int_fmt(latest[value_col])

    return_dict["spark"]  = sparkline(totals_ts, value_col, date_col)

    let row_comp = totals_ts.get_row_comparison("latest", 1)

    return_dict["inc_dec_text_qt"] = dt_lib.increase_decrease_text(row_comp, value_col)
    return_dict["inc_dec_sym_qt"] = dt_lib.increase_decrease_symbol(row_comp, value_col)
    return_dict["absolute_change_qt"] = dt_lib.absolute_change(row_comp, value_col)
    return_dict["percentage_change_qt"] = dt_lib.percentage_change(row_comp, value_col)


    row_comp = totals_ts.get_row_comparison("latest", 4)

    return_dict["inc_dec_text_yr"] = dt_lib.increase_decrease_text(row_comp, value_col)
    return_dict["inc_dec_sym_yr"] = dt_lib.increase_decrease_symbol(row_comp, value_col)
    return_dict["absolute_change_yr"] = dt_lib.absolute_change(row_comp, value_col)
    return_dict["percentage_change_yr"] = dt_lib.percentage_change(row_comp, value_col)

    return return_dict

}

export function get_keystats_dicts(totals_ts, dt_lib) {
    let txt = {}
    txt.r =  get_keystats_dict(totals_ts, "sum_receipts", dt_lib)
    txt.d =  get_keystats_dict(totals_ts, "sum_disposals", dt_lib)
    txt.o =  get_keystats_dict(totals_ts, "sum_outstanding", dt_lib)
    return txt
}