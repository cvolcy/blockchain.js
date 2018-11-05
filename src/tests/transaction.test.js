const assert = require('assert');
const Transaction = require("../models/transaction");
const { createSignedTx, signingKey } = require('./helpers');

let txObject = null;

beforeEach(function () {
    txObject = new Transaction('fromAddress', 'toAddress', 9999);
});

describe('Transaction class', function () {
    describe('Constructor', function () {
        it('should automatically set the current date', function () {
            const actual = txObject.timestamp;
            const minTime = Date.now() - 1000;
            const maxTime = Date.now() + 1000;

            assert(actual > minTime && actual < maxTime, 'Tx does not have a good timestamp');
        });


        it('should correctly save from, to and amount', function () {
            txObject = new Transaction('a1', 'b1', 10);

            assert.equal(txObject.fromAddress, 'a1');
            assert.equal(txObject.toAddress, 'b1');
            assert.equal(txObject.amount, 10);
        });
    });

    describe('Calculate hash', function () {
        it('should correct calculate the SHA256', function () {
            txObject = new Transaction('a1', 'b1', 10);
            txObject.timestamp = 1;

            assert.equal(
                txObject.calculateHash(),
                '6c8dc350366907f05c7416ff88b136a3324a19e2901990d4401149c86e82eb2c'
            );
        });

        it('should change when we tamper with the tx', function () {
            txObject = new Transaction('a1', 'b1', 10);

            const originalHash = txObject.calculateHash();
            txObject.amount = 100;

            assert.notEqual(
                txObject.calculateHash(),
                originalHash
            );
        });
    });

    describe('isValid', function () {
        it('should throw error without signature', function () {
            assert.throws(() => { txObject.isValid() }, Error);
        });

        it('should correctly sign transactions', function () {
            txObject = createSignedTx();

            assert.equal(
                txObject.signature,
                '3046022100862e908cea09715cd835d24bc777f0512133471aa72c' +
                '3fd961ee6b4ec8989c0602210085b88c854969b9fa8fdadf5558f1' +
                'ca4490a938c472641a733d9c16c31a27a346'
            );
        });

        it('should not sign transactions for other wallets', function () {
            txObject = new Transaction('not a correct wallet key', 'wallet2', 10);
            txObject.timestamp = 1;

            assert.throws(() => {
                txObject.signTransaction(signingKey);
            }, Error);
        });

        it('should detect badly signed transactions', function () {
            txObject = createSignedTx();

            // Tamper with it & it should be invalid!
            txObject.amount = 100;
            assert(!txObject.isValid());
        });

        it('should return true with correctly signed tx', function () {
            txObject = createSignedTx();
            assert(txObject.isValid());
        });

        it('should fail when signature is empty string', function () {
            txObject.signature = '';
            assert.throws(() => { txObject.isValid() }, Error);
        });

        it('should return true for mining rewards', function () {
            txObject.fromAddress = null;
            assert(txObject.isValid());
        })
    });
});