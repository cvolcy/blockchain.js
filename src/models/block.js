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
        // TODO: return the hash value of the current block
        return "";
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