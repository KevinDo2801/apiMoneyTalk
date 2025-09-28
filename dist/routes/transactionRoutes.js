"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const transactionController = new transactionController_1.TransactionController();
router.use(auth_1.authenticateUser);
router.post('/', (req, res) => {
    transactionController.createTransaction(req, res);
});
router.get('/', (req, res) => {
    transactionController.getAllTransactions(req, res);
});
router.get('/:id', (req, res) => {
    transactionController.getTransactionById(req, res);
});
router.put('/:id', (req, res) => {
    transactionController.updateTransaction(req, res);
});
router.delete('/:id', (req, res) => {
    transactionController.deleteTransaction(req, res);
});
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map