// Generated automatically by nearley, version 2.19.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main", "symbols": ["_", "statements", "_"], "postprocess": x => x[1]},
    {"name": "block", "symbols": [{"literal":"{"}, "_", "statements", {"literal":"}"}], "postprocess": d => d[2]},
    {"name": "statement", "symbols": ["action", "__", "expr"], "postprocess": d => ({'action': d[0], 'arg': d[2]})},
    {"name": "statement$string$1", "symbols": [{"literal":"w"}, {"literal":"h"}, {"literal":"i"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement$string$2", "symbols": [{"literal":"d"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement", "symbols": ["statement$string$1", "__", "expr", "__", "statement$string$2", "__", "block"], "postprocess": d => ({'while': d[2], 'do': d[6]})},
    {"name": "statement$string$3", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement$string$4", "symbols": [{"literal":"t"}, {"literal":"o"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "statement", "symbols": ["statement$string$3", "__", "name", "__", "statement$string$4", "__", "expr"], "postprocess": d => ({'set': d[2], 'to': d[6]})},
    {"name": "statements$ebnf$1$subexpression$1", "symbols": ["statement", "__"], "postprocess": d => d[0]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1$subexpression$1"]},
    {"name": "statements$ebnf$1$subexpression$2", "symbols": ["statement", "__"], "postprocess": d => d[0]},
    {"name": "statements$ebnf$1", "symbols": ["statements$ebnf$1", "statements$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "statements", "symbols": ["statements$ebnf$1"], "postprocess": id},
    {"name": "expr", "symbols": ["name"], "postprocess": d => ({'name': d[0]})},
    {"name": "expr$ebnf$1$subexpression$1", "symbols": [{"literal":"!"}]},
    {"name": "expr$ebnf$1", "symbols": ["expr$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "expr$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "expr", "symbols": ["number", "expr$ebnf$1"], "postprocess":  (d, loc) =>
        ({'number': d[0],
          'span': [loc, d[0].length],
          'strict': (d[1] ? true : false)}) },
    {"name": "expr", "symbols": ["name", "_", {"literal":"["}, "_", "expr", "_", {"literal":"]"}], "postprocess": d => ({'unop': d[0], 'arg': d[4]})},
    {"name": "expr", "symbols": ["expr", "_", "binop", "_", "expr"], "postprocess": d => ({'binop': d[2], 'left': d[0], 'right': d[4]})},
    {"name": "expr", "symbols": [{"literal":"("}, "_", "expr", "_", {"literal":")"}], "postprocess": d => d[2]},
    {"name": "name$ebnf$1", "symbols": [/[a-zA-Z_]/]},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-zA-Z_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": ["name$ebnf$1"], "postprocess": d => (d[0].join(""))},
    {"name": "binop$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "binop$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "binop$subexpression$1", "symbols": [{"literal":"*"}]},
    {"name": "binop$subexpression$1", "symbols": [{"literal":"/"}]},
    {"name": "binop$subexpression$1", "symbols": [{"literal":"="}]},
    {"name": "binop$subexpression$1", "symbols": [{"literal":"<"}]},
    {"name": "binop", "symbols": ["binop$subexpression$1"], "postprocess": d => d[0][0]},
    {"name": "action$subexpression$1$string$1", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}, {"literal":"w"}, {"literal":"a"}, {"literal":"r"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "action$subexpression$1", "symbols": ["action$subexpression$1$string$1"]},
    {"name": "action$subexpression$1$string$2", "symbols": [{"literal":"t"}, {"literal":"u"}, {"literal":"r"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "action$subexpression$1", "symbols": ["action$subexpression$1$string$2"]},
    {"name": "action", "symbols": ["action$subexpression$1"], "postprocess": d => d[0][0]},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "number$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number$subexpression$1", "symbols": ["number$subexpression$1$ebnf$1"], "postprocess": d => d || ""},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$2$subexpression$1$ebnf$1", "symbols": ["number$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "number$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "number$ebnf$2", "symbols": ["number$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "number$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number", "symbols": ["number$subexpression$1", "number$ebnf$1", "number$ebnf$2"], "postprocess":  function(d) {
          if (d[2]) {return d[0] + d[1].join("") + '.' + d[2][1].join("") }
          else {return d[0] + d[1].join(""); }
        }  },
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": d => null},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": d => null}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
