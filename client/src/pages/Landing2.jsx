import React, { useState,useEffect } from 'react';
import { 
  Users, 
  Receipt, 
  PlusCircle, 
  DollarSign, 
  PieChart,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import { ExpenseProvider } from '../context/ExpenseContext';
import Dashboard from '../pages/Dashboard';
import Button from '../components/Button';
import { NavLink } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import { useAuth } from '../context/Context';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user,setUser]=useState({_id:'',username: '', email: '' })
  const {AuthorizationToken}=useAuth()
  
  const fetchuser=async()=>{
    const response = await fetch('https://angelic-learning.up.railway.app/routes/user', {
      method: "GET",
      headers: {
        Authorization: AuthorizationToken,
      },
    });
    const data = await response.json();
    // console.log(data);
    setUser({ _id:data._id,username: data.username, email: data.email });
  };

  useEffect(() => {
   fetchuser()
  }, [])
  
  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Navbar2/>
        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
              <span className="text-lg font-medium text-gray-700">Welcome, {user.username}</span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <div className="p-6">
            {activeTab === 'dashboard' && <Dashboard />}
          </div>

          {/* Add Expense Button */}
          <Button
            variant="primary"
            icon={PlusCircle}
            className="fixed bottom-8 right-8 !p-4 shadow-lg"
          />
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default App;