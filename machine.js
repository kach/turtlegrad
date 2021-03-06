function DualNumber(n, e) {
  this.n = n;
  this.e = e || {};
}

DualNumber.prototype.value = function() {
  return this.n;
};

DualNumber.makeUnop = function(primal, dual) {
  return function() {
    var n = primal.call(this);
    var e = {};
    var es = Object.keys(this.e);
    for (var i = 0; i < es.length; i++) {
      e[es[i]] = dual.call(this) * this.e[es[i]];
    }
    return new DualNumber(n, e);
  };
};

DualNumber.makeBinop = function(primal, dualLeft, dualRight) {
  return function(other) {
    var n = primal.call(this, other);
    var e = {};
    var es = Object.keys(this.e).concat(Object.keys(other.e));
    for (var i = 0; i < es.length; i++) {
      if (e[es[i]]) continue;
      // if (!this.e[es[i]]) this.e[es[i]] = 0;
      // if (!other.e[es[i]]) other.e[es[i]] = 0;
      e[es[i]] = dualLeft.call(this, other) * (this.e[es[i]] || 0) +
        dualRight.call(this, other) * (other.e[es[i]] || 0);
    }
    return new DualNumber(n, e);
  };
};

DualNumber.prototype.neg = DualNumber.makeUnop(function() {
  return -this.n;
}, function() {
  return -1;
});

DualNumber.prototype.sin = DualNumber.makeUnop(function() {
  return Math.sin(this.n);
}, function() {
  return Math.cos(this.n);
});

DualNumber.prototype.cos = DualNumber.makeUnop(function() {
  return Math.cos(this.n);
}, function() {
  return -Math.sin(this.n);
});

DualNumber.prototype.asin = DualNumber.makeUnop(function() {
  return Math.asin(this.n);
}, function() {
  return 1 / Math.sqrt(1 - this.n * this.n);
});

DualNumber.prototype.degs = DualNumber.makeUnop(function() {
  return this.n * Math.PI / 180;
}, function() {
  return Math.PI / 180;
});

DualNumber.prototype['+'] = DualNumber.makeBinop(function(other) {
  return this.n + other.n;
}, function() {
  return 1;
}, function() {
  return 1;
});

DualNumber.prototype['-'] = DualNumber.makeBinop(function(other) {
  return this.n - other.n;
}, function() {
  return 1;
}, function() {
  return -1;
});

DualNumber.prototype['*'] = DualNumber.makeBinop(function(other) {
  return this.n * other.n;
}, function(other) {
  return other.n;
}, function(other) {
  return this.n;
});

DualNumber.prototype['/'] = DualNumber.makeBinop(function(other) {
  return this.n / other.n;
}, function(other) {
  return 1 / other.n;
}, function(other) {
  return -this.n / other.n / other.n;
});

DualNumber.prototype.toBoolean = function() {
  return this.n > 0;
};

























function TurtleTrace() {
  // theta, x, y
  this.history = [{
    theta: new DualNumber(0),
    x: new DualNumber(0),
    y: new DualNumber(0)
  }];

  this.environment = {};
  this.parameterMap = {};

  this.selectedSnapshot = null;
}

TurtleTrace.prototype.render = function(can, snap, target) {
  can.width = can.width;
  var ctx = can.getContext('2d');
  ctx.fillText('Click and drag the turtle snapshots!', 0, 10);
  ctx.translate(can.width / 2, can.height / 2);
  for (var i = 0; i < this.history.length; i++) {
    var state = this.history[i];
    ctx.save();
    ctx.translate(state.x.value(), state.y.value());
    ctx.rotate(state.theta.value());
    ctx.beginPath();
    ctx.moveTo(5, 0);
    ctx.lineTo(-5, 3);
    ctx.lineTo(-5, -3);
    ctx.lineTo(5, 0);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    if (i > 0) {
      ctx.beginPath();
      ctx.moveTo(this.history[i - 1].x.value(), this.history[i - 1].y.value());
      ctx.lineTo(state.x.value(), state.y.value());
      ctx.stroke();
    }
    if (state === snap) {
      ctx.beginPath();
      ctx.moveTo(state.x.value(), state.y.value());
      ctx.lineTo(target.x.value(), target.y.value());
      ctx.stroke();
    }
  }
};

