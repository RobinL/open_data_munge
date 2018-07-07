var tape = require("tape")

tape("a = 1", function(test) {
  let a = 1
  test.equal(a, 1);
  test.end();
});