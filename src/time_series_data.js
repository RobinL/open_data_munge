import _ from "lodash";
import alasql from "alasql";

// A DataTable is an abstraction that makes it easy to derive new columns and run sql.
// Deriving new columns -> modify in place
// Running sql -> return new DataTable
export  function DataTable(raw_data) {

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
        return new DataTable(returned_data)
    }

    return {
        data: this.data,
        columns: this.columns,
        get_column: this.get_column,
        mutate: this.mutate,
        sql: this.sql
    }

}


// A timeseries must have a single, unique index representing time.
