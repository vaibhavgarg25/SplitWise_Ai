import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, DollarSign, Camera, FileText,
  Check, X, Plus, Trash2, Users, Receipt
} from 'lucide-react';
import Button from '../components/Button';
import Navbar2 from '../components/Navbar2';
import { useAuth } from '../context/Context';
import { toast } from 'react-toastify';

const UnequalSplitting = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { AuthorizationToken } = useAuth();
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState('');
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [receiptImage, setReceiptImage] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

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
      toast.error("Failed to fetch group members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [groupId, AuthorizationToken]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
      reader.onload = (event) => {
        setReceiptImage(event.target?.result);
      };
      reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await fetch("https://angelic-learning.up.railway.app/routes/getsplit", {
        method: "POST",
        body: formData, 
      });
      const data = await response.json();
      console.log(data.geminiResponse);
      setItems(data.geminiResponse)
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const processReceiptImage = () => {
    setIsProcessingImage(true);
    setTimeout(() => {
      setDescription('Dinner at Restaurant');
      setTotalAmount('1250.00');
      if(items){
        setIsProcessingImage(false);
        toast.success("Receipt processed successfully!");
      }
    }, 2000);
  };

  const handleAddItem = () => {
    if (newItemName && newItemPrice) {
      const price = parseFloat(newItemPrice);
      if (!isNaN(price)) {
        setItems([
          ...items,
          {
            name: newItemName,
            price,
            assignedTo: []
          }
        ]);
        setNewItemName('');
        setNewItemPrice('');
      }
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
    if (selectedItemIndex === index) {
      setSelectedItemIndex(null);
    }
  };

  const toggleMemberForItem = (itemIndex, memberId) => {
    setItems(items.map((item, i) => {
      if (i === itemIndex) {
        const isAssigned = item.assignedTo.includes(memberId);
        return {
          ...item,
          assignedTo: isAssigned
            ? item.assignedTo.filter(id => id !== memberId)
            : [...item.assignedTo, memberId]
        };
      }
      return item;
    }));
  };

  const calculateTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateMemberShare = (memberId) => {
    return items.reduce((sum, item) => {
      if (item.assignedTo.includes(memberId)) {
        return sum + (item.price / item.assignedTo.length);
      }
      return sum;
    }, 0);
  };

  const handleSubmit = async () => {
    if (!description || items.length === 0) {
      toast.error("Please fill all required fields and add at least one item");
      return;
    }

    const unassignedItems = items.filter(item => item.assignedTo.length === 0);
    if (unassignedItems.length > 0) {
      toast.error(`Please assign members to all items. ${unassignedItems.length} items are unassigned.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const memberShares = {};

      members.forEach(member => {
        memberShares[member._id] = calculateMemberShare(member._id);
      });

      const expenseData = {
        groupId,
        group,
        description,
        totalAmount: calculateTotalAmount(),
        members: Object.entries(memberShares)
          .filter(([_, amount]) => amount > 0)
          .map(([memberId, amount]) => ({
            memberId,
            amount
          })),
      };
      const response=await fetch('https://angelic-learning.up.railway.app/routes/unequalsplit',{
        method:"POST",
        headers:{
          Authorization:AuthorizationToken,
          "content-type":"application/json"
        },
        body:JSON.stringify(expenseData)
      })
      if(response.ok){
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

  useEffect(() => {
    if (items.length > 0) {
      setTotalAmount(calculateTotalAmount().toFixed(2));
    }
  }, [items]);

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
            <h1 className='text-2xl font-bold text-gray-900'>Unequal Split</h1>
            <p className='text-gray-500'>Group: {group}</p>
          </div>
        </div>

        {!showManualEntry && !receiptImage && (
          <div className='bg-white p-8 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-6 text-center'>How would you like to add items?</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div
                className='border border-gray-200 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors'
                onClick={() => setShowManualEntry(true)}
              >
                <div className='flex justify-center mb-4'>
                  <Receipt className='w-12 h-12 text-indigo-600' />
                </div>
                <h3 className='text-lg font-medium mb-2'>Enter Items Manually</h3>
                <p className='text-gray-500'>Add each item and its price manually</p>
              </div>

              <div
                className='border border-gray-200 rounded-lg p-6 text-center hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors'
                onClick={() => document.getElementById('receipt-upload').click()}
              >
                <div className='flex justify-center mb-4'>
                  <Camera className='w-12 h-12 text-indigo-600' />
                </div>
                <h3 className='text-lg font-medium mb-2'>Upload Receipt</h3>
                <p className='text-gray-500'>Upload a photo of your receipt to extract items</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="receipt-upload"
                />
              </div>
            </div>
          </div>
        )}

        {(showManualEntry || receiptImage) && (
          <>
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

              {receiptImage && (
                <div className="relative">
                  <img
                    src={receiptImage}
                    alt="Receipt"
                    className="h-48 object-cover rounded-md"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      className="p-1 bg-red-500 text-white rounded-full"
                      onClick={() => {
                        setReceiptImage(null);
                        if (items.length === 0) {
                          setShowManualEntry(false);
                        }
                      }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {!isProcessingImage && items.length === 0 && (
                      <button
                        className="p-1 bg-indigo-500 text-white rounded-full"
                        onClick={processReceiptImage}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isProcessingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                        <p>Processing receipt...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showManualEntry && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                      placeholder="Item name"
                    />
                    <div className="relative rounded-md w-32">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500">₹</span>
                      </div>
                      <input
                        type="number"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="block w-full pl-7 rounded-md border border-gray-300 px-3 py-2"
                        placeholder="0.00"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Plus}
                      onClick={handleAddItem}
                      disabled={!newItemName || !newItemPrice}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-lg shadow-md md:col-span-1'>
                  <h2 className='text-lg font-semibold mb-4'>Items</h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className={`border rounded-lg p-3 ${selectedItemIndex === index
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200'
                          } cursor-pointer transition-colors`}
                        onClick={() => setSelectedItemIndex(index)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-500">₹{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                              {item.assignedTo.length} members
                            </div>
                            <button
                              className="text-gray-400 hover:text-red-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveItem(index);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-lg font-medium">
                      <span>Total</span>
                      <span>₹{calculateTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className='bg-white p-6 rounded-lg shadow-md md:col-span-2'>
                  {selectedItemIndex !== null ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className='text-lg font-semibold'>Assign Members to "{items[selectedItemIndex].name}"</h2>
                        <span className="text-indigo-600 font-medium">₹{items[selectedItemIndex].price.toFixed(2)}</span>
                      </div>

                      <div className="space-y-3">
                        {members.map(member => (
                          <div
                            key={member._id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${items[selectedItemIndex].assignedTo.includes(member._id)
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200'
                              } cursor-pointer transition-colors`}
                            onClick={() => toggleMemberForItem(selectedItemIndex, member._id)}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={items[selectedItemIndex].assignedTo.includes(member._id)}
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

                            {items[selectedItemIndex].assignedTo.includes(member._id) && (
                              <div className="text-indigo-600 font-medium">
                                ₹{(items[selectedItemIndex].price / items[selectedItemIndex].assignedTo.length).toFixed(2)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <Users className="w-12 h-12 mb-4" />
                      <p className="text-lg">Select an item to assign members</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-lg font-semibold mb-4'>Summary</h2>
                <div className="space-y-3">
                  {members.map(member => {
                    const share = calculateMemberShare(member._id);
                    if (share > 0) {
                      return (
                        <div key={member._id} className="flex justify-between items-center p-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              className="w-8 h-8 rounded-full border-2 border-gray-200"
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.username)}&background=random`}
                              alt={member.username}
                            />
                            <span>{member.username}</span>
                          </div>
                          <span className="font-medium text-indigo-600">₹{share.toFixed(2)}</span>
                        </div>
                      );
                    }
                    return null;
                  })}

                  <div className="flex justify-between items-center pt-3 text-lg font-medium">
                    <span>Total Amount</span>
                    <span>₹{calculateTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  icon={Check}
                  onClick={handleSubmit}
                  disabled={isSubmitting || !description || items.length === 0}
                >
                  {isSubmitting ? 'Saving...' : 'Save Expense'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UnequalSplitting;