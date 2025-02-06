import TransactionRepositoryInstance, { ITransactionRepository } from "@/app/repository/TransactionRepository";
import { ITransaction } from "@/models/Transaction";

interface ITransactionService {
    createTransaction(transactionData: Partial<ITransaction>): Promise<ITransaction>;
    getTransactionById(transactionId: string): Promise<ITransaction | null>;
    getAllTransactions(): Promise<ITransaction[]>;
    updateTransaction(transactionId: string, updateData: Partial<ITransaction>): Promise<ITransaction | null>;
    deleteTransaction(transactionId: string): Promise<ITransaction | null>;
    getTransactionsByUserId(userId: string): Promise<ITransaction[]>;
}

class TransactionService implements ITransactionService {
    private transactionRepository: ITransactionRepository;

    constructor(transactionRepository: ITransactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    async createTransaction(transactionData: Partial<ITransaction>): Promise<ITransaction> {
        return await this.transactionRepository.create(transactionData);
    }

    async getTransactionById(transactionId: string): Promise<ITransaction | null> {
        return await this.transactionRepository.getById(transactionId);
    }

    async getAllTransactions(): Promise<ITransaction[]> {
        return await this.transactionRepository.getAll();
    }

    async updateTransaction(
        transactionId: string,
        updateData: Partial<ITransaction>
    ): Promise<ITransaction | null> {
        return await this.transactionRepository.updateById(transactionId, updateData);
    }

    async deleteTransaction(transactionId: string): Promise<ITransaction | null> {
        return await this.transactionRepository.deleteById(transactionId);
    }

    async getTransactionsByUserId(userId: string): Promise<ITransaction[]> {
        return await this.transactionRepository.findByUserId(userId);
    }
}

const TransactionServiceInstance = new TransactionService(TransactionRepositoryInstance)
export default TransactionServiceInstance