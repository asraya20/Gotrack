import React, { useState } from 'react';
import axios from 'axios';
import EditExpenseModal from './EditExpenseModal';

const ExpenseTracker = ({ tripId, initialExpenses = [] }) => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food'); // This will now be the default in our dropdown
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Token ${token}` } };
    const newExpense = { trip: tripId, description, amount: parseFloat(amount), category, expense_date: new Date().toISOString().split('T')[0] };
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/expenses/', newExpense, config);
      setExpenses([...expenses, res.data]);
      setDescription('');
      setAmount('');
      setCategory('Food'); // Reset category to default after adding
    } catch (error) {
      console.error('Failed to add expense:', error.response.data);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Token ${token}` } };
      try {
        await axios.delete(`http://127.0.0.1:8000/api/expenses/${expenseId}/`, config);
        setExpenses(expenses.filter(exp => exp.id !== expenseId));
      } catch (error) {
        console.error('Failed to delete expense:', error.response.data);
      }
    }
  };

  const handleOpenEditModal = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleUpdateExpense = async (expenseId, updatedData) => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Token ${token}` } };
    try {
        const res = await axios.put(`http://127.0.0.1:8000/api/expenses/${expenseId}/`, { ...editingExpense, ...updatedData }, config);
        setExpenses(expenses.map(exp => (exp.id === expenseId ? res.data : exp)));
        setIsEditModalOpen(false);
        setEditingExpense(null);
    } catch (error) {
        console.error('Failed to update expense:', error.response.data);
    }
  };

  const containerStyle = { fontFamily: "'Segoe UI', Tahoma, sans-serif", border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', marginBottom: '30px' };
  const expenseItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0', color: '#283618' };
  const formStyle = { marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }; // Added flexWrap
  const inputStyle = { flex: '1 1 120px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', color: '#283618' }; // Adjusted flex basis
  const buttonStyle = { padding: '10px 15px', borderRadius: '8px', border: 'none', backgroundColor: 'var(--earth-yellow)', color: 'var(--pakistan-green)', cursor: 'pointer', fontWeight: 'bold' };
  const iconButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };

  return (
    <>
      <EditExpenseModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} expense={editingExpense} onExpenseUpdated={handleUpdateExpense} />
      <div style={containerStyle}>
        <h2 style={{ marginTop: 0, borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#283618' }}>Expense Tracker</h2>
        <div>
          {expenses.length > 0 ? (
            expenses.map(exp => (
              <div key={exp.id} style={expenseItemStyle}>
                <div>
                  <span>{exp.description} <span style={{color: '#606c38'}}>({exp.category})</span></span>
                  <br />
                  <strong style={{color: 'var(--tigers-eye)'}}>₹{exp.amount}</strong>
                </div>
                <div>
                  <button onClick={() => handleOpenEditModal(exp)} style={iconButtonStyle}>✏️</button>
                  <button onClick={() => handleDeleteExpense(exp.id)} style={iconButtonStyle}>🗑️</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{color: '#606c38'}}>No expenses logged for this trip yet.</p>
          )}
        </div>
        <form onSubmit={handleAddExpense} style={formStyle}>
          <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{...inputStyle, flex: '2 1 200px'}} />
          <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
          {/* --- THIS IS THE NEW DROPDOWN --- */}
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Shopping">Shopping</option>
            <option value="Activity">Activity</option>
            <option value="Other">Other</option>
          </select>
          <button type="submit" style={buttonStyle}>+ Add</button>
        </form>
      </div>
    </>
  );
};

export default ExpenseTracker;