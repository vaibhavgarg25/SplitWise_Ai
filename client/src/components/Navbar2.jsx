import React,{useState,useEffect} from 'react'
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
import { NavLink, useNavigate } from 'react-router-dom'; 

const Navbar2 = () => {

    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate=useNavigate()
    
  return (
    <div>
        <div className="w-72 bg-white border-r border-gray-200 p-4 h-screen">          
          <nav className="space-y-2">
            <button 
              onClick={() =>{
                setActiveTab('dashboard')
                navigate('/dashboard') }
              }
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <PieChart className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            
            {/* <button 
              onClick={() =>{
                setActiveTab('expenses')
                navigate('/expenses')} }
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'expenses' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Expenses</span>
            </button> */}
            
            <button 
              onClick={() =>{
                setActiveTab('groups')
                navigate('/groups')} }
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'groups' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Groups</span>
            </button>
            
            <button 
              onClick={() =>{
                setActiveTab('settings')
                navigate('/settings')} }
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
    </div>
  )
}

export default Navbar2