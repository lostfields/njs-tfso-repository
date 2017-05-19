﻿import { IExpression, Expression, ExpressionType } from './expression';
import { ILiteralExpression, LiteralExpression } from './literalexpression';
import { ICompoundExpression } from './compoundexpression';
import { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
import { IMemberExpression, MemberExpression } from './memberexpression';
import { IMethodExpression, MethodExpression } from './methodexpression';
import { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './unaryexpression';
import { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './binaryexpression';
import { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './logicalexpression';
import { IConditionalExpression } from './conditionalexpression';
import { IArrayExpression, ArrayExpression } from './arrayexpression';

import { LambdaExpression } from './lambdaexpression';
import { ReducerVisitor } from './reducervisitor';

export class ODataVisitor extends ReducerVisitor {
    constructor(private _it?: Object) {
        super();
    }
    
    public visitOData(filter: string): IExpression {
        return super.visitOData(filter);
    }

    public get it(): string {
        return "";
    }

    public visitMethod(expression: IMethodExpression): IExpression {
        let parameters = expression.parameters.map((arg) => arg.accept(this)),
            caller: IExpression = undefined,
            name: string = undefined

        
        let params: Array<any>;

        // routine to get all parameters that is a literal, eg; solvable
        let getParams = (expression: IMethodExpression, ...typeofs: Array<string>) => {
            let params: Array<any> = null,
                getType = (t) => {
                    if (typeof t == 'object') {
                        if (t.getTime && t.getTime() >= 0)
                            return 'date';
                    }

                    return typeof t;
                };

            try {
                if (parameters.every(expression => expression.type == ExpressionType.Literal) == true) {
                    params = parameters.map(expr => (<LiteralExpression>expr).value);

                    if (new RegExp('^' + typeofs.map(t => t.endsWith('?') ? '(' + t.slice(0, -1) + ')?' : t).join(';') + ';?$').test(params.map(p => getType(p)).join(';') + ';') == false)
                        throw new TypeError(params.map(p => getType(p)).join(', '));
                }
                else if ((parameters.length == typeofs.length) == false) {
                    throw new Error();
                }
            }
            catch (ex) {
                throw new Error('Method "' + expression.name + '" requires parameters of (' + typeofs.join(', ') + ')' + (ex.name == 'TypeError' ? ', but got "' + ex.message + '"' : ''));
            }

            return params;
        }

        switch (expression.name) {
            // String Functions
            case 'substringof': // bool substringof(string po, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]).indexOf(String(params[1])) >= 0);

                break;

            case 'endswith': // bool endswith(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]).endsWith(String(params[1])));

                break;

            case 'startswith': // bool startswith(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]).startsWith(String(params[1])));

                break;

            case 'length': // int length(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new LiteralExpression(String(params[0]).length);
                
                break;

            case 'indexof': // int indexof(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]).indexOf(String(params[1])));

                break;

            case 'replace': // string replace(string p0, string find, string replace)
                if ((params = getParams(expression, 'string', 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));

                break;

            case 'substring': // string substring(string p0, int pos, int? length)
                if ((params = getParams(expression, 'string', 'number', 'number?')) != null)
                    return new LiteralExpression(String(params[0]).replace(String(params[1]), String(params[2])));

                break;
                    
            case 'tolower': // string tolower(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new LiteralExpression(String(params[0]).toLowerCase());

                break;

            case 'toupper': // string toupper(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new LiteralExpression(String(params[0]).toUpperCase());

                break;

            case 'trim': // string trim(string p0)
                if ((params = getParams(expression, 'string')) != null)
                    return new LiteralExpression(String(params[0]).trim());

                break;

            case 'concat': // string concat(string p0, string p1)
                if ((params = getParams(expression, 'string', 'string')) != null)
                    return new LiteralExpression(String(params[0]) + String(params[1]));

                break;

            // Date Functions
            case 'day': // int day(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getDate());

                break;
                        
            case 'hour': // int hour(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getUTCHours());

                break;

            case 'minute': // int minute(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getUTCMinutes());

                break;

            case 'month': // int month(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getMonth() + 1);

                break;

            case 'second': // int second(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getSeconds());

                break;

            case 'year': // int year(DateTime p0)
                if ((params = getParams(expression, 'date')) != null)
                    return new LiteralExpression((<Date>params[0]).getFullYear());

                break;

            // Math Functions
            case 'round': // number round(number p0)
                if ((params = getParams(expression, 'number')) != null)
                    return new LiteralExpression(Math.round(Number(params[0])));

                break;

            case 'floor': // number floor(number p0)
                if ((params = getParams(expression, 'number')) != null)
                    return new LiteralExpression(Math.floor(Number(params[0])));

                break;

            case 'ceiling': // number ceiling(number p0)
                if ((params = getParams(expression, 'number')) != null)
                    return new LiteralExpression(Math.ceil(Number(params[0])));

                break;

            // Type Functions
            //case 'isof': // bool IsOf(type p0) | bool IsOf(expression p0, type p1)

            default:
                throw new Error('OData visitor does not support function "' + expression.name + '"');
        }

        return new MethodExpression(expression.name, parameters, caller);
    }

    public static evaluate(expression: IExpression, it: Object): any {
        let reducer = new ODataVisitor(it),
            resultExpression = reducer.visit(expression),
            result = reducer.evaluate(resultExpression);

        return result;
    }

    protected evaluate(expression: IExpression, it: Object = null): any {
        var value: any = null;

        if (it == null)
            it = this._it;

        switch (expression.type) {
            case ExpressionType.Identifier:
                let identifier = (<IIdentifierExpression>expression);

                if (it != null && it.hasOwnProperty(identifier.name) == true) {
                    value = it[identifier.name];
                }
                break;

            case ExpressionType.Member:
                let member = <IMemberExpression>expression,
                    name: string;

                if (it != null) {
                    if (member.object.type == ExpressionType.Identifier && it.hasOwnProperty(name = (<IIdentifierExpression>member.object).name) && typeof it[name] == 'object')
                        value = this.evaluate(member.property, it[name]);
                }

                break;
            
            default:
                value = super.evaluate(expression);
                break;
        }

        return value;
    }
}