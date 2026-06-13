import React, { useState, useEffect } from 'react';

const EditItemModal = ({ isOpen, onClose, item, onItemUpdated }) => {
  const [formData, setFormData] = useState({ title: '', start_time_utc: '', item_type: 'ACTIVITY' });

  useEffect(() => {
    if (item) {
      // Format the date for the datetime-local input, which needs 'YYYY-MM-DDTHH:mm'
      const formattedDateTime = item.start_time_utc ? new Date(item.start_time_utc).toISOString().slice(0, 16) : '';
      setFormData({
        title: item.title,
        start_time_utc: formattedDateTime,
        item_type: item.item_type,
      });
    }
  }, [item]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert back to ISO string format for the API
    const payload = {
        ...formData,
        start_time_utc: new Date(formData.start_time_utc).toISOString()
    };
    onItemUpdated(item.id, payload);
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
        <h2 style={{marginTop: 0}}>Edit Itinerary Item</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={formData.title} onChange={onChange} style={inputStyle} required />
          <input type="datetime-local" name="start_time_utc" value={formData.start_time_utc} onChange={onChange} style={inputStyle} required />
          <select name="item_type" value={formData.item_type} onChange={onChange} style={inputStyle}>
            <option value="ACTIVITY">Activity</option>
            <option value="TRANSPORT">Transport</option>
            <option value="ACCOMMODATION">Accommodation</option>
          </select>
          <div style={buttonContainerStyle}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>Cancel</button>
            <button type="submit" style={createButtonStyle}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemModal;