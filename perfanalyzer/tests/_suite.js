"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var assert = require("assert");
var ttm = require("azure-pipelines-task-lib/mock-test");
describe('Sample task tests', function () {
    before(function () {
    });
    after(function () {
    });
    it('should succeed with simple inputs', function (done) {
        // Add success test here
    });
    it('it should fail if tool returns 1', function (done) {
        // Add failure test here
    });
});
it('it should fail if tool returns 1', function (done) {
    this.timeout(1000);
    var tp = path.join(__dirname, 'failure.js');
    var tr = new ttm.MockTestRunner(tp);
    tr.run();
    console.log(tr.succeeded);
    assert.equal(tr.succeeded, false, 'should have failed');
    assert.equal(tr.warningIssues.length, 0, "should have no warnings");
    assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
    assert.equal(tr.errorIssues[0], 'Bad input was given', 'error issue output');
    assert.equal(tr.stdout.indexOf('Hello bad'), -1, "Should not display Hello bad");
    done();
});
//# sourceMappingURL=_suite.js.map