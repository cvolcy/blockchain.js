const Block = require("./models/block");
const Transaction = require("./models/transaction");

class Blockchain {
     /**
     * @param {number} difficulty
     * @param {number} reward
     */
    constructor(difficulty, reward) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
        this.pendingTransactions = [];
        this.reward = reward;
    }

    /**
     * @returns {Block}
     */
    createGenesisBlock() {
        return new Block(Date.parse('1991-01-01'), [], '0');
    }

    /**
     * @returns {Block[]}
     */
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * @param {string} minerAddress
     */
    minePendingTransactions(minerAddress) {
        // TODO: mine all pending transactions and give reward to the miner.
    }

    /**
     * @param {Transaction} transaction
     * @throws {Error} When transaction is not valid
     * @throws {Error} When from or to addresses are not present in the transaction.
     */
    addTransaction(transaction) {
        // TODO: add a transaction in the pending list
    }

    /**
     * @param {string} address
     * @returns {number} The balance of the wallet
     */
    getBalanceOfAddress(address) {
        // TODO: Get the balance of the wallet at the address given.
        // loop through each block to get the history of a wallet.
        return 0;
    }

    /**
     * Check if the blockchain is valid
     * 
     * @returns {boolean}
     */
    isChainValid() {
        const genesisHash = this.createGenesisBlock().hash;

        if (genesisHash !== this.chain[0].calculateHash()) {
            return false;
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.calculateHash()) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;