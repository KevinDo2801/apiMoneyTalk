import { Request, Response } from 'express';
export declare class TransactionController {
    createTransaction(req: Request, res: Response): Promise<void>;
    getAllTransactions(req: Request, res: Response): Promise<void>;
    getTransactionById(req: Request, res: Response): Promise<void>;
    updateTransaction(req: Request, res: Response): Promise<void>;
    deleteTransaction(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=transactionController.d.ts.map