import { Transaction, CreateTransactionRequest, UpdateTransactionRequest, TransactionQueryParams } from '../models/transaction';
export declare class TransactionService {
    createTransaction(data: CreateTransactionRequest, userId: string): Promise<Transaction>;
    getAllTransactions(userId: string, queryParams?: TransactionQueryParams): Promise<Transaction[]>;
    getTransactionById(id: string, userId: string): Promise<Transaction>;
    updateTransaction(id: string, data: UpdateTransactionRequest, userId: string): Promise<Transaction>;
    deleteTransaction(id: string, userId: string): Promise<void>;
}
//# sourceMappingURL=transactionService.d.ts.map