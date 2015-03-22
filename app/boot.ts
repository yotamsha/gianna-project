/// <reference path="./library.d.ts" />

import Application = require('./application');
'use strict';

Application.initializeComponents();

var path = requirejs.toUrl('./');

if (path.substring(0, 2) === './') {
  path = path.substring(2);
}

if (path.charAt(path.length - 1) === '/') {
  path = path.substring(0, path.length - 1);
}

new Application(path).bootstrap();
