var tape = require("tape")
var rdo = require('../')

tape("timeparse_quarter_mid", function(test) {
  let q = "2017Q1"
  let exp = new Date(2017,1,15); // Zero based, 2 is Feb
  let act = rdo.timeparse_quarter_mid(q)
  test.equal(exp.getTime(), act.getTime());
  test.end();
});

tape("timeparse_quarter_end", function(test) {
  let q = "2017Q1"
  let exp = new Date(2017,2,31); // Zero based, 2 is Feb
  let act = rdo.timeparse_quarter_end(q)
  // console.log(exp)
  // console.log(act)
  test.equal(exp.getTime(), act.getTime());
  test.end();
});

