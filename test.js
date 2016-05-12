'use strict';

let test = require('tape');
let Obj = require('./obj');

test('Obj.js', t => {
  t.plan(4);

  t.equal(typeof Obj, 'object');

  t.test('#prop()', q => {
    q.plan(1);
    isFn(q, Obj.prop, '#prop');
  });

  t.test('#hasProp()', q => {
    q.plan(6);
    isFn(q, Obj.hasProp, '#hasProp');

    var yep = Symbol('yep');
    var nope = Symbol('nope');
    var Parent = Object.create(Obj);
    Parent.pProp = 1;
    var Child = Object.create(Parent);
    Child.cProp = 2;
    Child[yep] = 'here i am!';
    var Grandchild = Object.create(Child);
    Grandchild.gcProp = 3;

    q.ok(Grandchild.hasProp('pProp'), `has "pProp" (inherited from Parent)`);
    q.ok(Grandchild.hasProp('cProp'), `has "cProp" (inherited from Child)`);
    q.ok(Grandchild.hasProp(yep), `has "Symbol(yep)" (inherited from Child)`);
    q.notOk(Grandchild.hasProp(nope), `doesn't have "Symbol(nope)" (not defined)`);
    q.ok(Grandchild.hasProp('gcProp'), `has "gcProp" (set on self)`);
  });

  t.test('#chainHasProp()', q => {
    q.plan(6);
    isFn(q, Obj.chainHasProp, '#chainHasProp');

    var yep = Symbol('yep');
    var nope = Symbol('nope');
    var Parent = Object.create(Obj);
    Parent.pProp = 1;
    var Child = Object.create(Parent);
    Child.cProp = 2;
    Child[yep] = 'test';
    var Grandchild = Object.create(Child);
    Grandchild.gcProp = 3;

    q.ok(Grandchild.chainHasProp('pProp'), `chain has "pProp" (inherited from Parent)`);
    q.ok(Grandchild.chainHasProp('cProp'), `chain has "cProp" (inherited from Child)`);
    q.ok(Grandchild.chainHasProp(yep), `chain has "Symbol(yep)" (inherited from Child)`);
    q.notOk(Grandchild.hasProp(nope), `doesn't have "Symbol(nope)" (not defined)`);
    q.notOk(Grandchild.chainHasProp('gcProp'), `chain doesn't have "gcProp" (set on self)`);
  });


});

//// HELPERS ///////////////////////////////////////////////////////////////////

function isFn(test, target, name) {
    test.equal(typeof target, 'function', `${name} is a function`);
}
