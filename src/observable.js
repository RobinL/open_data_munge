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