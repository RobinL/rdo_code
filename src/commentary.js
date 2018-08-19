import {int_fmt, date_fmt} from "./comparisons"
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

export function get_keystats_dicts(totals_ts, date_col, dt_lib) {
    let txt = {}
    txt.r =  get_keystats_dict(totals_ts, "sum_receipts", date_col, dt_lib)
    txt.d =  get_keystats_dict(totals_ts, "sum_disposals", date_col,dt_lib)
    txt.o =  get_keystats_dict(totals_ts, "sum_outstanding", date_col,dt_lib)
    return txt
}


export function get_chart_md(totals_ts, chart_signal, report_period) {

    let index
    if (chart_signal == 0) {
      index = report_period} else {
        index = chart_signal["yearquarter"]
      }


    let c = totals_ts.get_row_comparison(index, 1)
    let cht_md = {}

    cht_md["receipts"] = int_fmt(c.base.sum_receipts)
    cht_md["disposals"] = int_fmt(c.base.sum_disposals)
    cht_md["outstanding"] = int_fmt(c.base.sum_outstanding)
    cht_md["outstanding_prev"] = int_fmt(c.comparator.sum_outstanding)
    cht_md["quarter_end"] = date_fmt(c.base.yearquarter_end_date)
    cht_md["quarter_end_prev"] = date_fmt(c.comparator.yearquarter_end_date)

    cht_md["outstanding_abs"] = dt.absolute_change(c, "sum_outstanding")

    if (cht_md["receipts"] > cht_md["disposals"]) {
      cht_md["exceeded_text"] = "receipts were higher than disposals"
      cht_md["outstanding_inc_dec"] = "rose"
      cht_md["outstanding_up_down"] = "up"
    } else   if (cht_md["disposals"] > cht_md["receipts"]) {
      cht_md["exceeded_text"] = "disposals were higher than receipts"
      cht_md["outstanding_inc_dec"] = "fell"
      cht_md["outstanding_up_down"] = "down"
    } else {
      cht_md["exceeded_text"] = "receipts equalled disposals"
      cht_md["outstanding_inc_dec"] = "stayed the same"
      cht_md["outstanding_up_down"] = "staying the same"
    }

    return cht_md

  }