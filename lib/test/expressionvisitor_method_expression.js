"use strict";
var assert = require('assert');
var Expr = require('./../expressions/expressionvisitor');
describe("When using ExpressionVisitor for method Lambda expression", function () {
    var visitor, expr;
    beforeEach(function () {
        visitor = new Expr.ExpressionVisitor;
    });
    it("it should return a method expression", function () {
        expr = visitor.visitLambda(function (str) { return str.indexOf("a"); });
        assert.ok(expr.type == Expr.ExpressionType.Method, "Expected a MethodExpression");
        assert.ok(expr.name == "indexOf", "Expected method name 'indexOf'");
        assert.ok(expr.parameters.length == 1, "Expected one argument");
        assert.ok(expr.caller.type == Expr.ExpressionType.Identifier, "Expected a identifier as caller");
    });
    it("it should return a method expression for nested calls", function () {
        expr = visitor.visitLambda(function (str) { return str.indexOf("a").toString(); });
        assert.ok(expr.type == Expr.ExpressionType.Method, "Expected a MethodExpression");
        assert.ok(expr.name == "toString", "Expected method name 'toString'");
        assert.ok(expr.parameters.length == 0, "Expected zero arguments");
        assert.ok(expr.caller.type == Expr.ExpressionType.Method, "Expected a new method as caller");
        assert.ok((expr.caller).name == "indexOf", "Expected method name 'indexOf'");
        assert.ok((expr.caller).parameters.length == 1, "Expected one argument");
        assert.ok((expr.caller).caller.type == Expr.ExpressionType.Identifier, "Expected a identifier as caller");
    });
});
//# sourceMappingURL=expressionvisitor_method_expression.js.map