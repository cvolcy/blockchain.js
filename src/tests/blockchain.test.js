const assert = require('assert');
const Blockchain = require("../blockchain");
const Transaction = require("../models/transaction");
const { createSignedTx, signingKey, createBlockchainWithTx } = require('./helpers');

let blockchain = new Blockchain();

const baseDifficulty = 2;
const baseReward = 100;

beforeEach(function () {
    blockchain = new Blockchain(baseDifficulty, baseReward);
});

describe('Blockchain class', function () {
    describe('Constructor', function () {
        it('should properly initialize fields', function () {
            assert.equal(blockchain.difficulty, baseDifficulty);
            assert.deepEqual(blockchain.pendingTransactions, []);
            assert.equal(blockchain.reward, baseReward);
        });
    });

    describe('addTransaction', function () {
        it('should correctly add new tx', function () {
            const validTx = createSignedTx();
            blockchain.addTransaction(validTx);

            assert.deepEqual(blockchain.pendingTransactions[0], validTx);
        });

        it('should fail for tx without from address', function () {
            const validTx = createSignedTx();
            validTx.fromAddress = null;

            assert.throws(() => { blockchain.addTransaction(validTx) }, Error);
        });

        it('should fail for tx without to address', function () {
            const validTx = createSignedTx();
            validTx.toAddress = null;

            assert.throws(() => { blockchain.addTransaction(validTx) }, Error);
        });

        it('should fail when tx is not valid', function () {
            const validTx = createSignedTx();
            validTx.amount = 1000;

            assert.throws(() => { blockchain.addTransaction(validTx) }, Error);
        });
    });

    describe('wallet balance', function () {
        it('should give mining rewards', function () {
            const validTx = createSignedTx();
            blockchain.addTransaction(validTx);
            blockchain.addTransaction(validTx);

            blockchain.minePendingTransactions("b2");

            assert.equal(blockchain.getBalanceOfAddress("b2"), 100);
        });

        it('should correctly reduce wallet balance', function () {
            const walletAddr = signingKey.getPublic('hex');
            blockchain = createBlockchainWithTx(baseDifficulty, baseReward);

            blockchain.minePendingTransactions(walletAddr);
            assert.equal(blockchain.getBalanceOfAddress(walletAddr), 80);
        });
    });

    describe('helper functions', function () {
        it('should correctly set first block to genesis block', function () {
            assert.deepEqual(blockchain.chain[0], blockchain.createGenesisBlock());
        });
    });

    describe('isChainValid', function () {
        it('should return true if no tampering', function () {
            blockchain = createBlockchainWithTx(baseDifficulty, baseReward);
            assert(blockchain.isChainValid());
        });

        it('should fail when genesis block has been tampered with', function () {
            blockchain.chain[0].timestamp = 39708;
            assert(!blockchain.isChainValid());
        });

        it('should fail when a tx is invalid', function () {
            blockchain = createBlockchainWithTx(baseDifficulty, baseReward);
            blockchain.chain[1].transactions[0].amount = 897397;
            assert(!blockchain.isChainValid());
        });

        it('should fail when a block has been changed', function () {
            blockchain = createBlockchainWithTx(baseDifficulty, baseReward);
            blockchain.chain[1].timestamp = 897397;
            assert(!blockchain.isChainValid());
        });
    });
});