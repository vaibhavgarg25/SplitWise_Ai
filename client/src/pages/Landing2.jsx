import React, { useState } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
                <div className="flex items-center space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium text-gray-700">John Doe</span>
                </div>
                
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