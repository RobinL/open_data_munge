import d3 from "d3-format";
import _ from "lodash";
import Papa from "papaparse"

export function percentage_change(ts, ts_key, period='qoq') {
   let comparator = period_to_array_index(period)

   let series = ts[ts_key]

   let s1 = _.last(series)[1]
   let s2 = _.nth(series,comparator)[1]

    if (s1 > s2) {
     return  per_fmt((s1)/s2)
   } else if (s1 < s2) {
     return per_fmt(1-s1/s2)
   } else {
     return per_fmt(0)
   }

}


function period_to_array_index(period) {
  if (period == 'qoq') {
    return -2
  } else if (period == 'yoy') {
    return -5
  }
}

let per_fmt = d3.format(",.1%")

export function get_csv_and_parse(url) {
  return fetch(url).then(d => d.text()).then(d => Papa.parse(d, {header:true, dynamicTyping:true})).then(d => d.data)
}