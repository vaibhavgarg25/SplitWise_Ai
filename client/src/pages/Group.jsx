import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Search, X, UserPlus, Settings,
  Trash2, ArrowRight, Receipt, DollarSign, Calendar,
  Share2, Wallet
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Navbar2 from '../components/Navbar2';
import { useAuth } from '../context/Context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [users, setUsers] = useState([]);
  const [searchMember, setSearchMember] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [user, setUser] = useState({ _id: '', username: '', email: '' });
  const [groups, setGroups] = useState([]);
  const [members, setmember] = useState([])
  const { AuthorizationToken } = useAuth()
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const response = await fetch("https://splitwiseai-production.up.railway.app/routes/user", {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      // console.log(data)
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error.message);
    }
  };

  const fetchGroups = async () => {
    if (!user?._id) return; // Ensure user is set before calling API

    try {
      const response = await fetch(
        `https://splitwiseai-production.up.railway.app/routes/getgroups/${user._id}`,
        {
          method: "GET",
          headers: {
            Authorization: AuthorizationToken,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch groups");

      const data = await response.json();
      // console.log(data)
      setGroups(data)
    } catch (error) {
      console.error("Error fetching groups:", error.message);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch("https://splitwiseai-production.up.railway.app/routes/users", {
        method: "GET",
        headers: {
          Authorization: AuthorizationToken,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch members");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching members:", error.message);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchMembers();
      fetchGroups();
    }
  }, [user]);

  const searchResults = users.filter(member =>
    member.username.toLowerCase().includes(searchMember.toLowerCase())
    //  console.log(member.username)

  );

  const handleCreateGroup = async () => {
    if (newGroup.name && selectedMembers.length > 0) {
      const newGroupData = {
        name: newGroup.name,
        description: newGroup.description,
        members: selectedMembers,
        // createdAt: new Date().toISOString(),
        // expenses: []
      };
      try {
        const response = await fetch('https://splitwiseai-production.up.railway.app/routes/creategroup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: AuthorizationToken,
          },
          body: JSON.stringify(newGroupData),
        })
        if (response.ok) {
          toast.success("created successfully")
          fetchGroups()
          setGroups([newGroupData, ...groups]);
          setShowCreateModal(false);
          setNewGroup({ name: '', description: '' });
          setSelectedMembers([]);
        }
        else {
          toast.error("creation unsuccessfull")
        }
      } catch (error) {

      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://splitwiseai-production.up.railway.app/routes/deletegroup/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: AuthorizationToken
        }
      })
      const data = await response.json()
      // console.log(data)
      if (response.ok) {
        fetchGroups()
        toast.success("group deleted successfully")
      }
    } catch (error) {
      console.log(error)
    }
  }

  

  return (
    <div className='flex'>
      <div className="nav">
        <Navbar2 />
      </div>
      <div className="space-y-6 w-screen   ml-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
            <p className="dark:text-black text-2xl">Manage your expense sharing groups</p>
          </div>
          <Button variant="primary" className="mr-5 mt-2" icon={Plus} onClick={() => setShowCreateModal(true)}>
            Create Group
          </Button>
        </div>

        <div className="relative right-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <Card
              key={group._id}
              className={`hover:shadow-lg hover:border-indigo-700 transition-all duration-200 cursor-pointer ${selectedGroup?._id === group._id ? 'ring-2 ring-indigo-500' : ''}`}
              onClick={() => {
                setSelectedGroup(group);
                navigate(`/groups/${group._id}`); // Navigate to GroupDetails
              }}
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-black">{group.groupname}</h3>
                    <p className="text-lg text-gray-500 dark:text-gray-900">{group.groupdesc}</p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      handleDelete(group._id);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {users
                      .filter(user => group.members.includes(user._id))
                      .map(user => (
                        <img
                          key={user._id}
                          className="w-8 h-8 rounded-full border-2 border-white"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`}
                          alt={user.username}
                          title={user.username}
                        />
                      ))}
                  </div>
                  <div className="flex items-center text-indigo-600">
                    <span>₹{group.totalBalance?.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>


        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Group">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Group Name</label>
              <input
                type="text"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Enter group name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Add Members</label>
              <div className="mt-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="block w-full pl-10 rounded-md border border-gray-300 px-3 py-2"
                  placeholder="Search by name or email"
                />
              </div>

              {selectedMembers.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedMembers.map(member => (
                    <div key={member._id} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-600">
                      <span>{member.username}</span>
                      <button onClick={() => setSelectedMembers(members => members.filter(m => m._id !== member._id))}>
                        <X className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {searchMember && (
                <div className="mt-2 absolute z-10 w-full bg-white rounded-md shadow-lg border border-gray-200">
                  {searchResults.map(member => (
                    <button
                      key={member._id}
                      onClick={() => {
                        if (!selectedMembers.find(m => m._id === member._id)) {
                          setSelectedMembers([...selectedMembers, member]);
                        }
                        setSearchMember('');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                    >
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.username)}&background=random`}
                        alt={member.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium">{member.username}</div>
                        <div className="text-sm text-gray-500">{member.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handleCreateGroup}
                disabled={!newGroup.name || selectedMembers.length === 0}
              >
                Create Group
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>

  );
};

export default Groups;