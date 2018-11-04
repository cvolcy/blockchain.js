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
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    /**
     * @returns {string}
     */
    calculateHash() {
        return SHA256(
            `${this.timestamp} - ${this.previousHash} - ${this.nonce} - ${JSON.stringify(this.transactions)}`
        ).toString(hex);
    }

    /**
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
        // TODO : mine current block with specified difficulty
    }

    /**
     * Check if the current block is valid
     * 
     * @returns {boolean}
     */
    hasValidTransactions() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Block;