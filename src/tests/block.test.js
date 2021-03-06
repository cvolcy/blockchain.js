const assert = require('assert');
const Block = require("../models/block");
const Transaction = require("../models/transaction");
const { createSignedTx } = require('./helpers');

let blockObj = null;

beforeEach(function () {
    blockObj = new Block(1000, [createSignedTx()], 'a1');
});

describe('Block class', function () {
    describe('Constructor', function () {
        it('should correctly save parameters', function () {
            assert.equal(blockObj.previousHash, 'a1');
            assert.equal(blockObj.timestamp, 1000);
            assert.deepEqual(blockObj.transactions, [createSignedTx()]);
            assert.equal(blockObj.nonce, 0);
        });
    });

    describe('Calculate hash', function () {
        it('should correctly calculate the SHA256', function () {
            blockObj.timestamp = 1;
            blockObj.mineBlock(1);

            assert.equal(
                blockObj.hash,
                '021cc45e133db78cf85e323a5fb70668b9169b3e6532c1e8af4d549425816c9a'
            );
        });

        it('should change when we tamper with the tx', function () {
            const origHash = blockObj.calculateHash();
            blockObj.timestamp = 100;

            assert.notEqual(
                blockObj.calculateHash(),
                origHash
            );
        });
    });

    describe('has valid transactions', function () {
        it('should return true with all valid tx', function () {
            blockObj.transactions = [
                createSignedTx(),
                createSignedTx(),
                createSignedTx(),
            ];

            assert(blockObj.hasValidTransactions());
        });

        it('should return false when a single tx is bad', function () {
            const badTx = createSignedTx();
            badTx.amount = 1337;

            blockObj.transactions = [
                createSignedTx(),
                badTx
            ];

            assert(!blockObj.hasValidTransactions());
        });
    });
});