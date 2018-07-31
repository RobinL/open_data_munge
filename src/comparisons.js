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

 export function increase_decrease_text(values_comparison, value_key) {

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

export function increase_decrease_symbol(values_comparison, value_key) {

  let base = values_comparison['base'][value_key]
  let comp = values_comparison['comparator'][value_key]

  if (base > comp) {
   return '▲'
  } else if (base < comp) {
    return '▼'
  } else {
    return '-'
  }

}


export function absolute_change(values_comparison, value_key) {

  let base = values_comparison['base'][value_key]
  let comp = values_comparison['comparator'][value_key]

  return int_fmt(Math.abs(base-comp))
}