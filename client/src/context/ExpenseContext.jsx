import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/Context';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [user,setUser]=useState({_id:'',username: '', email: '' })
  const { AuthorizationToken } = useAuth();

  const fetchData = async () => {
    const response = await fetch('https://splitwiseai-production.up.railway.app/routes/user', {
      method: "GET",
      headers: {
        Authorization: AuthorizationToken,
      },
    });
    const data = await response.json();
    setUser({ _id: data._id, username: data.username, email: data.email });
    return data._id; 
  };
  
  const fetchExpenses = async (userId) => {
    try {
      const response = await fetch(`https://splitwiseai-production.up.railway.app/routes/getuseractivity/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: AuthorizationToken
        },
      });
      const data = await response.json(); 
      const { totalSpent, activities } = data;
      setExpenses(activities);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const userId = await fetchData();  
        await fetchExpenses(userId); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchAllData();
  }, []);

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
    <ExpenseContext.Provider value={{ expenses, loading, error, addExpense, deleteExpense }}>
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
