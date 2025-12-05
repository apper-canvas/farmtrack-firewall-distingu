import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const financeService = {
  async getAllTransactions() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('transaction_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.Name,
        type: item.type_c,
        amount: item.amount_c,
        description: item.description_c,
        category: item.category_c,
        date: item.date_c,
        createdAt: item.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getTransactionById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('transaction_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success || !response.data) {
        throw new Error('Transaction not found');
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.Name,
        type: item.type_c,
        amount: item.amount_c,
        description: item.description_c,
        category: item.category_c,
        date: item.date_c,
        createdAt: item.CreatedOn
      };
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async createTransaction(transactionData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: transactionData.description,
          type_c: transactionData.type,
          amount_c: transactionData.amount,
          description_c: transactionData.description,
          category_c: transactionData.category,
          date_c: transactionData.date || new Date().toISOString().split('T')[0]
        }]
      };

      const response = await apperClient.createRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const newTransaction = successful[0].data;
          return {
            Id: newTransaction.Id,
            name: newTransaction.Name,
            type: newTransaction.type_c,
            amount: newTransaction.amount_c,
            description: newTransaction.description_c,
            category: newTransaction.category_c,
            date: newTransaction.date_c,
            createdAt: newTransaction.CreatedOn
          };
        }
      }

      throw new Error("Failed to create transaction");
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateTransaction(id, transactionData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: transactionData.description,
          type_c: transactionData.type,
          amount_c: transactionData.amount,
          description_c: transactionData.description,
          category_c: transactionData.category,
          date_c: transactionData.date
        }]
      };

      const response = await apperClient.updateRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedTransaction = successful[0].data;
          return {
            Id: updatedTransaction.Id,
            name: updatedTransaction.Name,
            type: updatedTransaction.type_c,
            amount: updatedTransaction.amount_c,
            description: updatedTransaction.description_c,
            category: updatedTransaction.category_c,
            date: updatedTransaction.date_c,
            createdAt: updatedTransaction.CreatedOn
          };
        }
      }

      throw new Error("Failed to update transaction");
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async deleteTransaction(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('transaction_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:${failed.map(f => f.message).join(', ')}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getTransactionSummary() {
    try {
      const transactions = await this.getAllTransactions();
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });

      const monthlyIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        monthlyIncome,
        monthlyExpenses,
        monthlyProfit: monthlyIncome - monthlyExpenses,
        totalIncome,
        totalExpenses,
        totalProfit: totalIncome - totalExpenses,
        transactionCount: transactions.length,
        monthlyTransactionCount: currentMonthTransactions.length
      };
    } catch (error) {
      console.error("Error getting transaction summary:", error?.response?.data?.message || error);
      return {
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyProfit: 0,
        totalIncome: 0,
        totalExpenses: 0,
        totalProfit: 0,
        transactionCount: 0,
        monthlyTransactionCount: 0
      };
    }
  },

  async getTransactionsByCategory(type = null) {
    try {
      const transactions = await this.getAllTransactions();
      let filteredTransactions = type ? transactions.filter(t => t.type === type) : transactions;
      
      const categorySummary = {};
      filteredTransactions.forEach(t => {
        if (!categorySummary[t.category]) {
          categorySummary[t.category] = {
            category: t.category,
            total: 0,
            count: 0,
            type: t.type
          };
        }
        categorySummary[t.category].total += t.amount;
        categorySummary[t.category].count += 1;
      });

      return Object.values(categorySummary).sort((a, b) => b.total - a.total);
    } catch (error) {
      console.error("Error getting transactions by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getMonthlyTrends(months = 6) {
    try {
      const transactions = await this.getAllTransactions();
      
      const trends = [];
      const now = new Date();
      
      for (let i = months - 1; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthTransactions = transactions.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === month.getMonth() && 
                 tDate.getFullYear() === month.getFullYear();
        });

        const income = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        trends.push({
          month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          income,
          expenses,
          profit: income - expenses
        });
      }

      return trends;
    } catch (error) {
      console.error("Error getting monthly trends:", error?.response?.data?.message || error);
      return [];
    }
  }
};