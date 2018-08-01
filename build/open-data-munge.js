(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('papaparse'), require('d3-time-format'), require('d3-format'), require('@observablehq/notebook-stdlib'), require('lodash'), require('alasql')) :
  typeof define === 'function' && define.amd ? define(['exports', 'papaparse', 'd3-time-format', 'd3-format', '@observablehq/notebook-stdlib', 'lodash', 'alasql'], factory) :
  (factory((global['open-data'] = {}),null,null,null,null,global._,null));
}(this, (function (exports,Papa,d3TimeFormat,d3,notebookStdlib,_,alasql) { 'use strict';

  Papa = Papa && Papa.hasOwnProperty('default') ? Papa['default'] : Papa;
  d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;
  _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
  alasql = alasql && alasql.hasOwnProperty('default') ? alasql['default'] : alasql;

  function get_csv_and_parse(url) {
    return fetch(url).then(d => d.text()).then(d => Papa.parse(d, {header:true, dynamicTyping:true, skipEmptyLines:true})).then(d => d.data)
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

  let per_fmt = d3.format(",.1%");
  let int_fmt = d3.format(",.0f");


  function percentage_change(values_comparison, value_key) {

      let base = values_comparison['base'][value_key];
      let comp = values_comparison['comparator'][value_key];

      if (base > comp) {
        return  per_fmt((base)/comp)
      } else if (base < comp) {
        return per_fmt(1-base/comp)
      } else {
        return per_fmt(0)
      }

   }

   function increase_decrease_text(values_comparison, value_key) {

    let base = values_comparison['base'][value_key];
    let comp = values_comparison['comparator'][value_key];

    if (base > comp) {
     return 'an increase of'
    } else if (base < comp) {
      return 'a decrease of'
    } else {
      return 'a change of'
    }
  }

  function increase_decrease_symbol(values_comparison, value_key) {

    let base = values_comparison['base'][value_key];
    let comp = values_comparison['comparator'][value_key];

    if (base > comp) {
     return '▲'
    } else if (base < comp) {
      return '▼'
    } else {
      return '-'
    }

  }


  function absolute_change(values_comparison, value_key) {

    let base = values_comparison['base'][value_key];
    let comp = values_comparison['comparator'][value_key];

    return int_fmt(Math.abs(base-comp))
  }

  let lib = new notebookStdlib.Library();

  function select_box_within_html(elem){
      let a = lib.Generators.observe(change => {
        let selectbox =  elem.getElementsByTagName('select')[0];
        // An event listener to yield the element’s new value.
        const inputted = () => change(selectbox.value);

        // Attach the event listener.
        selectbox.addEventListener("input", inputted);

        // Yield the element’s initial value.
        change(selectbox.value);

        // Detach the event listener when the generator is disposed.
        return () => selectbox.removeEventListener("input", inputted);
      });
    return a
  }

  function html_table(data,fontSize="small", numrows=5){
    let dataslice = data.slice(0,numrows+1);
    const table = document.createElement("table");
      const trHeader = document.createElement("tr");
      document.createElement("tr");
      const thHeaderData = Object.keys(dataslice[0]);
      const thRowData = dataslice;
      thHeaderData.map(dataslice => {
        const tempTh = document.createElement("th");
        tempTh.appendChild(document.createTextNode(dataslice));
        trHeader.appendChild(tempTh);
      });
      table.appendChild(trHeader);
      thRowData.map((dataslice,index) => {
        if (index) {
          const tdKeys = Object.keys(dataslice);
          const tempTr = document.createElement("tr");
          tdKeys.map((data2) => {
            const tempTd = document.createElement("td");
            tempTd.appendChild(document.createTextNode(dataslice[data2]));
            tempTr.appendChild(tempTd).style.fontSize = fontSize;
          });
          table.appendChild(tempTr);
        }

      });
      return table;
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
          return returned_data
      };

      this.html_table = function(numrows=5){
          return html_table(me.data, "small", numrows)
      };

      return {
          data: this.data,
          columns: this.columns,
          get_column: this.get_column,
          mutate: this.mutate,
          sql: this.sql,
          html_table: this.html_table
      }

  }


  // A timeseries must have a single, unique index representing time.

  function TimeSeries(raw_data, index_column) {

      let me = this;

      if ((typeof (raw_data) == "object") && (raw_data.length > 0)) {
          raw_data = _.sortBy(raw_data, index_column);
          this.data = raw_data;
      } else {
          throw ("Data must be an array of objects with length > 0")
      }

      function get_column(colname) {
          return _.map(me.data, d => d[colname])
      }

      let index = get_column(index_column);
      let index_dict = _.fromPairs(_.map(index, (d, i) => [d,i]));

      this.html_table = function(numrows=5){
          return html_table(me.data, "small", numrows)
      };

      function get_greatest_row(val_col) {
         return _.maxBy(raw_data, d => d[val_col])
      }

      function get_n_periods_ago_row(base="latest", periods) {
         let base_index;


         if (base == "latest") {
           let latest_row = get_latest_row();

           base_index = index_dict[latest_row[index_column]];


         } else {
           base_index = index_dict[base];
         }

         let offset_index = base_index - periods;

         return raw_data[offset_index]

      }

      function get_row_from_index(index_value) {
        if (index_value == "latest") {
          return get_latest_row()
        } else {
          let index_slice = index_dict[index_value];
          return raw_data[index_slice]
        }
      }

      function get_row_comparison(base="latest", periods) {
        let val_base = get_row_from_index(base);
        let val_comparator = get_n_periods_ago_row(base, periods);

        return {"base": val_base, "comparator": val_comparator}
      }

      function get_latest_row() {
          return raw_data.slice(-1)[0]
      }


      return {
          data: this.data,
          columns: this.columns,
          html_table: this.html_table,
          get_column: get_column,
          get_latest_row: get_latest_row,
          get_n_periods_ago_row: get_n_periods_ago_row,
          get_row_comparison: get_row_comparison,
          get_greatest_row: get_greatest_row
      }

  }

  exports.get_csv_and_parse = get_csv_and_parse;
  exports.timeparse_quarter_mid = timeparse_quarter_mid;
  exports.timeparse_quarter_end = timeparse_quarter_end;
  exports.percentage_change = percentage_change;
  exports.increase_decrease_symbol = increase_decrease_symbol;
  exports.increase_decrease_text = increase_decrease_text;
  exports.absolute_change = absolute_change;
  exports.per_fmt = per_fmt;
  exports.int_fmt = int_fmt;
  exports.DataTable = DataTable;
  exports.TimeSeries = TimeSeries;
  exports.select_box_within_html = select_box_within_html;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
