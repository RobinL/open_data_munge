 function percentage_change(ts, ts_key, period='qoq') {
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
