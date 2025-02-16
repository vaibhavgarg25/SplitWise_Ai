import React, { createContext, useContext, useState } from 'react';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Dinner at Italian Restaurant', amount: 120.50, paidBy: 'John', date: '2024-03-15', participants: ['John', 'Sarah', 'Mike'] },
    { id: 2, description: 'Monthly Groceries', amount: 245.75, paidBy: 'Sarah', date: '2024-03-14', participants: ['John', 'Sarah'] },
    { id: 3, description: 'Utilities - March', amount: 180.00, paidBy: 'Mike', date: '2024-03-13', participants: ['John', 'Sarah', 'Mike'] }
  ]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Math.max(...expenses.map(e => e.id), 0) + 1
    };
    setExpenses([newExpense, ...expenses]);
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenseContext = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseContext must be used within an ExpenseProvider');
  }
  return context;
};