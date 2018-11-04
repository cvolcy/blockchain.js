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
     * @returns {string}
     */
    calculateHash() {
        // TODO: return the hash value of the current transaction.
        return "";
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
        // TODO: check if the current transaction is valid.
        return true;
    }
}
