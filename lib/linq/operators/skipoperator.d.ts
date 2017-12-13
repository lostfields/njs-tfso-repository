import { Operator } from './operator';
export declare class SkipOperator<TEntity> extends Operator<TEntity> {
    count: number;
    constructor(count: number);
    evaluate(items: Iterable<TEntity>): IterableIterator<TEntity>;
    evaluateAsync(items: AsyncIterable<TEntity>): AsyncIterableIterator<TEntity>;
}