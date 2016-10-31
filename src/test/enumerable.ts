﻿import * as assert from 'assert';
import Enumerable, { IEnumerable } from './../linq/enumerable';

interface ICar {

    id: number
    location: string

    registrationYear: number
}

describe("When using Enumerable", () => {
    var list: Array<ICar>;

    beforeEach(() => {
        list = [
            <ICar>{ id: 1, location: 'SKIEN', registrationYear: 2016 },
            <ICar>{ id: 2, location: 'PORSGRUNN', registrationYear: 2010 },
            <ICar>{ id: 3, location: 'PORSGRUNN', registrationYear: 2005 },
            <ICar>{ id: 4, location: 'LANGESUND', registrationYear: 2004 },
            <ICar>{ id: 5, location: 'BREVIK', registrationYear: 2009 },
            <ICar>{ id: 6, location: 'BREVIK', registrationYear: 2014 },
            <ICar>{ id: 7, location: 'HEISTAD', registrationYear: 2013 },
            <ICar>{ id: 8, location: 'LARVIK', registrationYear: 2009 }
        ];        
    })

    it("should take top 1", () => {
        var ar = new Enumerable(list).take(1).toArray();

        assert.ok(ar.length == 1);
    });

    it("should skip 5", () => {
        var ar = new Enumerable(list).skip(5).toArray();

        assert.ok(ar[0].id == 6);
    });

    it("should skip 5 and take 3", () => {
        var ar = new Enumerable(list).skip(5).take(3).toArray();

        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    });

    it("should order by a property", () => {
        var ar = new Enumerable(list).orderBy(it => it.location).toArray();
        
        assert.deepEqual(ar.map(item => item.location), ["BREVIK", "BREVIK", "HEISTAD", "LANGESUND", "LARVIK", "PORSGRUNN", "PORSGRUNN", "SKIEN"]);
    })

    it("should be able to iterate", () => {
        var ar = new Enumerable(list).take(3);

        assert.equal(Array.from(ar).length, 3);
    })

    it("should just work", () => {
        let query: IEnumerable<ICar> = new Enumerable<ICar>();

        query.skip(5)
        query.take(3);
        
        var ar = query.toArray(list);

        assert.ok(ar.length == 3);
        assert.ok(ar[0].id == 6);
    })

    it("should iterate through operations", () => {
        let query: IEnumerable<ICar> = new Enumerable<ICar>();

        query.skip(5);
        query.take(3);

        var operations = (<Enumerable<ICar>>query).operations.values();

        var count = 0;
        for (let operator of operations) {
            if (operator) {
                count++;
            }
        }

        assert.equal(count, 2);
    })
});