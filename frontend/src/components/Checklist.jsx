import React, { useState } from 'react';
import axios from 'axios';

const Checklist = ({ tripId, initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Token ${token}` } };
    const taskData = { trip: tripId, task_description: newTask, is_completed: false };
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/checklists/', taskData, config);
      setTasks([...tasks, res.data]);
      setNewTask('');
    } catch (error) {
      console.error('Failed to add task:', error.response.data);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Token ${token}` } };
    const patchData = { is_completed: !currentStatus };
    try {
      const res = await axios.patch(`http://127.0.0.1:8000/api/checklists/${taskId}/`, patchData, config);
      setTasks(tasks.map(task => (task.id === taskId ? res.data : task)));
    } catch (error) {
      console.error('Failed to update task:', error.response.data);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Token ${token}` } };
      try {
        await axios.delete(`http://127.0.0.1:8000/api/checklists/${taskId}/`, config);
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Failed to delete task:', error.response.data);
      }
    }
  };

  const containerStyle = { fontFamily: "'Segoe UI', Tahoma, sans-serif", border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', marginBottom: '30px' };
  const taskItemStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' };
  const formStyle = { marginTop: '20px', display: 'flex', gap: '10px' };
  const inputStyle = { flex: '1', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', color: '#283618' };
  const buttonStyle = { padding: '10px 15px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--earth-yellow)', color: 'var(--pakistan-green)', cursor: 'pointer', fontWeight: 'bold' };
  const iconButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginTop: 0, borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#283618' }}>Pre-Trip Checklist</h2>
      <div>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} style={taskItemStyle}>
              <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={() => handleToggleTask(task.id, task.is_completed)}>
                  <input type="checkbox" checked={task.is_completed} readOnly style={{ marginRight: '10px', transform: 'scale(1.2)' }} />
                  <span style={{ textDecoration: task.is_completed ? 'line-through' : 'none', color: task.is_completed ? '#aaa' : '#283618' }}>
                    {task.task_description}
                  </span>
              </div>
              <button onClick={() => handleDeleteTask(task.id)} style={iconButtonStyle}>🗑️</button>
            </div>
          ))
        ) : (
          <p style={{color: '#606c38'}}>No tasks on your checklist yet.</p>
        )}
      </div>
      <form onSubmit={handleAddTask} style={formStyle}>
        <input type="text" placeholder="Add a task..." value={newTask} onChange={e => setNewTask(e.target.value)} style={inputStyle} />
        <button type="submit" style={buttonStyle}>+ Add</button>
      </form>
    </div>
  );
};

export default Checklist;