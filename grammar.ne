main -> _ statements _ {% x => x[1] %}

block -> "{" _ statements  "}" {% d => d[2] %}

statement ->
  action __ expr                   {% d => ({'action': d[0], 'arg': d[2]}) %}
| "while" __ expr __ "do" __ block {% d => ({'while': d[2], 'do': d[6]}) %}
| "set" __ name __ "to" __ expr    {% d => ({'set': d[2], 'to': d[6]}) %}

statements -> (statement __ {% d => d[0] %}):+ {% id %}

expr -> name                       {% d => ({'name': d[0]}) %}
| number ("!"):?
  {% (d, loc) =>
     ({'number': d[0],
       'span': [loc, d[0].length],
       'strict': (d[1] ? true : false)}) %}
| name _ "[" _ expr _ "]"    {% d => ({'unop': d[0], 'arg': d[4]}) %}
| expr _ binop _ expr        {% d => ({'binop': d[2], 'left': d[0], 'right': d[4]}) %}


name -> [a-zA-Z_]:+ {% d => (d[0].join("")) %}
binop -> ("+" | "-" | "*" | "/" | "=" | "<") {% d => d[0][0] %}
action -> ("forward" | "turn") {% d => d[0][0] %}

number -> ("-":? {% d => d || "" %}) [0-9]:+ ("." [0-9]:+):?
  {% function(d) {
       if (d[2]) {return d[0] + d[1].join("") + '.' + d[2][1].join("") }
       else {return d[0] + d[1].join(""); }
     }  %}

_  -> [\s]:* {% d => null %}
__ -> [\s]:+ {% d => null %}
