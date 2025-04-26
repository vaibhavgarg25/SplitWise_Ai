import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, DollarSign, ArrowLeft, Equal, Divide, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar2 from '../components/Navbar2';
import Button from '../components/Button';
import { useAuth } from '../context/Context';
import { toast } from 'react-toastify';

const GroupDetails = () => {
  const { groupId } = useParams();
  const { AuthorizationToken } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState('');
  const [Members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expandedExpense, setExpandedExpense] = useState(null);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`https://angelic-learning.up.railway.app/routes/getgroupmembers/${groupId}`, {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken
        }
      });
      const data = await response.json();
      const newdata = data[0].memberdetails;
      const groupname = data[0].groupname;
      setGroup(groupname);
      setMembers(newdata);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`https://angelic-learning.up.railway.app/routes/getexpenses/${groupId}`, {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken
        }
      });
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchExpenses();
  }, []);

  return (
    <div className='flex'>
      <div className="nav">
        <Navbar2 />
      </div>
      <div className='w-screen ml-6 space-y-6'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <ArrowLeft className='cursor-pointer' onClick={() => navigate('/groups')} />
            <h1 className='text-2xl mt-5 font-bold text-gray-900 dark:text-black'>{group}</h1>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold'>Members</h2>
          <div className='flex space-x-4 mt-4'>
            {Members?.map(member => (
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
                <li key={index} className='border-b'>
                  <div
                    className='flex justify-between p-2 cursor-pointer hover:bg-gray-100 transition items-center'
                    onClick={() => setExpandedExpense(expandedExpense === index ? null : index)}
                  >
                    <span className='font-medium'>{expense.description}</span>
                    <div className='flex items-center'>
                      <span className='text-indigo-600 mr-2'>₹{expense.totalAmount.toFixed(2)}</span>
                      {expandedExpense === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {expandedExpense === index && (
                    <div className='bg-gray-50 p-2 rounded-md mt-1'>
                      <h3 className='text-sm font-semibold text-gray-600'>Members</h3>
                      <ul className='mt-1'>
                        {Members
                          .filter(member => expense.members.some(expMem => expMem.memberId === member._id))
                          .map((member, index) => {
                            const memberExpense = expense.members.find(expMem => expMem.memberId === member._id);
                            return (
                              <li key={index} className='flex justify-between text-sm p-1'>
                                <span>{member.username}</span>
                                <span className='text-green-600'>₹{memberExpense.amount.toFixed(2)}</span>
                              </li>
                            );
                          })
                        }

                      </ul>
                    </div>
                  )}
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
