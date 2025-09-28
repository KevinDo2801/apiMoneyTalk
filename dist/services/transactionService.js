"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const supabase_1 = require("../config/supabase");
class TransactionService {
    async createTransaction(data, userId) {
        if (!userId) {
            throw new Error('User ID is required to create a transaction');
        }
        const insertData = {
            user_id: userId,
            type: data.type,
            category: data.category,
            amount: data.amount,
            note: data.note || null,
            date: data.date || new Date().toISOString().split('T')[0]
        };
        const { data: transaction, error } = await supabase_1.supabaseAdmin
            .from('transactions')
            .insert([insertData])
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create transaction: ${error.message}`);
        }
        return transaction;
    }
    async getAllTransactions(userId, queryParams = {}) {
        if (!userId) {
            throw new Error('User ID is required to fetch transactions');
        }
        let query = supabase_1.supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });
        if (queryParams.type) {
            query = query.eq('type', queryParams.type);
        }
        if (queryParams.category) {
            query = query.eq('category', queryParams.category);
        }
        if (queryParams.startDate) {
            query = query.gte('date', queryParams.startDate);
        }
        if (queryParams.endDate) {
            query = query.lte('date', queryParams.endDate);
        }
        if (queryParams.limit) {
            query = query.limit(queryParams.limit);
        }
        if (queryParams.offset) {
            query = query.range(queryParams.offset, queryParams.offset + (queryParams.limit || 10) - 1);
        }
        const { data: transactions, error } = await query;
        if (error) {
            throw new Error(`Failed to fetch transactions: ${error.message}`);
        }
        return transactions || [];
    }
    async getTransactionById(id, userId) {
        if (!userId) {
            throw new Error('User ID is required to fetch transaction');
        }
        const { data: transaction, error } = await supabase_1.supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Transaction not found');
            }
            throw new Error(`Failed to fetch transaction: ${error.message}`);
        }
        return transaction;
    }
    async updateTransaction(id, data, userId) {
        if (!userId) {
            throw new Error('User ID is required to update transaction');
        }
        const updateData = {};
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.amount !== undefined)
            updateData.amount = data.amount;
        if (data.note !== undefined)
            updateData.note = data.note;
        if (data.date !== undefined)
            updateData.date = data.date;
        const { data: transaction, error } = await supabase_1.supabaseAdmin
            .from('transactions')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Transaction not found');
            }
            throw new Error(`Failed to update transaction: ${error.message}`);
        }
        return transaction;
    }
    async deleteTransaction(id, userId) {
        if (!userId) {
            throw new Error('User ID is required to delete transaction');
        }
        const { error } = await supabase_1.supabaseAdmin
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);
        if (error) {
            if (error.code === 'PGRST116') {
                throw new Error('Transaction not found');
            }
            throw new Error(`Failed to delete transaction: ${error.message}`);
        }
    }
}
exports.TransactionService = TransactionService;
//# sourceMappingURL=transactionService.js.map