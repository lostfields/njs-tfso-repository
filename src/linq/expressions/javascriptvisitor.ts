﻿import { IExpression, Expression, ExpressionType } from './expression';
import { ILiteralExpression, LiteralExpression } from './literalexpression';
import { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
import { IMemberExpression, MemberExpression } from './memberexpression';
import { IMethodExpression, MethodExpression } from './methodexpression';

import { LambdaExpression } from './lambdaexpression';
import { ReducerVisitor } from './reducervisitor';

export class JavascriptVisitor extends ReducerVisitor {
    constructor() {
        super();
    }

    public visitMember(expression: IMemberExpression): IExpression {
        return super.visitMember(expression)
    }
    
    public visitMethod(expression: IMethodExpression): IExpression {
        let parameters = expression.parameters.map((arg) => arg.accept(this)),
            caller: IExpression = expression.caller ? expression.caller.accept(this) : null,
            name: string = expression.name

        if (caller)
        {
            let value: any = undefined,
                params = parameters.map(expr => expr.type == ExpressionType.Literal ? (<ILiteralExpression>expr).value : undefined);

            switch (caller.type)
            {
                case ExpressionType.Identifier: 
                    switch ((<IIdentifierExpression>caller).name)
                    {
                        case 'Math':
                            switch (name)
                            {
                                case 'abs':
                                case 'acos':
                                case 'acosh':
                                case 'asin':
                                case 'asinh':
                                case 'atan':
                                case 'atanh':
                                case 'atan2':
                                case 'cbrt':
                                case 'ceil':
                                case 'clz32':
                                case 'cos':
                                case 'cosh':
                                case 'exp':
                                case 'expm1':
                                case 'floor':
                                case 'fround':
                                case 'hypot':
                                case 'imul':
                                case 'log':
                                case 'log1p':
                                case 'log10':
                                case 'log2':
                                case 'max':
                                case 'min':
                                case 'pow':
                                case 'random':
                                case 'round':
                                case 'sign':
                                case 'sin':
                                case 'sinh':
                                case 'sqrt':
                                case 'tan':
                                case 'tanh':
                                case 'trunc':
                                    return new LiteralExpression(Math[name].call(null, ...params));
                            }
                    }

                    break;

                case ExpressionType.Literal:
                    switch (typeof (value = (<ILiteralExpression>caller).value))
                    {
                        case 'string':
                            switch (name)
                            {
                                case 'charAt':
                                case 'charCodeAt':
                                case 'concat':
                                case 'includes':
                                case 'endsWith':
                                case 'indexOf':
                                case 'lastIndexOf':
                                case 'localeCompare':
                                case 'match':
                                case 'normalize':
                                case 'padEnd':
                                case 'padStart':
                                case 'repeat':
                                case 'replace':
                                case 'search':
                                case 'slice':
                                case 'split':
                                case 'startsWith':
                                case 'substr':
                                case 'substring':
                                case 'toLocaleLowerCase':
                                case 'toLocaleUpperCase':
                                case 'toLowerCase':
                                case 'toString':
                                case 'toUpperCase':
                                case 'trim':
                                    return new LiteralExpression(String.prototype[name].call(value, ...params));

                                default:
                                    break;
                            }

                            break;

                        case 'number':
                            switch (name)
                            {
                                case 'isNaN':
                                case 'isFinitie':
                                case 'isInteger':
                                case 'isSafeInteger':
                                case 'parseFloat':
                                case 'parseInt':
                                case 'toExponential':
                                case 'toFixed':
                                case 'toLocaleString':
                                case 'toPrecision':
                                case 'toString':
                                    return new LiteralExpression(Number.prototype[name].call(value, ...params));
                            }
                            break;

                        case 'object':
                            if (value.getTime && value.getTime() >= 0)
                                break;

                            if (Array.isArray(value) == true)
                                break;

                            break;


                    }

                    break;
            }
        }

        return new MethodExpression(name, parameters, caller);
    }

    public static evaluate(predicate: (it: Object, ...param: Array<any>) => any, it: Object): any
    public static evaluate(expression: IExpression, it: Object): any
    public static evaluate(expression: IExpression | ((it: Object, ...param: Array<any>) => any), it: Object): any {
        let reducer = new JavascriptVisitor(),
            result: IExpression;

        if (typeof expression == 'function')
            expression = reducer.visitLambda(expression);

        result = reducer.evaluate(expression, it);

        return result.type == ExpressionType.Literal ? (<ILiteralExpression>result).value : undefined;
    }

}