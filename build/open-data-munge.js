(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-format'), require('lodash'), require('d3-time-format'), require('d3-time')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-format', 'lodash', 'd3-time-format', 'd3-time'], factory) :
  (factory((global['open-data'] = {}),null,global._,null,null));
}(this, (function (exports,d3,_,d3TimeFormat,d3Time) { 'use strict';

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

  function timeparse_quarter_mid(q) {
      q = q.replace("Q1", "-02-15");
      q = q.replace("Q2", "-05-15");
      q = q.replace("Q3", "-08-15");
      q = q.replace("Q4", "-11-15");
      let par = d3TimeFormat.timeParse("%Y-%m-%d");
      return par(q)

      }

  function timeparse_quarter_end(q) {
      q = q.replace("Q1", "-03-31");
      q = q.replace("Q2", "-06-30");
      q = q.replace("Q3", "-09-31");
      q = q.replace("Q4", "-12-31");
      let par = d3TimeFormat.timeParse("%Y-%m-%d");
      return par(q)

      }

  exports.percentage_change = percentage_change;
  exports.timeparse_quarter_mid = timeparse_quarter_mid;
  exports.timeparse_quarter_end = timeparse_quarter_end;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
