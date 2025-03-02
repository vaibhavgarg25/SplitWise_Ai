import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, DollarSign, ArrowLeft, Equal, Divide } from 'lucide-react';
import Navbar2 from '../components/Navbar2';
import Button from '../components/Button';
import { useAuth } from '../context/Context';
import { toast } from 'react-toastify';


const GroupDetails = () => {
  const {groupId}=useParams()
  const { AuthorizationToken } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState('');
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([
    { description: "Dinner", amount: 1200 },
    { description: "Hotel Stay", amount: 5000 },
    { description: "Fuel", amount: 2000 },
    {description:"Breakfast", amount:5000}
  ]);

  const fetchmembers=async()=>{
    try {
      // console.log(groupId)
      const response=await fetch(`http://localhost:3000/routes/getgroupmembers/${groupId}`,{
        method:"GET",
        headers:{
          Authorization:AuthorizationToken
        }
      })
      const data=await response.json()
      const newdata=data[0].memberdetails
      const groupname=data[0].groupname
      setGroup(groupname)
      setMembers(newdata)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
   fetchmembers()
  }, [])
  

  return (
    <div className='flex'>
      <div className="nav">
        <Navbar2 />
      </div>
      <div className='w-screen ml-6 space-y-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <ArrowLeft className='cursor-pointer' onClick={() => navigate(-1)} />
            <h1 className='text-2xl mt-5  font-bold text-gray-900 dark:text-black'>{group}</h1>
          </div>
        </div>
        
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold'>Members</h2>
          <div className='flex space-x-4 mt-4'>
            {members?.map(member => (
              <div key={member._id} className='flex flex-col items-center'>
                <img
                  className='w-12 h-12 rounded-full border-2 border-gray-300'
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.username)}&background=random`}
                  alt={member.username}
                />
                <p className='text-sm text-gray-700'>{member.username}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold'>Expenses</h2>
          {expenses.length > 0 ? (
            <ul className='mt-4'>
              {expenses.map((expense, index) => (
                <li key={index} className='flex justify-between p-2 border-b'>
                  <span>{expense.description}</span>
                  <span className='text-indigo-600'>₹{expense.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500 mt-2'>No expenses recorded yet.</p>
          )}
        </div>

        <div className='flex space-x-4'>
          <Button variant='primary' icon={Equal} onClick={() => navigate(`/groups/${groupId}/split/equal`)}>Equal Splitting</Button>
          <Button variant='secondary' icon={Divide} onClick={() => navigate(`/groups/${groupId}/split/unequal`)}>Unequal Splitting</Button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;