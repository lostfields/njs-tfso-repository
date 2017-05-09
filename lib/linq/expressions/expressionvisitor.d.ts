import { IExpression } from './expression';
import { ILiteralExpression } from './literalexpression';
import { ICompoundExpression } from './compoundexpression';
import { IIdentifierExpression } from './identifierexpression';
import { IMemberExpression } from './memberexpression';
import { IMethodExpression } from './methodexpression';
import { IUnaryExpression } from './unaryexpression';
import { IBinaryExpression } from './binaryexpression';
import { ILogicalExpression } from './logicalexpression';
import { IConditionalExpression } from './conditionalexpression';
import { IArrayExpression } from './arrayexpression';
import { LambdaExpression } from './lambdaexpression';
export declare class ExpressionStack {
    private items;
    private count;
    constructor();
    length(): number;
    push(item: IExpression): void;
    pop(): IExpression;
    peek(): IExpression;
}
export declare class ExpressionVisitor {
    protected _lambdaExpression: LambdaExpression;
    private _expressionStack;
    constructor();
    readonly stack: ExpressionStack;
    visitOData(filter: string): IExpression;
    visitLambda(predicate: (it: Object, ...param: Array<any>) => any): IExpression;
    visit(expression: IExpression): IExpression;
    visitLiteral(expression: ILiteralExpression): IExpression;
    visitArray(expression: IArrayExpression): IExpression;
    visitCompound(expression: ICompoundExpression): IExpression;
    visitIdentifier(expression: IIdentifierExpression): IExpression;
    visitBinary(expression: IBinaryExpression): IExpression;
    visitMethod(expression: IMethodExpression): IExpression;
    visitUnary(expression: IUnaryExpression): IExpression;
    visitMember(expression: IMemberExpression): IExpression;
    visitLogical(expression: ILogicalExpression): IExpression;
    visitConditional(expression: IConditionalExpression): IExpression;
    /**
     * transform odata expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @see
     * http://www.odata.org/documentation/odata-version-2-0/uri-conventions/
     * https://github.com/auth0/node-odata-parser/blob/master/src/odata.pegjs
     *
     * @param filter odata filter, eg; Name eq 'John' and LastName lt 'Doe'
     */
    private transformOData(expression);
    /**
     * transforming jsep expression ast tree to our internal ast tree to make it easier to swap expression parser at a later time
     * @param expression jsep expression object
     */
    private transform(expression);
}
export { IExpression, Expression, ExpressionType } from './expression';
export { ILiteralExpression, LiteralExpression } from './literalexpression';
export { ICompoundExpression } from './compoundexpression';
export { IIdentifierExpression, IdentifierExpression } from './identifierexpression';
export { IMemberExpression, MemberExpression } from './memberexpression';
export { IMethodExpression, MethodExpression } from './methodexpression';
export { IUnaryExpression, UnaryExpression, UnaryOperatorType, UnaryAffixType } from './unaryexpression';
export { IBinaryExpression, BinaryExpression, BinaryOperatorType } from './binaryexpression';
export { ILogicalExpression, LogicalExpression, LogicalOperatorType } from './logicalexpression';
export { IConditionalExpression } from './conditionalexpression';
export { IArrayExpression, ArrayExpression } from './arrayexpression';