TurtleTrace.prototype.hoverSnapshot = function(target) {
  var current = null;
  for (var i = 0; i < this.history.length; i++) {
    var state = this.history[i];
    var dx = state.x['-'](target.x);
    var dy = state.y['-'](target.y);
    var l2 = dx['*'](dx)['+']( dy['*'](dy) );
    if (l2.value() < 900 && (!current || l2.value() < current[1].value())) {
      current = [state, l2];
    }
  }
  return current;
};

function runExpression(expr, trace) {
  if (expr['name']) {
    return trace.environment[expr['name']];
  } else if (expr['number']) {
    if (expr['strict']) {
      return new DualNumber(parseFloat(expr['number']));
    } else {
      eps = {};
      var name = 'eps@' + expr['span'][0].toString();
      eps[name] = 1;
      trace.parameterMap[name] = expr['span'].concat([parseFloat(expr['number'])]);
      return new DualNumber(parseFloat(expr['number']), eps);
    }
  } else if (expr['unop']) {
    var arg = runExpression(expr['arg'], trace);
    return arg[expr['unop']]();
  } else if (expr['binop']) {
    var left = runExpression(expr['left'], trace);
    var right = runExpression(expr['right'], trace);
    return left[expr['binop']](right);
  }
}

function runStatement(stmt, trace) {
  if (stmt['action']) {
    var arg = runExpression(stmt['arg'], trace);
    var state = trace.history[trace.history.length - 1];
    var theta = state.theta;
    var x = state.x;
    var y = state.y;
    switch(stmt['action']) {
    case 'forward':
      trace.history.push({
        theta: theta,
        x: x['+'](arg['*'](theta.cos())),
        y: y['+'](arg['*'](theta.sin())),
      });
      break
    case 'turn':
      trace.history.push({
        theta: theta['+'](arg),
        x: x, y: y
      });
      break
    }
  } else if (stmt['while']) {
    while (runExpression(stmt['while'], trace).toBoolean()) {
      runBlock(stmt['do'], trace);
    }
  } else if (stmt['set']) {
    trace.environment[stmt['set']] = runExpression(stmt['to'], trace);
  }
}

function runBlock(block, trace) {
  for (var i = 0; i < block.length; i++) {
    runStatement(block[i], trace);
  }
}

var MOUSE = {
  x: new DualNumber(0),
  y: new DualNumber(0),
  down: false
};

function runProgram(inputElt, outputElt) {
  var text = inputElt.value;
  var p = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    p.feed(text + '\n');
    if (p.results.length === 0) throw new Error('Parse error...');
  } catch (e) {
    outputElt.width = outputElt.width;
    outputElt.getContext('2d').fillRect(0, 0, 100, 100);
  }
  var block = p.results[0];
  var trace = new TurtleTrace();
  runBlock(block, trace);


  var snap = trace.hoverSnapshot(MOUSE);
  trace.render(outputElt, snap ? snap[0] : null, MOUSE);

  if (snap && MOUSE.down) {
    var l2 = snap[1];
    var names = Object.keys(l2.e);
    names.sort(function(a, b) {
        return trace.parameterMap[a][0] - trace.parameterMap[b][0];
        });
    var delta = 0;
    for (var j = 0; j < names.length; j++) {
      var name = names[j];
      var loc = trace.parameterMap[name];
      var dname = l2.e[name] * -0.00001 + loc[2];
      text = text.slice(0, loc[0] + delta) +
        dname.toFixed(5) + text.slice(loc[0] + loc[1] + delta);
      delta += dname.toFixed(5).length - loc[1];
    }
  }
  inputElt.value = text;
}

window.addEventListener('load', function() {
  var ta = document.getElementById('code-in');
  var can = document.getElementById('world');

  can.addEventListener('mousemove', function(e) {
    MOUSE.x = new DualNumber(e.clientX - can.offsetLeft - can.width / 2);
    MOUSE.y = new DualNumber(e.clientY - can.offsetTop - can.height / 2);
    MOUSE.down = (e.buttons === 1);
  }, false);

  window.setInterval(function() {
    runProgram(ta, can);
  }, 1);

  var egs = document.getElementsByClassName('eg');
  for (var i = 0; i < egs.length; i++) {
    var eg = egs[i];
    eg.addEventListener('click', function() {
      ta.value = this.nextSibling.nextSibling.innerHTML;
    });
  }
}, false);
