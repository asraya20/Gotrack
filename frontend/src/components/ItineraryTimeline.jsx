import React, { useState, useMemo } from 'react';
import axios from 'axios';
import EditItemModal from './EditItemModal';

const ItineraryTimeline = ({ trip, onUpdate }) => {
  const [itemType, setItemType] = useState('ACTIVITY');
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const tripDates = useMemo(() => {
    if (!trip || !trip.start_date || !trip.end_date) return [];
    const dates = [];
    let currentDate = new Date(trip.start_date);
    currentDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(trip.end_date);
    endDate.setUTCHours(0, 0, 0, 0);
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }, [trip]);

  const itemsByDate = useMemo(() => {
    if (!trip || !trip.itinerary_items) return {};
    const grouped = {};
    tripDates.forEach(date => grouped[date] = []);
    trip.itinerary_items.forEach(item => {
      const itemDate = item.start_time_utc.split('T')[0];
      if (grouped[itemDate]) {
        grouped[itemDate].push(item);
      }
    });
    for (const date in grouped) {
        grouped[date].sort((a, b) => new Date(a.start_time_utc) - new Date(b.start_time_utc));
    }
    return grouped;
  }, [trip, tripDates]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!title || !startTime) return;
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Token ${token}` } };
    const newItemData = { trip: trip.id, item_type: itemType, title, start_time_utc: new Date(startTime).toISOString() };
    try {
      await axios.post('http://127.0.0.1:8000/api/itinerary-items/', newItemData, config);
      onUpdate();
      setTitle('');
      setStartTime('');
    } catch (error) { console.error('Failed to add itinerary item:', error.response.data); }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Token ${token}` } };
      try {
        await axios.delete(`http://127.0.0.1:8000/api/itinerary-items/${itemId}/`, config);
        onUpdate();
      } catch (error) { console.error('Failed to delete item:', error.response.data); }
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (itemId, updatedData) => {
    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Token ${token}` } };
    try {
      await axios.put(`http://127.0.0.1:8000/api/itinerary-items/${itemId}/`, { trip: trip.id, ...updatedData }, config);
      onUpdate();
      setIsEditModalOpen(false);
      setEditingItem(null);
    } catch (error) { console.error('Failed to update item:', error.response.data); }
  };

  const containerStyle = { fontFamily: "'Segoe UI', Tahoma, sans-serif", border: '1px solid #e0e0e0', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' };
  const dayBlockStyle = { marginBottom: '30px' };
  const dayHeaderStyle = { color: '#283618', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' };
  const itemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderLeft: '3px solid #606c38', marginLeft: '10px', marginTop: '15px', backgroundColor: '#f9f9f9', borderRadius: '0 8px 8px 0', color: '#283618' };
  const formStyle = { marginTop: '20px', borderTop: '2px solid #f0f0f0', paddingTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' };
  const inputStyle = { flex: '1 1 150px', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', color: '#283618' };
  const buttonStyle = { padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(45deg, #283618, #606c38)', color: '#fefae0', cursor: 'pointer', fontWeight: 'bold' };
  const iconButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '5px' };

  return (
    <>
      <EditItemModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} item={editingItem} onItemUpdated={handleUpdateItem} />
      <div style={containerStyle}>
        <h2 style={{ marginTop: 0, color: '#283618' }}>Itinerary Timeline</h2>
        {Object.entries(itemsByDate).map(([date, items]) => (
          <div key={date} style={dayBlockStyle}>
            <h3 style={dayHeaderStyle}>{new Date(date + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}</h3>
            {items.length > 0 ? (
              items.map(item => (
                <div key={item.id} style={itemStyle}>
                  <div>
                    <strong>{new Date(item.start_time_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> - {item.title}
                    <span style={{ marginLeft: '10px', fontSize: '0.8em', backgroundColor: '#eee', padding: '3px 6px', borderRadius: '4px', color: '#606c38' }}>{item.item_type}</span>
                  </div>
                  <div>
                    <button onClick={() => handleOpenEditModal(item)} style={iconButtonStyle}>✏️</button>
                    <button onClick={() => handleDeleteItem(item.id)} style={iconButtonStyle}>🗑️</button>
                  </div>
                </div>
              ))
            ) : <p style={{ marginLeft: '10px', color: '#606c38' }}>No plans for this day yet.</p>}
          </div>
        ))}
        <div>
          <h3 style={{marginTop: '30px', color: '#283618'}}>Add to Itinerary</h3>
          <form onSubmit={handleAddItem} style={formStyle}>
              <select value={itemType} onChange={e => setItemType(e.target.value)} style={inputStyle}>
                  <option value="ACTIVITY">Activity</option>
                  <option value="TRANSPORT">Transport</option>
                  <option value="ACCOMMODATION">Accommodation</option>
              </select>
              {/* --- THIS IS THE FIX --- */}
              <input type="text" placeholder="Title (e.g., Visit a place)" value={title} onChange={e => setTitle(e.target.value)} style={{...inputStyle, flex: '2 1 300px'}} required/>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputStyle} required/>
              <button type="submit" style={buttonStyle}>+ Add Plan</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ItineraryTimeline;