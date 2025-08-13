import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, CheckCircle, Clock, AlertCircle, BarChart3 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      const data = await response.json();
      if (data.success) setTasks(data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return alert('Title is required');

    const url = editingTask ? `${API_BASE}/tasks/${editingTask.id}` : `${API_BASE}/tasks`;
    const method = editingTask ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        fetchTasks();
        fetchStats();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) { fetchTasks(); fetchStats(); }
    } catch (error) { console.error(error); }
  };

  const updateTaskStatus = async (task, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: newStatus })
      });
      const data = await response.json();
      if (data.success) { fetchTasks(); fetchStats(); }
    } catch (error) { console.error(error); }
  };

  const openModal = (task = null) => {
    setEditingTask(task);
    setFormData(task ? { title: task.title, description: task.description, priority: task.priority, status: task.status }
                     : { title: '', description: '', priority: 'medium', status: 'pending' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({ title: '', description: '', priority: 'medium', status: 'pending' });
  };

  const filteredTasks = tasks.filter(task => filter === 'all' || task.status === filter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Task Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your projects efficiently</p>
          </div>
          <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {['total','completed','in_progress','completion_rate'].map((stat,key)=>(
            <div key={key} className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-gray-600 text-sm">{stat.replace('_',' ').toUpperCase()}</p>
              <p className="text-3xl font-bold text-gray-900">{stats[stat] || 0}{stat==='completion_rate'?'%':''}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
          <div className="flex gap-2">
            {['all','pending','in_progress','completed'].map(status => (
              <button key={status} onClick={()=>setFilter(status)}
                className={`px-4 py-2 rounded-lg ${filter===status?'bg-blue-600 text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {status.charAt(0).toUpperCase()+status.slice(1).replace('_',' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task=>(
            <div key={task.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>openModal(task)} className="p-2 text-gray-400 hover:text-blue-600"><Edit3 className="w-4 h-4"/></button>
                  <button onClick={()=>deleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{task.description}</p>
              <div className="flex gap-2">
                {task.status!=='completed' && <button onClick={()=>updateTaskStatus(task,'completed')} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg">Complete</button>}
                {task.status==='pending' && <button onClick={()=>updateTaskStatus(task,'in_progress')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg">Start</button>}
              </div>
            </div>
          ))}
          {filteredTasks.length===0 && <div className="bg-white rounded-xl shadow-sm border p-12 text-center text-gray-500">No tasks found.</div>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{editingTask?'Edit Task':'Add New Task'}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input type="text" value={formData.title} onChange={e=>setFormData({...formData,title:e.target.value})}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea value={formData.description} onChange={e=>setFormData({...formData,description:e.target.value})} rows={3} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select value={formData.priority} onChange={e=>setFormData({...formData,priority:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              {editingTask && <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select value={formData.status} onChange={e=>setFormData({...formData,status:e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>}
            </div>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingTask?'Update':'Create'} Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

