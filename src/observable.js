export default function html_table(data,fontSize="small", numrows=5){
  let dataslice = data.slice(0,numrows+1)
  const table = document.createElement("table");
    const trHeader = document.createElement("tr");
    document.createElement("tr");
    const thHeaderData = Object.keys(dataslice[0]);
    const thRowData = dataslice;
    thHeaderData.map(dataslice => {
      const tempTh = document.createElement("th")
      tempTh.appendChild(document.createTextNode(dataslice))
      trHeader.appendChild(tempTh)
    })
    table.appendChild(trHeader)
    thRowData.map((dataslice,index) => {
      if (index) {
        const tdKeys = Object.keys(dataslice);
        const tempTr = document.createElement("tr")
        tdKeys.map((data2) => {
          const tempTd = document.createElement("td")
          tempTd.appendChild(document.createTextNode(dataslice[data2]))
          tempTr.appendChild(tempTd).style.fontSize = fontSize
        })
        table.appendChild(tempTr)
      }

    })
    return table;
  }