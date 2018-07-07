import {timeParse} from "d3-time-format";
import {timeMonth, timeDay} from "d3-time";

export function timeparse_quarter_mid(q) {
    q = q.replace("Q1", "-02-15")
    q = q.replace("Q2", "-05-15")
    q = q.replace("Q3", "-08-15")
    q = q.replace("Q4", "-11-15")
    let par = timeParse("%Y-%m-%d")
    return par(q)

    }

export function timeparse_quarter_end(q) {
    q = q.replace("Q1", "-03-31")
    q = q.replace("Q2", "-06-30")
    q = q.replace("Q3", "-09-31")
    q = q.replace("Q4", "-12-31")
    let par = timeParse("%Y-%m-%d")
    return par(q)

    }