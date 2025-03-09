import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, DollarSign, Camera, FileText, Check, X, Users } from 'lucide-react';
import Button from '../components/Button';
import Navbar2 from '../components/Navbar2';
import { useAuth } from '../context/Context';
import { toast } from 'react-toastify';

const EqualSplitting = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { AuthorizationToken } = useAuth();
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [selectedMembers, setSelectedMembers] = useState({});
  const [receiptImage, setReceiptImage] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/routes/getgroupmembers/${groupId}`, {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken
        }
      });
      const data = await response.json();
      const newdata = data[0].memberdetails;
      const groupname = data[0].groupname;
      setGroup(groupname);

      // Initialize all members as selected by default
      const membersObj = {};
      newdata.forEach(member => {
        membersObj[member._id] = true;
      });
      setSelectedMembers(membersObj);
      setMembers(newdata);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch group members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId, AuthorizationToken]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processReceiptImage = () => {
    setIsProcessingImage(true);
    setTimeout(() => {
      setIsProcessingImage(false);
      toast.success("Receipt processed successfully!");
    }, 2000);
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  const getSelectedMembersCount = () => {
    return Object.values(selectedMembers).filter(Boolean).length;
  };

  const getAmountPerPerson = () => {
    const count = getSelectedMembersCount();
    if (count === 0 || !totalAmount) return 0;
    return parseFloat(totalAmount) / count;
  };

  const handleSubmit = async () => {
    if (!description || !totalAmount || getSelectedMembersCount() === 0) {
      toast.error("Please fill all required fields and select at least one member");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedMemberIds = Object.entries(selectedMembers)
        .filter(([_, isSelected]) => isSelected)
        .map(([id, _]) => id);

      const amountPerPerson = getAmountPerPerson();

      const expenseData = {
        groupId,
        group,
        description,
        totalAmount: parseFloat(totalAmount),
        members: selectedMemberIds.map(id => ({
          memberId: id,
          amount: amountPerPerson
        }))
      };
      const response = await fetch('http://localhost:3000/routes/unequalsplit', {
        method: "POST",
        headers: {
          Authorization: AuthorizationToken,
          "content-type": "application/json"
        },
        body: JSON.stringify(expenseData)
      })
      if (response.ok) {
        toast.success("Expense added successfully!");
        navigate(`/groups/${groupId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='flex'>
      <div className="nav">
        <Navbar2 />
      </div>
      <div className='w-screen ml-6 space-y-6 p-4'>
        <div className='flex items-center space-x-4'>
          <Button
            variant="secondary"
            icon={ArrowLeft}
            onClick={() => navigate(`/groups/${groupId}`)}
            className="!p-2"
          />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Equal Split</h1>
            <p className='text-gray-500'>Group: {group}</p>
          </div>
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md space-y-6'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expense Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Dinner, Groceries, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <div className="relative rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">₹</span>
              </div>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="block w-full pl-7 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Upload Receipt (Optional)</span>
            <div className="flex space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Camera}
                  className="cursor-pointer"
                >
                  Upload
                </Button>
              </label>
              {receiptImage && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={FileText}
                  onClick={processReceiptImage}
                  disabled={isProcessingImage}
                >
                  {isProcessingImage ? 'Processing...' : 'Process Receipt'}
                </Button>
              )}
            </div>
          </div>

          {receiptImage && (
            <div className="relative">
              <img
                src={receiptImage}
                alt="Receipt"
                className="w-full h-48 object-cover rounded-md"
              />
              <button
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                onClick={() => setReceiptImage(null)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className='bg-white p-6 rounded-lg shadow-md'>
          <div className="flex items-center justify-between mb-4">
            <h2 className='text-lg font-semibold'>Select Members</h2>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-500">
                {getSelectedMembersCount()} of {members.length} selected
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {members.map(member => (
              <div
                key={member._id}
                className={`flex items-center justify-between p-3 rounded-lg border ${selectedMembers[member._id] ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  } cursor-pointer transition-colors`}
                onClick={() => toggleMemberSelection(member._id)}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedMembers[member._id] || false}
                    onChange={() => { }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <div className="flex items-center space-x-3">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.username)}&background=random`}
                      alt={member.username}
                    />
                    <span className="font-medium">{member.username}</span>
                  </div>
                </div>

                {selectedMembers[member._id] && (
                  <div className="text-indigo-600 font-medium">
                    ₹{getAmountPerPerson().toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg font-medium">
              <span>Total Amount</span>
              <span>₹{totalAmount || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
              <span>Per person ({getSelectedMembersCount()} members)</span>
              <span>₹{getAmountPerPerson().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            icon={Check}
            onClick={handleSubmit}
            disabled={isSubmitting || !description || !totalAmount || getSelectedMembersCount() === 0}
          >
            {isSubmitting ? 'Saving...' : 'Save Expense'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EqualSplitting;