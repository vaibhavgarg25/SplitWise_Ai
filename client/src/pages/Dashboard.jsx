import React from 'react';
import { DollarSign, Receipt } from 'lucide-react';
import Card from '../components/Card';
import { useExpenseContext } from '../context/ExpenseContext';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const { expenses } = useExpenseContext();

  const totalOwed = expenses
    .filter(e => e.paidBy === 'John')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOwe = expenses
    .filter(e => e.paidBy !== 'John' && e.participants.includes('John'))
    .reduce((sum, e) => sum + (e.amount / e.participants.length), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">You are owed</h3>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-500 mt-2">
            {formatCurrency(totalOwed)}
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">You owe</h3>
            <DollarSign className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500 mt-2">
            {formatCurrency(totalOwe)}
          </p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-700">Total Balance</h3>
            <DollarSign className="w-8 h-8 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-indigo-500 mt-2">
            {formatCurrency(totalOwed - totalOwe)}
          </p>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">Recent Activity</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <Receipt className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    Paid by {expense.paidBy} • {formatDate(expense.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">
                  {formatCurrency(expense.amount)}
                </p>
                <p className="text-sm text-gray-500">
                  {expense.participants.length} participants
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;