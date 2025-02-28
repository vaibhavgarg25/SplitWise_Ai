import React from 'react';
import { Receipt, ArrowRight, Wallet, Users, Zap, Shield, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/Context';


const Landing= () => {
  const navigate=useNavigate()
  const {isLoggedIn}=useAuth()
  const handlesubmit=()=>{
    if(isLoggedIn){
      return navigate('/dashboard')
    }
    navigate('/signup')
  }

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-14 sm:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-[50%] top-0 h-[1000px] w-[1000px] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]">
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40V.5H40" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" strokeWidth="0" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 mb-8">
                <span className="text-sm font-medium text-indigo-600">Now with AI-powered splitting</span>
                <ChevronRight className="w-4 h-4 ml-2 text-indigo-600" />
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-8">
                <span className="inline-block">Split Bills.</span>{' '}
                <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Save Friendships.
                </span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12">
                The smartest way to manage shared expenses. Let AI handle the math while you focus on making memories.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="w-full sm:w-auto text-lg px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                  onClick={handlesubmit}
                >
                  Get Started Free
                </Button>
                
              </div>

              {/* App Preview */}
              <div className="relative mx-auto max-w-5xl">
                <div className="relative rounded-2xl bg-gray-900/5 p-2">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8">
                    <div className="rounded-full bg-white/90 backdrop-blur p-2 shadow-lg ring-1 ring-gray-900/10">
                      <div className="flex space-x-4">
                        {[
                          { icon: Wallet, label: 'Smart Splitting' },
                          { icon: Users, label: 'Group Management' },
                          { icon: Shield, label: 'Secure Payments' }
                        ].map(({ icon: Icon, label }) => (
                          <div key={label} className="flex items-center space-x-2 px-3 py-1">
                            <Icon className="w-5 h-5 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-900">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=800&q=80"
                    alt="App preview"
                    className="w-full rounded-xl shadow-2xl ring-1 ring-gray-900/10"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-7 sm:py-6" id="features">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Powerful Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to split expenses
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our AI-powered platform makes expense splitting effortless, accurate, and drama-free.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {[
                {
                  icon: Zap,
                  title: 'AI-Powered Splitting',
                  description: 'Smart algorithms suggest fair expense divisions based on spending patterns.'
                },
                {
                  icon: Users,
                  title: 'Group Management',
                  description: 'Create and manage multiple groups for different occasions.'
                },
                {
                  icon: Shield,
                  title: 'Secure Payments',
                  description: 'Integrated payment options for quick and secure settlements.'
                },
                {
                  icon: Receipt,
                  title: 'Smart Reports',
                  description: 'Get detailed insights into your group spending patterns.'
                }
              ].map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className="group relative bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <div className="absolute -inset-x-4 -inset-y-4 z-0 bg-gradient-to-r from-indigo-50 to-indigo-100/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-8 tracking-tight text-gray-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-gray-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-4xl px-6 py-8 sm:py-13 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to simplify your expense sharing?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">
              Join thousands of satisfied users who have made expense splitting effortless.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                variant="secondary"
                size="lg"
                icon={ArrowRight}
                className="text-lg px-8 bg-white text-indigo-600 hover:bg-indigo-50"
                onClick={handlesubmit}
              >
                Get Started Free
              </Button>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.25" />
              <defs>
                <radialGradient id="gradient">
                  <stop stopColor="white" />
                  <stop offset="1" stopColor="white" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;