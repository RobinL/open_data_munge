(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-format'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-format', 'lodash'], factory) :
  (factory((global['open-data'] = {}),null,global._));
}(this, (function (exports,d3,_) { 'use strict';

  d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;

  function percentage_change(ts, ts_key, period='qoq') {
     let comparator = period_to_array_index(period);

     let series = ts[ts_key];

     let s1 = _.last(series)[1];
     let s2 = _.nth(series,comparator)[1];

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

  let per_fmt = d3.format(",.1%");

  exports.percentage_change = percentage_change;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
