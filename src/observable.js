import {Library} from "@observablehq/notebook-stdlib";


let lib = new Library()

export function select_box_within_html(elem){
    let a = lib.Generators.observe(change => {
      let selectbox =  elem.getElementsByTagName('select')[0]
      // An event listener to yield the element’s new value.
      const inputted = () => change(selectbox.value);

      // Attach the event listener.
      selectbox.addEventListener("input", inputted);

      // Yield the element’s initial value.
      change(selectbox.value);

      // Detach the event listener when the generator is disposed.
      return () => selectbox.removeEventListener("input", inputted);
    })
  return a
}

export default function htmlTable(data,fontSize){
    const table = document.createElement("table");
    const trHeader = document.createElement("tr");
    document.createElement("tr");
    const thHeaderData = Object.keys(data[0]);
    const thRowData = data;
    thHeaderData.map(data => {
      const tempTh = document.createElement("th")
      tempTh.appendChild(document.createTextNode(data))
      trHeader.appendChild(tempTh)
    })
    table.appendChild(trHeader)
    thRowData.map((data,index) => {
      if (index) {
        const tdKeys = Object.keys(data);
        const tempTr = document.createElement("tr")
        tdKeys.map((data2) => {
          const tempTd = document.createElement("td")
          tempTd.appendChild(document.createTextNode(data[data2]))
          tempTr.appendChild(tempTd).style.fontSize = fontSize ? fontSize : "small"
        })
        table.appendChild(tempTr)
      }

    })
    return table;
  }