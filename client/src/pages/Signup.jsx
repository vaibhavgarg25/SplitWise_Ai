import React, { useState } from 'react';
import { Receipt, ArrowRight, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/Context';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [user,setuser]=useState({ username: "", email: "", password: "" });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const storetokeninls=useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(user);
    try {
      const response = await fetch("http://localhost:3000/routes/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });


      console.log(response);
      const res_data=await response.json()

      if (response.ok) {
        storetokeninls(res_data.token)
        setuser({ username: "", email: "", password: "" });
        toast.success("Signup successfull")
        navigate('/signin')
      }
      else{
        toast.error(res_data.extraDetails?res_data.extraDetails:res_data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error)
      setError(error.message);
    }finally{
      setIsLoading(false)
    }
  };

  const handlechange=(e)=>{
    e.preventDefault()
    let name=e.target.name
    let value=e.target.value
    setuser({
      ...user,
      [name]:value,
    })
  }


  const navigate=useNavigate()
  return (
    <div className="mt-10 bg-[#FCFCFD] flex">
      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-2">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2">
              <Receipt className="w-10 h-10 text-indigo-600" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                SplitWise AI
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={()=>{navigate('/signin')}}
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
          </div>

          {/* Sign Up Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    name="username"
                    required
                    value={user.username}
                    onChange={handlechange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={user.email}
                    onChange={handlechange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={user.password}
                    onChange={handlechange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;