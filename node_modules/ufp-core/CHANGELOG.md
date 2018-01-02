# Ufp-Core-Frontend Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [unreleased]

## [0.4.6] (unreleased)
- new: configure html script injection in project.json

## [0.4.5] (unreleased)
- new: enable sw-precache progressive webapp plugin

## [0.4.4] (unreleased)

- fix: production build, minification
- new: ?debug=true parameter for rendered pages enables redux-logger and redux-devtools
- new ufp-start:dist to serve static production build (run ufp-update to make available in project)


## [0.4.3]

- bugfix runtime

## [0.4.2]

- bugfix

## [0.4.1]

- bugfix
- update version react 16.2

## [0.4.0]

- introduction of promises for UfpCore methods
- onConfigure for
- updated scripts - execute 'npm run ufp-update'
- internal change: build output controllable using log4js 
- change: rename modules/rect to modules/ufp-react
- change: rename modules/redux to modules/ufp-redux
- new: UfpConfig: deep object setting/getting
- react16 dependency
- change: validate configuration objects using ReactPropTypes
- test setup utility script command 'ufp-util:createTests'
- UfpMiddlewareUtils

- CHANGE: include the following in the test-bundler.js to accomodate enzyme-3.x compatibility until
    a more convenient way is in place

        import 'ufp-core/ext/presets/default/config/karma.setup.js'


## [0.3.5]

- fix: Macro handling eslint
    replace Macro: **@ROUTER3_DYNAMICINCLUDE** with **ROUTER3_DYNAMICINCLUDE** 

## [0.3.4]

- ufp-test script command providing karma test setup
- ufp-make build command with lots of lint/test outputs for CI
- release pipeline for ufp-core testing, linting, packaging with examples

## [0.3.3]

- remove ufp-optimizer as required dependency (too long install)
- include required minimal engine versions in package.json

## [0.3.2]

- move from bitbucket to github

## [0.3.1] - 2017-09-19

- minor readme adjustment

## [0.3.0] - 2017-09-19

- initialstate callback
- rename Runfest.js to Runfest.js abbreviation for RUNtimemaniFEST
- disallow direct imports, enforce use of index.js of bundles


## [0.2.2] - 2017-09-19

- remove update dependencies during installation
- adjusted readme

## [0.2.1] - 2017-09-19

- include src in release

## [0.2.0] - 2017-09-19

- npm release

## [0.1.1] - 2017-08-23

- eslint

## [0.1.0] - 2017-08-01

- Initial Release

[Unreleased]: https://bitbucket.org/frontendsolutions/ufp-core/branches/compare/0.4.6...develop
[0.4.6]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.4.5...0.4.6
[0.4.5]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.4.4...0.4.5
[0.4.4]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.4.3...0.4.4
[0.4.3]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.4.2...0.4.3
[0.4.2]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.4.1...0.4.2
[0.4.1]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.4.0...0.4.1
[0.4.0]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.3.4...0.4.0
[0.3.5]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.3.4...0.3.5
[0.3.4]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.3.3...0.3.4
[0.3.3]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.3.2...0.3.3
[0.3.2]: https://github.com/FrontendSolutionsGmbH/ufp-core-frontend/compare/0.3.1...0.3.2
[0.3.1]: https://bitbucket.org/frontendsolutions/ufp-core/branches/compare/0.3.0%0D0.3.1
[0.3.0]: https://bitbucket.org/frontendsolutions/ufp-core/branches/compare/0.2.2%0D0.3.0
[0.2.2]: https://bitbucket.org/frontendsolutions/ufp-core/branches/compare/0.2.1%0D0.2.2
[0.2.1]: https://bitbucket.org/frontendsolutions/ufp-core/branches/compare/0.2.0%0D0.2.1
[0.2.0]: https://bitbucket.org/frontendsolutions/ufp-core/branches/compare/v0.1.1%0D0.2.0
[0.1.1]: https://bitbucket.org/frontendsolutions/ufp-core/branches/compare/v0.1.1%0Dv0.1.0
[0.1.0]: https://bitbucket.org/frontendsolutions/ufp-core/commits/v0.1.0
