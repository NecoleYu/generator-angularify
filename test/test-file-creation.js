/*global describe, before, it, beforeEach */
'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var _ = require('underscore.string');

describe('Angularify generator', function () {
    var angular;
    var expected = [
        'app/404.html',
        'app/favicon.ico',
        'app/robots.txt',
        'app/styles/home.scss',
        'app/views/home/home.html',
        'app/index.html',
        '.bowerrc',
        '.editorconfig',
        '.gitignore',
        '.jshintrc',
        'Gulpfile.js',
        'package.json',
        'bower.json'
    ];
    var mockPrompts = {
        compass: true,
        bootstrap: true,
        compassBootstrap: true,
        modules: []
    };
    var genOptions = {
        'appPath': 'app',
        'skip-install': true,
        'skip-welcome-message': true,
        'skip-message': true
    };

    beforeEach(function (done) {
        helpers.testDirectory(path.join(__dirname, 'tmp'), function (err) {
            if (err) {
                done(err);
            }
            angular = helpers.createGenerator(
                'angularify:app',
                [
                    '../../app',
                    '../../common',
                    '../../controller',
                    '../../view',
                    '../../home'
                ],
                false,
                genOptions
            );
            helpers.mockPrompt(angular, mockPrompts);

            done();
        });
    });

    describe('App files', function () {
        it('should generate dotfiles', function (done) {
            angular.run({}, function () {
                helpers.assertFile(expected);
                done();
            });
        });

        it('creates expected JS files', function (done) {
            angular.run({}, function () {
                helpers.assertFile([].concat(expected, [
                    'app/app.js',
                    'app/scripts/controllers/home/home.js',
                    'test/test-main.js',
                    'test/spec/controllers/home/home.spec.js'
                ]));
                done();
            });
        });

        it('creates CoffeeScript files', function (done) {
            if (angular.env.options.coffee) {
                angular.run([], function () {
                    helpers.assertFile([].concat(expected, [
                        'app/app.coffee',
                        'app/scripts/controllers/home/home.coffee',
                        'test/test-main.js',
                        'test/spec/controllers/home/home.spec.coffee'
                    ]));
                    done();
                });
            } else {
                done();
            }
        });
    });


    describe('Service Subgenerators', function () {
        var generatorTest = function (generatorType, specType, targetDirectory, scriptNameFn, specNameFn, suffix, done) {
            var name = 'foo';
            var fileName = name;
            var deps = [path.join('../..', generatorType)];
            var genTester = helpers.createGenerator('angularify:' + generatorType, deps, [name], genOptions);

            if (specType == "service") {
                fileName += ("." + generatorType);
            }

            angular.run([], function () {
                genTester.run([], function () {
                    helpers.assertFileContent([
                        [
                            path.join('app/scripts', targetDirectory, fileName + '.js'),
                            new RegExp(
                                    generatorType + '\\(\'' + scriptNameFn(name) + suffix + '\'',
                                'g'
                            )
                        ],
                        [
                            path.join('test/spec', targetDirectory, fileName + '.spec.js'),
                            new RegExp(
                                    'describe\\(\"' + _.classify(specType) + ': ' + specNameFn(name) + suffix + '\"',
                                'g'
                            )
                        ]
                    ]);
                    done();
                });
            });
        };

        it('should generate a new controller', function (done) {
            generatorTest('controller', 'controller', 'controllers/foo', _.classify, _.classify, 'Ctrl', done);
        });

        it('should generate a new directive', function (done) {
            generatorTest('directive', 'directive', 'directives', _.camelize, _.camelize, '', done);
        });

        it('should generate a new filter', function (done) {
            generatorTest('filter', 'filter', 'filters', _.camelize, _.camelize, '', done);
        });

        ['constant', 'factory', 'provider', 'value'].forEach(function (t) {
            it('should generate a new ' + t, function (done) {
                generatorTest(t, 'service', 'services', _.camelize, _.camelize, '', done);
            });
        });

        it('should generate a new service', function (done) {
            generatorTest('service', 'service', 'services', _.capitalize, _.capitalize, '', done);
        });
    });

    describe('View', function () {
        it('should generate a new view', function (done) {
            var angularView;
            var deps = ['../../view'];
            angularView = helpers.createGenerator('angularify:view', deps, ['foo'], genOptions);

            helpers.mockPrompt(angularView, mockPrompts);
            angularView.run([], function () {
                helpers.assertFile(['app/views/foo/foo.html']);
                done();
            });
        });

        it('should generate a new view in subdirectories', function (done) {
            var angularView;
            var deps = ['../../view'];
            angularView = helpers.createGenerator('angularify:view', deps, ['foo/bar'], genOptions);

            helpers.mockPrompt(angularView, mockPrompts);
            angularView.run([], function () {
                helpers.assertFile(['app/views/foo/bar.html']);
                done();
            });
        });
    });
});
