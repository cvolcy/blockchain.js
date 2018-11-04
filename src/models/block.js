const SHA256 = require("crypto-js/sha256");
const hex = require("crypto-js/enc-hex");
const Transaction = require("./transaction");

class Block {
    /**
     * @param {number} timestamp
     * @param {Transaction[]} transactions
     * @param {string} previousHash
     */
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /**
     * @returns {string}
     */
    calculateHash() {
        return SHA256(
            `${this.timestamp} - ${this.hash}${this.previousHash} - ${this.nonce} - ${JSON.stringify(this.transactions)}`
        ).toString(hex);
    }

    /**
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
        // TODO : mine current block with specified difficulty
    }

    /**
     * @returns {boolean}
     */
    hasValidTransactions() {
        // TODO: check if the current block is valid
    }
}

module.exports = Block;