import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Landing2 from './pages/Landing2';
import Signin from './pages/Signin';
import SignUp from './pages/Signup';
import Navbar from './components/Navbar';
import Logout from './pages/Logout';
import Settings from './pages/Settings';
import Groups from './pages/Group';
import GroupDetails from './pages/GroupDetails';
import UnequalSplitting from './pages/UnequalSplitting';
import EqualSplitting from './pages/EqualSplitting';

function App() {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/dashboard" element={<Landing2/>} />
      <Route path="/signin" element={<Signin/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/logout" element={<Logout/>} />
      <Route path="/settings" element={<Settings/>} />
      <Route path="/groups" element={<Groups/>} />
      <Route path="/groups/:groupId/split/unequal" element={<UnequalSplitting/>} />
      <Route path="/groups/:groupId/split/equal" element={<EqualSplitting/>} />
      <Route path="/groups/:groupId" element={<GroupDetails />} />
      <Route path="*" element={<h1>404 Not Found</h1>} />
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;