(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-format'), require('lodash'), require('papaparse'), require('d3-time-format'), require('alasql')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-format', 'lodash', 'papaparse', 'd3-time-format', 'alasql'], factory) :
  (factory((global['open-data'] = {}),null,global._,null,null,null));
}(this, (function (exports,d3,_,Papa,d3TimeFormat,alasql) { 'use strict';

  d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
  alasql = alasql && alasql.hasOwnProperty('default') ? alasql['default'] : alasql;

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

  function get_csv_and_parse(url) {
    fetch(url).then(d => d.text()).then(d => Papa.parse(d, {header:true, dynamicTyping:true})).then(d => d.data);
  }

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

  // A DataTable is an abstraction that makes it easy to derive new columns and run sql.
  // Deriving new columns -> modify in place
  // Running sql -> return new DataTable
  function DataTable(raw_data) {

      let me = this;

      if ((typeof (raw_data) == "object") && (raw_data.length > 0)) {
          this.data = raw_data;
      } else {
          throw ("Data must be an array of objects with length > 0")
      }

      this.db = new alasql.Database();
      this.db.exec('CREATE TABLE df');

      this.columns = _.keys(this.data[0]);

      this.get_column = function (colname) {
          return _.map(this.data, d => d[colname])
      };

      this.mutate = function(in_column, out_column, fn) {
          _.map(this.data, function (d) { d[out_column] = fn(d[in_column]);});
          return this
      };

      this.sql = function(sql) {
          me.db.tables.df.data = me.data;
          let returned_data =  me.db.exec(sql);
          return new DataTable(returned_data)
      };

      return {
          data: this.data,
          columns: this.columns,
          get_column: this.get_column,
          mutate: this.mutate,
          sql: this.sql
      }

  }


  // A timeseries must have a single, unique index representing time.

  exports.percentage_change = percentage_change;
  exports.get_csv_and_parse = get_csv_and_parse;
  exports.timeparse_quarter_mid = timeparse_quarter_mid;
  exports.timeparse_quarter_end = timeparse_quarter_end;
  exports.DataTable = DataTable;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
