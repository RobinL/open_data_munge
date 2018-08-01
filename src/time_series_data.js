import _ from "lodash";
import alasql from "alasql";
import html_table from "./observable"

// A DataTable is an abstraction that makes it easy to derive new columns and run sql.
// Deriving new columns -> modify in place
// Running sql -> return new DataTable
export function DataTable(raw_data) {

    let me = this

    if ((typeof (raw_data) == "object") && (raw_data.length > 0)) {
        this.data = raw_data
    } else {
        throw ("Data must be an array of objects with length > 0")
    }

    this.db = new alasql.Database();
    this.db.exec('CREATE TABLE df');

    this.columns = _.keys(this.data[0])

    this.get_column = function (colname) {
        return _.map(this.data, d => d[colname])
    }

    this.mutate = function(in_column, out_column, fn) {
        _.map(this.data, function (d) { d[out_column] = fn(d[in_column])})
        return this
    }

    this.sql = function(sql) {
        me.db.tables.df.data = me.data;
        let returned_data =  me.db.exec(sql)
        return returned_data
    }

    this.html_table = function(numrows=5){
        return html_table(me.data, "small", numrows)
    }

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

export function TimeSeries(raw_data, index_column) {

    let me = this

    if ((typeof (raw_data) == "object") && (raw_data.length > 0)) {
        raw_data = _.sortBy(raw_data, index_column)
        this.data = raw_data
    } else {
        throw ("Data must be an array of objects with length > 0")
    }

    function get_column(colname) {
        return _.map(me.data, d => d[colname])
    }

    let index = get_column(index_column)
    let index_dict = _.fromPairs(_.map(index, (d, i) => [d,i]))

    this.html_table = function(numrows=5){
        return html_table(me.data, "small", numrows)
    }

    function get_greatest_row(val_col) {
       return _.maxBy(raw_data, d => d[val_col])
    }

    function get_n_periods_ago_row(base="latest", periods) {
       let base_index


       if (base == "latest") {
         let latest_row = get_latest_row()

         base_index = index_dict[latest_row[index_column]]


       } else {
         base_index = index_dict[base]
       }

       let offset_index = base_index - periods

       return raw_data[offset_index]

    }

    function get_row_from_index(index_value) {
      if (index_value == "latest") {
        return get_latest_row()
      } else {
        let index_slice = index_dict[index_value]
        return raw_data[index_slice]
      }
    }

    function get_row_comparison(base="latest", periods) {
      let val_base = get_row_from_index(base)
      let val_comparator = get_n_periods_ago_row(base, periods)

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