// NOTE: JavaScript uses the terms "keys" and "properties" to refer to values
// assigned to an object. For the sake of simplicity, Obj.js refers to all such
// values as "keys".
//
// Additinoally, some JavaScript builtins only support string keys, while others
// support both strings and Symbols. In order to streamline the API, Obj.js
// supports supports string and Symbol keys interchangably.

var Obj = Object.create(Object.prototype);

Obj.make = function make() {
  return Object.create(this);
};

Obj.prop = function(name, val) {
  Object.defineProperty(this, name, {
    value: val,
    configurable: true,
    enumerable: true,
    writable: true,
  });
};

Obj.fn = function fn(obj, name, func) {
  if (this !== Obj) {
    func = name;
    name = obj;
    obj = this;
  }

  Object.defineProperty(obj, name, {
    value: func,
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

Obj.gset = function gset(opts) {
  var config = {
    configurable: true,
    enumerable: true,
  }

  if (typeof opts.get == 'function' && typeof opts.set == 'function') {
    Object.assign(config, {
      get: opts.get,
      set: opts.set,
    });
  } else if (typeof opts.get == 'function') {
    Object.assign(config, {
      get: opts.get,
      set: undefined,
    });
  } else if (typeof opts.set == 'function') {
    Object.assign(config, {
      get: undefined,
      set: opts.set,
    });
  }

  return Object.defineProperty(this, opts.name, config);
};

Obj.get = function get(name, fn) {
    return Obj.gset.call(this, {name: name, get: fn});
};

Obj.set = function set(name, fn) {
    return Obj.gset.call(this, {name: name, set: fn});
};

// http://jamesallardice.com/how-to-check-if-a-javascript-object-has-a-certain-value/
Obj.hasOwnVal = function hasOwnVal(val) {
  var match = false;
  for (var prop in this) {
    if (this.hasOwnProperty(prop) && this[prop] === val) {
      match = true;
      break;
    }
  }

  return match;
};

Obj.hasOwnProp = function hasOwnProp(key) {
  return Obj.ownKeys.call(this).indexOf(key) !== -1;
};

// Returns an array of all keys, regardless of enumerability or property type.
Obj.ownKeys = function allKeys() {
  return Array.prototype.concat(
      Object.getOwnPropertyNames(this),
      Object.getOwnPropertySymbols(this)
  );
}

// Returns a Boolean indicating whether or not the specified key (string or
// Symbol) is present on the current object or it's prototype chain.
//
// TODO: Need a config object to allow callers to specify whether or not they
// want to look up non-enumerables
Obj.hasProp = function hasProp(key) {
  return key in this;
};

// Check if the prototype chain (but not the specified object) has a given
// property.
Obj.chainHasProp = function chainHasProp(key) {
  let present = false;
  let proto = Object.getPrototypeOf(this);

  if (proto && Obj.hasOwnProp.call(proto, key)) {
    present = true;
  }

  return present || ( proto ? Obj.chainHasProp.call(proto, key) : false );
};
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
//
// Only check if the property exists on the prototype
Obj.protoHasProp = function protoHasProp(key) {
  return this.prototype ? this.hasOwnProp.call(this.prototype, key) : false;
};

module.exports = Obj;
