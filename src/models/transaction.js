const SHA256 = require("crypto-js/sha256");
const hex = require("crypto-js/enc-hex");

class Transaction {
    /**
     * @param {string} fromAddress
     * @param {string} toAddress
     * @param {number} amount
     */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }

    /**
     * Return the hash value of the current transaction.
     * 
     * @returns {string}
     */
    calculateHash() {
        return SHA256(
            `${this.timestamp} - ${this.fromAddress}${this.toAddress} - ${this.amount}`
        ).toString(hex);
    }

    /**
     * @param {string} signingKey
     */
    signTransaction(signingKey) {
        // TODO: sign the current transaction with the given signin key.
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        if (this.fromAddress === null) return true;

        if (this.toAddress === null) return false;

        if (this.amount < 0) return false;

        return true;
    }
}

module.exports = Transaction;