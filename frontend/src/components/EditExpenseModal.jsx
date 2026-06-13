import React, { useState, useEffect } from 'react';

const EditExpenseModal = ({ isOpen, onClose, expense, onExpenseUpdated }) => {
  const [formData, setFormData] = useState({ description: '', amount: '', category: 'Food' });

  // When the modal opens, pre-fill the form with the expense data
  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
      });
    }
  }, [expense]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onExpenseUpdated(expense.id, formData);
  };

  if (!isOpen) return null;

  // --- Styles ---
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
  const modalContentStyle = { backgroundColor: 'var(--cornsilk)', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', color: 'var(--pakistan-green)' };
  const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' };
  const buttonContainerStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' };
  const buttonStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' };
  const createButtonStyle = { ...buttonStyle, backgroundColor: 'var(--dark-moss-green)', color: 'var(--cornsilk)' };
  const cancelButtonStyle = { ...buttonStyle, backgroundColor: '#6c757d', color: 'white' };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{marginTop: 0}}>Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="description" value={formData.description} onChange={onChange} style={inputStyle} required />
          <input type="number" name="amount" value={formData.amount} onChange={onChange} style={inputStyle} required />
          <input type="text" name="category" value={formData.category} onChange={onChange} style={inputStyle} required />
          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={createButtonStyle}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;