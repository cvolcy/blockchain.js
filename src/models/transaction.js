const SHA256 = require("crypto-js/sha256");
const hex = require("crypto-js/enc-hex");
const EC = require('elliptic').ec;
const KeyPair = require('elliptic').ec.KeyPair;
const ec = new EC('secp256k1');

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
     * Sign the current transaction with the given signin key.
     * 
     * @param {KeyPair} signingKey
     */
    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.signature = sig.toDER('hex');
    }

    /**
     * Check if the transaction is signed and valid.
     * 
     * @returns {boolean}
     */
    isValid() {
        if (this.fromAddress === null) return true;
        if (this.toAddress === null) return false;
        if (this.amount < 0) return false;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports = Transaction;