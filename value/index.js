'use strict';
var util = require('util');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
    ScriptBase.apply(this, arguments);
    this.options['skip-add'] = true;
};

util.inherits(Generator, ScriptBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
    this.generateSourceAndTest(
        'service/value',
        'spec/service',
        'services',
            this.options['skip-add'] || false
    );
};
