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
     * Mine all pending transactions and give reward to the miner.
     * 
     * @param {string} minerAddress
     */
    minePendingTransactions(minerAddress) {
        const rewardTx = new Transaction(null, minerAddress, this.reward);
        this.pendingTransactions.push(rewardTx);

        let block = new Block(Date.now(), this.pendingTransactions, this.getLastBlock().hash);
        block.mineBlock(this.difficulty);

        this.chain.push(block);

        this.pendingTransactions = [];
    }

    /**
     * @param {Transaction} transaction
     * @throws {Error} When from or to addresses are not present in the transaction.
     * @throws {Error} When transaction is not valid
     */
    addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        if (!transaction.isValid()) {
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    /**
     * Get the balance of the wallet at the given address. 
     * Loop through each blocks to get the history of a wallet.
     * 
     * @param {string} address
     * @returns {number} The balance of the wallet
     */
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.fromAddress === address) {
                    balance -= tx.amount;
                }

                if (tx.toAddress === address) {
                    balance += tx.amount;
                }
            }
        }

        return balance;
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