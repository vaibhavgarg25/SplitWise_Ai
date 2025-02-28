import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Languages, Moon, Sun } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/Context';
import Navbar2 from '../components/Navbar2';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Settings = () => {
  const { AuthorizationToken } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({_id:'',username: '', email: '' });
  const params=useParams()

  const fetchData = async () => {
    const response = await fetch('http://localhost:3000/routes/user', {
      method: "GET",
      headers: {
        Authorization: AuthorizationToken,
      },
    });
    const data = await response.json();
    // console.log(data);
    setUser({ _id:data._id,username: data.username, email: data.email });
  };

  const handleUpdate = async (e) => {
    e.preventDefault()
    const id=user._id
    try {
        const response=await fetch(`http://localhost:3000/routes/update/${id}`,{
            method:"PATCH",
            headers:{
                'Content-Type':'application/json',
                Authorization:AuthorizationToken,
            },
            body:JSON.stringify(user)
        })
        if(response.ok){
            toast.success("updated successfully")
        }
        else{
            toast.error("update unsuccessfull")
        }
    } catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

 

  return (
    <div className="flex">
      <div className="nav">
        <Navbar2 />
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Settings */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-black dark:text-black">Profile Settings</h3>
            <p className="mt-1 text-sm text-black dark:text-black">
              Update your personal information and how others see you on the platform
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src="https://imgs.search.brave.com/ojTyXw2A9m6m8n15znSJGGemlnj7wl_2KX6cKZpFs_Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzY0Lzg5LzE5/LzM2MF9GXzk2NDg5/MTk4OF9hZVJyRDdF/ZTdJaG1LUWhZa0Ny/a3JmRTZVSHRJTGZQ/cC5qcGc"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border border-gray-200 hover:bg-gray-50">
                  <User className="w-4 h-4 text-black" />
                </button>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-black dark:text-black">
                      Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium  text-black dark:text-black">
                Email
              </label>
              <div className="mt-1 flex rounded-lg shadow-sm">
                <div className="relative flex flex-grow items-stretch focus-within:z-10">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="block w-full rounded-lg border border-gray-300 pl-10 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
            <Button variant="primary" onClick={handleUpdate}>Update</Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium  text-black dark:text-black">Security</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your account security and authentication methods
                </p>
              </div>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium  text-black dark:text-black">Change Password</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
              </div>
              <Button variant="secondary" size="sm">
                Update
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium  text-black dark:text-black">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
              </div>
              <Button variant="secondary" size="sm">
                Enable
              </Button>
            </div>
          </div>
        </Card>

        {/* Preferences */}
        {/* <Card>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-black dark:text-black">Preferences</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Customize your experience
                </p>
              </div>
              <Languages className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium  text-black dark:text-black">Dark Mode</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode theme</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 "
              >
                {darkMode ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </Card> */}
      </div>
    </div>
  );
};

export default Settings;